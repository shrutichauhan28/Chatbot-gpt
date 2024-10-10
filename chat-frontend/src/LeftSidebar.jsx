// LeftSidebar.js
import React from 'react';
import { BiMessageAlt, BiBookmark } from "react-icons/bi";
// import { CiSaveUp1 } from "react-icons/ci";
import { BsClockHistory } from "react-icons/bs";
import './LeftSidebar.css';
import { v4 as uuidv4 } from 'uuid';  // Add UUID generator





const LeftSidebar = ({ isLeftSidebarOpen,handleNewChat }) => {

  const handleNewChatClick = () => {
    const newSessionId = uuidv4();  // Generate a new session ID
    handleNewChat(newSessionId);  // Pass the new session ID back to parent
  };
  return (
    <aside className={`left-sidebar ${!isLeftSidebarOpen ? 'collapsed' : ''}`}>
      <button className="glow-on-hover" onClick={handleNewChatClick} >
        <BiMessageAlt /> New Chat
      </button>
      <button className="glow-on-hover">
        <BiBookmark /> Saved
      </button>
      <button className="glow-on-hover">
        <BsClockHistory /> History
      </button>
    </aside>
  );
};

export default LeftSidebar;




// import React from 'react';
// import './LeftSidebar.css';

// // Sidebar component for managing chat sessions and other sidebar functionalities
// const LeftSidebar = ({ isLeftSidebarOpen, handleNewChat }) => {
//   return (
//     <div className={`left-sidebar ${isLeftSidebarOpen ? 'open' : ''}`}>
//       <button className="new-chat-button" onClick={handleNewChat}>
//         New Chat
//       </button>
      
//       {/* Add any additional sidebar functionalities here, like a list of past chat sessions */}
//       <div className="chat-sessions">
//         <h4>Recent Chats</h4>
//         {/* Map through chat sessions if you want to list them */}
//         {/* Example: 
//         chatSessions.map((sessionId) => (
//           <div key={sessionId} className="chat-session-item">
//             <Link to={`/chat/${sessionId}`}>Chat {sessionId}</Link>
//           </div>
//         ))
//         */}
//       </div>
//     </div>
//   );
// };

// export default LeftSidebar;
