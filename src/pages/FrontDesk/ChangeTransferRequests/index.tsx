
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, DateInput, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import {  getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import {  exportChangeTraReqListAct,  getChangeTraReqListAct} from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { toast } from "react-toastify";
import { generateColumns } from "./helper";
import classNames from "classnames";
import UpdateChangeTransferStatus from "./UpdateChangeTransferStatus";
import Button from "../../../Components/Common/Button";

const initialValues: any = {
    searchString: "",
    academicYearId: "",
};

const ChangeTransferRequests = () => {
    const history = useHistory();

    const dispatch = useDispatch();
    const [updateStatusModal, setUpdateStatusModal] = useState<any>({
        showModal: false,
        id: undefined,
        data : undefined,
    })

    const pagination: any = useRef<any>({
        pageNo: 0,
        pageSize: 10
    })

    const [exportExcel, setExportExcel] = useState<any>({
        showModal: false,
        id: undefined
    })

    const ChangeTransReqList = ( otherProps?: any) => {
        const { academicYearId,searchString } = changeTransReqState;
        let payload = {
            academicYearId: academicYearId,
            recommendedBranchId:branchId,
            searchString,
            orderBy:"",
            sortBy:"",
            ...pagination.current ,
            ...otherProps,

        };
        if(payload.academicYearId){
            dispatch(getChangeTraReqListAct(generateActionPayload('get_change_transfer_request', undefined, payload)))
        }
    }

    const [changeTransReqState, setChangeTransReqState] =
        useState<any>(initialValues);

    const {
        academicYearListResp,

        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        updateStatusChangeTransferResp,
        applicationSaleError,
        exportChangeTraReqListResp,
        showApiLoader,
        getChangeTraReqListResp,
    }: any = useAppSelector(
        ({applicationSale, globalData, instAcademics,appData, }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            updateStatusChangeTransferResp:applicationSale.updateStatusChangeTransferResp,
            applicationSaleError:applicationSale.applicationSaleError,
            showApiLoader:globalData.showApiLoader,
            exportChangeTraReqListResp:applicationSale.exportChangeTraReqListResp,
            getChangeTraReqListResp:applicationSale.getChangeTraReqListResp,
        }),
        shallowEqual
    );

    const changeTransferRequestRef = useRef({
        prevExportChangeTraReqListResp: exportChangeTraReqListResp,
        prevUpdateStatusChangeTransferResp: updateStatusChangeTransferResp,
        prevApplicationSaleError: applicationSaleError,
    })
    useEffect(() => {
        const { prevExportChangeTraReqListResp,prevApplicationSaleError,prevUpdateStatusChangeTransferResp } = changeTransferRequestRef.current;
        if (exportChangeTraReqListResp && prevExportChangeTraReqListResp !== exportChangeTraReqListResp) {
            toast.success('Data Export Successfully')
            toggleExportExcelModal()
            downloadExcelFile(exportChangeTraReqListResp)
        }
        else if (updateStatusChangeTransferResp && prevUpdateStatusChangeTransferResp !== updateStatusChangeTransferResp) {
            toast.success('Status Update Successfully')
            ChangeTransReqList()
            toggleUpdateStatusModal()
        }
        else if (applicationSaleError && prevApplicationSaleError !== applicationSaleError) {
            const {details} = applicationSaleError;
            toast.error(details)
        }
        changeTransferRequestRef.current.prevExportChangeTraReqListResp = exportChangeTraReqListResp;
        changeTransferRequestRef.current.prevUpdateStatusChangeTransferResp = updateStatusChangeTransferResp;
        changeTransferRequestRef.current.prevApplicationSaleError = applicationSaleError;

    }, [exportChangeTraReqListResp,applicationSaleError,updateStatusChangeTransferResp])

    function downloadExcelFile(blobStream: any) {

        const url = window.URL.createObjectURL(new Blob([(blobStream)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Change_Transport_Export.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    const updateStatusHndler = (event:any)=>{
        const id = event.currentTarget.getAttribute("data-id");
        if(id){
            const data = getChangeTraReqListResp?.content?.find((item:any)=>+item?.id === +id)
            toggleUpdateStatusModal(id,data)
        }
    }

    const toggleUpdateStatusModal = (id?: any,data?:any) => {
        setUpdateStatusModal((prev:any)=>({...prev,showModal:!prev.showModal,id:id || "" ,data : data || "" }))
    };

    const menuOptions = useMemo(
        () => [
          {
            id: "updateStatus",
            actionIcon:  <EditSvg className="me-2 d-inline-block" fill='#878A99' />,
            actionName: "Update Status",
            onClickHndlr: updateStatusHndler,
          },
        ],
        [getChangeTraReqListResp]
      );


    const roleColumns = useMemo(() => generateColumns(menuOptions), [getChangeTraReqListResp]);

    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(
            getInstAcademicYearAct(
                generateActionPayload("get_inst_academic_year", undefined, payload)
            )
        );
        const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        if(academicYearListResp)
        { let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault)?.academicYearId

        setChangeTransReqState((prev: any) => ({ ...prev, academicYearId: yearId }))
        ChangeTransReqList( { academicYearId: yearId })}
    }, [academicYearListResp]);


    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setChangeTransReqState((prev: any) => ({ ...prev, [name]: value }))
        pagination.current.pageNo=0;
        ChangeTransReqList( { [name]: value })
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        ChangeTransReqList(paginationInfo)
    }

    const toggleExportExcelModal = (id?: any) => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            scrutinyId: id || "",
        }));
    };

    const exportExcelHndler = () => {
        const { academicYearId,searchString } = changeTransReqState;
        let payload = {
            academicYearId: academicYearId,
            recommendedBranchId:branchId,
            searchString,
        };
        dispatch(exportChangeTraReqListAct(generateActionPayload("export_change_transfer_request", undefined, { ...payload}, {
            responseType: 'blob'
        })));
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { content: changeTraReqResp,totalElements,totalPages,pageble } = getChangeTraReqListResp || {}

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Front Desk" pageTitleName="Campus Transfer Requests" />

                    <div className="tw-bg-white tw-shadow-sm tw-rounded-lg">
                        <div className='tw-border-b tw-px-4 tw-py-3 tw-flex tw-items-center tw-justify-between'>
                            <h4 className="card-title !tw-mb-0 tw-flex-grow tw-justify-center">
                                Campus Transfer Requests
                            </h4>
                            <div className="tw-text-center">
                                <Button variant="info" onClick={toggleExportExcelModal} >
                                    <i className="ri-download-2-line tw-mr-2" />
                                    <span>Export</span>
                                </Button>
                            </div>
                        </div>

                        <div className="tw-p-4">
                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 lg:tw-grid-cols-12 tw-gap-4">
                                <div className="md:tw-col-span-2 lg:tw-col-span-4 xl:tw-col-span-3">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={changeTransReqState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="tw-bg-gray-100 "
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search..."
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>

                                <div className="md:tw-col-span-2 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={changeTransReqState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        defaultSelect="Academic Year"
                                    />
                                </div>
                            </div>
                        </div>

                        <TableContainer
                            columns={roleColumns|| []}
                            data={changeTraReqResp || []}
                            divClass="table-responsive tw-mb-3"
                            theadClass="table-light tw-text-gray-500 tw-align-middle"
                            // showCheckbox={true}
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
            id="change-transfer-request-export"
            isOpen={exportExcel.showModal}
            confirmMessage="Are you sure you want Download excel file ?"
            cancelHndlr={toggleExportExcelModal}
            confirmHndlr={exportExcelHndler}
            isDisble={showApiLoader}
            showImgIcon={true}
            iconType='approve'
            btnClassName='btn w-sm btn-success'
        />
        <ModalContainerUpdated
                id="update-status-change-transfer-request"
                isOpen={updateStatusModal.showModal}
                toggle={toggleUpdateStatusModal}
                modalTitle="Update Status Change Transfer Request"
                modalSize="md"
            >
                <UpdateChangeTransferStatus toggle={toggleUpdateStatusModal} data={updateStatusModal.data} isOpen={updateStatusModal.showModal} />
            </ModalContainerUpdated>
        </>
    );
};

export default ChangeTransferRequests;
