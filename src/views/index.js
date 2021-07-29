import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppLayout from "layouts/app-layout";
import AuthLayout from 'layouts/auth-layout';
import AppLocale from "lang";
import { IntlProvider } from "react-intl";
import { ConfigProvider } from 'antd';
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from 'configs/AppConfig'
import useBodyClass from 'hooks/useBodyClass';
import PrivateRoute from "authentication/PrivateRoute";
import AuthAppWithGithubCallback from "@amp-components/VersionControl/AuthAppWithGithubCallback";


export const Views = (props) => {
  const { locale, location, direction } = props;
  const currentAppLocale = AppLocale[locale];
  useBodyClass(`dir-${direction}`);
  return (
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}>
      <ConfigProvider locale={currentAppLocale.antd} direction={direction}>
        <Switch>
          <PrivateRoute
            exact
            path="/github-auth-app/callback/:application"
            component={AuthAppWithGithubCallback}
          />
          <PrivateRoute exact path="/">
            <Redirect to={APP_PREFIX_PATH} />
          </PrivateRoute>
          <Route path={AUTH_PREFIX_PATH}>
            <AuthLayout direction={direction} />
          </Route>
          <PrivateRoute path={APP_PREFIX_PATH}>
            <AppLayout direction={direction} location={location}/>
          </PrivateRoute>
          
        </Switch>
      </ConfigProvider>
    </IntlProvider>
  )
}

const mapStateToProps = ({ theme, auth }) => {
  const { locale, direction } =  theme;
  const { token } = auth;
  return { locale, token, direction }
};

export default withRouter(connect(mapStateToProps)(Views));