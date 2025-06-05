import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from './calendarSlice.js'
import memberReducer from './memberSlice.js'
import userReducer from './userSlice.js'
import mateReducer from './mateSlice.js'

const store = configureStore({
    reducer: {
        calendar: calendarReducer,
        member: memberReducer,
        user: userReducer,
        mate: mateReducer,
    }
});

export default store;