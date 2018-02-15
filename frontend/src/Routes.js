import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./page/Home";
import Search from "./page/Search";
import Login from "./page/Login";
import Signup from "./page/Signup";
export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/app/home" exact component={Home} props={childProps}/>
    <AppliedRoute path="/app/search" exact component={Search} props={childProps}/>
    <AppliedRoute path="/app/login" exact component={Login} props={childProps}/>
    <AppliedRoute path="/app/signup" exact component={Signup} props={childProps}/>
    <Redirect to="/app/home" />
  </Switch>;
