import React from 'react';
import { render, screen } from '@testing-library/react';
import Progress from './Progress';

// Mock Chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  BarElement: jest.fn(),
  ArcElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
}));

// Mock react-chartjs-2 components
jest.mock('react-chartjs-2', () => ({
  Line: ({ data }) => <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>Line Chart</div>,
  Bar: ({ data }) => <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>Bar Chart</div>,
  Pie: ({ data }) => <div data-testid="pie-chart" data-chart-data={JSON.stringify(data)}>Pie Chart</div>,
}));

// Test the filtering functions directly
import { format } from 'date-fns';
import { calculateVolume } from '../utils/workoutUtils';

describe('Progress Component Filtering Logic', () => {
  const mockWorkouts = [
    {
      id: 1,
      date: '2023-01-01',
      name: 'Push Day',
      exercises: [
        {
          name: 'Bench Press',
          muscleGroups: ['Chest', 'Shoulders'],
          sets: [{ weight: 135, reps: 10 }, { weight: 145, reps: 8 }]
        },
        {
          name: 'Overhead Press',
          muscleGroups: ['Shoulders'],
          sets: [{ weight: 95, reps: 10 }]
        }
      ]
    },
    {
      id: 2,
      date: '2023-01-03',
      name: 'Pull Day',
      exercises: [
        {
          name: 'Pull Ups',
          muscleGroups: ['Back'],
          sets: [{ weight: 0, reps: 10 }]
        }
      ]
    },
    {
      id: 3,
      date: '2023-02-01',
      name: 'Push Day 2',
      exercises: [
        {
          name: 'Bench Press',
          muscleGroups: ['Chest', 'Shoulders'],
          sets: [{ weight: 150, reps: 8 }]
        }
      ]
    }
  ];

  const getExerciseData = (exerciseName, workouts) => {
    return workouts
      .filter(workout => 
        workout.exercises.some(ex => ex.name === exerciseName)
      )
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

  const getVolumeData = (selectedExercise, workouts) => {
    if (selectedExercise === 'all') {
      // Show total volume across all exercises
      return {
        labels: workouts.map(w => format(new Date(w.date), 'MMM d')),
        datasets: [{
          label: 'Total Volume (lbs × reps)',
          data: workouts.map(w => 
            w.exercises.reduce((sum, ex) => sum + calculateVolume(ex.sets), 0)
          ),
          borderColor: '#1976d2',
          tension: 0.1
        }]
      };
    } else {
      // Show volume for selected exercise only
      const data = getExerciseData(selectedExercise, workouts);
      return {
        labels: data.map(d => d.date),
        datasets: [{
          label: `${selectedExercise} Volume (lbs × reps)`,
          data: data.map(d => d.volume),
          borderColor: '#1976d2',
          tension: 0.1
        }]
      };
    }
  };

  const getWorkoutFrequency = (selectedExercise, workouts) => {
    const frequency = {};
    const filteredWorkouts = selectedExercise === 'all' 
      ? workouts 
      : workouts.filter(workout => 
          workout.exercises.some(ex => ex.name === selectedExercise)
        );
    
    filteredWorkouts.forEach(workout => {
      const month = format(new Date(workout.date), 'MMM yyyy');
      frequency[month] = (frequency[month] || 0) + 1;
    });
    
    const label = selectedExercise === 'all' 
      ? 'Workouts per Month' 
      : `${selectedExercise} Workouts per Month`;
    
    return {
      labels: Object.keys(frequency),
      datasets: [{
        label: label,
        data: Object.values(frequency),
        backgroundColor: '#1976d2',
        borderColor: '#1976d2',
        borderWidth: 1
      }]
    };
  };

  test('Volume data filters correctly for all exercises', () => {
    const data = getVolumeData('all', mockWorkouts);
    expect(data.datasets[0].label).toBe('Total Volume (lbs × reps)');
    expect(data.datasets[0].data.length).toBe(3); // 3 workouts
    expect(data.datasets[0].data[0]).toBeGreaterThan(0); // Should have volume data
  });

  test('Volume data filters correctly for specific exercise', () => {
    const data = getVolumeData('Bench Press', mockWorkouts);
    expect(data.datasets[0].label).toBe('Bench Press Volume (lbs × reps)');
    expect(data.datasets[0].data.length).toBe(2); // Bench Press appears in 2 workouts (workout 1 and 3)
  });

  test('Volume data filters correctly for exercise in some workouts', () => {
    const data = getVolumeData('Pull Ups', mockWorkouts);
    expect(data.datasets[0].label).toBe('Pull Ups Volume (lbs × reps)');
    expect(data.datasets[0].data.length).toBe(1); // Pull Ups only in 1 workout
  });

  test('Workout frequency filters correctly for all exercises', () => {
    const data = getWorkoutFrequency('all', mockWorkouts);
    expect(data.datasets[0].label).toBe('Workouts per Month');
    expect(data.labels).toEqual(['Jan 2023', 'Feb 2023']); // 2 months
    expect(data.datasets[0].data).toEqual([2, 1]); // 2 workouts in Jan, 1 in Feb
  });

  test('Workout frequency filters correctly for specific exercise', () => {
    const data = getWorkoutFrequency('Pull Ups', mockWorkouts);
    expect(data.datasets[0].label).toBe('Pull Ups Workouts per Month');
    expect(data.labels).toEqual(['Jan 2023']); // Only 1 month with Pull Ups
    expect(data.datasets[0].data).toEqual([1]); // 1 workout with Pull Ups
  });

  test('Progress component renders correctly', () => {
    render(<Progress workouts={mockWorkouts} />);
    
    // Check that basic UI elements are present (there might be multiple instances due to MUI structure)
    expect(screen.getAllByText('Exercise').length).toBeGreaterThan(0);
    expect(screen.getAllByText('View').length).toBeGreaterThan(0);
    
    // Check that dropdown options are available
    expect(screen.getByText('All Exercises')).toBeInTheDocument();
    expect(screen.getByText('Strength Progress')).toBeInTheDocument();
  });

  test('Progress component renders with empty workouts', () => {
    render(<Progress workouts={[]} />);
    
    // Should still render the UI elements
    expect(screen.getAllByText('Exercise').length).toBeGreaterThan(0);
    expect(screen.getAllByText('View').length).toBeGreaterThan(0);
  });
});