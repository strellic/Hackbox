import React from "react";
import { Media, Button } from "reactstrap";

class UserRow extends React.Component {
  render() {
    return (
      <tr>
        <th scope="row">
          <Media className="align-items-center">
            <img
              className="avatar rounded-circle mr-3"
              src={"https://ui-avatars.com/api/?size=800&name=" + this.props.user.username}
            />
            <Media>
              <span className="mb-0 text-sm">{this.props.user.username}</span>
            </Media>
          </Media>
        </th>
        <td>
        	{this.props.user.completed.length}
        </td>
        <td>
          <Button href={"/user/" + this.props.user.username}>View ></Button>
        </td>
      </tr>
    );
  }
}

export default UserRow;
