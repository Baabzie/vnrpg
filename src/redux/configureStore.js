import { configureStore } from "@reduxjs/toolkit";
import playerSlice from "./playerSlice";
import npcsSlice from "./npcsSlice";
import cellsSlice from "./cellsSlice";
import questSlice from "./questSlice";

const store = configureStore({
  reducer: {
    player: playerSlice,
    npcs: npcsSlice,
    cells: cellsSlice,
    quests: questSlice,
  },
});

export default store;
