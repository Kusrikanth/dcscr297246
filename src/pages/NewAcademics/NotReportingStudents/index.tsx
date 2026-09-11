
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { generateColumns } from "./helper";
import { deleteNotReportingStuAct, exportNotReportingListAct, getByIdNotReportingStuAct, getNotReportingStuListAct } from "../../../store/academic/notreportingstudents/notreportingstudentsactions";
import AddNotReportingStuModal from "./AddNotReportingStuModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { useModal } from "../../../hooks/modalhook";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../utility/commonutility";
import Button from "../../../Components/Common/Button";
import DeleteConfirmationModal from "./DeleteConfirmationModal";


const initialValues: any = {
    studentName: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId: "",
    sortBy: "studentName",
    orderBy: "asc",
};

const NotReportingStudents = () => {
    const history = useHistory();

    const dispatch = useDispatch();
    const { closeModal: closeExportNotReportingModalHnldr,
        openModal: openExportNotReportingModalHnldr, modalState: exportNotReportingModalState } = useModal();

    const pagination: any = useRef<any>({
        pageNo: 0,
        pageSize: 10
    })

    const [addNotReportStuModalState, setAddNotReportStuModalState] = useState<any>({
        showModal: false,
        id: undefined
    })

    const [delNotReportStuModalState, setDelNotReportStuModalState] = useState({
        showModal: false,
        id: undefined,
    });

    const [notReportingStuFilter, setNotReportingStuFilter] = useState<any>(initialValues);

    const toggleAddNotReportStuModal = (id?: any) => {
        setAddNotReportStuModalState((prev: any) => ({ ...prev, showModal: !prev.showModal, id: id || "" }))
    };

    const notReportingStuList = (otherProps?: any) => {
        const { academicYearId, curriculumId, classId } = notReportingStuFilter;
        let payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            instituteId: instituteId,
            branchId,
            classId,
            ...pagination.current,
            ...otherProps,
        };
        if (payload.academicYearId) {
            dispatch(getNotReportingStuListAct(generateActionPayload('get_not_reporting_stu_list', undefined, payload)))
        }
    }

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        assignLanguagesErrResp,
        sectionListResp,
        getNotReportingStuListResp,
        addNotReportingStuResp,
        notReportingStuErrResp,
        editNotReportingStuResp,
        deleteNotReportingStuResp,
        exportNotReportingListResp
    }: any = useAppSelector(
        ({ applicationSale, globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, notReportingStu, assignLanguages }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            assignLanguagesErrResp: assignLanguages.assignLanguagesErrResp,
            getNotReportingStuListResp: notReportingStu.getNotReportingStuListResp,
            addNotReportingStuResp: notReportingStu.addNotReportingStuResp,
            notReportingStuErrResp: notReportingStu.notReportingStuErrResp,
            editNotReportingStuResp: notReportingStu.editNotReportingStuResp,
            deleteNotReportingStuResp: notReportingStu.deleteNotReportingStuResp,
            exportNotReportingListResp: notReportingStu.exportNotReportingListResp,
        }),
        shallowEqual
    );

    const assignLanguagesRef = useRef<any>({
        prevAssignLanguagesErrResp: assignLanguagesErrResp,
        prevNotReportingStuErrResp: notReportingStuErrResp,
        prevAddNotReportingStuResp: addNotReportingStuResp,
        prevEditNotReportingStuResp: editNotReportingStuResp,
        prevDeleteNotReportingStuResp: deleteNotReportingStuResp,
        prevExportNotReportingListResp: exportNotReportingListResp,
    });

    useEffect(() => {
        const { prevAssignLanguagesErrResp, prevAddNotReportingStuResp, prevNotReportingStuErrResp, prevEditNotReportingStuResp, prevDeleteNotReportingStuResp, prevExportNotReportingListResp } = assignLanguagesRef.current;

        if (assignLanguagesErrResp && assignLanguagesErrResp !== prevAssignLanguagesErrResp) {
            const { details } = assignLanguagesErrResp || {};
            toast.error(details || "Something went wrong");
        }
        else if (notReportingStuErrResp && notReportingStuErrResp !== prevNotReportingStuErrResp) {
            const { details } = notReportingStuErrResp || {};
            toast.error(details || "Something went wrong");
        }
        else if (addNotReportingStuResp && addNotReportingStuResp !== prevAddNotReportingStuResp) {
            toast.success("Student Detail Added successfully");
            toggleAddNotReportStuModal();
            notReportingStuList()
        }
        else if (editNotReportingStuResp && editNotReportingStuResp !== prevEditNotReportingStuResp) {
            toast.success("Student Detail Updated successfully");
            toggleAddNotReportStuModal();
            notReportingStuList()
        }
        else if (deleteNotReportingStuResp && deleteNotReportingStuResp !== prevDeleteNotReportingStuResp) {
            toast.success("Student Detail Deleted successfully");
            toggleDelNotReportStuModal()
            notReportingStuList()
        }
        else if (exportNotReportingListResp && exportNotReportingListResp !== prevExportNotReportingListResp) {
            toast.success(" Exported successfully");
            closeExportNotReportingModalHnldr()
            downloadExcelFile(exportNotReportingListResp, "export_notification_history");
        }

        assignLanguagesRef.current.prevAssignLanguagesErrResp = assignLanguagesErrResp;
        assignLanguagesRef.current.prevNotReportingStuErrResp = notReportingStuErrResp;
        assignLanguagesRef.current.prevAddNotReportingStuResp = addNotReportingStuResp;
        assignLanguagesRef.current.prevEditNotReportingStuResp = editNotReportingStuResp;
        assignLanguagesRef.current.prevDeleteNotReportingStuResp = deleteNotReportingStuResp;
        assignLanguagesRef.current.prevExportNotReportingListResp = exportNotReportingListResp;
    }, [assignLanguagesErrResp, addNotReportingStuResp, notReportingStuErrResp, editNotReportingStuResp, deleteNotReportingStuResp, exportNotReportingListResp]);

    const menuOptions = useMemo(
        () => [
            // {
            //     id: "edit",
            //     actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
            //     actionName: "Edit",
            //     onClickHndlr: (event: any) => {
            //         const id = event.currentTarget.getAttribute("data-id");
            //         toggleAddNotReportStuModal(id);
            //         if (id) {
            //             dispatch(getByIdNotReportingStuAct(generateActionPayload("get_by_id_not_report_stu", { id })));
            //         }
            //     },
            // },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    toggleDelNotReportStuModal(id)
                }
            }
        ],
        []
    );

    const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    const getClassApiCall = (otherProps?: any) => {
        const payload = { branchId: branchId, academicYearId: notReportingStuFilter?.academicYearId, curriculumId: notReportingStuFilter?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: notReportingStuFilter.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
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
        setNotReportingStuFilter((prev: any) => ({ ...prev, academicYearId: yearId }))
        notReportingStuList({ academicYearId: yearId })
        getCurriculumApiCall({ academicYearId: yearId })
    }, [academicYearListResp]);


    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetBrchClassAct(undefined));
            setNotReportingStuFilter((prev: any) => ({ ...prev, [name]: value, classId: null, curriculumId: "" }));
            notReportingStuList({ academicYearId: value, classId: null, curriculumId: "" });

        }
        else if (name === 'curriculumId') {
            setNotReportingStuFilter((prev: any) => ({ ...prev, [name]: value }));
            notReportingStuList({ [name]: value })
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
            }
            else {
                getClassApiCall({ curriculumId: value, academicYearId: notReportingStuFilter.academicYearId });
            }
        }
        else {
            setNotReportingStuFilter((prev: any) => ({ ...prev, [name]: value }));
            notReportingStuList({ [name]: value })
        }
    }

    function removeModalSubmitHndlr(reason?: any) {
        const { id } = delNotReportStuModalState || {};
        dispatch(deleteNotReportingStuAct(generateActionPayload("delete_not_report_stu", { id }, {
            reason: reason || ""
        })));
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        notReportingStuList(paginationInfo)
    }

    const toggleDelNotReportStuModal = (id?: any) => {
        setDelNotReportStuModalState((prev: any) => ({ ...prev, id: id || "", showModal: !prev.showModal }));
    }


    function submitExportHndlr() {

        const payload = {
            branchId,
            instituteId,
            ...notReportingStuFilter,
        };
        delete payload.orderBy
        delete payload.sortBy
        dispatch(exportNotReportingListAct(generateActionPayload('export_not_report_stu', undefined, payload, {
            responseType: 'blob'
        })))
    }
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { totalElements, totalPages, pageble } = getNotReportingStuListResp || {}
    const { content: classTypes } = branchClassResp || {};
    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Academics" />
                    <div className="tw-bg-white tw-mb-5 tw-rounded-xl tw-shadow-sm">
                        <div className="tw-border-b tw-px-6 tw-py-4">
                            <div className="tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-gap-4">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                    Not Reporting Students Details
                                </h4>
                                <div className="tw-flex tw-items-center tw-gap-3">
                                    <Button
                                        type="button"
                                        variant="primary"
                                         onClick={() => toggleAddNotReportStuModal()}
                                        className="tw-flex tw-items-center tw-gap-1"
                                    >
                                        <i className="ri-add-line tw-mr-2"></i>
                                        Add New
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="exportBtn"
                                        onClick={openExportNotReportingModalHnldr}
                                    >
                                        <img src={ExportIcon} className="tw-h-5 tw-w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="tw-px-6 tw-py-5">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                <div className="tw-col-span-12 md:tw-col-span-3 search-box">
                                    <TextInput
                                        name="studentName"
                                        value={notReportingStuFilter.studentName}
                                        onChange={filterHandler}
                                        inputClassName="bg-soft-light"
                                        formgroupClassName="mb-0"
                                        placeHolder="Search"
                                        labelText="Search"
                                        floatingLabel
                                    />
                                    <i className="ri-search-line search-icon"></i>
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-3">
                                    <SelectInput
                                        name="academicYearId"
                                        value={notReportingStuFilter.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-3">
                                    <SelectInput
                                        name="curriculumId"
                                        value={notReportingStuFilter.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-3">
                                    <SelectInput
                                        name="classId"
                                        value={notReportingStuFilter.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Class"
                                        floatingLabel
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="tw-pb-3">
                            <TableContainer
                                columns={roleColumns || []}
                                data={getNotReportingStuListResp?.data || []}
                                divClass="tw-overflow-x-auto tw-mb-6"
                                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-text-sm"
                                showPagination={true}
                                totalPages={totalPages || 0}
                                totalRecords={totalElements || 0}
                                callbackPaginationHndlr={paginationHndlr}
                                currentPageNumber={pageble?.pageNumber || 0}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="Add-Assign-Language-Model"
                isOpen={addNotReportStuModalState.showModal}
                toggle={toggleAddNotReportStuModal}
                modalTitle="Not Reporting Students"
                modalSize="md"
            >
                <AddNotReportingStuModal toggle={toggleAddNotReportStuModal} id={addNotReportStuModalState?.id} />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id = "delete-not-report-stu-modal"
                isOpen={delNotReportStuModalState.showModal}
                toggle={toggleDelNotReportStuModal}
                modalSize="md"
                hideHeader={true}
            >
                <DeleteConfirmationModal 
                    cancelHndlr={() => toggleDelNotReportStuModal()}
                    confirmHndlr={removeModalSubmitHndlr}
                    isDisble={showApiLoader}
                ></DeleteConfirmationModal>
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="export-login-history-modal"
                isOpen={exportNotReportingModalState.showModal}
                toggle={closeExportNotReportingModalHnldr}
                modalTitle="Export Not Reporting Details"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportNotReportingModalState.showModal}
                    toggle={closeExportNotReportingModalHnldr}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={submitExportHndlr}
                    feature="academic"
                    subFeature="not_reporting_students"
                    remarksText="Enter remarks to export the not reporting details?"
                />
            </ModalContainerUpdated>

        </>
    );
};

export default NotReportingStudents;
