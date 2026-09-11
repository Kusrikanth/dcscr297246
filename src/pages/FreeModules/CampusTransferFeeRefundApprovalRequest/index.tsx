import { useEffect, useMemo, useRef } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { approvedStatusOptions, generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle03StrokeStandard, Notebook01Icon } from "@hugeicons-pro/core-stroke-standard";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import { resetBrchClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsslice";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getCampusTransferStudentRefundAmountAct, resetSaveProcessStudentRefundAmountAct } from "../../../store/fee/feecollections/feecollectionactions";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useModal } from "../../../hooks/modalhook";
import CampusTransferFeeRefundApprovalRequestModal from "./CampusTransferFeeRefundApprovalRequestModal";
import ViewLedgerModal from "./ViewLedgerModal";
import { toast } from "react-toastify";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  approvedStatus: "",
  classId: ""
};

const CampusTransferFeeRefundApprovalRequest = () => {

  const dispatch = useAppDispatch();
  const { modalState: apprRejModalState, closeModal: closeApprRejModalHndlr, openModal: openApprRejModalHndlr } = useModal();
  const { modalState: viewLedgerModalState, closeModal: closeViewLedgerModalHndlr, openModal: openViewLedgerModalHndlr } = useModal();

  const paginationDetailRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    currentBranchIdResp: branchId,
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    getCampusTransferStudentRefundAmountResp, saveProcessStudentRefundAmountResp, feeCollectionErrorResp, showApiLoader
  } =
    useAppSelector(({ branchAcademics, instAcademics, globalData, feeCollections, appData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      getCampusTransferStudentRefundAmountResp: feeCollections.getCampusTransferStudentRefundAmountResp,
      saveProcessStudentRefundAmountResp: feeCollections.saveProcessStudentRefundAmountResp,
      feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
      showApiLoader: globalData.showApiLoader
    }), shallowEqual);

  const feeDetailsRespRef = useRef<any>({
    prevSaveProcessStudentRefundAmountResp: saveProcessStudentRefundAmountResp,
    prevFeeCollectionErrorResp: feeCollectionErrorResp,
  });
  
  const lastActionRef = useRef<string | null>(null);

  useEffect(() => {
    const { prevSaveProcessStudentRefundAmountResp, prevFeeCollectionErrorResp } = feeDetailsRespRef.current;
    if (saveProcessStudentRefundAmountResp && saveProcessStudentRefundAmountResp !== prevSaveProcessStudentRefundAmountResp) {
      let message = "Processed successfully";
      if (lastActionRef.current === "REJECTED") {
        message = "Rejected successfully";
      } else if (lastActionRef.current === "APPROVED") {
        message = "Approved successfully";
      }
      toast.success(message);
      lastActionRef.current = null;
      if (viewLedgerModalState.showModal) {
        closeViewLedgerModalHndlr();
      }
      if (apprRejModalState.showModal) {
        closeApprRejModalHndlr();
      }
      fetchCampusTransferRequests();
      dispatch(resetSaveProcessStudentRefundAmountAct(undefined));
    }
    else if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
      const { message }: any = feeCollectionErrorResp;
      toast.error(message || "Something went wrong.");
    }
    feeDetailsRespRef.current.prevSaveProcessStudentRefundAmountResp = saveProcessStudentRefundAmountResp;
    feeDetailsRespRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
  }, [saveProcessStudentRefundAmountResp, feeCollectionErrorResp]);

  const changeCampusFeeRefundApprovalRequest = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => { },
  });

  function fetchCampusTransferRequests(otherProps?: any) {
    const formValues = changeCampusFeeRefundApprovalRequest.values;
    const payload = {
      branchId,
      searchString: formValues.searchString,
      academicYearId: formValues.academicYearId,
      curriculumId: formValues.curriculumId,
      approvedStatus: formValues.approvedStatus,
      classId: formValues.classId,
      ...paginationDetailRef.current,
      ...otherProps,
    };
    dispatch(getCampusTransferStudentRefundAmountAct(generateActionPayload("get_campus_transfer_student_refund_amount", undefined, payload)));
  }

  const getCurriculumApiCall = (academicYearId?: string) => {
    const curriculumParams = {
      academicYearId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      orderBy: "asc",
    };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, curriculumParams)));
  };

  function getClassApiCall(curriculumId: string) {
    const payload = { branchId, academicYearId: changeCampusFeeRefundApprovalRequest.values.academicYearId, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  useEffect(() => {
    if (Array.isArray(academicYearListResp?.data)) {
      const currentYear = academicYearListResp.data.find(
        (year: any) => year.yearStatus === "CURRENT"
      );
      if (currentYear?.academicYearId) {
        const academicYearId = currentYear.academicYearId;
        changeCampusFeeRefundApprovalRequest.setFieldValue(
          "academicYearId",
          academicYearId
        );
        getCurriculumApiCall(academicYearId);
        fetchCampusTransferRequests({ academicYearId });
      }
    }
  }, [academicYearListResp]);

  const menuOptions = useMemo(
    () => [
      {
        id: "approve",
        actionName: "Approve",
        actionIcon: (
          <HugeiconsIcon
            icon={CheckmarkCircle03StrokeStandard}
            className="text-success"
            size={18}
          />
        ),
        onClickHndlr: (event: any) => {
          const id = Number(event.currentTarget.getAttribute("data-id"));
          openApprRejModalHndlr({ id, modalType: "APPROVED" });
        },
      },
      {
        id: "reject",
        actionName: "Reject",
        actionIcon: (
          <HugeiconsIcon
            icon={CancelCircleIcon}
            className="text-danger"
            size={18}
          />
        ),
        onClickHndlr: (event: any) => {
          const id = Number(event.currentTarget.getAttribute("data-id"));
          openApprRejModalHndlr({ id, modalType: "REJECTED" });
        },
      },
      {
        id: "viewLedger",
        actionIcon: (
          <HugeiconsIcon
            icon={Notebook01Icon}
            className="me-2 text-muted"
            size={18}
          />
        ),
        actionName: "View Ledger",
        onClickHndlr: (event: any) => {
          const id = Number(event.currentTarget.getAttribute("data-id"));
          const selectedRow =
            getCampusTransferStudentRefundAmountResp?.data?.find(
              (item: any) => item.id === id
            );
          openViewLedgerModalHndlr(selectedRow);
        },
      }
    ],
    [getCampusTransferStudentRefundAmountResp]
  );

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    changeCampusFeeRefundApprovalRequest.setFieldValue(name, value);
    let filterData = { ...changeCampusFeeRefundApprovalRequest.values, [name]: value };

    if (filterData.academicYearId) {
      if (name === "academicYearId") {
        dispatch(resetBrchClassAct(undefined));
        changeCampusFeeRefundApprovalRequest.setFieldValue("curriculumId", "");
        changeCampusFeeRefundApprovalRequest.setFieldValue("classId", "");
        fetchCampusTransferRequests({
          academicYearId: value,
          curriculumId: "",
          classId: "",
        });
        getCurriculumApiCall(value);
      }
      else if (name === "curriculumId") {
        dispatch(resetBrchClassAct(undefined));
        changeCampusFeeRefundApprovalRequest.setFieldValue("classId", "");
        if (value) {
          getClassApiCall(value);
        }
        fetchCampusTransferRequests({
          curriculumId: value,
          classId: "",
        });
      }
      else {
        fetchCampusTransferRequests({ [name]: value });
      }
    }
  }

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    fetchCampusTransferRequests(paginationInfo);
  }
  const roleColumns = useMemo(() => generateColumns(menuOptions), [menuOptions, getCampusTransferStudentRefundAmountResp]),
    { pageNumber, totalPages, totalElements } = getCampusTransferStudentRefundAmountResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Fee" pageTitle="Fee" />
          <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-flex-1">
                  Campus Transfer Fee Refund Approval Request
                </h4>
                <div className="tw-flex">
                </div>
              </div>
            </div>
            <div className="tw-p-0">
              <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-4 tw-pt-4">
                <div className="md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      value={changeCampusFeeRefundApprovalRequest.values.searchString}
                      onChange={onChangeFilterHndlr}
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search"
                      labelText="Search"
                      floatingLabel
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={changeCampusFeeRefundApprovalRequest.values.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearListResp?.data || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-0"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>
                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="curriculumId"
                    value={changeCampusFeeRefundApprovalRequest.values.curriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={brchCurriculumResp?.data || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="tw-mb-0"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>
                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2 2xl:tw-col-span-1">
                  <SelectInput
                    name="classId"
                    value={changeCampusFeeRefundApprovalRequest.values.classId}
                    onChange={onChangeFilterHndlr}
                    menuItems={branchClassResp?.content || []}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="tw-mb-0"
                    labelText="Class"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2 2xl:tw-col-span-2">
                  <SelectInput
                    name="approvedStatus"
                    value={changeCampusFeeRefundApprovalRequest.values.approvedStatus}
                    onChange={onChangeFilterHndlr}
                    menuItems={approvedStatusOptions || []}
                    valueKey="id"
                    textKey="name"
                    formgroupClassName="tw-mb-0"
                    labelText="Status"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 tw-flex tw-justify-end">
                  {/* <!-- {showClearFilterState && (
                    <Button
                      variant="wrong"
                      type="button"
                      className="tw-px-2 tw-py-1"
                      onClick={clearFilterHndlr}
                    >
                      Clear filter
                    </Button>
                  )} --> */}
                </div>
              </div>
              <TableContainer
                columns={roleColumns || []}
                data={Array.isArray(getCampusTransferStudentRefundAmountResp?.data) ? getCampusTransferStudentRefundAmountResp?.data : []}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="change-campus-confirm-modal"
        isOpen={apprRejModalState.showModal}
        toggle={closeApprRejModalHndlr}
        modalTitle="Change Campus"
        modalSize="md"
        hideHeader={true}
      >
        <CampusTransferFeeRefundApprovalRequestModal
          modalData={apprRejModalState.modalData}
          isCurrentCampus={true}
          openViewLedgerModal={openViewLedgerModalHndlr}
          allRows={getCampusTransferStudentRefundAmountResp?.data || []}
          toggle={closeApprRejModalHndlr}
          onActionComplete={(status: string) => {
            lastActionRef.current = status;
          }}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="view-ledger-modal"
        isOpen={viewLedgerModalState.showModal}
        toggle={closeViewLedgerModalHndlr}
        modalTitle="View Ledger"
        modalSize="xl"
      >
        <ViewLedgerModal
          modalData={viewLedgerModalState.modalData}
          isCurrentCampus={true}
          allRows={getCampusTransferStudentRefundAmountResp?.data || []}
          toggle={closeViewLedgerModalHndlr}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default CampusTransferFeeRefundApprovalRequest;
