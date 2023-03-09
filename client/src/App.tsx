/** @jsxImportSource @emotion/react */
import { css, Global } from "@emotion/react";
import { createTheme, ThemeProvider } from "@mui/material";
import emotionReset from "emotion-reset";
import { useContext } from "react";
import "./App.css";
import { SessionContext } from "./auth/AuthContextProvider";
import LayoutBase from "./views/layout/LayoutBase";

function App() {
  const [session] = useContext(SessionContext);

  const {
    typography: { pxToRem },
  } = createTheme();
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#3f51b5",
        light: "#6573c3",
        dark: "#2c387e",
      },
      secondary: {
        main: "#ff3d00",
        light: "#ff6333",
        dark: "#b22a00",
      },
    },
    typography: {
      h1: { fontSize: pxToRem(60) },
      h2: { fontSize: pxToRem(48) },
      h3: { fontSize: pxToRem(42) },
      h4: { fontSize: pxToRem(36) },
      h5: { fontSize: pxToRem(20) },
      h6: { fontSize: pxToRem(18) },
      subtitle1: { fontSize: pxToRem(18) },
      body1: { fontSize: pxToRem(16) },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <SessionContext.Provider value={[session]}>
        <div className="App">
          <Global
            styles={css`
              ${emotionReset}

              *, *::after, *::before {
                box-sizing: border-box;
                -moz-osx-font-smoothing: grayscale;
                -webkit-font-smoothing: antialiased;
              }
              body {
                margin: 0;
                padding: 0;
              }
              a {
                text-decoration: none;
                :visited,
                :link {
                  color: inherit;
                }
              }
              #root {
                margin: 0;
                padding: 0;
                max-width: none;
              }
            `}
          />
          <LayoutBase />
        </div>
      </SessionContext.Provider>
    </ThemeProvider>
  );
}

export default App;
