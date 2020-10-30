import React from "react";
import fetch from 'utils/fetch.js';
import cc from 'cookie-cutter';
import redirectTo from 'utils/redirectTo.js';
import NLtoBR from 'components/Text/NLtoBR.js';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Alert,
} from "reactstrap";
// layout for this page
import Authorized from "layouts/Authorized.js";
// core components
import UserHeader from "components/Headers/UserHeader.js";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      email: this.props.email,
      saved_name: '',
      name: '',
      currentPassword: '',
      newPassword: '',
      bio: '',
      saved_bio: '',
      completed: 0,
      error: null,
      message: null,
    };

    fetch(process.env.API_URL + '/api/user/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"username": this.props.username})
    })
    .then(resp => resp.json())
    .then(json => {
    	if(json.success)
    		this.setState({
    			["name"]: json.response.name,
    			["bio"]: json.response.bio,
    			["completed"]: json.response.completed.length,
    			["saved_bio"]: json.response.bio,
    			["saved_name"]: json.response.name
    		});
    });
  }

  handleChange = (event) => {
  	let {name, value} = event.target;
    this.setState({[name]: value, error: null, message: null});
  }

  handleUserInfo = (event) => {
    event.preventDefault();
    this.setState({["disabled"]: true, error: null, message: null});

    fetch(process.env.API_URL + '/api/user/update_info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      	"username": this.state.username,
      	"email": this.state.email,
      	"name": this.state.name
      })
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
        this.setState({["message"]: "Update successful!", ["disabled"]: false, ["saved_name"]: this.state.name});

        setTimeout(() => {
        	redirectTo("/profile");
        }, 1000);
      }
    });
  }

  handlePassword = (event) => {
    event.preventDefault();
    this.setState({["disabled"]: true, error: null, message: null});

    fetch(process.env.API_URL + '/api/user/update_pass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      	currentPassword: this.state.currentPassword,
      	newPassword: this.state.newPassword
      })
    })
    .then(resp => resp.json())
    .then(json => {
    	if(!json.success) {
        this.setState({["error"]: json.error, ["disabled"]: false});
      }
      else {
        this.setState({["message"]: json.message, ["disabled"]: false});
      }
    });
  }

  handleBio = (event) => {
    event.preventDefault();
    this.setState({["disabled"]: true, error: null, message: null});

    fetch(process.env.API_URL + '/api/user/update_bio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      	bio: this.state.bio,
      })
    })
    .then(resp => resp.json())
    .then(json => {
    	if(!json.success) {
        this.setState({["error"]: json.error, ["disabled"]: false});
      }
      else {
        this.setState({["message"]: json.message, ["disabled"]: false, ["saved_bio"]: this.state.bio});
      }
    });
  }
  
  render() {
    return (
      <>
        <UserHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="card-profile shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a onClick={(e) => e.preventDefault()}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          src={"https://ui-avatars.com/api/?size=800&name=" + this.props.username}
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                </CardHeader>
                <CardBody className="pt-0 pt-md-4">
                  <Row>
                    <div className="col">
                      <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                        <div>
                          <span className="heading">{this.state.completed}</span>
                          <span className="description">Completed Rooms</span>
                        </div>
                      </div>
                    </div>
                  </Row>
                  <div className="text-center">
                    <h3>
                      {this.state.saved_name ? (
                        <div>{this.state.saved_name} ({this.props.username})</div>
                      ) : (
                       <div>{this.props.username}</div>
                      )}
                    </h3>
                    <hr className="my-4" />
                    <NLtoBR>{this.state.saved_bio}</NLtoBR>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">My account</h3>
                    </Col>
                  </Row>
                </CardHeader>
                {this.state.error &&
		                (<Alert color="danger" className="mx-4 mb-0">
		                  {this.state.error}
		                </Alert>)
		              }
		              {this.state.message &&
		                (<Alert color="primary" className="mx-4 mb-0">
		                  {this.state.message}
		                </Alert>)
		              }
                <CardBody>
                  <Form role="form" onSubmit={this.handleUserInfo}>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="username"
                            >
                              Username
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={this.state.username}
                              onChange={this.handleChange}
                              name="username"
                              placeholder="Username"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="email"
                              defaultValue={this.state.email}
                              onChange={this.handleChange}
                              name="email"
                              type="email"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="name"
                            >
                              Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={this.state.name}
                              onChange={this.handleChange}
                              placeholder="Name"
                              name="name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <div className="pl-lg-4">
                    	<Row>
                    		<Col lg="12">
		                    	<Button
			                      color="primary"
			                      type="submit"
			                      size="sm"
			                      className="float-right"
			                      disabled={this.state.disabled}
			                    >
			                    	Update Info
			                    </Button>
		                    </Col>
	                   	</Row>
	                  </div>
                  </Form>
                  <Form role="form" onSubmit={this.handlePassword}>
                    <hr className="my-4" />
                    <h6 className="heading-small text-muted mb-4">
                      Change Password
                    </h6>
                    <Row>
                     	<Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="current-password"
                            >
                              Current Password
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={this.state.currentPassword}
                              onChange={this.handleChange}
                              name="currentPassword"
                              placeholder="Current Password"
                              type="password"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="new-password"
                            >
                              New Password
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={this.state.newPassword}
                              onChange={this.handleChange}
                              name="newPassword"
                              placeholder="New Password"
                              type="password"
                            />
                          </FormGroup>
                      </Col>
                    </Row>
                    <div className="pl-lg-4">
                    	<Row>
                    		<Col lg="12">
		                    	<Button
			                      color="primary"
			                      type="submit"
			                      size="sm"
			                      className="float-right"
			                      disabled={this.state.disabled}
			                    >
			                    	Update Password
			                    </Button>
		                    </Col>
	                   	</Row>
	                  </div>
                  </Form>
                    <hr className="my-4" />
                    {/* Description */}
                  <Form role="form" onSubmit={this.handleBio}>
                    <h6 className="heading-small text-muted mb-4">About me</h6>
                    <div className="pl-lg-4">
                      <FormGroup>
                        <Input
                          className="form-control-alternative"
                          placeholder=""
                          name="bio"
                          defaultValue={this.state.bio}
                          onChange={this.handleChange}
                          rows="4"
                          type="textarea"
                        />
                      </FormGroup>
                    </div>
                    <div className="pl-lg-4">
                    	<Row>
                    		<Col lg="12">
		                    	<Button
			                      color="primary"
			                      type="submit"
			                      size="sm"
			                      className="float-right"
			                      disabled={this.state.disabled}
			                    >
			                    	Update Bio
			                    </Button>
		                    </Col>
	                   	</Row>
	                  </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

Profile.layout = Authorized;

export default Profile;
