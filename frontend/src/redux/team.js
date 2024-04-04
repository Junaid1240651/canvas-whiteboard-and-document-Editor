import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
  name: "team",
  initialState: {
    selectedTeam: "",
    saveDocClick: false,
    saveCanvasClick: false,
  },

  reducers: {
    setSelectedTeam: (state, action) => {
      state.selectedTeam = action.payload;
    },

    setSaveDocClick: (state, action) => {
      state.saveDocClick = action.payload;
    },
    setSaveCanvasClick: (state, action) => {
      state.saveCanvasClick = action.payload;
    },
  },
});

export const { setSaveCanvasClick, setSaveDocClick, setSelectedTeam } =
  teamSlice.actions;
export default teamSlice.reducer;
