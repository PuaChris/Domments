import React, { Component } from "react";
import "./styles/App.scss";
import CommentList from "./components/CommentList";

const dotenv = require('dotenv').config();

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
