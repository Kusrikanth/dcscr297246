import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { toast } from "react-toastify";
import { deallocateHostelBedAct, exportHostelBedAllocationAct, getHostelBedAllocationListAct } from "../../../../store/hostel/hostelrequest/hostelrequestactions";
import { bedStatusOptions, generateColumns, hasStateChanged, ignoredKeys } from "./helper";
import AdvanceFilterModal from "./AdvanceFilterModal";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { getHostelDetailsAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import AddHostelBedAllocation from "./AddHostelBedAllocation";
import { useFilterState } from "../../../../hooks/filterhook";
import { useModal } from "../../../../hooks/modalhook";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../../utility/commonutility";
import Button from "../../../../Components/Common/Button";


const initialValues = {
  searchString: "",
  academicYearId: "",
  hostelId: "",
  buildingId: "",
  floorId: "",
  roomTypeId: "",
  roomId: "",
  bedStatus: "",
};

const HostelBedAllocation = () => {
  const dispatch = useDispatch();
  const [bedAllocateFilterState, setBedAllocateFilterState] = useState(initialValues);
  const [open, setOpen] = useState<boolean>(false);
  const { closeModal: closeExportModalHnldr, openModal: openExportModalHnldr, modalState: exportModalState } = useModal();

  const { showClearFilterState, count, advanceFilterChange } = useFilterState();
  const { closeModal: cancelDeallocateBedModal, modalState: deallocateBedModalState, openModal: openDeallocateBedModal } = useModal();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const [allocateBedModalState, setAllocateBedModalState] =
    useState({
      showModal: false,
    });

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getHostelBedAllocationListResp,
    addHostelBedAllocationResp,
    deallocateHostelBedResp,
    hostelRequestErrorResp,
    exportHostelBedAllocationResp
  } = useAppSelector(
    ({ instAcademics, appData, globalData, hostelRequest, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getHostelBedAllocationListResp: hostelRequest.getHostelBedAllocationListResp,
      deallocateHostelBedResp: hostelRequest.deallocateHostelBedResp,
      addHostelBedAllocationResp: hostelRequest.addHostelBedAllocationResp,
      hostelRequestErrorResp: hostelRequest.hostelRequestErrorResp,
      showApiLoader: globalData.showApiLoader,
      exportHostelBedAllocationResp: hostelRequest.exportHostelBedAllocationResp
    }),
    shallowEqual
  );

  const hostelBedAllocationRef = useRef({
    prevDeallocateHostelBedResp: deallocateHostelBedResp,
    prevAddHostelBedAllocationResp: addHostelBedAllocationResp,
    prevHostelRequestErrorResp: hostelRequestErrorResp,
    prevExportHostelBedAllocationResp: exportHostelBedAllocationResp,
  })

  useEffect(() => {
    const { prevDeallocateHostelBedResp, prevAddHostelBedAllocationResp, prevHostelRequestErrorResp } = hostelBedAllocationRef.current;

    if (deallocateHostelBedResp && deallocateHostelBedResp !== prevDeallocateHostelBedResp) {
      toast.success('Bed Deallocated Successfully.');
      getHostelBedAllocateList()
      cancelDeallocateBedModal();
    }
    else if (addHostelBedAllocationResp && addHostelBedAllocationResp !== prevAddHostelBedAllocationResp) {
      toast.success('Bed Allocated Successfully.');
      getHostelBedAllocateList()
      toggleAllocateBedModal();
    }
    else if (exportHostelBedAllocationResp && exportHostelBedAllocationResp !== hostelBedAllocationRef.current.prevExportHostelBedAllocationResp) {
      toast.success("Exported successfully");
      closeExportModalHnldr()
      getHostelBedAllocateList();
      downloadExcelFile(exportHostelBedAllocationResp, "Hostel_Bed_Allocation");
    }
    else if (hostelRequestErrorResp && hostelRequestErrorResp !== prevHostelRequestErrorResp) {
      const { details } = hostelRequestErrorResp;
      toast.error(details || "Something went wrong. Please try again.")
    }

    hostelBedAllocationRef.current.prevDeallocateHostelBedResp = deallocateHostelBedResp;
    hostelBedAllocationRef.current.prevAddHostelBedAllocationResp = addHostelBedAllocationResp;
    hostelBedAllocationRef.current.prevHostelRequestErrorResp = hostelRequestErrorResp;
    hostelBedAllocationRef.current.prevExportHostelBedAllocationResp = exportHostelBedAllocationResp;

  }, [deallocateHostelBedResp, addHostelBedAllocationResp, hostelRequestErrorResp, exportHostelBedAllocationResp])

  const menuOptions = useMemo(
    () => [
      {
        id: "deallocate",
        actionIcon: <span className="text-info text-decoration-underline">Deallocate</span>,
        actionName: "Deallocate",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDeallocateBedModal(id);
        },
      },
    ],
    []
  );

  const toggleAllocateBedModal = () => {
    setAllocateBedModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const getHostelBedAllocateList = (otherProps?: any) => {
    const params = { branchId, ...bedAllocateFilterState, ...pagination.current, ...otherProps }
    if (params.academicYearId) {
      dispatch(getHostelBedAllocationListAct(generateActionPayload('get_hostel_bed_allocation_list', undefined, params)))
    }
  }

  const hostelDetailsList = (otherProps?: any) => {
    const payload = {
      branchId,
      ...otherProps,
    };
    dispatch(getHostelDetailsAct(generateActionPayload("get_hostel_details", undefined, payload)));
  };

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    pagination.current = { ...pagination.current, pageNo: 0, pageSize: 10 }
    setBedAllocateFilterState(prev => ({ ...prev, [name]: value }));
    if (name === "curriculumId") {
      const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    else if (name === "classId") {
      setBedAllocateFilterState(prev => ({ ...prev, promotedBy: "" }))
    }
    getHostelBedAllocateList({ [name]: value });

    advanceFilterChange({ keys: { ...bedAllocateFilterState, [name]: value, academicYearId: "" }, ignoredKeys })
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: bedAllocateFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setBedAllocateFilterState((prev: any) => ({ ...prev, academicYearId: yearId }));
    getHostelBedAllocateList({ academicYearId: yearId })
    getCurriculumApiCall({ academicYearId: yearId })
    hostelDetailsList()
  }, [academicYearListResp, branchId, instituteId])

  function paginationHndlr(paginationInfo: any) {
    pagination.current = paginationInfo
    getHostelBedAllocateList(paginationInfo);
  }

  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }

  const deallocateBedHndler = () => {

    dispatch(deallocateHostelBedAct(generateActionPayload("deallocate_hostel_bed", undefined, { allocationIds: [deallocateBedModalState.modalData] })));
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current = { ...pagination.current, pageNo: 0 }
    advanceFilterChange({ keys: { ...bedAllocateFilterState, ...appliedFilters, academicYearId: "" }, ignoredKeys })
    setBedAllocateFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    getHostelBedAllocateList(appliedFilters)
  }

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      let academicYearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      dispatch(resetBrchClassAct(undefined));
      setBedAllocateFilterState({ ...initialValues, academicYearId: academicYearId || "" });
      getHostelBedAllocateList({ ...initialValues, academicYearId, pageNo: 0, pageSize: 10 })
      advanceFilterChange({ keys: { ...initialValues }, ignoredKeys })
    }
  }

  function submitExportHndlr() {

    const payload = {
      branchId,
      ...bedAllocateFilterState,
    };
    dispatch(exportHostelBedAllocationAct(generateActionPayload('export_hostel_bed_allocation', undefined, payload, {
      responseType: 'blob'
    })))
  }


  const roleColumns = useMemo(() => generateColumns(menuOptions), []);

  const { data: academicYearList } = academicYearListResp || {};
  const { totalPages, totalElements, pageable } = getHostelBedAllocationListResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Promote Students List" pageTitle="Hostel" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-flex-wrap tw-gap-3">
                <div className="tw-flex-1">
                  <h4 className="tw-text-base tw-font-semibold tw-text-gray-800">
                    Bed Allocation Details
                  </h4>
                </div>

                <div className="tw-ml-auto tw-flex tw-items-center tw-gap-2">
                  <Button
                    variant="primary"
                    onClick={toggleAllocateBedModal}
                  >
                    <i className="ri-add-line tw-mr-2" />
                    Allocate Bed
                  </Button>

                  <Button
                    variant="exportBtn"
                    id="export-btn"
                    onClick={openExportModalHnldr}
                  >
                    <img src={ExportIcon} className="tw-h-5 tw-w-5" />
                  </Button>

                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </div>
              </div>
            </div>

            <div className="tw-p-0">
              <div className="tw-px-4 tw-py-3">
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-end">
                  <div className="xl:tw-col-span-2 tw-col-span-12">
                    <div className="tw-relative  search-box">
                      <TextInput
                        name="searchString"
                        value={bedAllocateFilterState.searchString}
                        onChange={filterHandler}
                        formgroupClassName="tw-mb-0"
                        labelText="Search"
                        placeHolder="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                    </div>
                  </div>
                  <div className="tw-col-span-12 xl:tw-col-span-2">
                    <SelectInput
                      name="academicYearId"
                      value={bedAllocateFilterState.academicYearId}
                      onChange={filterHandler}
                      menuItems={academicYearList || []}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      formgroupClassName="tw-mb-0"
                      labelText="Academic Year"
                      floatingLabel
                    />
                  </div>

                  <div className="tw-col-span-12 xl:tw-col-span-2">
                    <SelectInput
                      name="bedStatus"
                      value={bedAllocateFilterState.bedStatus}
                      onChange={filterHandler}
                      menuItems={bedStatusOptions}
                      valueKey="id"
                      textKey="name"
                      formgroupClassName="tw-mb-0"
                      labelText="Bed Status"
                      floatingLabel
                    />
                  </div>

                  <div className="tw-col-span-12 xl:tw-col-span-1 tw-relative">
                    <div
                      onClick={toggleAdvanceFilter}
                      className="tw-flex tw-items-center tw-gap-2 tw-bg-gray-100 tw-text-gray-700 tw-px-3 tw-py-2 tw-rounded-md hover:tw-bg-gray-200"
                    >
                      <FilterSvg height="18px" width="18px" />
                      <span>Filters</span>
                    </div>

                    <span className="tw-absolute tw--top-2 tw-left-16 tw-bg-emerald-500 tw-text-white tw-text-xs tw-font-semibold tw-rounded-full tw-px-2">
                      {count}
                    </span>
                  </div>

                  <div className="tw-col-span-12 xl:tw-col-span-5 tw-flex tw-justify-end">
                    {showClearFilterState && (
                      <Button
                        variant="wrong"
                        type="button"
                        onClick={clearFilterHndlr}
                      >
                        Clear filter
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <TableContainer
                columns={roleColumns || []}
                data={
                  Array.isArray(getHostelBedAllocationListResp?.data)
                    ? getHostelBedAllocationListResp?.data
                    : []
                }
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-allocate-bed-modal"
        isOpen={allocateBedModalState.showModal}
        toggle={toggleAllocateBedModal}
        modalTitle="Allocation Bed"
        modalSize="xl"
      >
        <AddHostelBedAllocation
          isOpen={allocateBedModalState.showModal}
          toggle={toggleAllocateBedModal}
          filterState={bedAllocateFilterState}
        />
      </ModalContainerUpdated>
      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-hostel-bed-allocation"
      >
        <AdvanceFilterModal
          appliedFilter={bedAllocateFilterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>
      <ConfirmationModal
        id="deallocate-bed-modal"
        isOpen={deallocateBedModalState.showModal}
        confirmMessage="Are you sure you want Deallocate Bed for this student ?"
        cancelHndlr={cancelDeallocateBedModal}
        confirmHndlr={deallocateBedHndler}
        isDisble={showApiLoader}
        btnClassName='btn w-sm btn-success'
        showImgIcon={true}
        iconType="approve"
      />
      <ModalContainerUpdated
        id="export-bed-allocation-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModalHnldr}
        modalTitle="Export Hostel Bed Allocation Details"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModalHnldr}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={submitExportHndlr}
          feature="hostel"
          subFeature="bed_allocations"
          remarksText="Enter remarks to export hostel bed allocation details?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default HostelBedAllocation;
