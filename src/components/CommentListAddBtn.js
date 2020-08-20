import React from "react";

import { motion } from 'framer-motion';

import "./styles/comment-list__add-btn.scss";

const CommentListAddBtn = ({ addComment }) => (
  <motion.button 
    whileHover={{ scale: 1.15 }}
    whileTap={{ scale: 0.8 }}
    type="button" 
    className="comment-list__add-btn" 
    onClick={addComment}>
    +
  </motion.button>
);

export default CommentListAddBtn;
