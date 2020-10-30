import React, { Component } from "react";
import Router from "next/router";
import cookie from 'cookie-cutter';

export default class Logout extends Component {
  componentDidMount = () => {
  	cookie.set("authToken", "bye bye~", {expires: new Date(0)});
    Router.push("/");
  };

  render() {
    return <div />;
  }
}
