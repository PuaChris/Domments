import React, { Component } from "react";
import "./styles/comment-list.scss";

import Firebase from '../firebase-init';
import "firebase/firestore";
import { firestore } from "firebase";

import moment from 'moment';

import Comment from "./Comment";
import CommentListAddBtn from "./CommentListAddBtn";
import * as Constants from '../helper/constants';
import { createCommentObj } from '../helper/createCommentObj';

class CommentList extends Component {
  constructor(props) {
    super(props);

    // ? Do I not care about the order of the comments (array) or do I want to keep it the same order (not array)?
    this.state = {
      commentList: [],
      isUserLoggedIn: false
    };

    this.userDocRef = null;
    this.userDocData = null;
    this.websiteCollection = null;

    this.addComment = this.addComment.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  async componentDidMount() {
    await this.initializeDb();
    this.getComments();
  }

  async initializeDb() {
    // Checking to see if user exists and getting their ID to be used for referencing when adding a new comment
    const users = Firebase.firestore().collection("users");

    let userDocId = await this.getUser(users)
      .catch((error) => {
        console.error("Error in trying to get current user's Document reference: " + error);
      });

    // Check user's collection of websites 
    // TODO: See what website the user is currently on and check that against the website collection
    // TODO: Get doc reference to the user's current website for easier referencing
    if (userDocId) {
      this.setState({
        isUserLoggedIn: true
      });

      this.userDocRef = users.doc(userDocId);
      this.userDocData = (await this.userDocRef.get()).data();

      this.websiteCollection = this.userDocRef.collection("websites");

      let querySnapshot = await this.websiteCollection.get()
        .catch((error) => {
          console.error("Error in getting user's 'websites' collection: " + error);
        });

        if (querySnapshot.empty) {
          console.log("User has no websites in their collection.");
        }
        else {
          console.log("User has websites in their collection.");
        }

    }
    else {
      console.log("User does not exist");
    }
  }

  // Retriving Document ID of current user
  async getUser(users) {
    let docId = null;

    let querySnapshot = await users.where("userid", "==", Constants.TestUserId)
      .get()
      .catch(function(error) {
        console.error("Error getting documents: ", error);
      });

    // Should only return one user
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      docId = doc.id;
    });

    return docId;
  }

  async getComments() {
    // Checks which website they are on and pull comments 
    let website = Constants.TestWebsite;
    let commentList = [];

    // Retrieve all comments sorted by their timestamps in descending order (i.e. most recent displayed on top)
    let allCommentsFromDb = await this.websiteCollection.doc(website).collection("comments").orderBy('timestamp','desc').get();
    allCommentsFromDb.forEach((doc) => {
      let commentListItem = createCommentObj (
        doc.id, 
        this.userDocData.userid, 
        this.userDocData.username,
        doc.data().message, 
        moment(doc.data().timestamp.toMillis()).format('lll') // Format e.g. Aug 17, 2020 3:42 PM
      );
      
      commentList.push(commentListItem);
    });

    this.setState(() => ({
        commentList: commentList
      }), () => console.log("Retrieved " + commentList.length + " comments from: " + website),
    );
  }

  async addComment() {
    const newCommentId = await this.websiteCollection.doc(Constants.TestWebsite).collection("comments").doc().id;
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

    this.setState((prevState) => ({
        commentList: newCommentList
      }), () => console.log("Successfully added new comment."),
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

  // TODO: Check which website they are currently on and add a comment in a sub-collection
  // TODO: If website does not exist in the collection, add a new one using .set()
  // TODO: Check to see if commentId already exists because that means it's an edit
  async saveComment(id, message) {
    if (message) {
      const currentTimestamp = firestore.Timestamp.now();

      // No need to save ID because it's automatically generated by Firestore as the key, which is what is used to identify each unique comment
      await this.websiteCollection.doc(Constants.TestWebsite).collection("comments").doc(id).set({
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
      updatedCommentList.forEach((comment, index) => {
        if (comment.id === id) {
          comment.timestamp = moment(currentTimestamp.toMillis()).format('lll');
          updatedCommentList.splice(index, 1);
          updatedCommentList.unshift(comment);
        }
      });

      this.setState(
        (prevState) => ({
          commentList: updatedCommentList
        })
      );

      console.log("Comment successfully saved.");
      return true;
    }
    else {
      console.log("No message to be saved.");
      return false;
    }
  }

  async deleteComment(id) {
    this.setState(
      (prevState) => ({
        commentList: prevState.commentList.filter((commentItem) => commentItem.id !== id)
      })
    );

    let commentRef = await this.websiteCollection.doc(Constants.TestWebsite).collection("comments").doc(id).get()
      .catch((error) => {
        console.error("Error in retrieving document to be deleted: " + error);
      });
      
    if (commentRef) {
      await this.websiteCollection.doc(Constants.TestWebsite).collection("comments").doc(id).delete()
        .catch((error) => {
          console.error("Error in deleting document from database: " + error);
        });
      console.log("Comment " + id + " successfully deleted.");
    }

    console.log("CommentList: " + this.state.commentList);
  }


  render() {
    const { commentList } = this.state;
    return (
      <div className="comment-list">
        <div className="comment-list__btn--space">
          <CommentListAddBtn addComment={this.addComment} />
        </div>

        {/* Rendering all of the comments */}
        {commentList.map((commentItem) => (
          <Comment 
            key={commentItem.id}
            id={commentItem.id} 
            userId={commentItem.userId}
            userName={commentItem.userName}
            message={commentItem.message}
            timestamp={commentItem.timestamp}
            deleteComment={this.deleteComment} 
            saveComment={this.saveComment} 
          />
        ))}
      </div>
    );
  }
}

export default CommentList;
