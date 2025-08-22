import { useNavigate, useSearchParams } from 'react-router-dom';
import noBgColorLogo from "../../assets/noBgColor.png";
import { useState, useEffect, useRef } from 'react';
import { Loader } from '../../components';
import styles from './index.module.css';
import pkg from '../../../package.json';
import { utils } from '../../utils';

export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [searchParams] = useSearchParams();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleStandSelect = async (stand) => {
    setIsDropdownOpen(false);
    setIsNavigating(true);
    
    // Navigate to the bus schedule page
    navigateToBusSchedule(stand.value);
  };

  const navigateToBusSchedule = (stand) => {
    if(stand){
      navigate(`${pkg.homepage}/${stand}`);
    }
  }

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    let stand = searchParams.get("stand");
    if(stand && utils.checkIfStandDataExist(stand)) {
      navigateToBusSchedule(stand);
    }

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
            <h1 className={styles.tagline}>Never miss your ride</h1>
            <p className={styles.subtitle}>
              Find bus schedules, catch the first or last bus on time, and more for your destination
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
                    {utils.getStands().map((stand, index) => (
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
