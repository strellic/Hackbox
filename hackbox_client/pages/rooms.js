import React from "react";

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
// layout for this page
import Authorized from "layouts/Authorized.js";
// core components
import AuthorizedHeader from "components/Headers/AuthorizedHeader.js";
import RoomRow from "components/Table/RoomRow.js";

import fetch from 'utils/fetch.js';

class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      isLoading: true
    }
    fetch(process.env.API_URL + "/api/room/list", {
      method: 'POST',
    })
    .then(resp => resp.json())
    .then(resp => {
      this.setState({["rooms"]: resp.response, ["isLoading"]: false});
    });
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
              <Card className="bg-default shadow">
                <CardHeader className="bg-transparent border-0">
                  <h3 className="text-white mb-0">Rooms</h3>
                </CardHeader>
                <Table
                  className="align-items-center table-dark table-flush"
                  responsive
                >
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Room Name</th>
                      <th scope="col">Difficulty</th>
                      <th scope="col">Description</th>
                      <th scope="col">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.isLoading ? <></> : this.state.rooms.map((room, i) => (<RoomRow key={i} room={room}></RoomRow>))}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

Rooms.layout = Authorized;

export default Rooms;
