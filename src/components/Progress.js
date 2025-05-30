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
  Box
} from '@mui/material';
import { 
  Line,
  Bar,
  Pie
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
  const [selectedExercise, setSelectedExercise] = React.useState(null);
  const [selectedView, setSelectedView] = React.useState('strength');

  const getExerciseData = (exerciseName) => {
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

  const getStrengthData = () => {
    if (!selectedExercise) return null;
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

  const getWorkoutFrequency = () => {
    const frequency = {};
    workouts.forEach(workout => {
      const month = format(new Date(workout.date), 'MMM yyyy');
      frequency[month] = (frequency[month] || 0) + 1;
    });
    return {
      labels: Object.keys(frequency),
      datasets: [{
        label: 'Workouts per Month',
        data: Object.values(frequency),
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
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Exercise</InputLabel>
              <Select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
              >
                <MenuItem value={null}>All Exercises</MenuItem>
                {exercises.map(exercise => (
                  <MenuItem key={exercise} value={exercise}>{exercise}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>View</InputLabel>
              <Select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
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

      <Grid container spacing={3}>
        {selectedView === 'strength' && selectedExercise && (
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
                Total Volume Progress
              </Typography>
              <Line
                data={{
                  labels: workouts.map(w => format(new Date(w.date), 'MMM d')),
                  datasets: [{
                    label: 'Total Volume (lbs × reps)',
                    data: workouts.map(w => 
                      w.exercises.reduce((sum, ex) => sum + calculateVolume(ex.sets), 0)
                    ),
                    borderColor: '#1976d2',
                    tension: 0.1
                  }]
                }}
              />
            </Paper>
          </Grid>
        )}

        {selectedView === 'frequency' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Workout Frequency
              </Typography>
              <Bar data={getWorkoutFrequency()} />
            </Paper>
          </Grid>
        )}

        {selectedView === 'distribution' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Muscle Group Distribution
              </Typography>
              <Pie data={getMuscleGroupDistribution()} />
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Progress;
