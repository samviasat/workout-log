import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box, Fade } from '@mui/material';

import WorkoutList from './components/WorkoutList';
import NewWorkout from './components/NewWorkout';
import ExerciseList from './components/ExerciseList';
import Progress from './components/Progress';
import { DEFAULT_EXERCISES } from './data/exercises';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Modern indigo
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#f59e0b', // Modern amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    background: {
      default: '#0f172a', // Deep slate
      paper: '#1e293b',   // Slate 800
    },
    text: {
      primary: '#f8fafc',    // Slate 50
      secondary: '#cbd5e1',  // Slate 300
    },
    success: {
      main: '#10b981', // Emerald
    },
    error: {
      main: '#ef4444', // Red
    },
    warning: {
      main: '#f59e0b', // Amber
    },
    info: {
      main: '#3b82f6', // Blue
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12, // More rounded corners
  },
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    ...Array(19).fill('0 25px 50px -12px rgba(0, 0, 0, 0.25)')
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backdropFilter: 'blur(20px)',
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        },
      },
    },
  },
});

// Navigation component with active state
const NavigationButton = ({ to, children, ...props }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Button 
      color="inherit" 
      component={Link} 
      to={to}
      sx={{
        position: 'relative',
        borderRadius: 2,
        mx: 0.5,
        px: 2,
        py: 1,
        backgroundColor: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
        color: isActive ? 'primary.light' : 'text.primary',
        '&:hover': {
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          transform: 'translateY(-1px)',
        },
        '&::after': isActive ? {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '2px',
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          borderRadius: '1px',
        } : {},
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

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
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          }}
        >
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.025em',
              }}
            >
              💪 Workout Log
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NavigationButton to="/">Dashboard</NavigationButton>
              <NavigationButton to="/new">New Workout</NavigationButton>
              <NavigationButton to="/exercises">Exercises</NavigationButton>
              <NavigationButton to="/progress">Progress</NavigationButton>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Container 
          maxWidth="xl" 
          sx={{ 
            mt: 4, 
            px: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
          }}
        >
          <Fade in={true} timeout={500}>
            <Box className="fade-in">
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
            </Box>
          </Fade>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
