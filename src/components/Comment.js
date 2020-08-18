import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
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
  const id = props.id;
  const userId = props.userId;
  const userName = props.userName;
  const timestamp = props.timestamp;

  const saveComment = props.saveComment;
  const deleteComment = props.deleteComment;

  const [message, setMessage] = useState(props.message);

  const classes = useStyles();

  const handleChange = (event) => {
    setMessage(event.target.value);
  }


  // Does not actually save the message
  // TODO: Upon submitting, remove focus away from text area and save the comment
  const handleSubmit = (event) => {
    if (!message || message != "") {
      event.preventDefault();
      
      saveComment(id, message);
    }

    // TODO: Handle of message is empty
  }
  
  const onClick = () => {
    deleteComment(id);
  }

  return (
      <div className="comment">
        <form 
          className={classes.root} 
          noValidate autoComplete="off" 
          onSubmit={handleSubmit}
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
        <button type="button" onClick={onClick}>
          <i className="far fa-trash-alt" />
        </button>
      </div>
  );
}

export default Comment;
