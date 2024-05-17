import { createSlice } from "@reduxjs/toolkit";

const cellsSlice = createSlice({
  name: "cellsSlice",
  initialState: {},
  reducers: {
    updateCell: (state, action) => {
      const data = action.payload;
      const name = data.name;
      state[name] = data;
    },
  },
});

export const { updateCell } = cellsSlice.actions;

export default cellsSlice.reducer;
