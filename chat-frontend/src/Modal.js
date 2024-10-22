import React from 'react';
import './Modal.css';
import { FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const Modal = ({ session, onClose }) => {
  if (!session) return null; // Return null if there's no session data

  const lastConversation = session.conversations;

  // Get the human question and bot response
  const humanQuestion = lastConversation.find(conv => conv.type === 'human')?.data.content;
  const botResponse = lastConversation.find(conv => conv.type === 'ai')?.data.content;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Interaction Summary</h2>
        <span className="close-icon" onClick={onClose}>
          <FaTimes />
        </span>
        <div className="modal-question-response">
          <p><strong>Question :</strong> {humanQuestion}</p>
          <p><strong>Response from YUGM🚀 :</strong></p>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {botResponse}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Modal;
