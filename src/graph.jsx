import React from 'react'

class Graph extends React.Component {
    state = {
      mssg: ""
    };
  
    handleClick = () => {
      this.setState({ mssg: "Hi there!" });
    };
  
    render() {
      console.log("render() method");
      return (
        <>
          <button onClick={this.handleClick}>Say something</button>
          <div>{this.state.mssg}</div>
        </>
      );
    }
  }

  export default Graph