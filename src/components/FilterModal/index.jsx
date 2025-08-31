import React, { useState } from 'react';
import styles from './index.module.css';
import Button from '../Button';
import Modal from '../Modal';

const FilterModal = ({ 
  isOpen, 
  onClose, 
  onApply, 
  language,
  destinations = [],
  initialFilters = {} 
}) => {
  const [filters, setFilters] = useState({
    timeFrom: '',
    timeTo: '',
    destination: '',
    ...initialFilters
  });

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      timeFrom: '',
      timeTo: '',
      destination: ''
    });
  };

  const formatTimeForInput = (time) => {
    if (!time) return '';
    const timeStr = time.toString();
    const [hours, minutes] = timeStr.split('.');
    const formattedHours = hours.padStart(2, '0');
    const formattedMinutes = minutes ? minutes.padStart(2, '0') : '00';
    return `${formattedHours}:${formattedMinutes}`;
  };

  const parseTimeInput = (timeInput) => {
    if (!timeInput) return null;
    const [hours, minutes] = timeInput.split(':').map(Number);
    return hours + (minutes / 60);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Filter Bus Schedules"
      className={styles.filterModal}
    >
      <div className={styles.filterForm}>
        {/* Time Range */}
        <div className={styles.filterSection}>
          <h3 className={styles.sectionTitle}>Time Range</h3>
          <div className={styles.timeInputs}>
            <div className={styles.timeInput}>
              <label htmlFor="timeFrom" className={styles.label}>
                From
              </label>
              <input
                type="time"
                id="timeFrom"
                value={filters.timeFrom}
                onChange={(e) => handleInputChange('timeFrom', e.target.value)}
                className={styles.timePicker}
              />
            </div>
            <div className={styles.timeInput}>
              <label htmlFor="timeTo" className={styles.label}>
                To
              </label>
              <input
                type="time"
                id="timeTo"
                value={filters.timeTo}
                onChange={(e) => handleInputChange('timeTo', e.target.value)}
                className={styles.timePicker}
              />
            </div>
          </div>
        </div>

        {/* Destination */}
        <div className={styles.filterSection}>
          <h3 className={styles.sectionTitle}>Destination</h3>
          <div className={styles.selectWrapper}>
            <select
              value={filters.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              className={styles.select}
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

        {/* Action Buttons */}
        <div className={styles.filterActions}>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className={styles.resetButton}
          >
            Reset
          </Button>
          <div className={styles.applyButtons}>
            <Button 
              variant="outline" 
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleApply}
              className={styles.applyButton}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
