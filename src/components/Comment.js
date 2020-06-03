import React, { Component } from 'react';
import * as Constants from '../constants.js';
import CommentResolveBtn from './CommentResolveBtn.js';
import './styles/comment.scss';

class Comment extends Component {
    commenter = null;

    constructor(props){
        super(props);
        this.state = { 
            message: Constants.TestCommentMessage,
            isResolved: false,
            isDeleted: false
        }
        this.handleResolve = this.handleResolve.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleResolve() {
        const isResolved = this.state.isResolved;

        if (!isResolved){
            this.setState(() => {
                return { isResolved: true }
            });
        }
        else {
            this.setState(() => {
                return { isResolved: false }
            });
        }
    }

    handleDelete() {
        this.setState(() => {
            return { isDeleted: true }
        });
    }

    render() {
        const message = this.state.message;
        const isResolved = this.state.isResolved;
        return(
            <div className="comment"> 
                <div className="comment__message">
                    { message } 
                </div>

                <CommentResolveBtn isResolved={isResolved} handleResolve={this.handleResolve}/>
                <div className="comment__delete-btn">

                </div>
            </div>
        );
    }
}

export default Comment;