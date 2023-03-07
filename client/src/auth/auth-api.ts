import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
  GetIdCommand,
} from "@aws-sdk/client-cognito-identity";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { getAddress } from "../wallet/wallet-util";
import { CognitoIdToken, Session, StsCredentials } from "./AuthContextProvider";

type GrantType = "authorization_code" | "refresh_token";

type TokenResponse = {
  data: {
    id_token: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
};

export class CognitoAuthApi {
  private static COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
  private static COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
  private static COGNITO_REDIRECT_URL = import.meta.env
    .VITE_COGNITO_REDIRECT_URL;

  private static cognitoidentity = new CognitoIdentityClient({
    region: import.meta.env.VITE_REGION,
  });

  /**
   * 認証エンドポイントのURLを返す<br>
   *
   * @returns 認証エンドポイントのURL
   */
  static authorizeUrl(): string {
    const url = new URL("/oauth2/authorize", this.COGNITO_DOMAIN);
    url.search = new URLSearchParams({
      client_id: this.COGNITO_CLIENT_ID,
      response_type: "code",
      scope: "openid",
      redirect_url: this.COGNITO_REDIRECT_URL,
    }).toString();
    return url.href;
  }

  /**
   * ログアウトエンドポイントのURLを返す<br>
   *
   * @returns ログアウトエンドポイントのURL
   */
  static logoutUrl(): string {
    const url = new URL("/logout", this.COGNITO_DOMAIN);
    url.search = new URLSearchParams({
      client_id: this.COGNITO_CLIENT_ID,
      logout_uri: this.COGNITO_REDIRECT_URL,
    }).toString();
    return url.href;
  }

  /**
   * IdToken/AccessTokenの取得を行う
   *
   * @param grantType authorization_code/refresh_token
   * @param code grantType=authorization_codeの場合に必須
   * @param refreshToken grantType=refresh_tokenの場合に必須
   * @returns TokenEndpointのレスポンス
   */
  private static async postTokenEndpoint(
    grantType: GrantType,
    code?: string,
    refreshToken?: string
  ): Promise<TokenResponse> {
    const url = new URL("oauth2/token", this.COGNITO_DOMAIN);
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const param = {
      grant_type: grantType,
      client_id: this.COGNITO_CLIENT_ID,
      redirect_uri: this.COGNITO_REDIRECT_URL,
    };
    if (code) Object.assign(param, { code: code });
    if (refreshToken) Object.assign(param, { refresh_token: refreshToken });
    const requestBody = new URLSearchParams(param);
    return (await axios.post(url.href, requestBody, {
      headers,
    })) as TokenResponse;
  }

  static async initiateSession(code: string): Promise<Session> {
    const cognitoToken = await this.postTokenEndpoint(
      "authorization_code",
      code
    );
    const credentials = await this.getStsCredential(cognitoToken.data.id_token);
    return this.createSession(
      cognitoToken,
      cognitoToken.data.refresh_token,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      credentials!
    );
  }

  static async refreshSession(refreshToken: string): Promise<Session> {
    const cognitoToken = await this.postTokenEndpoint(
      "refresh_token",
      undefined,
      refreshToken
    );
    const credentials = await this.getStsCredential(cognitoToken.data.id_token);
    return this.createSession(cognitoToken, refreshToken, credentials);
  }

  private static async createSession(
    tokenResponse: TokenResponse,
    refreshToken: string,
    credentials: StsCredentials
  ): Promise<Session> {
    const decodedToken = jwt_decode<CognitoIdToken>(
      tokenResponse.data.id_token
    );
    const userIdWithDomain = decodedToken["identities"][0].userId;
    // userId = XXXX@SimplexInc918.onmicrosoft.com
    const userId = userIdWithDomain.split("@")[0];
    const address = await getAddress(userId, credentials);
    return {
      userId,
      userIdWithDomain,
      userName: decodedToken["custom:displayname"],
      address,
      token: {
        idToken: tokenResponse.data.id_token,
        accessToken: tokenResponse.data.access_token,
        refreshToken: refreshToken,
        decodedIdToken: decodedToken,
      },
      credentials,
    };
  }

  static async getStsCredential(idToken: string): Promise<StsCredentials> {
    // const Logins = {
    //   "cognito-idp.{region}.amazonaws.com/{userpool-id}":
    //     idToken,
    // };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Logins = {} as any;
    Logins[import.meta.env.VITE_COGNITO_IDP_KEY] = idToken;
    const getIdCommand = new GetIdCommand({
      IdentityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
      Logins,
    });
    const result1 = await this.cognitoidentity.send(getIdCommand);
    // const id = await this.cognitoidentity.getId(param).promise();

    const getCredentialsForIdentityCommand =
      new GetCredentialsForIdentityCommand({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        IdentityId: result1.IdentityId!,
        Logins,
      });
    const result2 = await this.cognitoidentity.send(
      getCredentialsForIdentityCommand
    );
    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      accessKeyId: result2.Credentials!.AccessKeyId!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      secretAccessKey: result2.Credentials!.SecretKey!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      sessionToken: result2.Credentials!.SessionToken!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expiration: result2.Credentials!.Expiration!,
    };
  }
}
