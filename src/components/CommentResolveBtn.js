import React from "react";
import "./styles/comment__resolve-btn.scss";

const CommentResolveBtn = ({ isResolved, handleResolve }) => (
  <button type="button" className="comment__resolve-btn" onClick={handleResolve}>
    { !isResolved ? "Resolve" : "This comment has been marked as resolved" }
  </button>
);

export default CommentResolveBtn;
