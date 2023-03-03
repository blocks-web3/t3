import React, { PropsWithChildren, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CognitoAuthApi, CognitoIdToken } from "./auth-api";

export type Session = {
  userId?: string;
  userName?: string;
  decodedIdToken?: CognitoIdToken;
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
};

// 認証情報と認証情報セットのContext
export const SessionContext = React.createContext<[Session]>([{}]);

/**
 * コンテキストのProvider
 */
export const AuthContextProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [session, setSession] = useState<Session>(getDefaultSession());
  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get("code");

  // sessionのバリデーション
  useEffect(() => {
    // sessionに正しく値がセットされているかどうかをチェック
    if (code) {
      login(code);
    } else if (!session.idToken) {
      location.assign(CognitoAuthApi.authorizeUrl());
    }
  }, [session]);

  async function login(code: string) {
    const session = await CognitoAuthApi.initiateSession(code);
    setSession(session);
    setAutoInfoToLocalStorage(session);
    setSearchParams({});
  }

  return (
    <SessionContext.Provider value={[session]}>
      {children}
    </SessionContext.Provider>
  );
};

/**
 * デフォルトのSessionを取得
 * ローカルストレージから取得できた場合はその値をパース
 * 取得できない場合は空の情報を返す
 * @returns
 */
function getDefaultSession(): Session {
  const defaultSession = window.localStorage.getItem("session");
  if (defaultSession) {
    return JSON.parse(defaultSession) as Session;
  } else {
    return {};
  }
}

/**
 * 認証情報をローカルストレージに追加
 * @param session
 */
function setAutoInfoToLocalStorage(session: Session): void {
  const sessionStringfy = JSON.stringify(session);
  window.localStorage.setItem("session", sessionStringfy);
}
