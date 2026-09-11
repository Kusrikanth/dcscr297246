
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import {
    generateColumns
} from "./helper";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import ChangeStudentDetailsModal from "./ChangeStudentDetailsModal";
import { exportChangeStudentListAct, getAllChangeStudentsListAct, sendNotifiChangeStuDetailAct } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../utility/commonutility";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification03StrokeStandard } from '@hugeicons-pro/core-stroke-standard';
import Button from "../../../Components/Common/Button";

const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    type: "",
};

const StudentConcessions = () => {

    const dispatch = useAppDispatch();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const [changesStudentModalState, setChangesStudentModalState] = useState({
        showModal: false,
        applicationId: undefined
    })

    const [exportExcel, setExportExcel] = useState({
        showModal: false,
        scrutinyId: undefined
    })

    const [sendNotificationModal, setNendNotificationModal] = useState({
        showModal: false,
        applicationId: undefined
    })

    const toggleChangeStudentDetailsModal = (id?: any) => {
        // history.push("/student-concessions/create-concession", { id: id });
        setChangesStudentModalState((prev: any) => ({ ...prev, showModal: !prev.showModal }))
    };

    const StudentConcessionList = (paramsProps?: any, otherProps?: any) => {
        const { academicYearId, curriculumId, type } = studentConcessionFilterState;
        const params = { ...paramsProps, ...pagination.current }
        let payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            instituteId: instituteId,
            branchId,
            classId: "",
            searchString: "",
            ...otherProps,
            ...params
        };
        if (payload.academicYearId) {
            dispatch(getAllChangeStudentsListAct(generateActionPayload('get_all_change_student_list', params, payload)))
        }
    }

    const [studentConcessionFilterState, setStudentConcessionFilterState] =
        useState(initialValues);

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
    } = useAppSelector(
        ({ applicationSale, globalData, instAcademics, branchAcademics, appData, feeConcession, feeCollections }) => ({
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
        }),
        shallowEqual
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "sendNotification",
                actionIcon: <HugeiconsIcon icon={Notification03StrokeStandard} className="me-2 text-muted" size={18} />,
                actionName: "Send Notification",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    toggleSendNotificationModal(id);
                },
            },
        ],
        []
    );

    const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
        setStudentConcessionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        StudentConcessionList(undefined, { academicYearId: yearId })
        getCurriculumApiCall({ academicYearId: yearId })
    }, [academicYearListResp]);

    const getClassApiCall = (otherProps?: any) => {
        const payload = { branchId: branchId, academicYearId: studentConcessionFilterState?.academicYearId, curriculumId: studentConcessionFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: studentConcessionFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetBrchClassAct(undefined));
            setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value, classId: null, curriculumId: null }));
            StudentConcessionList({ [name]: value, classId: null, curriculumId: null });
        }
        else if (name === "curriculumId") {
            if (value) {
                getClassApiCall({ curriculumId: value, academicYearId: studentConcessionFilterState.academicYearId });
            }
            else {
                dispatch(resetBrchClassAct(undefined));
            }
            StudentConcessionList({ [name]: value, classId: null });
            setStudentConcessionFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
        } else {
            setStudentConcessionFilterState((prevState: any) => ({ ...prevState, [name]: value }));
            StudentConcessionList({ [name]: value, });
        }
    }

    const changeStudentDetailRef = useRef({
        prevExportChangeStudentListResp: exportChangeStudentListResp,
        prevSendNotifiChangeStuDetailResp: sendNotifiChangeStuDetailResp,
    });

    useEffect(() => {
        const { prevExportChangeStudentListResp, prevSendNotifiChangeStuDetailResp } = changeStudentDetailRef.current;

        if (exportChangeStudentListResp && exportChangeStudentListResp !== prevExportChangeStudentListResp) {
            toast.success("Change Student List Download Successfully.");
            downloadExcelFile(exportChangeStudentListResp, 'Student_Change_Details')
            toggleExportExcelModal();
        }
        if (sendNotifiChangeStuDetailResp && sendNotifiChangeStuDetailResp !== prevSendNotifiChangeStuDetailResp) {
            toast.success("Notification Sent Successfully.");
            toggleSendNotificationModal();
        }
        changeStudentDetailRef.current.prevExportChangeStudentListResp = exportChangeStudentListResp;
        changeStudentDetailRef.current.prevSendNotifiChangeStuDetailResp = sendNotifiChangeStuDetailResp;
    }, [exportChangeStudentListResp, sendNotifiChangeStuDetailResp]);

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        StudentConcessionList(paginationInfo)
        // getSectionListResp(paginationInfo);
    }

    const { data: academicYearList } = academicYearListResp || {};
    // const { data: SectionList,totalPages,totalElements,pageNumber } = sectionListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: studentResp, totalElements, totalPages, pageble } = getAllChangeStudentsListActResp || {}
    const { content: classTypes } = branchClassResp || {};

    const ChangeStudentDetail = useRef({
        prevAddChangeStudentDetail: saveChangeStudentDetailsResp,
        prevApplicationSaleError: applicationSaleError,
    })
    useEffect(() => {
        const { prevAddChangeStudentDetail, prevApplicationSaleError } = ChangeStudentDetail.current;
        if (saveChangeStudentDetailsResp && prevAddChangeStudentDetail !== saveChangeStudentDetailsResp) {
            toast.success('Student Change Successfully')
            toggleChangeStudentDetailsModal(true);
            StudentConcessionList()
        }
        if (applicationSaleError && prevApplicationSaleError !== applicationSaleError) {
            const { details } = applicationSaleError;
            toast.error(details)

        }
        ChangeStudentDetail.current.prevAddChangeStudentDetail = saveChangeStudentDetailsResp;
        ChangeStudentDetail.current.prevApplicationSaleError = applicationSaleError;

    }, [saveChangeStudentDetailsResp, applicationSaleError])



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

    const exportExcelHndler = () => {
        dispatch(exportChangeStudentListAct(generateActionPayload("export_change_student_list", undefined, { ...studentConcessionFilterState, branchId, instituteId }, {
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
                    <BreadCrumb title="Student Concessions" pageTitle="Admissions" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow">
                        {/* Card Header */}
                        <div className="tw-border-b tw-px-6 tw-py-3">
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 !tw-mb-0">
                                    Change Students Details
                                </h4>

                                <Button
                                    onClick={() => toggleChangeStudentDetailsModal()}
                                    variant="primary"
                                >
                                    <i className="ri-add-line" />
                                    Change Details
                                </Button>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="tw-p-6">
                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4">

                                {/* Search */}
                                <div className="md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                                    <div className="tw-relative search-box">
                                        <TextInput
                                            name="searchString"
                                            value={studentConcessionFilterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="tw-bg-gray-100"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search..."
                                            labelText="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                                    </div>
                                </div>

                                {/* Academic Year */}
                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={studentConcessionFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>

                                {/* Curriculum */}
                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={studentConcessionFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>

                                {/* Class */}
                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="classId"
                                        value={studentConcessionFilterState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Class"
                                        floatingLabel
                                    />
                                </div>

                                {/* Export Button */}
                                <div className="tw-flex tw-items-end md:tw-col-span-3 tw-justify-end">
                                    <Button
                                        onClick={toggleExportExcelModal}
                                        variant="info"
                                    >
                                        <i className="ri-add-line" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <TableContainer
                            columns={roleColumns || []}
                            data={studentResp || []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageble?.pageNumber || 0}
                        />
                    </div>
                </div>
            </div>
            {/* <ConfirmationModal
            id="change-student-details-export"
            isOpen={exportExcel.showModal}
            confirmMessage="Are you sure you want Download excel file ?"
            cancelHndlr={toggleExportExcelModal}
            confirmHndlr={exportExcelHndler}
            isDisble={showApiLoader}
            showImgIcon={true}
            iconType='approve'
            btnClassName='btn w-sm btn-success'
        /> */}
            <ModalContainerUpdated
                id="change-student-details-export"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle='Export Change Student Details Data'
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="admission"
                    subFeature="change_student_details"
                    remarksText="Enter remarks to export change student details data?"
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="avc"
                isOpen={changesStudentModalState.showModal}
                toggle={toggleChangeStudentDetailsModal}
                modalTitle="Change Students Details"
                modalSize="lg"
            >
                <ChangeStudentDetailsModal toggle={toggleChangeStudentDetailsModal} academicYearId={studentConcessionFilterState?.academicYearId} />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="send-notification-to-parent"
                isOpen={sendNotificationModal.showModal}
                confirmMessage="Are you sure you want send notification"
                cancelHndlr={toggleSendNotificationModal}
                confirmHndlr={sendNotificationHndler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType='approve'
                btnClassName='btn w-sm btn-success'
            />

        </>
    );
};

export default StudentConcessions;
