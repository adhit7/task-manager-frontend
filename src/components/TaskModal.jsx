import React, { useEffect, useRef, useState } from 'react';
import Input from './Input';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import Textarea from './Textarea';
import Button from './Button';
import api from '../lib/api';
import ErrorBox from './ErrorBox';
import Select from './Select';
import { useCurrentUserContext } from '../context/CurrentUserContext';

const TaskModal = ({
  closeDialog,
  setRefresh,
  editValues,
  setEditValues,
  updateTask,
}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Formik reference
  const formikRef = useRef();

  const handleSave = async (formValues, resetForm) => {
    setError('');
    setLoading(true);

    const { title, description, status } = formValues;
    const requestBody = { title, description, status };
    try {
      const { data, status } = await api.post('/task/create', requestBody);
      if (status === 201 && data) {
        setRefresh((prev) => (prev += 1));
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.[0] ||
        error.response?.data?.message ||
        error.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
    resetForm();
    closeDialog();
  };

  const handleCancel = () => {
    closeDialog();
  };

  const handleUpdate = async (formValues, resetForm) => {
    const { title, description, status } = formValues;
    const res = await updateTask({
      ...editValues,
      title: title,
      description: description,
      status: status,
      _id: editValues._id,
    });
    if (res.data && res.status === 200) {
      setEditValues(null);
      resetForm();
      closeDialog();
      setRefresh((prev) => (prev += 1));
    }
  };

  useEffect(() => {
    if (editValues !== null) {
      formikRef.current.setValues({
        title: editValues.title,
        description: editValues.description,
        status: editValues.status,
      });
    }
  }, [editValues]);

  return (
    <div
      className='fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50'
      onClick={closeDialog}
    >
      <div
        className='w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg p-6 sm:mx-6 lg:mx-0 h-[500px] flex flex-col overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-lg sm:text-xl font-semibold mb-4'>Add Task</h2>
        {error && <ErrorBox message={error} />}
        <div className='flex-grow overflow-y-auto'>
          <Formik
            innerRef={formikRef}
            initialValues={{
              title: '',
              description: '',
              status: '',
            }}
            validationSchema={Yup.object({
              title: Yup.string().required('Title is required'),
              description: Yup.string().required('Description is required'),
              status: Yup.string().required('Status is required'),
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              if (editValues === null) {
                await handleSave(values, resetForm);
              } else {
                await handleUpdate(values, resetForm);
              }
              setSubmitting(false);
            }}
          >
            <Form>
              <Input
                name='title'
                label='Title'
                type='text'
                classes='mt-1 block w-full sm:text-sm'
                placeholder='Enter task title'
              />
              <Textarea
                label='Description'
                name='description'
                classes='mt-1 w-full min-h-32'
                placeholder='Enter task description'
              />
              <Select
                name='status'
                label='Status'
                listOfItems={['Todo', 'In Progress', 'Done']}
              />
              <div className='flex justify-end'>
                <div className='inline-flex items-end space-x-3'>
                  <Button
                    type='submit'
                    label='Save'
                    loading={loading}
                    message='Saving'
                  />
                  <Button
                    label='Cancel'
                    loading={false}
                    onClick={handleCancel}
                  />
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

// const StatusDropdown = ({ options }) => {
//   const [selectedStatus, setSelectedStatus] = useState('');

//   const handleChange = (event) => {
//     setSelectedStatus(event.target.value);
//   };

//   return (
//     <div className='max-w-fit mb-4'>
//       <label
//         htmlFor='status'
//         className='block text-sm font-medium text-gray-700 mb-2'
//       >
//         Status
//       </label>
//       <select
//         id='status'
//         name='status'
//         value={selectedStatus}
//         onChange={handleChange}
//         className='block w-full px-1 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm '
//       >
//         <option value='' disabled>
//           Select One
//         </option>
//         {options.map((item) => (
//           <option key={item} value={item}>
//             {item}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

export default TaskModal;
