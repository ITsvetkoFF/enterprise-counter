import { useState } from "react";
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

function App() {
  const [state, setState] = useState(initialState);

  return (
    <div className="App">
      <div className="CounterGrid">
        {state.counters.map((counter, index) => (
          <button
            onClick={() =>
              setState((prevState) =>
                produce(prevState, (draft) => {
                  if (draft.counters[index].type === "incrementing") {
                    if (
                      prevState.globalLimits.max > draft.counters[index].value
                    ) {
                      draft.counters[index].value++;
                    }
                  } else {
                    if (
                      prevState.globalLimits.min < draft.counters[index].value
                    ) {
                      draft.counters[index].value--;
                    }
                  }
                })
              )
            }
          >
            count is {state.counters[index].value}
          </button>
        ))}
      </div>
      <section>
        <h2>Configure counters</h2>
        <button
          onClick={() => {
            setState((prevState) =>
              produce(prevState, (draft) => {
                draft.counters.push({
                  type: "incrementing",
                  value: prevState.globalLimits.min,
                });
              })
            );
          }}
        >
          Add incrementing counter from {state.globalLimits.min}
        </button>
        <br />
        <br />
        <button
          onClick={() => {
            setState((prevState) =>
              produce(prevState, (draft) => {
                draft.counters.push({
                  type: "decrementing",
                  value: prevState.globalLimits.max,
                });
              })
            );
          }}
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
              setState((prevState) =>
                produce(prevState, (draft) => {
                  const min = +e.target.value;
                  draft.globalLimits.min = min;
                  draft.counters.forEach((counter) => {
                    if (counter.value < min) {
                      counter.value = min;
                    }
                  });
                })
              )
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
              setState((prevState) =>
                produce(prevState, (draft) => {
                  const max = +e.target.value;
                  draft.globalLimits.max = max;
                  draft.counters.forEach((counter) => {
                    if (counter.value > max) {
                      counter.value = max;
                    }
                  });
                })
              )
            }
          />
        </label>
      </section>
    </div>
  );
}

export default App;
