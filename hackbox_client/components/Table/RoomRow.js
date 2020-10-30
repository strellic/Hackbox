import React from "react";
import { Media, Button } from "reactstrap";

import Difficulty from "components/Text/Difficulty.js";

class RoomRow extends React.Component {
  render() {
    return (
      <tr>
        <th scope="row">
          <Media className="align-items-center">
            <span 
              className="avatar rounded-circle mr-3 bg-dark"
            >
              <i className={this.props.room.icon} />
            </span>
            <Media>
              <span className="mb-0 text-sm">{this.props.room.displayName}</span>
            </Media>
            {this.props.room.completed && (
              <i className="ml-1 fas fa-check text-success" />
            )}
          </Media>
        </th>
        <td>
        	<Difficulty difficulty={this.props.room.difficulty} />
        </td>
        {this.props.showDesc && (
          <td>
            {this.props.room.shortDescription}
          </td>
        )}
        <td>
          <Button href={"/room/" + this.props.room.name}>View ></Button>
        </td>
      </tr>
    );
  }
}

RoomRow.defaultProps = {
  showDesc: true
};

export default RoomRow;
