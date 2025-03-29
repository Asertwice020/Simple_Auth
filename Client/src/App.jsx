import { lazy, Suspense, useEffect, useState } from 'react';
import {Provider} from 'react-redux'
import createAppStore from './redux/store.js';

import {
  RouterProvider,
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from 'react-router';

const SignUp = lazy(() => import('./pages/auth/SignUp.jsx'));
const SignIn = lazy(() => import('./pages/auth/SignIn.jsx'));
const VerifyMail = lazy(() => import('./pages/auth/VerifyMail.jsx'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword.jsx'));
const ChangePassword = lazy(() => import('./pages/auth/ChangePassword.jsx'))

const Home = lazy(() => import('./pages/dashboard/Home.jsx'));
const Layout = lazy(() => import('./Layout.jsx'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/verify-mail' element={<VerifyMail />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password/:token' element={<ResetPassword />} />
      <Route path='/change-password' element={<ChangePassword />} />
    </Route>
  )
);

const App = () => {
  // const location = useLocation();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // * Check if the server is up before initializing the app.
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get("/server-status");
      } catch (err) {
        setError("Server is down. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    checkServerStatus();
  }, []);

  useEffect(() => {
    // Initialize the store
    const initStore = async () => {
      const appStore = await createAppStore();
      setStore(appStore);
    };
    
    initStore();
  }, []);
  
  // Show loading until store is initialized
  if (!store) {
    return <h1>Initializing application...</h1>;
  }
  
  return (
    <Provider store={store}>
      <Suspense fallback={<h1>Loading...</h1>}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  );
};

export default App;
