
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumns  } from "./helper";
import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { deleteWorkTypeAct, getWorkTypeByIdAct, getWorkTypesListAct } from "../../../store/academic/academicRequest/academicrequestactions";
import AddTypeofWorkModal from "./AddTypeofWorkModal";
import { useModal } from "../../../hooks/modalhook";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";

const initialValues: any = {
    searchString: "",
};

const TypeofWork = () => {
    const history = useHistory();

    const dispatch = useDispatch();

    const pagination: any = useRef<any>({
        pageNo: 0,
        pageSize: 10
    })

    const { closeModal: closeWorkTypeModalModal, modalState: WorkTypeAddModalState, openModal: openWorkTypeAddModal } = useModal();
    const { closeModal: closeDelWorkTypeModal, modalState: delWorkTypeModalState, openModal: openDelWorkTypeModal } = useModal();

    const typeofWorkList = (otherProps?: any) => {
        const { searchString} = typeofWorkFilterState;
        let payload = {
            branchId,
            searchString,
            sortBy : "createdAt",
            orderBy : "desc",
            ...pagination.current,
            ...otherProps,
        };
            dispatch(getWorkTypesListAct(generateActionPayload("get_work_types_list", undefined, payload)));

    }

    const [typeofWorkFilterState, setTypeofWorkFilterState] = useState<any>(initialValues);

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getWorkTypesListResp,
        addWorkTypesListResp,
        updateWorkTypeResp,
        deleteWorkTypeResp,
        academicRequestErrorResp,
    }: any = useAppSelector(
        ({  globalData, appData, academicRequest }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getWorkTypesListResp: academicRequest.getWorkTypesListResp,
            addWorkTypesListResp: academicRequest.addWorkTypesListResp,
            updateWorkTypeResp: academicRequest.updateWorkTypeResp,
            deleteWorkTypeResp: academicRequest.deleteWorkTypeResp,
            academicRequestErrorResp: academicRequest.academicRequestErrorResp,
        }),
        shallowEqual
    );

    const typeofWorksRef = useRef({
        prevAcademicRequestErrorResp: academicRequestErrorResp,
        prevDeleteWorkTypeResp: deleteWorkTypeResp,
        prevAddWorkTypesListResp : addWorkTypesListResp,
        prevUpdateWorkTypeResp : updateWorkTypeResp,
    })
    useEffect(() => {
        const { prevAcademicRequestErrorResp, prevDeleteWorkTypeResp, prevAddWorkTypesListResp, prevUpdateWorkTypeResp } = typeofWorksRef.current;
        if (academicRequestErrorResp && prevAcademicRequestErrorResp !== academicRequestErrorResp) {
            const { details } = academicRequestErrorResp;
            toast.error(details)
        }
        else if (deleteWorkTypeResp && prevDeleteWorkTypeResp !== deleteWorkTypeResp) {
            toast.success('Type of Work Deleted Successfully')
            closeDelWorkTypeModal();
            typeofWorkList()
        }
        else if (addWorkTypesListResp && prevAddWorkTypesListResp !== addWorkTypesListResp) {
            toast.success('Type of Works Added Successfully')
            closeWorkTypeModalModal();
            typeofWorkList()
        }
        else if (updateWorkTypeResp && prevUpdateWorkTypeResp !== updateWorkTypeResp) {
            toast.success('Type of Works Updated Successfully')
            closeWorkTypeModalModal();
            typeofWorkList()
        }
        typeofWorksRef.current.prevAcademicRequestErrorResp = academicRequestErrorResp;
        typeofWorksRef.current.prevDeleteWorkTypeResp = deleteWorkTypeResp;
        typeofWorksRef.current.prevAddWorkTypesListResp = addWorkTypesListResp;
        typeofWorksRef.current.prevUpdateWorkTypeResp = updateWorkTypeResp;

    }, [ academicRequestErrorResp, deleteWorkTypeResp,addWorkTypesListResp, updateWorkTypeResp])

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-text-gray-500" size={20} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    dispatch(getWorkTypeByIdAct(generateActionPayload("get_work_type_by_id", { id })));
                    openWorkTypeAddModal(id);
                },
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openDelWorkTypeModal(id)
                },
            },
        ],
        [getWorkTypesListResp]
    );

    const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    useEffect(() => {

        typeofWorkList();
        return () => {

        }
    }, []);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setTypeofWorkFilterState((prev: any) => ({ ...prev, [name]: value }))
        pagination.current.pageNo = 0;
        typeofWorkList({ [name]: value })

    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        typeofWorkList(paginationInfo)
    }

    const deleteWorkTypeHndler = () => {
        dispatch(deleteWorkTypeAct(generateActionPayload("delete_work_type", { id: delWorkTypeModalState.modalData })));
    }

    const { data: workTypesResp, totalElements, totalPages, pageble } = getWorkTypesListResp || {}

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Student Concessions" pageTitle="Academics" />
                    <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-6">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                    Type of Work
                                </h4>
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => openWorkTypeAddModal()}
                                    className="tw-flex tw-items-center"
                                >
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
                                            value={typeofWorkFilterState.searchString}
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
                            columns={roleColumns || []}
                            data={workTypesResp || []}
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
                id="add-upload-documents-modal"
                isOpen={WorkTypeAddModalState.showModal}
                toggle={closeWorkTypeModalModal}
                modalTitle={WorkTypeAddModalState.modalData ? "Edit Type of Work" : "Add Type of Work"}
                modalSize="md"
            >
                <AddTypeofWorkModal  id={WorkTypeAddModalState.modalData}
                    isOpen={false}
                    toggle={() => closeWorkTypeModalModal()}
                    modalTitle="Create Detail"
                    instituteId={instituteId}
                    branchId={branchId} />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-work-type-modal"
                isOpen={delWorkTypeModalState.showModal}
                confirmMessage="Are you sure you want delete Work Type ?"
                cancelHndlr={closeDelWorkTypeModal}
                confirmHndlr={deleteWorkTypeHndler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType='reject'
                btnClassName='btn w-sm btn-danger'
            />

        </>
    );
};

export default TypeofWork;
