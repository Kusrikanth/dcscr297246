
import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { RegistrationInstructionConstants } from "./registrationinstructionconstants";
export { setResetRegistrationInstructionHtmlByIdAct } from './registrationinstructionslice'

export const getRegistrationInstructionAct = createAction<INewActionType | undefined>(RegistrationInstructionConstants.GET_REGISTRATION_INSTRUCTION);
export const updateRegistrationInstructionAct = createAction<INewActionType | undefined>(RegistrationInstructionConstants.UPDATE_REGISTRATION_INSTRUCTION);
export const saveRegistrationInstructionAct = createAction<INewActionType | undefined>(RegistrationInstructionConstants.SAVE_REGISTRATION_INSTRUCTION);
export const getRegistrationInstructionHtmlByIdAct = createAction<INewActionType | undefined>(RegistrationInstructionConstants.GET_REGISTRATION_INSTRUCTION_HTML_BY_ID);
export const deleteRegistrationInstructionAct = createAction<INewActionType | undefined>(RegistrationInstructionConstants.DELETE_REGISTRATION_INSTRUCTION);