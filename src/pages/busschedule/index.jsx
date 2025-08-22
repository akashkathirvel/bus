import { useParams, useNavigate } from 'react-router-dom';
import noBgColorLogo from "../../assets/noBgColor.png";
import { useState, useEffect } from 'react';
import { Loader } from '../../components';
import styles from './index.module.css';
import pkg from '../../../package.json';
import { utils } from '../../utils';

export default function BusSchedule() {
  const [selectedStand, setSelectedStand] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
            <div className={styles.scheduleHeader}>
              <h3>Today's Bus Schedule</h3>
              <p className={styles.scheduleCount}>{schedules.length} buses available</p>
            </div>

            <div className={styles.scheduleList}>
              {schedules.map((schedule, index) => (
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
