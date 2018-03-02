import React from "react";
import { Switch, Redirect } from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import SubscribeRoute from "./components/SubscribeRoute";
import SubscribedRoute from "./components/SubscribedRoute";
import Home from "./page/Home";
import Search from "./page/Search";
import Login from "./page/Login";
import Signup from "./page/Signup";
import Subscribe from "./page/Subscribe";
import Settings from "./page/Settings";
import Confirmation from "./page/Confirmation"
import Unsubscribe from "./page/Unsubscribe"
import Emailerror from "./page/Emailerror"
import Cancelconfirm from "./page/Cancelconfirm"

export default ({ childProps }) =>
  <Switch>
    <AuthenticatedRoute path="/app/home" component={Home} props={childProps}/>
    <SubscribedRoute path="/app/search" component={Search} props={childProps}/>
    <AuthenticatedRoute path="/app/settings" component={Settings} props={childProps}/>
    <SubscribeRoute path="/app/subscribe" component={Subscribe} props={childProps}/>
    <AuthenticatedRoute path="/app/confirmation" component={Confirmation} props={childProps}/>
    <AuthenticatedRoute path="/app/unsubscribe" component={Unsubscribe} props={childProps}/>
    <AuthenticatedRoute path="/app/emailerror" component={Emailerror} props={childProps}/>
    <AuthenticatedRoute path="/app/cancelconfirm" component={Cancelconfirm} props={childProps}/>


    <UnauthenticatedRoute path="/app/login" component={Login} props={childProps}/>
    <UnauthenticatedRoute path="/app/signup" component={Signup} props={childProps}/>
    <Redirect to= "/app/home"/>
  </Switch>;
