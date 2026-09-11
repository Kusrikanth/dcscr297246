
import React, { useEffect, useMemo, useRef, useState } from "react";
import TableContainer from "../../../Components/Common/TableContainer";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { generateColumnsForAdd } from "./helper";




const AddMonthWiseAttendance = ( props: any) => {

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getAllChangeStudentsListActResp,
        saveChangeStudentDetailsResp,
        applicationSaleError,
        showApiLoader, exportChangeStudentListResp,
        sendNotifiChangeStuDetailResp,
        sectionListResp,
        getMonthWiseAttListResp,
        getAttendanceHolidayDetailsListResp
    } = useAppSelector(
        ({ applicationSale, globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, dailyAttendance,holidayDetails }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getAllChangeStudentsListActResp: applicationSale.getAllChangeStudentsListActResp,
            saveChangeStudentDetailsResp: applicationSale.saveChangeStudentDetailsResp,
            applicationSaleError: applicationSale.applicationSaleError,
            showApiLoader: globalData.showApiLoader,
            exportChangeStudentListResp: applicationSale.exportChangeStudentListResp,
            sendNotifiChangeStuDetailResp: applicationSale.sendNotifiChangeStuDetailResp,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            getMonthWiseAttListResp: dailyAttendance.getMonthWiseAttListResp,
            getAttendanceHolidayDetailsListResp:  holidayDetails.getAttendanceHolidayDetailsListResp
        }),
        shallowEqual
    );
    
    
    const roleColumns = useMemo(() => generateColumnsForAdd( props.selectedMonth , props.selectedYear,props.startDate,props.endDate, props.allStudentCheckHndlr,props.singleStudentCheckHndlr,props.allStudentSelectedState), [props.selectedMonth,props.selectedYear,props.startDate,props.endDate, props.allStudentCheckHndlr,props.singleStudentCheckHndlr,props.allStudentSelectedState]);

    const memoizedHolidayDetailsList = useMemo(() => getAttendanceHolidayDetailsListResp, [getAttendanceHolidayDetailsListResp]);



    return (    
        <> 
            <TableContainer
                columns={roleColumns}
                data={props.data || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-slate-100 tw-text-slate-500 tw-align-middle"
                // showCheckbox={true}
                showPagination={false}
                onChangeInputHndlr={props.onChangeInputHndlr}
                rowDataInfo={memoizedHolidayDetailsList}
            />
                        
        </>
    );
};

export default AddMonthWiseAttendance;
