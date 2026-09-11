
import { useEffect, useMemo, useRef, useState } from "react";
import { DateInput, ModalContainerUpdated, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";

import { shallowEqual } from "react-redux";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

import { getMonth } from "date-fns";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from 'yup';
import { Current_Date_YYYYMMDD, Current_Month_UpperCase, Current_Year, getDatesForMonth, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";
import { dummmyData, formatAcademicYearDates, generateColumns } from "./helper";
import EmployeeInfoAttendance from "./EmployeeInfoAttendance";
import { useModal } from "../../../hooks/modalhook";
import { default as PresentMark } from "../../../assets/imagesdps/attendence/PresentMark.svg?react";
import { default as AbsentMark } from "../../../assets/imagesdps/attendence/AbsentMark.svg?react";  
import { default as HolidayMark } from "../../../assets/imagesdps/attendence/HolidayMark.svg?react";


const validationSchema = yup.object().shape({
    searchString: yup.string(),
    academicYearId: yup.string().required('Academic Year is required'),
    curriculumId: yup.string().required('Curriculum is required'),
    classId: yup.string().required('Class is required'),
    sectionId: yup.string().required('Section is required'),
    month: yup.string().required('Month is required'),
});


const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId: "",
    monthYear: "",       
    selectedMonth: "",   
    selectedYear: "",
    month: "",
    startDate: "",
    endDate: "",
    dateList : [],
};
const statusData = [
    {
      id: 1,
      count: 43,
      label: 'Total Employee',
      iconClass: 'ri-team-line',
      bgColor: 'bg-primary-subtle',
      iconColor: 'text-primary'
    },
    {
      id: 2,
      count: 6,
      label: 'Absent Employee (Today)',
      iconClass: 'ri-user-unfollow-line',
      bgColor: 'bg-danger-subtle',
      iconColor: 'text-danger'
    },
    {
      id: 3,
      count: 32,
      label: 'Present Employee (Today)',
      iconClass: 'ri-user-follow-line',
      bgColor: 'bg-success-subtle',
      iconColor: 'text-success'
    },
    {
      id: 4,
      count: 22,
      label: 'Working Days (Current Month)',
      iconClass: 'ri-calendar-line',
      bgColor: 'bg-info-subtle',
      iconColor: 'text-info'
    }
  ];
const EmployeeAttendance = () => {

     const { modalState: previewModalState, closeModal: closePreviewModalHndlr,
            openModal: openPreviewModalHndlr
        } = useModal();
    const dispatch = useAppDispatch();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const [attendanceData , setAttendanceData] = useState(false);
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    const [monthlyAttList, setMonthlyAttList] = useState<Array<any>>([]);

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        stuDailyAttErrResp,
        sectionListResp,
        getMonthWiseAttListResp,
        getAttendanceHolidayDetailsListResp,
        updateMonthWiseAttListResp,
        dateRangeDailyAttResp,
    } = useAppSelector(
        ({ applicationSale, globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, feeCollections,dailyAttendance,holidayDetails }) => ({
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
            stuDailyAttErrResp:dailyAttendance.stuDailyAttErrResp,
            updateMonthWiseAttListResp:dailyAttendance.updateMonthWiseAttListResp,
            dateRangeDailyAttResp:dailyAttendance.dateRangeDailyAttResp,
            getAttendanceHolidayDetailsListResp: holidayDetails.getAttendanceHolidayDetailsListResp
        }),
        shallowEqual
    );

    const filterForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            
        }
    })

    const roleColumns = useMemo(() => generateColumns(filterForm.values.selectedMonth , filterForm.values.selectedYear,filterForm.values.startDate, filterForm.values.endDate, openPreviewModalHndlr), [filterForm.values.selectedMonth , filterForm.values.selectedYear, filterForm.values.startDate, filterForm.values.endDate,openPreviewModalHndlr]);

    const memoizedHolidayDetailsList = useMemo(() => getAttendanceHolidayDetailsListResp, [getAttendanceHolidayDetailsListResp]);

    useEffect(() => {
        if(Array.isArray(dateRangeDailyAttResp?.content) && dateRangeDailyAttResp?.content?.length > 0) {
            const selectedData = dateRangeDailyAttResp?.content[0]

        let yearId : any = selectedData?.academicYearId
        let year :any = selectedData?.startDate?.split("-")[0]
        const startDate: string = selectedData?.startDate;
        const endDate: string = selectedData?.endDate;
        
        const dateList = getDatesForMonth(+year,getMonth(new Date()) + 1)
        const monthList = formatAcademicYearDates(dateRangeDailyAttResp?.content, yearId)

        const newList = monthList?.find(({id}: any) => {
            const month = id?.split("-")[0]?.toUpperCase();
            const year = id?.split("-")[1];
            return month === Current_Month_UpperCase && +year === +Current_Year
        });
        
        filterForm.setValues((prev: any) => ({ ...prev , dateList , month :newList?.id , selectedMonth : Current_Month_UpperCase , selectedYear : Current_Year, startDate, endDate }));
        }
        else if (Array.isArray(dateRangeDailyAttResp?.content) && dateRangeDailyAttResp?.content?.length === 0) {
            toast.warning("There no date range for given class , Kindly add through settings")
            filterForm.setValues((prev: any) => ({ ...prev , dateList :[] , startDate:"", endDate:""}));
        }     
        
    }, [dateRangeDailyAttResp]);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;    
        pagination.current.pageNo = 0;
       
            filterForm.setFieldValue(name, value)
            setAttendanceData(false)
        
    }


    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
    }

    return (    
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="HRMS" />

                    <div className="tw-flex tw-flex-wrap tw--mx-2">
                        {statusData.map((item) => (
                            <div key={item.id} className="tw-w-1/2 lg:tw-w-1/4 tw-px-2">
                                <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-3">
                                    <div className="tw-p-4">
                                        <div className="tw-flex tw-items-center">

                                            <div
                                                className={`tw-flex tw-items-center tw-justify-center tw-mr-3 tw-p-2 tw-rounded ${item.bgColor}`}
                                            >
                                                <i className={`${item.iconClass} ${item.iconColor} tw-text-lg`} />
                                            </div>

                                            <div className="tw-flex tw-flex-col tw-overflow-hidden">
                                                <p className="tw-mb-1 tw-text-gray-500 tw-text-sm tw-truncate">
                                                    {item.label}
                                                </p>
                                                <h5 className="tw-mb-0 tw-font-semibold tw-text-base">
                                                    {item.count}
                                                </h5>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mt-2 tw-mb-6">

                        <div className="tw-p-4">

                            <div className="tw-flex tw-flex-wrap tw-gap-4">

                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/6">
                                    <div className="tw-relative">
                                        <TextInput
                                            name="searchString"
                                            value={filterForm.values.searchString}
                                            onChange={filterHandler}
                                            inputClassName="tw-bg-gray-100"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                                    </div>
                                </div>

                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/6">
                                    <DateInput
                                        name="startDate"
                                        value={filterForm.values.startDate}
                                        onChange={filterHandler}
                                        formgroupClassName="tw-mb-0"
                                        labelText="Attendance Date"
                                        floatingLabel
                                        maxDate={Current_Date_YYYYMMDD}
                                    />
                                </div>

                            </div>

                            <div className="tw-mt-4 tw-flex tw-flex-wrap tw-items-center tw-gap-6">

                                <div className="tw-flex tw-items-center">
                                    <PresentMark />
                                    <span className="tw-ml-2">Present</span>
                                </div>

                                <div className="tw-flex tw-items-center">
                                    <AbsentMark />
                                    <span className="tw-ml-2">Absent</span>
                                </div>

                                <div className="tw-flex tw-items-center">
                                    <HolidayMark />
                                    <span className="tw-ml-2">Holiday</span>
                                </div>

                            </div>

                        </div>

                        <TableContainer
                            columns={roleColumns || []}
                            data={dummmyData || []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            showPagination={true}
                            totalPages={0}
                            totalRecords={0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={0}
                            rowDataInfo={memoizedHolidayDetailsList}
                        />

                    </div>

                </div>
            </div>
            <ModalContainerUpdated
                id="show-student-modal"
                isOpen={previewModalState.showModal}
                toggle={closePreviewModalHndlr}
                modalTitle={`Attendance Info (${getFormattedDateddMMMYYYY(previewModalState.modalData?.date)})`}
                modalSize="md"
            >

                <EmployeeInfoAttendance
                    toggleShowStudentModal={closePreviewModalHndlr} 
                    modalData ={previewModalState.modalData}
                    
                    />
            </ModalContainerUpdated>
        </>
    );
};

export default EmployeeAttendance;
