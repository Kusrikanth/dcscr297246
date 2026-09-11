
import { useMemo } from "react";
import { shallowEqual } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../hooks/storehook";
import { getFormattedDateddMMMYYYY } from "../../../utility/dateutility";
// import { generateColumnsForAdd } from "./helper";




const EmployeeInfoAttendance = ( props: any) => {

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
            getAttendanceHolidayDetailsListResp: holidayDetails.getAttendanceHolidayDetailsListResp
        }),
        shallowEqual
    );
    
    
    // const roleColumns = useMemo(() => generateColumnsForAdd( props.selectedMonth , props.selectedYear,props.startDate,props.endDate, props.allStudentCheckHndlr,props.singleStudentCheckHndlr,props.allStudentSelectedState), [props.selectedMonth,props.selectedYear,props.startDate,props.endDate, props.allStudentCheckHndlr,props.singleStudentCheckHndlr,props.allStudentSelectedState]);

    const memoizedHolidayDetailsList = useMemo(() => getAttendanceHolidayDetailsListResp, [getAttendanceHolidayDetailsListResp]);


    return (
        <>
            <div className="tw-p-4">
                <div className="tw-bg-gray-100 tw-p-4 tw-rounded-lg">

                    <div>
                        <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                            Check In Date & Time
                        </p>
                        <p className=" tw-text-base tw-font-bold tw-text-gray-800">
                            {`${props.modalData.day}, ${getFormattedDateddMMMYYYY(
                                props.modalData.date
                            )} 08:29 AM`}
                        </p>
                    </div>

                    <div className="tw-flex tw-justify-center tw-items-center tw-my-6">
                        <div className="tw-bg-white tw-rounded-full tw-flex tw-justify-center tw-items-center tw-w-[110px] tw-h-[110px] tw-shadow-sm">
                            <p className="tw-mb-0 tw-text-center tw-p-4">
                                <span className="tw-text-lg tw-font-bold">08:15</span>{" "}
                                <span className="tw-text-sm tw-text-gray-600">Hrs</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                            Check Out Date & Time
                        </p>
                        <p className="tw-mb-0 tw-text-base tw-font-bold tw-text-gray-800">
                            {`${props.modalData.day}, ${getFormattedDateddMMMYYYY(
                                props.modalData.date
                            )} 06:11 AM`}
                        </p>
                    </div>

                </div>
            </div>

   
        </>
    );
};

export default EmployeeInfoAttendance;
