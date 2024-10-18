import React from 'react';

const SuggestionCard = ({ suggestion, onClick }) => {
  return (
    <div className="suggestion-card" onClick={() => onClick(suggestion)}>
      <div className="icon">{/* Add your icon here */}</div>
      <div className="text">{suggestion.text}</div>
    </div>
  );
};

export default SuggestionCard;
