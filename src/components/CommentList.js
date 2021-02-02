import React, { Component } from "react";

import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { motion, AnimatePresence } from 'framer-motion';

import Comment from "./Comment";
import * as Constants from '../helper/constants';
import { createCommentObj } from '../helper/createCommentObj';

import "./styles/comment-list.scss";

class CommentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mounted: false,
      isUserLoggedIn: false,
      userData: {
        userDocId: null,
        userId: null,
        userName: null,
      },
      websiteHost: window.location.host,
      commentList: [],
    };

    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);

    this.addComment = this.addComment.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  async componentDidMount() {
    this.setState({
      mounted: true
    });
  }

  async initializeUser() {
    const { userId } = this.state.userData;
    const url = new URL(`http://localhost:4000/users/${userId}`);
    await fetch(url, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(
        (result) => {
          if (result === null || result === undefined) {
            return;
          }
          this.setState({
            isUserLoggedIn: true,
            userData: {
              userDocId: result.userDocId,
              userName: result.userDocData.username,
            }
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.error(`Error in retrieving user data -> ${error}`);
        }
      );
  }

  handleLoginChange(event) {
    this.setState({
      userData: {
        userId: event.target.value
      }
    });
  }

  async handleLoginSubmit(event) {
    console.log(`Processing login...`);
    const { userId } = this.state.userData;

    if (userId && userId !== "") {
      event.preventDefault();

      // Retrieve user data from database
      await this.initializeUser();

      if (this.state.isUserLoggedIn) {
        console.log(`Login complete. Requesting comments...`);
        this.getComments();
      }
    }
    else {
      console.log(`Invalid userId.`);
    }
  }

  async getComments() {
    const { userId, userDocId, userName } = this.state.userData;
    const website = this.state.websiteHost;

    const url = new URL(`http://localhost:4000/users/${userId}/website/${website}/comments`);
    url.search = new URLSearchParams({
      userDocId: userDocId,
      userName: userName,
    });

    await fetch(url, {
      method: "GET",
    })
      .then(data => data.json())
      .then((commentList) => {
        this.setState({ commentList: commentList }, () =>
          console.log(`Retrieved ${commentList.length} comments for ${website} \n`),
        );
      },
        (error) => {
          console.error(`Error in retrieving comment data -> ${error}`);
        }
      );
  }

  async addComment() {
    const { userId, userDocId, userName } = this.state.userData;
    const website = this.state.websiteHost;

    const url = new URL(`http://localhost:4000/users/${userId}/website/${website}/comments/newid`);
    url.search = new URLSearchParams({
      userDocId: userDocId,
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
          console.error(`Error in retrieving new comment ID ->  ${error}`);
        }
      );

    const commentListItem = createCommentObj(
      commentId,
      userId,
      userName,
      emptyMessage,
      emptyTimestamp
    );

    // Using `unshift` to push a newly added comment to the front of the array and display comments in that order
    let newCommentList = this.state.commentList;
    newCommentList.unshift(commentListItem);

    this.setState({ commentList: newCommentList }, () =>
      console.log(`Successfully added new comment.`)
    );
  }

  async saveComment(commentId, message) {
    if (message && message !== "") {
      const { userId, userDocId, userName } = this.state.userData;
      const website = this.state.websiteHost;

      const url = new URL('http://localhost:4000/users/' + userId + '/website/' + website + '/comments/' + commentId);

      url.search = new URLSearchParams({
        userDocId: userDocId,
        userName: userName,
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
          let matchingComment = updatedCommentList.find((comment) => comment.id === commentId);
          let matchingIndex = updatedCommentList.indexOf(matchingComment);

          matchingComment.id = commentData.commentId;
          matchingComment.message = message;
          matchingComment.timestamp = moment(commentData.timestamp).format('lll');

          matchingComment = updatedCommentList.find((comment) => comment.id === commentData.commentId);

          if (matchingIndex !== 0) {
            updatedCommentList.splice(matchingIndex, 1);
            updatedCommentList.unshift(matchingComment);
          }

          this.setState({ commentList: updatedCommentList }, () =>
            console.log(`Comment successfully saved.`)
          );
        },
          (error) => {
            console.error(`Error in saving comment ${commentId} -> ${error}`);
          }
        );

      return true;
    }
    else {
      console.log(`No message to be saved.`);
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

    const { userId, userDocId } = this.state.userData;
    const website = this.state.websiteHost;

    const url = new URL('http://localhost:4000/users/' + userId + '/website/' + website + '/comments/' + commentId);
    url.search = new URLSearchParams({
      userDocId: userDocId
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
          console.error(`Error in deleting comment ${commentId} -> Status: ${res.status}`);
        }
      },
        (error) => {
          console.error(`Error in deleting comment ${commentId} -> ${error}`);
        }
      );
  }

  render() {
    let { mounted, isUserLoggedIn, commentList } = this.state;
    const CommentListAddBtnVariants = Constants.CommentListAddBtnVariants;

    if (!isUserLoggedIn) {
      return (
        <div className="comment-list__container">
          <motion.div
            className="comment-list__login-container"
            initial={false}
            animate={mounted ? "show" : "hide"}
          >
            <form
              className="comment-list__login-form"
              noValidate
              autoComplete="off"
              onSubmit={this.handleLoginSubmit}
            >
              <div className="comment-list__login-form-container">
                <div className="comment-list__login-form-username-container">
                  <div className="comment-list__login-form-username-header">
                    <span>Username</span>
                  </div>
             
                  <input
                    className="comment-list__login-form-username"
                    onChange={this.handleLoginChange}
                    label="Login"
                    placeholder="Enter new/existing username here"
                  />
                </div>

                <input
                  className="comment-list__login-btn"
                  type="submit"
                  value="Login"
                />
              </div>
            </form>
          </motion.div>
        </div>
      )
    }

    else {
      return (
        <div className="comment-list__container">
          <motion.div
            className="comment-list__btn-container"
            initial={false}
            animate={mounted ? "show" : "hide"}
            variants={CommentListAddBtnVariants}
          >
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.8 }}
              type="button"
              className="comment-list__add-btn"
              onClick={this.addComment}>
              +
            </motion.button>
          </motion.div>

          {/* Rendering all of the comments */}
          <div className="comment-list__comments">
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
}

export default CommentList;
