import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { SearchInput, SelectInput } from "../../../Components/Common";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  generateTransportColumns,
  hasStateChanged,
  searchInputOptions,
} from "./helper";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import {
  getBranchCurriculumAct,
  resetBrchClassAct,
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getAdmissionFacilitysListAct } from "../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import {
  debounce,
  downloadExcelFile,
  sanitizeUrlParams,
} from "../../../utility/commonutility";
import { setRegistrationTabIdAct } from "../../../store/global/globalslice";
import { useModal } from "../../../hooks/modalhook";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { getTransportRegistrationAct } from "../../../store/transportation/transportationaction";
import Button from "../../../Components/Common/Button";

const initialFilterState = {
  academicYearId: "",
  curriculumId: "",
  startDate: "",
  enrollmentNumber: "",
  searchString: "",
  completionStatus: null,
  admissionType: null,
  classId: null,
  currentStatus: null,
  filterTypeName: "global",
  // facilityName: "",
  facilityId: "",
};

const MessRegistration = ({ tabId }: any) => {
  const {
    closeModal: closeExportConfirmationModal,
    modalState: exportConfirmationModalState,
    openModal: openExportConfirmationModal,
  } = useModal();
  const [count, setCount] = useState<any>(null);
  const [filterState, setFilterState] = useState(initialFilterState);
  const [open, setOpen] = useState<boolean>(false);
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const history = useHistory();
  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const [searchStudentState, setSearchStudentState] = useState("global");

  const dispatch = useAppDispatch();
  const {
    branchClassResp,
    academicYearListResp,
    brchCurriculumResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    loggedInUserRole,
    virtualRoleResp,
    transportRegistrationResp,
    transportationErrorResp,
    exportStudentDataRegistrationResp,
    facilityNameResp,
  } = useAppSelector(
    ({
      appData,
      branchAcademics,
      globalData,
      instAcademics,
      transportrequest,
      directoryStudent,
      admissionAvailabilityRequest,
    }) => ({
      branchClassResp: branchAcademics.branchClassResp,
      brchSectionsResp: branchAcademics.brchSectionsResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      academicYearListResp: instAcademics.academicYearListResp,
      instAcademicErrorResp: instAcademics.instAcademicErrorResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      exportStudentDataRegistrationResp:
        directoryStudent.exportStudentDataRegistrationResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      loggedInUserRole: appData.loggedInUserRole,
      virtualRoleResp: appData.virtualRoleResp,
      transportRegistrationResp: transportrequest.getTransportRegistrationResp,
      transportationErrorResp: transportrequest.transportationErrorAct,
      facilityNameResp:
        admissionAvailabilityRequest.getAdmissionFacilitysListResp,
    }),
    shallowEqual
  );
  const showInstituteAdminUI =
    loggedInUserRole === "INSTITUTE_ADMIN" && !virtualRoleResp;

  useEffect(() => {
    if (instituteId) {
      const payload = {
        instituteId,
        sortBy: "academicYearName",
        orderBy: "desc",
        pageNo: 0,
        pageSize: 100,
      };
      dispatch(
        getInstAcademicYearAct(
          generateActionPayload("get_inst_academic_year", undefined, payload)
        )
      );
      getFacilityApiCall();
    }
  }, [instituteId]);

  const prevTransportRegistrationRef = useRef({
    prevAcademicYearListResp: academicYearListResp,
    prevTransportationErrorResp: transportationErrorResp,
    prevExportRegistrationDataResp: exportStudentDataRegistrationResp,
  });

  useEffect(() => {
    const {
      prevAcademicYearListResp,
      prevTransportationErrorResp,
      prevExportRegistrationDataResp,
    } = prevTransportRegistrationRef.current;
    if (
      academicYearListResp &&
      prevAcademicYearListResp !== academicYearListResp
    ) {
      if (Array.isArray(academicYearListResp?.data)) {
        const { academicYearId } =
          academicYearListResp.data?.find(
            (year: any) => year.isAdmissionDefault
          ) || {};
        setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
        getCurriculumApiCall({ academicYearId });
        getTransportRegistrationApiCall({ academicYearId });
      }
    } else if (
      exportStudentDataRegistrationResp &&
      exportStudentDataRegistrationResp !== prevExportRegistrationDataResp
    ) {
      downloadExcelFile(
        exportStudentDataRegistrationResp,
        "transport_registration_data"
      );
      toast.success(" Excel file Successfully Download .");
      closeExportConfirmationModal();
    } else if (
      transportationErrorResp &&
      transportationErrorResp !== prevTransportationErrorResp
    ) {
      const { details, message } = transportationErrorResp;
      toast.error(details || message || "Something went wrong.");
    }
    prevTransportRegistrationRef.current.prevTransportationErrorResp =
      transportationErrorResp;
    prevTransportRegistrationRef.current.prevAcademicYearListResp =
      academicYearListResp;
    prevTransportRegistrationRef.current.prevExportRegistrationDataResp =
      exportStudentDataRegistrationResp;
  }, [
    academicYearListResp,
    transportationErrorResp,
    exportStudentDataRegistrationResp,
  ]);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = {
      academicYearId: filterState.academicYearId,
      branchId: branchId,
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };
    dispatch(
      getBranchCurriculumAct(
        generateActionPayload("get_brch_curriculum", undefined, payload1)
      )
    );
  };

  const getFacilityApiCall = () => {
    const payload = {
      departmentShortName: "ADS",
      departmentId: "6",
      branchId,
      pageNo: 0,
      pageSize: 100,
    };
    dispatch(
      getAdmissionFacilitysListAct(
        generateActionPayload("get_admission_facility_list", undefined, payload)
      )
    );
  };

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationRef.current = { ...paginationRef.current, pageNo: 0 };
    let stateChanged = hasStateChanged({
      ...filterState,
      [name]: value,
      academicYearId: "",
    });
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      setFilterState((prev: any) => ({
        ...prev,
        [name]: value,
        classId: null,
        curriculumId: "",
      }));
      stateChanged = hasStateChanged({
        ...filterState,
        academicYearId: "",
        classId: null,
        curriculumId: "",
      });
    } else {
      setFilterState((prev: any) => ({ ...prev, [name]: value }));
    }
    if (name === "academicYearId") {
      getTransportRegistrationApiCall({
        [name]: value,
        classId: null,
        curriculumId: "",
      });
    } else {
      getTransportRegistrationApiCall({ [name]: value });
    }

    setShowClearFilterState(stateChanged.stateChange);
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged.count);
  }

  function search(value: any) {
    getTransportRegistrationApiCall({ searchString: value });
  }

  const debounceFun = useCallback(debounce(search, 200), [
    transportRegistrationResp,
  ]);

  function getTransportRegistrationApiCall(otherProps?: any) {
    const filter = {
      branchId,
      departmentShortName: "ADS",
      ...filterState,
      ...otherProps,
      ...paginationRef.current,
      orderBy: "desc"
    };
    const payload = sanitizeUrlParams(filter);
    const { classId, currentStatus, completionStatus, curriculumId, facilityId } = payload;
    if (Array.isArray(classId)) {
      const classIds = classId.map((item) => item.id);
      payload.classId = classIds;
    }
    if (Array.isArray(currentStatus)) {
      const currentStatusIds = currentStatus.map((item) => item.id);
      payload.currentStatus = currentStatusIds;
    }
    if (completionStatus) {
      payload.currentStatus = completionStatus;
      delete payload.completionStatus;
    }
    if (curriculumId) {
      payload.curriculumId = String(curriculumId);
    }
    if (facilityId) {
      payload.facilityId = String(facilityId);
      // delete payload.facilityName;
    }
    dispatch(
      getTransportRegistrationAct(
        generateActionPayload("get_transport_registration", undefined, payload)
      )
    );
  }

  function paginationHndlr(paginationInfo: any) {
    paginationRef.current = paginationInfo;
    getTransportRegistrationApiCall();
  }

  function redirectTransportRegistrationDetails(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    let registrationId = event.currentTarget.getAttribute("data-id");
    if (registrationId) {
      dispatch(setRegistrationTabIdAct(tabId));
      history.push(`/transportation/view-transport-registration`, {
        registrationId,
      });
    }
  }

  useEffect(() => {
    if (transportRegistrationResp) {
      setOpen(false);
    }
  }, [transportRegistrationResp]);

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      paginationRef.current.pageNo = 0;
      let { academicYearId }: any =
        academicYearListResp?.data?.find(
          (year: any) => year.isAdmissionDefault
        ) || {};
      getCurriculumApiCall({ academicYearId });
      dispatch(resetBrchClassAct(undefined));
      setCount(null);
      setFilterState({ ...initialFilterState, academicYearId });
      getTransportRegistrationApiCall({
        ...initialFilterState,
        academicYearId,
      });
      getFacilityApiCall();
      setShowClearFilterState(false);
    }
  };

  function onSearchHandler(name: string, value: any) {
    paginationRef.current.pageNo = 0;
    setFilterState((prevState) => {
      const updatedState = {
        ...prevState,
        searchString: value,
        filterTypeName: prevState.filterTypeName || searchStudentState,
      };
      getTransportRegistrationApiCall(updatedState);
      return updatedState;
    });
  }

  function onChangeHandler(name: string, id: any, item: any) {
    setSearchStudentState(id);
    paginationRef.current.pageNo = 0;
    setFilterState((prevState) => {
      const updatedState = {
        ...prevState,
        filterTypeName: id,
        searchString: "",
      };
      getTransportRegistrationApiCall(updatedState);
      return updatedState;
    });
  }

  const messRegistrationColumns = useMemo(
    () => generateTransportColumns(redirectTransportRegistrationDetails),
    [transportRegistrationResp]
  );
  const {
    content: messRegistrationList,
    pageNumber,
    totalPages,
    totalElements,
  } = transportRegistrationResp || {};
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Mess Registration" pageTitle="Lunch Facility" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow">
            <div className="tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
              <h4 className="tw-text-base tw-font-semibold !tw-mb-0">
                Mess Registration
              </h4>
            </div>

            <div className="tw-p-5">
              <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-4">
                  <SearchInput
                    hideDefaultSelect
                    name="searchString"
                    value={searchStudentState}
                    menuItems={searchInputOptions}
                    idKey="id"
                    labelName="Search With"
                    searchHandler={onSearchHandler}
                    onChange={onChangeHandler}
                    renderSelectedValue={(item: any) => item?.name}
                    renderOptions={(item: any) => item?.name}
                  />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
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

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
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

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="facilityId"
                    value={filterState.facilityId}
                    onChange={onChangeFilterHndlr}
                    menuItems={facilityNameResp || []}
                    valueKey="id"
                    textKey="facilityName"
                    formgroupClassName="tw-mb-0"
                    labelText="Facility"
                    floatingLabel
                  />
                </div>

                {showClearFilterState && (
                  <div className="tw-col-auto tw-ml-auto tw-flex">
                    <Button
                      type="button"
                      onClick={clearFilterHndlr}
                      variant="wrong"
                    >
                      Clear filter
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <TableContainer
              columns={messRegistrationColumns || []}
              data={
                Array.isArray(messRegistrationList)
                  ? messRegistrationList
                  : []
              }
              divClass="tw-overflow-x-auto tw-mb-3"
              theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
              showPagination={true}
              totalPages={totalPages || 0}
              totalRecords={totalElements || 0}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageNumber || 0}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MessRegistration;
