import { lazy, Suspense } from 'react';
import {
  RouterProvider,
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from 'react-router';

const Layout = lazy(() => import('./Layout.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Homepage = lazy(() => import('./pages/Homepage.jsx'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Homepage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path='/login' element={<Login />} />
    </Route>
  )
);

const App = () => {
  return (
    <>
      <Suspense fallback={<h1>Loading...</h1>}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
};

export default App;
