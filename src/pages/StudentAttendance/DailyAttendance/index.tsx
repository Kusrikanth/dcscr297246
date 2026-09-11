
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DateInput, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";

import { useHistory } from "react-router-dom";
import { default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";

import { exportChangeStudentListAct, sendNotifiChangeStuDetailAct } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { toast } from "react-toastify";
import { generateColumns } from "./helper";
import AddDailyAttendanceModal from "./AddDailyAttendanceModal";
import { getStuDailyAttListAct } from "../../../store/StudentAttendance/DailyAttendance/dailyattendanceaction";
import { getSectionList } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { Current_Date_YYYYMMDD } from "../../../utility/dateutility";
import Button from "../../../Components/Common/Button";

const initialValues: any = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    date:Current_Date_YYYYMMDD,
    sectionId:"",
};
const StudentConcessions = () => {
    const history = useHistory();

    const dispatch = useAppDispatch();

    const pagination: any = useRef<any>({
        pageNo: 0,
        pageSize: 10
    })

    const [dailyAttModalState, setDailyAttModalState] = useState<any>({
        showModal: false,
        applicationId: undefined
    })

    const [exportExcel, setExportExcel] = useState<any>({
        showModal: false,
        scrutinyId: undefined
    })

    const [sendNotificationModal, setNendNotificationModal] = useState<any>({
        showModal: false,
        applicationId: undefined
    })

    const toggleAddDailyAttModal = (id?: any) => {
        setDailyAttModalState((prev:any)=>({...prev,showModal:!prev.showModal}))
    };

    const StudentAttendanceList = ( otherProps?: any) => {
        const { academicYearId, curriculumId, classId,sectionId,date,searchString } = stuAttFilterState;
        let payload = {
            academicYearId,
            curriculumId,
            instituteId,
            branchId,
            classId,
            sectionId,
            date ,
            searchString ,
            ...pagination.current ,
            ...otherProps,
        };
        if(payload.academicYearId  ){
            dispatch(getStuDailyAttListAct(generateActionPayload('get_daily_att_list', undefined, payload)))
        }
    }

    const [stuAttFilterState, setStuAttFilterState] = useState<any>(initialValues);


    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getStuDailyAttListResp,
        stuDailyAttErrResp,
        updateStuDailyAttListResp,
        sectionListResp,
    }: any = useAppSelector(
        ({applicationSale, globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, dailyAttendance }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader:globalData.showApiLoader,
            sectionListResp:classroomManagmentInfo.sectionListResp,
            getStuDailyAttListResp:dailyAttendance.getStuDailyAttListResp,
            stuDailyAttErrResp:dailyAttendance.stuDailyAttErrResp,
            updateStuDailyAttListResp:dailyAttendance.updateStuDailyAttListResp,
        }),
        shallowEqual
    );

    const dailyAttendanceRef = useRef<any>({
        prevStuDailyAttErrResp: stuDailyAttErrResp,
        prevUpdateStuDailyAttListResp : updateStuDailyAttListResp,
    });

    useEffect(() => {
        const { prevStuDailyAttErrResp, prevUpdateStuDailyAttListResp } = dailyAttendanceRef.current;

        if(stuDailyAttErrResp && stuDailyAttErrResp !== prevStuDailyAttErrResp) {
            const {details} = stuDailyAttErrResp || {};
            toast.error(details || "Something went wrong");
        }
        else if(updateStuDailyAttListResp && updateStuDailyAttListResp !== prevUpdateStuDailyAttListResp) {
            toast.success("Attendance updated successfully.")
            toggleAddDailyAttModal()
            StudentAttendanceList()
        }

        dailyAttendanceRef.current.prevStuDailyAttErrResp = stuDailyAttErrResp;
        dailyAttendanceRef.current.prevUpdateStuDailyAttListResp = updateStuDailyAttListResp;
    }, [stuDailyAttErrResp,updateStuDailyAttListResp]);

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <EditSvg className="me-2 d-inline-block " color="#878A99" />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    toggleSendNotificationModal(id);
                },
            },
        ],
        []
    );

    const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: stuAttFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    const getClassApiCall = (otherProps?:any)=>{
      const payload = { branchId: branchId, academicYearId : stuAttFilterState?.academicYearId, curriculumId: stuAttFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
       dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
        setStuAttFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        // StudentAttendanceList( { academicYearId: yearId })
        getCurriculumApiCall({ academicYearId: yearId });
    }, [academicYearListResp,branchId, instituteId]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        
        if (Array.isArray(data) && data.length > 0) {
            const payload = { branchId: branchId, curriculumId: data[0].branchCurriculumId,academicYearId: stuAttFilterState.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            setStuAttFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
            // StudentAttendanceList( { curriculumId: data[0].branchCurriculumId })
        }
    }, [brchCurriculumResp])
    useEffect(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content) && content.length > 0) {

            setStuAttFilterState((prev: any) => ({ ...prev, classId: content[0].id }))
            // StudentAttendanceList({classId: content[0]?.id});
            getSectionListResp({branchClassId: content[0]?.id});
        }
    }, [branchClassResp])

    useEffect(() => {
        const { data } = sectionListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            setStuAttFilterState((prev: any) => ({ ...prev, sectionId: data[0]?.sectionId }))
            StudentAttendanceList({sectionId: data[0]?.sectionId});
        }
    }, [sectionListResp])

    const getSectionListResp = (otherProps?: any) => {

        let payload = { branchClassId: stuAttFilterState.classId || null, masterAcademicYearId: stuAttFilterState.academicYearId,curriculumId : stuAttFilterState.curriculumId, pageNo: 0, pageSize: 20,sortBy:"sectionName",orderBy:"asc",  ...otherProps }
        if (payload.branchClassId && payload.masterAcademicYearId) {
          dispatch(
            getSectionList(
              generateActionPayload("get_section_list", undefined, payload)
            )
          );
        }
      }


    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setStuAttFilterState((prev: any) => ({ ...prev, [name]: value }))
        pagination.current.pageNo=0;
        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
        }
        else if (name === 'curriculumId') {
            const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            // StudentAttendanceList({[name]:value})
            if(!value) {
                dispatch(resetBrchClassAct(undefined))
            }
            else { 
                getClassApiCall({curriculumId: value,academicYearId: stuAttFilterState.academicYearId});
            }
        }
        else if(name === 'classId'){
            getSectionListResp({branchClassId : value})
        }
        else {
            StudentAttendanceList( { [name]: value })
        }
    }

    function downloadExcelFile(blobStream: any) {

        const url = window.URL.createObjectURL(new Blob([(blobStream)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Student_Change_Details.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }


    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        StudentAttendanceList(paginationInfo)
        // getSectionListResp(paginationInfo);
    }

    const { data: academicYearList } = academicYearListResp || {};
    // const { data: SectionList,totalPages,totalElements,pageNumber } = sectionListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: studentResp,totalElements,totalPages,pageble } = getStuDailyAttListResp || {}
    const { content: classTypes } = branchClassResp || {};

    const toggleExportExcelModal = (id?: any) => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            scrutinyId: id || "",
        }));
    };
    const toggleSendNotificationModal = (id?: any) => {
        setNendNotificationModal((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            applicationId: id || "",
        }));
    };

    const exportExcelHndler = ()=>{
        dispatch(exportChangeStudentListAct(generateActionPayload("export_change_student_list",undefined, { ...stuAttFilterState,branchId,instituteId },{
            responseType: 'blob'
        })));
    }

    const sendNotificationHndler = ()=>{
        dispatch(sendNotifiChangeStuDetailAct(generateActionPayload("send_notification_change_student_list",{id : sendNotificationModal.applicationId})));
    }

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Student Attendance" />

                    <div className="tw-bg-white tw-rounded-xl tw-shadow">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-w-1/2">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                        Daily Attendance
                                    </h4>
                                </div>

                                <div className="tw-ml-auto">
                                    <div className="tw-flex">
                                        <Button
                                            variant="primary"
                                            onClick={() => toggleAddDailyAttModal()}
                                        >
                                            Mark Attendance
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tw-p-4">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-2">
                                    <div className="tw-relative search-box">
                                        <TextInput
                                            name="searchString"
                                            value={stuAttFilterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="tw-bg-slate-100"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-slate-400"></i>
                                    </div>
                                </div>

                                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={stuAttFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={stuAttFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="classId"
                                        value={stuAttFilterState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Class"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="sectionId"
                                        value={stuAttFilterState.sectionId}
                                        onChange={filterHandler}
                                        menuItems={sectionListResp?.data || []}
                                        valueKey="sectionId"
                                        textKey="sectionName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Section"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <DateInput
                                        name="date"
                                        value={stuAttFilterState?.date}
                                        onChange={filterHandler}
                                        formgroupClassName="tw-mb-0"
                                        labelText="Attendance Date"
                                        floatingLabel
                                    />
                                </div>
                            </div>
                        </div>

                        <TableContainer
                            columns={roleColumns || []}
                            data={getStuDailyAttListResp?.content || []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-slate-100 tw-text-slate-500 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageble?.pageNumber || 0}
                        />
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="avc"
                isOpen={dailyAttModalState.showModal}
                toggle={toggleAddDailyAttModal}
                modalTitle="Mark Attendance"
                modalSize="xl"
            >
                <AddDailyAttendanceModal toggle={toggleAddDailyAttModal} modalData={stuAttFilterState}/>
            </ModalContainerUpdated>

        </>
    );
};

export default StudentConcessions;
