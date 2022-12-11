import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserName } from "./usersSlice";

const IntroduceYourself = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  return (
    <label>
      Name:
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => dispatch(setUserName(name))}
      />
    </label>
  );
};

export default IntroduceYourself;
