import React, { Component } from "react";
import uuid from "react-uuid";
import "./styles/comment-list.scss";

import Firebase from '../firebase-init';
import "firebase/firestore";

import Comment from "./Comment";
import CommentListAddBtn from "./CommentListAddBtn";
import * as Constants from '../constants';
import { useScrollTrigger } from "@material-ui/core";

class CommentList extends Component {
  constructor(props) {
    super(props);

    // ? Do I not care about the order of the comments (array) or do I want to keep it the same order (not array)?
    this.state = {
      commentList: [],
    };

    this.addComment = this.addComment.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  componentDidMount(){
    this.initializeDb();
  }

  async initializeDb(){
    
    // TODO: Make an attribute that directly links to the current user and their collections instead of the entire database
    this.db = Firebase.firestore();

    // Checking to see if user exists and getting their ID to be used for referencing when adding a new comment
    const users = this.db.collection("users");
    let userDocId = null;

    await this.getUser(users)
      .then((docId) => {
        userDocId = docId;
      })
      .catch((error) => {
        console.log("Error in trying to get current user's Document reference: " + error);
      })
    
    this.userRef = null;
    this.websites = null;

    // Check user's collection of websites 
    // TODO: Refactor this code snippet into another function
    // TODO: See what website the user is currently on and check that against the website collection
    if (userDocId) {
      this.userRef = users.doc(userDocId);
      this.websites = this.userRef.collection("websites");

      this.websites.get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log("User has no websites in their collection.");
            console.log("QuerySnapshot: " + querySnapshot);
          }
          else {
            console.log("User has websites in their collection.");
          }
        })
        .catch((error) => {
          console.log("Error in getting user's 'websites' Collection: " + error);
        });
    }
    else {
      console.log("User does not exist");
    }
  }

  async addComment() {
    // TODO: When adding a new user, use this newId
    const newId = uuid();
    const newComment = {
      id: newId,
      Element: "New element",
    };

    // Using concat to create a new array with the new comment
    this.setState(
      (prevState) => ({
        commentList: prevState.commentList.concat(newComment),
      }), () => console.log("Successfully added new comment!"),
    );
    
  }

  saveComment(commentId, message) {
    if (id) {
      users.add({
        name: Constants.TestUserName
      })
      .then(() => {
        console.log("Document successfully added!");
      })
      .catch((error) => {
        console.error("Failed to add document: " + error);
      });
    }
  }

  deleteComment(id) {
    this.setState(
      (prevState) => ({
        commentList: prevState.commentList.filter((comment) => comment.id !== id)
      }), () => console.log(`Comment ${id} deleted`)
    );
    console.log(this.state.commentList);
  }

  // Retriving Document ID of current user
  async getUser(users) {
    let docId = null;
    await users.where("userid", "==", Constants.TestUserId).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          docId = doc.id;
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

      return docId;
  }

  render() {
    const { commentList } = this.state;
    return (
      <div className="comment-list">
        <div className="comment-list__btn--space">
          <CommentListAddBtn addComment={this.addComment} />
        </div>

        {/* Rendering all of the comments */}
        {commentList.map((comment) => (
          <Comment key={comment.id} id={comment.id} deleteComment={this.deleteComment} />
        ))}
      </div>
    );
  }
}

export default CommentList;
