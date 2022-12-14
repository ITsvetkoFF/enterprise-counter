import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type SingleCounterState = {
  type: "incrementing" | "decrementing";
  value: number;
  startedAt: number; // timestamp
};
export type CounterState = {
  counters: SingleCounterState[];
  globalLimits: {
    max: number;
    min: number;
  };
};

const initialState = (): CounterState => ({
  counters: [
    {
      type: "incrementing",
      value: 0,
      startedAt: new Date().getTime(),
    },
  ],
  globalLimits: {
    max: 10,
    min: 0,
  },
});

export const countersSlice = createSlice({
  name: "counters",
  initialState,
  reducers: {
    changeCounter: (draft, action: PayloadAction<{ index: number }>) => {
      const draftCounter = draft.counters[action.payload.index];
      if (draftCounter.type === "incrementing") {
        if (draft.globalLimits.max > draftCounter.value) {
          draftCounter.value++;
        }
      } else {
        if (draft.globalLimits.min < draftCounter.value) {
          draftCounter.value--;
        }
      }
    },
    addCounter: (
      draft,
      action: PayloadAction<{
        type: SingleCounterState["type"];
        createdAt: number;
      }>
    ) => {
      draft.counters.push({
        type: action.payload.type,
        value:
          action.payload.type === "incrementing"
            ? draft.globalLimits.min
            : draft.globalLimits.max,
        startedAt: action.payload.createdAt,
      });
    },
    changeMaxLimit: (draft, action: PayloadAction<{ value: number }>) => {
      draft.globalLimits.max = action.payload.value;
      draft.counters.forEach((counter) => {
        if (counter.value > action.payload.value) {
          counter.value = action.payload.value;
        }
      });
    },
    changeMinLimit: (draft, action: PayloadAction<{ value: number }>) => {
      draft.globalLimits.min = action.payload.value;
      draft.counters.forEach((counter) => {
        if (counter.value < action.payload.value) {
          counter.value = action.payload.value;
        }
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeCounter, addCounter, changeMinLimit, changeMaxLimit } =
  countersSlice.actions;

export default countersSlice.reducer;
