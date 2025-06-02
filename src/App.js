import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
    setWorkouts(savedWorkouts);
  }, []);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Workout Log
            </Typography>
            <Button color="inherit" href="/new">New Workout</Button>
            <Button color="inherit" href="/exercises">Exercises</Button>
            <Button color="inherit" href="/progress">Progress</Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<WorkoutList 
              workouts={workouts} 
              deleteWorkout={deleteWorkout} 
              selectWorkout={setSelectedWorkout} 
            />} />
            <Route path="/new" element={<NewWorkout 
              exercises={exercises} 
              addWorkout={addWorkout}
              selectedWorkout={selectedWorkout}
              updateWorkout={updateWorkout}
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
