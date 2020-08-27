import React, { Component } from "react";

import Firebase from '../firebase-init';
import "firebase/firestore";
import { firestore } from "firebase";

import moment from 'moment';

import { motion, AnimatePresence } from 'framer-motion';

import Comment from "./Comment";
import CommentListAddBtn from "./CommentListAddBtn";
import * as Constants from '../helper/constants';
import { createCommentObj } from '../helper/createCommentObj';

import "./styles/comment-list.scss";

class CommentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mounted: false,
      isUserLoggedIn: false,
      commentList: [],
    };

    this.websiteRootUrl = window.location.host;

    this.userId = null;
    this.userName = null;

    this.addComment = this.addComment.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  async componentDidMount() {
    await this.initializeUser();
    this.getComments();
    this.setState({
      mounted: true
    });
  }

  async initializeUser() {
    const url = new URL('http://localhost:4000/user');
    await fetch(url, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(
        (result) => {
          if (result === null || result === undefined){
            console.log("User does not exist");
            return;
          }

          this.setState({
            isUserLoggedIn: true
          });
          this.userId = result.userDocData.userid;
          this.userName = result.userDocData.username;
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.error("Error in retrieving user data -> " + error);
        }
      )
  }

  async getComments() {
    // Checks which website they are on and pull comments 
    let url = new URL('http://localhost:4000/comments');
    url.search = new URLSearchParams({ 
      userId: this.userId,
      userName: this.userName,
      website: this.websiteRootUrl,
     });

    await fetch(url, {
      method: "GET",
    })
    .then(data => data.json())
    .then((commentList) => {
      console.log(commentList);
      this.setState({ commentList: commentList }, () => 
        console.log("Retrieved " + commentList.length + " comments from: " + this.websiteRootUrl),
      );
    })
  }

  async addComment() {
    const website = this.websiteRootUrl;
    const newCommentId = await this.websiteCollection.doc(website).collection("comments").doc().id;
    const emptyMessage = "";
    const emptyTimestamp = null;

    const commentListItem = createCommentObj (
      newCommentId,
      this.userDocData.userid,
      this.userDocData.username,
      emptyMessage,
      emptyTimestamp
    );

    // Using `unshift` to push a newly added comment to the front of the array and display comments in that order
    let newCommentList = this.state.commentList;
    newCommentList.unshift(commentListItem);

    this.setState({commentList: newCommentList}, () => 
      console.log("Successfully added new comment.")
    );
  }

 /*
 1. User has a comment they want to save. It is stored in 'message' hook. 
 2. User presses 'Comment' button. handleSubmit() is called. 
 3. saveComment() is passed down from CommentList.js -> Comment.js so it can be called inside handleSubmit()
 4. saveComment() takes in the Comment ID and message (so we know which Comment we're saving the message too)
 5. We already checked for the user auth upon start up just add the user's name as the commenter
 * 6. Inside saveComment(), it's going to save the ID, message, user, and timestamp as a comment *
 */

  async saveComment(id, message) {
    if (message) {
      const website = this.websiteRootUrl;
      const currentTimestamp = firestore.Timestamp.now();

      // No need to save ID because it's automatically generated by Firestore as the key, which is what is used to identify each unique comment
      await this.websiteCollection.doc(website).collection("comments").doc(id).set({
        userId: this.userDocData.userid,
        userName: this.userDocData.username,
        message: message,
        timestamp: currentTimestamp
      })
      .catch((error) => {
        console.error("Error in adding new comment: " + error);
        return false;
      });

      // Dynamically display edited comment to the top of the list 
      let updatedCommentList = this.state.commentList;

      // Update timestamp in state instead of retrieving from the database to reduce the number of reads needed
      let matchingComment = updatedCommentList.find((comment) => comment.id === id);
      matchingComment.timestamp = moment(currentTimestamp.toMillis()).format('lll');

      let matchingIndex = updatedCommentList.indexOf(matchingComment);
      updatedCommentList.splice(matchingIndex, 1);

      updatedCommentList.unshift(matchingComment);

      this.setState({ commentList: updatedCommentList }, () => 
        console.log("Comment successfully saved.")
      );

      return true;
    }
    else {
      console.log("No message to be saved.");
      return false;
    }
  }

  async deleteComment(id) {
    const website = this.websiteRootUrl;

    this.setState(
      (prevState) => ({
        commentList: prevState.commentList.filter((commentItem) => commentItem.id !== id)
      })
    );

    let commentRef = await this.websiteCollection.doc(website).collection("comments").doc(id).get()
      .catch((error) => {
        console.error("Error in retrieving document to be deleted: " + error);
      });
      
    if (commentRef) {
      await this.websiteCollection.doc(website).collection("comments").doc(id).delete()
        .catch((error) => {
          console.error("Error in deleting document from database: " + error);
        });
      console.log("Comment " + id + " successfully deleted.");
    }

    console.log("CommentList: " + this.state.commentList);
  }


  render() {
    let { mounted, commentList } = this.state;
    const CommentListAddBtnVariants = Constants.CommentListAddBtnVariants;
    return (
      <div className="container">
        <motion.div 
          className="comment-list__btn--space"
          initial={false}
          animate={mounted ? "show" : "hide"}
          variants={CommentListAddBtnVariants}
        >
            <CommentListAddBtn addComment={this.addComment} />
        </motion.div>

        {/* Rendering all of the comments */}
        <div className="comment-list">
          <AnimatePresence>
            {commentList.map((commentItem) => (
              <Comment 
                  key={commentItem.id}
                  commentItem={commentItem}
                  deleteComment={this.deleteComment} 
                  saveComment={this.saveComment} 
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }
}

export default CommentList;
