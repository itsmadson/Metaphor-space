import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = {
    isDarkMode,
    colors: {
      background: isDarkMode ? '#2A201C' : '#F5F0E6',
      card: isDarkMode ? '#3E2723' : '#D7CCC8',
      text: isDarkMode ? '#EFEBE0' : '#3E2723',
      accent: '#A1887F',
      border: isDarkMode ? '#5D4037' : '#BCAAA4'
    },
    toggleTheme: () => setIsDarkMode(!isDarkMode),
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};