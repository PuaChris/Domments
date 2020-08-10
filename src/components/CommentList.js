import React, { Component } from "react";
import uuid from "react-uuid";
import "./styles/comment-list.scss";

import * as firebase from "firebase/app";
import "firebase/firestore";

import Comment from "./Comment";
import CommentListAddBtn from "./CommentListAddBtn";

var db = firebase.firestore();

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentList: [],
    };
    this.addComment = this.addComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  addComment() {
    const newid = uuid();

    const newComment = {
      id: newid,
      Element: "New element",
    };

    // Using concat to create a new array with the new comment
    this.setState(
      (prevState) => ({
        commentList: prevState.commentList.concat(newComment),
      }), () => console.log("Successfully added new comment!"),
    );
  }

  deleteComment(id) {
    this.setState(
      (prevState) => ({
        commentList: prevState.commentList.filter((comment) => comment.id !== id)
      }), () => console.log(`Comment ${id} deleted`)
    );
    console.log(this.state.commentList);
  }

  render() {
    const { commentList } = this.state;
    return (
      <div className="comment-list">
        <div className="comment-list__btn--space">
          <CommentListAddBtn addComment={this.addComment} />
        </div>
        {commentList.map((comment) => (
          <Comment key={comment.id} id={comment.id} deleteComment={this.deleteComment} />
        ))}
      </div>
    );
  }
}

export default CommentList;
