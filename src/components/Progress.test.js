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
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Pie: () => <div data-testid="pie-chart">Pie Chart</div>,
}));

// Test the actual getMuscleGroupDistribution logic (current buggy version)
const getMuscleGroupDistributionBuggy = (workouts) => {
  const muscleGroups = {};
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      exercise.muscleGroups.forEach(group => {
        muscleGroups[group] = (muscleGroups[group] || 0) + 1;
      });
    });
  });
  return {
    labels: Object.keys(muscleGroups),
    datasets: [{
      data: Object.values(muscleGroups),
      backgroundColor: [
        '#1976d2',
        '#dc004e',
        '#00c853',
        '#ff6d00',
        '#7b1fa2',
        '#00bfa5',
        '#f57c00'
      ]
    }]
  };
};

// Test the fixed getMuscleGroupDistribution logic
const getMuscleGroupDistributionFixed = (workouts) => {
  const muscleGroups = {};
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      // Check if muscleGroups exists and is an array before trying to iterate
      if (exercise.muscleGroups && Array.isArray(exercise.muscleGroups)) {
        exercise.muscleGroups.forEach(group => {
          muscleGroups[group] = (muscleGroups[group] || 0) + 1;
        });
      }
    });
  });
  return {
    labels: Object.keys(muscleGroups),
    datasets: [{
      data: Object.values(muscleGroups),
      backgroundColor: [
        '#1976d2',
        '#dc004e',
        '#00c853',
        '#ff6d00',
        '#7b1fa2',
        '#00bfa5',
        '#f57c00'
      ]
    }]
  };
};

describe('Progress Component - Muscle Group Distribution Bug', () => {
  const mockWorkoutsWithMuscleGroups = [
    {
      id: 1,
      date: '2023-01-01',
      name: 'Test Workout',
      exercises: [
        {
          exerciseId: 1,
          name: 'Bench Press',
          muscleGroups: ['Chest', 'Shoulders'],
          sets: [{ weight: 135, reps: 10, restTime: 120 }]
        }
      ]
    }
  ];

  const mockWorkoutsWithoutMuscleGroups = [
    {
      id: 1,
      date: '2023-01-01',
      name: 'Test Workout',
      exercises: [
        {
          exerciseId: 1,
          name: 'Bench Press',
          // Missing muscleGroups property (this simulates the bug scenario)
          sets: [{ weight: 135, reps: 10, restTime: 120 }]
        }
      ]
    }
  ];

  test('getMuscleGroupDistribution should work with valid data', () => {
    const result = getMuscleGroupDistributionFixed(mockWorkoutsWithMuscleGroups);
    expect(result.labels).toEqual(['Chest', 'Shoulders']);
    expect(result.datasets[0].data).toEqual([1, 1]);
  });

  test('getMuscleGroupDistribution should crash with missing muscleGroups (reproducing the bug)', () => {
    // This test demonstrates the current bug with the original function
    expect(() => {
      getMuscleGroupDistributionBuggy(mockWorkoutsWithoutMuscleGroups);
    }).toThrow();
  });

  test('getMuscleGroupDistribution FIXED should handle missing muscleGroups gracefully', () => {
    // This test shows that our fix works
    expect(() => {
      const result = getMuscleGroupDistributionFixed(mockWorkoutsWithoutMuscleGroups);
      expect(result.labels).toEqual([]); // No muscle groups found
      expect(result.datasets[0].data).toEqual([]); // No data
    }).not.toThrow();
  });

  test('getMuscleGroupDistribution FIXED should handle mixed data', () => {
    const mixedWorkouts = [
      ...mockWorkoutsWithMuscleGroups,
      ...mockWorkoutsWithoutMuscleGroups
    ];
    
    const result = getMuscleGroupDistributionFixed(mixedWorkouts);
    expect(result.labels).toEqual(['Chest', 'Shoulders']); // Only from valid exercises
    expect(result.datasets[0].data).toEqual([1, 1]); // Only counts from valid exercises
  });

  test('Progress component should render without crashing with normal workout data', () => {
    render(<Progress workouts={mockWorkoutsWithMuscleGroups} />);
    expect(screen.getByText('Exercise')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  test('Progress component should render with empty workouts', () => {
    render(<Progress workouts={[]} />);
    expect(screen.getByText('Exercise')).toBeInTheDocument();
  });
});