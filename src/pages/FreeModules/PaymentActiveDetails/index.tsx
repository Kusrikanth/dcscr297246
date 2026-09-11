import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  OffCanvasContainer,
  SelectInput,
  TextInput,
} from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { generateColumns, hasStateChanged } from "./helper";
import PaymentActiveDetailsModel from "./PaymentActiveDetailsModel";
import {
  exportActivePaymentDetailsAct,
  getPaymentActiveDetailsAct,
} from "../../../store/fee/feecollections/feecollectionactions";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../Components/Common/Pagination";
import {
  getBranchClassAct,
  getBranchCurriculumAct,
  resetBrchClassAct,
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import {
  getSectionList,
  setSectionListAct,
} from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { downloadExcelFile } from "../../../utility/commonutility";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import Button from "../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  transactionStartDate: "",
  completionStatus: "",
  transactionStatus: "",
  paymentOption: "",
  currentStatus: "",
  transactionFor: "",
};

const PaymentActiveDetails = () => {
  const dispatch = useDispatch();
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [count, setCount] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [PaymentActiveDetailsModelState, setPaymentActiveDetailsModelState] =
    useState({
      showModal: false,
      id: undefined,
    });
  const [PaymentActiveDetails, setPaymentActiveDetails] =
    useState(initialValues);
  const [filterState, setFilterState] = useState(initialValues);

  const [exportConfirmationModal, setExportConfirmationModal] = useState({
    showModal: false,
  });

  const togglePaymentDetailsModel = (id?: any) => {
    setPaymentActiveDetailsModelState((prev: any) => ({
      ...prev,
      showModal: !prev.showModal,
      id: id || "",
    }));
  };

  const toggleExportConfirmationModal = () => {
    setExportConfirmationModal((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const exportExcelHndler = () => {
    dispatch(
      exportActivePaymentDetailsAct(
        generateActionPayload(
          "export_active_payment_details",
          undefined,
          { ...filterState, branchId },
          {
            responseType: "blob",
          }
        )
      )
    );
  };

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const paymentActiveDetailsList = (otherProps?: any) => {
    const { searchString } = PaymentActiveDetails;
    let payload = {
      branchId,
      ...filterState,
      searchString,
      sortBy: "lastModifiedAt",
      orderBy: "desc",
      ...pagination.current,
      ...otherProps,
    };
    if (payload.academicYearId) {
      dispatch(
        getPaymentActiveDetailsAct(
          generateActionPayload("payment_active_details", undefined, payload)
        )
      );
    }
  };
  const {
    currentBranchIdResp: branchId,
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentInstIdResp: instituteId,
    paymentActiveDetailsResp,
    exportActivePaymentDetailsResp,
    sectionListResp,
    showApiLoader,
    classroomManagmentErrorResp,
  } = useAppSelector(
    ({
      instAcademics,
      appData,
      globalData,
      feeCollections,
      branchAcademics,
      classroomManagmentInfo,
    }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      showApiLoader: globalData.showApiLoader,
      branchClassResp: branchAcademics.branchClassResp,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      paymentActiveDetailsResp: feeCollections.paymentActiveDetailsResp,
      exportActivePaymentDetailsResp:
        feeCollections.exportActivePaymentDetailsResp,
      classroomManagmentErrorResp:
        classroomManagmentInfo.classroomManagmentErrorResp,
    }),
    shallowEqual
  );
  const paymentDetailsRef = useRef({
    prevAcademicYearListResp: academicYearListResp,
    prevClassroomManagmentErrorResp: classroomManagmentErrorResp,
    prevExportActivePaymentDetailsResp: exportActivePaymentDetailsResp,
  });


  useEffect(() => {
    let yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;
    paymentActiveDetailsList({ academicYearId: yearId });
    setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }));
    const payload1 = { academicYearId: yearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }, [academicYearListResp]);

  const getSectionListResp = (otherProps?: any) => {
    let payload = {
      branchClassId: filterState.classId || null,
      masterAcademicYearId: filterState.academicYearId,
      curriculumId: filterState.curriculumId,
      pageNo: 0,
      pageSize: 20,
      sortBy: "sectionName",
      orderBy: "asc",
      ...otherProps,
    };
    if (payload.branchClassId && payload.masterAcademicYearId) {
      dispatch(
        getSectionList(
          generateActionPayload("get_section_list", undefined, payload)
        )
      );
    }
  };

  useEffect(() => {
    const {
      prevAcademicYearListResp,
      prevClassroomManagmentErrorResp,
      prevExportActivePaymentDetailsResp,
    } = paymentDetailsRef.current;
    if (
      academicYearListResp &&
      prevAcademicYearListResp !== academicYearListResp
    ) {
      if (Array.isArray(academicYearListResp?.data)) {
        const { academicYearId } =
          academicYearListResp.data?.find(
            (year: any) => year.yearStatus === "CURRENT"
          ) || {};
        setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
        paymentActiveDetailsList({ academicYearId });
      }
    }
    if (
      classroomManagmentErrorResp &&
      prevClassroomManagmentErrorResp !== classroomManagmentErrorResp
    ) {
      const { details } = classroomManagmentErrorResp;
      toast.error(details || "Something went wrong.");
    } else if (
      exportActivePaymentDetailsResp &&
      exportActivePaymentDetailsResp !== prevExportActivePaymentDetailsResp
    ) {
      downloadExcelFile(exportActivePaymentDetailsResp, "Active_Payment_Details_List.xlsx");
      toast.success("Active Payment Details Downloaded Successfully.");
      toggleExportConfirmationModal();
    }
    paymentDetailsRef.current.prevClassroomManagmentErrorResp =
      classroomManagmentErrorResp;
  }, [classroomManagmentErrorResp, exportActivePaymentDetailsResp]);

  useEffect(() => {
    paymentActiveDetailsList();
  }, []);
  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    paymentActiveDetailsList(paginationInfo);
  }

  const columns = generateColumns(togglePaymentDetailsModel);
  const toggleAdvanceFilter = () => {
    setOpen(true);
  };
  function closeAdvanceFilterHandler() {
    setOpen(false);
  }

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === "academicYearId") {
        setFilterState((prev: any) => ({
            ...prev,
            academicYearId: value,
            curriculumId: "",
            classId: "",
            sectionId: "",
        }));
        if (value) {
            const payload1 = {
                academicYearId: value,
                branchId: branchId,
                pageNo: 0,
                pageSize: 100,
                sortBy: "curriculumName",
                orderBy: "asc",
            };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
            dispatch(resetBrchClassAct(undefined));
            dispatch(setSectionListAct(undefined));
        } else {
            dispatch(resetBrchClassAct(undefined));
            dispatch(setSectionListAct(undefined));
        }
        paymentActiveDetailsList({
            academicYearId: value,
            curriculumId: "",
            classId: "",
            sectionId: "",
        });

    } else if (name === "curriculumId") {
        if (value) {
            getClassApiCall(value);
        }
        dispatch(resetBrchClassAct(undefined));
        dispatch(setSectionListAct(undefined));
        setFilterState((prev: any) => ({
            ...prev,
            [name]: value,
            classId: "",
            sectionId: "",
        }));
        paymentActiveDetailsList({
            curriculumId: value,
            classId: "",
            sectionId: "",
        });

    } else if (name === "classId") {
        if (value) {
            getSectionListResp({ branchClassId: value });
        }
        dispatch(setSectionListAct(undefined));
        setFilterState((prev: any) => ({
            ...prev,
            [name]: value,
            sectionId: "",
        }));
        paymentActiveDetailsList({ classId: value, sectionId: "" });

    } else {
        setFilterState((prev: any) => ({ ...prev, [name]: value }));
        paymentActiveDetailsList({ [name]: value });
    }
    const stateChanged = hasStateChanged({
        ...filterState,
        [name]: value,
        academicYearId: name === "academicYearId" ? value : "",
    });
    setShowClearFilterState(stateChanged?.stateChange);
};


  function getClassApiCall(curriculumId: string) {
    const payload = {
      academicYearId : filterState.academicYearId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "classSequence",
      orderBy: "asc",
      curriculumId,
      branchId,
    };
    dispatch(
      getBranchClassAct(
        generateActionPayload("get_brch_curriculum_class", undefined, payload)
      )
    );
  }
  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current.pageNo = 0;
    setFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    const stateChanged = hasStateChanged({
      ...filterState,
      ...appliedFilters,
      academicYearId: "",
    });
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count);
    setShowClearFilterState(stateChanged?.stateChange);
    paymentActiveDetailsList(appliedFilters);
    closeAdvanceFilterHandler();
  }
  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      pagination.current = { ...pagination.current, pageNo: 0 };
      let { academicYearId } =
        academicYearListResp?.data?.find(
          (year: any) => year.yearStatus === "CURRENT"
        ) || {};
      dispatch(resetBrchClassAct(undefined));
      setCount(null);
      setFilterState({ ...initialValues, academicYearId: academicYearId || "" });
      paymentActiveDetailsList({ ...initialValues, academicYearId });
      setShowClearFilterState(false);
      dispatch(setSectionListAct(undefined));
      const payload1 = { academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
  };
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  const {
    content: libraryRecordResp,
    totalElements,
    totalPages,
    pageable,
  } = paymentActiveDetailsResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Fee" pageTitle="Fee" />

          <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-mb-5">

            <div className="tw-border-b tw-px-6 tw-py-4">
              <div className="tw-flex tw-items-center tw-justify-between">

                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Active Payment Details
                </h4>

                <Button
                variant="info"
                  onClick={() => toggleExportConfirmationModal()}
                >
                  <i className="ri-add-line tw-mr-2"></i>
                  Export
                </Button>

              </div>
            </div>

            <div className="tw-px-6 tw-py-4">

              <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
                  <div className="tw-relative search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search"
                      labelText="Search"
                      floatingLabel
                      value={filterState.searchString}
                      onChange={filterHandler}
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-2 tw-text-gray-400"></i>
                  </div>
                </div>

                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={filterState.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-0"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
                  <SelectInput
                    name="curriculumId"
                    value={filterState.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="tw-mb-0"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
                  <SelectInput
                    name="classId"
                    value={filterState.classId}
                    onChange={filterHandler}
                    menuItems={classTypes || []}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="tw-mb-0"
                    labelText="Class"
                    floatingLabel
                  />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
                  <SelectInput
                    name="sectionId"
                    value={filterState.sectionId}
                    onChange={filterHandler}
                    menuItems={sectionListResp?.data || []}
                    valueKey="sectionId"
                    textKey="sectionName"
                    formgroupClassName="tw-mb-0"
                    labelText="Section"
                    floatingLabel
                  />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
                  <div className="tw-flex tw-items-center tw-gap-3">

                    <div className="tw-relative">
                      <button
                        onClick={toggleAdvanceFilter}
                        className="tw-bg-gray-100 tw-px-3 tw-py-2 tw-rounded-md tw-flex tw-items-center hover:tw-bg-gray-200 tw-transition"
                      >
                        <FilterSvg height="18px" width="18px" />
                        <span className="tw-ml-2">Filters</span>
                      </button>

                      <span className="tw-absolute tw--top-2 tw-right-0 tw-bg-[#0ab39c] tw-text-white tw-text-xs tw-rounded-full tw-px-2">
                        {count}
                      </span>
                    </div>

                    {showClearFilterState && (
                      <Button
                        type="button"
                        onClick={clearFilterHndlr}
                        variant="wrong"
                      >
                        Clear filter
                      </Button>
                    )}

                  </div>
                </div>

              </div>
              <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={closeAdvanceFilterHandler}
                id="payment-details-advance-filter"
              >
                <AdvanceFilterModal
                  showApiLoader={showApiLoader}
                  getClassApiCall={getClassApiCall}
                  appliedFilter={filterState}
                  applyFilterCallback={advanceFilterCallbckHndlr}
                  toggleAdvanceFilter={toggleAdvanceFilter}
                  isOpen={open}
                />
              </OffCanvasContainer>

              

            </div>
            <TableContainer
              columns={columns || []}
              data={libraryRecordResp || []}
              tableClass="tw-mb-0"
              divClass="tw-overflow-x-auto tw-mb-4"
              theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
              showCheckbox={false}
              showPagination={true}
              totalPages={totalPages || 0}
              totalRecords={totalElements || 0}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageable?.pageNumber || 0}
            />
          </div>

        </div>

      </div>
      <ModalContainerUpdated
        id="payment-details"
        isOpen={PaymentActiveDetailsModelState.showModal}
        toggle={() => togglePaymentDetailsModel()}
        modalTitle="Payment Details"
        modalSize="xl"
      >
        <PaymentActiveDetailsModel
          isOpen={PaymentActiveDetailsModelState.showModal}
          toggle={() => togglePaymentDetailsModel()}
          modalTitle="Payment Details"
          id={PaymentActiveDetailsModelState.id}
        />
      </ModalContainerUpdated>

      {/* <ConfirmationModal
        id="active-payment-export-modal"
        isOpen={exportConfirmationModal.showModal}
        confirmMessage="You want to Download excel file?"
        cancelHndlr={() => toggleExportConfirmationModal()}
        confirmHndlr={exportExcelHndler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType="approve"
        btnClassName="btn w-sm btn-success"
      /> */}

      <ModalContainerUpdated
        id="active-payment-export-modal"
        isOpen={exportConfirmationModal.showModal}
        toggle={toggleExportConfirmationModal}
        modalTitle="Export Online Payments Data"
        modalSize="md">
        <ExportModal
          isOpen={exportConfirmationModal.showModal}
          toggle={toggleExportConfirmationModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="fee"
          subFeature="online_payments"
          remarksText="Enter remarks to export online payments data?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default PaymentActiveDetails;
