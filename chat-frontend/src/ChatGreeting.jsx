import React, { useState, useEffect } from 'react';
import './ChatGreeting.css';

const sentences = [
  'How can I help you today?',
  'How can Yugm assist you with knowledge today?',
  'Looking for insights? I am here to help!',
  'What knowledge can I retrieve for you today?',
  'Need quick access to company data? Ask away!',
  'I am here to help with all your company-related queries.',
  'Yugm is ready to streamline your knowledge search!',
  'What can I help you uncover in your knowledge base?',
  'Let Yugm simplify your knowledge discovery. Click on Start Conversation now!'
];

const ChatGreeting = ({ userInfo }) => {
  const [username, setUsername] = useState('');
  const [currentSentence, setCurrentSentence] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const typingSpeed = 100;  // Adjusted for smoother effect
  const deletingSpeed = 75; // Slightly faster for smoother deletion
  const pauseBeforeDeleting = 2000; // Pause after typing full sentence
  const pauseBeforeTypingNext = 500; // Pause before typing next sentence

  useEffect(() => {
    if (userInfo && userInfo.username) {
      setUsername(userInfo.username);
    } else {
      setUsername('User');
    }
  }, [userInfo]);

  useEffect(() => {
    const handleTyping = () => {
      const current = sentences[loopIndex % sentences.length];

      if (!isDeleting) {
        // Typing the sentence
        if (charIndex < current.length) {
          setCurrentSentence(current.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          // Pause before starting to delete
          setTimeout(() => setIsDeleting(true), pauseBeforeDeleting);
        }
      } else {
        // Deleting the sentence
        if (charIndex > 0) {
          setCurrentSentence(current.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        } else {
          // Move to the next sentence
          setIsDeleting(false);
          setLoopIndex((prev) => prev + 1);
          setTimeout(() => setCharIndex(0), pauseBeforeTypingNext);
        }
      }
    };

    const timeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, loopIndex]);

  return (
    <div className="greeting-container">
      <h1 className="greeting-text">
        Hello!
        {/* <span className="username">{username}</span> */}
      </h1>
      <p className="subtext">{currentSentence}&nbsp;<span className="caret"></span></p> {/* Adding caret here */}
    </div>
  );
};

export default ChatGreeting;
