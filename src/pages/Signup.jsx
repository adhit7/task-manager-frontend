import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import ErrorBox from '../components/ErrorBox';
import { useState } from 'react';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import api from '../lib/api';

const Signup = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useCurrentUserContext();

  const handleLogin = async (formValues, resetForm) => {
    setError('');
    setLoading(true);

    const { firstName, lastName, email, password } = formValues;
    const requestBody = { firstName, lastName, email, password };

    try {
      const { data: { token } = {}, status } = await api.post(
        '/user/register',
        requestBody
      );
      if (status === 201 && token) {
        login(token);
        resetForm();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error?.message;

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-gray-50 min-h-[85vh] flex flex-col justify-center'>
      <div className='m-2 sm:my-4 sm:m-0 sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='text-blue-500 font-bold sm:text-3xl'>Signup</h2>
      </div>
      {error && (
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <ErrorBox message={error} />
        </div>
      )}
      <div className='mx-2 sm:m-0 sm:mx-auto sm:w-full sm:max-w-md rounded bg-white shadow shadow-md pt-6 border border-2 border-blue-500'>
        <div className='py-8 pt-1 px-4 sm:px-6'>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={Yup.object({
              firstName: Yup.string().required('First Name is required'),
              lastName: Yup.string().required('Last Name is required'),
              email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
              password: Yup.string().required('Password is required'),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Password should be same') // Comparing password
                .required('Confirm Password is required'),
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              await handleLogin(values, resetForm);
              setSubmitting(false);
            }}
          >
            <Form>
              <Input placeholder='First Name' type='text' name='firstName' />
              <Input placeholder='Last Name' type='text' name='lastName' />

              <Input placeholder='Email' type='email' name='email' />
              <Input placeholder='Password' type='password' name='password' />
              <Input
                placeholder='Confirm Password'
                type='password'
                name='confirmPassword'
              />
              <div className='mt-6 flex items-start justify-between'></div>

              <Button
                type='submit'
                label='Signup'
                loading={loading}
                message='Signing up'
              />
            </Form>
          </Formik>
          <div className='flex flex-col items-center'>
            <div className='text-sm text-center mt-3 mb-3'>
              <span>Already have an account? </span>
              <Link
                to='/login'
                className='font-medium text-blue-500 hover:text-blue-400'
              >
                Login
              </Link>
            </div>
            <Button
              label='Signup with Google'
              loading={false}
              message='Signing up'
              classes='max-w-fit'
              onClick={googleLogin}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
