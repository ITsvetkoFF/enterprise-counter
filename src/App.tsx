import { useReducer } from "react";
import "./App.css";

import produce from "immer";

type SingleCounterState = {
  type: "incrementing" | "decrementing";
  value: number;
};

type AppState = {
  counters: SingleCounterState[];
  globalLimits: {
    max: number;
    min: number;
  };
};

const initialState: AppState = {
  counters: [
    {
      type: "incrementing",
      value: 0,
    },
  ],
  globalLimits: {
    max: 10,
    min: 0,
  },
};

type AppAction =
  | {
      type: "CHANGE_COUNTER";
      payload: {
        index: number;
      };
    }
  | {
      type: "ADD_COUNTER";
      payload: {
        type: SingleCounterState["type"]; // NOTE THIS
      };
    }
  | {
      type: "CHANGE_MAX_LIMIT" | "CHANGE_MIN_LIMIT";
      payload: {
        value: number;
      };
    };

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "CHANGE_COUNTER":
      return produce(state, (draft) => {
        const draftCounter = draft.counters[action.payload.index];
        if (draftCounter.type === "incrementing") {
          if (state.globalLimits.max > draftCounter.value) {
            draftCounter.value++;
          }
        } else {
          if (state.globalLimits.min < draftCounter.value) {
            draftCounter.value--;
          }
        }
      });
    case "ADD_COUNTER":
      return produce(state, (draft) => {
        draft.counters.push({
          type: action.payload.type,
          value:
            action.payload.type === "incrementing"
              ? state.globalLimits.min
              : state.globalLimits.max,
        });
      });
    case "CHANGE_MAX_LIMIT":
      return produce(state, (draft) => {
        draft.globalLimits.max = action.payload.value;
        draft.counters.forEach((counter) => {
          if (counter.value > action.payload.value) {
            counter.value = action.payload.value;
          }
        });
      });
    case "CHANGE_MIN_LIMIT":
      return produce(state, (draft) => {
        draft.globalLimits.min = action.payload.value;
        draft.counters.forEach((counter) => {
          if (counter.value < action.payload.value) {
            counter.value = action.payload.value;
          }
        });
      });
    default:
      throw new Error();
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <div className="CounterGrid">
        {state.counters.map((counter, index) => (
          <button
            onClick={() =>
              dispatch({
                type: "CHANGE_COUNTER",
                payload: {
                  index,
                },
              })
            }
          >
            count is {state.counters[index].value}
          </button>
        ))}
      </div>
      <section>
        <h2>Configure counters</h2>
        <button
          onClick={() =>
            dispatch({
              type: "ADD_COUNTER",
              payload: {
                type: "incrementing",
              },
            })
          }
        >
          Add incrementing counter from {state.globalLimits.min}
        </button>
        <br />
        <br />
        <button
          onClick={() =>
            dispatch({
              type: "ADD_COUNTER",
              payload: {
                type: "decrementing",
              },
            })
          }
        >
          Add decrementing counter from {state.globalLimits.max}
        </button>
        <br />
        <br />
        <label>
          Min:
          <input
            type="text"
            value={state.globalLimits.min}
            onChange={(e) =>
              dispatch({
                type: "CHANGE_MIN_LIMIT",
                payload: {
                  value: +e.target.value,
                },
              })
            }
          />
        </label>
        <br />
        <br />
        <label>
          Max:
          <input
            type="text"
            value={state.globalLimits.max}
            onChange={(e) =>
              dispatch({
                type: "CHANGE_MAX_LIMIT",
                payload: {
                  value: +e.target.value,
                },
              })
            }
          />
        </label>
      </section>
    </div>
  );
}

export default App;
