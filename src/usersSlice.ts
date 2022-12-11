import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type UsersState = {
  isSuperAdmin: boolean;
};

const initialState: UsersState = {
  isSuperAdmin: false,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUserName: (draft, action: PayloadAction<string>) => {
      draft.isSuperAdmin = action.payload.toLowerCase() === "admin";
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserName } = usersSlice.actions;

export default usersSlice.reducer;
