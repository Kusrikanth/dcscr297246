import React, { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { accessTokenKey } from "../Components/constants/storageconstants";
import { getLocalStorage } from "../utility/storageUtility";
import { useAppSelector } from "../hooks/storehook";

interface AcceesRouteProps {
  path: string,
  component: React.ElementType,
  exact: boolean
}

const AccessRoute = ({ component: Component, ...rest }: any) => {
  const tokenKey = getLocalStorage(accessTokenKey), dispatch = useDispatch(),
    { isUserAuthenticated } = useAppSelector(({ appData }) => ({
      isUserAuthenticated: appData.isUserAuthenticated
    }), shallowEqual);

  if (!isUserAuthenticated && !tokenKey) {
    if (rest?.location?.search) {
      return (
        <Redirect to={{ pathname: "/login", state: { from: `${rest.path}${rest.location.search}` } }} />
      );
    } else {
      return (
        <Redirect to={{ pathname: "/login", state: { from: rest.path } }} />
      );
    }

  }

  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};

const RegistrationAuthRoute = ({ currentUserRole = "",
  tokenKey, isUserAuthenticated,
  component: Component, ...rest }: any) => {
  if ((!isUserAuthenticated && !tokenKey) || (currentUserRole?.toString()?.toLowerCase() !== "guest")) {
    return (
      <Redirect to={{ pathname: "/login" }} />
    );
  }

  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};



const PrivateRoutes = ({ component: Component,
  isUserAuthenticated, tokenKey,
  allowedRoles,
  currentUserRole,
  virtualRole,
  pageProps,
  ...rest }: any) => {
  console.log({ allowedRoles, virtualRole });
  if (!isUserAuthenticated || !tokenKey) {
    if (rest?.location?.search) {
      return (
        <Redirect to={{ pathname: "/login", state: { from: `${rest.path}${rest.location.search}` } }} />
      );
    } else {
      return (
        <Redirect to={{ pathname: "/login", state: { from: rest.path } }} />
      );
    }
  } else if (virtualRole) {
    if (!allowedRoles.includes(virtualRole)) {
      return (<Redirect to={{ pathname: "/not-found" }} />)
    }
  } else if (currentUserRole) {
    if (!allowedRoles.includes(currentUserRole)) {
      return (<Redirect to={{ pathname: "/not-found" }} />)
    }
  }
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props}  {...pageProps} /> </>);
      }}
    />
  );
};



export { AccessRoute, PrivateRoutes, RegistrationAuthRoute };