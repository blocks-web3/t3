/** @jsxImportSource @emotion/react */
import { css, Global } from "@emotion/react";
import emotionReset from "emotion-reset";
import { useContext } from "react";
import "./App.css";
import { SessionContext } from "./auth/AuthContextProvider";
import Default from "./views/layout/LayoutBase";

function App() {
  const [session] = useContext(SessionContext);

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
      {JSON.stringify(session.userId)}
    </div>
  );
}

export default App;
