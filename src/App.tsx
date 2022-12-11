import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./main";
import {
  changeMaxLimit,
  changeMinLimit,
  changeCounter,
  addCounter,
} from "./countersSlice";
import IntroduceYourself from "./IntroduceYourself";

function App() {
  // Discuss when this is updated
  // useSelector vs createSelector
  // https://stackoverflow.com/questions/63493433/confusion-about-useselector-and-createselector-with-redux-toolkit
  const { counters, globalLimits } = useSelector(
    (state: RootState) => state.counters
  );
  const { isSuperAdmin } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  return (
    <div className="App">
      <nav>
        <IntroduceYourself />
        <p>
          Note: you can create decrementing counters only if you're an admin
        </p>
      </nav>
      <div className="CounterGrid">
        {counters.map((counter, index) => (
          <button onClick={() => dispatch(changeCounter({ index }))}>
            count is {counters[index].value}
          </button>
        ))}
      </div>
      <section>
        <h2>Configure counters</h2>
        <button onClick={() => dispatch(addCounter({ type: "incrementing" }))}>
          Add incrementing counter from {globalLimits.min}
        </button>
        <br />
        <br />
        {isSuperAdmin && (
          <button
            onClick={() => dispatch(addCounter({ type: "decrementing" }))}
          >
            Add decrementing counter from {globalLimits.max}
          </button>
        )}

        <br />
        <br />
        <label>
          Min:
          <input
            type="text"
            value={globalLimits.min}
            onChange={(e) =>
              dispatch(changeMinLimit({ value: +e.target.value }))
            }
          />
        </label>
        <br />
        <br />
        <label>
          Max:
          <input
            type="text"
            value={globalLimits.max}
            onChange={(e) =>
              dispatch(changeMaxLimit({ value: +e.target.value }))
            }
          />
        </label>
      </section>
    </div>
  );
}

export default App;
