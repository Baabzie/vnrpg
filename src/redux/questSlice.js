import { createSlice } from "@reduxjs/toolkit";

const questSlice = createSlice({
  name: "questSlice",
  initialState: {},
  reducers: {
    updateQuest: (state, action) => {
      const data = action.payload;
      const id = data.id;
      state[id] = data;
    },
  },
});

export const { updateQuest } = questSlice.actions;

export default questSlice.reducer;
