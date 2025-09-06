import React from 'react';
import { utils } from '../../utils';
import styles from './index.module.css';

const ScheduleCard = ({ schedule, formatTime, language, id }) => {
  const languageData = utils.geti18n();
  return (
    <div className={styles.scheduleCard} key={id} id={id}>
      <div className={styles.scheduleTime}>
        <span className={styles.time}>
          {formatTime(schedule.time, schedule.time_part)} {schedule.time_part}
        </span>
        <span className={styles.busNumber}>
          {schedule["bus_" + language]}
        </span>
      </div>
      
      <div className={styles.scheduleDetails}>
        <div className={styles.route}>
          <div className={styles.origin}>
            <span className={styles.value}>{schedule["origin_" + language]}</span>
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
            <span className={styles.value}>{schedule["destination_" + language]}</span>
          </div>
        </div>
        
        <div className={styles.via}>
          <span className={styles.label}>{languageData.via}:</span>
          <span className={styles.value}>{schedule["via_" + language]}</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
