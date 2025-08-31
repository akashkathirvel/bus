import React from 'react';
import styles from './index.module.css';

const NoBusesFound = ({ onRefresh, showRefreshButton = false }) => {
  return (
    <div className={styles.noBusesFound}>
      <div className={styles.illustration}>
        <svg 
          width="200" 
          height="200" 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bus Body */}
          <rect x="40" y="80" width="120" height="60" rx="8" fill="#E3F2FD" stroke="#2196F3" strokeWidth="2"/>
          
          {/* Bus Windows */}
          <rect x="50" y="85" width="25" height="20" rx="3" fill="#BBDEFB"/>
          <rect x="85" y="85" width="25" height="20" rx="3" fill="#BBDEFB"/>
          <rect x="120" y="85" width="25" height="20" rx="3" fill="#BBDEFB"/>
          
          {/* Bus Wheels */}
          <circle cx="60" cy="140" r="12" fill="#424242"/>
          <circle cx="60" cy="140" r="8" fill="#757575"/>
          <circle cx="140" cy="140" r="12" fill="#424242"/>
          <circle cx="140" cy="140" r="8" fill="#757575"/>
          
          {/* Bus Door */}
          <rect x="75" y="95" width="20" height="35" rx="2" fill="#1976D2"/>
          <line x1="85" y1="95" x2="85" y2="130" stroke="#0D47A1" strokeWidth="1"/>
          
          {/* Headlights */}
          <circle cx="45" cy="95" r="3" fill="#FFD700"/>
          <circle cx="155" cy="95" r="3" fill="#FFD700"/>
          
          {/* Exhaust */}
          <rect x="35" y="110" width="8" height="15" rx="2" fill="#9E9E9E"/>
          
          {/* Question Mark */}
          <circle cx="100" cy="50" r="15" fill="#FF9800" opacity="0.8"/>
          <path d="M100 40 Q100 35 95 35 Q90 35 90 40 Q90 45 95 45 Q100 45 100 50 Q100 55 95 55 Q90 55 90 50" stroke="white" strokeWidth="2" fill="none"/>
          <circle cx="95" cy="65" r="1" fill="white"/>
          
          {/* Zzz (Sleeping effect) */}
          <path d="M160 60 Q165 55 170 60 Q175 65 180 60" stroke="#FF9800" strokeWidth="2" fill="none"/>
          <path d="M165 50 Q170 45 175 50 Q180 55 185 50" stroke="#FF9800" strokeWidth="2" fill="none"/>
        </svg>
      </div>
      
      <div className={styles.content}>
        <h2 className={styles.title}>Oops… looks like even the buses took a break!</h2>
        <p className={styles.description}>
          We couldn't find any buses for your selected route or time. 
          Don't worry, they might be running on a different schedule or route.
        </p>
        
        <div className={styles.suggestions}>
          <h3>Try these alternatives:</h3>
          <ul>
            <li>Check different time slots</li>
            <li>Try nearby routes or stops</li>
            <li>Verify your destination</li>
            <li>Contact customer support</li>
          </ul>
        </div>
        
        {showRefreshButton && (
          <button className={styles.refreshButton} onClick={onRefresh}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
            </svg>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default NoBusesFound;