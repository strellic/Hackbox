import React from "react";
// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components
import StandardNavbar from "components/Navbars/StandardNavbar.js";
import StandardFooter from "components/Footers/StandardFooter.js";

function Standard(props) {
  React.useEffect(() => {
    document.body.classList.add("bg-default");
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.remove("bg-default");
    };
  }, []);
  return (
    <>
      <div className="main-content">
        <StandardNavbar />
        <div className="header bg-gradient-info pb-7 pt-7">
          <Container>
            <div className="header-body text-center">
              <Row className="justify-content-center">
                <Col lg="5" md="6">
                  <h1 className="display-1 text-white">Hackbox</h1>
                  <h3 className="text-lead text-white">
                    Hackbox is an open-source, container-based platform that makes it easy to launch vulnerable systems to test your hacking skill!
                  </h3>
                  <h3 className="text-lead text-white">
                    Built by Bryce @ <a className="text-white" href="https://brycec.me">brycec.me</a> with ❤️.
                  </h3>
                </Col>
              </Row>
            </div>
          </Container>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="fill-default"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>
        {/* Page content */}
        <Container className="mt-1 pb-5 justify-content-center text-center">
          {props.children}
        </Container>
      </div>
      <StandardFooter />
    </>
  );
}

export default Standard;
