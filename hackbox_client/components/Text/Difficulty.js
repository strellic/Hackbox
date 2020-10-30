import React from "react";

class Difficulty extends React.Component {
  render() {
    return (
      <>
        {[...Array(this.props.difficulty)].map((v, i) => (<i className="fas fa-star" key={i}></i>))}
        {[...Array(5 - this.props.difficulty)].map((v, i) => (<i className="far fa-star" key={i}></i>))}
      </>
    );
  }
}

export default Difficulty;
