import React, { useEffect } from "react";
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter as Router } from 'react-router-dom';
import Views from './views';
import { Route, Switch } from 'react-router-dom';
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import  NavigationTabsProvider from "@amp-components/Layout/NavigationTabsProvider";
import { THEME_CONFIG } from './configs/AppConfig';
import { track, dispatch, init as initAnalytics } from "./util/analytics";
import * as reactHotkeys from "react-hotkeys";
import { setContext } from "@apollo/client/link/context";
import { getToken, setToken } from "./authentication/authentication";
import AuthAppWithGithubCallback from "@amp-components/VersionControl/AuthAppWithGithubCallback";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";

const context = {
  source: "amplication-client",
};

const params = new URLSearchParams(window.location.search);

const token = params.get("token");
if (token) {
  setToken(token);
}

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

const themes = {
  dark: `${process.env.PUBLIC_URL}/css/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/css/light-theme.css`,
};

export const enhance = track<keyof typeof context>(
  // app-level tracking data
  context,

  {
    dispatch,
  }
);

function App() {

  useEffect(() => {
    initAnalytics();
  }, []);

  //The default behavior across all <HotKeys> components
  reactHotkeys.configure({
    //Disable simulate keypress events for the keys that do not natively emit them
    //When Enabled - events are not captured after using Enter in <textarea/>
    simulateMissingKeyPressEvents: false,
    //Clear the ignoreTags array to includes events on textarea and input
    ignoreTags: [],
  });

  return (
    <div className="App">
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <NavigationTabsProvider>
            <ThemeSwitcherProvider themeMap={themes} defaultTheme={THEME_CONFIG.currentTheme} insertionPoint="styles-insertion-point">
              <Router>
                <Switch>
                  <Route path="/" component={Views}/>
                  <Route
                    exact
                    path="/github-auth-app/callback/:application"
                    component={AuthAppWithGithubCallback}
                  />
                </Switch>
              </Router>
            </ThemeSwitcherProvider>
          </NavigationTabsProvider>
        </ApolloProvider>
      </Provider>
    </div>
  );
}

export default enhance(App);
