import {call,put,takeLatest} from "redux-saga/effects";
import { getData, postData,putData,deleteData } from "../../../api/apiactions";
import { setAddStuDailyAttListAct, setAttendanceDashboardAct, setAttendanceReportListAct, setAttendanceSectionAnalysisAct, setDateRangeDailyAttAct, setExportAttendanceReportAct, setExportMostAbsenteesDataAct, setExportTotalWorkingDaysReportAct, setMonthForBranchAndClassAct, setMonthWiseAttListAct, setSaveTriggerAttendanceAct, setStuDailyAttErrAct, setStuDailyAttListAct, setTotalWorkingDaysReportListAct, setUpdateMonthWiseAttListAct, setUpdateStuDailyAttListAct } from "./dailyattendanceslice";
import { ICreatedActionType } from "../../types";
import { DailyAttendanceConstants } from "./dailyattendanceconstants";

function* getStuDailyAttListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        yield put(setStuDailyAttListAct(response.data));
    }
}

function* addStuDailyAttListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        yield put(setAddStuDailyAttListAct(response.data));
    }
}

function* updateStuDailyAttListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        yield put(setUpdateStuDailyAttListAct({statusCode : response.status}));
    }
}

function* dateRangeDailyAttGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        yield put(setDateRangeDailyAttAct(response.data));
    }
}
function* exportAttendanceReportGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        yield put(setExportAttendanceReportAct(response.data));
    }
}

function* attendanceReportListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        if(response.data){
            yield put(setAttendanceReportListAct(response.data));
        }else{
            yield put(setAttendanceReportListAct({statusCode : response.status}));
        }
    }
}

function* getMonthWiseAttListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        yield put(setMonthWiseAttListAct(response.data));
    }
}

function* exportMostAbsenteesDataGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        yield put(setExportMostAbsenteesDataAct(response.data));
    }
}

function* upadteMonthWiseAttListGen (action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        yield put(setUpdateMonthWiseAttListAct({statusCode : response.status}));
    }
}

function* getMonthForBranchAndClassGen (action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        yield put(setMonthForBranchAndClassAct(response.data));
    }
}

function* totalWorkingDaysReportListGen (action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        yield put(setTotalWorkingDaysReportListAct(response.data));
    }
}

function* exportTotalWorkingDaysReportGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        yield put(setExportTotalWorkingDaysReportAct(response.data));
    }
}

function* getAttendanceDashboardGen (action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        yield put(setAttendanceDashboardAct(response.data));
    }
}
function* getAttendanceSectionAnalysisGen (action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        yield put(setAttendanceSectionAnalysisAct(response.data));
    }
}

function* saveTriggerAttendanceGen (action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuDailyAttErrAct(response.error));
    } else {
        yield put(setSaveTriggerAttendanceAct({statusCode : response.status}));
    }
}

export default function* vehicleDetailRequestSaga(){
    yield takeLatest(DailyAttendanceConstants.GET_STU_DAILY_ATT_LIST ,getStuDailyAttListGen);
    yield takeLatest(DailyAttendanceConstants.ADD_STU_DAILY_ATT_LIST ,addStuDailyAttListGen);
    yield takeLatest(DailyAttendanceConstants.UPDATE_DAILY_ATT_LIST ,updateStuDailyAttListGen);
    yield takeLatest(DailyAttendanceConstants.DATE_RANGE_DAILY_ATT ,dateRangeDailyAttGen);
    yield takeLatest(DailyAttendanceConstants.ATTENDANCE_REPORT_LIST ,attendanceReportListGen);
    yield takeLatest(DailyAttendanceConstants.EXPORT_ATTENDANCE_REPORT ,exportAttendanceReportGen);
    yield takeLatest(DailyAttendanceConstants.GET_MONTH_FOR_BRANCH_AND_CLASS ,getMonthForBranchAndClassGen);
    yield takeLatest(DailyAttendanceConstants.TOTAL_WORKING_DAYS_REPORT_LIST ,totalWorkingDaysReportListGen);
    yield takeLatest(DailyAttendanceConstants.EXPORT_TOTAL_WORKING_DAYS_REPORT ,exportTotalWorkingDaysReportGen);

    // Month wise Attendance

    yield takeLatest(DailyAttendanceConstants.GET_MONTH_WISE_ATT_LIST ,getMonthWiseAttListGen);
    yield takeLatest(DailyAttendanceConstants.EXPORT_MOST_ABSENTEES_DATA ,exportMostAbsenteesDataGen);
    yield takeLatest(DailyAttendanceConstants.UPDATE_MONTH_WISE_ATT_LIST ,upadteMonthWiseAttListGen);
    yield takeLatest(DailyAttendanceConstants.GET_ATTENDANCE_DASHBOARD ,getAttendanceDashboardGen);
    yield takeLatest(DailyAttendanceConstants.GET_ATTENDANCE_SECTION_ANALYSIS ,getAttendanceSectionAnalysisGen);
    yield takeLatest(DailyAttendanceConstants.SAVE_TRIGGER_ATTENDANCE ,saveTriggerAttendanceGen);
}