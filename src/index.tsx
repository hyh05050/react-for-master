import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import App from "./App";

const darkTheme = {
  textColor: "whitesmoke",
  backgroundColor: "#111",
  //borderColor,linkColor, hoverColor...
};

const lightTheme = {
  textColor: "#111",
  backgroundColor: "whitesmoke",
  //borderColor,linkColor, hoverColor...
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.Fragment>
    <ThemeProvider theme={darkTheme}>
      <App />
    </ThemeProvider>
  </React.Fragment>
);
