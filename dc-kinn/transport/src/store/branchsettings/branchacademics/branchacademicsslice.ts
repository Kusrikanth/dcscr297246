import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBrchAcademicReducerState } from "./branchacademicstypes";
import { IModelWithPagination } from "../../types";

const initialState: IBrchAcademicReducerState = {
    brchAcademicYearListResp: undefined,
    addBrchAcademicYearResp: undefined,
    updateBrchAcademicYearResp: undefined,
    deleteBrchAcademicYearResp: undefined,
    academicBrchTermListResp: undefined,
    addBrchAcademicTermResp: undefined,
    updateBrchAcademicTermResp: undefined,
    deleteBrchAcademicTermResp: undefined,

    brchCurriculumResp: undefined,
    branchCurriculumScopeResp: undefined,
    addBrchCurriculumResp: undefined,
    updateBrchCurriculumResp: undefined,
    deleteBrchCurriculumResp: undefined,

    branchClassResp: undefined,
    branchClassScopeResp: undefined,
    curriculumWiseResp: undefined,
    addBrchClassResp: undefined,
    updateBrchClassResp: undefined,
    deleteBrchClassResp: undefined,

    brchCurriculumClassResp: undefined,
    addBrchCurriculumClassResp: undefined,
    updateBrchCurriculumClassResp: undefined,
    deleteBrchCurriculumClassResp: undefined,

    brchSectionsResp: undefined,
    addBrchSectionResp: undefined,
    updateBrchSectionResp: undefined,
    deleteBrchSectionResp: undefined,
    brchSectionByClassResp: undefined,

    brchSubjectsResp: undefined,
    instSubjectNameResp: undefined,
    addBrchSubjectResp: undefined,
    updateBrchSubjectResp: undefined,
    deleteBrchSubjectResp: undefined,

    brchStreamGroupsResp: undefined,
    addBrchStreamGroupResp: undefined,
    updateBrchStreamGroupResp: undefined,
    deleteBrchStreamGroupResp: undefined,

    brchAcademicClassesResp: undefined,

    classWiseTermsDateResp: undefined,
    deleteClassWiseTermsDateResp: undefined,
    addClassWiseTermsDateResp: undefined,
    updateClassWiseTermsDateResp: undefined,

    classBranchWiseTermsIdResp: undefined,
    addAcademicDateRep: undefined,
    updateAcademicDateRep: undefined,
    deleteAcademicDateRep: undefined,
    getAcademicLanguagesResp: undefined,

    getMasterCurriculumResp: undefined,
    getMasterCurriculumClassResp: undefined,

    brchAcademicErrorResp: undefined
};

