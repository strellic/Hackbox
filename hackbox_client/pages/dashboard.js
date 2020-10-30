import React from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  Alert
} from "reactstrap";
// layout for this page
import Authorized from "layouts/Authorized.js";
// core components
import AuthorizedHeader from "components/Headers/AuthorizedHeader.js";
import RoomRow from "components/Table/RoomRow.js";

import fetch from 'utils/fetch.js';
import download from 'utils/download.js';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      error: null,
      isLoading: true,
      rooms: []
    }

    fetch(process.env.API_URL + "/api/room/list", {
      method: 'POST',
    })
    .then(resp => resp.json())
    .then(resp => {
      let rooms = resp.response.filter(r => r.completed).sort(() => 0.5 - Math.random()).slice(0, 3);
      this.setState({["rooms"]: rooms, ["isLoading"]: false});
    });
  }

  fetchOVPN = () => {
    this.setState({["disabled"]: true, ["error"]: null});
    fetch(process.env.API_URL + '/api/vpn/ovpn', {
      method: 'POST',
    })
    .then(resp => resp.json())
    .then(json => {
      if(json.success) {
        download(json.ovpn, `${this.props.username}.ovpn`);
        this.setState({["disabled"]: false, ["error"]: null});
      }
      else {
        this.setState({["disabled"]: false, ["error"]: json.error});
      }
    });
  }

  render() {
    return (
      <>
        <AuthorizedHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Completed Rooms</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="/rooms"
                        size="sm"
                      >
                        View All Rooms
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Room Name</th>
                      <th scope="col">Difficulty</th>
                      <th scope="col">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.isLoading ? <></> : this.state.rooms.map((room, i) => (<RoomRow showDesc={false} key={i} room={room}></RoomRow>))}
                  </tbody>
                </Table>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">OpenVPN</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        onClick={this.fetchOVPN}
                        disabled={this.state.disabled}
                        size="sm"
                      >
                        Download .ovpn
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                {this.state.error &&
                  (<Alert color="danger" className="mx-4 mb-0">
                    {this.state.error}
                  </Alert>)
                }
                <CardBody>
                  <p>To connect to rooms, you need to download OpenVPN and import the VPN configuration file from the button above.</p>
                  <p>To access boxes you launched on Hackbox, you need to be able to connect to our internal network.</p>
                  <p>Download the .ovpn file above, and connect to the VPN!</p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

Dashboard.layout = Authorized;

export default Dashboard;
