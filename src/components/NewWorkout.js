import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { format } from 'date-fns';
import { calculateOneRepMax } from '../utils/workoutUtils';

const NewWorkout = ({ exercises, addWorkout, updateWorkout, selectedWorkout, clearSelectedWorkout }) => {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState({
    id: Date.now(),
    date: format(new Date(), 'yyyy-MM-dd'),
    name: '',
    exercises: [],
    notes: '',
    duration: 0
  });
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);

  useEffect(() => {
    if (selectedWorkout) {
      setWorkout(selectedWorkout);
    } else {
      // Clear any previously selected workout when creating a new one
      if (clearSelectedWorkout) {
        clearSelectedWorkout();
      }
    }
  }, [selectedWorkout, clearSelectedWorkout]);

  const handleAddExercise = (exercise) => {
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, {
        exerciseId: exercise.id,
        name: exercise.name,
        muscleGroups: exercise.muscleGroups,
        sets: [{
          weight: '',
          reps: '',
          restTime: 120
        }]
      }]
    });
    setExerciseDialogOpen(false);
  };

  const handleRemoveExercise = (index) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.filter((_, i) => i !== index)
    });
  };

  const handleAddSet = (exerciseIndex) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.map((exercise, i) => 
        i === exerciseIndex ? {
          ...exercise,
          sets: [...exercise.sets, {
            weight: '',
            reps: '',
            restTime: 120
          }]
        } : exercise
      )
    });
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.map((exercise, i) => 
        i === exerciseIndex ? {
          ...exercise,
          sets: exercise.sets.filter((_, j) => j !== setIndex)
        } : exercise
      )
    });
  };

  const handleSave = () => {
    if (selectedWorkout) {
      updateWorkout(workout);
    } else {
      addWorkout(workout);
    }
    
    // Clear the form
    setWorkout({
      id: Date.now(),
      date: format(new Date(), 'yyyy-MM-dd'),
      name: '',
      exercises: [],
      notes: '',
      duration: 0
    });
    
    // Clear selected workout and navigate back to workout list
    if (clearSelectedWorkout) {
      clearSelectedWorkout();
    }
    navigate('/');
  };

  return (
    <Container>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {selectedWorkout ? 'Edit Workout' : 'New Workout'}
        </Typography>

        <TextField
          fullWidth
          label="Workout Name"
          value={workout.name}
          onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="date"
          value={workout.date}
          onChange={(e) => setWorkout({ ...workout, date: e.target.value })}
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Exercises
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setExerciseDialogOpen(true)}
            sx={{ mb: 1 }}
          >
            Add Exercise
          </Button>
          <Paper sx={{ p: 1 }}>
            {workout.exercises.map((exercise, exerciseIndex) => (
              <Box key={exerciseIndex} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {exercise.name}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveExercise(exerciseIndex)}
                    sx={{ ml: 1 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {exercise.sets.map((set, setIndex) => (
                    <Box key={setIndex} sx={{ width: '100%' }}>
                      <Paper sx={{ p: 1 }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                          <TextField
                            label="Weight (lbs)"
                            value={set.weight}
                            onChange={(e) => 
                              setWorkout({
                                ...workout,
                                exercises: workout.exercises.map((ex, i) => 
                                  i === exerciseIndex ? {
                                    ...ex,
                                    sets: ex.sets.map((s, j) => 
                                      j === setIndex ? { ...s, weight: e.target.value } : s
                                    )
                                  } : ex
                                )
                              })
                            }
                            size="small"
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            label="Reps"
                            value={set.reps}
                            onChange={(e) => 
                              setWorkout({
                                ...workout,
                                exercises: workout.exercises.map((ex, i) => 
                                  i === exerciseIndex ? {
                                    ...ex,
                                    sets: ex.sets.map((s, j) => 
                                      j === setIndex ? { ...s, reps: e.target.value } : s
                                    )
                                  } : ex
                                )
                              })
                            }
                            size="small"
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            label="Rest Time (s)"
                            value={set.restTime}
                            onChange={(e) => 
                              setWorkout({
                                ...workout,
                                exercises: workout.exercises.map((ex, i) => 
                                  i === exerciseIndex ? {
                                    ...ex,
                                    sets: ex.sets.map((s, j) => 
                                      j === setIndex ? { ...s, restTime: e.target.value } : s
                                    )
                                  } : ex
                                )
                              })
                            }
                            size="small"
                            sx={{ flex: 1 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                        {set.weight && set.reps && (
                          <Typography variant="caption" color="text.secondary">
                            1RM: {calculateOneRepMax(parseFloat(set.weight), parseInt(set.reps)).toFixed(1)} lbs
                          </Typography>
                        )}
                      </Paper>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddSet(exerciseIndex)}
                  >
                    Add Set
                  </Button>
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={4}
            value={workout.notes}
            onChange={(e) => setWorkout({ ...workout, notes: e.target.value })}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Duration (minutes)"
            value={workout.duration}
            onChange={(e) => setWorkout({ ...workout, duration: e.target.value })}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            {selectedWorkout ? 'Update Workout' : 'Add Workout'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setWorkout({
              id: Date.now(),
              date: format(new Date(), 'yyyy-MM-dd'),
              name: '',
              exercises: [],
              notes: '',
              duration: 0
            })}
          >
            Reset
          </Button>
        </Box>

        <Dialog open={exerciseDialogOpen} onClose={() => setExerciseDialogOpen(false)}>
          <DialogTitle>Add Exercise</DialogTitle>
          <DialogContent>
            <List>
              {exercises.map((exercise) => (
                <React.Fragment key={exercise.id}>
                  <ListItem
                    button
                    onClick={() => handleAddExercise(exercise)}
                  >
                    <ListItemText
                      primary={exercise.name}
                      secondary={exercise.muscleGroups.join(', ')}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExerciseDialogOpen(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default NewWorkout;
