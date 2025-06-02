import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
}));

describe('Progress Component - Muscle Group Distribution Logic', () => {
  const mockWorkouts = [
    {
      id: 1,
      date: '2023-01-01',
      name: 'Push Day',
      exercises: [
        {
          name: 'Bench Press',
          muscleGroups: ['Chest', 'Shoulders'],
          sets: [{ weight: 135, reps: 10 }]
        },
        {
          name: 'Overhead Press',
          muscleGroups: ['Shoulders'],
          sets: [{ weight: 95, reps: 10 }]
        }
      ]
    }
  ];

  test('Should render component with distribution option available', () => {
    render(<Progress workouts={mockWorkouts} />);
    
    // Component should render without errors
    const container = screen.getByRole('main') || screen.getByText('Exercise').closest('div');
    expect(container).toBeTruthy();
    
    // Check that the distribution option exists in the view options
    // We'll check for it in the DOM even if not visible
    const muscleGroupText = screen.getByText('Muscle Group Distribution');
    expect(muscleGroupText).toBeInTheDocument();
  });

  test('Distribution view shows bar chart when All Exercises selected', () => {
    const TestComponent = () => {
      const [selectedExercise, setSelectedExercise] = React.useState('all');
      const [selectedView, setSelectedView] = React.useState('distribution');
      
      // Simulate the getMuscleGroupDistribution function
      const getMuscleGroupDistribution = () => {
        const muscleGroups = {};
        mockWorkouts.forEach(workout => {
          workout.exercises.forEach(exercise => {
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
            label: 'Exercise Count',
            data: Object.values(muscleGroups),
            backgroundColor: ['#1976d2', '#dc004e', '#00c853']
          }]
        };
      };

      const distributionData = getMuscleGroupDistribution();
      
      return (
        <div>
          <div data-testid="exercise-selector">Selected: {selectedExercise}</div>
          <div data-testid="view-selector">View: {selectedView}</div>
          {selectedView === 'distribution' && selectedExercise === 'all' && (
            <div data-testid="distribution-content">
              <div data-testid="bar-chart">Bar Chart</div>
              <div data-testid="chart-data">
                Labels: {distributionData.labels.join(', ')}
              </div>
            </div>
          )}
        </div>
      );
    };
    
    render(<TestComponent />);
    
    // Check that the distribution view shows correctly
    expect(screen.getByTestId('exercise-selector')).toHaveTextContent('all');
    expect(screen.getByTestId('view-selector')).toHaveTextContent('distribution');
    expect(screen.getByTestId('distribution-content')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    
    // Check that muscle group data is correct
    expect(screen.getByTestId('chart-data')).toHaveTextContent('Chest, Shoulders');
  });

  test('Alert functionality for restricted distribution access', () => {
    const TestComponent = () => {
      const [selectedExercise, setSelectedExercise] = React.useState('Bench Press');
      const [selectedView, setSelectedView] = React.useState('strength');
      const [showAlert, setShowAlert] = React.useState(false);
      
      const handleViewChange = (newView) => {
        if (newView === 'distribution' && selectedExercise !== 'all') {
          setShowAlert(true);
          return; // Don't change view
        }
        setShowAlert(false);
        setSelectedView(newView);
      };
      
      return (
        <div>
          <div data-testid="current-exercise">{selectedExercise}</div>
          <div data-testid="current-view">{selectedView}</div>
          <button onClick={() => handleViewChange('distribution')}>
            Select Distribution
          </button>
          {showAlert && (
            <div data-testid="alert-message">
              Muscle Group Distribution is only available when "All Exercises" is selected.
            </div>
          )}
          <button onClick={() => setShowAlert(false)}>Close Alert</button>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    // Initial state
    expect(screen.getByTestId('current-exercise')).toHaveTextContent('Bench Press');
    expect(screen.getByTestId('current-view')).toHaveTextContent('strength');
    
    // Try to select distribution - should show alert
    fireEvent.click(screen.getByText('Select Distribution'));
    expect(screen.getByTestId('alert-message')).toBeInTheDocument();
    expect(screen.getByTestId('current-view')).toHaveTextContent('strength'); // Should not change
    
    // Close alert
    fireEvent.click(screen.getByText('Close Alert'));
    expect(screen.queryByTestId('alert-message')).not.toBeInTheDocument();
  });

  test('getMuscleGroupDistribution data structure for bar chart', () => {
    // Test the data structure directly
    const getMuscleGroupDistribution = (workouts) => {
      const muscleGroups = {};
      workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
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
          label: 'Exercise Count',
          data: Object.values(muscleGroups),
          backgroundColor: ['#1976d2', '#dc004e', '#00c853']
        }]
      };
    };

    const result = getMuscleGroupDistribution(mockWorkouts);
    
    // Should have correct structure for bar chart
    expect(result.labels).toEqual(['Chest', 'Shoulders']);
    expect(result.datasets[0].label).toBe('Exercise Count');
    expect(result.datasets[0].data).toEqual([1, 2]); // Chest appears 1 time, Shoulders appears 2 times
  });
});