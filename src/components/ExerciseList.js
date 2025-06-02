import React, { useState } from 'react';
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
import AddIcon from '@mui/icons-material/Add';
import { MUSCLE_GROUPS, EXERCISE_TYPES } from '../data/exercises';

const ExerciseList = ({ exercises, setExercises }) => {
  const [open, setOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [newExercise, setNewExercise] = useState({
    name: '',
    type: EXERCISE_TYPES.STRENGTH,
    muscleGroups: [],
    description: ''
  });

  const handleOpen = (exercise = null) => {
    setSelectedExercise(exercise);
    if (exercise) {
      setNewExercise({
        name: exercise.name,
        type: exercise.type,
        muscleGroups: exercise.muscleGroups,
        description: exercise.description
      });
    } else {
      setNewExercise({
        name: '',
        type: EXERCISE_TYPES.STRENGTH,
        muscleGroups: [],
        description: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (!selectedExercise) {
      setExercises([...exercises, {
        id: Date.now(),
        ...newExercise
      }]);
    } else {
      setExercises(exercises.map(exercise => 
        exercise.id === selectedExercise.id ? {
          ...exercise,
          ...newExercise
        } : exercise
      ));
    }
    handleClose();
  };

  const handleDelete = (exerciseId) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
    }
  };

  return (
    <Container>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />} 
        onClick={() => handleOpen()}
      >
        Add Exercise
      </Button>
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Muscle Groups</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exercises.map((exercise) => (
              <TableRow key={exercise.id}>
                <TableCell>{exercise.name}</TableCell>
                <TableCell>{exercise.type}</TableCell>
                <TableCell>
                  {exercise.muscleGroups.map((group) => (
                    <Chip key={group} label={group} size="small" />
                  ))}
                </TableCell>
                <TableCell>{exercise.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(exercise)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(exercise.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedExercise ? 'Edit Exercise' : 'Add New Exercise'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Exercise Name"
            fullWidth
            value={newExercise.name}
            onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              value={newExercise.type}
              onChange={(e) => setNewExercise({ ...newExercise, type: e.target.value })}
              label="Type"
            >
              {Object.values(EXERCISE_TYPES).map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Muscle Groups</InputLabel>
            <Select
              multiple
              value={newExercise.muscleGroups}
              onChange={(e) => setNewExercise({ ...newExercise, muscleGroups: e.target.value })}
              label="Muscle Groups"
            >
              {Object.values(MUSCLE_GROUPS).map((group) => (
                <MenuItem key={group} value={group}>{group}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newExercise.description}
            onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExerciseList;
