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
  Chip,
  Typography,
  Box
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
    <Container maxWidth="xl" className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
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
          🏃 Exercise Library
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpen()}
          sx={{
            mb: 3,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          Add New Exercise
        </Button>
        
        <Paper 
          className="modern-card"
          sx={{ 
            overflow: 'hidden',
            background: 'rgba(30, 41, 59, 0.8)',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  background: 'rgba(99, 102, 241, 0.1)',
                  '& .MuiTableCell-head': {
                    fontWeight: 600,
                    color: 'text.primary',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                  }
                }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Muscle Groups</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exercises.map((exercise) => (
                  <TableRow 
                    key={exercise.id}
                    sx={{
                      '&:hover': {
                        background: 'rgba(99, 102, 241, 0.05)',
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body1" fontWeight={500} color="text.primary">
                        {exercise.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {exercise.type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {exercise.muscleGroups.map((group) => (
                          <Chip 
                            key={group} 
                            label={group} 
                            size="small"
                            sx={{
                              background: 'rgba(99, 102, 241, 0.2)',
                              color: 'primary.light',
                              border: '1px solid rgba(99, 102, 241, 0.3)',
                              '&:hover': {
                                background: 'rgba(99, 102, 241, 0.3)',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {exercise.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton 
                          onClick={() => handleOpen(exercise)}
                          sx={{
                            color: 'warning.main',
                            '&:hover': {
                              background: 'rgba(245, 158, 11, 0.1)',
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(exercise.id)}
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              background: 'rgba(239, 68, 68, 0.1)',
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Dialog 
        open={open} 
        onClose={handleClose} 
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
          {selectedExercise ? '✏️ Edit Exercise' : '➕ Add New Exercise'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Exercise Name"
            fullWidth
            value={newExercise.name}
            onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
            sx={{
              mb: 2,
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
          <FormControl 
            fullWidth 
            margin="dense"
            sx={{
              mb: 2,
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
          >
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
          <FormControl 
            fullWidth 
            margin="dense"
            sx={{
              mb: 2,
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
          >
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
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          <Button 
            onClick={handleClose}
            sx={{
              borderRadius: 2,
              borderColor: 'rgba(148, 163, 184, 0.3)',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'text.secondary',
                background: 'rgba(148, 163, 184, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {selectedExercise ? '💾 Update' : '➕ Add Exercise'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExerciseList;
