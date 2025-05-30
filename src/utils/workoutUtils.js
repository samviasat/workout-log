import { EXERCISE_TYPES } from '../data/exercises';

export const calculateOneRepMax = (weight, reps) => {
  // Using Brzycki formula: 1RM = weight × (36 / (37 - reps))
  if (reps <= 1) return weight;
  return Math.round(weight * (36 / (37 - reps)));
};

export const calculateVolume = (sets) => {
  return sets.reduce((total, set) => {
    if (set.weight && set.reps) {
      return total + (set.weight * set.reps);
    }
    return total;
  }, 0);
};

export const calculateTotalDuration = (sets) => {
  return sets.reduce((total, set) => {
    if (set.duration) {
      return total + set.duration;
    }
    return total;
  }, 0);
};

export const calculateRestTime = (sets) => {
  return sets.reduce((total, set) => {
    if (set.restTime) {
      return total + set.restTime;
    }
    return total;
  }, 0);
};

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${remainingSeconds}s`;
};

export const getExerciseType = (exercise) => {
  if (exercise.type === EXERCISE_TYPES.CARDIO) return 'Cardio';
  if (exercise.type === EXERCISE_TYPES.BODYWEIGHT) return 'Bodyweight';
  return 'Strength';
};

export const validateSet = (set) => {
  if (set.weight && set.weight <= 0) return false;
  if (set.reps && set.reps <= 0) return false;
  if (set.duration && set.duration <= 0) return false;
  if (set.restTime && set.restTime < 0) return false;
  return true;
};

export const generateExerciseId = () => {
  return Math.random().toString(36).substr(2, 9);
};
