import React from "react";
import { Switch, Redirect } from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import SubscribeRoute from "./components/SubscribeRoute";
import SubscribedRoute from "./components/SubscribedRoute";
import Home from "./page/Home";
import Search from "./page/Search";
import Login from "./page/Login";
import LoginBox from "./page/LoginBox";
import Signup from "./page/Signup";
import Subscribe from "./page/Subscribe";
import Settings from "./page/Settings";
import Unsubscribe from "./page/Unsubscribe";

import Confirmation from "./page/confirmations/Confirmation";
import TrialConfirmation from "./page/confirmations/TrialConfirmation";
import Emailerror from "./page/confirmations/Emailerror";
import TrialError from "./page/confirmations/TrialError";
import SignupConfirmation from "./page/confirmations/SignupConfirmation";
import Cancelconfirm from "./page/confirmations/Cancelconfirm";
import Campaign from "./page/Campaign.js"

export default ({ childProps }) =>
  <Switch>
    <AuthenticatedRoute path="/app/home" component={Home} props={childProps}/>
    <SubscribedRoute path="/app/search" component={Search} props={childProps}/>
    <AuthenticatedRoute path="/app/settings" component={Settings} props={childProps}/>
    <SubscribeRoute path="/app/subscribe" component={Subscribe} props={childProps}/>
    <AuthenticatedRoute path="/app/confirmation" component={Confirmation} props={childProps}/>
    <AuthenticatedRoute path="/app/trialconfirmation" component={TrialConfirmation} props={childProps}/>
    <AuthenticatedRoute path="/app/unsubscribe" component={Unsubscribe} props={childProps}/>
    <AuthenticatedRoute path="/app/emailerror" component={Emailerror} props={childProps}/>
    <AuthenticatedRoute path="/app/trialerror" component={TrialError} props={childProps}/>
    <AuthenticatedRoute path="/app/signupconfirm" component={SignupConfirmation} props={childProps}/>
    <AuthenticatedRoute path="/app/cancelconfirm" component={Cancelconfirm} props={childProps}/>
    <AuthenticatedRoute path="/app/campaign" component={Campaign} props={childProps}/>


    <UnauthenticatedRoute path="/app/login" component={Login} props={childProps}/>
    <UnauthenticatedRoute path="/app/loginbox" component={LoginBox} props={childProps}/>
    <UnauthenticatedRoute path="/app/signup" component={Signup} props={childProps}/>
    <Redirect to= "/app/home"/>
  </Switch>;
