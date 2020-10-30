import React from "react";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
// reactstrap components
import { Container } from "reactstrap";
// core components
import AuthorizedNavbar from "components/Navbars/AuthorizedNavbar.js";
import AuthorizedFooter from "components/Footers/AuthorizedFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import authRoute from "components/authRoute.js";

import routes from "variables/routes.js";

function Authorized(props) {
  // used for checking current route
  const router = useRouter();
  let mainContentRef = React.createRef();
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
  }, []);
  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (router.route.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Hackbox";
  };
  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/dashboard",
          imgSrc: require("assets/img/brand/logo.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContentRef}>
        <AuthorizedNavbar {...props} brandText={getBrandText()} />
        {/*props.children*/}
        {React.cloneElement(props.children, { router: router })}
        <Container fluid>
          <AuthorizedFooter />
        </Container>
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(authRoute(Authorized)), {
  ssr: false
});