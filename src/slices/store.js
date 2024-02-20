import { configureStore } from '@reduxjs/toolkit'
import configSlice from './configSlice'
export default configureStore({
  reducer: {
    globalInfo: configSlice
  },
})