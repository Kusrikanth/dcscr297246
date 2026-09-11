import React, { useEffect, useMemo, useRef, useState } from 'react'
import BreadCrumb from '../../../Components/Common/BreadCrumb'
import { ConfirmationModal, DateInput, ModalContainerUpdated, SelectInput, TextInput } from '../../../Components/Common'
import TableContainer from '../../../Components/Common/TableContainer'
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook'
import { shallowEqual } from 'react-redux'
import { IPaginationState } from '../../../Components/Common/Pagination'
import { generateActionPayload } from '../../../utility/reduxutility'
import { useFilterState } from '../../../hooks/filterhook'
import { useModal } from '../../../hooks/modalhook'
import { toast } from 'react-toastify'
import { default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import { generateColumns } from './helper'
import { deleteFeedsAct, getFeedsByIdAct, getFeedsListAct, setFeedsByIdAct } from '../../../store/communication/communicationactions'
import AddEditFeeds from './AddEditFeeds'
import AddFileHndler from './AddFileHndler'
import { setEmployeesByFilterAct } from '../../../store/directory/employeemanagement/employeemanagementslice'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete02StrokeStandard, FileEditIcon, PencilEdit02Icon } from '@hugeicons-pro/core-stroke-standard'
import Button from '../../../Components/Common/Button'

