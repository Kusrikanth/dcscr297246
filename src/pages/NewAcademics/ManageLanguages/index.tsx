
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { exportChangeStudentListAct, getSecoundLanguagesList, resetSecoundLanguageListAct } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { toast } from "react-toastify";
import { generateColumns, languagesType } from "./helper";
import { getSectionList } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../hooks/modalhook";
import AddManageLanguages from "./AddManageLanguages";
import { deleteBranchClassLanguagesAct } from "../../../store/academic/classSubjects/classsubjectsactions";
import Button from "../../../Components/Common/Button";

const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    type: "",
    // sectionId:"",
};
const ManageLanguages = () => {
    const history = useHistory();

    const dispatch = useAppDispatch();
    const [filterState, setFilterState] = useState(initialValues);
    const { closeModal: closeManageLangaugesModal, modalState: manageLangaugesModalState, openModal: openManageLangaugesModal } = useModal()
    const { closeModal: closeDeleteModal, modalState: deleteModalState, openModal: openDeleteModal } = useModal()

    const pagination = useRef({
        pageNo: 0,
        pageSize: 100
    })

    const fetchLanguageApiCall = (otherProps?: any) => {
        const params = { instituteId: instituteId, branchId: branchId, ...filterState, ...otherProps }
        if (params.classId && params.academicYearId && params.curriculumId) {
            dispatch(getSecoundLanguagesList(generateActionPayload('get_secound_language_list', undefined, params)));
        }
    }

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        sectionListResp,
        secoundLanguageResp,
        saveBranchClassLanguagesResp,
        deleteBranchClassLanguagesResp,
        classSubjectErrorResp,
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, dailyAttendance, applicationSale, classSubjectsInfo }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            secoundLanguageResp: applicationSale.secoundLanguageResp,
            saveBranchClassLanguagesResp: classSubjectsInfo.saveBranchClassLanguagesResp,
            deleteBranchClassLanguagesResp: classSubjectsInfo.deleteBranchClassLanguagesResp,
            classSubjectErrorResp: classSubjectsInfo.classSubjectErrorResp,
        }),
        shallowEqual
    );

    const manageLanguagesRef = useRef({
        prevClassSubjectErrorResp: classSubjectErrorResp,
        prevSaveBranchClassLanguagesResp: saveBranchClassLanguagesResp,
        prevDeleteBranchClassLanguagesResp: deleteBranchClassLanguagesResp,
    });

    useEffect(() => {
        const { prevClassSubjectErrorResp, prevDeleteBranchClassLanguagesResp, prevSaveBranchClassLanguagesResp } = manageLanguagesRef.current;

        if (classSubjectErrorResp && classSubjectErrorResp !== prevClassSubjectErrorResp) {
            const { details } = classSubjectErrorResp || {};
            toast.error(details || "Something went wrong");
        }
        else if (saveBranchClassLanguagesResp && saveBranchClassLanguagesResp !== prevSaveBranchClassLanguagesResp) {
            toast.success("Language added successfully.")
            closeManageLangaugesModal()
            fetchLanguageApiCall()
        } else if (deleteBranchClassLanguagesResp && deleteBranchClassLanguagesResp !== prevDeleteBranchClassLanguagesResp) {
            toast.success("Language deleted successfully.")
            closeDeleteModal()
            fetchLanguageApiCall()
        }

        manageLanguagesRef.current.prevClassSubjectErrorResp = classSubjectErrorResp;
        manageLanguagesRef.current.prevDeleteBranchClassLanguagesResp = deleteBranchClassLanguagesResp;
        manageLanguagesRef.current.prevSaveBranchClassLanguagesResp = saveBranchClassLanguagesResp;
    }, [classSubjectErrorResp, deleteBranchClassLanguagesResp, saveBranchClassLanguagesResp]);

    const menuOptions = useMemo(
        () => [
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openDeleteModal(id)
                },
            },
        ],
        []
    );

    const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    const getClassApiCall = (otherProps?: any) => {
        const payload = { branchId: branchId, academicYearId: filterState?.academicYearId, curriculumId: filterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
            dispatch(resetSecoundLanguageListAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
        setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        // StudentAttendanceList( { academicYearId: yearId })
        getCurriculumApiCall({ academicYearId: yearId });
    }, [academicYearListResp, branchId, instituteId]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};

        if (Array.isArray(data) && data.length > 0) {
            const payload = { branchId: branchId, curriculumId: data[0].branchCurriculumId, academicYearId: filterState.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            setFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
            // StudentAttendanceList( { curriculumId: data[0].branchCurriculumId })
        }
    }, [brchCurriculumResp])

    useEffect(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content) && content.length > 0) {

            setFilterState((prev: any) => ({ ...prev, classId: content[0].id }))
            fetchLanguageApiCall({ classId: content[0].id })
            // StudentAttendanceList({classId: content[0]?.id});
            // getSectionListResp({branchClassId: content[0]?.id});
        }
    }, [branchClassResp])

    // useEffect(() => {
    //     const { data } = sectionListResp || {};
    //     if (Array.isArray(data) && data.length > 0) {
    //         setFilterState((prev: any) => ({ ...prev, sectionId: data[0]?.sectionId }))
    //         StudentAttendanceList({sectionId: data[0]?.sectionId});
    //     }
    // }, [sectionListResp])

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setFilterState((prev: any) => ({ ...prev, [name]: value }))
        pagination.current.pageNo = 0;
        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
        }
        else if (name === 'curriculumId') {
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
            }
            else {
                getClassApiCall({ curriculumId: value, academicYearId: filterState.academicYearId });
            }
        }
        else {
            fetchLanguageApiCall({ [name]: value })
        }
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};

    const exportExcelHndler = () => {
        dispatch(exportChangeStudentListAct(generateActionPayload("export_change_student_list", undefined, { ...filterState, branchId, instituteId }, {
            responseType: 'blob'
        })));
    }

    const deleteManageLanguagesModal = () => {
        dispatch(deleteBranchClassLanguagesAct(generateActionPayload("delete_branch_class_languages", { id: deleteModalState.modalData })));
    }

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Subject Management" />
                    <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">
                        <div className="tw-border-b tw-px-4 tw-py-4 tw-flex tw-justify-between tw-items-center">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Manage Languages
                            </h4>
                            <Button
                                type="button"
                                variant="primary"
                                className="tw-flex tw-items-center"
                                onClick={openManageLangaugesModal}
                            >
                                <i className="ri-add-line tw-mr-2"></i>
                                Add Languages
                            </Button>
                        </div>
                        <div className="tw-px-4 tw-py-4 tw-border-b">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={filterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="bg-soft-light"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={filterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={filterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="classId"
                                        value={filterState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Class"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="type"
                                        value={filterState.type}
                                        onChange={filterHandler}
                                        menuItems={languagesType}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Languages Type"
                                        floatingLabel
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="tw-p-0">
                            <TableContainer
                                columns={roleColumns || []}
                                data={Array.isArray(secoundLanguageResp?.data)
                                    ? secoundLanguageResp?.data
                                    : []}
                                divClass="tw-overflow-x-auto tw-mb-3"
                                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                                showPagination={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="add-manage-languages-modal"
                isOpen={manageLangaugesModalState.showModal}
                toggle={closeManageLangaugesModal}
                modalTitle="Manage Languages"
                modalSize="lg"
            >
                <AddManageLanguages toggle={closeManageLangaugesModal} modalData={filterState} />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-manage-langauges-modal"
                isOpen={deleteModalState.showModal}
                confirmMessage="Are you sure you want to Delete Language?"
                cancelHndlr={closeDeleteModal}
                confirmHndlr={deleteManageLanguagesModal}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="approve"
                btnClassName="btn w-sm btn-success"
            />
        </>
    );
};

export default ManageLanguages;
