import React from 'react';
import { 
  Container, 
  Paper, 
  Grid, 
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert
} from '@mui/material';
import { 
  Line,
  Bar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { format } from 'date-fns';
import { calculateVolume } from '../utils/workoutUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Progress = ({ workouts }) => {
  const [selectedExercise, setSelectedExercise] = React.useState('all');
  const [selectedView, setSelectedView] = React.useState('strength');
  const [showDistributionAlert, setShowDistributionAlert] = React.useState(false);

  const handleViewChange = (e) => {
    const newView = e.target.value;
    if (newView === 'distribution' && selectedExercise !== 'all') {
      setShowDistributionAlert(true);
      // Don't change the view, keep it as is
      return;
    }
    setShowDistributionAlert(false);
    setSelectedView(newView);
  };

  const handleExerciseChange = (e) => {
    setSelectedExercise(e.target.value);
    // Hide alert when exercise changes
    setShowDistributionAlert(false);
    // If user selects a specific exercise while on distribution view, change to strength view
    if (e.target.value !== 'all' && selectedView === 'distribution') {
      setSelectedView('strength');
    }
  };

  const getExerciseData = (exerciseName) => {
    return workouts
      .filter(workout => 
        workout.exercises.some(ex => ex.name === exerciseName)
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date))
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

  const getStrengthData = () => {
    if (!selectedExercise || selectedExercise === 'all') return null;
    const data = getExerciseData(selectedExercise);
    return {
      labels: data.map(d => d.date),
      datasets: [
        {
          label: 'Volume (lbs × reps)',
          data: data.map(d => d.volume),
          borderColor: '#1976d2',
          tension: 0.1
        },
        {
          label: 'Max Weight (lbs)',
          data: data.map(d => d.maxWeight),
          borderColor: '#dc004e',
          tension: 0.1
        }
      ]
    };
  };

  const getMuscleGroupDistribution = () => {
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
        label: 'Exercise Count',
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

  const getVolumeData = () => {
    if (selectedExercise === 'all') {
      // Show total volume across all exercises, sorted chronologically
      const sortedWorkouts = [...workouts].sort((a, b) => new Date(a.date) - new Date(b.date));
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
    } else {
      // Show volume for selected exercise only
      const data = getExerciseData(selectedExercise);
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

  const getWorkoutFrequency = () => {
    const frequency = {};
    const filteredWorkouts = selectedExercise === 'all' 
      ? workouts 
      : workouts.filter(workout => 
          workout.exercises.some(ex => ex.name === selectedExercise)
        );
    
    // Sort workouts chronologically before processing
    const sortedWorkouts = [...filteredWorkouts].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sortedWorkouts.forEach(workout => {
      const month = format(new Date(workout.date), 'MMM yyyy');
      frequency[month] = (frequency[month] || 0) + 1;
    });
    
    // Sort the frequency data by month order
    const sortedMonths = Object.keys(frequency).sort((a, b) => new Date(a) - new Date(b));
    
    const label = selectedExercise === 'all' 
      ? 'Workouts per Month' 
      : `${selectedExercise} Workouts per Month`;
    
    return {
      labels: sortedMonths,
      datasets: [{
        label: label,
        data: sortedMonths.map(month => frequency[month]),
        backgroundColor: '#1976d2',
        borderColor: '#1976d2',
        borderWidth: 1
      }]
    };
  };

  const exercises = [...new Set(workouts.flatMap(workout => 
    workout.exercises.map(ex => ex.name)
  ))];

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={7}>
            <FormControl fullWidth>
              <InputLabel>Exercise</InputLabel>
              <Select
                value={selectedExercise}
                onChange={handleExerciseChange}
                label="Exercise"
              >
                <MenuItem value="all">All Exercises</MenuItem>
                {exercises.map(exercise => (
                  <MenuItem key={exercise} value={exercise}>{exercise}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <FormControl fullWidth>
              <InputLabel>View</InputLabel>
              <Select
                value={selectedView}
                onChange={handleViewChange}
                label="View"
              >
                <MenuItem value="strength">Strength Progress</MenuItem>
                <MenuItem value="volume">Volume Progress</MenuItem>
                <MenuItem value="frequency">Workout Frequency</MenuItem>
                <MenuItem value="distribution">Muscle Group Distribution</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {showDistributionAlert && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="warning" onClose={() => setShowDistributionAlert(false)}>
            Muscle Group Distribution is only available when "All Exercises" is selected. 
            Please select "All Exercises" to view muscle group distribution.
          </Alert>
        </Box>
      )}

      <Grid container spacing={3}>
        {selectedView === 'strength' && selectedExercise && selectedExercise !== 'all' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedExercise} Progress
              </Typography>
              <Line data={getStrengthData()} />
            </Paper>
          </Grid>
        )}

        {selectedView === 'volume' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedExercise === 'all' ? 'Total Volume Progress' : `${selectedExercise} Volume Progress`}
              </Typography>
              <Line data={getVolumeData()} />
            </Paper>
          </Grid>
        )}

        {selectedView === 'frequency' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedExercise === 'all' ? 'Workout Frequency' : `${selectedExercise} Workout Frequency`}
              </Typography>
              <Bar data={getWorkoutFrequency()} />
            </Paper>
          </Grid>
        )}

        {selectedView === 'distribution' && selectedExercise === 'all' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Muscle Group Distribution
              </Typography>
              <Bar data={getMuscleGroupDistribution()} />
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Progress;
