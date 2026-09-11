import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISettingsListReducerState } from "./librarysettingstypes";
import { IModelWithPagination } from "../../types";

const initialState: ISettingsListReducerState = {
    //libraryDetails 
    libraryDetailsRequestListResp: undefined,
    getLibraryDetailsListByIdResp: undefined,
    editLibraryDetailRequestResp: undefined,
    saveLibraryDetailsListResp: undefined,
    delLibraryRequestResp: undefined,

    //Library Rooms
    libraryRoomsRequestListResp: undefined,
    getLibraryRoomsListByIdResp: undefined,
    editLibraryRoomsRequestResp: undefined,
    saveLibraryRoomsListResp: undefined,
    delLibraryRoomsRequestResp: undefined,

    //Library Shelf
    libraryShelfRequestListResp: undefined,
    getLibraryShelfsListByIdResp: undefined,
    editLibraryShelfsRequestResp: undefined,
    saveLibraryShelfsListResp: undefined,
    delLibraryShelfsRequestResp: undefined,

    //Library Rack
    libraryRackRequestListResp: undefined,
    getLibraryRacksListByIdResp: undefined,
    editLibraryRacksRequestResp: undefined,
    saveLibraryRacksListResp: undefined,
    delLibraryRacksRequestResp: undefined,

    //Library Publisher
    libraryPublisherRequestListResp: undefined,
    getLibraryPublisherListByIdResp: undefined,
    editLibraryPublisherRequestResp: undefined,
    saveLibraryPublisherListResp: undefined,
    delLibraryPublisherRequestResp: undefined,

    //Library Record
    libraryRecordRequestListResp: undefined,

    //Library Category
    libraryCategoryRequestListResp: undefined,
    saveLibraryCategoriesListResp:undefined,
    libraryCategoryItemByIdResp:undefined,
    editLibraryCategoryItemResp:undefined,
    delLibraryCategoryItemResp:undefined,

    //Library Language
    libraryLanguageRequestListResp: undefined,

    //library User Record Type
    libraryUserRecordTypeRequestListResp: undefined,
    editLibraryUserRecordTypeRequestResp: undefined,

    //library User Type
    libraryUserTypeRequestListResp: undefined,
    editLibraryUserTypeRequestResp: undefined,

    //reset
    
    librarylistResp: undefined,

    //Rack, Shelf, Room Delete Prompt
    deleteLibraryRackPromptListResp: undefined,

    //Error
    libraryDetailsErrorAct: undefined,
}

