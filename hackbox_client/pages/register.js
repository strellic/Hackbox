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

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      verifyPass: '',
      email: '',
      strength: ["text-danger font-weight-700", "weak"],
      error: '',
      disabled: false
    };
  }

  handleChange = (event) => {
    let {name, value} = event.target;
    if (name === "password") {
      this.setState({[name]: value, ["strength"]: this.scorePassword(value), error: null});
    }
    else {
      this.setState({[name]: value, error: null});
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({["disabled"]: true, error: null});

    if(this.state.verifyPass !== this.state.password) {
    	return this.setState({["disabled"]: false, error: "The passwords are not the same!"});
    }

    let data = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email
    };

    fetch(process.env.API_URL + '/api/user/register', {
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

  scorePassword = (pass) => {
    let score = 0;

    if (!pass)
        return ["text-danger font-weight-700", "weak"];

    let letters = {};
    for (let i = 0; i < pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }

    let variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    }

    let variationCount = 0;
    for (let check in variations) {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += parseInt((variationCount - 1) * 10);

    if (score >= 80)
      return ["text-success font-weight-700", "strong"];
    if (score >= 50)
      return ["text-warning font-weight-700", "okay"];
    return ["text-danger font-weight-700", "weak"];
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
                <h3>Sign Up</h3>
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
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      autoComplete="new-email"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      required
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
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Verify Password"
                      type="password"
                      autoComplete="new-password"
                      name="verifyPass"
                      value={this.state.verifyPass}
                      onChange={this.handleChange}
                      required
                      minLength={8}
                    />
                  </InputGroup>
                </FormGroup>
                <div className="text-muted font-italic">
                  <small>
                    password strength:{" "}
                    <span className={this.state.strength[0]}>{this.state.strength[1]}</span>
                  </small>
                </div>
                {/*
                <Row className="my-4">
                  <Col xs="12">
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <input
                        className="custom-control-input"
                        id="customCheckRegister"
                        type="checkbox"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheckRegister"
                      >
                        <span className="text-muted">
                          I agree with the{" "}
                          <a href="#pablo" onClick={(e) => e.preventDefault()}>
                            Privacy Policy
                          </a>
                        </span>

                      </label>
                    </div>
                  </Col>
                </Row>
                */}
                <div className="text-center">
                  <Button className="mt-4" color="primary" type="submit" disabled={this.state.disabled}>
                    Create account
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

Register.layout = Account;

export default Register;
