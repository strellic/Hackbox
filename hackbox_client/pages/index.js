import React from "react";
import Link from "next/link";

// reactstrap components
import {
  Button,
  Row
} from "reactstrap";
// layout for this page
import Standard from "layouts/Standard.js";

class Index extends React.Component {
  render() {
    return (
      <>
        <h1 className="display-3 text-white">
          Join now!
        </h1>
        <Row className="justify-content-center mt-3">
          <Link href="/login">
            <Button color="primary" type="button">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button color="secondary" type="button">
              Create an Account
            </Button>
          </Link>
        </Row>
      </>
    );
  }
}

Index.layout = Standard;

export default Index;
