import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Button from './Button';
import moment from 'moment';

const formatDate = (dateString) => {
  return moment(dateString).format('MMMM D, YYYY h:mm A'); // Example format: September 18, 2024 2:30 PM
};

const TaskItem = ({ task, index, buttons, taskActions }) => {
  return (
    <Draggable draggableId={task._id} key={task._id} index={index}>
      {(provided) => (
        <div
          className='shadow p-2 rounded my-2 bg-blue-200	'
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <h5 className='font-bold'>{task.title}</h5>
          <p>{task.description}</p>
          <p>Created: {formatDate(task.createdAt)}</p>
          <div className='flex justify-end'>
            <div className='inline-flex items-end space-x-2'>
              {buttons.map((btn) => (
                <Button
                  key={btn.title}
                  classes={`${btn.bgColor} ${
                    btn.title === 'Delete' && 'hover:bg-red-300'
                  } px-2 py-1 rounded text-white`}
                  onClick={() => taskActions(btn, task)}
                >
                  {btn.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
