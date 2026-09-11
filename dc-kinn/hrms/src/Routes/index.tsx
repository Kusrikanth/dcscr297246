import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { shallowEqual } from "react-redux";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../hooks/storehook";
//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";
import PublicAuthLayout from "../Layouts/PublicAuthLayout";
import BlankLayoutAuth from "../Layouts/BlankLayoutAuth";
//routes
import {
  authProtectedRoutes,
  authProtectedBlankLayout,
  authRoutesBlankLayout,
  publicRoutes,
  authRoutes,
  authRoutesV1,
} from "./allRoutes";
import {
  AccessRoute,
  RegistrationAuthRoute,
  PrivateRoutes,
} from "./AuthProtected";
import { accessTokenKey } from "../Components/constants/storageconstants";
import Fallback from "../Components/Common/FallbackUI";
import DelayedRender from "../Components/Common/DelayRendererUI";
import NotFoundPage from "../pages/NotFound";
import { getLocalStorage } from "../utility/storageUtility";
import PublicAuthLayoutV1 from "../Layouts/PublicAuthLayoutV1";
// const adminRoles = ['Branch_Admin', 'Institute_Admin', 'ADM_CONS', 'ACCOUNT', 'PARENT'];
const Index = () => {
  const availablePublicRoutesPaths = publicRoutes.map((r: any) => r.path);
  const availableAuthRoutesPath = authProtectedRoutes.map((r: any) => r.path);
  const authRoutesPath = authRoutes.map((r: any) => r.path);
  const authRoutesV1Path = authRoutesV1.map((r: any) => r.path);
  const authBlankPathRoute = authRoutesBlankLayout.map((r: any) => r.path);
  const authProtectedBlankRoutesPaths = authProtectedBlankLayout.map(
    (r: any) => r.path
  );
  const tokenKey = getLocalStorage(accessTokenKey);
  const { loggedInUserRole, isUserAuthenticated, virtualRoleResp } =
    useAppSelector(
      ({ appData }) => ({
        loggedInUserRole: appData.loggedInUserRole,
        isUserAuthenticated: appData.isUserAuthenticated,
        virtualRoleResp: appData.virtualRoleResp,
      }),
      shallowEqual
    );

  return (
    <React.Fragment>
      <Switch>
        <Route path={availablePublicRoutesPaths}>
          <NonAuthLayout>
            <Suspense
              fallback={
                <DelayedRender delay={500}>
                  <Fallback />
                </DelayedRender>
              }
            >
              <Switch>
                {publicRoutes.map((route, idx) => (
                  <Route
                    path={route.path}
                    component={route.component}
                    key={idx}
                    exact={true}
                  />
                ))}
              </Switch>
            </Suspense>
          </NonAuthLayout>
        </Route>
        <Route path={authRoutesPath}>
          <PublicAuthLayout>
            <Suspense
              fallback={
                <DelayedRender delay={500}>
                  <Fallback />
                </DelayedRender>
              }
            >
              <Switch>
                {authRoutes.map((route, idx) => (
                  <Route
                    path={route.path}
                    component={route.component}
                    key={idx}
                    exact={true}
                  />
                ))}
              </Switch>
            </Suspense>
          </PublicAuthLayout>
        </Route>
        <Route path={authRoutesV1Path}>
          <PublicAuthLayoutV1>
            <Suspense
              fallback={
                <DelayedRender delay={500}>
                  <Fallback />
                </DelayedRender>
              }
            >
              <Switch>
                {authRoutesV1.map((route, idx) => (
                  <Route
                    path={route.path}
                    component={route.component}
                    key={idx}
                    exact={true}
                  />
                ))}
              </Switch>
            </Suspense>
          </PublicAuthLayoutV1>
        </Route>
        <Route path={authBlankPathRoute}>
          <BlankLayoutAuth>
            <Suspense
              fallback={
                <DelayedRender delay={500}>
                  <Fallback />
                </DelayedRender>
              }
            >
              <Switch>
                {authRoutesBlankLayout.map((route, idx) => (
                  <RegistrationAuthRoute
                    isUserAuthenticated={isUserAuthenticated}
                    tokenKey={tokenKey}
                    currentUserRole={loggedInUserRole}
                    path={route.path}
                    component={route.component}
                    key={idx}
                    exact={true}
                  />
                ))}
              </Switch>
            </Suspense>
          </BlankLayoutAuth>
        </Route>
        <Route path={availableAuthRoutesPath}>
          <VerticalLayout>
            <Suspense
              fallback={
                <DelayedRender delay={500}>
                  <Fallback />
                </DelayedRender>
              }
            >
              <Switch>
                {authProtectedRoutes.map((route: any, idx: any) => (
                  <PrivateRoutes
                    isUserAuthenticated={isUserAuthenticated}
                    tokenKey={tokenKey}
                    allowedRoles={route.allowedRoles}
                    currentUserRole={loggedInUserRole}
                    virtualRole={virtualRoleResp}
                    path={route.path}
                    component={route.component}
                    key={idx}
                    exact={true}
                    pageProps={route.pageProps}
                  />
                ))}
              </Switch>
            </Suspense>
          </VerticalLayout>
        </Route>

        <Route path={authProtectedBlankRoutesPaths}>
          <BlankLayoutAuth>
            <Suspense
              fallback={
                <DelayedRender delay={500}>
                  <Fallback />
                </DelayedRender>
              }
            >
              <Switch>
                {authProtectedBlankLayout.map((route: any, idx: any) => (
                  <Route
                    // isUserAuthenticated={isUserAuthenticated}
                    // tokenKey={tokenKey}
                    // allowedRoles={route.allowedRoles}
                    // currentUserRole={loggedInUserRole}
                    // virtualRole={virtualRoleResp}
                    path={route.path}
                    component={route.component}
                    key={idx}
                    exact={true}
                  />
                ))}
              </Switch>
            </Suspense>
          </BlankLayoutAuth>
        </Route>

        <Route path="/" exact={true}>
          <Redirect to="/login" />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </React.Fragment>
  );
};

export default Index;
