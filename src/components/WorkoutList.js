import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDuration } from '../utils/workoutUtils';

const SortableTableRow = ({ workout, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: workout.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isDragging ? 'rgba(25, 118, 210, 0.08)' : undefined,
    cursor: 'move',
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell {...attributes} {...listeners}>
        <DragIndicatorIcon />
      </TableCell>
      {children}
    </TableRow>
  );
};

const WorkoutList = ({ workouts, deleteWorkout, selectWorkout, onReorder }) => {
  const navigate = useNavigate();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedWorkoutView, setSelectedWorkoutView] = useState(null);
  const [orderedWorkouts, setOrderedWorkouts] = useState(workouts);

  React.useEffect(() => {
    setOrderedWorkouts(workouts);
  }, [workouts]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDelete = (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      deleteWorkout(workoutId);
    }
  };

  const handleSelect = (workout) => {
    selectWorkout(workout);
    navigate('/new');
  };

  const handleView = (workout) => {
    setSelectedWorkoutView(workout);
    setViewDialogOpen(true);
  };

  const handleCloseView = () => {
    setViewDialogOpen(false);
    setSelectedWorkoutView(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedWorkouts.findIndex(w => w.id.toString() === active.id);
    const newIndex = orderedWorkouts.findIndex(w => w.id.toString() === over.id);

    const newWorkouts = arrayMove(orderedWorkouts, oldIndex, newIndex);
    setOrderedWorkouts(newWorkouts);
    onReorder(newWorkouts);
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
          🏋️ Your Workouts
        </Typography>
        
        {workouts.length === 0 ? (
          <Paper 
            className="modern-card"
            sx={{ 
              p: 6, 
              textAlign: 'center',
              background: 'rgba(30, 41, 59, 0.8)',
            }}
          >
            <Typography variant="h6" gutterBottom color="text.secondary">
              No workouts yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start your fitness journey by creating your first workout!
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/new')}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Create First Workout
            </Button>
          </Paper>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
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
                      <TableCell style={{ width: '48px' }}></TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Exercises</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <SortableContext
                      items={orderedWorkouts.map(w => w.id.toString())}
                      strategy={verticalListSortingStrategy}
                    >
                      {orderedWorkouts.map((workout) => (
                        <SortableTableRow key={workout.id} workout={workout}>
                          <TableCell>
                            <Typography variant="body2" color="text.primary">
                              {new Date(workout.date).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" fontWeight={500} color="text.primary">
                              {workout.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {workout.exercises.map((exercise) => (
                                <Chip 
                                  key={exercise.name} 
                                  label={exercise.name} 
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
                              {workout.duration ? formatDuration(workout.duration * 60) : '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton 
                                onClick={() => handleView(workout)}
                                sx={{
                                  color: 'info.main',
                                  '&:hover': {
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    transform: 'scale(1.1)',
                                  },
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleSelect(workout)}
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
                                onClick={() => handleDelete(workout.id)}
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
                        </SortableTableRow>
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </DndContext>
        )}
      </Box>

      {/* View Workout Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={handleCloseView} 
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
          📋 Workout Details
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedWorkoutView && (
            <Box>
              <Typography variant="h5" gutterBottom fontWeight={600} color="text.primary">
                {selectedWorkoutView.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  📅 {new Date(selectedWorkoutView.date).toLocaleDateString()}
                </Typography>
                {selectedWorkoutView.duration && (
                  <Typography variant="body1" color="text.secondary">
                    ⏱️ {formatDuration(selectedWorkoutView.duration * 60)}
                  </Typography>
                )}
              </Box>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: 'text.primary' }}>
                💪 Exercises
              </Typography>
              
              {selectedWorkoutView.exercises.map((exercise, exerciseIndex) => (
                <Paper 
                  key={exerciseIndex} 
                  className="modern-card"
                  sx={{ 
                    p: 3, 
                    mb: 2,
                    background: 'rgba(30, 41, 59, 0.6)',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight={600} color="primary.light">
                    {exercise.name}
                  </Typography>
                  
                  {exercise.sets && exercise.sets.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom color="text.secondary" sx={{ mb: 1 }}>
                        📊 Sets:
                      </Typography>
                      <Box sx={{ ml: 2 }}>
                        {exercise.sets.map((set, setIndex) => (
                          <Box 
                            key={setIndex}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1, 
                              mb: 1,
                              p: 1,
                              background: 'rgba(148, 163, 184, 0.05)',
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.primary" fontWeight={500}>
                              Set {setIndex + 1}:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {set.weight ? `${set.weight} lbs` : 'No weight'} × {set.reps || 'No reps'}
                              {set.restTime && ` (Rest: ${set.restTime}s)`}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              ))}
              
              {selectedWorkoutView.notes && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight={600} color="text.primary">
                    📝 Notes
                  </Typography>
                  <Paper 
                    className="modern-card"
                    sx={{ 
                      p: 2,
                      background: 'rgba(30, 41, 59, 0.6)',
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      {selectedWorkoutView.notes}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseView}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorkoutList;
