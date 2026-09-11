
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DateInput, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";

import { useHistory } from "react-router-dom";
import { default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";

import { exportChangeStudentListAct, sendNotifiChangeStuDetailAct } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { toast } from "react-toastify";
import { generateColumns, subjectAllocationData } from "./helper";
import { getSectionList } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import CopyAssignLanguageModal from "./CopyAssignLanguageModal";
import ClassSubjectModal from "./ClassSubjectModal";

const initialValues: any = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId: "",
};
const StudentSubjectAllocation = () => {
    const history = useHistory();

    const dispatch = useDispatch();

    const pagination: any = useRef<any>({
        pageNo: 0,
        pageSize: 10
    })

    const [subjectAllocateModalState, setSubjectAllocateModalState] = useState<any>({
        showModal: false,
        modalData: undefined
    })

    const [exportExcel, setExportExcel] = useState<any>({
        showModal: false,
        scrutinyId: undefined
    })

    const [copyLanguageModal, setCopyLanguageModal] =
        useState<any>({
            showModal: false,
        });

    const [sendNotificationModal, setNendNotificationModal] = useState<any>({
        showModal: false,
        applicationId: undefined
    })

    const toggleEditSubjectModal = (id?: any) => {
        setSubjectAllocateModalState((prev: any) => ({ ...prev, showModal: !prev.showModal }))
    };

    const StudentAttendanceList = (otherProps?: any) => {
        let payload = {
            ...stuSubjectAllocateFilterState,
            instituteId,
            branchId,
            ...pagination.current,
            ...otherProps,
        };
        // if(payload.academicYearId  ){
        // dispatch(getStuDailyAttListAct(generateActionPayload('get_daily_att_list', undefined, payload)))
        // }
    }

    const [stuSubjectAllocateFilterState, setStuSubjectAllocateFilterState] = useState<any>(initialValues);

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
        ({ applicationSale, globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, dailyAttendance }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            getStuDailyAttListResp: dailyAttendance.getStuDailyAttListResp,
            stuDailyAttErrResp: dailyAttendance.stuDailyAttErrResp,
            updateStuDailyAttListResp: dailyAttendance.updateStuDailyAttListResp,
        }),
        shallowEqual
    );

    const dailyAttendanceRef = useRef<any>({
        prevStuDailyAttErrResp: stuDailyAttErrResp,
        prevUpdateStuDailyAttListResp: updateStuDailyAttListResp,
    });

    useEffect(() => {
        const { prevStuDailyAttErrResp, prevUpdateStuDailyAttListResp } = dailyAttendanceRef.current;

        if (stuDailyAttErrResp && stuDailyAttErrResp !== prevStuDailyAttErrResp) {
            const { details } = stuDailyAttErrResp || {};
            toast.error(details || "Something went wrong");
        }
        else if (updateStuDailyAttListResp && updateStuDailyAttListResp !== prevUpdateStuDailyAttListResp) {
            toast.success("Attendance updated successfully.")
            toggleEditSubjectModal()
            StudentAttendanceList()
        }

        dailyAttendanceRef.current.prevStuDailyAttErrResp = stuDailyAttErrResp;
        dailyAttendanceRef.current.prevUpdateStuDailyAttListResp = updateStuDailyAttListResp;
    }, [stuDailyAttErrResp, updateStuDailyAttListResp]);

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <EditSvg className="me-2 d-inline-block " color="#878A99" />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    toggleEditSubjectModal(id);
                },
            },
        ],
        []
    );

    const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(
            getInstAcademicYearAct(
                generateActionPayload("get_inst_academic_year", undefined, payload)
            )
        );
        const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
        setStuSubjectAllocateFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        // StudentAttendanceList( { academicYearId: yearId })
    }, [academicYearListResp]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};

        if (Array.isArray(data) && data.length > 0) {
            const payload = { branchId: branchId, curriculumId: data[0].branchCurriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            setStuSubjectAllocateFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
            // StudentAttendanceList( { curriculumId: data[0].branchCurriculumId })
        }
    }, [brchCurriculumResp])
    useEffect(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content) && content.length > 0) {

            setStuSubjectAllocateFilterState((prev: any) => ({ ...prev, classId: content[0].id }))
            // StudentAttendanceList({classId: content[0]?.id});
            getSectionListResp({ branchClassId: content[0]?.id });
        }
    }, [branchClassResp])

    useEffect(() => {
        const { data } = sectionListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            setStuSubjectAllocateFilterState((prev: any) => ({ ...prev, sectionId: data[0]?.sectionId }))
            StudentAttendanceList({ sectionId: data[0]?.sectionId });
        }
    }, [sectionListResp])

    const getSectionListResp = (otherProps?: any) => {

        let payload = { branchClassId: stuSubjectAllocateFilterState.classId || null, masterAcademicYearId: stuSubjectAllocateFilterState.academicYearId, curriculumId: stuSubjectAllocateFilterState.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
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
        setStuSubjectAllocateFilterState((prev: any) => ({ ...prev, [name]: value }))
        pagination.current.pageNo = 0;
        if (name === 'curriculumId') {
            const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            // StudentAttendanceList({[name]:value})
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
            }
            else {
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
        else if (name === 'classId') {
            getSectionListResp({ branchClassId: value })
        }
        else {
            StudentAttendanceList({ [name]: value })
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
    const { content: studentResp, totalElements, totalPages, pageble } = getStuDailyAttListResp || {}
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

    const toggleCopyLanguageModal = () => {
        setCopyLanguageModal((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
        }));
    };

    const exportExcelHndler = () => {
        dispatch(exportChangeStudentListAct(generateActionPayload("export_change_student_list", undefined, { ...stuSubjectAllocateFilterState, branchId, instituteId }, {
            responseType: 'blob'
        })));
    }

    const sendNotificationHndler = () => {
        dispatch(sendNotifiChangeStuDetailAct(generateActionPayload("send_notification_change_student_list", { id: sendNotificationModal.applicationId })));
    }

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Examination" />

                    <div className="card">
                        <div className="card-header">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <h4 className="card-title mb-0 flex-grow-1">
                                        Student Subject Allocation
                                    </h4>
                                </div>
                                <div className="col-auto ms-auto">
                                    <div className="d-flex">
                                        <button className="btn btn-3 me-2" style={{ background: "#405189", border: "none" }} onClick={toggleCopyLanguageModal} >
                                            <div className="d-flex align-items-center text-white px-3">
                                                Copy
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            {/* <form onSubmit={StudentConcessionFilterForm.handleSubmit}> */}
                            <div className="row g-3">
                                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-2">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={stuSubjectAllocateFilterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="bg-soft-light"
                                            formgroupClassName="mb-0"
                                            placeHolder="Search..."
                                        />

                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={stuSubjectAllocateFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        // inputClassName="border-0"
                                        formgroupClassName="mb-0"
                                        defaultSelect="Academic Year"
                                    />
                                </div>

                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={stuSubjectAllocateFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        // inputClassName="bg-light border-0"
                                        formgroupClassName="mb-0"
                                        defaultSelect="Curriculum"
                                    />
                                </div>

                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="classId"
                                        value={stuSubjectAllocateFilterState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        defaultSelect="Class"
                                        // inputClassName="bg-light border-0"
                                        formgroupClassName="mb-0"
                                    />
                                </div>

                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="sectionId"
                                        value={stuSubjectAllocateFilterState.sectionId}
                                        onChange={filterHandler}
                                        menuItems={sectionListResp?.data || []}
                                        valueKey="sectionId"
                                        textKey="sectionName"
                                        defaultSelect="Section"
                                        // inputClassName="bg-light border-0"
                                        formgroupClassName="mb-0"
                                    />
                                </div>

                                {/* <div className="col-auto ms-auto">
                <button className="btn btn-3 text-white" style={{ background: "#405189", border: "none" }} onClick={toggleExportExcelModal} >
                        <i className="ri-add-line me-2" />
                        Export
                    </button>
                  </div> */}
                            </div>
                            {/* </form> */}
                        </div>

                        <TableContainer
                            columns={roleColumns || []}
                            data={subjectAllocationData|| []}
                            divClass="table-responsive mb-3"
                            theadClass="table-light text-muted align-middle"
                            // showCheckbox={true}
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
                id="edit-student-subject-allocation-modal"
                isOpen={subjectAllocateModalState.showModal}
                toggle={toggleEditSubjectModal}
                modalTitle="Subject Allocation to"
                modalSize="md"
            >
                <ClassSubjectModal isOpen={copyLanguageModal.showModal} toggle={toggleEditSubjectModal} academicDetails={subjectAllocateModalState.modalData}/>
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="student-subject-allocation-Model"
                isOpen={copyLanguageModal.showModal}
                toggle={toggleCopyLanguageModal}
                modalTitle="Student Subject Allocation"
                modalSize="lg"
            >
                <CopyAssignLanguageModal  toggle={toggleCopyLanguageModal} modalData={stuSubjectAllocateFilterState} />
            </ModalContainerUpdated>

        </>
    );
};

export default StudentSubjectAllocation;
