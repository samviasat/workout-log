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
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { formatDuration } from '../utils/workoutUtils';

const WorkoutList = ({ workouts, deleteWorkout, selectWorkout, onReorder }) => {
  const navigate = useNavigate();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedWorkoutView, setSelectedWorkoutView] = useState(null);
  const [orderedWorkouts, setOrderedWorkouts] = useState(workouts);

  // Update orderedWorkouts when workouts prop changes
  React.useEffect(() => {
    setOrderedWorkouts(workouts);
  }, [workouts]);

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

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(orderedWorkouts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedWorkouts(items);
    onReorder(items);
  };

  return (
    <Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '48px' }}></TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Exercises</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <Droppable droppableId="workouts">
              {(provided) => (
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {orderedWorkouts.map((workout, index) => (
                    <Draggable key={workout.id} draggableId={workout.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            background: snapshot.isDragging ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
                          }}
                        >
                          <TableCell {...provided.dragHandleProps}>
                            <DragIndicatorIcon />
                          </TableCell>
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
                            <IconButton onClick={() => handleView(workout)}>
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton onClick={() => handleSelect(workout)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(workout.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </Table>
        </TableContainer>
      </DragDropContext>

      {/* View Workout Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={handleCloseView} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Workout Details
        </DialogTitle>
        <DialogContent>
          {selectedWorkoutView && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedWorkoutView.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Date: {new Date(selectedWorkoutView.date).toLocaleDateString()}
              </Typography>
              {selectedWorkoutView.duration && (
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Duration: {formatDuration(selectedWorkoutView.duration * 60)}
                </Typography>
              )}
              
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Exercises
              </Typography>
              
              {selectedWorkoutView.exercises.map((exercise, exerciseIndex) => (
                <Paper key={exerciseIndex} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {exercise.name}
                  </Typography>
                  
                  {exercise.sets && exercise.sets.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Sets:
                      </Typography>
                      {exercise.sets.map((set, setIndex) => (
                        <Typography key={setIndex} variant="body2" sx={{ ml: 2 }}>
                          Set {setIndex + 1}: {set.weight ? `${set.weight} lbs` : 'No weight'} × {set.reps || 'No reps'} 
                          {set.restTime && ` (Rest: ${set.restTime}s)`}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Paper>
              ))}
              
              {selectedWorkoutView.notes && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body2">
                    {selectedWorkoutView.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorkoutList;
