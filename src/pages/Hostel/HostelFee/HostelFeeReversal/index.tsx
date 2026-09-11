import React, { useRef, useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { SelectInput, TextInput, ConfirmationModal, ModalContainerUpdated } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";

import TableContainer from "../../../../Components/Common/TableContainer";
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    getInstAcademicYearAct,
} from "../../../../store/mastersettings/instacademics/instacademicactions";
import { exportFeeReversalAct, getFeeReversalsAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { generateColumns } from "./helper";
import { exportHostelFeeReversalAct } from "../../../../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { PrinterIcon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";
// import PreviewReceipt from "./PreviewReceipt";
//Common Utility

const initialValues = {
    searchString: "",
    academicYearId: ""
}
const HostelFeeReversal = () => {
    const [filterState, setFilterState] = useState<any>(initialValues);
    const paginationDetailRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });

    const [exportExcel, setExportExcel] = useState<any>({
        showModal: false,
    })
    const [printReceipt, setPrintReceipt] = useState<any>({
        showModal: false,
        receiptId : undefined,
    })

    const dispatch = useAppDispatch();
    const {
        academicYearListResp, instAcademicErrorResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        feeReversalsResp, feeCollectionErrorResp, showApiLoader, exportHostelFeeReversalResp
    } =
        useAppSelector(({ appData, globalData, feeCollections,
            instAcademics, hostelStuLedger }) => ({
                academicYearListResp: instAcademics.academicYearListResp,
                instAcademicErrorResp: instAcademics.instAcademicErrorResp,
                currentInstIdResp: appData.currentInstIdResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                showApiLoader: globalData.showApiLoader,
                feeReversalsResp: feeCollections.feeReversalsResp,
                exportHostelFeeReversalResp: hostelStuLedger.exportHostelFeeReversalResp,
                feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
            }), shallowEqual);
            
    const hostelFeeReversalRef = useRef<any>({
        prevAcademicYearListResp: academicYearListResp,
        prevFeeReversalsResp: feeReversalsResp,
        prevExportHostelChequeClearanceResp: exportHostelFeeReversalResp,
        prevFeeApprovalsErrorResp: feeCollectionErrorResp
    });

    useEffect(() => {
        if (instituteId) {
            const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
            dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
        }
    }, [branchId,instituteId]);

    useEffect(() => {
        const { prevAcademicYearListResp, prevExportHostelChequeClearanceResp, prevFeeApprovalsErrorResp } = hostelFeeReversalRef.current;
        if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
            if (Array.isArray(academicYearListResp?.data)) {
                const { academicYearId } = academicYearListResp.data?.find((year: any) =>  year.yearStatus === "CURRENT") || {};
                setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
                getHostelFeeReversalApiCall({ academicYearId });
            }
        }
        else if (exportHostelFeeReversalResp && prevExportHostelChequeClearanceResp !== exportHostelFeeReversalResp) {
            toast.success("Hostel Fee Reversal List Exported Successfully.")
            toggleExportExcelModal()
            downloadExcelFile(exportHostelFeeReversalResp)
        }
        else if(feeCollectionErrorResp && prevFeeApprovalsErrorResp !== feeCollectionErrorResp){
            const { details } = feeCollectionErrorResp || {};
            toast.error(details || "Something went wrong.");
        }
        hostelFeeReversalRef.current.prevAcademicYearListResp = academicYearListResp;
        hostelFeeReversalRef.current.prevExportHostelChequeClearanceResp = exportHostelFeeReversalResp;
        hostelFeeReversalRef.current.prevFeeApprovalsErrorResp = feeCollectionErrorResp;
    }, [academicYearListResp, exportHostelFeeReversalResp,feeCollectionErrorResp]);

    function printReceiptHndlr(event: any) {
        const feeReceiptId = event.currentTarget.getAttribute("data-id");
        if (feeReceiptId){
            togglePrintReceiptModal(feeReceiptId);
        }
         
      }

    const menuOptions = useMemo(
        () => [
          {
            id: "print",
            actionIcon: <HugeiconsIcon icon={PrinterIcon} className="me-2 text-muted" size={18}/>,
            actionName: "Print",
            onClickHndlr: printReceiptHndlr,
          },
        ], [feeReversalsResp]);

    function downloadExcelFile(blobStream: any) {

        const url = window.URL.createObjectURL(new Blob([(blobStream)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Hostel_fee_reversal.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getHostelFeeReversalApiCall({ [name]: value });

    }
    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        getHostelFeeReversalApiCall();
    }


    function getHostelFeeReversalApiCall(otherProps?: any) {
        const payload = { branchId, ...filterState, ...otherProps, ...paginationDetailRef.current };
        dispatch(getFeeReversalsAct(generateActionPayload("hostel_fee_reversal", undefined, payload)));
    }

    const toggleExportExcelModal = () => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
        }));
    };

    const togglePrintReceiptModal = (receiptId?:any) => {
        setPrintReceipt((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            receiptId : receiptId || "",
        }));
    };

    const exportExcelHndler = () => {
        const payload = {
            ...filterState
        }
        dispatch(exportHostelFeeReversalAct(generateActionPayload("export_hostel_fee_reversal", undefined, { ...payload, branchId }, {
            responseType: 'blob'
        })));
    }

    const chequeHistoryColumns = useMemo(() => generateColumns(menuOptions), [feeReversalsResp]);
    const { data: feeReversalList, totalPages, totalElements } = feeReversalsResp || {};
    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Cheques Details" pageTitle="Hostel" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                        <div className="tw-border-b tw-px-6 tw-py-4">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-w-1/2">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                        Fee Reversals
                                    </h4>
                                </div>

                                <div className="tw-ml-auto">
                                    <Button
                                    variant="info"
                                        onClick={toggleExportExcelModal}
                                    >
                                        <div className="tw-flex tw-items-center tw-text-white">
                                            <i className="ri-add-line tw-me-1" />
                                            <span>Export</span>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="tw-p-0">
                            <div className="tw-py-3 tw-px-3">
                                <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                    <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                                        <div className="tw-relative search-box">
                                            <TextInput
                                                name="searchString"
                                                value={filterState.searchString}
                                                onChange={onChangeFilterHndlr}
                                                inputClassName="tw-bg-gray-100"
                                                formgroupClassName="tw-mb-0"
                                                labelText="Search"
                                                placeHolder="Search"
                                                floatingLabel
                                            />
                                            <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                                        <SelectInput
                                            name="academicYearId"
                                            value={filterState.academicYearId}
                                            onChange={onChangeFilterHndlr}
                                            menuItems={academicYearListResp?.data}
                                            valueKey="academicYearId"
                                            textKey="academicYearName"
                                            formgroupClassName="tw-mb-0"
                                            labelText="Academic Year"
                                            floatingLabel
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <TableContainer
                            columns={chequeHistoryColumns}
                            data={Array.isArray(feeReversalList) ? feeReversalList : []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages}
                            totalRecords={totalElements}
                            callbackPaginationHndlr={paginationHndlr}
                        />
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="Hostel-fee-reversal-export"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Hostel Fee Reversal Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="hostel"
                    subFeature="fee_reversal"
                    remarksText="Enter remarks to export hostel fee reversal data?"
                />
            </ModalContainerUpdated>
        {/* <ModalContainerUpdated
        id="print-receipt-modal"
        isOpen={printReceipt.showModal}
        toggle={()=>togglePrintReceiptModal()}
        modalTitle="Receipt Details"
        modalSize="lg"
      >
        <PreviewReceipt
          toggle={()=>togglePrintReceiptModal()}
          receiptId={printReceipt.receiptId}
        />
      </ModalContainerUpdated> */}

        </>
    );
};

export default HostelFeeReversal;
