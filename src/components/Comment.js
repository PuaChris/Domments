import React, { useState } from "react";

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { motion } from 'framer-motion';

import "./styles/comment.scss";


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function Comment(props) {
  const id = props.commentItem.id;
  const userId = props.commentItem.userId;
  const userName = props.commentItem.userName;
  const timestamp = props.commentItem.timestamp;

  const saveComment = props.saveComment;
  const deleteComment = props.deleteComment;

  const [message, setMessage] = useState(props.commentItem.message);
  const [isDeleted, setDeleteStatus] = useState(false);
  const [isCommentSaving, setCommentSavingStatus] = useState(false);

  const classes = useStyles();

  const handleChange = (event) => {
    setMessage(event.target.value);
  }

  const handleSave = async (event) => {
    event.preventDefault();
    if (isCommentSaving === true){
      setCommentSavingStatus(false);
    }
    await saveComment(id, message);
    setCommentSavingStatus(true);

    const timer = setTimeout(() => {
      setCommentSavingStatus(isCommentSaving => !isCommentSaving)
    }, 3000);
    clearTimeout(timer);
  }
  
  const handleDelete = () => {
    setDeleteStatus(true);
    deleteComment(id);
  }

  return (
      <motion.li 
        className={ "comment" }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
          <div className="comment__container">
            <form 
              spellCheck="false"
              noValidate
              autoComplete="off" 
              className="comment__form"
              onSubmit={handleSave} 
            >
              <div className="comment__header-container">
                <span className="comment__timestamp">
                  { timestamp } 
                </span>
                <button
                  className="comment__delete-btn" 
                  type="button" 
                  onClick={handleDelete}>
                    <i class="fas fa-times fa-2x"></i>
                </button>
              </div>
              <div className="comment__message-container">
                <textarea 
                  className="comment__message"
                  onChange={handleChange}
                  // TODO: Add names to comments 
                  // label={userName}
                  defaultValue={message}
                  placeholder="Enter comment here"
                  margin="normal"
                />
              </div>
              <div className="comment__btn-container">
                  <input
                    className="comment__save-btn"
                    type="submit"
                    value="Save"
                  />
              </div>
            </form>

          </div>

      </motion.li>
      
  );
}

export default Comment;
