import { useState, useCallback, useEffect } from 'react';
import { get, set } from '../lib/db';

export const useHistory = (key, initialState) => {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await get(key);
        if (savedState) {
          setHistory(savedState.history);
          setCurrentIndex(savedState.currentIndex);
        }
      } catch (error) {
        console.error(`Error loading state for ${key}:`, error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadState();
  }, [key]);

  const setState = (action, overwrite = false) => {
    const newState = typeof action === 'function' ? action(history[currentIndex]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[currentIndex] = newState;
      setHistory(historyCopy);
    } else {
      const updatedHistory = history.slice(0, currentIndex + 1);
      setHistory([...updatedHistory, newState]);
      setCurrentIndex(updatedHistory.length);
    }
  };

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  const saveState = useCallback(async () => {
    await set(key, { history, currentIndex });
  }, [key, history, currentIndex]);

  const state = history[currentIndex];
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return [state, setState, undo, redo, canUndo, canRedo, saveState, isLoaded];
};
