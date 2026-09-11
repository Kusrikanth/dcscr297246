import BreadCrumb from "../../../../../../Components/Common/BreadCrumb";
import { Progress } from "reactstrap";
import {
  AlertIcon,
  ArrowLeft02Icon,
  Message01Icon,
  SquareLock02Icon,
  StudentIcon,
  UserGroup03Icon,
  UserWarningIcon,
  ViewIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import { useEffect, useMemo, useRef, useState } from "react";
import { generateColumns, readinessMenu } from "./helper";
import {
  ModalContainerUpdated,
  OffCanvasContainer,
  SelectInput,
  TextInput,
} from "../../../../../../Components/Common";
import AdvanceFilterModal from "./AdvanceFilterModal";
import { useHistory, useLocation } from "react-router-dom";
import { useModal } from "../../../../../../hooks/modalhook";
import StudentAssessmentMonitorModal from "./StudentAssessmentMonitorModal";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { getAssessmentCodeByIdAct, getLiveMonitorAct } from "../../../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { convertUTCToISTTimeOnly, getFormatteddateddMMMYYYY, getFormattedDateddMMMYYYY } from "../../../../../../utility/dateutility";
import { IPaginationState } from "../../../../../../Components/Common/Pagination";

export const analyticsList = [
  {
    id: "liveAssessments",
    label: "Not Eligible",
    value: "1",
    subLabel: "Assigned Students 120",
    icon: UserGroup03Icon,
    bgColor: "#E3F2FD",
    textColor: "#0D47A1",
  },
  {
    id: "studentsOnline",
    label: "Students Online",
    value: "312",
    subLabel: "peak 340 today",
    icon: StudentIcon,
    bgColor: "#E8F5E9",
    textColor: "#1B5E20",
  },
  {
    id: "technicalAlerts",
    label: "Technical Alerts",
    value: "56",
    subLabel: "12 critical",
    icon: AlertIcon,
    bgColor: "#FFF3E0",
    textColor: "#E65100",
  },
  {
    id: "cheatingAlerts",
    label: "Cheating Alerts",
    value: "18",
    subLabel: "6 high risk",
    icon: UserWarningIcon,
    bgColor: "#FCE4EC",
    textColor: "#AD1457",
  },
];

const LiveAssessmentMonitor = () => {
  const [open, setOpen] = useState<boolean>(false);
  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const history = useHistory();
  const location = useLocation<any>();
  const dispatch = useAppDispatch();

  const isAssessmentDetailsPage = location.pathname.includes("/assessment-list/assessment-details");

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    assignedClassSubjectsListResp,
    getEmployeesByFilterResp,
    branchListResp,
    getAssessmentCodeResp,
    getLiveMonitorResp,
    getAssessmentByIdResp

  } = useAppSelector(
    ({ instAcademics, globalData, branchAcademics, appData, classSubjectsInfo, directoryEmployee, branch, lmsAssessment }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
      getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
      branchListResp: branch.branchListResp,
      getAssessmentCodeResp: lmsAssessment.getAssessmentCodeResp,
      getLiveMonitorResp: lmsAssessment.getLiveMonitorResp,
      getAssessmentByIdResp: lmsAssessment.getAssessmentByIdResp,

    }),
    shallowEqual
  );


  const toggleAdvanceFilter = () => {
    setOpen((prev) => !prev);
  };

  function moveToAssessmentDetails() {
    history.push("/assessment-list");
  }

  const {
    openModal: studentMonitorOpenModal,
    closeModal: studentMonitorCloseModal,
    modalState: studentMonitorModalState,
  } = useModal();

  const menuOptions = useMemo(
    () => [
      {
        id: "view",
        actionIcon: (
          <HugeiconsIcon icon={ViewIcon} className="text-muted" size={18} />
        ),
        actionName: "View",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          const assessment = getLiveMonitorResp?.content?.find((item: any) => +item?.studentId === +id);
          studentMonitorOpenModal(assessment);
        },
      },
      {
        id: "msg",
        actionIcon: (
          <HugeiconsIcon
            icon={Message01Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Message",
        onClickHndlr: (event: any) => {},
      },
      {
        id: "lock",
        actionIcon: (
          <HugeiconsIcon
            icon={SquareLock02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Lock",
        onClickHndlr: (event: any) => {},
      },
    ],
    [getLiveMonitorResp]
  );
  const getLiveMonitorApiCall = () => {
    const payload = {
      ...paginationDetailRef.current,
    }
    dispatch(getLiveMonitorAct(generateActionPayload("get_live_monitor", { id: location.state.id }, payload)));
  }
  useEffect(() => {
    if (location.state) {
      dispatch(getAssessmentCodeByIdAct(generateActionPayload("get_assessment_by_id", { id: location.state.id }, {})));
      getLiveMonitorApiCall()
    }
  }, [location.state]);

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions,getLiveMonitorResp]
  );
  const paginationHndlr = (paginationInfo: IPaginationState) => {
    if (paginationDetailRef.current.pageNo !== paginationInfo.pageNo || paginationDetailRef.current.pageSize !== paginationInfo.pageSize) {
      paginationDetailRef.current = paginationInfo;
      getLiveMonitorApiCall();
    }
  }

  const intervalRef = useRef<any>(null);
  const isAssessmentExpired = () => {
    if (!getAssessmentByIdResp) return true;
    const { expiryDate, expiryTime } = getAssessmentByIdResp;
    const expiryDateTime = new Date(`${expiryDate}T${expiryTime}Z`); // Z indicates UTC
    const currentUTC = new Date();

    return currentUTC > expiryDateTime;
  }

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (!isAssessmentExpired()) {
      getLiveMonitorApiCall();
      intervalRef.current = setInterval(() => {
        if (isAssessmentExpired()) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        } else {
          getLiveMonitorApiCall();
        }
      }, 15000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [getAssessmentByIdResp]);

  const { totalElements, totalPages, pageable, content: assessmentData } = getLiveMonitorResp || {}

  return (
    <>
      <div className={` ${!isAssessmentDetailsPage ? 'page-content !tw-pt-8' : ''}`}>
        <div className={` ${!isAssessmentDetailsPage ? 'container-fluid' : ''}`}>
          {!isAssessmentDetailsPage && (
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
              <BreadCrumb
                pageTitle="LMS"
                extraClass="m-0 mb-0 shadow-none !tw-bg-transparent ps-0"
              />
              <button className="text-info" onClick={moveToAssessmentDetails}>
                <HugeiconsIcon
                  icon={ArrowLeft02Icon}
                  size={18}
                  className="me-2"
                />
                Back to Assessment Details
              </button>
            </div>
          )}

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="row align-items-center justify-content-between gap-3">
                    <div className="col-12 col-xl-6">
                      <div className="mb-3">
                        <h4 className="fw-semibold" id="ticket-title">
                          {getAssessmentByIdResp?.assessmentName}
                        </h4>
                        <div className="hstack gap-3 flex-wrap">
                          <div className="text-muted">
                            <span id="ticket-client">{getAssessmentByIdResp?.subjectName}</span>
                          </div>
                          <div className="vr"></div>
                          <div>
                            <span className="me-2 text-muted">
                              Curriculum/Class:
                            </span>
                            <span>{getAssessmentByIdResp?.curriculumName}/{getAssessmentByIdResp?.className}</span>
                          </div>
                          <div className="vr"></div>
                          <div>
                            <span className="me-2 text-muted">
                              Exam Date & Time:
                            </span>
                            <span>{getFormatteddateddMMMYYYY(getAssessmentByIdResp?.startDate)} {convertUTCToISTTimeOnly(getAssessmentByIdResp?.startTime)} - {convertUTCToISTTimeOnly(getAssessmentByIdResp?.expiryTime)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="tw-flex tw-gap-3">
                        <div className="tw-py-[2px] tw-px-3 tw-rounded tw-border tw-flex tw-text-xs tw-bg-slate-200 tw-text-slate-700">
                          Evaluation Type : Auto
                        </div>

                        <div className="tw-py-[2px] tw-px-3 tw-rounded tw-border tw-flex tw-text-xs tw-bg-slate-200 tw-text-slate-700">
                          Reattempts: Not Allowed
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-xl-auto ms-auto">
                      <div className="tw-flex tw-gap-2 tw-mb-4 xl:tw-justify-end">
                        {/* <button className="btn btn-sm btn-outline-primary">
                          Lock
                        </button>
                        <button className="btn btn-sm btn-outline-warning">
                          Pause
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          End
                        </button> */}
                        <button className="btn btn-sm btn-outline-secondary">
                          Export
                        </button>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-muted">Progress :</span>
                        <div className="d-flex align-items-center flex-grow-1">
                          <Progress
                            value={70}
                            className="rounded-pill !tw-w-[148px] me-2"
                            color="success"
                            style={{ height: "10px" }}
                          />
                          <p className="mb-0">70%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 !tw-mb-8">
              <div className="row g-3">
                {analyticsList.map((item) => (
                  <div className="col-12 col-md-6 col-lg-3">
                    <div
                      className="card border mb-0"
                      style={{
                        backgroundColor: `${item.bgColor}`,
                      }}
                    >
                      <div className="card-body py-2">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <p className="tw-text-[28px] tw-font-semibold tw-mb-0">
                              {item.value}
                            </p>
                            <p
                              className="mb-0 text-truncate w-100 fs-12"
                            // style={{ color: `${item.textColor}` }}
                            >
                              {item.label}
                            </p>
                          </div>
                          <div
                            className="bg-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                              width: "38px",
                              height: "38px",
                              border: `0.4px solid ${item.textColor}`,
                            }}
                          >
                            <HugeiconsIcon
                              icon={item.icon}
                              className=""
                              size={22}
                            />
                          </div>
                        </div>
                        <div className="w-100 text-truncate tw-text-right">
                          <p
                            className="mb-0 text-truncate w-100 fs-12"
                            style={{ color: `${item.textColor}` }}
                          >
                            {item.subLabel}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="tw-flex tw-justify-between">
                    <h4 className="card-title mb-0">Student activity</h4>
                    <button
                      className="btn btn-sm btn-outline-primary ms-auto me-2"
                      onClick={() => getLiveMonitorApiCall()}
                      disabled={isAssessmentExpired()}
                    >
                      Refresh
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={toggleAdvanceFilter}
                    >
                      Event Logs
                    </button>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="row g-3 p-3">
                    <div className="col-12 col-lg-4 col-xl-2">
                      <div className="search-box">
                        <TextInput
                          name="searchString"
                          placeHolder="Search"
                          labelText="Search"
                          floatingLabel
                          value={""}
                          onChange={() => {}}
                          formgroupClassName="mb-0"
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </div>
                    <div className="col-12 col-lg-3 col-xl-2">
                      <SelectInput
                        name=""
                        value={""}
                        onChange={() => {}}
                        menuItems={[]}
                        valueKey=""
                        textKey=""
                        labelText="Class"
                        floatingLabel
                        formgroupClassName="mb-0"
                      ></SelectInput>
                    </div>
                    <div className="col-12 col-lg-3 col-xl-2">
                      <SelectInput
                        name=""
                        value={""}
                        onChange={() => {}}
                        menuItems={[]}
                        valueKey=""
                        textKey=""
                        labelText="Section"
                        floatingLabel
                        formgroupClassName="mb-0"
                      ></SelectInput>
                    </div>
                    <div className="col-12 col-lg-3 col-xl-2">
                      <SelectInput
                        name=""
                        value={""}
                        onChange={() => {}}
                        menuItems={readinessMenu || []}
                        valueKey="id"
                        textKey="label"
                        labelText="Readiness"
                        floatingLabel
                        formgroupClassName="mb-0"
                      ></SelectInput>
                    </div>
                    <div className="col-12 col-lg-3 col-xl-2">
                      <SelectInput
                        name=""
                        value={""}
                        onChange={() => {}}
                        menuItems={[]}
                        valueKey=""
                        textKey=""
                        labelText="Submissions"
                        floatingLabel
                        formgroupClassName="mb-0"
                      ></SelectInput>
                    </div>
                  </div>
                  <TableContainer
                    columns={tableColumns || []}
                    data={getLiveMonitorResp?.content || []}
                    tableClass="mb-0"
                    divClass="table-responsive mb-3"
                    theadClass="table-light text-muted align-middle"
                    showPagination={true}
                    showCheckbox={true}
                    totalPages={totalPages || 0}
                    totalRecords={totalElements || 0}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={pageable?.pageNumber || 0}
                  ></TableContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OffCanvasContainer
        isOpen={open}
        headerTitle="Event logs"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-login-user"
      >
        <AdvanceFilterModal />
      </OffCanvasContainer>
      <ModalContainerUpdated
        id="student-assessment-monitor-modal"
        isOpen={studentMonitorModalState.showModal}
        toggle={studentMonitorCloseModal}
        modalTitle="Student Assessment Monitor Details"
        modalSize="md"
      >
        <StudentAssessmentMonitorModal
          toggle={studentMonitorCloseModal}
          data={studentMonitorModalState.modalData}
        ></StudentAssessmentMonitorModal>
      </ModalContainerUpdated>
    </>
  );
};
export default LiveAssessmentMonitor;
