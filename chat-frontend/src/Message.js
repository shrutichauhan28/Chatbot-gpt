import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';  // GitHub Flavored Markdown

const Message = ({ sender, text }) => {
  return (
<<<<<<< HEAD
    <div className={`message ${sender}`}>
=======
    <div className={message ${sender}}>
>>>>>>> ceef0692f9bf6c64d7f1bd46b31393f366128108
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default Message;