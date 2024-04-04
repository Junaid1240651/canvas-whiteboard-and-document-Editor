import { createSlice } from "@reduxjs/toolkit";

const fileSlice = createSlice({
  name: "file",
  initialState: {
    fileName: null,
    fileModelOpen: false,
  },

  reducers: {
    setFileName: (state, action) => {
      state.fileName = action.payload;
    },
    setFileModelOpen: (state, action) => {
      console.log(action.payload);
      state.fileModelOpen = action.payload;
    },
  },
});

export const { setFileName, setFileModelOpen } = fileSlice.actions;
export default fileSlice.reducer;
