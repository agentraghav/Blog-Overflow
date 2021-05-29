import React from 'react';
import PropTypes from 'prop-types';

const Comment = (props) => {
  return (
    <div className="comment">
      <p>
        <span>
          <img
            src={`https://avatars.dicebear.com/v2/jdenticon/:${props.img}.svg`}
            alt="jdenticon"
          />
        </span>
        <span className="comment-body">{props.comment}</span>
      </p>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
};

export default Comment;
