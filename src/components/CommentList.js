import React, { Component } from "react";
import uuid from "react-uuid";
import "./styles/comment-list.scss";

import Firebase from '../firebase-init';
import "firebase/firestore";

import Comment from "./Comment";
import CommentListAddBtn from "./CommentListAddBtn";
import * as Constants from '../helper/constants';
import { getTimestamp } from '../helper/timestamp';

class CommentList extends Component {
  constructor(props) {
    super(props);

    // ? Do I not care about the order of the comments (array) or do I want to keep it the same order (not array)?
    this.state = {
      commentList: [],
      isUserLoggedIn: false
    };

    this.addComment = this.addComment.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  componentDidMount(){
    this.initializeDb();
  }

  async initializeDb(){
    // Checking to see if user exists and getting their ID to be used for referencing when adding a new comment
    const users = Firebase.firestore().collection("users");

    let userDocId = await this.getUser(users)
      .catch((error) => {
        console.error("Error in trying to get current user's Document reference: " + error);
      });

    // Check user's collection of websites 
    // TODO: See what website the user is currently on and check that against the website collection
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

  async addComment() {
    // TODO: When adding a new user, use this newId
    const newId = uuid();
    const newComment = {
      id: newId,
    };

    // Using concat to create a new array with the new comment
    this.setState(
      (prevState) => ({
        commentList: prevState.commentList.concat(newComment),
      }), () => console.log("Successfully added new comment!"),
    );
    
  }

 /*
 1. User has a comment they want to save. It is stored in 'message' hook. 
 2. User presses 'Comment' button. handleSubmit() is called. 
 3. saveComment() is passed down from CommentList.js -> Comment.js so it can be called inside handleSubmit()
 4. saveComment() takes in the Comment ID and message (so we know which Comment we're saving the message too)
 5. We already checked for the user auth upon start up just add the user's name as the commenter
 * 6. Inside saveComment(), it's going to save the ID, message, user, and timestamp as a comment
 */


  // TODO: Check which website they are currently on and add a comment in a sub-collection
  // TODO: If collection does not exist, make a new one -> How to do this?
  // TODO: If website does not exist in the collection, add a new one using .set()

  // TODO: Check to see if commentId already exists because that means it's an edit
  async saveComment(commentId, message) {
    if (message) {
      let timestamp = getTimestamp();

      // ? Still unsure if I should add "commentId: commentId" as a field since the ID of the document is being set to the commentId
      let commentData = {
        userId: this.userDocData.userid,
        userName: this.userDocData.username,
        message: message,
        timestamp: timestamp
      };

      // Promise returns void
      await this.websiteCollection.doc(Constants.TestWebsite).collection("comments").doc(commentId).set(commentData)
      .catch((error) => {
        console.error("Error in adding new comment: " + error);
        return false;
      });

      // Successfully resolved promise
      console.log("Comment successfully saved.");
      return true;
    }
    else {
      console.log("No message to be saved.");
      return false;
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

  render() {
    const { commentList } = this.state;
    return (
      <div className="comment-list">
        <div className="comment-list__btn--space">
          <CommentListAddBtn addComment={this.addComment} />
        </div>

        {/* Rendering all of the comments */}
        {commentList.map((comment) => (
          <Comment 
            key={comment.id}
            id={comment.id} 
            deleteComment={this.deleteComment} 
            saveComment={this.saveComment} 
          />
        ))}
      </div>
    );
  }
}

export default CommentList;
