import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentQuery, setCurrentQuery] = useState(''); // Track current active query

  const handleSearch = (items, query) => {
    const search = query.toLowerCase();
    setCurrentQuery(query);
    const filtered = items.filter(item => 
      item.Title?.toLowerCase().includes(search) ||
      item.Description?.toLowerCase().includes(search) ||
      item.hostel?.toLowerCase().includes(search) 
    );
    setSearchResults(filtered);
  };

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      setSearchQuery, 
      searchResults,
      currentQuery,
      handleSearch 
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
