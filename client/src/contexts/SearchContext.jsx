import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = (items, query = searchQuery) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    const results = items.filter(item => 
      item.Title.toLowerCase().includes(query.toLowerCase()) ||
      item.Description.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      setSearchQuery, 
      searchResults, 
      setSearchResults,
      handleSearch 
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
