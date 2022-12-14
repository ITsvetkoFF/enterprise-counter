import React from "react";
import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import App from "./App";
import "./index.css";
import countersReducer, { addCounter } from "./countersSlice";
import usersReducer from "./usersSlice";

const REGULAR_USER_TIME_LIMIT_MS = 5000;
const REGULAR_USER_COUNTERS_LIMIT = 3;

export const store = configureStore({
  reducer: {
    counters: countersReducer,
    users: usersReducer,
  },
  middleware: [
    (storeAPI) => (next) => (action) => {
      console.group("middleware");
      console.dir({ storeAPI, next, action });
      console.groupEnd();
      if (action.type !== "counters/addCounter") return next(action);
      // Discuss 2 benefits from this solution:
      // if (!addCounter.match(action)) return next(action);

      const { isSuperAdmin } = storeAPI.getState().users;
      const { counters } = storeAPI.getState().counters;

      if (isSuperAdmin) {
        return next(action);
      } else {
        const nextCounterTime = action.payload.createdAt;
        const createdDuringTimeLimit = counters.filter(
          (c) => c.startedAt + REGULAR_USER_TIME_LIMIT_MS > nextCounterTime
        );
        if (createdDuringTimeLimit.length < REGULAR_USER_COUNTERS_LIMIT) {
          return next(action);
        } else {
          // ignore or dispatch an error message
        }
      }
    },
  ],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {counters: CountersState}
export type AppDispatch = typeof store.dispatch;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
