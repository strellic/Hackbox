import React, { createRef } from "react";
import ReactMarkdown from "react-markdown";

// reactstrap components
import {
  Card,
  CardHeader,
  Container,
  Row,
  CardBody,
  Form,
  Input,
  Col,
  FormGroup,
  Button,
  Alert
} from "reactstrap";
// layout for this page
import Authorized from "layouts/Authorized.js";
// core components
import AuthorizedHeader from "components/Headers/AuthorizedHeader.js";

import fetch from 'utils/fetch.js';
import redirectTo from 'utils/redirectTo.js';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: {},
      flags: {},
      flagColors: {},
      name: this.props.router.query.room,
      isLoading: true,
      submitDisabled: false,
      submitError: "",
      boxActive: false,
      boxExpires: "",
      boxIP: "",
      boxDisabled: false,
      boxError: "",
      finished: ""
    }

    this.successRef = createRef(null);

    fetch(process.env.API_URL + "/api/room/info", {
    	method: "POST",
    	headers: {
    		"Content-Type": "application/json",
    	},
    	body: JSON.stringify({name: this.props.router.query.room})
    })
    .then(resp => resp.json())
    .then(resp => {
    	if(!resp.success)
    		return redirectTo("/rooms");
    	this.setState({["room"]: resp.response, ["isLoading"]: false, ["name"]: resp.response.name});
    });

    setInterval(this.checkBox, 30 * 1000);
    this.checkBox();
  }

  checkBox = () => {
  	fetch(process.env.API_URL + "/api/user/box_info", {
    	method: "POST",
    	headers: {
    		"Content-Type": "application/json",
    	}
    })
    .then(resp => resp.json())
    .then(resp => {
    	if(!resp.success)
    		return this.setState({["boxError"]: resp.boxError});

    	let boxes = resp.boxes.filter(box => box.room === this.state.name);
    	if(boxes.length > 0) {
    		let min = Math.floor((new Date(boxes[0].expiresAt) - new Date()) / 60000);
    		this.setState({["boxExpires"]: min + " min", ["boxActive"]: true, ["boxIP"]: boxes[0].ip})
    	}
    	else {
    		this.setState({["boxActive"]: false})
    	}
    });
  }

  checkFlags = (event) => {
  	event.preventDefault();
  	fetch(process.env.API_URL + "/api/room/check", {
    	method: "POST",
    	headers: {
    		"Content-Type": "application/json",
    	},
    	body: JSON.stringify({name: this.state.name, flags: this.state.flags})
    })
    .then(resp => resp.json())
    .then(resp => {
    	if(!resp.success) {
    		this.setState({["submitError"]: resp.error});
    	}
    	else {
    		let flagColors = this.state.flagColors || {};
    		for(let i = 0; i < resp.response.flags.length; i++) {
    			let { name, correct } = resp.response.flags[i];	

    			if(correct)
    				flagColors[name] = "3px solid green";
    			else
    				flagColors[name] = "3px solid red";
    		}
        if(!resp.response.failed) {
          this.setState({["flagColors"]: flagColors, ["finished"]: resp.response.msg || "You completed the room!"});
          window.scrollTo(0, this.successRef.offsetTop);
        }
        else
    		  this.setState({["flagColors"]: flagColors});
    	}
    });
  }

  launch = (event) => {
  	event.preventDefault();
  	this.setState({["boxDisabled"]: true})
  	fetch(process.env.API_URL + "/api/room/launch", {
    	method: "POST",
    	headers: {
    		"Content-Type": "application/json",
    	},
    	body: JSON.stringify({name: this.state.name})
    })
    .then(resp => resp.json())
    .then(resp => {
    	if(!resp.success) {
    		this.setState({["boxError"]: resp.error, ["boxDisabled"]: false});
    	}
    	else {
    		this.setState({["boxIP"]: resp.response, ["boxActive"]: true, ["boxDisabled"]: false});
    		this.checkBox();
    	}
    });
  }

  extend = (event) => {
  	event.preventDefault();
  	this.setState({["boxDisabled"]: true})
  	fetch(process.env.API_URL + "/api/room/extend", {
    	method: "POST",
    	headers: {
    		"Content-Type": "application/json",
    	},
    	body: JSON.stringify({name: this.state.name})
    })
    .then(resp => resp.json())
    .then(resp => {
    	if(!resp.success) {
    		this.setState({["boxError"]: resp.error, ["boxDisabled"]: false});
    	}
    	else {
    		this.setState({["boxDisabled"]: false});
    	}
    	setTimeout(this.checkBox, 1500);
    });
  }

  destroy = (event) => {
  	event.preventDefault();
  	this.setState({["boxDisabled"]: true});
  	fetch(process.env.API_URL + "/api/room/destroy", {
    	method: "POST",
    	headers: {
    		"Content-Type": "application/json",
    	},
    	body: JSON.stringify({name: this.state.name})
    })
    .then(resp => resp.json())
    .then(resp => {
    	if(!resp.success) {
    		this.setState({["boxError"]: resp.error, ["boxDisabled"]: false});
    	}
    	else {
    		this.setState({["boxDisabled"]: false});
    	}
    	setTimeout(this.checkBox, 1500);
    });
  }

  onChange = (event) => {
  	let {name, value} = event.target;

  	let flags = this.state.flags;
  	let flagColors = this.state.flagColors;

  	flags[name] = value;
  	flagColors[name] = "";

    this.setState({["flags"]: flags, ["flagColors"]: flagColors, ["submitError"]: ""});
  }

  render() {
    return (
      <>
        <AuthorizedHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Dark table */}
          <Row className="mt-5">
            <div className="col">
              <Card className="shadow">
             	{this.state.isLoading ? (
             		<>
		                <CardHeader className="bg-transparent border-0">
		                  <h1 className="mb-0">Loading...</h1>
		                </CardHeader>
		                <CardBody className="pt-0">
			              <h3>Please wait, the room info is loading...</h3>
			            </CardBody>
			        </>
	           	) : (
	           		<>
		           		<CardHeader className="bg-transparent border-0">
		                  <h1 className="mb-0">{this.state.room.displayName}</h1>
		                </CardHeader>
		                <CardBody className="pt-0">
			              <h3>{this.state.room.shortDescription}</h3>
			              {this.state.room.completed && (
                      <h3 className="text-success">You have completed this room!</h3>
                    )}

                    {this.state.finished && (
                      <Alert ref={this.successRef} color="success" className="mt-4">
                        {this.state.finished}
                      </Alert>
                    )}

			              <hr />

			              <Col className="p-1">
			              	  <h2>Box Options</h2>
			              	  {this.state.boxError &&
				                (<Alert color="danger">
				                  {this.state.boxError}
				                </Alert>)
				              }
			              	  <h4>Status: {this.state.boxActive ? "Active" : "Inactive"}</h4>
			              	  {this.state.boxActive && (
			              	  		<>
					              	  <h4>Box IP: {this.state.boxIP}</h4>
					              	  <h4 className="mb-4">Time Left: {this.state.boxExpires}</h4>
					              	
						              <Button
						                    color="success"
						                    type="button"
						                    size="md"
						                    className="mr-2"
						                    disabled={this.state.boxDisabled}
						                    onClick={this.extend}
						              >
										Extend
						              </Button>
						              <Button
						                    color="danger"
						                    type="button"
						                    size="md"
						                    className="mr-2"
						                    disabled={this.state.boxDisabled}
						                    onClick={this.destroy}
						              >
						              	Destroy
						              </Button>
						            </>
						      )}
						      {!this.state.boxActive && (
			              	  		<Button
					                    color="primary"
					                    type="button"
					                    size="md"
					                    className="mr-2"
					                    disabled={this.state.boxDisabled}
					                    onClick={this.launch}
					              >
					              	Launch
					              </Button>
					          )}
				          </Col>
			              <hr />
			              <ReactMarkdown>{this.state.room.markdown}</ReactMarkdown>

                    {this.state.room.html && (
                      <>
                        <hr />
                        <div dangerouslySetInnerHTML={{__html: this.state.room.html.replace(/{USERNAME}/g, this.props.username)}} />
                      </>
                    )}

                    {this.state.room.flags.length > 0 && (
                      <>
                        <hr />

                        <Form role="form" onSubmit={this.checkFlags}>
                          <h3 className="mb-4">Submit Flags:</h3>
                          {this.state.submitError &&
                                (<Alert color="danger">
                                  {this.state.submitError}
                                </Alert>)
                              }
                          {this.state.room.flags.map((flag) => (
                            <Row key={flag}>
                              <Col lg="12">
                                <FormGroup>
                                  <label className="form-control-label" htmlFor={flag}>
                                    {flag}
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    placeholder="hackbox{......}"
                                    name={flag}
                                    defaultValue={this.state.flags[flag]}
                                    style={{border: this.state.flagColors[flag] || "3px solid white"}}
                                    onChange={this.onChange}
                                    type="text"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          ))}
                          <Button
                            color="primary"
                            type="submit"
                            size="sm"
                            className="float-right"
                            disabled={this.state.submitDisabled}
                          >
                            Submit Flags 
                          </Button>
                        </Form>
                      </>
                    )}
			            </CardBody>
			         </>
	           	)}
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

Room.layout = Authorized;

export default Room;
