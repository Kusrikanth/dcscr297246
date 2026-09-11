import React, { useEffect, useMemo, useRef, useState } from "react";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, RadioInputContainer, SelectInput, TextInput } from "../../../../Components/Common";
import { checkFitlersApplied, generateColumns, initialAdvncFilterState } from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { exportFeeFollowUpRemarksAct, exportFeeSummaryAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { toast } from "react-toastify";
import { useModal } from "../../../../hooks/modalhook";
import AdvanceFilter from "./AdvanceFilter";
import { feeReceivedReportAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { ConfirmExportUnpaidFee } from "./ConfirmExportUnpaidFee";
import Button from "../../../../Components/Common/Button";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";

export default function FeeReceivedDetails() {
    const dispatch = useDispatch();
    const { modalState: filterModalState, openModal: openFilterModalHndlr,
        closeModal: closeFilterModalHndlr } = useModal();
    const { modalState: duedateSmsModalState, closeModal: closeDuedateSmsModalHndlr,
        openModal: openDuedateSmsModalHndlr
    } = useModal();
    const { modalState: feeFollowUpRemarksModalState, closeModal: closeFeeFollowUpRemarksModalHndlr, openModal: openFeeFollowUpRemarksModalHndlr } = useModal();


    const [clearFilterState, setClearFilterState] = useState(false);
    const advanceFilterRef = useRef({ ...initialAdvncFilterState });
    const paginationDetailRef = useRef({
        pageNo: 0,
        pageSize: 10,
    });

    const [feeDetailState, setFeeDetailState] = useState({
        academicYearId: "",
        curriculumId: "",
        searchString: "",
    });

    const [exportExcel, setExportExcel] = useState<any>({
        showModal: false,
    })

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId, brchCurriculumResp,
        feeReceivedReportResp,
        exportFeeSummaryResp,
        exportFeeFollowUpRemarksResp,
        showApiLoader,
    }: any = useAppSelector(
        ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics, reports, appData, feeCollections }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            exportFeeSummaryResp: feeCollections.exportFeeSummaryResp,
            exportFeeFollowUpRemarksResp: feeCollections.exportFeeFollowUpRemarksResp,
            feeReceivedReportResp: reports.feeReceivedReportResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    const feeDetailsRespRef = useRef({
        prevFeeReceivedReportResp: feeReceivedReportResp,
        prevExportFeeSummaryResp: exportFeeSummaryResp,
        prevExportFeeFollowUpRemarksResp: exportFeeFollowUpRemarksResp,
    });

    useEffect(() => {
        const { prevFeeReceivedReportResp, prevExportFeeSummaryResp, prevExportFeeFollowUpRemarksResp } = feeDetailsRespRef.current;
        if (feeReceivedReportResp && prevFeeReceivedReportResp !== feeReceivedReportResp) {
            closeFilterModalHndlr();
        }
        else if (exportFeeSummaryResp && exportFeeSummaryResp !== prevExportFeeSummaryResp) {
            toast.success("Fee Summary Data Download Successfully.");
            toggleExportExcelModal();
            downloadExcelFile(exportFeeSummaryResp)
        }
        else if (exportFeeFollowUpRemarksResp && exportFeeFollowUpRemarksResp !== prevExportFeeFollowUpRemarksResp) {
            toast.success("Fee Follow Up Report Download Successfully.");
            closeFeeFollowUpRemarksModalHndlr();
            downloadExcelFile(exportFeeFollowUpRemarksResp)
        }
        feeDetailsRespRef.current.prevFeeReceivedReportResp = feeReceivedReportResp;
        feeDetailsRespRef.current.prevExportFeeSummaryResp = exportFeeSummaryResp;
        feeDetailsRespRef.current.prevExportFeeFollowUpRemarksResp = exportFeeFollowUpRemarksResp;

    }, [feeReceivedReportResp, exportFeeSummaryResp, exportFeeFollowUpRemarksResp]);

    function getFeeReceivedApiCall(otherProps: any) {
        const payload = { branchId, ...feeDetailState, ...advanceFilterRef.current, ...otherProps, ...paginationDetailRef.current };
        setClearFilterState(checkFitlersApplied(payload));
        dispatch(feeReceivedReportAct(generateActionPayload("fee_received_report", undefined, payload)));
    }

    function downloadExcelFile(blobStream: any) {
        const url = window.URL.createObjectURL(new Blob([(blobStream)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'fee_summary.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === 'CURRENT')?.academicYearId
        // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
        if (yearId) {
            getFeeReceivedApiCall({ academicYearId: yearId });
        }
        setFeeDetailState((prev: any) => ({ ...prev, academicYearId: yearId }))

    }, [academicYearListResp]);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        paginationDetailRef.current.pageNo = 0;
        setFeeDetailState((prev: any) => ({ ...prev, [name]: value }));
        if (name === "academicYearId" && !value) {
            return;
        }
        getFeeReceivedApiCall({ [name]: value });
    }

    const exportExcelHndler = () => {
        const payload = { branchId, instituteId, ...feeDetailState, ...advanceFilterRef.current, orderBy: "asc", sortBy: "name" };
        dispatch(exportFeeSummaryAct(generateActionPayload("export_fee_summary_list", undefined, payload, {
            responseType: 'blob'
        })));
    }

    const toggleExportExcelModal = () => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
        }));
    };

    function submitExportHndlr(otherProps?: any) {
        const payload = {
            ...feeDetailState,
            branchId,
        };
        dispatch(
            exportFeeFollowUpRemarksAct(
                generateActionPayload(
                    "export_fee_follow_up_remarks",
                    undefined,
                    payload,
                    {
                        responseType: "blob",
                    }
                )
            )
        );
    }

    function advanceFilterCallbckHndlr(appliedFitler: any) {
        const { curriculumId } = appliedFitler || {};
        paginationDetailRef.current.pageNo = 0;
        setFeeDetailState(prevState => ({ ...prevState, curriculumId }));
        advanceFilterRef.current = appliedFitler;
        getFeeReceivedApiCall(appliedFitler);
    }

    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        getFeeReceivedApiCall(paginationInfo);
    }

    function clearFilterHndlr() {
        paginationDetailRef.current.pageNo = 0;
        setFeeDetailState(prevState => ({ ...prevState, curriculumId: "", searchString: "" }));
        advanceFilterRef.current = initialAdvncFilterState;
        getFeeReceivedApiCall({
            academicYearId: feeDetailState.academicYearId,
            searchString: "",
            ...initialAdvncFilterState
        });
    }

    const { data: academicYearList } = academicYearListResp || {};
    const columns = useMemo(() => generateColumns(), []);
    const { content: feeReceivedReportData, number: pageNumber, totalPages, totalElements } = feeReceivedReportResp || {};
    return (
        <React.Fragment>
            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-3">
                <div className="tw-border-b tw-px-4 tw-py-3">
                    <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-0">
                        Fee Received Details
                    </h4>
                </div>

                <div className="tw-p-3 tw-pt-4">
                    <div className="tw-flex tw-flex-wrap tw-gap-3 tw-items-center">

                        <div className="tw-w-full sm:tw-w-1/2 lg:tw-w-1/4 xl:tw-w-1/5">
                            <div className="search-box tw-relative">
                                <TextInput
                                    name="searchString"
                                    value={feeDetailState.searchString}
                                    onChange={filterHandler}
                                    formgroupClassName="tw-mb-0"
                                    placeHolder="Search..."
                                />
                                <i className="ri-search-line tw-absolute tw-left-2 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-400"></i>
                            </div>
                        </div>

                        <div className="tw-w-full sm:tw-w-1/2 lg:tw-w-1/4 xl:tw-w-1/6">
                            <SelectInput
                                name="academicYearId"
                                value={feeDetailState.academicYearId}
                                onChange={filterHandler}
                                menuItems={academicYearList}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Academic Year"
                            />
                        </div>

                        <div className="tw-w-full sm:tw-w-1/2 lg:tw-w-1/4 xl:tw-w-1/6">
                            <SelectInput
                                name="curriculumId"
                                value={feeDetailState.curriculumId}
                                onChange={filterHandler}
                                menuItems={brchCurriculumResp?.data}
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Curriculum"
                            />
                        </div>

                        <div className="tw-ml-auto tw-flex tw-gap-2 tw-items-center">
                            {clearFilterState && (
                                <Button
                                    variant="wrong"
                                    type="button"
                                    onClick={clearFilterHndlr}
                                >
                                    Clear filter
                                </Button>
                            )}

                            <div
                                onClick={openFilterModalHndlr}
                                className="tw-bg-gray-100 tw-px-3 tw-py-2 tw-rounded tw-flex tw-items-center tw-cursor-pointer"
                            >
                                <FilterSvg height="18px" width="18px" />
                                <span className="tw-ml-2">Filters</span>
                            </div>

                            <UncontrolledDropdown direction="down">
                                <DropdownToggle tag="a" id="action-rowId" role="button">
                                    <Button
                                        type="button"
                                        disabled={showApiLoader}
                                        className="!tw-bg-[#405189] tw-text-white tw-px-3  tw-rounded tw-flex tw-items-center tw-border-none"
                                    >
                                        <span>Export</span>
                                        <i className="ri-arrow-drop-down-line tw-text-lg tw-ml-2"></i>
                                    </Button>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={toggleExportExcelModal}>
                                        Fee Summary Report
                                    </DropdownItem>
                                    <DropdownItem onClick={openDuedateSmsModalHndlr}>
                                        Unpaid Report
                                    </DropdownItem>
                                    <DropdownItem onClick={openFeeFollowUpRemarksModalHndlr}>
                                        Fee Follow-up Remarks
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </div>

                    <div className="tw-mt-3 tw-overflow-x-auto">
                        <TableContainer
                            columns={columns}
                            data={Array.isArray(feeReceivedReportData) ? feeReceivedReportData : []}
                            divClass="tw-w-full"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages}
                            totalRecords={totalElements}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageNumber}
                        />
                    </div>
                </div>
            </div>
            <OffCanvasContainer
                isOpen={filterModalState.showModal}
                headerTitle="Advance Filters"
                closeHndlr={closeFilterModalHndlr}
                id="feereceipt-advance-filter"
            >
                <AdvanceFilter
                    isOpen={filterModalState.showModal}
                    appliedFilters={advanceFilterRef.current}
                    branchId={branchId}
                    dispatch={dispatch}
                    academicYearId={feeDetailState.academicYearId}
                    curriculumId={feeDetailState.curriculumId}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleModal={closeFilterModalHndlr}
                />

            </OffCanvasContainer>

            <ConfirmationModal
                id="fee-summury-export-modal"
                isOpen={exportExcel.showModal}
                confirmMessage="Are you sure you want Download excel file ?"
                cancelHndlr={toggleExportExcelModal}
                confirmHndlr={exportExcelHndler}
                isDisble={showApiLoader}
                btnClassName='btn w-sm btn-success'
                showImgIcon={true}
                iconType="approve"
            />

            <ModalContainerUpdated
                id="sendsmsduepassed-modal"
                modalSize="md"
                hideHeader
                isOpen={duedateSmsModalState.showModal}
                toggle={closeDuedateSmsModalHndlr}
            >
                <ConfirmExportUnpaidFee
                    toggleModal={closeDuedateSmsModalHndlr}
                    academicYearId={feeDetailState.academicYearId}
                    branchId={branchId}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="fee-follow-up-remarks-modal"
                isOpen={feeFollowUpRemarksModalState.showModal}
                toggle={closeFeeFollowUpRemarksModalHndlr}
                modalTitle="Export Fee Follow-up Remarks"
                modalSize="md"
            >
                <ExportModal
                    isOpen={feeFollowUpRemarksModalState.showModal}
                    toggle={closeFeeFollowUpRemarksModalHndlr}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={submitExportHndlr}
                    feature="fee"
                    subFeature="follow_up_remarks"
                    remarksText="Enter remarks to export the Fee Follow up?"
                />
            </ModalContainerUpdated>
        </React.Fragment >

    )
}