import React from "react";
import { Switch } from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Home from "./page/Home";
import Search from "./page/Search";
import Login from "./page/Login";
import Signup from "./page/Signup";
import Subscribe from "./page/Subscribe";

export default ({ childProps }) =>
  <Switch>
    <AuthenticatedRoute path="/app/home" component={Home} props={childProps}/>
    <AuthenticatedRoute path="/app/search" component={Search} props={childProps}/>
    <AuthenticatedRoute path="/app/subscribe" component={Subscribe} props={childProps}/>
    <UnauthenticatedRoute path="/app/login" component={Login} props={childProps}/>
    <UnauthenticatedRoute path="/app/signup" component={Signup} props={childProps}/>
  </Switch>;
