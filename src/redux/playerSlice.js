import { createSlice } from "@reduxjs/toolkit";

const playerSlice = createSlice({
  name: "playerSlice",
  initialState: {
    knownBy: [],
  },
  reducers: {
    addKnownBy: (state, action) => {
      state.knownBy.push(action.payload);
    },
  },
});

export const { addKnownBy } = playerSlice.actions;

export default playerSlice.reducer;
