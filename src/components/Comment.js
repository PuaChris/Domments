import React, { Component } from "react";
import * as Constants from "../constants";
import CommentResolveBtn from "./CommentResolveBtn";
import "./styles/comment.scss";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: Constants.TestCommentMessage,
      isResolved: false,
      isDeleted: false,
    };
    this.handleResolve = this.handleResolve.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleResolve() {
    const { isResolved } = this.state;

    if (!isResolved) {
      this.setState(() => ({ isResolved: true }));
    } else {
      this.setState(() => ({ isResolved: false }));
    }
  }

  handleDelete() {
    this.setState(() => ({ isDeleted: true }));
  }

  render() {
    const { message } = this.state;
    const { isResolved } = this.state;
    return (
      <div className="comment">
        <div className="comment__message">
          { message }
        </div>

        <CommentResolveBtn isResolved={isResolved} handleResolve={this.handleResolve} />
        <div className="comment__delete-btn" />
      </div>
    );
  }
}

export default Comment;
