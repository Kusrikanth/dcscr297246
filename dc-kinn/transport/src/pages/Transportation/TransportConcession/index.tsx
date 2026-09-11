
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
import { deleteTransportConcessionAct, exportTransportConcessionAct, getTransportConcessionListAct } from "../../../store/transportation/TransportationConcession/transportationconcessionaction";
import { downloadExcelFile } from "../../../utility/commonutility";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";


const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
};

const TransportConcession = () => {
    const history = useHistory();

    const dispatch = useDispatch();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const [delTransConceState, setDelTransConceState] = useState({
        showModal: false,
        id: ""
    })

    const [exportExcel, setExportExcel] = useState({
        showModal: false,
    })


    const transportConcessionList = (otherProps?: any) => {
        const { academicYearId, curriculumId, classId, searchString } = transportConcessionFilterState;
        let payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            instituteId: instituteId,
            branchId,
            classId,
            searchString,
            ...pagination.current,
            ...otherProps,
        };
        if (payload.academicYearId) {
            dispatch(getTransportConcessionListAct(generateActionPayload('get_transport_concession_list', undefined, payload)))
        }
    }

    const [transportConcessionFilterState, setTransportConcessionFilterState] = useState<any>(initialValues);

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getTransportConcessionListResp,
        deleteTransportConcessionResp,
        exportTransportConcessionResp,
        transportationConcessionErrorAct,
        showApiLoader
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, transportConcession }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getTransportConcessionListResp: transportConcession.getTransportConcessionListResp,
            deleteTransportConcessionResp: transportConcession.deleteTransportConcessionResp,
            exportTransportConcessionResp: transportConcession.exportTransportConcessionResp,
            transportationConcessionErrorAct: transportConcession.transportationConcessionErrorAct,
        }),
        shallowEqual
    );


    const transportConcessionRef = useRef({
        prevTransportationConcessionErrorAct: transportationConcessionErrorAct,
        prevDeleteTransportConcessionResp: deleteTransportConcessionResp,
        prevExportTransportConcessionResp: exportTransportConcessionResp,
    });

    useEffect(() => {
        const { prevDeleteTransportConcessionResp, prevExportTransportConcessionResp, prevTransportationConcessionErrorAct } = transportConcessionRef.current;

        if (transportationConcessionErrorAct && transportationConcessionErrorAct !== prevTransportationConcessionErrorAct) {
            const { details } = transportationConcessionErrorAct || {};
            toast.error(details || "Something went wrong");
        }
        else if (deleteTransportConcessionResp && deleteTransportConcessionResp !== prevDeleteTransportConcessionResp) {
            toast.success("Concession Deleted Successfully");
            toggleDelConcessionModal()
            transportConcessionList()
        }
        else if (exportTransportConcessionResp && exportTransportConcessionResp !== prevExportTransportConcessionResp) {
            toast.success("Transport Concession List Exported Successfully");
            downloadExcelFile(exportTransportConcessionResp,"Transport_Concession_List")
            setExportExcel((prev: any) => ({ ...prev, showModal: !prev.showModal }))
        }

        transportConcessionRef.current.prevDeleteTransportConcessionResp = deleteTransportConcessionResp;
        transportConcessionRef.current.prevExportTransportConcessionResp = exportTransportConcessionResp;
        transportConcessionRef.current.prevTransportationConcessionErrorAct = transportationConcessionErrorAct;
    }, [deleteTransportConcessionResp, exportTransportConcessionResp, transportationConcessionErrorAct]);

    const moveToNewStudentConcessionHandler = (id?: any) => {
        history.push("/transport-concession/edit-transport-concession", { id: id, fromComponent: 'Student Concession' });
      };

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={20} />,
                actionName: "Edit",
                onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
                  const id = event.currentTarget.getAttribute("data-id");
        
                  moveToNewStudentConcessionHandler(id);
                },
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    toggleDelConcessionModal(id)
                },
            }
        ],
        []
    );

    const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    const getClassApiCall = (otherProps?:any)=>{
        const payload = { branchId: branchId, academicYearId : transportConcessionFilterState?.academicYearId, curriculumId: transportConcessionFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
         dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: transportConcessionFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        setTransportConcessionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        getCurriculumApiCall({ academicYearId: yearId })
        transportConcessionList({ academicYearId: yearId })
    }, [academicYearListResp,branchId,instituteId]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if (name === 'academicYearId') {
            getCurriculumApiCall({ academicYearId: value })
            dispatch(resetBrchClassAct(undefined));
            setTransportConcessionFilterState((prev: any) => ({ ...prev,[name]:value, classId: null, curriculumId: "" }))
            transportConcessionList({ [name]: value,classId : null,curriculumId:"" })
        }
        else if (name === 'curriculumId') {
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
            }
            else {
                getClassApiCall({ curriculumId: value,academicYearId: transportConcessionFilterState.academicYearId});
                setTransportConcessionFilterState((prev: any) => ({ ...prev, [name]: value }))
            }
        }
        else {
            transportConcessionList({ [name]: value })
            setTransportConcessionFilterState((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        transportConcessionList(paginationInfo)
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { totalElements, totalPages, pageble } = getTransportConcessionListResp || {}
    const { content: classTypes } = branchClassResp || {};

    const toggleExportExcelModal = () => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
        }));
    };

    const toggleDelConcessionModal = (id?: any) => {
        setDelTransConceState((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            id: id || "",
        }));
    }

    function delModalSubmitHndlr() {
        const { id } = delTransConceState;
        dispatch(deleteTransportConcessionAct(generateActionPayload("delete_transport_concession", { transportConcessionId: id })));
    }

    const exportExcelHndler = () => {
        dispatch(exportTransportConcessionAct(generateActionPayload("export_transport_concession", undefined, { ...transportConcessionFilterState, branchId, instituteId }, {
            responseType: 'blob'
        })));
    }


    const moveToNewTransportConcessionHandler = () => {
        history.push("/transport-concession/create-transport-concession");
    };

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Transportation" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                        <div className="tw-px-4 tw-py-4 tw-border-b">
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                    Transport Concession
                                </h4>

                                <div className="tw-flex tw-gap-2">
                                    <Button
                                        variant="primary"
                                        onClick={() => moveToNewTransportConcessionHandler()}
                                    >
                                        <i className="ri-add-line" />
                                        Create New
                                    </Button>

                                    <Button
                                    variant="info"
                                        onClick={() => toggleExportExcelModal()}
                                    >
                                        <div className="tw-flex tw-items-center tw-gap-1 tw-text-white">
                                            <i className="ri-add-line" />
                                            <span>Export</span>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="tw-px-4 tw-py-4">
                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 xl:tw-grid-cols-5 tw-gap-4">
                                <div className="search-box tw-relative">
                                    <TextInput
                                        name="searchString"
                                        value={transportConcessionFilterState.searchString}
                                        onChange={filterHandler}
                                        inputClassName="tw-bg-gray-100"
                                        formgroupClassName="tw-mb-0"
                                        placeHolder="Search"
                                        labelText="Search"
                                        floatingLabel
                                    />
                                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                                </div>
                                <SelectInput
                                    name="academicYearId"
                                    value={transportConcessionFilterState.academicYearId}
                                    onChange={filterHandler}
                                    menuItems={academicYearList || []}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Academic Year"
                                    floatingLabel
                                />

                                <SelectInput
                                    name="curriculumId"
                                    value={transportConcessionFilterState.curriculumId}
                                    onChange={filterHandler}
                                    menuItems={curriculumTypes || []}
                                    valueKey="branchCurriculumId"
                                    textKey="curriculumName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Curriculum"
                                    floatingLabel
                                />

                                <SelectInput
                                    name="classId"
                                    value={transportConcessionFilterState.classId}
                                    onChange={filterHandler}
                                    menuItems={classTypes || []}
                                    valueKey="id"
                                    textKey="shortName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Short Name"
                                    floatingLabel
                                />
                            </div>
                        </div>

                        <TableContainer
                            columns={roleColumns || []}
                            data={getTransportConcessionListResp?.data || []}
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
            <ConfirmationModal
                id="delete-transport-concession-modal"
                isOpen={delTransConceState.showModal}
                confirmMessage="Are you sure you want to delete this Concession ?"
                cancelHndlr={toggleDelConcessionModal}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
            <ModalContainerUpdated
                id="export-transport-concession-modal"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Tarnsport Concession Details"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="transportation"
                    subFeature="transport_concession"
                    remarksText="Enter remarks to export transport concession details?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default TransportConcession;
