import React, { useState, useEffect, useRef } from 'react';
import languagesData from '../../data/languages.json';
import styles from './index.module.css';
import { utils } from '../../utils';

const LanguageDropdown = ({ isMobile = false }) => {
  const [currentLanguage, setCurrentLanguage] = useState(utils.getLanguage());
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);


  const handleLanguageChange = (language) => {
    setCurrentLanguage(language.value);
    utils.setLanguage(language.value);
    setIsOpen(false);
    
    // Optional: Reload page to apply language changes
    window.location.reload();
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getCurrentLanguageLabel = () => {
    const current = languagesData.find(lang => lang.value === currentLanguage);
    return current ? current.label : 'English';
  };

  return (
    <div className={`${styles.languageDropdown} ${isMobile ? styles.mobile : ''}`} ref={dropdownRef}>
      <button
        className={`${styles.dropdownButton} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span className={styles.languageIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m480-80-40-120H160q-33 0-56.5-23.5T80-280v-520q0-33 23.5-56.5T160-880h240l35 120h365q35 0 57.5 22.5T880-680v520q0 33-22.5 56.5T800-80H480ZM286-376q69 0 113.5-44.5T444-536q0-8-.5-14.5T441-564H283v62h89q-8 28-30.5 43.5T287-443q-39 0-67-28t-28-69q0-41 28-69t67-28q18 0 34 6.5t29 19.5l49-47q-21-22-50.5-34T286-704q-67 0-114.5 47.5T124-540q0 69 47.5 116.5T286-376Zm268 20 22-21q-14-17-25.5-33T528-444l26 88Zm50-51q28-33 42.5-63t19.5-47H507l12 42h40q8 15 19 32.5t26 35.5Zm-84 287h280q18 0 29-11.5t11-28.5v-520q0-18-11-29t-29-11H447l47 162h79v-42h41v42h146v41h-51q-10 38-30 74t-47 67l109 107-29 29-108-108-36 37 32 111-80 80Z"/></svg>
        </span>
        <span className={styles.languageText}>
          {getCurrentLanguageLabel()}
        </span>
        <span className={`${styles.dropdownArrow} ${isOpen ? styles.rotated : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {languagesData.map((language) => (
            <button
              key={language.value}
              className={`${styles.dropdownItem} ${currentLanguage === language.value ? styles.selected : ''}`}
              onClick={() => handleLanguageChange(language)}
              role="option"
              aria-selected={currentLanguage === language.value}
            >
              {/* <span className={styles.languageFlag}>
                {language.value === 'en' ? '🇺🇸' : '🇮🇳'}
              </span> */}
              <span className={styles.languageLabel}>
                {language.label}
              </span>
              {currentLanguage === language.value && (
                <span className={styles.checkmark}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
