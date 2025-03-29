/*
* In this file,
* configured redux store with tokenValidation middleware
* initialized auth
* returning the store
*/
import { configureStore } from '@reduxjs/toolkit'
const createAppStore = async () => {
  try {
    const store = configureStore({
      reducer: {},
      // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tokenMiddleware),
    })
    // await store.dispatch(initializeAuth());

    return store;
  } catch (error) {
    throw new Error(error, "Failed To Initialize Redux Store!");
  }
}

export default createAppStore