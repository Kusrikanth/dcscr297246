import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { LibrarySettingsConstants } from "./librarysettingsconstants";

//Details
export const getLibraryDetailsListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_DETAILS);
export const getLibraryDetailsListByIdAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_DETAILS_LIST_BY_ID);
export const editLibraryDetailsListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.EDIT_LIBRARY_DETAILS_LIST);
export const saveLibraryDetailsListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.SAVE_LIBRARY_DETAILS_LIST);
export const deleteLibraryDetailsListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.DELETE_LIBRARY_DETAILS_LIST);

//Rooms
export const getLibraryRooms = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_ROOMS);
export const getLibraryRoomsListByIdAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_ROOMS_LIST_BY_ID);
export const editLibraryRoomsListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.EDIT_LIBRARY_ROOMS_LIST);
export const saveLibraryRoomsListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.SAVE_LIBRARY_ROOMS_LIST);
export const deleteLibraryRoomsListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.DELETE_LIBRARY_ROOMS_LIST);

//Shelfs
export const getLibraryshelf = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_SHELF);
export const getLibraryShelfsListByIdAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_SHELFS_LIST_BY_ID);
export const editLibraryShelfsListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.EDIT_LIBRARY_SHELFS_LIST);
export const saveLibraryShelfsListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.SAVE_LIBRARY_SHELFS_LIST);
export const deleteLibraryShelfsListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.DELETE_LIBRARY_SHELFS_LIST);


export const getLibraryrack = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_RACK);
export const getLibraryRacksListByIdAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_RACKS_LIST_BY_ID);
export const editLibraryRacksListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.EDIT_LIBRARY_RACKS_LIST);
export const saveLibraryRacksListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.SAVE_LIBRARY_RACKS_LIST);
export const deleteLibraryRacksListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.DELETE_LIBRARY_RACKS_LIST);

//Publishers
export const getLibrarypublisherList = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_PUBLISHER);
export const getLibraryPublisherListByIdAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_PUBLISHER_LIST_BY_ID);
export const editLibraryPublisherListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.EDIT_LIBRARY_PUBLISHER_LIST);
export const saveLibraryPublisherListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.SAVE_LIBRARY_PUBLISHER_LIST);
export const deleteLibraryPublisherListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.DELETE_LIBRARY_PUBLISHER_LIST);


export const getLibraryRecordListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_RECORD);


export const getLibraryCategoryListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_CATEGORY);
export const getLibraryCategoryItemByIdAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_CATEGORY_BY_ID)
export const saveLibraryCategoriesAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.SAVE_LIBRARY_CATEGORY_ITEMS)
export const editLibraryCategoryItemAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.EDIT_LIBRARY_CATEGORY_ITEM)
export const delLibraryCategoryItemAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.DELETE_LIBRARY_CATEGORY_ITEM)


export const getLibraryLanguageListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_LANGUAGE);

//library User Record Type
export const getLibraryUserRecordTypeListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_USER_RECORD_TYPE);
export const editLibraryUserUserRecordTypeListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.EDIT_LIBRARY_USER__RECORD_TYPE);

//library User Type
export const getLibraryUserTypeListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.GET_LIBRARY_USER_TYPE);
export const editLibraryUserTypeListAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.EDIT_LIBRARY_USER_TYPE);

//Rack, Shelf, Room Delete Prompt
export const deleteLibraryRackPromptAct = createAction<INewActionType | undefined>(LibrarySettingsConstants.DELETE_LIBRARY_RACK_PROMPT);