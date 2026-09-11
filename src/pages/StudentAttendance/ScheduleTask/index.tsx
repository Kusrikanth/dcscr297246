import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ConfirmationModal,
    ModalContainerUpdated,
    SelectInput,
    TextInput,
} from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { toast } from "react-toastify";
import { activeStatus, generateColumns } from "./helper";
import {
    deleteScheduleTaskAct,
    getScheduleListAct,
    updateStatusScheduleTaskAct,
} from "../../../store/StudentAttendance/ScheduleTask/scheduleTaskaction";
import AddScheduleTaskModal from "./AddScheduleTaskModal";
import { useModal } from "../../../hooks/modalhook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { useFilterState } from "../../../hooks/filterhook";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon,SquareLock02StrokeStandard, SquareUnlock02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";
const initialValues = {
    searchString: "",
    branchId: "",
    status: "",
};

const ScheduleTask = () => {
    const dispatch = useAppDispatch();
    const { showClearFilterState, advanceFilterChange } = useFilterState();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10,
    });

    const {
        modalState: scheduleTask,
        closeModal: closeScheduleTaskModalHndlr,
        openModal: openScheduleTaskModalHndlr,
    } = useModal();

    const {
        closeModal: closeDelScheduleTaskModal,
        modalState: delScheduleTaskModal,
        openModal: openDelScheduleTaskModal,
    } = useModal();

    const ScheduleTaskListApi = (otherProps?: any) => {
        const { searchString } = scheduleTaskFilterState;
        let payload = {
            instituteId: instituteId,
            branchId,
            searchString,
            module: "ATTENDANCE",
            ...otherProps,
            ...pagination.current,
        };
        if (payload.instituteId) {
            dispatch(getScheduleListAct(generateActionPayload("get_schedule_list", undefined, payload)));
        }
    };

    const [scheduleTaskFilterState, setScheduleTaskFilterState] = useState<any>(initialValues);

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getScheduleListResp,
        addScheduleTaskResp,
        deleteScheduleTaskResp,
        editScheduleTaskResp,
        scheduleTaskErrResp,
        updateStatusScheduleTaskResp,
    } = useAppSelector(
        ({ globalData, appData, scheduleTask }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getScheduleListResp: scheduleTask.getScheduleListResp,
            addScheduleTaskResp: scheduleTask.addScheduleTaskResp,
            deleteScheduleTaskResp: scheduleTask.deleteScheduleTaskResp,
            editScheduleTaskResp: scheduleTask.editScheduleTaskResp,
            scheduleTaskErrResp: scheduleTask.scheduleTaskErrResp,
            updateStatusScheduleTaskResp: scheduleTask.updateStatusScheduleTaskResp,
        }),
        shallowEqual
    );

    const scheduleTaskRef = useRef({
        prevAddScheduleTaskResp: addScheduleTaskResp,
        prevScheduleTaskErrResp: scheduleTaskErrResp,
        prevEditScheduleTaskResp: editScheduleTaskResp,
        prevDeleteScheduleTaskResp: deleteScheduleTaskResp,
        prevUpdateStatusScheduleTaskResp: updateStatusScheduleTaskResp,
    });

    useEffect(() => {
        const { prevAddScheduleTaskResp, prevEditScheduleTaskResp, prevDeleteScheduleTaskResp, prevScheduleTaskErrResp, prevUpdateStatusScheduleTaskResp, } = scheduleTaskRef.current;

        if (addScheduleTaskResp && addScheduleTaskResp !== prevAddScheduleTaskResp) {
            toast.success("Schedule Task Added Successfully.");
            closeScheduleTaskModalHndlr();
            ScheduleTaskListApi()
        }
        else if (editScheduleTaskResp && editScheduleTaskResp !== prevEditScheduleTaskResp) {
            toast.success("Schedule Task Updated Successfully.");
            closeScheduleTaskModalHndlr();
            ScheduleTaskListApi();
        } else if (updateStatusScheduleTaskResp && updateStatusScheduleTaskResp !== prevUpdateStatusScheduleTaskResp) {
            toast.success("Schedule Task Active Successfully.");
            ScheduleTaskListApi();
        } else if (deleteScheduleTaskResp && deleteScheduleTaskResp !== prevDeleteScheduleTaskResp) {
            toast.success("Schedule Task Inactive Successfully.");
            ScheduleTaskListApi();
            closeDelScheduleTaskModal();
        } else if (scheduleTaskErrResp && scheduleTaskErrResp !== prevScheduleTaskErrResp) {
            const { details } = scheduleTaskErrResp || {};
            toast.error(details || "Something went wrong.");
        }
        scheduleTaskRef.current.prevAddScheduleTaskResp = addScheduleTaskResp;
        scheduleTaskRef.current.prevEditScheduleTaskResp = editScheduleTaskResp;
        scheduleTaskRef.current.prevUpdateStatusScheduleTaskResp =
            updateStatusScheduleTaskResp;
        scheduleTaskRef.current.prevDeleteScheduleTaskResp = deleteScheduleTaskResp;
        scheduleTaskRef.current.prevScheduleTaskErrResp = scheduleTaskErrResp;
    }, [
        addScheduleTaskResp,
        editScheduleTaskResp,
        updateStatusScheduleTaskResp,
        deleteScheduleTaskResp,
        scheduleTaskErrResp,
    ]);

    useEffect(() => {
        ScheduleTaskListApi();
    }, [branchId, instituteId]);

    function editScheduleTaskModalHndlr(event: any) {
        const scheduleTaskId = event.currentTarget.getAttribute("data-id");
        const modalData = getScheduleListResp?.content?.find(
            (item: any) => +item.id == +scheduleTaskId
        );
        openScheduleTaskModalHndlr(modalData);
    }

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
                actionName: "Edit",
                onClickHndlr: editScheduleTaskModalHndlr
            },
            {
                id: "inactive",
                actionIcon: <HugeiconsIcon icon={SquareLock02StrokeStandard} className="text-danger" size={18} />,
                actionName: "Inactive Task",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openDelScheduleTaskModal(id);
                },
            },
            {
                id: "active",
                actionIcon: <HugeiconsIcon icon={SquareUnlock02StrokeStandard} className="text-success" size={18} />,
                actionName: "Active Task",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    dispatch(
                        updateStatusScheduleTaskAct(
                            generateActionPayload("update_status_schedule_task", { id })
                        )
                    );
                },
            },
        ],
        [getScheduleListResp]
    );

    const roleColumns = useMemo(() => generateColumns(menuOptions), [getScheduleListResp]);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setScheduleTaskFilterState((prev: any) => ({ ...prev, [name]: value }));
        pagination.current.pageNo = 0;
        ScheduleTaskListApi({ [name]: value });
        advanceFilterChange({
            keys: { ...scheduleTaskFilterState, [name]: value },
            ignoredKeys: [],
        });
    };

    const delScheduleTaskConfirmHndler = () => {
        dispatch(
            deleteScheduleTaskAct(
                generateActionPayload("delete_schedule_task", {
                    id: delScheduleTaskModal.modalData,
                })
            )
        );
    };

    const clearFilterHndlr = () => {
        setScheduleTaskFilterState({ ...initialValues });
        ScheduleTaskListApi({ ...initialValues, branchId });
        advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
    };

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        ScheduleTaskListApi(paginationInfo);
    }
    const { totalElements, totalPages, pageble } = getScheduleListResp || {};

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Schedule Task" pageTitle="Student Attendance" />

                    <div className="card">
                        {/* Header */}
                        <div className="card-header tw-py-2">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-flex-1">
                                    <h4 className="card-title !tw-mb-0">Schedule Task</h4>
                                </div>

                                <div>
                                    <Button
                                    variant="primary"
                                        onClick={() => openScheduleTaskModalHndlr()}
                                    >
                                        Add Task
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="card-body">
                            <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-3 tw-items-end">
                                {/* Search */}
                                <div className="lg:tw-col-span-4 xl:tw-col-span-2">
                                    <div className="search-box tw-relative">
                                        <TextInput
                                            name="searchString"
                                            value={scheduleTaskFilterState.searchString}
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

                                {/* Status */}
                                <div className="lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="status"
                                        value={scheduleTaskFilterState.status}
                                        onChange={filterHandler}
                                        menuItems={activeStatus || []}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Status"
                                        floatingLabel
                                    />
                                </div>

                                {/* Clear Filter */}
                                {showClearFilterState && (
                                    <div className="lg:tw-col-span-5 xl:tw-col-span-8 tw-flex tw-justify-end">
                                        <Button
                                            type="button"
                                            onClick={clearFilterHndlr}
                                            className="btn btn-ghost-danger"
                                        >
                                            Clear filter
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <TableContainer
                            columns={roleColumns || []}
                            data={
                                Array.isArray(getScheduleListResp?.content)
                                    ? getScheduleListResp?.content
                                    : []
                            }
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
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
                id="student-long-leave-modal"
                isOpen={scheduleTask.showModal}
                toggle={() => closeScheduleTaskModalHndlr()}
                modalTitle={
                    scheduleTask.modalData ? "Update Schedule Task" : "Add Schedule Task"
                }
                modalSize="lg"
            >
                <AddScheduleTaskModal
                    modalData={scheduleTask.modalData}
                    toggle={() => closeScheduleTaskModalHndlr()}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-route-modal"
                isOpen={delScheduleTaskModal.showModal}
                confirmMessage="Are you sure you want to Inactive this Schedule Task?"
                cancelHndlr={closeDelScheduleTaskModal}
                confirmHndlr={delScheduleTaskConfirmHndler}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
        </>
    );
};

export default ScheduleTask;
