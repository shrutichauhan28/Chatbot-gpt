import { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";

const Skull = (props) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('preferredDarkMode') === 'true' ? 'dark' : 'light';
    setTheme(storedTheme);
  }, []);

  const backgroundColor = theme === 'dark' ? '#1e293b' : '#CCFAF9';
  const foregroundColor = theme === 'dark' ? '#155e75' : '#2C3E50';
  
  return (
    <ContentLoader
      viewBox="0 0 400 40" // Set a fixed viewBox size
      backgroundColor={backgroundColor}
      foregroundColor={foregroundColor}
      {...props}
      style={{ width: '100%', height: '40px' }} // Set fixed width and height
    >
      <circle cx="20" cy="20" r="8" />
      <rect x="40" y="12" rx="5" ry="5" width="200" height="10" />
      <rect x="40" y="29" rx="5" ry="5" width="100" height="10" />
    </ContentLoader>
  );
};

export default Skull;