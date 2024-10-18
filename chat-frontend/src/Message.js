import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';  // GitHub Flavored Markdown
import rehypeRaw from 'rehype-raw';  // Allows rendering raw HTML

const Message = ({ sender, text }) => {
  return (
    <div className={`message ${sender}`}>
      {/* Allow raw HTML rendering within the Markdown content */}
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw]}  // Allows rendering HTML tags
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default Message;
