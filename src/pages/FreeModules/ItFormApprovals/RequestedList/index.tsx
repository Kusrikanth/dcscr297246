
import { shallowEqual } from "react-redux";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  generateColumns,
} from "./helper";
import ItFromApprovalRejectModals from "../ItFromApprovalRejectModals";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
  getBranchClassAct,
  getBranchCurriculumAct,
  resetBrchClassAct,
  resetBrchCurriculumAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getRequestItFormActList } from "../../../../store/fee/feeapprovals/feeapprovalactions";
import { toast } from "react-toastify";
import ViewStudentLedgers from "./ViewStudentLedgers";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle03StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../../hooks/modalhook";
import EditRequestModal from "./EditRequestModal";
const RequestedList = (props: any) => {
  const [filterState, setFilterState] = useState({
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    approvedStatus: "PENDING",
    classId: ""
  });

  const [itFormApprovalRejectModalState, setItFormApprovalRejectModalState] =
    useState<any>({
      showModal: false,
      actionName: "",
      itFormId: undefined
    });
  const [downloadITFormModalState, setDownloadITFormModalState] =
    useState<any>({
      showModal: false,
      itFormId: undefined
    });
  const [viewStudentLedger, setViewStudentLedger] =
    useState<any>({
      showModal: false,
      ledgerId: undefined
    });
  const { closeModal: closeEditIssuedModal, modalState: editIssuedModalState, openModal: openEditIssuedModalHndlr } = useModal();
  

  const dispatch = useAppDispatch();
  const {
    branchClassResp,
    academicYearListResp,
    brchCurriculumResp,
    requestITFormListResp,
    addRequestItFormResp,
    approveRejectItFormResp,
    feeApprovalsErrorResp,
    currentBranchIdResp: branchId,
    updateItFormResp
  } =
    useAppSelector(({ appData, directoryStudent, branchAcademics, feeCollections, feeApprovals,
      instAcademics }) => ({
        branchClassResp: branchAcademics.branchClassResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        requestITFormListResp: feeApprovals.requestITFormListResp,
        addRequestItFormResp: feeApprovals.addRequestItFormResp,
        approveRejectItFormResp: feeApprovals.approveRejectItFormResp,
        feeApprovalsErrorResp: feeApprovals.feeApprovalsErrorResp,
        academicYearListResp: instAcademics.academicYearListResp,
        updateItFormResp: feeApprovals.updateItFormResp,
        currentBranchIdResp: appData.currentBranchIdResp,

      }), shallowEqual);


  const requestListRespRef = useRef<any>({
    prevAcademicYearListResp: academicYearListResp,
    prevAddRequestItFormResp: addRequestItFormResp,
    prevApproveRejectItFormResp: approveRejectItFormResp,
    prevFeeApprovalsErrorResp: feeApprovalsErrorResp,
    prevUpdateItFormResp: updateItFormResp
  });

  useEffect(() => {
    const { prevApproveRejectItFormResp, prevAddRequestItFormResp, prevFeeApprovalsErrorResp, prevUpdateItFormResp } = requestListRespRef.current;
    if (approveRejectItFormResp && approveRejectItFormResp !== prevApproveRejectItFormResp) {
      const { message } = approveRejectItFormResp || {};
      toast.success(message)
      toggleApproveRejectModal(undefined, undefined, true);
    }
    else if (addRequestItFormResp && prevAddRequestItFormResp !== addRequestItFormResp) {
      toast.success('IT Form Request Submitted Successfully.');
      props.toggleAddRequestModal();
      getItFormRequestApiCall();
    }
    else if (feeApprovalsErrorResp && prevFeeApprovalsErrorResp !== feeApprovalsErrorResp) {
      const errorMsg =
        feeApprovalsErrorResp?.details ||
        feeApprovalsErrorResp?.ERROR ||
        feeApprovalsErrorResp?.message ||
        "Something went wrong";
      toast.error(errorMsg);
    }
     else if (updateItFormResp && updateItFormResp !== prevUpdateItFormResp) {
          toast.success("Updated Successfully");
          closeEditIssuedModal();
          getItFormRequestApiCall();
        }

    requestListRespRef.current.prevAddRequestItFormResp = addRequestItFormResp;
    requestListRespRef.current.prevApproveRejectItFormResp = approveRejectItFormResp;
    requestListRespRef.current.prevFeeApprovalsErrorResp = feeApprovalsErrorResp;
    requestListRespRef.current.prevUpdateItFormResp = updateItFormResp;
  }, [addRequestItFormResp, approveRejectItFormResp, feeApprovalsErrorResp, updateItFormResp])

  useEffect(() => {
    if (academicYearListResp) {
      const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
      setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
      getItFormRequestApiCall({ academicYearId: academicYearId });
      props.setCurrentAcademicYearId(academicYearId);
      const payload = {
        branchId,
        academicYearId,
        sortBy: "curriculumName",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
    }
  }, [])

  const paginationDetailRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });

  const toggleApproveRejectModal = (actionName?: any, itFormId?: any, apiCall?: any) => {
    setItFormApprovalRejectModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      actionName: actionName,
      itFormId: itFormId
    }));
    if (typeof (apiCall) === "boolean" && apiCall) {
      getItFormRequestApiCall();
    }
  };
  const toggleDownloadITFormModal = (itFormId?: any) => {
    setDownloadITFormModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      itFormId: itFormId
    }));
  };
  const toggleViewStudentLedgerModal = (ledgerId?: any) => {
    setViewStudentLedger((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      ledgerId: typeof (ledgerId) === "string" ? ledgerId : undefined
    }));
  };

  const menuOptions = useMemo(
    () => [
      {
        id: "approve",
        actionIcon: <HugeiconsIcon icon={CheckmarkCircle03StrokeStandard} className="text-success" size={18} />,
        actionName: "Approve",
        onClickHndlr: (event: any) => {
          let itFormId = event.currentTarget.getAttribute('data-id');
          toggleApproveRejectModal("APPROVED", itFormId);
        },
      },
      {
        id: "reject",
        actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="text-danger" size={18} />,
        actionName: "Reject",
        onClickHndlr: (event: any) => {
          let itFormId = event.currentTarget.getAttribute('data-id');
          toggleApproveRejectModal("REJECTED", itFormId);
        },
      },
      {
        id: 'edit',
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          let id = event.currentTarget.getAttribute('data-id');
          openEditIssuedModalHndlr(id);
        }
      }
    ],
    []
  );

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    let filterData = { ...filterState, [name]: value };
    if (filterData.academicYearId) {
      if (name === "academicYearId") {
        dispatch(resetBrchClassAct(undefined));
        setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "", curriculumId: "" }));
        getItFormRequestApiCall({ [name]: value, classId: "", curriculumId: "" });
        props.setCurrentAcademicYearId(value);
        if (value) {
          const payload = { branchId, academicYearId: value, sortBy: "curriculumName", orderBy: "asc", pageNo: 0, pageSize: 100, };
          dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
        } else {
          dispatch(resetBrchCurriculumAct(undefined));
          dispatch(resetBrchClassAct(undefined));
        }
      }
      else if (name === "curriculumId") {
        dispatch(resetBrchClassAct(undefined));
        setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
        if (value) {
          getClassApiCall(value);
        }
        getItFormRequestApiCall({ [name]: value, classId: "" });
      }
      else {
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getItFormRequestApiCall({ [name]: value });
      }
    }
  }
  function getClassApiCall(curriculumId: string) {
    // sortBy: "className", orderBy: "asc"
    const payload = { academicYearId: filterState.academicYearId, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId: props.branchId };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getItFormRequestApiCall(paginationInfo);
  }


  function getItFormRequestApiCall(otherProps?: any) {
    const payload = { branchId, ...filterState, ...otherProps, ...paginationDetailRef.current };
    dispatch(getRequestItFormActList(generateActionPayload("get_itform", undefined, payload)));
  }

  const roleColumns = useMemo(() => generateColumns(menuOptions, toggleViewStudentLedgerModal), []);

  const { content: itFormList, pageNumber, totalPages, totalElements } = requestITFormListResp || {};
  return (
    <React.Fragment>
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pt-1 tw-pb-3">

        <div className="md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
          <div className="search-box">
            <TextInput
              name="searchString"
              value={filterState.searchString}
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
            value={filterState.academicYearId}
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
            value={filterState.curriculumId}
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
            value={filterState.classId}
            onChange={onChangeFilterHndlr}
            menuItems={branchClassResp?.content || []}
            valueKey="id"
            textKey="shortName"
            formgroupClassName="tw-mb-0"
            labelText="Class"
            floatingLabel
          />
        </div>

      </div>

      <TableContainer
        columns={roleColumns || []}
        data={itFormList || []}
         divClass="tw-overflow-x-auto tw-mb-3"
        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
        // showCheckbox={true}
        showPagination={true}
        totalPages={totalPages}
        totalRecords={totalElements}
        callbackPaginationHndlr={paginationHndlr}
        currentPageNumber={pageNumber}
      />
      <ModalContainerUpdated
        id="it-form-approvals-modal"
        isOpen={itFormApprovalRejectModalState.showModal}
        toggle={toggleApproveRejectModal}
        modalSize="md"
        hideHeader={true}
      >

        <ItFromApprovalRejectModals
          isOpen={itFormApprovalRejectModalState.showModal}
          toggle={() => toggleApproveRejectModal()}
          modalTitle=""
          instituteId={"1"}
          instituteName={"Higher Class Eligibility"}
          branchId={branchId}
          editBranchDetails={""}
          modalText={`Do you want to ${itFormApprovalRejectModalState.actionName == "APPROVED" ? "Approve" : "Reject"} the IT Form Request !`}
          submitText={`Yes ${itFormApprovalRejectModalState.actionName == "APPROVED" ? "Approve" : "Reject"}`}
          actionName={itFormApprovalRejectModalState.actionName}
          itFormId={itFormApprovalRejectModalState.itFormId}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="download-it-form-approvals-modal"
        isOpen={downloadITFormModalState.showModal}
        toggle={toggleDownloadITFormModal}
        modalSize="md"
        hideHeader={true}
      >
        <ItFromApprovalRejectModals
          isOpen={downloadITFormModalState.showModal}
          toggle={toggleDownloadITFormModal}
          modalTitle=""
          instituteId={"1"}
          instituteName={"Higher Class Eligibility"}
          branchId={branchId}
          editBranchDetails={""}
          modalText={`Do you want to Download IT Form Request !`}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="student-ledgers-modal"
        isOpen={viewStudentLedger.showModal}
        toggle={toggleViewStudentLedgerModal}
        modalSize="md"
        modalTitle="Student Ledgers"
      >

        <ViewStudentLedgers
          isOpen={viewStudentLedger.showModal}
          toggle={toggleViewStudentLedgerModal}
          modalTitle="Student Ledgers"
          instituteId={"1"}
          instituteName={"Higher Class Eligibility"}
          branchId={branchId}
          editBranchDetails={""}
          ledgerId={viewStudentLedger.ledgerId}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="confirmation-modal"
        modalSize="md"
        // headerClassName="bg-white"
        isOpen={editIssuedModalState.showModal}
        toggle={closeEditIssuedModal}
        hideHeader={true}
      >
        <EditRequestModal
          toggle={closeEditIssuedModal}
          branchId={branchId}
          instituteId={""}
          isOpen={editIssuedModalState.showModal}
          modalTitle="Edit Issued Request"
          id={editIssuedModalState.modalData}
        />
      </ModalContainerUpdated>
    </React.Fragment>
  );
};

export default RequestedList;
