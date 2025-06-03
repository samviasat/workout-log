import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';

import WorkoutList from './components/WorkoutList';
import NewWorkout from './components/NewWorkout';
import ExerciseList from './components/ExerciseList';
import Progress from './components/Progress';
import { DEFAULT_EXERCISES } from './data/exercises';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState(DEFAULT_EXERCISES);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workoutOrder, setWorkoutOrder] = useState([]);

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
    const savedOrder = JSON.parse(localStorage.getItem('workoutOrder')) || savedWorkouts.map(w => w.id);
    setWorkouts(savedWorkouts);
    setWorkoutOrder(savedOrder);
  }, []);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
    // Update order whenever workouts change to ensure consistency
    setWorkoutOrder(prevOrder => {
      // Add new workouts to the beginning of the order
      const newWorkoutIds = workouts.map(w => w.id).filter(id => !prevOrder.includes(id));
      // Remove deleted workouts from the order
      const updatedOrder = [...newWorkoutIds, ...prevOrder.filter(id => workouts.some(w => w.id === id))];
      localStorage.setItem('workoutOrder', JSON.stringify(updatedOrder));
      return updatedOrder;
    });
  }, [workouts]);

  const addWorkout = (workout) => {
    setWorkouts([...workouts, workout]);
  };

  const updateWorkout = (updatedWorkout) => {
    setWorkouts(workouts.map(workout => 
      workout.id === updatedWorkout.id ? updatedWorkout : workout
    ));
  };

  const deleteWorkout = (workoutId) => {
    setWorkouts(workouts.filter(workout => workout.id !== workoutId));
  };

  // New function to handle workout reordering
  const reorderWorkouts = (newOrder) => {
    localStorage.setItem('workoutOrder', JSON.stringify(newOrder));
    setWorkoutOrder(newOrder);
  };

  // Function to get workouts in the correct order
  const getOrderedWorkouts = () => {
    const orderedWorkouts = [...workouts];
    orderedWorkouts.sort((a, b) => {
      const aIndex = workoutOrder.indexOf(a.id);
      const bIndex = workoutOrder.indexOf(b.id);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
    return orderedWorkouts;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Workout Log
            </Typography>
            <Button color="inherit" component={Link} to="/">Workout Log</Button>
            <Button color="inherit" component={Link} to="/new">New Workout</Button>
            <Button color="inherit" component={Link} to="/exercises">Exercises</Button>
            <Button color="inherit" component={Link} to="/progress">Progress</Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<WorkoutList 
              workouts={getOrderedWorkouts()} 
              deleteWorkout={deleteWorkout} 
              selectWorkout={setSelectedWorkout}
              onReorder={(reorderedWorkouts) => reorderWorkouts(reorderedWorkouts.map(w => w.id))}
            />} />
            <Route path="/new" element={<NewWorkout 
              exercises={exercises} 
              addWorkout={addWorkout}
              selectedWorkout={selectedWorkout}
              updateWorkout={updateWorkout}
              clearSelectedWorkout={() => setSelectedWorkout(null)}
            />} />
            <Route path="/exercises" element={<ExerciseList 
              exercises={exercises} 
              setExercises={setExercises}
            />} />
            <Route path="/progress" element={<Progress workouts={workouts} />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
