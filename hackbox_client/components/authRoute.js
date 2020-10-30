import React, { PropTypes } from 'react';  
import redirectTo from 'utils/redirectTo.js';

export default function authRoute(ComposedComponent) {  
  return class authRouteComponent extends React.Component {
    componentDidMount() {
      this._checkAndRedirect();
    }

    componentDidUpdate() {
      this._checkAndRedirect();
    }

    _checkAndRedirect() {
      const { isSignedIn } = this.props;

      if (!isSignedIn) {
        redirectTo("/");
      }
    }

    render() {
      if (this.props.isSignedIn) {
        return (
          <ComposedComponent {...this.props} />
        );
      }
      return <></>
    }
  }
}