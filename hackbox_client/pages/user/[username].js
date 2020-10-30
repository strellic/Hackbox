import React from "react";
import cc from 'cookie-cutter';

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
  Table
} from "reactstrap";
// layout for this page
import Authorized from "layouts/Authorized.js";
// core components
import AuthorizedHeader from "components/Headers/AuthorizedHeader.js";
import RoomRow from "components/Table/RoomRow.js";

import fetch from 'utils/fetch.js';
import redirectTo from 'utils/redirectTo.js';
import NLtoBR from 'components/Text/NLtoBR.js';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.router.query.username,
      user: {},
      rooms: [],
      isLoading: true
    };

    fetch(process.env.API_URL + '/api/user/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"username": this.state.username})
    })
    .then(resp => resp.json())
    .then(json => {
      if(json.success) {
        this.setState({["user"]: json.response});

         fetch(process.env.API_URL + '/api/room/list', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({"username": this.state.username})
          })
          .then(resp => resp.json())
          .then(json => {
            if(json.success) {
              this.setState({["rooms"]: json.response, ["isLoading"]: false});
            }
          });
      }
      else {
        redirectTo("/dashboard");
      }
    });
  }

  render() {
    return (
      <>
        <AuthorizedHeader />
        {/* Page content */}
        <Container className="mt--5" fluid>
          {this.state.isLoading ? <></> : (
            <Row>
              <Col className="order-xl-1 mb-5 mb-xl-0" xl="4">
                <Card className="card-profile shadow">
                  <Row className="justify-content-center">
                    <Col className="order-lg-2" lg="3">
                      <div className="card-profile-image">
                        <a onClick={(e) => e.preventDefault()}>
                          <img
                            alt="..."
                            className="rounded-circle"
                            src={"https://ui-avatars.com/api/?size=800&name=" + this.state.username}
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
                            <span className="heading">{this.state.user.completed.length}</span>
                            <span className="description">Completed Rooms</span>
                          </div>
                        </div>
                      </div>
                    </Row>
                    <div className="text-center">
                      <h3>
                        {this.state.user.name ? (
                          <div>{this.state.user.name} ({this.state.username})</div>
                        ) : (
                          <div>{this.state.username}</div>
                        )}
                      </h3>
                      <hr className="my-4" />
                      <NLtoBR>{this.state.user.bio}</NLtoBR>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col className="order-xl-2 mb-5 mb-xl-0">
                <Card className="shadow">
                  <CardHeader className="bg-transparent border-0">
                    <h3 className="mb-0">Completed Rooms</h3>
                  </CardHeader>
                  <Table
                    className="align-items-center table-flush"
                    responsive
                  >
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Room Name</th>
                        <th scope="col">Difficulty</th>
                        <th scope="col">View</th>
                      </tr>
                    </thead>
                    <tbody>
                      { this.state.rooms.map((room, i) => (this.state.user.completed.includes(room.name) && <RoomRow showDesc={false} key={i} room={room}></RoomRow>))}
                    </tbody>
                  </Table>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </>
    );
  }
}

UserProfile.layout = Authorized;

export default UserProfile;
