import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';

const Column = ({ item, buttons, taskActions }) => {
  return (
    <div className='p-3 shadow-xl rounded flex flex-col' key={item.title}>
      <h3 className='bg-blue-500 text-white p-2 rounded uppercase'>
        {item.title}
      </h3>
      <Droppable droppableId={item.title}>
        {(provided) => (
          <div
            className='min-h-40'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {item.items?.length > 0 ? (
              item.items.map((task, index) => (
                <TaskItem
                  task={task}
                  key={task.taskId}
                  index={index}
                  buttons={buttons}
                  taskActions={taskActions}
                />
              ))
            ) : (
              // Show placeholder for empty columns
              <div className='text-center text-gray-500 p-5'>No tasks</div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
