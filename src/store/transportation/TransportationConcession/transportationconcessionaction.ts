import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { TransportConcessionConstants } from "./transportationconcessionconstants";


export const getTransportConcessionListAct = createAction<INewActionType | undefined>(TransportConcessionConstants.GET_TRANPORT_CONCESSION_LIST);
export const deleteTransportConcessionAct = createAction<INewActionType | undefined>(TransportConcessionConstants.DELETE_TRANPORT_CONCESSION_LIST);
export const createTransportConcessionAct = createAction<INewActionType | undefined>(TransportConcessionConstants.CREATE_TRANPORT_CONCESSION);
export const editTransportConcessionAct = createAction<INewActionType | undefined>(TransportConcessionConstants.EDIT_TRANPORT_CONCESSION);
export const getTransportConcessionByIdAct = createAction<INewActionType | undefined>(TransportConcessionConstants.GET_TRANPORT_CONCESSION_BY_ID);
export const exportTransportConcessionAct = createAction<INewActionType | undefined>(TransportConcessionConstants.EXPORT_TRANPORT_CONCESSION);