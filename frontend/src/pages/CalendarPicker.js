
import React from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import '../styles/CalendarPicker.css'; 

const CalendarPicker = ({ value, onChange, placeholder, minDate, maxDate, className, error }) => {
  return (
    <div className="calendar-picker-container">
      <Flatpickr
        value={value}
        onChange={(dates) => {
          onChange({ target: { name: placeholder.toLowerCase().replace(/\s/g, ''), value: dates[0].toISOString().split('T')[0] }});
        }}
        options={{
          dateFormat: 'Y-m-d',
          minDate: minDate,
          maxDate: maxDate,
          disableMobile: false, 
          animate: true,
        }}
        className={`calendar-input ${className || ''} ${error ? 'error' : ''}`}
        placeholder={placeholder}
      />
      {error && <div className="error-tooltip">{error}</div>}
    </div>
  );
};

export default CalendarPicker;