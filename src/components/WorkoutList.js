import React from 'react';
import { 
  Container, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { MUSCLE_GROUPS, EXERCISE_TYPES } from '../data/exercises';
import { formatDuration } from '../utils/workoutUtils';

const WorkoutList = ({ workouts, deleteWorkout, selectWorkout }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = React.useState(null);

  const handleDelete = (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      deleteWorkout(workoutId);
    }
  };

  const handleSelect = (workout) => {
    selectWorkout(workout);
  };

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Exercises</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workouts.map((workout) => (
              <TableRow key={workout.id}>
                <TableCell>{new Date(workout.date).toLocaleDateString()}</TableCell>
                <TableCell>{workout.name}</TableCell>
                <TableCell>
                  {workout.exercises.map((exercise) => (
                    <Chip key={exercise.name} label={exercise.name} size="small" />
                  ))}
                </TableCell>
                <TableCell>
                  {workout.duration ? formatDuration(workout.duration * 60) : '-'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleSelect(workout)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(workout.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default WorkoutList;
