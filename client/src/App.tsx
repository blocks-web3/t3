/** @jsxImportSource @emotion/react */
import { css, Global } from "@emotion/react";
import { createTheme, ThemeProvider } from "@mui/material";
import emotionReset from "emotion-reset";
import { AuthContextProvider } from "./auth/AuthContext";
import { LoadingContextProvider } from "./loading/LoadingContext";
import LayoutBase from "./views/layout/LayoutBase";

function App() {
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
      text: {
        primary: "#1e1e1e",
        secondary: "#3f51b5",
        disabled: "#d9d9d9",
      },
    },
    typography: {
      h1: { fontSize: pxToRem(48), fontWeight: 700 },
      h2: { fontSize: pxToRem(36), fontWeight: 700 },
      h3: { fontSize: pxToRem(28), fontWeight: 700 },
      h4: { fontSize: pxToRem(24), fontWeight: 700 },
      h5: { fontSize: pxToRem(20), fontWeight: 500 },
      h6: { fontSize: pxToRem(18), fontWeight: 500 },
      subtitle1: { fontSize: pxToRem(18) },
      body1: { fontSize: pxToRem(16) },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <LoadingContextProvider>
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
        </LoadingContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
