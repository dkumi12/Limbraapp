import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(initialTime = 0) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  const start = useCallback(() => {
    if (!isRunning && !isPaused) {
      startTimeRef.current = Date.now();
      setIsRunning(true);
    } else if (isPaused) {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      setIsRunning(true);
      setIsPaused(false);
    }
  }, [isRunning, isPaused]);

  const pause = useCallback(() => {
    if (isRunning) {
      pausedTimeRef.current = Date.now() - startTimeRef.current;
      setIsRunning(false);
      setIsPaused(true);
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    setTime(initialTime);
    setIsRunning(false);
    setIsPaused(false);
    pausedTimeRef.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [initialTime]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    pausedTimeRef.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;
        
        if (initialTime > 0) {
          // Countdown timer
          const remaining = Math.max(0, initialTime - Math.floor(elapsed / 1000));
          setTime(remaining);
          
          if (remaining === 0) {
            setIsRunning(false);
            setIsPaused(false);
          }
        } else {
          // Count up timer
          setTime(Math.floor(elapsed / 1000));
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, initialTime]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    time,
    isRunning,
    isPaused,
    start,
    pause,
    reset,
    stop,
    formatTime
  };
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

export function useRoutineStats() {
  const [stats, setStats] = useLocalStorage('stretchEasyStats', {
    totalSessions: 0,
    totalTimeSpent: 0,
    streakDays: 0,
    lastSessionDate: null,
    favoriteGoals: {},
    completedRoutines: []
  });

  const updateStats = useCallback((routineData) => {
    const today = new Date().toDateString();
    const lastSession = stats.lastSessionDate;
    
    setStats(prevStats => {
      const newStats = { ...prevStats };
      
      // Update basic stats
      newStats.totalSessions += 1;
      newStats.totalTimeSpent += routineData.duration || 0;
      
      // Update streak
      if (lastSession !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastSession === yesterday.toDateString()) {
          newStats.streakDays += 1;
        } else if (lastSession !== today) {
          newStats.streakDays = 1;
        }
      }
      
      newStats.lastSessionDate = today;
      
      // Track favorite goals
      if (routineData.goals) {
        routineData.goals.forEach(goal => {
          newStats.favoriteGoals[goal] = (newStats.favoriteGoals[goal] || 0) + 1;
        });
      }
      
      // Add to completed routines
      newStats.completedRoutines.push({
        date: today,
        duration: routineData.duration,
        exercises: routineData.exercises?.length || 0,
        goals: routineData.goals || []
      });
      
      // Keep only last 30 sessions
      if (newStats.completedRoutines.length > 30) {
        newStats.completedRoutines = newStats.completedRoutines.slice(-30);
      }
      
      return newStats;
    });
  }, [stats.lastSessionDate, setStats]);

  return { stats, updateStats };
}

export function useAudio() {
  const [isSupported, setIsSupported] = useState(false);
  
  useEffect(() => {
    setIsSupported('Audio' in window);
  }, []);

  const playBeep = useCallback(() => {
    if (!isSupported) return;
    
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }, [isSupported]);

  const playSuccess = useCallback(() => {
    if (!isSupported) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Play a success chord (C-E-G)
      [523.25, 659.25, 783.99].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        const startTime = audioContext.currentTime + index * 0.1;
        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.5);
      });
    } catch (error) {
      console.error('Error playing success sound:', error);
    }
  }, [isSupported]);

  const playAlert = useCallback(() => {
    if (!isSupported) return;
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 1200; // Higher pitch
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.6);
    } catch (error) {
      console.error('Error playing alert sound:', error);
    }
  }, [isSupported]);

  return { playBeep, playSuccess, playAlert, isSupported };
}

export function useWakeLock() {
  const [wakeLock, setWakeLock] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const lock = await navigator.wakeLock.request('screen');
      setWakeLock(lock);
      
      lock.addEventListener('release', () => {
        setWakeLock(null);
      });
      
      return true;
    } catch (error) {
      console.error('Wake lock request failed:', error);
      return false;
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
    }
  }, [wakeLock]);

  useEffect(() => {
    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [wakeLock]);

  return {
    isSupported,
    isActive: !!wakeLock,
    requestWakeLock,
    releaseWakeLock
  };
}
