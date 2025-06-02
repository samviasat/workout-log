import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

import NewWorkout from './NewWorkout';
import { DEFAULT_EXERCISES } from '../data/exercises';

describe('NewWorkout Component', () => {
  const mockAddWorkout = jest.fn();
  const mockUpdateWorkout = jest.fn();
  const mockClearSelectedWorkout = jest.fn();

  beforeEach(() => {
    mockAddWorkout.mockClear();
    mockUpdateWorkout.mockClear();
    mockClearSelectedWorkout.mockClear();
  });

  test('should call addWorkout when no selectedWorkout is provided', () => {
    render(
      <NewWorkout
        exercises={DEFAULT_EXERCISES}
        addWorkout={mockAddWorkout}
        updateWorkout={mockUpdateWorkout}
        selectedWorkout={null}
        clearSelectedWorkout={mockClearSelectedWorkout}
      />
    );

    // Fill in workout name
    const nameInput = screen.getByLabelText(/workout name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Workout' } });

    // Click Add Workout button
    const addButton = screen.getByText(/add workout/i);
    fireEvent.click(addButton);

    // Verify addWorkout was called and updateWorkout was not
    expect(mockAddWorkout).toHaveBeenCalledTimes(1);
    expect(mockUpdateWorkout).toHaveBeenCalledTimes(0);
    expect(mockClearSelectedWorkout).toHaveBeenCalledTimes(1);
  });

  test('should call updateWorkout when selectedWorkout is provided', () => {
    const selectedWorkout = {
      id: 1,
      name: 'Existing Workout',
      date: '2023-01-01',
      exercises: [],
      notes: '',
      duration: 0
    };

    render(
      <NewWorkout
        exercises={DEFAULT_EXERCISES}
        addWorkout={mockAddWorkout}
        updateWorkout={mockUpdateWorkout}
        selectedWorkout={selectedWorkout}
        clearSelectedWorkout={mockClearSelectedWorkout}
      />
    );

    // Click Update Workout button (should show Update when editing)
    const updateButton = screen.getByText(/update workout/i);
    fireEvent.click(updateButton);

    // Verify updateWorkout was called and addWorkout was not
    expect(mockUpdateWorkout).toHaveBeenCalledTimes(1);
    expect(mockAddWorkout).toHaveBeenCalledTimes(0);
    expect(mockClearSelectedWorkout).toHaveBeenCalledTimes(1);
  });
});