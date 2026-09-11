import React, { useEffect, useMemo, useRef, useState } from 'react'
import BreadCrumb from '../../../Components/Common/BreadCrumb'
import { ConfirmationModal, DateInput, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from '../../../Components/Common'
import TableContainer from '../../../Components/Common/TableContainer'
import { eventStatusMenu, generateColumns, ignoredKeys } from './helper'
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook'
import { shallowEqual } from 'react-redux'
import { IPaginationState } from '../../../Components/Common/Pagination'
import { generateActionPayload } from '../../../utility/reduxutility'
import { deleteEventAct, deleteTemplateAct, getEventListAct, setEventByIdAct } from '../../../store/communication/communicationactions'
import { useHistory } from 'react-router-dom'
import LocationSelectorModal from './LocationSelectorModal'
import { useFilterState } from '../../../hooks/filterhook'
import { useModal } from '../../../hooks/modalhook'
import { toast } from 'react-toastify'
import { default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AdvanceFilterModal from './AdvanceFilterModal'
import { setEmployeesByFilterAct } from '../../../store/directory/employeemanagement/employeemanagementslice'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete02StrokeStandard, PencilEdit02Icon } from '@hugeicons-pro/core-stroke-standard'
import Button from '../../../Components/Common/Button'

const initialFilterState = {
    searchString: "",
    academicYearId: "",
    startDate: "",
    endDate: "",
    eventStatus: "",
};

const Events = () => {
    const [filterState, setFilterState] = useState({ ...initialFilterState });
    const [open, setOpen] = useState<boolean>(false);
    const { showClearFilterState,count, advanceFilterChange } = useFilterState();
    const paginationDetailRef = useRef<IPaginationState>({
        pageNo: 0,
        pageSize: 10,
    });
    const { closeModal: closeDeleteTemplateModal, modalState: deleteTemplateState, openModal: openDeleteTemplateModal } = useModal();
    const dispatch = useAppDispatch()
    const history = useHistory();
    const [mapModalState, setMapModalState] = useState({
        showModal: false,
        longitude: undefined,
        latitude: undefined,
        data: undefined,
    })

    const eventsListApi = (otherProps?: any) => {
        let payload = {
            instituteId: instituteId,
            branchId,
            ...filterState,
            ...otherProps,
            ...paginationDetailRef.current,

        }
        dispatch(getEventListAct(generateActionPayload("get_event_list", undefined, payload)));
    }
    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        showApiLoader,
        eventListResp,
        deleteEventResp,
        communicationErrorResp

    } =
        useAppSelector(({ appData, instAcademics, globalData, communication }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            eventListResp: communication.eventListResp,
            deleteEventResp: communication.deleteEventResp,
            communicationErrorResp: communication.communicationErrorResp
        }), shallowEqual);

    const menuOptions = useMemo(() => {
        return ([
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    moveToAddEvents(id);
                },
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openDeleteTemplateModal(id)
                },
            }
        ])
    }, [eventListResp]);

    const evntsRef = useRef({
        prevCommunicationErrorResp: communicationErrorResp,
        prevDeleteEventResp: deleteEventResp,
    });

    useEffect(() => {
        const { prevCommunicationErrorResp, prevDeleteEventResp } = evntsRef.current;
        if (deleteEventResp && prevDeleteEventResp !== deleteEventResp) {
            toast.success("Event Delete Successfully");
            eventsListApi()
            closeDeleteTemplateModal()
        }
        else if (communicationErrorResp && communicationErrorResp !== prevCommunicationErrorResp) {
            const { details } = communicationErrorResp;
            toast.error(details || "Something went wrong.");
        }
        evntsRef.current.prevDeleteEventResp = deleteEventResp;
        evntsRef.current.prevCommunicationErrorResp = communicationErrorResp;
    }, [communicationErrorResp, deleteEventResp]);
    const toggleMapModal = (latitude?:number, longitude?: number, data?: string) => {
        setMapModalState((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            longitude: longitude || "",
            latitude: latitude || "",
            data: data || "",
        }));
    }


    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        setFilterState((prev) => ({ ...prev, academicYearId: yearId || "" }));
        eventsListApi({ academicYearId: yearId })
    }, [academicYearListResp]);

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState) => ({ ...prevState, [name]: value }));
        eventsListApi({ [name]: value });
        advanceFilterChange({
            keys: { ...filterState, [name]: value },
            ignoredKeys,
        });
    }
    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
        eventsListApi(paginationInfo);
    }
    const moveToAddEvents = (id?: string | number) => {
        if(id){
            history.push(`/events/edit-event`,{id:id , fromComponent: 'Communication Event'})
            dispatch(setEmployeesByFilterAct(undefined))
        }
        else{
            history.push(`/events/add-event`)
            dispatch(setEventByIdAct(undefined))
            dispatch(setEmployeesByFilterAct(undefined))
        }
    }
    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
        advanceFilterChange({ keys : { ...filterState, ...appliedFilters , academicYearId: "" } , ignoredKeys })
        setFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
        eventsListApi(appliedFilters)    
      }
    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
      }
    
    const deleteTemplateHandler = () => {
        dispatch(
            deleteEventAct(
                generateActionPayload("delete_event", {
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
            eventsListApi({ ...initialFilterState, academicYearId })
            advanceFilterChange({ keys: { ...initialFilterState }, ignoredKeys });

        }
    };

    const studentColumns = useMemo(() => generateColumns(menuOptions, toggleMapModal), [])

    const { data: eventsList, pageNo: pageNumber, totalPages, totalElements: totalRecords } = eventListResp || {};

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Communication" pageTitle="Communication" />

                    <div className="tw-grid tw-grid-cols-12">
                        <div className="tw-col-span-12">
                            <div className="tw-bg-white tw-rounded tw-shadow" id="tasksList">

                                {/* Header */}
                                <div className="tw-border-b tw-p-4">
                                    <div className="tw-flex tw-items-center">
                                        <h4 className="tw-text-lg tw-font-semibold tw-flex-grow">
                                            Events
                                        </h4>

                                        <div className="tw-flex tw-items-center">
                                            <Button
                                                variant='primary'
                                                type='button'
                                                onClick={() => moveToAddEvents()}
                                            >
                                                <i className="ri-add-line tw-mr-1" />
                                                Add Event
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Filters */}
                                <div className="tw-px-3 tw-py-3">
                                    <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                                        {/* Search */}
                                        <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
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
                                                <i className="ri-search-line search-icon"></i>
                                            </div>
                                        </div>

                                        {/* Academic Year */}
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

                                        {/* Event Status */}
                                        <div className="tw-col-span-6 xl:tw-col-span-2">
                                            <SelectInput
                                                name="eventStatus"
                                                value={filterState.eventStatus}
                                                onChange={onChangeFilterHndlr}
                                                menuItems={eventStatusMenu}
                                                formgroupClassName="tw-mb-0"
                                                valueKey="id"
                                                textKey="name"
                                                defaultSelect="Event Status"
                                                labelText="Event Status"
                                                floatingLabel
                                            />
                                        </div>

                                        {/* Advance Filter Button */}
                                        <div className="tw-relative">
                                                    <div
                                                      onClick={toggleAdvanceFilter}
                                                      className="tw-flex tw-items-center tw-gap-2 tw-bg-gray-100 tw-p-2 tw-cursor-pointer tw-rounded"
                                                    >
                                                      <FilterSvg height="18px" width="18px" />
                                                      <span>Filters</span>
                                                    </div>
                                        
                                                    <span
                                                      className="tw-absolute tw--top-2 tw-left-16 tw-rounded-full tw-bg-emerald-500 tw-text-white tw-text-xs tw-px-2"
                                                    >
                                                      {count}
                                                    </span>
                                                  </div>
                                        

                                        {/* Clear Filter */}
                                        {showClearFilterState && (
                                            <div className="tw-col-span-12 tw-flex tw-justify-end">
                                                <Button
                                                variant='wrong'
                                                    type="button"
                                                    onClick={clearFilterHndlr}
                                                >
                                                    Clear filter
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Table */}
                                <TableContainer
                                    columns={studentColumns}
                                    data={(Array.isArray(eventListResp?.data) && eventsList) || []}
                                    divClass="tw-overflow-x-auto tw-mb-3"
                                    tableClass="tw-w-full"
                                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
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
            <ModalContainerUpdated
                id="google-map-pop-up"
                isOpen={mapModalState.showModal}
                toggle={() => toggleMapModal()}
                modalSize="lg"
                modalTitle="Google Map"
            >
                <LocationSelectorModal
                    toggle={() => toggleMapModal()}
                    latitude={mapModalState?.latitude}
                    longitude={mapModalState?.longitude}
                    showApiLoader={showApiLoader}
                    modalData={mapModalState.data}
                />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="delete-template"
                isOpen={deleteTemplateState.showModal}
                confirmMessage="Are you sure you want to delete an Event?"
                cancelHndlr={closeDeleteTemplateModal}
                confirmHndlr={deleteTemplateHandler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType='reject'
            />
            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="advance-filter-book-issuance"
            >
                <AdvanceFilterModal
                filterState={filterState}
                applyFilterCallback={advanceFilterCallbckHndlr}
                toggleAdvanceFilter={toggleAdvanceFilter}
                onChangeFilterHndlr={onChangeFilterHndlr}
                isOpen={open}
                />
            </OffCanvasContainer>   


        </React.Fragment>
    )
}

export default Events