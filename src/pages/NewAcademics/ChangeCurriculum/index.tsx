import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardBody, Col, Container, Row, CardHeader } from "reactstrap";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import {
  ChangeCurriculumFilterProps,
  ChangeCurriculumModalType,
  ConfirmationModalType,
} from "./ChangeCurriculumTypes";
import {
  generateColumns
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import ChangeCurriculumModal from "./ChangeCurriculumModal";
import ChangeCurriculumConfirmModal from "./ChangeCurriculumConfirmModal";
import ChangeCurriculumRejectModal from "./ChangeCurriculumRejectModal";
import ChangeCurriculumLedgerModal from "./ChangeCurriculumLedgerModal";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getChangeCurriculumList, resetLedgersOfDetainedOrPromotedAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IPaginationState } from "../../../Components/Common/Pagination";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle03StrokeStandard, Notebook01Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";

const initialValues: ChangeCurriculumFilterProps = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  branchClassId: "",
};

const ChangeCurriculum = () => {
  const dispatch = useDispatch();
  const [changeCurriculumFilterState, setChangeCurriculumFilterState] =
    useState<ChangeCurriculumFilterProps>(initialValues);
  const [actionName, setActionName] = useState('');
  const [filterState, setFilterState] = useState({
    pageNo: 0,
    pageSize: 10,
    orderBy: "asc",
    sortBy: "createdAt"
  })
  const [changeCurriculumModalState, setChangeCurriculumModalState] =
    useState<ChangeCurriculumModalType>({
      showModal: false,
      // branchId: "",
    });

  const [
    changeCurriculumConfirmModalState,
    setChangeCurriculumConfirmModalState,
  ] = useState<ConfirmationModalType>({
    showModal: false,
    requestId: undefined
  });
  const [
    changeCurriculumRejectModalState,
    setChangeCurriculumRejectModalState,
  ] = useState<ConfirmationModalType>({
    showModal: false,
    requestId: undefined
  });
  const [
    changeCurriculumLedgerModalState,
    setChangeCurriculumLedgerModalState,
  ] = useState<any>({
    showModal: false,
    // requestId:undefined,
    modalData: undefined
  });

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    getChangeCurriculumReqResp,
    setChangeCurriculumReq,
    approveRejectCurriculumReqResp,
    classroomManagmentErrorResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId
  } = useAppSelector(
    ({ classroomManagmentInfo, instAcademics, branchAcademics, appData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      getChangeCurriculumReqResp: classroomManagmentInfo.getChangeCurriculumReqResp,
      setChangeCurriculumReq: classroomManagmentInfo.setChangeCurriculumReq,
      approveRejectCurriculumReqResp: classroomManagmentInfo.approveRejectCurriculumReqResp,
      classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
    }),
    shallowEqual
  );

  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: changeCurriculumFilterState?.academicYearId, curriculumId: changeCurriculumFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: changeCurriculumFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const filterHandler = (event: any) => {
    // ChangeCurriculumFilterForm.handleChange(event);
    const { name, value } = event.target;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value })
      setChangeCurriculumFilterState((prev: any) => ({ ...prev, [name]: value, curriculumId: "", branchClassId: "" }))
    }
    else if (name === "curriculumId") {
      getClassApiCall({ curriculumId: value })
      ChangeCurriculumList({ curriculumId: value })
      setChangeCurriculumFilterState((prev: any) => ({ ...prev, [name]: value, branchClassId: "" }))
    }
    else {
      setChangeCurriculumFilterState((prev: any) => ({ ...prev, [name]: value }))
      ChangeCurriculumList({ [name]: value })
    }
  }

  const ChangeCurriculumList = (otherProps?: any) => {
    const params = { academicYearId: changeCurriculumFilterState.academicYearId, curriculumId: changeCurriculumFilterState.curriculumId, branchClassId: changeCurriculumFilterState.branchClassId, searchString: changeCurriculumFilterState.searchString, ...filterState, ...otherProps }
    if (params.academicYearId && params.curriculumId) {
      dispatch(getChangeCurriculumList(generateActionPayload('get_change_curriculum_req', undefined, params)))
    }
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    setFilterState((prev: any) => ({ ...prev, ...paginationInfo }))
    ChangeCurriculumList(paginationInfo);
  }
  const toggleChangeCurriculumModal = (apiCall?: any) => {
    setChangeCurriculumModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
    if (typeof (apiCall) === "boolean" && apiCall) {
      ChangeCurriculumList();
    }
  };

  const toggleChangeCurriculumConfirmModal = (requestId?: any, apiCall?: any) => {
    setChangeCurriculumConfirmModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
      requestId: requestId
    }));

    if (typeof (apiCall) && apiCall) {
      ChangeCurriculumList();
    }
  };
  const toggleChangeCurriculumRejectModal = (requestId?: any, apiCall?: any) => {
    setChangeCurriculumRejectModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
      requestId: requestId
    }));

    if (typeof (apiCall) && apiCall) {
      ChangeCurriculumList();
    }
  };
  const toggleChangeCurriculumLedgerModal = (id?: any) => {
    if (getChangeCurriculumReqResp?.data) {
      const data = getChangeCurriculumReqResp?.data.find((stream: any) => +stream.curriculumChangeDetailsId === +id);
      setChangeCurriculumLedgerModalState((prevState: any) => ({
        ...prevState,
        showModal: !prevState.showModal,
        modalData: data
      }));
    }

  };

  const menuOptions = useMemo(() => [
    {
      id: "view-ledger",
      actionIcon: <HugeiconsIcon icon={Notebook01Icon} className="me-2 text-muted" size={18} />,
      actionName: "View Ledger",
      onClickHndlr: (event: any) => {
        const id = event.currentTarget.getAttribute("data-id").split(',')[0];
        toggleChangeCurriculumLedgerModal(id);
      },
    },
    {
      id: "approve",
      actionIcon: <HugeiconsIcon icon={CheckmarkCircle03StrokeStandard} className="me-2 text-success" size={18} />,
      actionName: "Approve",
      onClickHndlr: (event: any) => {
        const id = event.currentTarget.getAttribute("data-id").split(',')[0];
        setActionName('Approve');
        toggleChangeCurriculumConfirmModal(id);
      },
    },
    {
      id: "reject",
      actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="me-2 text-danger" size={18} />,
      actionName: "Reject",
      onClickHndlr: (event: any) => {
        const id = event.currentTarget.getAttribute("data-id").split(',')[0];
        setActionName('Reject');
        toggleChangeCurriculumRejectModal(id)
      },
    },
  ], [getChangeCurriculumReqResp]);

  useEffect(() => {
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, [])

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
    setChangeCurriculumFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    // ChangeCurriculumList({academicYearId:yearId})
    getCurriculumApiCall({ academicYearId: yearId })
  }, [academicYearListResp])

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    if (Array.isArray(data) && data.length > 0) {
      getClassApiCall({ curriculumId: data[0].branchCurriculumId })
      setChangeCurriculumFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId, branchClassId: "" }))
      ChangeCurriculumList({ curriculumId: data[0].branchCurriculumId })
    }
  }, [brchCurriculumResp])

  const ChangeCurriculumRef = useRef({
    prevSetChangeCurriculumReq: setChangeCurriculumReq,
    prevApproveRejectCurriculumReqResp: approveRejectCurriculumReqResp,
    prevClassroomManagmentErrorResp: classroomManagmentErrorResp
  })

  useEffect(() => {
    const { prevClassroomManagmentErrorResp, prevSetChangeCurriculumReq, prevApproveRejectCurriculumReqResp } = ChangeCurriculumRef.current;
    if (setChangeCurriculumReq && prevSetChangeCurriculumReq !== setChangeCurriculumReq) {
      toast.success('Change Curriculum Request Raised Successfully.');
      toggleChangeCurriculumModal(true);
    }
    else if (approveRejectCurriculumReqResp && prevApproveRejectCurriculumReqResp !== approveRejectCurriculumReqResp) {
      toast.success(`Change Curriculum Request ${actionName}  Successfully.`);
      actionName === "Approve" ? toggleChangeCurriculumConfirmModal(undefined, true) : toggleChangeCurriculumRejectModal(undefined, true);
    }
    else if (classroomManagmentErrorResp && prevClassroomManagmentErrorResp !== classroomManagmentErrorResp) {
      const { details } = classroomManagmentErrorResp;
      toast.error(details);
      dispatch(resetLedgersOfDetainedOrPromotedAct(undefined));
    }
    ChangeCurriculumRef.current.prevApproveRejectCurriculumReqResp = approveRejectCurriculumReqResp;
    ChangeCurriculumRef.current.prevSetChangeCurriculumReq = setChangeCurriculumReq;
    ChangeCurriculumRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;

  }, [setChangeCurriculumReq, classroomManagmentErrorResp, approveRejectCurriculumReqResp])

  const roleColumns = useMemo(() => generateColumns(menuOptions), [getChangeCurriculumReqResp]);

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};
  const { data: ChangeCurriculumReqList, pageNumber, totalPages, totalElements } = getChangeCurriculumReqResp || {};

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Change Curriculum" pageTitle="Admissions" />

          <Card>
            <CardHeader>
              <div className="tw-flex tw-flex-col lg:tw-flex-row tw-items-center">
                <div className="tw-w-full lg:tw-w-1/3">
                  <h4 className="card-title !tw-mb-0 tw-flex-grow tw-justify-center">
                    Change Curriculum
                  </h4>
                </div>
                <div className="tw-w-auto tw-ml-auto">
                  <Button
                  variant="primary"
                    onClick={toggleChangeCurriculumModal}
                  >
                    <i className="ri-add-line tw-mr-2" />
                    Add Request
                  </Button>
                </div>
              </div>
            </CardHeader>

            <div className="tw-p-0">
              <div className="tw-py-3 tw-px-3">
                {/* <form onSubmit={ChangeCurriculumFilterForm.handleSubmit}> */}
                <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                  <div className="lg:tw-col-span-2 xl:tw-col-span-2">
                    <div className="search-box tw-relative">
                      <TextInput
                        name="searchString"
                        value={changeCurriculumFilterState.searchString}
                        onChange={filterHandler}
                        // inputClassName="bg-light"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                        labelText="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-text-gray-400"></i>
                    </div>
                  </div>
                  <div className="lg:tw-col-span-2 xl:tw-col-span-2">
                    <SelectInput
                      name="academicYearId"
                      value={changeCurriculumFilterState.academicYearId}
                      onChange={filterHandler}
                      menuItems={academicYearList}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      // inputClassName="bg-light"
                      // isDisabled={true}
                      labelText="Academic Year"
                      floatingLabel
                      formgroupClassName="tw-mb-0"
                    />
                  </div>

                  <div className="lg:tw-col-span-2 xl:tw-col-span-2">
                    <SelectInput
                      name="curriculumId"
                      value={changeCurriculumFilterState.curriculumId}
                      onChange={filterHandler}
                      menuItems={curriculumTypes}
                      valueKey="branchCurriculumId"
                      textKey="curriculumName"
                      // inputClassName="bg-light"
                      labelText="Curriculum"
                      floatingLabel
                      formgroupClassName="tw-mb-0"
                    />
                  </div>

                  <div className="lg:tw-col-span-1 xl:tw-col-span-1">
                    <SelectInput
                      name="branchClassId"
                      value={changeCurriculumFilterState.branchClassId}
                      onChange={filterHandler}
                      menuItems={classTypes}
                      valueKey="id"
                      textKey="shortName"
                      // inputClassName="bg-light"
                      labelText="Class"
                      floatingLabel
                      formgroupClassName="tw-mb-0"
                    />
                  </div>

                  {/* <div className="tw-w-auto tw-ml-auto">
              <button
                className="tw-btn tw-bg-blue-600 tw-text-white tw-float-right tw-flex tw-items-center tw-px-4 tw-py-2 tw-rounded hover:tw-bg-blue-700"
                onClick={() => { }}
              >
                <i className="ri-equalizer-fill tw-mr-2" />
                Apply Fillter
              </button>
            </div> */}
                </div>
                {/* </form> */}
              </div>

              <TableContainer
                columns={roleColumns || []}
                data={ChangeCurriculumReqList || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                // showCheckbox={true}
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
              />
            </div>
          </Card>
        </Container>
      </div>

      <ModalContainerUpdated
        id="change-curriculum-modal"
        isOpen={changeCurriculumModalState.showModal}
        toggle={toggleChangeCurriculumModal}
        modalTitle="Change Curriculum"
        modalSize="md"
      >

        <ChangeCurriculumModal
          isOpen={changeCurriculumModalState.showModal}
          toggle={toggleChangeCurriculumModal}
          modalTitle="Change Curriculum"
          instituteId={instituteId}
          instituteName={"Change Curriculum"}
          branchId={branchId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="change-curriculum-confirm-modal"
        isOpen={changeCurriculumConfirmModalState.showModal}
        toggle={toggleChangeCurriculumConfirmModal}
        modalTitle="Change Campus"
        modalSize="md"
        hideHeader={true}
      >
        <ChangeCurriculumConfirmModal
          isOpen={changeCurriculumConfirmModalState.showModal}
          toggle={toggleChangeCurriculumConfirmModal}
          modalTitle=""
          instituteId={instituteId}
          instituteName={""}
          requestId={changeCurriculumConfirmModalState.requestId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="change-curriculum-reject-modal"
        isOpen={changeCurriculumRejectModalState.showModal}
        toggle={toggleChangeCurriculumRejectModal}
        modalTitle="Change Campus"
        modalSize="md"
        hideHeader={true}
      >
        <ChangeCurriculumRejectModal
          isOpen={changeCurriculumRejectModalState.showModal}
          toggle={toggleChangeCurriculumRejectModal}
          modalTitle=""
          instituteId={instituteId}
          instituteName={""}
          requestId={changeCurriculumRejectModalState.requestId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="change-curriculum-ledger-modal"
        isOpen={changeCurriculumLedgerModalState.showModal}
        toggle={toggleChangeCurriculumLedgerModal}
        modalTitle="Fee Ledgers"
        modalSize="xl"
      >
        <ChangeCurriculumLedgerModal
          isOpen={changeCurriculumLedgerModalState.showModal}
          toggle={toggleChangeCurriculumLedgerModal}
          modalTitle=""
          instituteId={instituteId}
          instituteName={""}
          // requestId={changeCurriculumLedgerModalState.requestId}
          academicYearId={changeCurriculumFilterState.academicYearId}
          requestDetails={changeCurriculumLedgerModalState.modalData}
        />
      </ModalContainerUpdated>
      {/* <ToastContainer/> */}
    </>
  );
};

export default ChangeCurriculum;
