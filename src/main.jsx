import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import HomeScreen from './pages/HomeScreen.jsx';
import RequireUser from './components/RequireUser.jsx';
import RequireVisitor from './components/RequireVisitor.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import CurrentUserProvider from './context/CurrentUserContext.jsx';
// import { GoogleOAuthProvider } from '@react-oauth/google';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route element={<RequireUser />}>
        <Route index={true} path='/' element={<HomeScreen />} />
      </Route>

      <Route element={<RequireVisitor />}>
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<Signup />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <CurrentUserProvider>
    <RouterProvider router={router} />
  </CurrentUserProvider>
);
