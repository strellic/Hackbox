import React from "react";
import cc from 'cookie-cutter';
import fetch from 'utils/fetch.js';
import redirectTo from 'utils/redirectTo.js';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Alert,
} from "reactstrap";
// layout for this page
import Account from "layouts/Account.js";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      disabled: false
    };
  }

  handleChange = (event) => {
    let {name, value} = event.target;
    this.setState({[name]: value, error: null});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({["disabled"]: true, error: null});

    let data = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email
    };

    fetch(process.env.API_URL + '/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(json => {
      if(!json.success) {
        this.setState({["error"]: json.error, ["disabled"]: false});
      }
      else {
        cc.set('authToken', json.token, {
          expires: new Date(+new Date() + 24 * 60 * 60 * 1000),
        });
        redirectTo("/dashboard");
      }
    });
  }

  render() {
    return (
      <Row className="justify-content-center">
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <i className="ni ni-circle-08 display-1" style={{fontSize: "3.3rem"}} />
              </div>
              <div className="text-center text-muted mb-4">
                <h3>Sign In</h3>
              </div>
              {this.state.error &&
                (<Alert color="danger">
                  {this.state.error}
                </Alert>)
              }
              <Form role="form" onSubmit={this.handleSubmit}>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input 
                      placeholder="Username"
                      type="text"
                      name="username"
                      value={this.state.username}
                      onChange={this.handleChange}
                      required
                      minLength={6}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      required
                      minLength={8}
                    />
                  </InputGroup>
                </FormGroup>
                <div className="text-center">
                  <Button className="mt-4" color="primary" type="submit" disabled={this.state.disabled}>
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

Login.layout = Account;

export default Login;
