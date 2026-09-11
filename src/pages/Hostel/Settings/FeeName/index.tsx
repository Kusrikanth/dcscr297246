import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateColumns, ignoredKeys } from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { delHostelFeeNameParticularsAct, getHostelDetailsAct, getHostelFeeParticularsAct, getHostelFeeParticularsByIdAct, setHostelFeeParticularsAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import { getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useFilterState } from "../../../../hooks/filterhook";
import { useModal } from "../../../../hooks/modalhook";
import FeeParticularModel from "./FeeParticularModel";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  curriculumId: "",
  hostelId: "",
  academicYearId: "",
};

const HostelFeeParticulars = () => {

  const dispatch = useAppDispatch();
  const [filterState, setFilterState] = useState(initialValues);
  const { showClearFilterState, count, advanceFilterChange } = useFilterState()
  const { closeModal: closeFeeParticularNameUploadModal, modalState: FeeParticularNameUploadState, openModal: openFeeParticularNameUploadModal } = useModal();
  const { closeModal: closeDelFeeParticularNameModal, modalState: deleteFeeParticularNameState, openModal: openDelFeeParticularNameModal } = useModal();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const getFeeParticularApiCall = (otherProps?: any) => {
    const payload = { branchId, ...filterState, ...otherProps, ...pagination.current, };
    dispatch(getHostelFeeParticularsAct(generateActionPayload("get_hostel_fee_particulars", undefined, payload)));
  }
  const hostelDetailsList = (otherProps?: any) => {
    const payload = {
      branchId,
      sortBy: "createdAt",
      orderBy: "asc",
      ...otherProps,
    };
    dispatch(getHostelDetailsAct(generateActionPayload("get_hostel_details", undefined, payload)));
  };

  function delModalSubmitHndlr() {
    dispatch(delHostelFeeNameParticularsAct(generateActionPayload("delete_hostel_fee_particulars", { hostelFeeTypeId: deleteFeeParticularNameState.modalData })));
  }

  const { getHostelFeeParticularsResp, getHostelDetailsResp,
    brchCurriculumResp, academicYearListResp,
    currentInstIdResp: instituteId, showApiLoader, currentBranchIdResp: branchId, saveHostelFeeNameParticularsResp, delHostelFeeNameParticularsRequestResp, editHostelFeeNameParticularsRequestResp,
    hostelSettingsErrResp } =
    useAppSelector(({ appData, globalData, branchAcademics, hostelSettings, instAcademics, }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      getHostelDetailsResp: hostelSettings.getHostelDetailsResp,
      getHostelFeeParticularsResp: hostelSettings.getHostelFeeParticularsResp,
      editHostelFeeNameParticularsRequestResp: hostelSettings.editHostelFeeNameParticularsRequestResp,
      delHostelFeeNameParticularsRequestResp: hostelSettings.delHostelFeeNameParticularsRequestResp,
      saveHostelFeeNameParticularsResp: hostelSettings.saveHostelFeeNameParticularsResp,
      hostelSettingsErrResp: hostelSettings.hostelSettingsErrResp,
      showApiLoader: globalData.showApiLoader,
      academicYearListResp: instAcademics.academicYearListResp,
    }), shallowEqual);

  const FeeParticularNameRef = useRef({
    prevAddFeeParticularName: saveHostelFeeNameParticularsResp,
    prevEditFeeParticularName: editHostelFeeNameParticularsRequestResp,
    prevDeleteFeeParticularNameRequestListResp: delHostelFeeNameParticularsRequestResp,
    prevFeeParticularNameErrorResp: hostelSettingsErrResp,
  })

  useEffect(() => {
    const { prevAddFeeParticularName, prevEditFeeParticularName, prevDeleteFeeParticularNameRequestListResp, prevFeeParticularNameErrorResp } = FeeParticularNameRef.current;
    if (saveHostelFeeNameParticularsResp && prevAddFeeParticularName !== saveHostelFeeNameParticularsResp) {
      toast.success("Fee Particulars added successfully.");
      closeFeeParticularNameUploadModal()
      getFeeParticularApiCall()
    }
    else if (editHostelFeeNameParticularsRequestResp && prevEditFeeParticularName !== editHostelFeeNameParticularsRequestResp) {
      toast.success("Fee Particulars updated successfully.");
      closeFeeParticularNameUploadModal()
      getFeeParticularApiCall()
    }
    else if (delHostelFeeNameParticularsRequestResp && prevDeleteFeeParticularNameRequestListResp !== delHostelFeeNameParticularsRequestResp) {
      toast.success("Fee Particulars deleted successfully.");
      closeDelFeeParticularNameModal()
      getFeeParticularApiCall()
    }
    else if (hostelSettingsErrResp && prevFeeParticularNameErrorResp !== hostelSettingsErrResp) {
      const { details } = hostelSettingsErrResp || {};
      toast.error(details || "Something went wrong.");
    }
    FeeParticularNameRef.current.prevDeleteFeeParticularNameRequestListResp = delHostelFeeNameParticularsRequestResp;
    FeeParticularNameRef.current.prevEditFeeParticularName = editHostelFeeNameParticularsRequestResp;
    FeeParticularNameRef.current.prevAddFeeParticularName = saveHostelFeeNameParticularsResp;
    FeeParticularNameRef.current.prevFeeParticularNameErrorResp = hostelSettingsErrResp;
  }, [saveHostelFeeNameParticularsResp, editHostelFeeNameParticularsRequestResp, delHostelFeeNameParticularsRequestResp, hostelSettingsErrResp]);


  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    getCurriculumApiCall({ academicYearId: yearId })
  }, [academicYearListResp,branchId,instituteId]);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    if (Array.isArray(data) && data.length > 0) {
      getFeeParticularApiCall({ curriculumId: data[0].branchCurriculumId })
      setFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
    }
  }, [brchCurriculumResp])

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18}/>,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const hostelFeeTypeId = event.currentTarget.getAttribute("data-id");
          dispatch(getHostelFeeParticularsByIdAct(generateActionPayload("get_hostel_fee_particulars_by_id", { hostelFeeTypeId })));
          openFeeParticularNameUploadModal(hostelFeeTypeId);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const hostelFeeTypeId = event.currentTarget.getAttribute("data-id");
          openDelFeeParticularNameModal(hostelFeeTypeId)
        },
      },
    ],
    [getHostelFeeParticularsResp]
  );

  useEffect(() => {
    hostelDetailsList();
  }, [branchId,instituteId]);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    advanceFilterChange({
      keys: { ...filterState, [name]: value, academicYearId: "" },
      ignoredKeys
    });
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value })
      setFilterState((prevState: any) => ({ ...prevState, [name]: value, curriculumId: "" }));
    } else {
      setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
      getFeeParticularApiCall({ [name]: value });
    }
  }

  const clearFilterHndlr = () => {
    pagination.current = { ...pagination.current, pageNo: 0 };
    const { academicYearId = "" } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
    dispatch(setHostelFeeParticularsAct(undefined));
    setFilterState({ ...initialValues, academicYearId });
    getFeeParticularApiCall({ ...initialValues, academicYearId });
    getCurriculumApiCall({ academicYearId })
    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys })
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    getFeeParticularApiCall(paginationInfo);
  }
  
  const columns = useMemo(() => generateColumns(menuOptions), [menuOptions]);

  const { data: academicYearList } = academicYearListResp || {};
  const { data: feeParticularData, pageNumber, totalPages, totalElements } = getHostelFeeParticularsResp || {};
  const { data: hostelDetailsResp } = getHostelDetailsResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Hostel" pageTitle="Hostel" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Hostel Fee Particulars
                  </h4>
                </div>

                <div className="tw-ml-auto">
                  <div className="tw-flex">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => openFeeParticularNameUploadModal()}
                    >
                      <i className="ri-add-line tw-mr-2" />
                      Add New
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="tw-p-0">
              <div className="tw-py-3 tw-px-3">
                <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-3">
                  <div className="tw-col-span-12 lg:tw-col-span-4">
                    <div className="tw-relative">
                      <div className="search-box">

                      <TextInput
                        name="searchString"
                        value={filterState.searchString}
                        onChange={onChangeFilterHndlr}
                        formgroupClassName="tw-mb-3"
                        labelText="Search"
                        placeHolder="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                      name="academicYearId"
                      value={filterState.academicYearId}
                      onChange={onChangeFilterHndlr}
                      menuItems={academicYearList || []}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      formgroupClassName="tw-mb-0"
                      labelText="Academic Year"
                      floatingLabel
                    />
                  </div>

                  <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                      name="curriculumId"
                      value={filterState.curriculumId}
                      onChange={onChangeFilterHndlr}
                      menuItems={brchCurriculumResp?.data}
                      formgroupClassName="tw-mb-0"
                      valueKey="branchCurriculumId"
                      textKey="curriculumName"
                      labelText="Curriculum"
                      floatingLabel
                    />
                  </div>

                  <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                      name="hostelId"
                      value={filterState.hostelId}
                      onChange={onChangeFilterHndlr}
                      menuItems={hostelDetailsResp}
                      valueKey="hostelId"
                      textKey="hostelName"
                      formgroupClassName="tw-mb-0"
                      labelText="Hostel"
                      floatingLabel
                    />
                  </div>

                    {showClearFilterState && (
                  <div className="tw-col-span-auto tw-ml-auto tw-flex tw-items-end">
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
                columns={columns || []}
                data={feeParticularData || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-fee-particular"
        isOpen={FeeParticularNameUploadState.showModal}
        toggle={() => closeFeeParticularNameUploadModal()}
        modalTitle={FeeParticularNameUploadState.modalData ? "Edit Fee Particulars Details" : "Create Details"}
        modalSize="md"
      >
        <FeeParticularModel
          id={FeeParticularNameUploadState.modalData}
          isOpen={false}
          toggle={() => closeFeeParticularNameUploadModal()}
          modalTitle="Create Detail"
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-fee-particular"
        isOpen={deleteFeeParticularNameState.showModal}
        confirmMessage="Are you sure you want to delete this Fee Particulars ?"
        cancelHndlr={closeDelFeeParticularNameModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default HostelFeeParticulars;