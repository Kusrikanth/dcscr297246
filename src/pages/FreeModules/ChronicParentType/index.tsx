import React, { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { ConfirmationModal, ModalContainerUpdated, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import Button from "../../../Components/Common/Button";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { useModal } from "../../../hooks/modalhook";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    deleteChronicParentTypeAct,
    getChronicParentTypeByIdAct,
    getChronicParentTypesListAct,
} from "../../../store/fee/feecollections/feecollectionactions";
import { generateColumns, sampleChronicParentTypes, USE_SAMPLE_CHRONIC_PARENT_TYPES } from "./helper";
import AddChronicParentTypeModal from "./AddChronicParentTypeModal";

const initialFilters = { searchString: "" };

const ChronicParentType = () => {
    const dispatch = useAppDispatch();
    const pagination = useRef<any>({ pageNo: 0, pageSize: 10 });
    const [filterState, setFilterState] = useState<any>(initialFilters);

    const { closeModal: closeAddModal, modalState: addModalState, openModal: openAddModal } = useModal();
    const { closeModal: closeDeleteModal, modalState: deleteModalState, openModal: openDeleteModal } = useModal();

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getChronicParentTypesListResp,
        addChronicParentTypesResp,
        updateChronicParentTypeResp,
        deleteChronicParentTypeResp,
        feeCollectionErrorResp,
    }: any = useAppSelector(
        ({ globalData, appData, feeCollections }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getChronicParentTypesListResp: feeCollections.getChronicParentTypesListResp,
            addChronicParentTypesResp: feeCollections.addChronicParentTypesResp,
            updateChronicParentTypeResp: feeCollections.updateChronicParentTypeResp,
            deleteChronicParentTypeResp: feeCollections.deleteChronicParentTypeResp,
            feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
        }),
        shallowEqual
    );

    const fetchList = (otherProps?: any) => {
        const payload = {
            branchId,
            searchString: filterState.searchString,
            sortBy: "createdAt",
            orderBy: "desc",
            ...pagination.current,
            ...otherProps,
        };
        dispatch(getChronicParentTypesListAct(generateActionPayload("get_chronic_parent_types_list", undefined, payload)));
    };

    const prevRespRef = useRef({
        prevError: feeCollectionErrorResp,
        prevAdd: addChronicParentTypesResp,
        prevUpdate: updateChronicParentTypeResp,
        prevDelete: deleteChronicParentTypeResp,
    });
    useEffect(() => {
        const { prevError, prevAdd, prevUpdate, prevDelete } = prevRespRef.current;
        if (feeCollectionErrorResp && prevError !== feeCollectionErrorResp) {
            toast.error(feeCollectionErrorResp?.details || "Something went wrong");
        } else if (addChronicParentTypesResp && prevAdd !== addChronicParentTypesResp) {
            toast.success("Chronic Parent Type Added Successfully");
            closeAddModal();
            fetchList();
        } else if (updateChronicParentTypeResp && prevUpdate !== updateChronicParentTypeResp) {
            toast.success("Chronic Parent Type Updated Successfully");
            closeAddModal();
            fetchList();
        } else if (deleteChronicParentTypeResp && prevDelete !== deleteChronicParentTypeResp) {
            toast.success("Chronic Parent Type Deleted Successfully");
            closeDeleteModal();
            fetchList();
        }
        prevRespRef.current = {
            prevError: feeCollectionErrorResp,
            prevAdd: addChronicParentTypesResp,
            prevUpdate: updateChronicParentTypeResp,
            prevDelete: deleteChronicParentTypeResp,
        };
    }, [feeCollectionErrorResp, addChronicParentTypesResp, updateChronicParentTypeResp, deleteChronicParentTypeResp]);

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-text-gray-500" size={20} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    dispatch(getChronicParentTypeByIdAct(generateActionPayload("get_chronic_parent_type_by_id", { id })));
                    openAddModal(id);
                },
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openDeleteModal(id);
                },
            },
        ],
        []
    );

    const columns = useMemo(() => generateColumns(menuOptions), [menuOptions]);

    useEffect(() => {
        fetchList();
    }, []);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setFilterState((prev: any) => ({ ...prev, [name]: value }));
        pagination.current.pageNo = 0;
        fetchList({ [name]: value });
    };

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        fetchList(paginationInfo);
    }

    const deleteHndlr = () => {
        dispatch(deleteChronicParentTypeAct(generateActionPayload("delete_chronic_parent_type", { id: deleteModalState.modalData })));
    };

    const { data, totalElements, totalPages, pageble } = getChronicParentTypesListResp || {};
    const useSample = USE_SAMPLE_CHRONIC_PARENT_TYPES && !(Array.isArray(data) && data.length > 0);
    const tableData = useSample
        ? sampleChronicParentTypes.filter((row) =>
            row.chronicParentTypeName.toLowerCase().includes((filterState.searchString || "").toLowerCase())
        )
        : data || [];

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Chronic Parent Type" pageTitle="Fee" />
                    <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-6">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">Chronic Parent Type</h4>
                                <Button type="button" variant="primary" onClick={() => openAddModal()} className="tw-flex tw-items-center">
                                    <i className="ri-add-line tw-mr-2" />
                                    Add
                                </Button>
                            </div>
                        </div>
                        <div className="tw-px-4 tw-py-4">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                <div className="tw-col-span-12 md:tw-col-span-4 lg:tw-col-span-3">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={filterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="tw-bg-gray-100"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <TableContainer
                            columns={columns}
                            data={tableData}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                            showPagination={true}
                            totalPages={useSample ? 1 : totalPages || 0}
                            totalRecords={useSample ? tableData.length : totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageble?.pageNumber || 0}
                        />
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="add-chronic-parent-type-modal"
                isOpen={addModalState.showModal}
                toggle={closeAddModal}
                modalTitle={addModalState.modalData ? "Edit Chronic Parent Type" : "Add Chronic Parent Type"}
                modalSize="md"
            >
                <AddChronicParentTypeModal
                    id={addModalState.modalData}
                    toggle={closeAddModal}
                    instituteId={instituteId}
                    branchId={branchId}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-chronic-parent-type-modal"
                isOpen={deleteModalState.showModal}
                confirmMessage="Are you sure you want to delete this Chronic Parent Type ?"
                cancelHndlr={closeDeleteModal}
                confirmHndlr={deleteHndlr}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType="reject"
                btnClassName="btn w-sm btn-danger"
            />
        </>
    );
};

export default ChronicParentType;
