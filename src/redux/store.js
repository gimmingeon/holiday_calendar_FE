import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from './calendarSlice.js'
import memberReducer from './memberSlice.js'
import userReducer from './userSlice.js'

const store = configureStore({
    reducer: {
        calendar: calendarReducer,
        member: memberReducer,
        user: userReducer
    }
});

export default store;