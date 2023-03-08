/** @jsxImportSource @emotion/react */
import { css, Global } from "@emotion/react";
import emotionReset from "emotion-reset";
import { useContext } from "react";
import "./App.css";
import { CognitoAuthApi } from "./auth/auth-api";
import { clearSession, SessionContext } from "./auth/AuthContextProvider";
import Default from "./views/layout/LayoutBase";

function App() {
  const [session] = useContext(SessionContext);

  function onLogout() {
    clearSession();
    location.assign(CognitoAuthApi.logoutUrl());
  }

  return (
    <div className="App">
      <Global
        styles={css`
          ${emotionReset}

          *, *::after, *::before {
            box-sizing: border-box;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            font-smoothing: antialiased;
          }
          body {
            margin: 0;
            padding: 0;
          }
        `}
      />
      <Default />
      <button onClick={onLogout}>logout</button>
      <p>userId:{session?.userId}</p>
      <p>address: {session?.address}</p>
    </div>
  );
}

export default App;
