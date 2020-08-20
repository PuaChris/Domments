import React, { useState } from "react";

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { motion } from 'framer-motion';

import * as Constants from "../helper/constants";
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

  // TODO: Upon submitting, remove focus away from text area
  const handleSave = async (event) => {
    if (!message || message != "") {
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

    // TODO: Handle of message is empty
  }
  
  const handleDelete = () => {
    setDeleteStatus(true);
    deleteComment(id);
  }

  return (
      <motion.li 
        className={isCommentSaving ? "comment__highlight" : "comment" }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
          <div>
            <form 
              className={classes.root} 
              noValidate autoComplete="off" 
              onSubmit={handleSave} 
            >
              { timestamp } 
              <TextField
                className="comment__message"
                onChange={handleChange}
                label={userName}
                defaultValue={message}
                placeholder="Enter comment here"
                multiline
                margin="normal"
                size="small"
                rows={4}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <input
                type="submit"
                value="Comment"
              />
            </form>

            <button type="button" onClick={handleDelete}>
              <i className="far fa-trash-alt" />
            </button>
          </div>

      </motion.li>
      
  );
}

export default Comment;
