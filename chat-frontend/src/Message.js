import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const Message = ({ sender, text, sources }) => {
  return (
    <div className={`message ${sender}`}>
      {/* Display the main text or message */}
      {typeof text === 'string' ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {text}
        </ReactMarkdown>
      ) : (
        text
      )}

      {/* Display sources if they exist */}
      {sources && sources.length > 0 && (
        <div className="source-container">
          <strong>Sources:</strong>
          <ul className="source-list">
            {sources.map((source, index) => (
              <li key={index} className="source-card">
                <a href={source} className="source-link" target="_blank" rel="noopener noreferrer">
                  Source {index + 1}: {source.split('/').pop()}  {/* Extract file name from the link */}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Message;
