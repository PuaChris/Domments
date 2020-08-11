import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as Constants from "../constants";
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
  const deleteComment = props.deleteComment;

  const [message, setMessage] = useState(null);

  const classes = useStyles();

  const handleChange = (event) => {
    setMessage(event.target.value);
  }

  // Does not actually save the message
  // TODO: Upon submitting, remove focus away from text area and save the comment
  const handleSubmit = (event) => {
    console.log("Comment message saved: " + message);
    event.preventDefault();

    
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
            <TextField
              className="comment__message"
              onChange={handleChange}
              label="<User Name>"
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
