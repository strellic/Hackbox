import React from "react";

// reactstrap components
import { Spinner } from "reactstrap";

// core components

export default function PageChange(props) {
  return (
    <div className="page-change-full">
      <div className="page-change-inner">
        <Spinner
          color="white"
          className="page-change-spinner"
        />
        <div>
          <h4 className="title mt-3 justify-content-center text-center text-white">
            Loading...
          </h4>
        </div>
      </div>
    </div>
  );
}