export const librarySettings = createSlice({
    name: "librarySettings",
    initialState,
    reducers: {
        // libraryDetails

        setLibraryDetailsListAct: (state, action: PayloadAction<any>) => {
            state.libraryDetailsRequestListResp = action.payload;
        },
        setLibraryDetailsListByIdAct: (state, action: PayloadAction<any>) => {
            state.getLibraryDetailsListByIdResp = action.payload;
        },
        setSaveLibraryDetailsListAct: (state, action: PayloadAction<any>) => {
            state.saveLibraryDetailsListResp = action.payload;
        },
        setEditLibraryDetailsListAct: (state, action: PayloadAction<any>) => {
            state.editLibraryDetailRequestResp = action.payload;
        },
        setDelLibraryDetailsListAct: (state, action: PayloadAction<any>) => {
            state.delLibraryRequestResp = action.payload;
        },


        //Library Rooms
        setLibraryRoomsListAct: (state, action: PayloadAction<any>) => {
            state.libraryRoomsRequestListResp = action.payload;
        },
        setLibraryRoomsListByIdAct: (state, action: PayloadAction<any>) => {
            state.getLibraryRoomsListByIdResp = action.payload;
        },
        setSaveLibraryRoomsListAct: (state, action: PayloadAction<any>) => {
            state.saveLibraryRoomsListResp = action.payload;
        },
        setEditLibraryRoomsListAct: (state, action: PayloadAction<any>) => {
            state.editLibraryRoomsRequestResp = action.payload;
        },
        setDelLibraryRoomsListAct: (state, action: PayloadAction<any>) => {
            state.delLibraryRoomsRequestResp = action.payload;
        },
        //Library Shelf
        setLibraryShelfListAct: (state, action: PayloadAction<any>) => {
            state.libraryShelfRequestListResp = action.payload;
        },
        setLibraryShelfsListByIdAct: (state, action: PayloadAction<any>) => {
            state.getLibraryShelfsListByIdResp = action.payload;
        },
        setSaveLibraryShelfsListAct: (state, action: PayloadAction<any>) => {
            state.saveLibraryShelfsListResp = action.payload;
        },
        setEditLibraryShelfsListAct: (state, action: PayloadAction<any>) => {
            state.editLibraryShelfsRequestResp = action.payload;
        },
        setDelLibraryShelfsListAct: (state, action: PayloadAction<any>) => {
            state.delLibraryShelfsRequestResp = action.payload;
        },
        resetShelfAct: (state, action: PayloadAction<any>) => {
            state.libraryShelfRequestListResp = action.payload
        },


        //Library Rack
        setLibraryRackListAct: (state, action: PayloadAction<any>) => {
            state.libraryRackRequestListResp = action.payload;
        },
        setLibraryRacksListByIdAct: (state, action: PayloadAction<any>) => {
            state.getLibraryRacksListByIdResp = action.payload;
        },
        setSaveLibraryRacksListAct: (state, action: PayloadAction<any>) => {
            state.saveLibraryRacksListResp = action.payload;
        },
        setEditLibraryRacksListAct: (state, action: PayloadAction<any>) => {
            state.editLibraryRacksRequestResp = action.payload;
        },
        setDelLibraryRacksListAct: (state, action: PayloadAction<any>) => {
            state.delLibraryRacksRequestResp = action.payload;
        },
        resetRackAct: (state, action: PayloadAction<any>) => {
            state.libraryRackRequestListResp = action.payload
        },


        //Library Publisher
        setLibraryPublisherListAct: (state, action: PayloadAction<any>) => {
            state.libraryPublisherRequestListResp = action.payload;
        },
        setLibraryPublisherListByIdAct: (state, action: PayloadAction<any>) => {
            state.getLibraryPublisherListByIdResp = action.payload;
        },
        setSaveLibraryPublisherListAct: (state, action: PayloadAction<any>) => {
            state.saveLibraryPublisherListResp = action.payload;
        },
        setEditLibraryPublisherListAct: (state, action: PayloadAction<any>) => {
            state.editLibraryPublisherRequestResp = action.payload;
        },
        setDelLibraryPublisherListAct: (state, action: PayloadAction<any>) => {
            state.delLibraryPublisherRequestResp = action.payload;
        },

        //Library Record
        setLibraryRecordListAct: (state, action: PayloadAction<any>) => {
            state.libraryRecordRequestListResp = action.payload;
        },


        //Library Category
        setLibraryCategoryListAct: (state, action: PayloadAction<any>) => {
            state.libraryCategoryRequestListResp = action.payload;
        },
        setLibraryCategoryItemByIdAct:(state,action: PayloadAction<any> ) => {
            state.libraryCategoryItemByIdResp = action.payload
        },
        setSaveLibraryCategoriesListAct:(state,action:PayloadAction<any>) => {
            state.saveLibraryCategoriesListResp = action.payload
        },
        setEditLibraryCategoryItemAct:(state, action:PayloadAction<any>) => {
            state.editLibraryCategoryItemResp = action.payload
        },
        setDelLibraryCategoryItemAct:(state, action:PayloadAction<any>) => {
            state.delLibraryCategoryItemResp = action.payload
        },


        //Library Language
        setLibraryLanguageListAct: (state, action: PayloadAction<any>) => {
            state.libraryLanguageRequestListResp = action.payload;
        },

        //library User Record Type
        setLibraryUserRecordTypeListAct: (state, action: PayloadAction<any>) => {
            state.libraryUserRecordTypeRequestListResp = action.payload;
        },

        setEditLibraryUserRecordTypeListAct: (state, action: PayloadAction<any>) => {
            state.editLibraryUserRecordTypeRequestResp = action.payload;
        },
        //library User Type
        setLibraryUserTypeListAct: (state, action: PayloadAction<any>) => {
            state.libraryUserTypeRequestListResp = action.payload;
        },
        
        setEditLibraryUserTypeListAct: (state, action: PayloadAction<any>) => {
            state.editLibraryUserTypeRequestResp = action.payload;
        },

        ///reset

        resetLibraryListAct: (state, action: PayloadAction<any>) => {
        state.librarylistResp = action.payload
        },
        resetLibraryRoomAct: (state, action: PayloadAction<any>) => {
        state.libraryRoomsRequestListResp = action.payload
        },
        resetLibraryShelfAct: (state, action: PayloadAction<any>) => {
        state.libraryShelfRequestListResp = action.payload
        },

        //Rack, Shelf, Room Delete Prompt
        setDeleteLibraryRackPromptListAct: (state, action: PayloadAction<any>) => {
            state.deleteLibraryRackPromptListResp = action.payload;
        },

        // Error
        setLibraryDetailsErrorAct: (state, action: PayloadAction<any>) => {
            state.libraryDetailsErrorAct = action.payload;
        }


    }
})

export const {
    //libraryDetails
    setLibraryDetailsListAct,
    setLibraryDetailsListByIdAct,
    setSaveLibraryDetailsListAct,
    setEditLibraryDetailsListAct,
    setDelLibraryDetailsListAct,

    //Library Rooms
    setLibraryRoomsListAct,
    setLibraryRoomsListByIdAct,
    setSaveLibraryRoomsListAct,
    setEditLibraryRoomsListAct,
    setDelLibraryRoomsListAct,

    //Library Shelf
    setLibraryShelfListAct,
    setLibraryShelfsListByIdAct,
    setSaveLibraryShelfsListAct,
    setEditLibraryShelfsListAct,
    setDelLibraryShelfsListAct,
    resetShelfAct,
    resetRackAct,

    //Library Rack
    setLibraryRackListAct,
    setLibraryRacksListByIdAct,
    setSaveLibraryRacksListAct,
    setEditLibraryRacksListAct,
    setDelLibraryRacksListAct,

    //Library Rack
    setLibraryPublisherListAct,
    setLibraryPublisherListByIdAct,
    setSaveLibraryPublisherListAct,
    setEditLibraryPublisherListAct,
    setDelLibraryPublisherListAct,

    //Library Record
    setLibraryRecordListAct,

    //Library Category
    setLibraryCategoryListAct,
    setLibraryCategoryItemByIdAct,
    setSaveLibraryCategoriesListAct,
    setEditLibraryCategoryItemAct,
    setDelLibraryCategoryItemAct,

    //Library Language
    setLibraryLanguageListAct,

    //library User Record Type
    setLibraryUserRecordTypeListAct,
    setEditLibraryUserRecordTypeListAct,

    //library User Type
    setLibraryUserTypeListAct,
    setEditLibraryUserTypeListAct,
    //reset
    
    resetLibraryListAct,
    resetLibraryRoomAct,
    resetLibraryShelfAct,

    //Rack, Shelf, Room Delete Prompt
    setDeleteLibraryRackPromptListAct,

    //Error
    setLibraryDetailsErrorAct,


} = librarySettings.actions;

export default librarySettings.reducer;
