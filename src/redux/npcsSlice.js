import { createSlice } from "@reduxjs/toolkit";

const npcsSlice = createSlice({
  name: "npcsSlice",
  initialState: {},
  reducers: {
    updateNPC: (state, action) => {
      const data = action.payload;
      const name = data.name;
      state[name] = data;
    },
  },
});

export const { updateNPC } = npcsSlice.actions;

export default npcsSlice.reducer;
