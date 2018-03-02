import React from "react";
import { Route, Redirect } from "react-router-dom";

export default ({ component: C, props: cProps, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      cProps.isAuthenticated
        ? cProps.subscribed
          ?<C {...props} {...cProps} />
          :(alert("You are not Subscribed!"),
            <Redirect
              to={'/app/subscribe'}
            />)
        : <Redirect
            to={'/app/login'}
          />}
  />;
