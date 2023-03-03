import axios from "axios";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { Session } from "./AuthContextProvider";

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

export interface CognitoIdToken extends JwtPayload {
  jwt: string;
  identities: [
    {
      userId: string;
      providerName: string;
      providerType: string;
      issuer: string;
      primary: string;
      dateCreated: string;
    }
  ];
  "cognito:groups": string[];
  "cognito:username": string;
  "custom:givenname": string;
  "custom:displayname": string;
  "custom:surname": string;
}

export class CognitoAuthApi {
  private static COGNITO_DOMAIN =
    "https://t3-login.auth.ap-northeast-1.amazoncognito.com";
  private static COGNITO_CLIENT_ID = "kjo4u77if92pir727ait80dvv";
  private static COAUTH_REDIRECT_URL = "http://localhost:5173";

  /**
   * ログインURLを返す
   *
   * @returns ログインURL
   */
  static loginUrl(): string {
    const url = new URL("/login", this.COGNITO_DOMAIN);
    url.search = new URLSearchParams({
      client_id: this.COGNITO_CLIENT_ID,
      response_type: "code",
      scope: "openid",
      redirect_url: this.COAUTH_REDIRECT_URL,
    }).toString();
    return url.href;
  }

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
      redirect_url: this.COAUTH_REDIRECT_URL,
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
  static async postTokenEndpoint(
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
      redirect_uri: this.COAUTH_REDIRECT_URL,
    };
    if (code) Object.assign(param, { code: code });
    if (refreshToken) Object.assign(param, { refresh_token: refreshToken });
    const requestBody = new URLSearchParams(param);
    return (await axios.post(url.href, requestBody, {
      headers,
    })) as TokenResponse;
  }

  static async initiateSession(code: string): Promise<Session> {
    const result = await this.postTokenEndpoint("authorization_code", code);
    return this.createSession(result);
  }

  static createSession(tokenResponse: TokenResponse): Session {
    const idToken = jwt_decode<CognitoIdToken>(tokenResponse.data.id_token);
    return {
      idToken: tokenResponse.data.id_token,
      accessToken: tokenResponse.data.access_token,
      refreshToken: tokenResponse.data.refresh_token,
      decodedIdToken: idToken,
      userId: idToken["identities"][0].userId,
      userName: idToken["custom:displayname"],
    };
  }
}
