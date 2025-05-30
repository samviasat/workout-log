export const MUSCLE_GROUPS = {
  CHEST: 'Chest',
  BACK: 'Back',
  LEGS: 'Legs',
  SHOULDERS: 'Shoulders',
  ARMS: 'Arms',
  CORE: 'Core',
  CARDIO: 'Cardio'
};

export const EXERCISE_TYPES = {
  STRENGTH: 'Strength',
  CARDIO: 'Cardio',
  BODYWEIGHT: 'Bodyweight'
};

export const DEFAULT_EXERCISES = [
  {
    id: 1,
    name: 'Bench Press',
    muscleGroups: [MUSCLE_GROUPS.CHEST, MUSCLE_GROUPS.SHOULDERS],
    type: EXERCISE_TYPES.STRENGTH,
    description: 'Compound movement targeting chest, shoulders, and triceps'
  },
  {
    id: 2,
    name: 'Squats',
    muscleGroups: [MUSCLE_GROUPS.LEGS, MUSCLE_GROUPS.CORE],
    type: EXERCISE_TYPES.STRENGTH,
    description: 'Compound movement targeting quadriceps, hamstrings, and glutes'
  },
  {
    id: 3,
    name: 'Deadlift',
    muscleGroups: [MUSCLE_GROUPS.BACK, MUSCLE_GROUPS.LEGS],
    type: EXERCISE_TYPES.STRENGTH,
    description: 'Compound movement targeting back, hamstrings, and glutes'
  },
  {
    id: 4,
    name: 'Push-ups',
    muscleGroups: [MUSCLE_GROUPS.CHEST, MUSCLE_GROUPS.SHOULDERS, MUSCLE_GROUPS.ARMS],
    type: EXERCISE_TYPES.BODYWEIGHT,
    description: 'Bodyweight exercise targeting chest, shoulders, and triceps'
  },
  {
    id: 5,
    name: 'Bicep Curls',
    muscleGroups: [MUSCLE_GROUPS.ARMS],
    type: EXERCISE_TYPES.STRENGTH,
    description: 'Isolation exercise for biceps'
  },
  {
    id: 6,
    name: 'Running',
    muscleGroups: [MUSCLE_GROUPS.LEGS, MUSCLE_GROUPS.CORE],
    type: EXERCISE_TYPES.CARDIO,
    description: 'Cardiovascular exercise targeting legs'
  }
];
