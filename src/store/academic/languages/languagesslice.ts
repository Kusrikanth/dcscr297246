import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILanguagesReducerState } from "./languagestypes";

const initialState: ILanguagesReducerState = {
  languagesListResp: undefined,
  languagesListErrorResp: undefined,
  languagesDelete: undefined,

  studentsIdcardResp: undefined,
  updateStudentIdcardResp: undefined,
  previewStudentIdcardResp: undefined,

  languagesDeleteErrorResp: undefined,
  languagesErrorResp: undefined
};

export const languagesslice = createSlice({
  name: "languages",
  initialState,
  reducers: {
    setLanguageListAct: (state, action: PayloadAction<any>) => {
      state.languagesListResp = action.payload;
    },
    setLanguageListErrorAct: (state, action: PayloadAction<any>) => {
      state.languagesListErrorResp = action.payload;
    },
    setLanguageDeleteAct: (state, action: PayloadAction<any>) => {
      state.languagesDelete = action.payload;
    },
    setStudentsIdcardAct: (state, action: PayloadAction<any>) => {
      state.studentsIdcardResp = action.payload;
    },
    setUpdateStudentIdcardAct: (state, action: PayloadAction<any>) => {
      state.updateStudentIdcardResp = action.payload;
    },
    setPreviewStudentIdcardAct: (state, action: PayloadAction<any>) => {
      state.previewStudentIdcardResp = action.payload;
    },


    setLanguageDeleteErrorAct: (state, action: PayloadAction<any>) => {
      state.languagesDeleteErrorResp = action.payload;
    },

    setLanguagesErrorAct: (state, action: PayloadAction<any>) => {
      state.languagesErrorResp = action.payload;
    },
  },
});

export const {
  setLanguageListAct,
  setLanguageListErrorAct,
  setLanguageDeleteAct,
  setStudentsIdcardAct,
  setUpdateStudentIdcardAct,
  setPreviewStudentIdcardAct,
  setLanguageDeleteErrorAct,
  setLanguagesErrorAct
} = languagesslice.actions;

export default languagesslice.reducer;
