import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

describe('App Component Workout Flow', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.clear.mockClear();
    // Return empty array for workouts
    localStorageMock.getItem.mockReturnValue('[]');
  });

  test('should add workout and display it in workout list', async () => {
    render(
      <MemoryRouter initialEntries={['/new']}>
        <App />
      </MemoryRouter>
    );

    // Should be on new workout page
    expect(screen.getByText(/new workout/i)).toBeInTheDocument();

    // Fill in workout name
    const nameInput = screen.getByLabelText(/workout name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Workout' } });

    // Click Add Workout button
    const addButton = screen.getByText(/add workout/i);
    fireEvent.click(addButton);

    // Verify localStorage was called to save workouts
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'workouts',
        expect.stringContaining('Test Workout')
      );
    });
  });

  test('should show workouts in workout list', () => {
    // Mock localStorage to return a saved workout
    const mockWorkout = {
      id: 1,
      name: 'Saved Workout',
      date: '2023-01-01',
      exercises: [],
      notes: '',
      duration: 0
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockWorkout]));

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Should show the saved workout
    expect(screen.getByText('Saved Workout')).toBeInTheDocument();
  });
});
