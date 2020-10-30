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
import UserRow from "components/Table/UserRow.js";

import fetch from 'utils/fetch.js';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isLoading: true
    }
    fetch(process.env.API_URL + "/api/user/list", {
      method: 'GET',
    })
    .then(resp => resp.json())
    .then(resp => {
      this.setState({["users"]: resp.response, ["isLoading"]: false});
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
                  <h3 className="text-white mb-0">Users</h3>
                </CardHeader>
                <Table
                  className="align-items-center table-dark table-flush"
                  responsive
                >
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Username</th>
                      <th scope="col">Completed Rooms</th>
                      <th scope="col">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.isLoading ? <></> : this.state.users.map((user, i) => (<UserRow key={i} user={user}></UserRow>))}
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

Users.layout = Authorized;

export default Users;
