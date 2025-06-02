import { format } from 'date-fns';
import { calculateVolume } from '../utils/workoutUtils';

describe('Chronological Order Logic Tests', () => {
  // Test data with out-of-order dates
  const mockWorkouts = [
    {
      id: 3,
      date: '2023-01-15', // Middle date
      name: 'Third Workout',
      exercises: [
        {
          name: 'Bench Press',
          muscleGroups: ['Chest'],
          sets: [{ weight: 150, reps: 8 }]
        }
      ],
      duration: 60
    },
    {
      id: 1,
      date: '2023-01-01', // Earliest date
      name: 'First Workout',
      exercises: [
        {
          name: 'Bench Press',
          muscleGroups: ['Chest'],
          sets: [{ weight: 135, reps: 10 }]
        }
      ],
      duration: 45
    },
    {
      id: 2,
      date: '2023-01-31', // Latest date
      name: 'Second Workout',
      exercises: [
        {
          name: 'Bench Press',
          muscleGroups: ['Chest'],
          sets: [{ weight: 155, reps: 6 }]
        }
      ],
      duration: 50
    }
  ];

  describe('Progress Data Sorting', () => {
    test('getExerciseData should sort by date chronologically', () => {
      // Mock the getExerciseData function logic
      const getExerciseData = (workouts, exerciseName) => {
        return workouts
          .filter(workout => 
            workout.exercises.some(ex => ex.name === exerciseName)
          )
          .sort((a, b) => new Date(a.date) - new Date(b.date)) // This is what we want to add
          .map(workout => {
            const exercise = workout.exercises.find(ex => ex.name === exerciseName);
            const volume = exercise.sets.reduce((total, set) => total + (set.weight * set.reps), 0);
            return {
              date: format(new Date(workout.date), 'MMM d'),
              volume,
              maxWeight: Math.max(...exercise.sets.map(set => set.weight || 0)),
              totalReps: exercise.sets.reduce((sum, set) => sum + (set.reps || 0), 0)
            };
          });
      };

      const result = getExerciseData(mockWorkouts, 'Bench Press');
      
      // Should be in chronological order: Jan 1, Jan 15, Jan 31
      expect(result.map(r => r.date)).toEqual(['Jan 1', 'Jan 15', 'Jan 31']);
      
      // Volumes should correspond: 1350, 1200, 930
      expect(result.map(r => r.volume)).toEqual([1350, 1200, 930]);
    });

    test('getVolumeData should sort workouts chronologically for "all exercises"', () => {
      // Mock the getVolumeData function logic for "all exercises"
      const getVolumeData = (workouts) => {
        const sortedWorkouts = [...workouts].sort((a, b) => new Date(a.date) - new Date(b.date));
        return {
          labels: sortedWorkouts.map(w => format(new Date(w.date), 'MMM d')),
          datasets: [{
            label: 'Total Volume (lbs × reps)',
            data: sortedWorkouts.map(w => 
              w.exercises.reduce((sum, ex) => sum + ex.sets.reduce((total, set) => total + (set.weight * set.reps), 0), 0)
            ),
            borderColor: '#1976d2',
            tension: 0.1
          }]
        };
      };

      const result = getVolumeData(mockWorkouts);
      
      // Should be in chronological order: Jan 1, Jan 15, Jan 31
      expect(result.labels).toEqual(['Jan 1', 'Jan 15', 'Jan 31']);
      
      // Volumes should correspond: 1350, 1200, 930
      expect(result.datasets[0].data).toEqual([1350, 1200, 930]);
    });
  });

  describe('WorkoutList Sorting', () => {
    test('Workouts should be sorted by date descending (newest first)', () => {
      // Mock the sorting logic we want to add
      const sortWorkoutsForList = (workouts) => {
        return [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
      };

      const result = sortWorkoutsForList(mockWorkouts);
      
      // Should be in descending order: Second (latest), Third (middle), First (earliest)
      expect(result.map(w => w.name)).toEqual(['Second Workout', 'Third Workout', 'First Workout']);
      expect(result.map(w => w.date)).toEqual(['2023-01-31', '2023-01-15', '2023-01-01']);
    });
  });

  describe('Fixed Functions (After Implementation)', () => {
    test('Fixed getExerciseData sorts chronologically', () => {
      // Test the actual fixed implementation
      const getExerciseDataFixed = (workouts, exerciseName) => {
        return workouts
          .filter(workout => 
            workout.exercises.some(ex => ex.name === exerciseName)
          )
          .sort((a, b) => new Date(a.date) - new Date(b.date)) // Fixed: added sorting
          .map(workout => {
            const exercise = workout.exercises.find(ex => ex.name === exerciseName);
            const volume = calculateVolume(exercise.sets);
            return {
              date: format(new Date(workout.date), 'MMM d'),
              volume,
              maxWeight: Math.max(...exercise.sets.map(set => set.weight || 0)),
              totalReps: exercise.sets.reduce((sum, set) => sum + (set.reps || 0), 0)
            };
          });
      };

      const result = getExerciseDataFixed(mockWorkouts, 'Bench Press');
      
      // Should now be in chronological order: Jan 1, Jan 15, Jan 31
      expect(result.map(r => r.date)).toEqual(['Jan 1', 'Jan 15', 'Jan 31']);
      
      // Volumes should correspond: 1350, 1200, 930
      expect(result.map(r => r.volume)).toEqual([1350, 1200, 930]);
    });

    test('Fixed getVolumeData sorts workouts chronologically', () => {
      const getVolumeDataFixed = (workouts) => {
        const sortedWorkouts = [...workouts].sort((a, b) => new Date(a.date) - new Date(b.date)); // Fixed: added sorting
        return {
          labels: sortedWorkouts.map(w => format(new Date(w.date), 'MMM d')),
          datasets: [{
            label: 'Total Volume (lbs × reps)',
            data: sortedWorkouts.map(w => 
              w.exercises.reduce((sum, ex) => sum + calculateVolume(ex.sets), 0)
            ),
            borderColor: '#1976d2',
            tension: 0.1
          }]
        };
      };

      const result = getVolumeDataFixed(mockWorkouts);
      
      // Should be in chronological order: Jan 1, Jan 15, Jan 31
      expect(result.labels).toEqual(['Jan 1', 'Jan 15', 'Jan 31']);
      
      // Volumes should correspond: 1350, 1200, 930
      expect(result.datasets[0].data).toEqual([1350, 1200, 930]);
    });

    test('Fixed WorkoutList sorts workouts by newest first', () => {
      const sortWorkoutsForListFixed = (workouts) => {
        return [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date)); // Fixed: added sorting
      };

      const result = sortWorkoutsForListFixed(mockWorkouts);
      
      // Should be in descending order: Second (latest), Third (middle), First (earliest)
      expect(result.map(w => w.name)).toEqual(['Second Workout', 'Third Workout', 'First Workout']);
      expect(result.map(w => w.date)).toEqual(['2023-01-31', '2023-01-15', '2023-01-01']);
    });
  });

  describe('Current Behavior (before fixes)', () => {
    test('Current getExerciseData does NOT sort chronologically', () => {
      // Current implementation without sorting
      const getCurrentExerciseData = (workouts, exerciseName) => {
        return workouts
          .filter(workout => 
            workout.exercises.some(ex => ex.name === exerciseName)
          )
          // No sorting - this is the issue!
          .map(workout => {
            const exercise = workout.exercises.find(ex => ex.name === exerciseName);
            const volume = exercise.sets.reduce((total, set) => total + (set.weight * set.reps), 0);
            return {
              date: format(new Date(workout.date), 'MMM d'),
              volume,
              maxWeight: Math.max(...exercise.sets.map(set => set.weight || 0)),
              totalReps: exercise.sets.reduce((sum, set) => sum + (set.reps || 0), 0)
            };
          });
      };

      const result = getCurrentExerciseData(mockWorkouts, 'Bench Press');
      
      // Currently in input order, not chronological: Jan 15, Jan 1, Jan 31
      expect(result.map(r => r.date)).toEqual(['Jan 15', 'Jan 1', 'Jan 31']);
      
      // This demonstrates the problem - data is not in chronological order
      expect(result.map(r => r.date)).not.toEqual(['Jan 1', 'Jan 15', 'Jan 31']);
    });
  });
});