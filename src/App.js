import React, { Component } from "react";
import "./styles/App.scss";
import CommentList from "./components/CommentList";

class App extends Component {
  render() {
    return (
      <div className="App">

        <CommentList />
      </div>
    );
  }
}

export default App;
