import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';  // GitHub Flavored Markdown
import rehypeRaw from 'rehype-raw';  // Allows rendering raw HTML

const Message = ({ sender, text }) => {
  return (
    <div className={`message ${sender}`}>
      {/* If text is a string, use ReactMarkdown; if it's a component, render it directly */}
      {typeof text === 'string' ? (
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}  // Allows rendering HTML tags
        >
          {text}
        </ReactMarkdown>
      ) : (
        text // Directly render if it's not a string (like the Skull loader)
      )}
    </div>
  );
};

export default Message;
