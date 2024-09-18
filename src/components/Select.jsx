import React from 'react';
import { ErrorMessage, Field, useField } from 'formik';

const inputClass = `block w-full px-1 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500  sm:text-sm`;

const Select = (props) => {
  const [field, meta] = useField(props);
  const { name, label, listOfItems, classes = '' } = props;
  const errorClass = meta.touched && meta.error ? 'error' : '';

  return (
    <div className='max-w-fit mb-4'>
      <label
        htmlFor={name}
        className='block text-sm font-medium text-gray-700 mb-2'
      >
        {label}
      </label>
      <div className='mt-1'>
        <Field
          as='select'
          name={name}
          className={`
          ${inputClass}
          ${errorClass ? 'border border-red-500' : ''}
          ${classes}
        `}
        >
          <option value='' disabled className='text-grey-100'>
            Select one
          </option>

          {listOfItems?.map((item, index) => (
            <option key={index} {...field} value={item}>
              {item}
            </option>
          ))}
        </Field>
      </div>
      <ErrorMessage
        name={name}
        component='div'
        className='w-auto block font-medium text-sm text-red-600 mt-1'
      />
    </div>
  );
};

export default Select;
