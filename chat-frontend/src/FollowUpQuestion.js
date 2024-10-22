import React from 'react';

const FollowUpQuestion = ({ question, onClick }) => {
  return (
    <button className="follow-up-question" onClick={onClick}>
      {question}
    </button>
  );
};

export default FollowUpQuestion;