import { JwtPayload } from "jwt-decode";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CognitoAuthApi } from "./auth-api";

export type Session = {
  userId: string;
  userIdWithDomain: string;
  userName: string;
  address: string;
  // 認証トークン(Cognito  User Poolから取得)
  token: {
    decodedIdToken: CognitoIdToken;
    idToken: string;
    accessToken: string;
    refreshToken: string;
  };
  // AWSリソースのSTSトークン(Cognito ID Poolから取得)
  credentials: StsCredentials;
};

export type StsCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
  expiration: Date;
  sessionToken: string;
};
export interface CognitoIdToken extends JwtPayload {
  jwt: string;
  exp: number;
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

// 認証情報と認証情報セットのContext
export const SessionContext = React.createContext<[Session | null]>([null]);

/**
 * コンテキストのProvider
 */
export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(getDefaultSession());
  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get("code");

  const initiateSession = useCallback(
    async (code: string) => {
      try {
        const session = await CognitoAuthApi.initiateSession(code);
        initSession(session);
      } finally {
        setSearchParams({});
      }
    },
    [setSearchParams]
  );

  const refreshSession = useCallback(async (refreshToken: string) => {
    try {
      const session = await CognitoAuthApi.refreshSession(refreshToken);
      initSession(session);
    } catch (error) {
      initSession(null);
      throw error;
    }
  }, []);

  // sessionのバリデーション
  useEffect(() => {
    // sessionに正しく値がセットされているかどうかをチェック
    console.log(
      `check session. code:${code}, session.userId:${JSON.stringify(
        session?.userId
      )}`
    );
    if (code) {
      initiateSession(code);
    } else if (!session) {
      location.assign(CognitoAuthApi.authorizeUrl());
    } else if (isExpired(session)) {
      refreshSession(session.token.refreshToken);
    }
  }, [code, initiateSession, refreshSession, session]);

  function initSession(session: Session | null) {
    console.log(`init session.session.userId:${JSON.stringify(session)}`);

    setSession(session);
    setAutoInfoToLocalStorage(session);
  }

  return (
    <SessionContext.Provider value={[session]}>
      {children}
    </SessionContext.Provider>
  );
};

export function clearSession() {
  setAutoInfoToLocalStorage(null);
}

/**
 * デフォルトのSessionを取得
 * ローカルストレージから取得できた場合はその値をパース
 * 取得できない場合は空の情報を返す
 * @returns
 */
function getDefaultSession(): Session | null {
  const defaultSession = window.localStorage.getItem("session");
  if (defaultSession) {
    return JSON.parse(defaultSession) as Session;
  } else {
    return null;
  }
}

/**
 * 認証情報をローカルストレージに追加
 * @param session
 */
function setAutoInfoToLocalStorage(session: Session | null): void {
  const sessionStringify = JSON.stringify(session);
  window.localStorage.setItem("session", sessionStringify);
}

/**
 *Sessionの有効期限が切れていればTrue。
 * @param session セッション
 */
function isExpired(session: Session): boolean {
  const now = Date.now();
  return (
    session.token.decodedIdToken.exp < now / 1000 ||
    session.credentials.expiration < new Date(now)
  );
}
