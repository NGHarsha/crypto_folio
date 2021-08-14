import React from "react";
import "./App.css";
import CoinList from "./components/CoinList";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import Signout from "./components/Auth/Signout";
import Portfolio from "./components/Portfolio";
import Navigation from "./components/Navigation";
import NotFound from "./components/NotFound";
import CoinInfo from "./components/CoinInfo";

import { ToastContainer } from "react-toastify";

import WebsocketTest from "./components/WebsocketTest";

function App(props) {
  // const theme = React.useMemo(() =>
  //   createTheme({
  //     palette: {
  //       background: {
  //         default: "#000000",
  //       },
  //       label: {
  //         root: "e2e2e2",
  //       },
  //     },
  //   })
  // );
  const theme = createTheme({
    palette: {
      type: "dark",
    },
  });
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer position="top-center" />
        <Router>
          <Switch>
            <Route exact path="/signin">
              <Signin />
            </Route>
            <Route exact path="/signup">
              <Signup />
            </Route>
            <Route exact path="/signout">
              <Signout />
            </Route>

            <>
              <Navigation />
              <Route exact path="/coin/:coinid" component={CoinInfo} />
              <Route exact path="/">
                <CoinList />
              </Route>
              <Route exact path="/portfolio">
                <Portfolio />
              </Route>
            </>
          </Switch>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
