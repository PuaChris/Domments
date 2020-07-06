import React, { Component } from "react";
import * as Constants from "../constants";
import "./styles/comment.scss";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      message: Constants.TestCommentMessage,
    };
  }

  onClick = () => {
    const id = this.state.id;
    this.props.deleteComment(id);
  }

  render() {
    const message = this.state.message;
    const deleteComment = this.props.deleteComment;
    return (
      <div className="comment">
        <div className="comment__message">
          { message }
        </div>
        <button type="button" onClick={this.onClick}>
          <i className="far fa-trash-alt" />
        </button>
      </div>
    );
  }
}

export default Comment;
