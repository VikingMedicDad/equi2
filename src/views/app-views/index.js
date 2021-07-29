import React, { lazy, Suspense } from "react";
import { Switch, Redirect } from "react-router-dom";
import Loading from 'components/shared-components/Loading';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import PrivateRoute from "authentication/PrivateRoute";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";
import useApplicationLayout from "@hooks/useApplicationLayout";
import AuthAppWithGithubCallback from "@amp-components/VersionControl/AuthAppWithGithubCallback";

export const AppViews = () => {
  
  const {
    pendingChangesContextValue,
  } = useApplicationLayout();

  return (
    <PendingChangesContext.Provider value={pendingChangesContextValue}>
    <Suspense fallback={<Loading cover="content"/>}>
      <Switch>
        <PrivateRoute
          exact
          path="/github-auth-app/callback/:application"
          component={AuthAppWithGithubCallback}
        />
        <PrivateRoute exact path={`${APP_PREFIX_PATH}/`}>
          <Redirect to={`${APP_PREFIX_PATH}/home`} />
        </PrivateRoute>
        <PrivateRoute path={`${APP_PREFIX_PATH}/home`}                            component={lazy(() => import(`./home`))} />
        <PrivateRoute path={`${APP_PREFIX_PATH}/logout`}                          component={lazy(() => import(`./logout`))} />

        <PrivateRoute path={`${APP_PREFIX_PATH}/workspaces`}                      component={lazy(() => import(`./workspaces/settings`))} />
        <PrivateRoute path={`${APP_PREFIX_PATH}/applications/overview`}           component={lazy(() => import(`./workspaces/applications/overview`))} />
        <PrivateRoute path={`${APP_PREFIX_PATH}/applications/integrations`}       component={lazy(() => import(`./workspaces/applications/integrations`))} />
        <PrivateRoute path={`${APP_PREFIX_PATH}/applications/sandbox`}            component={lazy(() => import(`./workspaces/applications/sandbox`))} />
        <PrivateRoute path={`${APP_PREFIX_PATH}/applications/deploy`}             component={lazy(() => import(`./workspaces/applications/deploy`))} />

        <PrivateRoute path={`${APP_PREFIX_PATH}/entities/content-model`}          component={lazy(() => import(`./workspaces/entities/content-model`))} />
        <PrivateRoute path={`${APP_PREFIX_PATH}/entities/schemas-analysis`}       component={lazy(() => import(`./workspaces/entities/analysis`))} />

        <PrivateRoute path={`${APP_PREFIX_PATH}/console/cli`}                     component={lazy(() => import(`./console/cli`))} />
        <PrivateRoute path={`${APP_PREFIX_PATH}/console/gql`}                     component={lazy(() => import(`./console/gql`))} />

        <PrivateRoute path={`${APP_PREFIX_PATH}/version/staging`}                 component={lazy(() => import(`./version/stage`))} />
        <PrivateRoute path={`${APP_PREFIX_PATH}/version/commits`}                 component={lazy(() => import(`./version/commit`))} />
        <PrivateRoute path={`${APP_PREFIX_PATH}/version/sync`}                    component={lazy(() => import(`./version/sync`))} />
        <PrivateRoute path={`${APP_PREFIX_PATH}/version/build-status`}            component={lazy(() => import(`./version/build`))} />

        <PrivateRoute path={`${APP_PREFIX_PATH}/settings/permissions`}            component={lazy(() => import(`./settings/permissions`))} />
        <PrivateRoute path={`${APP_PREFIX_PATH}/settings/api-tokens`}             component={lazy(() => import(`./settings/tokens`))} />
        <PrivateRoute path={`${APP_PREFIX_PATH}/settings/edit-profile`}           component={lazy(() => import(`./settings/user`))} />

        <PrivateRoute path={`${APP_PREFIX_PATH}/404`}                             component={lazy(() => import(`./errors/error-page-1`))} />
        <PrivateRoute path={`${APP_PREFIX_PATH}/server-error`}                    component={lazy(() => import(`./errors/error-page-2`))} />

        <Redirect from={`${APP_PREFIX_PATH}/applications`}                        to={`${APP_PREFIX_PATH}/applications/overview`} />
        <Redirect from={`${APP_PREFIX_PATH}/entities`}                            to={`${APP_PREFIX_PATH}/entities/content-model`} />
        <Redirect from={`${APP_PREFIX_PATH}/console`}                             to={`${APP_PREFIX_PATH}/console/cli`} />
        <Redirect from={`${APP_PREFIX_PATH}/version`}                             to={`${APP_PREFIX_PATH}/version/staging`} />
        <Redirect from={`${APP_PREFIX_PATH}/settings`}                            to={`${APP_PREFIX_PATH}/settings/edit-profile`} />
        <Redirect from={`${APP_PREFIX_PATH}`}                                     to={`${APP_PREFIX_PATH}/404`} />
        
      </Switch>
    </Suspense>
    </PendingChangesContext.Provider>
  )
}

export default React.memo(AppViews);