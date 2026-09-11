import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardBody, Col, Container, Row, CardHeader } from "reactstrap";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  ChangeConfirmationStreamModalType,
  ChangeStreamFilterhProps,
  ChangeStreamModalType,
} from "./changeStreamTypes";
import {
  generateColumns,
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import ChangeStreamModal from "./ChangeStreamModal";
import ChangeStreamConfirmModal from "./ChangeStreamConfirmModal";
import ChangeStreamRejectModal from "./ChangeStreamRejectModal";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getStreamChangeRequestList } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IPaginationState } from "../../../Components/Common/Pagination";
import ChangeStreamLedgerModal from "./ChangeStreamLedgerModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle03StrokeStandard, Notebook01Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";
const initialValues: ChangeStreamFilterhProps = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  branchClassId: "",
  pageNo: 0,
  pageSize: 10
};

const ChangeStream = () => {
  const dispatch = useDispatch();
  const [changeStreamFilterState, setChangeStreamFilterState] =
    useState<ChangeStreamFilterhProps>(initialValues);
  const [actionName, setActionName] = useState('')
  const [filterState, setFilterState] = useState({
    pageNo: 0,
    pageSize: 10,
    sortBy: "lastModifiedAt",
    orderBy: "asc"
  });

  const [changeStreamModalState, setChangeStreamModalState] =
    useState<ChangeStreamModalType>({
      showModal: false,
      branchId: "",
    });

  const [changeStreamConfirmModalState, setChangeStreamConfirmModalState] =
    useState<ChangeConfirmationStreamModalType>({
      showModal: false,
      requestId: "",
    });
  const [changeStreamRejectModalState, setChangeStreamRejectModalState] =
    useState<ChangeConfirmationStreamModalType>({
      showModal: false,
      requestId: "",
    });
  const [changeStreamLedgerModalState, setChangeStreamLedgerModalState] =
    useState<any>({
      showModal: false,
      studentId: "",
      modalData: undefined
    });


  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    streamChangeReqList,
    streamReqestResp,
    approveRejectStreamReqResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId
  } = useAppSelector(
    ({ classroomManagmentInfo, assignGroupInfo, instAcademics, branchAcademics, appData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      streamChangeReqList: classroomManagmentInfo.streamChangeReqList,
      streamReqestResp: classroomManagmentInfo.streamReqestResp,
      approveRejectStreamReqResp: classroomManagmentInfo.approveRejectStreamReqResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
    }),
    shallowEqual
  );

  const StreamListRespAct = (otherProps?: any) => {
    const params = {
      academicYearId: changeStreamFilterState.academicYearId,
      branchClassId: changeStreamFilterState.branchClassId,
      curriculumId: changeStreamFilterState.curriculumId,
      ...filterState,
      ...otherProps
    }
    if (params.academicYearId && params.curriculumId) {
      dispatch(getStreamChangeRequestList(generateActionPayload('get_stream_change_request_list', undefined, params)));
    }
  }
  const toggleChangeStreamModal = (apiCall?: any) => {
    setChangeStreamModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));

    if (typeof (apiCall) === "boolean" && apiCall) {
      StreamListRespAct();
    }
  };

  const toggleChangeStreamConfirmModal = (requestId?: any, apiCall?: any) => {
    setChangeStreamConfirmModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
      requestId: requestId
    }));

    if (typeof (apiCall) === "boolean" && apiCall) {
      StreamListRespAct();
    }
  };
  const toggleChangeStreamRejectModal = (requestId?: any, apiCall?: any) => {
    setChangeStreamRejectModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
      requestId: requestId
    }));

    if (typeof (apiCall) === "boolean" && apiCall) {
      StreamListRespAct();
    }
  };
  const toggleChangeStreamLedgerModal = (studentId?: any) => {


    if (streamChangeReqList?.data) {
      const data = streamChangeReqList?.data.find((stream: any) => +stream.studentId === +studentId)
      setChangeStreamLedgerModalState((prevState: any) => ({
        ...prevState,
        showModal: !prevState.showModal,
        studentId: studentId,
        modalData: data
      }));
    }
  };

  // const ChangeStreamFilterForm = useFormik({
  //   enableReinitialize: true,
  //   initialValues: changeStreamFilterState,
  //   onSubmit: (values) => {},
  // });

  const menuOptions = useMemo(
    () => [
      {
        id: "viewLedger",
        actionIcon: <HugeiconsIcon icon={Notebook01Icon} className="me-2 text-muted" size={18} />,
        actionName: "View Ledger",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id").split(',')[1];
          toggleChangeStreamLedgerModal(id);
        },
      },
      {
        id: "approve",
        actionIcon: <HugeiconsIcon icon={CheckmarkCircle03StrokeStandard} className="me-2 text-success" size={18} />,
        actionName: "Approve",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id").split(',')[0];
          setActionName('Approve')
          toggleChangeStreamConfirmModal(id);
        },
      },
      {
        id: "reject",
        actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="me-2 text-danger" size={18} />,
        actionName: "Reject",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id").split(','[0]);
          setActionName('Reject')
          toggleChangeStreamRejectModal(id);
        },
      },
    ],
    [streamChangeReqList]
  );
  useEffect(() => {
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, [])

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
    setChangeStreamFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    getCurriculumApiCall({ academicYearId: yearId })
  }, [academicYearListResp])

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    if (Array.isArray(data) && data.length > 0) {
      getClassApiCall({ curriculumId: data[0]?.branchCurriculumId })
      setChangeStreamFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
      StreamListRespAct({ curriculumId: data[0].branchCurriculumId })
    }
  }, [brchCurriculumResp])

  // useEffect(()=>{
  //   if(branchClassResp){
  //     // StreamListRespAct({branchClassId:branchClassResp.content[0].classId})
  //   }
  // },[branchClassResp])

  const ChangeStreamRef = useRef({
    prevStreamReqestResp: streamReqestResp,
    prevApproveRejectStreamReqResp: approveRejectStreamReqResp
  })

  useEffect(() => {
    const { prevStreamReqestResp, prevApproveRejectStreamReqResp } = ChangeStreamRef.current;
    if (streamReqestResp && streamReqestResp !== prevStreamReqestResp) {
      toast.success('Change Stream Request Submited Successfully.');
      toggleChangeStreamModal(true);
    }
    else if (approveRejectStreamReqResp && approveRejectStreamReqResp !== prevApproveRejectStreamReqResp) {
      toast.success(`Request ${actionName} Successfully.`);
      actionName === "Approve" ? toggleChangeStreamConfirmModal(undefined, true) : toggleChangeStreamRejectModal(undefined, true);
    }

    ChangeStreamRef.current.prevStreamReqestResp = streamReqestResp;
    ChangeStreamRef.current.prevApproveRejectStreamReqResp = approveRejectStreamReqResp;
  }, [streamReqestResp, approveRejectStreamReqResp])

  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: changeStreamFilterState?.academicYearId, curriculumId: changeStreamFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: changeStreamFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value })
      setChangeStreamFilterState((prev: any) => ({ ...prev, [name]: value, curriculumId: "", branchClassId: "" }));
    }
    else if (name === "curriculumId") {
      getClassApiCall({ curriculumId: value })
      StreamListRespAct({ curriculumId: value })
      setChangeStreamFilterState((prev: any) => ({ ...prev, [name]: value, branchClassId: "" }));
    }
    else {
      setChangeStreamFilterState((prev: any) => ({ ...prev, [name]: value }))
      StreamListRespAct({ [name]: value })
    }
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    setFilterState((prev: any) => ({ ...prev, ...paginationInfo }))
    StreamListRespAct(paginationInfo);
  }
  const roleColumns = useMemo(() => generateColumns(menuOptions), [streamChangeReqList]);


  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};
  const { data: StreamChangeReqList, totalElements, pageNumber, totalPages } = streamChangeReqList || {};

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Change Stream" pageTitle="Admissions" />

          <Card>
            <CardHeader>
              <div className="tw-flex tw-flex-col lg:tw-flex-row tw-items-center">
                <div className="tw-w-full lg:tw-w-1/3">
                  <h4 className="card-title !tw-mb-0 tw-flex-grow tw-justify-center">
                    Change Stream
                  </h4>
                </div>
                <div className="tw-w-auto tw-ml-auto">
                  <Button
                  variant="primary"
                    onClick={toggleChangeStreamModal}
                  >
                    <i className="ri-add-line tw-mr-2" />
                    Add Request
                  </Button>
                </div>
              </div>
            </CardHeader>

            <div className="tw-p-0 ">
              <div className="tw-py-3 tw-px-3">
                {/* <form onSubmit={ChangeStreamFilterForm.handleSubmit}> */}
                <div className="tw-grid tw-grid-cols-12  tw-gap-3">
                  <div className="lg:tw-col-span-2 xl:tw-col-span-2">
                    <div className="search-box tw-relative">
                      <TextInput
                        name="searchString"
                        value={changeStreamFilterState.searchString}
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
                      value={changeStreamFilterState.academicYearId}
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
                      value={changeStreamFilterState.curriculumId}
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
                      value={changeStreamFilterState.branchClassId}
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
              <button className="tw-btn tw-bg-blue-600 tw-text-white tw-float-right tw-flex tw-items-center tw-px-4 tw-py-2 tw-rounded hover:tw-bg-blue-700">
                <i className="ri-equalizer-fill tw-mr-2" />
                Apply Fillter
              </button>
            </div> */}
                </div>
                {/* </form> */}
              </div>

              <TableContainer
                columns={roleColumns || []}
                data={StreamChangeReqList || []}
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
        id="change-stream-modal"
        isOpen={changeStreamModalState.showModal}
        toggle={toggleChangeStreamModal}
        modalTitle="Change Stream"
        modalSize="md"
      >

        <ChangeStreamModal
          isOpen={changeStreamModalState.showModal}
          toggle={toggleChangeStreamModal}
          modalTitle="Change Stream"
          instituteId={"1"}
          instituteName={"Change Stream"}
          branchId={changeStreamModalState.branchId}
          requestDetails={""}
          filterData={changeStreamFilterState}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="change-stream-confirm-modal"
        isOpen={changeStreamConfirmModalState.showModal}
        toggle={toggleChangeStreamConfirmModal}
        modalTitle="Change Stream"
        hideHeader={true}
        modalSize="md"
      >
        <ChangeStreamConfirmModal
          isOpen={changeStreamConfirmModalState.showModal}
          toggle={toggleChangeStreamConfirmModal}
          modalTitle=""
          instituteId={"1"}
          instituteName={"Change Stream"}
          requestId={changeStreamConfirmModalState.requestId}
          requestDetails={""}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="change-stream-reject-modal"
        isOpen={changeStreamRejectModalState.showModal}
        toggle={toggleChangeStreamRejectModal}
        modalTitle="Change Stream"
        hideHeader={true}
        modalSize="md"
      >
        <ChangeStreamRejectModal
          isOpen={changeStreamRejectModalState.showModal}
          toggle={toggleChangeStreamRejectModal}
          modalTitle=""
          instituteId={"1"}
          instituteName={"Change Stream"}
          requestId={changeStreamRejectModalState.requestId}
          requestDetails={""}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="change-stream-ledger-modal"
        isOpen={changeStreamLedgerModalState.showModal}
        toggle={toggleChangeStreamLedgerModal}
        modalTitle=""
        modalSize="xl"
      >
        <ChangeStreamLedgerModal
          isOpen={changeStreamLedgerModalState.showModal}
          toggle={() => toggleChangeStreamLedgerModal()}
          modalTitle=""
          instituteId={"1"}
          instituteName={"Change Stream"}
          branchId={""}
          requestDetails={{ ...changeStreamLedgerModalState.modalData, studentId: changeStreamLedgerModalState.studentId, academicYearId: changeStreamFilterState.academicYearId }}
        />
      </ModalContainerUpdated>
      {/* <ToastContainer/> */}
    </>
  );
};

export default ChangeStream;
