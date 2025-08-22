import { useState, useEffect, useRef } from 'react';
import noBgColorLogo from "../assets/noBgColor.png";
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import standsData from '../data/stands.json';
import styles from './Home.module.css';

export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleStandSelect = async (stand) => {
    setIsDropdownOpen(false);
    setIsNavigating(true);
    
    // Navigate to the bus schedule page
    navigate(`/bus/${stand.value}`);
  };

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isNavigating) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.backgroundOverlay}></div>
      </div>
      
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}>
            <img src={noBgColorLogo} alt="LastBusX" className={styles.logo}/>
            <p className={styles.subtitle}>
              Find bus schedules, catch the last bus on time, and more for your destination
            </p>
          </div>

          <div className={styles.searchSection}>
            <div className={styles.dropdownContainer}>
              <label htmlFor="stand-select" className={styles.label}>
                Select Bus Stand
              </label>
              
              <div className={styles.dropdownWrapper} ref={dropdownRef}>
                <button
                  className={`${styles.dropdownButton} ${isDropdownOpen ? styles.active : ''}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="listbox"
                >
                  <span className={styles.dropdownText}>
                    Choose a bus stand...
                  </span>
                  <span className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.rotated : ''}`}>
                    ▼
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    {standsData.map((stand, index) => (
                      <button
                        key={stand.value}
                        className={styles.dropdownItem}
                        onClick={() => handleStandSelect(stand)}
                        role="option"
                      >
                        {stand.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.instructionCard}>
              <div className={styles.infoCard}>
                <h3>How to Use</h3>
                <p>Select a bus stand from the dropdown above to view available bus schedules and routes.</p>
                <div className={styles.features}>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>⏰</span>
                    <span>Real-time schedules</span>
                  </div>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>🚌</span>
                    <span>Bus details</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
