import React from 'react';

// Only include the icons actually used in the app
const icons = {
  'home-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><path d="M3 10.46V19a2 2 0 002 2h3v-5h4v5h3a2 2 0 002-2v-8.54a2 2 0 00-.76-1.57l-6-4.8a2 2 0 00-2.48 0l-6 4.8A2 2 0 003 10.46z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  'bookmark-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><path d="M6 3h12a2 2 0 012 2v16l-8-5-8 5V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  'person-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 20v-1a7 7 0 0114 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  'settings-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06A1.65 1.65 0 0015 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 008.6 15a1.65 1.65 0 00-1.82-.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0015 8.6a1.65 1.65 0 001.82.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 15z" stroke="currentColor" strokeWidth="1.5"/></svg>
  ),
  'clock-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  'activity-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  'play-circle-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/></svg>
  ),
  'pause-circle-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="2" height="6" fill="currentColor"/><rect x="13" y="9" width="2" height="6" fill="currentColor"/></svg>
  ),
  'skip-forward-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><polygon points="5 4 15 12 5 20 5 4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/><rect x="17" y="4" width="2" height="16" fill="currentColor"/></svg>
  ),
  'arrow-back-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  'arrow-forward-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  'checkmark-circle-2-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><polyline points="9 12 12 15 16 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  'sun-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5"/></svg>
  ),
  'monitor-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 21h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  'moon-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="1.5"/></svg>
  ),
  'close-outline': (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  'star': (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
  ),
  'person': (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7v1H4v-1z"/></svg>
  ),
  'camera-outline': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="1em" height="1em"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
  ),
  'flash': (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  ),
  'checkmark-circle-2': (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
  ),
  'log-out-outline': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="1em" height="1em"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  )
};

const EvaIcon = ({ name, width = 24, height = 24, fill = 'currentColor', style }) => {
  const icon = icons[name];
  if (!icon) return null;
  return React.cloneElement(icon, { width, height, fill, style });
};

export default EvaIcon; 