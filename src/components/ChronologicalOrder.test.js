// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

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
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import Progress from './Progress';
import WorkoutList from './WorkoutList';

describe('Chronological Order Tests', () => {
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

  describe('Progress Component Chronological Order', () => {
    test('Volume data should be in chronological order', () => {
      render(<Progress workouts={mockWorkouts} />);
      
      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data'));
      
      // Labels should be in chronological order: Jan 1, Jan 15, Jan 31
      expect(chartData.labels).toEqual(['Jan 1', 'Jan 15', 'Jan 31']);
      
      // Data should correspond to the chronological order
      // Workout volumes: 135*10=1350, 150*8=1200, 155*6=930
      expect(chartData.datasets[0].data).toEqual([1350, 1200, 930]);
    });

    test('getExerciseData helper should return chronologically sorted data', () => {
      const progress = new Progress({ workouts: mockWorkouts });
      // We need to access the function directly, but since it's not exported,
      // we'll test through the rendered component behavior instead
      render(<Progress workouts={mockWorkouts} />);
      
      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data'));
      
      // Verify dates are in ascending order
      const dates = chartData.labels.map(label => new Date('2023 ' + label));
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i] >= dates[i-1]).toBe(true);
      }
    });
  });

  describe('WorkoutList Component Chronological Order', () => {
    test('Workouts should be displayed with newer dates on top', () => {
      const mockDeleteWorkout = jest.fn();
      const mockSelectWorkout = jest.fn();
      
      render(
        <WorkoutList 
          workouts={mockWorkouts} 
          deleteWorkout={mockDeleteWorkout}
          selectWorkout={mockSelectWorkout}
        />
      );
      
      // Get all date cells
      const dateCells = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
      
      // Verify that the first row has the latest date (1/31/2023)
      // and the last row has the earliest date (1/1/2023)
      expect(dateCells[0]).toHaveTextContent('1/31/2023');
      expect(dateCells[2]).toHaveTextContent('1/1/2023');
    });

    test('Workouts should be displayed in descending date order', () => {
      const mockDeleteWorkout = jest.fn();
      const mockSelectWorkout = jest.fn();
      
      render(
        <WorkoutList 
          workouts={mockWorkouts} 
          deleteWorkout={mockDeleteWorkout}
          selectWorkout={mockSelectWorkout}
        />
      );
      
      // Get all workout names to verify they are in the expected order
      const workoutNames = screen.getAllByText(/(First|Second|Third) Workout/);
      
      // Should be: Second (latest), Third (middle), First (earliest)
      expect(workoutNames[0]).toHaveTextContent('Second Workout');
      expect(workoutNames[1]).toHaveTextContent('Third Workout');
      expect(workoutNames[2]).toHaveTextContent('First Workout');
    });
  });
});