import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');

    // If the user has selected a theme manually, use it
    if (saved !== null) {
      return saved === 'true';
    }

    // Otherwise, follow system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply or remove dark-mode class on the body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Only update automatically if user hasn't manually overridden
      const locked = localStorage.getItem('themeLocked');
      if (!locked) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // When user manually toggles
  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);

    // Save the manual choice
    localStorage.setItem('darkMode', newValue);
    localStorage.setItem('themeLocked', 'true');
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
