import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import ContactDetailsPopup from '../Components/ContactDetailsPopup';

const ContactContext = createContext();

export const useContact = () => useContext(ContactContext);

export const ContactProvider = ({ children }) => {
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [hasValidContact, setHasValidContact] = useState(false);
  const [contactDetails, setContactDetails] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const [transactionCallback, setTransactionCallback] = useState(null);

  // Get token function
  const getToken = () => {
    try {
      const googleAuth = localStorage.getItem('google');
      const jwtAuth = localStorage.getItem('jwt');
      
      if (googleAuth) {
        const parsedAuth = JSON.parse(googleAuth);
        return parsedAuth.token;
      } else if (jwtAuth) {
        const parsedAuth = JSON.parse(jwtAuth);
        return parsedAuth.token.token || parsedAuth.token;
      }
      return null;
    } catch (e) {
      console.error('Error retrieving token:', e);
      return null;
    }
  };

  // Check if user has valid contact details
  const checkContactStatus = async () => {
    setIsChecking(true);
    
    try {
      const token = getToken();
      if (!token) {
        setHasValidContact(false);
        setIsChecking(false);
        return;
      }

      const response = await axios.get(
        'http://localhost:8080/check-contact',
        { headers: { 'Authorization': token } }
      );

      setHasValidContact(response.data.has_valid_contact);
      setContactDetails(response.data.contact_details);
    } catch (err) {
      console.error('Error checking contact status:', err);
      setHasValidContact(false);
    } finally {
      setIsChecking(false);
    }
  };

  // Initialize check
  useEffect(() => {
    const token = getToken();
    if (token) {
      checkContactStatus();
    } else {
      setIsChecking(false);
    }
  }, []);

  // Request contact update
  const requestContactUpdate = (callback = null) => {
    if (callback) {
      setTransactionCallback(() => callback);
    }
    setShowContactPopup(true);
  };

  // Handle update success
  const handleUpdateSuccess = (contact) => {
    setHasValidContact(true);
    setContactDetails(contact);
    setShowContactPopup(false);
    
    // Call callback if exists
    if (transactionCallback) {
      setTimeout(() => {
        transactionCallback();
        setTransactionCallback(null);
      }, 300);
    }
  };

  // Close popup
  const closeContactPopup = () => {
    setShowContactPopup(false);
    setTransactionCallback(null);
  };

  return (
    <ContactContext.Provider 
      value={{ 
        hasValidContact, 
        contactDetails, 
        isChecking,
        requestContactUpdate,
        checkContactStatus
      }}
    >
      {children}
      {showContactPopup && (
        <ContactDetailsPopup 
          onClose={closeContactPopup} 
          onUpdateSuccess={handleUpdateSuccess}
          currentContact={contactDetails}
        />
      )}
    </ContactContext.Provider>
  );
};