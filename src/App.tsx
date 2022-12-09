import { useState } from "react";
import "./App.css";

import produce from "immer";

type SingleCounterState = {
  type: "incrementing" | "decrementing";
  value: number;
};

type AppState = {
  counters: SingleCounterState[];
};

const initialState: AppState = {
  counters: [
    {
      type: "incrementing",
      value: 0,
    },
  ],
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
                  draft.counters[index].value++;
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
            setState((prevState) => ({
              counters: [
                ...prevState.counters,
                {
                  type: "incrementing",
                  value: 0,
                },
              ],
            }));
          }}
        >
          Add incrementing counter
        </button>
      </section>
    </div>
  );
}

export default App;