export const brchAcademicsSlice = createSlice({
    name: "branchacademics",
    initialState,
    reducers: {
        setBrchAcademicYearAct: (state, action: PayloadAction<any>) => {
            state.brchAcademicYearListResp = action.payload
        },
        setAddBrchtAcademicYearAct: (state, action: PayloadAction<any>) => {
            state.addBrchAcademicYearResp = action.payload
        },
        setUpdateBrchAcademicYearAct: (state, action: PayloadAction<any>) => {
            state.updateBrchAcademicYearResp = action.payload
        },
        setDeleteBrchAcademicYearAct: (state, action: PayloadAction<any>) => {
            state.deleteBrchAcademicYearResp = action.payload
        },
        setBrchAcademicTermAct: (state, action: PayloadAction<any>) => {
            state.academicBrchTermListResp = action.payload
        },
        setAddBrchAcademicTermAct: (state, action: PayloadAction<any>) => {
            state.addBrchAcademicTermResp = action.payload
        },
        setUpdateBrchAcademicTermAct: (state, action: PayloadAction<any>) => {
            state.updateBrchAcademicTermResp = action.payload
        },
        setDeleteBrchAcademicTermAct: (state, action: PayloadAction<any>) => {
            state.deleteBrchAcademicTermResp = action.payload
        },

        setBrchCurriculumAct: (state, action: PayloadAction<any>) => {
            state.brchCurriculumResp = action.payload
        },
        resetBrchCurriculumAct: (state, action: PayloadAction<any>) => {
            state.brchCurriculumResp = action.payload
        },
        setBrchCurriculumScopeAct: (state, action: PayloadAction<any>) => {
            const { payload } = action || {},
                { optionalConfig, data: payloadData } = payload || {};
            if (optionalConfig?.scope) {
                const scopeKey = optionalConfig.scope;
                const prev = state.branchCurriculumScopeResp || {};
                if (!payloadData) {
                    const next = { ...prev };
                    delete next[scopeKey];
                    state.branchCurriculumScopeResp = Object.keys(next).length ? next : undefined;
                } else {
                    state.branchCurriculumScopeResp = {
                        ...prev,
                        [scopeKey]: payloadData
                    };
                }
            }
        },
        setAddBrchCurriculumAct: (state, action: PayloadAction<any>) => {
            state.addBrchCurriculumResp = action.payload
        },
        setUpdateBrchCurriculumAct: (state, action: PayloadAction<any>) => {
            state.updateBrchCurriculumResp = action.payload
        },
        setDeleteBrchCurriculumAct: (state, action: PayloadAction<any>) => {
            state.deleteBrchCurriculumResp = action.payload
        },

        setBrchClassAct: (state, action: PayloadAction<any>) => {
            state.branchClassResp = action.payload
        },
        setCurriculumWiseAct: (state, action: PayloadAction<any>) => {
            state.curriculumWiseResp = action.payload
        },
        resetBrchClassAct: (state, action: PayloadAction<any>) => {
            state.branchClassResp = action.payload
        },
        setBranchClassScopeAct: (state, action: PayloadAction<any>) => {
            const { payload } = action || {},
                { optionalConfig, data: payloadData } = payload || {};
            if (optionalConfig?.scope) {
                const scopeKey = optionalConfig.scope;
                const prev = state.branchClassScopeResp || {};
                if (!payloadData) {
                    const next = { ...prev };
                    delete next[scopeKey];
                    state.branchClassScopeResp = Object.keys(next).length ? next : undefined;
                } else {
                    state.branchClassScopeResp = {
                        ...prev,
                        [scopeKey]: payloadData
                    };
                }
            }
        },
        setAddBrchClassAct: (state, action: PayloadAction<any>) => {
            state.addBrchClassResp = action.payload
        },
        setUpdateBrchClassAct: (state, action: PayloadAction<any>) => {
            state.updateBrchClassResp = action.payload
        },
        setDeleteBrchClassAct: (state, action: PayloadAction<any>) => {
            state.deleteBrchClassResp = action.payload
        },

        setClassWiseTermsDateAct: (state, action: PayloadAction<any>) => {
            state.classWiseTermsDateResp = action.payload
        },
        setDeleteClassWiseTermsDateAct: (state, action: PayloadAction<any>) => {
            state.deleteClassWiseTermsDateResp = action.payload
        },
        setAddClassWiseTermsDateAct: (state, action: PayloadAction<any>) => {
            state.addClassWiseTermsDateResp = action.payload
        },
        setUpdateClassWiseTermsDateAct: (state, action: PayloadAction<any>) => {
            state.updateClassWiseTermsDateResp = action.payload
        },

        setClassBranchWiseTermsIdAct: (state, action: PayloadAction<any>) => {
            state.classBranchWiseTermsIdResp = action.payload
        },
        setAddAcademicDateAct: (state, action: PayloadAction<any>) => {
            state.addAcademicDateRep = action.payload;
        },
        setUpdateAcademicDateAct: (state, action: PayloadAction<any>) => {
            state.updateAcademicDateRep = action.payload;
        },
        setDeleteAcademicDateAct: (state, action: PayloadAction<any>) => {
            state.deleteAcademicDateRep = action.payload;
        },


        setBrchCurriculumClassAct: (state, action: PayloadAction<any>) => {
            state.brchCurriculumClassResp = action.payload
        },
        setAddBrchCurriculumClassAct: (state, action: PayloadAction<any>) => {
            state.addBrchCurriculumClassResp = action.payload
        },
        setUpdateBrchCurriculumClassAct: (state, action: PayloadAction<any>) => {
            state.updateBrchCurriculumClassResp = action.payload
        },
        setDeleteBrchCurriculumClassAct: (state, action: PayloadAction<any>) => {
            state.deleteBrchCurriculumClassResp = action.payload
        },

        setBrchSubjectsAct: (state, action: PayloadAction<any>) => {
            state.brchSubjectsResp = action.payload
        },
        setInstSubjectNameAct: (state, action: PayloadAction<any>) => {
            state.instSubjectNameResp = action.payload
        },
        setAddBrchSubjectAct: (state, action: PayloadAction<any>) => {
            state.addBrchSubjectResp = action.payload
        },
        setUpdateBrchSubjectAct: (state, action: PayloadAction<any>) => {
            state.updateBrchSubjectResp = action.payload
        },
        setDeleteBrchSubjectAct: (state, action: PayloadAction<any>) => {
            state.deleteBrchSubjectResp = action.payload
        },

        setBrchSectionsAct: (state, action: PayloadAction<any>) => {
            state.brchSectionsResp = action.payload
        },
        resetBrchSectionsAct: (state, action: PayloadAction<any>) => {
            state.brchSectionsResp = action.payload
        },
        setAddBrchSectionAct: (state, action: PayloadAction<any>) => {
            state.addBrchSectionResp = action.payload
        },
        setUpdateBrchSectionAct: (state, action: PayloadAction<any>) => {
            state.updateBrchSectionResp = action.payload
        },
        setDeleteBrchSectionAct: (state, action: PayloadAction<any>) => {
            state.deleteBrchSectionResp = action.payload
        },
        setBrchSectionByClassAct: (state, action: PayloadAction<any>) => {
            state.brchSectionByClassResp = action.payload
        },
        resetBrchSectionByClassAct: (state, action: PayloadAction<any>) => {
            state.brchSectionByClassResp = action.payload
        },


        setBrchStreamGroupsAct: (state, action: PayloadAction<any>) => {
            state.brchStreamGroupsResp = action.payload
        },
        setAddBrchStreamGroupAct: (state, action: PayloadAction<any>) => {
            state.addBrchStreamGroupResp = action.payload
        },
        setUpdateBrchStreamGroupAct: (state, action: PayloadAction<any>) => {
            state.updateBrchStreamGroupResp = action.payload
        },
        setDelBrchStreamGroupAct: (state, action: PayloadAction<any>) => {
            state.deleteBrchStreamGroupResp = action.payload
        },

        setBrchAcademicClassesAct: (state, action: PayloadAction<any>) => {
            state.brchAcademicClassesResp = action.payload
        },

        setBrchAcademicsErrorAct: (state, action: PayloadAction<any>) => {
            state.brchAcademicErrorResp = action.payload
        },
        setAcademicLanguagesAct: (state, action: PayloadAction<any>) => {
            state.getAcademicLanguagesResp = action.payload
        },
        setMastersCurriculumAct: (state, action: PayloadAction<any>) => {
            state.getMasterCurriculumResp = action.payload
        },
        setMasterCurriculumClassAct: (state, action: PayloadAction<any>) => {
            state.getMasterCurriculumClassResp = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase('RESET_STATE', (state) => {
            return initialState;
        });
        builder.addCase('RESET_BRANCHACADEMIC_STORE', (state) => {
            return initialState;
        });
    },
});

export const {
    setBrchAcademicYearAct,
    setAddBrchtAcademicYearAct, setUpdateBrchAcademicYearAct,
    setDeleteBrchAcademicYearAct,

    setBrchAcademicTermAct,
    setAddBrchAcademicTermAct, setUpdateBrchAcademicTermAct,
    setDeleteBrchAcademicTermAct,
    resetBrchSectionByClassAct,

    setBrchCurriculumAct, setBrchCurriculumScopeAct, resetBrchCurriculumAct, setAddBrchCurriculumAct, setUpdateBrchCurriculumAct, setDeleteBrchCurriculumAct,
    setBrchClassAct, resetBrchClassAct, setBranchClassScopeAct, setCurriculumWiseAct, setAddBrchClassAct, setUpdateBrchClassAct, setDeleteBrchClassAct,

    setClassWiseTermsDateAct, setDeleteClassWiseTermsDateAct, setAddClassWiseTermsDateAct, setUpdateClassWiseTermsDateAct,

    setClassBranchWiseTermsIdAct, setAddAcademicDateAct, setDeleteAcademicDateAct, setUpdateAcademicDateAct,

    setBrchCurriculumClassAct, setAddBrchCurriculumClassAct, setUpdateBrchCurriculumClassAct, setDeleteBrchCurriculumClassAct,

    setBrchSubjectsAct, setInstSubjectNameAct, setAddBrchSubjectAct, setUpdateBrchSubjectAct, setDeleteBrchSubjectAct,
    setBrchSectionsAct, resetBrchSectionsAct, setAddBrchSectionAct, setUpdateBrchSectionAct, setDeleteBrchSectionAct,
    setBrchSectionByClassAct,

    setBrchStreamGroupsAct, setAddBrchStreamGroupAct, setUpdateBrchStreamGroupAct, setDelBrchStreamGroupAct,
    setBrchAcademicClassesAct, setAcademicLanguagesAct,
    setBrchAcademicsErrorAct, setMastersCurriculumAct, setMasterCurriculumClassAct } = brchAcademicsSlice.actions;

export default brchAcademicsSlice.reducer;
