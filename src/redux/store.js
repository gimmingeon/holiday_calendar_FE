import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from './calendarSlice.js'
import memberReducer from './memberSlice.js'

const store = configureStore({
    reducer: {
        calendar: calendarReducer,
        member: memberReducer
    }
});

export default store;