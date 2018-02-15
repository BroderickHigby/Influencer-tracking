import React from "react";
import { Switch, Redirect } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./page/Home";
import Search from "./page/Search";
import Login from "./page/Login";
import Signup from "./page/Signup";
export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/app/home" component={Home}/>
    <AppliedRoute path="/app/search" component={Search} />
    <AppliedRoute path="/app/login" exact component={Login} props={childProps}/>
    <AppliedRoute path="/app/signup" exact component={Signup} props={childProps}/>
    <Redirect to="/app/home" />
  </Switch>;
