import React, { Component } from 'react';
import './styles/comment-pane.scss';

class CommentPane extends Component {
    render() {
        return(
            <div className="comment-pane">
                <header classname="comment-pane-header">
                    This is the comment pane.
                </header>
            </div>
        );
    }
}

export default CommentPane;