import { useParams, useNavigate } from 'react-router-dom';
import noBgColorLogo from "../../assets/noBgColor.png";
import { useState, useEffect, useRef } from 'react';
import { Loader } from '../../components';
import styles from './index.module.css';
import pkg from '../../../package.json';
import { utils } from '../../utils';

export default function BusSchedule() {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState('early'); // 'early' or 'late'
  const [selectedStand, setSelectedStand] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sortDropdownRef = useRef(null);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const { selected } = params;
    
    // Find the selected stand from the data
    const stand = utils.getStand(selected);
    
    if (!utils.checkIfStandDataExist(selected)) {
      // If stand not found, redirect to home
      navigate(pkg.homepage);
      return;
    }
    
    setSelectedStand(stand);
    
    // Fetch bus schedule data directly from JSON file
    fetchBusSchedules(selected);

    let title = `${stand.label} - LastBusX - AK`;
    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', title);
    }
  }, [params, navigate]);

  // Handle clicking outside sort dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchBusSchedules = async (standValue) => {
    try {
      setLoading(true);
      setError(null);
      
      // Import the JSON file directly
      const data = await import(`../../data/${standValue}.json`);
      setSchedules(data.default || data);
    } catch (err) {
      console.error('Error fetching bus schedules:', err);
      setError('Failed to load bus schedules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time, timePart) => {
    let timeString = time.toFixed(2);
    if(timePart === 'PM' && timeString > 12.999) {
      timeString = (timeString - 12).toFixed(2);
    }
    timeString = timeString < 10 ? `0${timeString}` : timeString;
    return timeString.replace('.', ':');
  };

  const handleSortOptionSelect = (option) => {
    setSortOption(option);
    setIsSortDropdownOpen(false);
  };

  const getSortedSchedules = () => {
    if (sortOption === 'late') {
      return [...schedules].reverse();
    }
    return schedules;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={styles.backgroundOverlay}></div>
        </div>
        <main className={styles.main}>
          <div className={styles.errorContainer}>
            <div className={styles.errorCard}>
              <h3>Error Loading Schedules</h3>
              <p>{error}</p>
              <button 
                onClick={() => fetchBusSchedules(params.selected)}
                className={styles.retryButton}
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
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
            <div className={styles.standInfo}>
              <h2 className={styles.standName}>{selectedStand?.label}</h2>
              <button className={styles.editButton} onClick={() => navigate(pkg.homepage)}>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{marginRight: '4px'}}
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>Change</span>
              </button>
            </div>
          </div>

          <div className={styles.scheduleSection}>
            <div className={styles.scheduleHeaderContainer}>
              <div className={styles.scheduleHeader}>
                <h3>Today's Bus Schedule</h3>
                <p className={styles.scheduleCount}>{schedules.length} buses available</p>
              </div>
              <div className={styles.scheduleHeaderActions}>
                <div className={styles.scheduleFilter}>
                  {/* Filter */}
                  <button className={styles.filterButton}>
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
                    </svg>
                    <span>Filter</span>
                  </button>
                </div>
                                 <div className={styles.scheduleSort} ref={sortDropdownRef}>
                   {/* Sort by */}
                   <button 
                     className={`${styles.sortButton} ${isSortDropdownOpen ? styles.active : ''}`}
                     onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                     aria-expanded={isSortDropdownOpen}
                     aria-haspopup="listbox"
                   >
                     <svg 
                       width="20" 
                       height="20" 
                       viewBox="0 0 24 24" 
                       fill="none" 
                       stroke="currentColor" 
                       strokeWidth="2"
                       strokeLinecap="round" 
                       strokeLinejoin="round"
                     >
                       <path d="M3 6h18" />
                       <path d="M6 12h12" />
                       <path d="M9 18h6" />
                     </svg>
                     <span>Sort</span>
                     <svg 
                       width="16" 
                       height="16" 
                       viewBox="0 0 24 24" 
                       fill="none" 
                       stroke="currentColor" 
                       strokeWidth="2"
                       strokeLinecap="round" 
                       strokeLinejoin="round"
                       className={`${styles.dropdownArrow} ${isSortDropdownOpen ? styles.rotated : ''}`}
                     >
                       <polyline points="6 9 12 15 18 9" />
                     </svg>
                   </button>

                   {isSortDropdownOpen && (
                     <div className={styles.sortDropdownMenu}>
                       <button
                         className={`${styles.sortDropdownItem} ${sortOption === 'early' ? styles.selected : ''}`}
                         onClick={() => handleSortOptionSelect('early')}
                         role="option"
                         aria-selected={sortOption === 'early'}
                       >
                         <svg 
                           width="16" 
                           height="16" 
                           viewBox="0 0 24 24" 
                           fill="none" 
                           stroke="currentColor" 
                           strokeWidth="2"
                           strokeLinecap="round" 
                           strokeLinejoin="round"
                         >
                           <path d="M12 19V5" />
                           <path d="M5 12l7-7 7 7" />
                         </svg>
                         <span>Early departure first</span>
                       </button>
                       <button
                         className={`${styles.sortDropdownItem} ${sortOption === 'late' ? styles.selected : ''}`}
                         onClick={() => handleSortOptionSelect('late')}
                         role="option"
                         aria-selected={sortOption === 'late'}
                       >
                         <svg 
                           width="16" 
                           height="16" 
                           viewBox="0 0 24 24" 
                           fill="none" 
                           stroke="currentColor" 
                           strokeWidth="2"
                           strokeLinecap="round" 
                           strokeLinejoin="round"
                         >
                           <path d="M12 5v14" />
                           <path d="M19 12l-7 7-7-7" />
                         </svg>
                         <span>Late departure first</span>
                       </button>
                     </div>
                   )}
                 </div>
              </div>
            </div>

            <div className={styles.scheduleList}>
              {getSortedSchedules().map((schedule, index) => (
                <div key={index} className={styles.scheduleCard}>
                  <div className={styles.scheduleTime}>
                    <span className={styles.time}>
                      {formatTime(schedule.time, schedule.time_part)} {schedule.time_part}
                    </span>
                    <span className={styles.busNumber}>
                      {schedule.bus}
                    </span>
                  </div>
                  
                  <div className={styles.scheduleDetails}>
                    <div className={styles.route}>
                      <div className={styles.origin}>
                        <span className={styles.value}>{schedule.origin}</span>
                        <span className={styles.value}>
                          <svg 
                            width="24" 
                            height="24" 
                            fill="none"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={styles.arrowIcon}
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                        <span className={styles.value}>{schedule.destination}</span>
                      </div>
                    </div>
                    
                    <div className={styles.via}>
                      <span className={styles.label}>Via:</span>
                      <span className={styles.value}>{schedule.via}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
