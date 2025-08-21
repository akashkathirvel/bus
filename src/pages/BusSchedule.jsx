import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './BusSchedule.module.css';
import standsData from '../data/stands.json';
import Loader from '../components/Loader.jsx';
import pkg from '../../package.json';

export default function BusSchedule() {
  const params = useParams();
  const navigate = useNavigate();
  const [selectedStand, setSelectedStand] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { selected } = params;
    
    // Find the selected stand from the data
    const stand = standsData.find(s => s.value === selected);
    
    if (!stand) {
      // If stand not found, redirect to home
      navigate(pkg.homepage);
      return;
    }
    
    setSelectedStand(stand);
    
    // Fetch bus schedule data directly from JSON file
    fetchBusSchedules(selected);

    let title = `${stand.label} - Bus Schedule - AK`;
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
      const data = await import(`../data/${standValue}.json`);
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
            <Link to={pkg.homepage} className={styles.backButton}>
              ← Back to Search
            </Link>
            <h1 className={styles.title}>
              <span className={styles.busIcon}>🚌</span>
              Bus Schedules
            </h1>
            <div className={styles.standInfo}>
              <h2 className={styles.standName}>{selectedStand?.label}</h2>
              {/* <p className={styles.standCode}>Stand Code: {selectedStand?.value}</p> */}
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
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              color: '#6366f1',
                              marginLeft: '8px',
                              marginRight: '8px'
                            }}
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
