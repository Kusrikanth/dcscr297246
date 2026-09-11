
import React, { useEffect, useMemo, useRef, useState } from "react";
import {  ModalContainerUpdated, SelectInput, TextInput } from "../../Components/Common";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { default as EditSvg } from "../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../hooks/storehook";
import { IPaginationState } from "../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { getSectionList } from "../../store/academic/classroomManagment/classroommanagmentactions";
import { generateColumns } from "./helper";
import { exportAssignLanguagesAct, getAssignLanguagesList } from "../../store/assignlanguages/assignlanguagesaction";
import AddAssignLanguageModel from "./AddAssignLanguageModal";
import CopyAssignLanguageModal from "./CopyAssignLanguageModal";
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../assets/imagesdps/common_icon/export_icon.svg";
import { useModal } from "../../hooks/modalhook";
import ExportModal from "../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../utility/commonutility";
import Button from "../../Components/Common/Button";

const initialValues: any = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId: "",
};

const AssignLanguages = () => {
    const history = useHistory();

    const dispatch = useDispatch();

    const pagination: any = useRef<any>({
        pageNo: 0,
        pageSize: 10
    })
    const { closeModal: closeExportSectionModalHnldr,
            openModal: openExportSectionModalHnldr, modalState: exportSectionModalState } = useModal();

    const [assignLanModalState, setAssignLanModalState] = useState<any>({
        showModal: false,
        applicationId: undefined
    })

    const [copyLanguageModal, setCopyLanguageModal] =
    useState<any>({
        showModal: false,
    });

    const [sendNotificationModal, setNendNotificationModal] = useState<any>({
        showModal: false,
        applicationId: undefined
    })

    const toggleAssignLangModal = (id?: any) => {
        // history.push("/student-concessions/create-concession", { id: id });
        setAssignLanModalState((prev: any) => ({ ...prev, showModal: !prev.showModal }))
    };

    const assignLanguagesList = (otherProps?: any) => {
        const { academicYearId, curriculumId, classId, sectionId } = assignLangFilterState;
        let payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            instituteId: instituteId,
            branchId,
            classId,
            sectionId,
            ...pagination.current,
            ...otherProps,
        };
        if (payload.academicYearId && payload.curriculumId && payload.classId) {
            dispatch(getAssignLanguagesList(generateActionPayload('assign_language_list', undefined, payload)))
        }
    }

    function submitExportHndlr(otherProps?: any) {

        const { academicYearId, curriculumId, classId, sectionId } = assignLangFilterState;
        let payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            instituteId: instituteId,
            branchId,
            classId,
            sectionId,
            ...otherProps,
        };
            dispatch(exportAssignLanguagesAct(generateActionPayload('export_assign_language', undefined, payload, {
                responseType: 'blob'
            })))
        }

    const [assignLangFilterState, setAssignLangFilterState] = useState<any>(initialValues);


    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        assignLanguagesErrResp,
        sectionListResp,
        getAssignLanguagesListResp,
        updateAssignLanguagesResp,
        copyAssignLanguagesResp,
        exportAssignLanguagesResp
    }: any = useAppSelector(
        ({ applicationSale, globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, dailyAttendance, assignLanguages }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            assignLanguagesErrResp: assignLanguages.assignLanguagesErrResp,
            getAssignLanguagesListResp: assignLanguages.getAssignLanguagesListResp,
            updateAssignLanguagesResp: assignLanguages.updateAssignLanguagesResp,
            copyAssignLanguagesResp: assignLanguages.copyAssignLanguagesResp,
            exportAssignLanguagesResp: assignLanguages.exportAssignLanguagesResp
        }),
        shallowEqual
    );

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

    const getClassApiCall = (otherProps?:any)=>{
        const payload = { branchId: branchId, academicYearId : assignLangFilterState?.academicYearId, curriculumId: assignLangFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
         dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: assignLangFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
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
        setAssignLangFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        // assignLanguagesList( { academicYearId: yearId })
        getCurriculumApiCall({ academicYearId: yearId });
    }, [academicYearListResp]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        if ( Array.isArray(data) && data.length > 0 && assignLangFilterState.academicYearId ) {
          const payload = { branchId, curriculumId: data[0].branchCurriculumId, academicYearId: assignLangFilterState.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, };
          dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
          setAssignLangFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }));
        }
      }, [brchCurriculumResp, assignLangFilterState.academicYearId])
    useEffect(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content) && content.length > 0) {

            setAssignLangFilterState((prev: any) => ({ ...prev, classId: content[0].id }))
            assignLanguagesList({ classId: content[0]?.id });
            getSectionListResp({ branchClassId: content[0]?.id });
        }
    }, [branchClassResp])

    useEffect(() => {
        const { data } = sectionListResp || {};
        // if (Array.isArray(data) && data.length > 0) {
        // setAssignLangFilterState((prev: any) => ({ ...prev, sectionId: data[0]?.sectionId }))
        // assignLanguagesList({sectionId: data[0]?.sectionId});
        // }
    }, [sectionListResp])

    const getSectionListResp = (otherProps?: any) => {

        let payload = { branchClassId: assignLangFilterState.classId || null, masterAcademicYearId: assignLangFilterState.academicYearId, curriculumId: assignLangFilterState.curriculumId,sortBy:"sectionName",orderBy:"asc", pageNo: 0, pageSize: 20, ...otherProps }
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
        pagination.current.pageNo = 0;
        if (name === 'academicYearId') {
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetBrchClassAct(undefined));
            assignLanguagesList({ [name]: value, classId: null, curriculumId: "",sectionId: null, pageNo: 0, pageSize: 10 });
            setAssignLangFilterState((prev: any) => ({ ...prev, [name]: value, classId: null, curriculumId: "",sectionId: null }))
        }
        else if (name === 'curriculumId') {
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
            }
            else {
                getClassApiCall({ curriculumId: value, academicYearId: assignLangFilterState.academicYearId });
                setAssignLangFilterState((prev: any) => ({ ...prev, [name]: value }))
                // assignLanguagesList({ [name]: value })
            }
        }
        else if (name === 'classId') {
            getSectionListResp({ branchClassId: value })
            assignLanguagesList({ [name]: value })
            setAssignLangFilterState((prev: any) => ({ ...prev, [name]: value }))
        }
        else {
            assignLanguagesList({ [name]: value })
            setAssignLangFilterState((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    // function downloadExcelFile(blobStream: any) {

    //     const url = window.URL.createObjectURL(new Blob([(blobStream)]));
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', 'Student_Change_Details.xlsx');
    //     document.body.appendChild(link);
    //     link.click();
    //     link.remove();
    // }

    const assignLanguagesRef = useRef<any>({
        prevAssignLanguagesErrResp: assignLanguagesErrResp,
        prevUpdateAssignLanguagesResp: updateAssignLanguagesResp,
        prevCopyAssignLanguagesResp:copyAssignLanguagesResp,
        prevExportAssignLanguagesResp: exportAssignLanguagesResp
    });

    useEffect(() => {
        const { prevAssignLanguagesErrResp, prevUpdateAssignLanguagesResp, prevCopyAssignLanguagesResp, prevExportAssignLanguagesResp } = assignLanguagesRef.current;

        if (assignLanguagesErrResp && assignLanguagesErrResp !== prevAssignLanguagesErrResp) {
            const { details } = assignLanguagesErrResp || {};
            toast.error(details || "Something went wrong");
        }
        else if (updateAssignLanguagesResp && updateAssignLanguagesResp !== prevUpdateAssignLanguagesResp) {
            toast.success("Assign Languages updated successfully");
            toggleAssignLangModal();
            assignLanguagesList()
        }
        else if(copyAssignLanguagesResp && copyAssignLanguagesResp !== prevCopyAssignLanguagesResp){
            toast.success("Assign Languages copied successfully");
            toggleCopyLanguageModal();
            assignLanguagesList()
        }
        else if(exportAssignLanguagesResp && exportAssignLanguagesResp !== prevExportAssignLanguagesResp){
            downloadExcelFile(exportAssignLanguagesResp, "Assign_Languages");
            closeExportSectionModalHnldr();
            assignLanguagesList()
        }

        assignLanguagesRef.current.prevAssignLanguagesErrResp = assignLanguagesErrResp;
        assignLanguagesRef.current.prevUpdateAssignLanguagesResp = updateAssignLanguagesResp;
        assignLanguagesRef.current.prevCopyAssignLanguagesResp = copyAssignLanguagesResp;
        assignLanguagesRef.current.prevExportAssignLanguagesResp = exportAssignLanguagesResp;
    }, [assignLanguagesErrResp, updateAssignLanguagesResp, copyAssignLanguagesResp, exportAssignLanguagesResp]);

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        assignLanguagesList(paginationInfo)
        // getSectionListResp(paginationInfo);
    }

    const { data: academicYearList } = academicYearListResp || {};
    // const { data: SectionList,totalPages,totalElements,pageNumber } = sectionListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { totalElements, totalPages, pageble } = getAssignLanguagesListResp || {}
    const { content: classTypes } = branchClassResp || {};

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

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Academics" />
                    <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">
                        <div className="tw-border-b tw-px-4 tw-py-3 tw-flex tw-justify-between tw-items-center">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Assign Languages
                            </h4>
                            <div className="tw-flex tw-items-center tw-gap-2">
                                <Button
                                    type="button"
                                    variant="info"
                                    onClick={toggleCopyLanguageModal}
                                >
                                    Copy
                                </Button>
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={toggleAssignLangModal}
                                >
                                    <i className="ri-add-line tw-mr-2"></i>
                                    Add New
                                </Button>
                                <Button
                                    type="button"
                                    variant="exportBtn"
                                    onClick={openExportSectionModalHnldr}
                                    className="!tw-p-2"
                                >
                                    <img src={ExportIcon} className="tw-h-5 tw-w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="tw-px-4 tw-py-4">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                <div className="tw-col-span-12 md:tw-col-span-2 tw-relative search-box">
                                    <TextInput
                                        name="searchString"
                                        value={assignLangFilterState.searchString}
                                        onChange={filterHandler}
                                        inputClassName="bg-soft-light"
                                        formgroupClassName="mb-0"
                                        placeHolder="Search"
                                        labelText="Search"
                                        floatingLabel
                                    />
                                    <i className="ri-search-line search-icon"></i>
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={assignLangFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={assignLangFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-2">
                                    <SelectInput
                                        name="classId"
                                        value={assignLangFilterState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Class"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-2">
                                    <SelectInput
                                        name="sectionId"
                                        value={assignLangFilterState.sectionId}
                                        onChange={filterHandler}
                                        menuItems={sectionListResp?.data || []}
                                        valueKey="sectionId"
                                        textKey="sectionName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Section"
                                        floatingLabel
                                    />
                                </div>
                            </div>
                        </div>
                        <TableContainer
                            columns={roleColumns || []}
                            data={getAssignLanguagesListResp?.data || []}
                            divClass="tw-overflow-x-auto tw-mb-4"
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
            <ModalContainerUpdated
                id="Add-Assign-Language-Model"
                isOpen={assignLanModalState.showModal}
                toggle={toggleAssignLangModal}
                modalTitle="Add Assign Language"
                modalSize="xl"
            >
                <AddAssignLanguageModel toggle={toggleAssignLangModal} modalData={assignLangFilterState} />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="copy-Language-Model"
                isOpen={copyLanguageModal.showModal}
                toggle={toggleCopyLanguageModal}
                modalTitle="Assign Languages"
                modalSize="md"
            >
                <CopyAssignLanguageModal toggle={toggleCopyLanguageModal} modalData={assignLangFilterState} />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="export-section-modal"
                isOpen={exportSectionModalState.showModal}
                toggle={closeExportSectionModalHnldr}
                modalTitle="Export Assign Language"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportSectionModalState.showModal}
                    toggle={closeExportSectionModalHnldr}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={submitExportHndlr}
                    feature="academics"
                    subFeature="assign_language"
                    remarksText="Enter remarks to export the assign language details?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default AssignLanguages;
