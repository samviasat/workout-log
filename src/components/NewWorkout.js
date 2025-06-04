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
  ListItemText
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
    <Container maxWidth="xl" className="fade-in">
      <Paper className="modern-card" sx={{ p: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 3,
          }}
        >
          {selectedWorkout ? '✏️ Edit Workout' : '➕ New Workout'}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Workout Name"
            value={workout.name}
            onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'rgba(148, 163, 184, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />

          <TextField
            fullWidth
            type="date"
            label="Date"
            value={workout.date}
            onChange={(e) => setWorkout({ ...workout, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'rgba(148, 163, 184, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />

          <TextField
            fullWidth
            type="number"
            label="Duration (minutes)"
            value={workout.duration}
            onChange={(e) => setWorkout({ ...workout, duration: e.target.value })}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'rgba(148, 163, 184, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontWeight: 600, 
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
            }}
          >
            💪 Exercises
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setExerciseDialogOpen(true)}
            sx={{ 
              mb: 3,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Add Exercise
          </Button>
          
          {workout.exercises.length === 0 ? (
            <Paper 
              className="modern-card"
              sx={{ 
                p: 4, 
                textAlign: 'center',
                background: 'rgba(30, 41, 59, 0.6)',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No exercises added yet. Click "Add Exercise" to get started!
              </Typography>
            </Paper>
          ) : (
            workout.exercises.map((exercise, exerciseIndex) => (
              <Paper 
                key={exerciseIndex} 
                className="modern-card"
                sx={{ 
                  p: 3, 
                  mb: 2,
                  background: 'rgba(30, 41, 59, 0.6)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.light' }}>
                    {exercise.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveExercise(exerciseIndex)}
                    sx={{
                      color: 'error.main',
                      '&:hover': {
                        background: 'rgba(239, 68, 68, 0.1)',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                  </IconButton>
                </Box>
                
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 2, 
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  📊 Sets
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {exercise.sets.map((set, setIndex) => (
                    <Paper 
                      key={setIndex} 
                      sx={{ 
                        p: 2,
                        background: 'rgba(148, 163, 184, 0.05)',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ minWidth: '60px' }}>
                          Set {setIndex + 1}:
                        </Typography>
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
                          sx={{ 
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                            },
                          }}
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
                          sx={{ 
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                            },
                          }}
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
                          sx={{ 
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                            },
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              background: 'rgba(239, 68, 68, 0.1)',
                            },
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                      {set.weight && set.reps && (
                        <Typography 
                          variant="caption" 
                          color="primary.light"
                          sx={{ 
                            fontWeight: 500,
                            display: 'block',
                            textAlign: 'center',
                            mt: 1,
                          }}
                        >
                          🎯 1RM: {calculateOneRepMax(parseFloat(set.weight), parseInt(set.reps)).toFixed(1)} lbs
                        </Typography>
                      )}
                    </Paper>
                  ))}
                  
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddSet(exerciseIndex)}
                    sx={{
                      borderRadius: 2,
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      color: 'primary.light',
                      '&:hover': {
                        borderColor: 'primary.main',
                        background: 'rgba(99, 102, 241, 0.1)',
                      },
                    }}
                  >
                    Add Set
                  </Button>
                </Box>
              </Paper>
            ))
          )}
        </Box>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={4}
            value={workout.notes}
            onChange={(e) => setWorkout({ ...workout, notes: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'rgba(148, 163, 184, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              flex: 1,
              py: 1.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {selectedWorkout ? '💾 Update Workout' : '➕ Save Workout'}
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
            sx={{
              borderRadius: 2,
              borderColor: 'rgba(148, 163, 184, 0.3)',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'warning.main',
                color: 'warning.main',
                background: 'rgba(245, 158, 11, 0.1)',
              },
            }}
          >
            🔄 Reset
          </Button>
        </Box>

        <Dialog 
          open={exerciseDialogOpen} 
          onClose={() => setExerciseDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(30, 41, 59, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 700,
          }}>
            💪 Add Exercise
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <List sx={{ py: 0 }}>
              {exercises.map((exercise) => (
                <React.Fragment key={exercise.id}>
                  <ListItem
                    button
                    onClick={() => handleAddExercise(exercise)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      background: 'rgba(30, 41, 59, 0.6)',
                      '&:hover': {
                        background: 'rgba(99, 102, 241, 0.1)',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={500} color="text.primary">
                          {exercise.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {exercise.muscleGroups.join(', ')}
                        </Typography>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => setExerciseDialogOpen(false)}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default NewWorkout;
