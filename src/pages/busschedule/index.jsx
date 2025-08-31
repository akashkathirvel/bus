import { Loader, FilterModal, ScheduleCard, NoBusesFound } from '../../components';
import { useParams, useNavigate } from 'react-router-dom';
import noBgColorLogo from "../../assets/noBgColor.png";
import { useState, useEffect, useRef } from 'react';
import styles from './index.module.css';
import pkg from '../../../package.json';
import { utils } from '../../utils';

export default function BusSchedule() {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [selectedStand, setSelectedStand] = useState(null);
  const [sortOption, setSortOption] = useState('early'); // 'early' or 'late'
  const [destinations, setDestinations] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [language, setLanguage] = useState('ta');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
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


  // Extract unique destinations from schedules
  const extractDestinations = (data = []) => {
    if (data.length > 0) {
      const uniqueDestinations = new Set();
      
      data.forEach(schedule => {
        // Add main destination
        if (schedule["destination_" + language]) {
          uniqueDestinations.add(schedule["destination_" + language]);
        }
        
        // Add via destinations (comma-separated)
        if (schedule["via_" + language]) {
          const viaDestinations = schedule["via_" + language].split(',').map(dest => dest.trim());
          viaDestinations.forEach(dest => {
            if (dest) uniqueDestinations.add(dest);
          });
        }
      });
      
      setDestinations(Array.from(uniqueDestinations).sort());
    }
  }

  const fetchBusSchedules = async (standValue) => {
    try {
      setLoading(true);
      setError(null);
      
      // Import the JSON file directly
      const data = await import(`../../data/${standValue}.json`);
      setSchedules(data.default || data);
      extractDestinations(data.default || data);
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

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    
    let filtered = [...schedules];
    
    // Filter by time range
    if (newFilters.timeFrom || newFilters.timeTo) {
      filtered = filtered.filter(schedule => {
        const scheduleTime = schedule.time;
        const fromTime = newFilters.timeFrom ? parseTimeInput(newFilters.timeFrom) : 0;
        const toTime = newFilters.timeTo ? parseTimeInput(newFilters.timeTo) : 24;
        
        return scheduleTime >= fromTime && scheduleTime <= toTime;
      });
    }
    
    // Filter by destination
    if (newFilters.destination) {
      filtered = filtered.filter(schedule => {
        const mainDest = schedule["destination_" + language]?.toLowerCase();
        const viaDests = schedule["via_" + language]?.toLowerCase().split(',').map(dest => dest.trim());
        
        return mainDest === newFilters.destination.toLowerCase() || 
               viaDests?.includes(newFilters.destination.toLowerCase());
      });
    }
    
    setFilteredSchedules(filtered);
  };

  const onChangeFilter = (key = '', value = '') => {
    let filt = { ...filters, [key]: value };
    applyFilters(filt);
  }

  const parseTimeInput = (timeInput) => {
    if (!timeInput) return null;
    const [hours, minutes] = timeInput.split(':').map(Number);
    return hours + (minutes / 60);
  };

  const checkIfObjectHasAnyValue = (obj = {}) => {
    return Object.values(obj).some(value => !!value);
  }

  const getFilteredSchedules = () => {
    const hasFilters = checkIfObjectHasAnyValue(filters);
    let schedulesToSort = schedules;
    if(hasFilters) {
      schedulesToSort = filteredSchedules;
    }
    return schedulesToSort;
  }

  const getSortedSchedules = () => {
    let schedulesToSort = getFilteredSchedules();
    if (sortOption === 'late') {
      return [...schedulesToSort].reverse();
    }
    return schedulesToSort;
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
                <p className={styles.scheduleCount}>
                  {getFilteredSchedules().length} buses available
                  {checkIfObjectHasAnyValue(filters) && ` (filtered from ${schedules.length})`}
                </p>
              </div>
            </div>

            <div className={styles.scheduleHeaderActionsContainer}>
              <div className={styles.filterSection}>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.select}
                    value={filters.destination}
                    onChange={(e) => onChangeFilter('destination', e.target.value)}
                  >
                    <option value="">All destinations</option>
                    {destinations.map((dest, index) => (
                      <option key={index} value={dest}>
                        {dest}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.scheduleHeaderActions}>
                <div className={styles.scheduleFilter}>
                 {/* Filter */}
                 <button 
                   className={styles.filterButton}
                   onClick={() => setIsFilterModalOpen(true)}
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
              {
                getFilteredSchedules().length > 0 
                  ? getSortedSchedules().map((schedule, index) => (
                    <ScheduleCard 
                      key={index} 
                      language={language}
                      schedule={schedule} 
                      formatTime={formatTime}
                      id={"schedule-card-"+index}
                    />
                  )) 
                  : <NoBusesFound />
              }
            </div>
          </div>
        </div>
      </main>
      {isFilterModalOpen && (
          <FilterModal
            onClose={() => setIsFilterModalOpen(false)}
            destinations={destinations}
            isOpen={isFilterModalOpen}
            initialFilters={filters}
            onApply={applyFilters}
            language={language}
          />
        )
      }
    </div>
  );
}
