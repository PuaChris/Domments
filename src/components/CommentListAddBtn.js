import React from "react";
import "./styles/comment-list__add-btn.scss";

const CommentListAddBtn = ({ addComment }) => (
  <button type="button" className="comment-list__add-btn" onClick={addComment}>
    +
  </button>
);

export default CommentListAddBtn;
