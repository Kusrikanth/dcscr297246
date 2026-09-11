
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { shallowEqual } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { exportTransportManageAct, getByIdTransportManageAct, getTransportManageListAct } from "../../../store/transportation/transportationaction";
import { generateColumns } from "./helper";
import AddTransportManagement from "./AddTransportManagement";
import ShowStudentsList from "./ShowStudentsList";
import { downloadExcelFile } from "../../../utility/commonutility";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";
import { useModal } from "../../../hooks/modalhook";
import SendMessageModal from "./SendMessageModal";

const initialValues = {
    routeName: "",
    academicYearId : "",
};

const TansportManagement = () => {
    const [selectedRows,setSelectedRows] = useState<any[]>([])

    const dispatch = useAppDispatch();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const [exportExcel, setExportExcel] = useState({
        showModal: false,
    })

    const [addTransManState, setAddTransManState] = useState({
        showModal: false,
        routeId: undefined,
    })

    const [showStudentModal, setShowStudentModal] = useState({
        showModal: false,
        routeId: undefined,
    })
    const {
        openModal:sendMessageOpenModal,
        closeModal:sendMessageCloseModal,
        modalState:sendMessageModalState
    } = useModal()

    const toggleAddTransManModal = (routeId?: any) => {

        setAddTransManState((prev: any) => ({ ...prev, showModal: !prev.showModal, routeId: routeId || "" }))
    };

    const toggleShowStudentModal = (routeId?: any) => {

        setShowStudentModal((prev: any) => ({ ...prev, showModal: !prev.showModal, routeId: routeId || "" }))
    };

    const transportManageList = (otherProps?: any) => {
        const payload = {
            branchId,
            ...transportManageState,
            ...pagination.current,
            ...otherProps,
        };
        dispatch(getTransportManageListAct(generateActionPayload('get_transport_manage_list_new', undefined, payload)))
    }

    const [transportManageState, setTransportManageState] = useState(initialValues);

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getTransportManageListResp,
        editTransportManageResp,
        transportationErrorAct,
        exportTransportManageResp,
        showApiLoader,
    } = useAppSelector(
        ({ globalData, instAcademics, appData, transportrequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getTransportManageListResp: transportrequest.getTransportManageListResp,
            editTransportManageResp: transportrequest.editTransportManageResp,
            exportTransportManageResp: transportrequest.exportTransportManageResp,
            transportationErrorAct: transportrequest.transportationErrorAct,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    const transManageRef = useRef({
        prevEditTransportManageResp: editTransportManageResp,
        prevExportTransportManageResp: exportTransportManageResp,
        prevTransportationErrorAct: transportationErrorAct,
    });

    useEffect(() => {
        const { prevEditTransportManageResp, prevTransportationErrorAct, prevExportTransportManageResp } = transManageRef.current;

        if (editTransportManageResp && prevEditTransportManageResp !== editTransportManageResp) {
            toast.success("List Updated Successfully.")
            toggleAddTransManModal()
            transportManageList()
        }
        else if (transportationErrorAct && prevTransportationErrorAct !== transportationErrorAct) {
            const { details } = transportationErrorAct || {}
            toast.error(details || "Something went wrong. Please try again.")
        }
        else if (exportTransportManageResp && prevExportTransportManageResp !== exportTransportManageResp) {
            toast.success("List Exported Successfully.")
            toggleExportExcelModal()
            downloadExcelFile(exportTransportManageResp, "transport_management");
        }

        transManageRef.current.prevEditTransportManageResp = editTransportManageResp;
        transManageRef.current.prevTransportationErrorAct = transportationErrorAct;
        transManageRef.current.prevExportTransportManageResp = exportTransportManageResp;
    }, [editTransportManageResp, transportationErrorAct, exportTransportManageResp]);

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={20} />,
                actionName: "Edit",
                onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
                    const routeId = event.currentTarget.getAttribute("data-id");
                    dispatch(getByIdTransportManageAct(generateActionPayload("get_by_id_trans_manage_new", { routeId , academicYearId: transportManageState.academicYearId })));
                    toggleAddTransManModal(routeId)
                },
            },
        ],
        [getTransportManageListResp,transportManageState]
    );

    const roleColumns = useMemo(() => generateColumns(menuOptions, toggleShowStudentModal), [getTransportManageListResp]);

    useEffect(() => {
        if (academicYearListResp) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
            transportManageList({academicYearId: yearId})
            setTransportManageState((prev: any) => ({ ...prev, academicYearId: yearId }))
        }
    }, [academicYearListResp,branchId,instituteId]);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setTransportManageState((prev: any) => ({ ...prev, [name]: value }))
        pagination.current.pageNo = 0;
        transportManageList({ [name]: value })
    }
    const selectedRowHandler = useCallback((row:any) => {
        setSelectedRows(row);
      }, []);

    const toggleExportExcelModal = () => {
        setExportExcel((prevState) => ({
            ...prevState,
            showModal: !prevState.showModal,
        }));
    };

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        transportManageList(paginationInfo)
    }

    const exportModalHndler = () => {
        dispatch(exportTransportManageAct(generateActionPayload("export_trans_manage", undefined, { ...transportManageState, branchId, instituteId }, {
            responseType: 'blob'
        })));
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { totalElements, totalPages, pageble } = getTransportManageListResp || {}

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Transportation" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                        <div className="tw-px-4 tw-py-4 tw-border-b">
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                    Transport Management
                                </h4>

                                <div className="tw-flex tw-gap-2 tw-items-center">
                                    <Button
                                    variant="info"
                                        onClick={() => toggleExportExcelModal()}
                                    >
                                        <i className="ri-add-line" />
                                        Export
                                    </Button>
                                    <Button disabled={selectedRows.length <= 0 || showApiLoader} onClick = {() => sendMessageOpenModal()} className="tw-ml-2" variant="info">
                                        Send Message
                                    </Button>
                                </div>

                            </div>
                        </div>

                        <div className="tw-px-6 tw-py-4">
                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-4 tw-gap-4">
                                <div>
                                    <div className="search-box tw-relative">
                                        <TextInput
                                            name="routeName"
                                            value={transportManageState.routeName}
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

                                <div>
                                    <SelectInput
                                        name="academicYearId"
                                        value={transportManageState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>
                            </div>
                        </div>

                        <TableContainer
                            columns={roleColumns || []}
                            data={getTransportManageListResp?.data || []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageble?.pageNumber || 0}
                            showCheckbox={true}
                            selectedRowHandler={selectedRowHandler}
                        />
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="add-edit-transport-management"
                isOpen={addTransManState.showModal}
                toggle={() => toggleAddTransManModal()}
                modalTitle="Update Details"
                modalSize="lg"
            >
                <AddTransportManagement academicYearId={transportManageState.academicYearId} toggle={() => toggleAddTransManModal()} />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="show-students-list-transport-management"
                isOpen={showStudentModal.showModal}
                toggle={() => toggleShowStudentModal()}
                modalTitle="List"
                modalSize="lg"
            >
                <ShowStudentsList toggle={toggleShowStudentModal} isOpen={showStudentModal.showModal} routeId={showStudentModal.routeId} academicYearId={transportManageState.academicYearId} />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="export-transport-management-modal"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Tarnsport Management Details"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportModalHndler}
                    feature="transportation"
                    subFeature="transport_management"
                    remarksText="Enter remarks to export transport management details?"
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="sendMessageModalState"
                isOpen={sendMessageModalState.showModal}
                toggle={sendMessageCloseModal}
                modalTitle="Send transport delay update"
                modalSize="lg"
            >
                <SendMessageModal
                    toggle={sendMessageCloseModal}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default TansportManagement;
