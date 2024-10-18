import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';  // GitHub Flavored Markdown
import rehypeRaw from 'rehype-raw';  // Allows rendering raw HTML
import DOMPurify from 'dompurify';   // For sanitizing HTML

const Message = ({ sender, text }) => {
  // Sanitize the text to avoid XSS attacks by using DOMPurify
  const sanitizedText = DOMPurify.sanitize(text, { USE_PROFILES: { html: true } });

  return (
    <div className={`message ${sender}`}>
      {/* Allow raw HTML rendering within the Markdown content */}
      <ReactMarkdown 
        children={sanitizedText}
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw]}  // Allows rendering HTML tags
        // We rely on DOMPurify to ensure any raw HTML is sanitized
      />
    </div>
  );
};

export default Message;
