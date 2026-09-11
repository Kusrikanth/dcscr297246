import React, { useCallback, useMemo, useState } from "react";
import { Card, CardHeader, CardBody, Row, Col, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, TextIconInput } from "../../../Components/Common";
import { generateColumns, departmentData } from "./helper";

//Modal Component
import AddFeeCategories from "./AddFeeCategories";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { useEffect, useRef } from "react";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getFeeCategoriesAct, deleteFeeCategoryAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

// Interface & Types
import { IInstDepartmentInfo, IUpdateInstDepartmentResp } from "../../../store/mastersettings/instituteinfo/instituteinfotypes";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { IPaginationState } from "../../../Components/Common/Pagination";

//Common Utility
import { getSortingKeys } from "../../../utility/commonutility";
import Button from "../../../Components/Common/Button";


const FeeCategories: React.FC<any> = ({ instituteId, instituteName }) => {
    const [addFeeDeptModalState, setAddFeeDeptModalState] = useState<any>({
        showModal: false, feeCategoryId: ""
    });
    const [delFeeDeptModalState, setDelFeeDeptModalState] = useState<any>({
        showModal: false,
        feeCategoryId: ""
    })
    const [filterState, setFilterState] = useState<any>({
        categoryName: undefined
    });
    const sortingDetailRef = useRef<any>(undefined);
    const paginationDetailRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });
    const dispatch = useAppDispatch();
    const { feeCategoriesResp, deleteFeeCategoryResp, masterFeeSettingsErrorResp } = useAppSelector(({ instFeeSettings,
        masterFeeSettings }) => ({
            feeCategoriesResp: masterFeeSettings.feeCategoriesResp,
            deleteFeeCategoryResp: masterFeeSettings.deleteFeeCategoryResp,
            masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp
        }), shallowEqual);

    const feeDepartmentRespRef = useRef<any>({
        prevDeleteFeeCategoryResp: deleteFeeCategoryResp,
        prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp
    });

    useEffect(() => {
        if (instituteId) {
            getFeeCategoriesApiCall();
        }
    }, [instituteId]);

    useEffect(() => {
        const { prevDeleteFeeCategoryResp, prevMasterFeeSettingsErrorResp } = feeDepartmentRespRef.current;
        if (deleteFeeCategoryResp && prevDeleteFeeCategoryResp !== deleteFeeCategoryResp) {
            setDelFeeDeptModalState((prevState: any) => ({ ...prevState, showModal: false, feeCategoryId: "" }));
            getFeeCategoriesApiCall();
            toast.success("Fee Category deleted successfully.");
        } else if (masterFeeSettingsErrorResp && masterFeeSettingsErrorResp !== prevMasterFeeSettingsErrorResp) {
            const { message }: any = masterFeeSettingsErrorResp;
            toast.error(message || "Something went wrong.");
        }
        feeDepartmentRespRef.current.prevDeleteFeeCategoryResp = deleteFeeCategoryResp;
        feeDepartmentRespRef.current.prevMasterFeeSettingsErrorResp = masterFeeSettingsErrorResp;
    }, [deleteFeeCategoryResp, masterFeeSettingsErrorResp]);

    const toggleCategoryHndlr = useCallback((apiCall?: boolean) => {
        setAddFeeDeptModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getFeeCategoriesApiCall();
        }
    }, [instituteId, feeCategoriesResp]);

    function addFeeDepartmentHndlr() {
        setAddFeeDeptModalState((prevState: any) => ({ ...prevState, showModal: true, feeCategoryId: "", modalData: undefined }));
    }

    function editFeeCategoryHndlr(event: any) {
        const feeCategoryId = event.currentTarget.getAttribute("data-id"),
            modalData: any = feeCategoriesResp?.feeCategoryVOList?.find((item: any) => item.id === Number(feeCategoryId));
        if (modalData) {
            setAddFeeDeptModalState((prevState: any) => ({ ...prevState, showModal: true, feeCategoryId, modalData }));
        }
    }

    function deleteFeeCategoryHndlr(event: any) {
        const feeCategoryId = event.currentTarget.getAttribute("data-id");
        if (feeCategoryId)
            setDelFeeDeptModalState((prevState: any) => ({ ...prevState, showModal: true, feeCategoryId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: editFeeCategoryHndlr,
    }, {
        id: "delete",
        actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
        actionName: "Delete",
        onClickHndlr: deleteFeeCategoryHndlr
    }]), [feeCategoriesResp]);

    function delModalCancelHndlr() {
        setDelFeeDeptModalState((prevState: any) => ({ ...prevState, showModal: false }));
    }
    function delModalSubmitHndlr() {
        const { feeCategoryId } = delFeeDeptModalState;
        dispatch(deleteFeeCategoryAct(generateActionPayload("del_fee_category", { feeCategoryId: feeCategoryId })));
    }
    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
        getFeeCategoriesApiCall();
    }

    function getFeeCategoriesApiCall(otherProps?: (IPaginationState | any)) {
        const sortingParams = getSortingKeys(sortingDetailRef.current);
        const params = {
            instituteId, ...filterState, ...otherProps,
            ...sortingParams
        };
        dispatch(getFeeCategoriesAct(generateActionPayload("get_fee_categories", undefined, params)));
    }
    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getFeeCategoriesApiCall({ [name]: value });
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
            sortingDetailRef.current = sortingKeys;
            getFeeCategoriesApiCall();
            //Testing
        } else {
            sortingDetailRef.current = sortingKeys;
        }
    }


    const departmentColumns = useMemo(() => generateColumns(menuOptions), [feeCategoriesResp]),
        { feeCategoryVOList } = feeCategoriesResp || {};
    return (
        <React.Fragment>
            <div className="tw-rounded-lg tw-shadow-md tw-bg-white tw-overflow-hidden">
                <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200 tw-bg-gray-50">
                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-0 tw-flex-grow">
                        Fee Categories
                    </h4>
                </div>
                <div className="tw-p-0">
                    <div className="tw-py-3 tw-px-3">
                        <form onClick={e => e.preventDefault()}>
                            <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                <div className="tw-col-span-6">
                                    <TextIconInput
                                        formgroupClassName="search-box"
                                        name="categoryName"
                                        value={filterState.categoryName}
                                        placeHolder="Search"
                                        labelText="Search"
                                        floatingLabel
                                        onChange={onChangeFilterHndlr}
                                    >
                                        <i className="ri-search-line search-icon"></i>
                                    </TextIconInput>
                                </div>
                                <div className="tw-col-span-6 tw-ml-auto">
                                    <Button
                                    variant="primary"
                                        onClick={addFeeDepartmentHndlr}
                                    >
                                        Add Category
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <TableContainer
                        columns={departmentColumns || []}
                        data={Array.isArray(feeCategoryVOList) ? feeCategoryVOList : []}
                        divClass="tw-overflow-x-auto"
                        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                        showPagination={false}
                        totalPages={1}
                        totalRecords={Array.isArray(feeCategoryVOList) ? feeCategoryVOList.length : 0}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={0}
                        manualSorting={true}
                        sortingHandler={sortingHandler}
                    />
                </div>
            </div>
            <AddFeeCategories
                isOpen={addFeeDeptModalState.showModal}
                toggle={toggleCategoryHndlr}
                modalTitle={addFeeDeptModalState.feeCategoryId ? "Edit Category" : "Add Category"}
                instituteId={instituteId}
                feeCategoryId={addFeeDeptModalState.feeCategoryId}
                editCategoryDetails={addFeeDeptModalState.modalData}
            />
            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delFeeDeptModalState.showModal}
                confirmMessage="Are you sure you want to delete this fee category ?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}

export default FeeCategories;