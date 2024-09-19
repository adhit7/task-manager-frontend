import React, { useEffect, useRef, useState } from 'react';
import initialData from '../initialData';
import TaskModal from '../components/TaskModal';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from '../components/Column';
import Button from '../components/Button';
import api from '../lib/api';
import { useCurrentUserContext } from '../context/CurrentUserContext';

const HomeScreen = () => {
  const [taskList, setTaskList] = useState(initialData);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const { updateTask, editValues, setEditValues } = useCurrentUserContext();

  const [refresh, setRefresh] = useState(0);

  const handleDragEnd = (results) => {
    const { source, destination } = results;

    //RETURN IF DROPPED OUTSIDE DROPPABLE
    if (!destination) {
      return;
    }

    //RETURN IF DROPPED AT SAME PLACE
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    //FIND SOURCE AND DESTINATION COLUMN INDEX
    const sourceColumnIndex = taskList.findIndex(
      (item) => item.title == source.droppableId
    );
    const destinationColumnIndex = taskList.findIndex(
      (item) => item.title == destination.droppableId
    );

    const newSourceItems = [...taskList[sourceColumnIndex].items];
    const newDestinationItems =
      source.droppableId != destination.droppableId
        ? [...taskList[destinationColumnIndex].items]
        : newSourceItems;

    //REMOVE ITEM FROM SOURCE ARRAY
    const [deletedItem] = newSourceItems.splice(source.index, 1);

    //ADD ITEM IN DESTINATION ARRAY
    newDestinationItems.splice(destination.index, 0, deletedItem);

    //GENERATE NEW TASKLIST WITH ALL UPDATES
    const newList = [...taskList];

    newList[sourceColumnIndex] = {
      ...taskList[sourceColumnIndex],
      items: newSourceItems,
    };

    newList[destinationColumnIndex] = {
      ...taskList[destinationColumnIndex],
      items: newDestinationItems,
    };

    // Prepare the data for the API call
    const updatedTaskDetails = {
      ...deletedItem,
      status: destination.droppableId,
    };

    updateTask(updatedTaskDetails);
    setTaskList(newList);
  };

  const getAllTasks = async () => {
    try {
      const { data } = await api.get('/task/all');

      setTaskList((prevTaskList) => {
        // Create a map for easy access to tasks by status
        const taskMap = data?.reduce((acc, task) => {
          if (!acc[task.status]) {
            acc[task.status] = [];
          }
          acc[task.status].push(task);
          return acc;
        }, {});

        return prevTaskList.map((item) => {
          const status = item.title; // The status of the column (e.g., 'Todo', 'In Progress', 'Completed')
          const newItems = taskMap[status] || [];

          // Return a new object with the updated items list
          return {
            ...item,
            items: newItems,
          };
        });
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error?.message;
      console.log(errorMessage);
    }
  };

  useEffect(() => {
    getAllTasks();
    console.log('4455455454');
  }, [refresh]);

  const buttons = [
    { title: 'Delete', bgColor: 'bg-red-400' },
    { title: 'Edit', bgColor: 'bg-blue-500' },
  ];

  const handleDelete = async (task) => {
    try {
      const { status } = await api.delete(`/task/${task._id}`);
      if (status === 200) {
        setRefresh((prev) => prev + 1);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.[0] ||
        error.response?.data?.message ||
        error.message;
      console.log(errorMessage);
    }
  };

  const taskActions = (btn, task) => {
    if (btn.title === 'Edit') {
      setEditValues(task);
      openDialog();
    } else if (btn.title === 'Delete') {
      handleDelete(task);
    }
  };

  return (
    <div className='w-11/12 mx-auto'>
      <Button
        classes='px-8 py-2 bg-blue-500 text-white rounded my-2 max-w-fit'
        onClick={openDialog}
      >
        Add Task
      </Button>
      {/* <div className='w-100 px-3 py-2 shadow rounded flex justify-between items-center'>
        <div className='flex items-center'>
          <h6 className='mr-1 font-medium'>Search: </h6>
          <input
            type='text'
            placeholder='Search'
            className='px-1 py-2 border border-grey-600 rounded'
          />
        </div>
        <div className='flex items-center'>
          <h6 className='mr-1 font-medium'>SortBy: </h6>
          <div>
            <button
              type='button'
              class='inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              id='menu-button'
              aria-expanded='true'
              aria-haspopup='true'
            >
              Recent
              <svg
                class='-mr-1 h-5 w-5 text-gray-400'
                viewBox='0 0 20 20'
                fill='currentColor'
                aria-hidden='true'
              >
                <path
                  fill-rule='evenodd'
                  d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
                  clip-rule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>
      </div> */}
      <div className='w-100 my-5 grid grid-cols-1 md:grid-cols-3 gap-4'>
        <DragDropContext onDragEnd={handleDragEnd}>
          {taskList?.map((item) => (
            <Column
              key={item.title}
              item={item}
              buttons={buttons}
              taskActions={taskActions}
            />
          ))}
        </DragDropContext>
      </div>
      {isDialogOpen && (
        <TaskModal
          isOpen={isDialogOpen}
          closeDialog={closeDialog}
          setRefresh={setRefresh}
          editValues={editValues}
          setEditValues={setEditValues}
          updateTask={updateTask}
        />
      )}
    </div>
  );
};

export default HomeScreen;
