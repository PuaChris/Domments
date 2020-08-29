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

    this.websiteHost = window.location.host;
    this.userData = {
      userDocId: null,
      userId: null,
      userName: null,
    }

    this.addComment = this.addComment.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  async componentDidMount() {
    await this.initializeUser();
    if (this.state.isUserLoggedIn){
      console.log("Requesting comments...");
      this.getComments(); 
    }
    this.setState({
      mounted: true
    });
  }

  async initializeUser() {
    const userId = 'test';
    const url = new URL(`http://localhost:4000/users/${userId}`);
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
          this.userData.userDocId = result.userDocId;
          this.userData.userId = result.userDocData.userid;
          this.userData.userName = result.userDocData.username;
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.error("Error in retrieving user data -> " + error);
        }
      );
  }

  async getComments() {
    const website = this.websiteHost;
    const userId = this.userData.userId;

    const url = new URL(`http://localhost:4000/users/${userId}/website/${website}/comments`);
    url.search = new URLSearchParams({ 
      userDocId: this.userData.userDocId,
      userName: this.userData.userName,
    });

    await fetch(url, {
      method: "GET",
    })
    .then(data => data.json())
    .then((commentList) => {
        this.setState({ commentList: commentList }, () => 
          console.log(`Retrieved ${commentList.length} comments for ${this.websiteHost}`),
        );
      },
      (error) => {
        console.error(`Error in retrieving comment data -> ${error}`);
      }
    );
  }

  async addComment() {
    const userId = this.userData.userId;
    const website = this.websiteHost;

    const url = new URL(`http://localhost:4000/users/${userId}/website/${website}/comments/newid`);
    url.search = new URLSearchParams({ 
      userDocId: this.userData.userDocId,
      website: website
    });

    let commentId;
    const emptyMessage = "";
    const emptyTimestamp = null;

    await fetch(url, {
      method: "GET",
    })
    .then(data => data.json())
    .then((newCommentId) => {
        commentId = newCommentId;
      },
      (error) => {
        console.error("Error in retrieving new comment ID -> " + error);
      }
    );

    const commentListItem = createCommentObj (
      commentId,
      this.userData.userId,
      this.userData.userName,
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

  async saveComment(commentId, message) {
    if (message) {
      const website = this.websiteHost;
      const userId = this.userData.userId;
        
      const url = new URL('http://localhost:4000/users/' + userId + '/website/' + website + '/comments/' + commentId);
  
      url.search = new URLSearchParams({ 
        userDocId: this.userData.userDocId,
        userName: this.userData.userName,
        message: message
      });

      await fetch(url, {
        method: "POST",
      })
      .then(data => data.json())
      .then((commentData) => {
          // Dynamically display edited comment to the top of the list 
          let updatedCommentList = this.state.commentList;
          
          // Update timestamp in state instead of retrieving from the database to reduce the number of reads needed
          let matchingComment = updatedCommentList.find((comment) => comment.id == commentId);
          let matchingIndex = updatedCommentList.indexOf(matchingComment);

          // updatedCommentList[matchingIndex].id = commentData.commentId;
          // updatedCommentList[matchingIndex].message = message;
          // updatedCommentList[matchingIndex].timestamp = moment(commentData.timestamp).format('lll');

          matchingComment.id = commentData.commentId;
          matchingComment.message = message;
          matchingComment.timestamp = moment(commentData.timestamp).format('lll');

          matchingComment = updatedCommentList.find((comment) => comment.id == commentData.commentId);

          if (matchingIndex !== 0){
            updatedCommentList.splice(matchingIndex, 1);
            updatedCommentList.unshift(matchingComment);
          }

          this.setState({ commentList: updatedCommentList }, () => 
            console.log("Comment successfully saved.")
          );
        },
        (error) => {
          console.error("Error in saving comment " + commentId + " -> " + error);
        }
      );

      return true;
    }
    else {
      console.log("No message to be saved.");
      return false;
    }
  }

  async deleteComment(commentId) {
    // Deleting a newly added comment that hasn't been saved into the database
    if (!commentId) {
      this.setState(
        (prevState) => ({
          commentList: prevState.commentList.filter((commentItem) => commentItem.id !== commentId)
        })
      );
      return;
    }

    const userId = this.userData.userId;
    const website = this.websiteHost;

    const url = new URL('http://localhost:4000/users/' + userId + '/website/' + website + '/comments/' + commentId);
    url.search = new URLSearchParams({ 
      userDocId: this.userData.userDocId,
    });

    await fetch(url, {
      method: "DELETE",
    })
    .then((res) => {
        if (res.status === 200) {
          // Remove comment from UI
          this.setState(
            (prevState) => ({
              commentList: prevState.commentList.filter((commentItem) => commentItem.id !== commentId)
            })
          );  
        }
        else {
          console.error("Error in deleting comment " + commentId + " -> Status: " + res.status); 
        }
      },
      (error) => {
        console.error("Error in deleting comment " + commentId + " -> " + error);
      }
    );
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
