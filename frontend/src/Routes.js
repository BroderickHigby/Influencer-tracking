import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./page/Home";
import Search from "./page/Search";
import Login from "./page/Login";
import Signup from "./page/Signup";
export default () =>
  <Switch>
    <Route path="/app/home" exact component={Home} />
    <Route path="/app/search" exact component={Search} />
    <Route path="/app/login" exact component={Login} />
    <Route path="/app/signup" exact component={Signup} />
    <Redirect to="/app/home" />
  </Switch>;
