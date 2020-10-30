import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";

import fetch from 'utils/fetch.js';
import redirectTo from 'utils/redirectTo.js';
import { parseCookies, destroyCookie } from 'nookies';

import PageChange from "components/PageChange/PageChange.js";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/nextjs-argon-dashboard.scss";
import "assets/css/custom.css";

Router.events.on("routeChangeStart", (url) => {
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById("page-transition")
  );
});
Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
});

export default class MyApp extends App {
  componentDidMount() {
  }
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};
    let c = parseCookies(ctx);

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    if(c.authToken) {
      let response = await fetch(process.env.API_URL + '/api/user/auth', {
        method: 'POST',
        headers: {
          'Authorization': c.authToken
        }
      })
      .then(r => r.json())
      .then(resp => {
        if(resp.success) {
          Object.assign(pageProps, resp.token);
        }
        else {
          destroyCookie(ctx, "authToken");
        }
      });
    }
    return { pageProps };
  }
  render() {
    const { Component, pageProps } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>Hackbox</title>
        </Head>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </React.Fragment>
    );
  }
}