const initialFilterState = {
    searchString: "",
    academicYearId: "",
    startDate: "",
    endDate: "",
};
const Feeds = () => {
    const [filterState, setFilterState] = useState({ ...initialFilterState });
    const { showClearFilterState, advanceFilterChange } = useFilterState();
    const paginationDetailRef = useRef<IPaginationState>({
        pageNo: 0,
        pageSize: 10,
    });
    const { closeModal: closeDeleteTemplateModal, modalState: deleteTemplateState, openModal: openDeleteTemplateModal } = useModal();
    const { closeModal: closeFeedsStateModal, modalState: feedsStateModal, openModal: openFeedsStateModal } = useModal();
    const { closeModal: closeUpdateFilesModal, modalState: updateFilesModal, openModal: openUpdateFilesModal } = useModal();
    const dispatch = useAppDispatch()
    const feedsListApi = (otherProps?: any) => {
        let payload = {
            instituteId: instituteId,
            branchId,
            ...filterState,
            ...otherProps,
            ...paginationDetailRef.current,
        }
        dispatch(getFeedsListAct(generateActionPayload("get_feeds_list", undefined, payload)));
    }
    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        showApiLoader,
        communicationErrorResp,
        getFeedsListResp,
        saveFeedsResp,
        deleteFeedsResp,
        getFeedsByIdResp,
        updateFeedsResp,
        updateFeedsFilesResp,
    } =
        useAppSelector(({ appData, instAcademics, globalData, communication }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            getFeedsListResp: communication.getFeedsListResp,
            communicationErrorResp: communication.communicationErrorResp,
            saveFeedsResp: communication.saveFeedsResp,
            deleteFeedsResp: communication.deleteFeedsResp,
            getFeedsByIdResp: communication.getFeedsByIdResp,
            updateFeedsResp: communication.updateFeedsResp,
            updateFeedsFilesResp: communication.updateFeedsFilesResp,
        }), shallowEqual);
        

        function editScheduleTaskModalHndlr(event: React.MouseEvent<HTMLElement>) {
            const feedId = event.currentTarget.getAttribute("data-id");
            dispatch(getFeedsByIdAct(generateActionPayload('get_feeds_by_id', { id: feedId })));
            openFeedsStateModal(feedId);
        }
        const menuOptions = useMemo(() => {
            return ([
                        {
                            id: "edit",
                            actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
                            actionName: "Edit",
                            onClickHndlr: editScheduleTaskModalHndlr,   
                        },
                        {
                            id: "delete",
                            actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
                            actionName: "Delete",
                            onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
                                const id = event.currentTarget.getAttribute("data-id");
                                openDeleteTemplateModal(id)
                            },
                        },
                        {
                            id: "updateFile",
                            actionIcon: <HugeiconsIcon icon={FileEditIcon} className="me-2 text-muted" size={18} />,
                            actionName: "Update File",
                            onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
                                const id = event.currentTarget.getAttribute("data-id");
                                dispatch(getFeedsByIdAct(generateActionPayload('get_feeds_by_id', { id })))
                                openUpdateFilesModal(getFeedsByIdResp)
                            }
                        }
        ])
    }, [getFeedsByIdResp]);
    const evntsRef = useRef({
        prevCommunicationErrorResp: communicationErrorResp,
        prevSaveFeedsResp: saveFeedsResp,
        prevDeleteFeedsResp: deleteFeedsResp,
        prevUpdateFeedsResp: updateFeedsResp,
        prevUpdateFeedsFilesResp: updateFeedsFilesResp
    });
    useEffect(() => {
        const { prevCommunicationErrorResp, prevSaveFeedsResp,prevDeleteFeedsResp, prevUpdateFeedsResp, prevUpdateFeedsFilesResp } = evntsRef.current;
        if (saveFeedsResp && prevSaveFeedsResp !== saveFeedsResp) {
            toast.success("Feeds Add Successfully");
            feedsListApi()
            closeFeedsStateModal()
        }
        else if (deleteFeedsResp && prevDeleteFeedsResp !== deleteFeedsResp) {
            toast.success("Feeds Delete Successfully");
            feedsListApi()
            closeDeleteTemplateModal()
        } 
        else if (updateFeedsResp && prevUpdateFeedsResp !== updateFeedsResp) {
            toast.success("Feeds Update Successfully");
            feedsListApi()
            closeFeedsStateModal()
        } 
        else if (updateFeedsFilesResp && prevUpdateFeedsFilesResp !== updateFeedsFilesResp) {
            toast.success("Feeds File Update Successfully");
            feedsListApi()
            closeUpdateFilesModal()
        }
        else if (communicationErrorResp && communicationErrorResp !== prevCommunicationErrorResp) {
            const { details } = communicationErrorResp;
            toast.error(details || "Something went wrong.");
        }
        evntsRef.current.prevSaveFeedsResp = saveFeedsResp;
        evntsRef.current.prevCommunicationErrorResp = communicationErrorResp;
        evntsRef.current.prevDeleteFeedsResp = deleteFeedsResp;
        evntsRef.current.prevUpdateFeedsResp = updateFeedsResp;
        evntsRef.current.prevUpdateFeedsFilesResp = updateFeedsFilesResp;
    }, [communicationErrorResp, saveFeedsResp,deleteFeedsResp, updateFeedsResp,updateFeedsFilesResp ]);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        setFilterState((prev) => ({ ...prev, academicYearId: yearId || "" }))
        feedsListApi({ academicYearId: yearId })
    }, [academicYearListResp]);

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState) => ({ ...prevState, [name]: value }));
        feedsListApi({ [name]: value });
        advanceFilterChange({
            keys: { ...filterState, [name]: value },
            ignoredKeys: [],
        });
    }
    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
        feedsListApi(paginationInfo);
    }
    const addFeedsHandler = () => {
        openFeedsStateModal();
        dispatch(setFeedsByIdAct(undefined))
        dispatch(setEmployeesByFilterAct(undefined))
    }
    const deleteTemplateHandler = () => {
        dispatch(
            deleteFeedsAct(
                generateActionPayload("delete_feeds", {
                    id: deleteTemplateState.modalData,
                })
            )
        );
    };
    const clearFilterHndlr = () => {
        if (academicYearListResp) {
            paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
            let { academicYearId } = academicYearListResp?.data?.find((year: any) =>  year.yearStatus.toLowerCase() === "current") || {};
            setFilterState({ ...initialFilterState, academicYearId: academicYearId || "" })
            feedsListApi({ ...initialFilterState, academicYearId })
            advanceFilterChange({ keys: { ...initialFilterState }, ignoredKeys: [] });
        }
    };
    const studentColumns = useMemo(() => generateColumns(menuOptions), [])
    const { data: feedsList, pageNo: pageNumber, totalPages, totalElements: totalRecords } =  getFeedsListResp ||{};
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Communication" pageTitle="Communication" />

                    <div className="tw-grid tw-grid-cols-1">
                        <div className="tw-col-span-1">
                            <div className="tw-bg-white tw-rounded tw-shadow" id="tasksList">
                                <div className="tw-border-b tw-px-4 tw-py-3">
                                    <div className="tw-flex tw-items-center">
                                        <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
                                            Feeds
                                        </h4>

                                        <div className="tw-flex-shrink-0">
                                            <div className="tw-ml-auto tw-text-center">
                                                <Button
                                                variant="primary"
                                                    onClick={addFeedsHandler}
                                                >
                                                    <span>
                                                        <i className="ri-add-line tw-mr-1" />
                                                    </span>
                                                    <span>Add Feeds</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tw-p-0">
                                    <div className="tw-px-4 tw-py-4">
                                        <div className="tw-grid tw-grid-cols-1 tw-gap-3">
                                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-3">
                                                <div className="md:tw-col-span-4 xl:tw-col-span-3">
                                                    <div className="tw-relative">
                                                        <div className="search-box">
                                                        <TextInput
                                                            name="searchString"
                                                            formgroupClassName="tw-mb-0"
                                                            placeHolder="Search..."
                                                            value={filterState.searchString}
                                                            onChange={onChangeFilterHndlr}
                                                            labelText="Search"
                                                            floatingLabel
                                                        />
                                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="tw-col-span-6 xl:tw-col-span-2">
                                                    <SelectInput
                                                        name="academicYearId"
                                                        value={filterState.academicYearId}
                                                        onChange={onChangeFilterHndlr}
                                                        menuItems={academicYearListResp?.data}
                                                        formgroupClassName="tw-mb-0"
                                                        valueKey="academicYearId"
                                                        textKey="academicYearName"
                                                        defaultSelect="Academic Year"
                                                        labelText="Academic Year"
                                                        floatingLabel
                                                    />
                                                </div>

                                                <div className="tw-col-span-6 xl:tw-col-span-2">
                                                    <DateInput
                                                        name="startDate"
                                                        value={filterState?.startDate}
                                                        onChange={onChangeFilterHndlr}
                                                        formgroupClassName="tw-mb-0"
                                                        labelText="Start Date"
                                                        floatingLabel
                                                    />
                                                </div>

                                                <div className="tw-col-span-6 xl:tw-col-span-2">
                                                    <DateInput
                                                        name="endDate"
                                                        value={filterState?.endDate}
                                                        onChange={onChangeFilterHndlr}
                                                        formgroupClassName="tw-mb-0"
                                                        labelText="End Date"
                                                        floatingLabel
                                                    />
                                                </div>

                                                {showClearFilterState && (
                                                    <div className="tw-col-span-2 tw-flex">
                                                        <Button
                                                            type="button"
                                                            onClick={clearFilterHndlr}
                                                            variant='wrong'
                                                        >
                                                            Clear filter
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <TableContainer
                                        columns={studentColumns}
                                        data={(Array.isArray(getFeedsListResp?.data) && feedsList) || []}
                                        divClass="tw-overflow-x-auto tw-mb-3"
                                        tableClass="tw-whitespace-nowrap"
                                        theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                                        showPagination={true}
                                        totalPages={totalPages}
                                        totalRecords={totalRecords}
                                        callbackPaginationHndlr={paginationHndlr}
                                        currentPageNumber={pageNumber}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationModal
                id="delete-template"
                isOpen={deleteTemplateState.showModal}
                confirmMessage="Are you sure you want to delete a Feed?"
                cancelHndlr={closeDeleteTemplateModal}
                confirmHndlr={deleteTemplateHandler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType='reject'
            />

            <ModalContainerUpdated
                id="book-collection"
                isOpen={feedsStateModal.showModal}
                toggle={closeFeedsStateModal}
                modalTitle={`${feedsStateModal.modalData ? "Edit Feeds" : "Add Feeds"}`}
                modalSize="lg"
            >
                <AddEditFeeds
                data={getFeedsByIdResp}
                toggle={() => closeFeedsStateModal()}
              />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="book-collection"
                isOpen={updateFilesModal.showModal}
                toggle={closeUpdateFilesModal}
                modalTitle={"Update Files"}
                modalSize="lg"
            >
                <AddFileHndler
                data={getFeedsByIdResp}
                toggle={() => closeUpdateFilesModal()}
                showApiLoader={showApiLoader}

              />
            </ModalContainerUpdated>
        </React.Fragment>
    )
}
export default Feeds