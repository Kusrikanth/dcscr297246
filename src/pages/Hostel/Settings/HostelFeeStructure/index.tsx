
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import classnames from "classnames"
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../../hooks/storehook";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { generateColumns } from "./helper";
import { deleteHostelFeeStructureAct, getHostelDetailsAct, getHostelFeeStructureAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import HostelFeeStructureModel from "./HostelFeeStructureModel";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";


const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
};

const HostelFeeStructure = () => {

  const dispatch = useDispatch();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const [addHostelFeeStructureModal, setAddHostelFeeStructureModal] = useState({
    showModal: false,
    id: undefined
  })
  const [hostelFeeStructureFilterState, setHostelFeeStructureFilterState] = useState(initialValues);
  const [delFeeStructureModalState, setDelFeeStructureModalState] = useState({
    showModal: false,
    feeStructureId: ""
  });

  const toggleAddHostelFeeStructureModal = (id?: any) => {
    setAddHostelFeeStructureModal((prev: any) => ({ ...prev, showModal: !prev.showModal, id: id || "" }))
  };

  const hostelFeeStructureList = (otherProps?: any) => {
    const { academicYearId, curriculumId, searchString } = hostelFeeStructureFilterState;
    let payload = {
      academicYearId: academicYearId,
      curriculumId: curriculumId,
      instituteId: instituteId,
      branchId,
      searchString,
      ...pagination.current,
      ...otherProps,
    };
    if (payload.academicYearId) {
      dispatch(getHostelFeeStructureAct(generateActionPayload('get_hostel_fee_structure', undefined, payload)))
    }
  }

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getHostelFeeStructureResp,
    saveHostelFeeStructureResp,
    editHostelFeeStructureResp,
    deleteHostelFeeStructureResp,
    hostelSettingsErrResp,
  } = useAppSelector(
    ({ applicationSale, globalData, instAcademics, branchAcademics, appData, studentLongLeaves, hostelSettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getHostelFeeStructureResp: hostelSettings.getHostelFeeStructureResp,
      saveHostelFeeStructureResp: hostelSettings.saveHostelFeeStructureResp,
      editHostelFeeStructureResp: hostelSettings.editHostelFeeStructureResp,
      deleteHostelFeeStructureResp: hostelSettings.deleteHostelFeeStructureResp,
      hostelSettingsErrResp: hostelSettings.hostelSettingsErrResp,
    }),
    shallowEqual
  );

  const studentLongLeavesRef = useRef({
    prevSaveHostelFeeStructureResp: saveHostelFeeStructureResp,
    prevEditHostelFeeStructureResp: editHostelFeeStructureResp,
    prevDeleteHostelFeeStructureResp: deleteHostelFeeStructureResp,
    prevHostelSettingsErrResp: hostelSettingsErrResp,
  });

  useEffect(() => {
    const { prevHostelSettingsErrResp, prevSaveHostelFeeStructureResp, prevEditHostelFeeStructureResp, prevDeleteHostelFeeStructureResp } = studentLongLeavesRef.current;

    if (saveHostelFeeStructureResp && prevSaveHostelFeeStructureResp !== saveHostelFeeStructureResp) {
      toast.success("Hostel Fee Structure Saved Successfully")
      toggleAddHostelFeeStructureModal();
      hostelFeeStructureList();
    }
    else if (editHostelFeeStructureResp && prevEditHostelFeeStructureResp !== editHostelFeeStructureResp) {
      toast.success("Hostel Fee Structure Edited Successfully")
      toggleAddHostelFeeStructureModal()
      hostelFeeStructureList();
    }
    else if (deleteHostelFeeStructureResp && prevDeleteHostelFeeStructureResp !== deleteHostelFeeStructureResp) {
      toast.success("Hostel Fee Structure Deleted Successfully")
      toggleDelModalHndlr()
      hostelFeeStructureList();
    }
    else if (hostelSettingsErrResp && hostelSettingsErrResp !== prevHostelSettingsErrResp) {
      const { details } = hostelSettingsErrResp || {};
      toast.error(details || "Something went wrong.")
    }

    studentLongLeavesRef.current.prevSaveHostelFeeStructureResp = saveHostelFeeStructureResp;
    studentLongLeavesRef.current.prevEditHostelFeeStructureResp = editHostelFeeStructureResp;
    studentLongLeavesRef.current.prevDeleteHostelFeeStructureResp = deleteHostelFeeStructureResp;
    studentLongLeavesRef.current.prevHostelSettingsErrResp = hostelSettingsErrResp;
  }, [saveHostelFeeStructureResp, hostelSettingsErrResp, editHostelFeeStructureResp, deleteHostelFeeStructureResp]);

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18}/>,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          toggleAddHostelFeeStructureModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          toggleDelModalHndlr(id)
        },
      }
    ],
    []
  );

  const roleColumns = useMemo(() => generateColumns(menuOptions), []);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: hostelFeeStructureFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  useEffect(() => {
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, []);
  
  
  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    fetchHostelDetails()
    if (yearId) {
      setHostelFeeStructureFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
      hostelFeeStructureList({ academicYearId: yearId })
      getCurriculumApiCall({ academicYearId: yearId })
    }
  }, [academicYearListResp,branchId,instituteId]);


  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === 'curriculumId') {
      const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      hostelFeeStructureList({ [name]: value })
      if (!value) { 
        dispatch(resetBrchClassAct(undefined))
      }
      else {
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
      setHostelFeeStructureFilterState((prev: any) => ({ ...prev, [name]: value }))
    }
    else if(name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value,curriculumId:"" })
      hostelFeeStructureList({ [name]: value,curriculumId:"" })
      dispatch(resetBrchClassAct(undefined))
      setHostelFeeStructureFilterState((prev: any) => ({ ...prev, [name]: value,curriculumId:"" }))
    }
    else {
      setHostelFeeStructureFilterState((prev: any) => ({ ...prev, [name]: value }))
      hostelFeeStructureList({ [name]: value })
    }
  }

  const fetchHostelDetails = () => {
    dispatch(getHostelDetailsAct(generateActionPayload("get_hostel_details", undefined, { branchId })));
  }

  function toggleDelModalHndlr(feeStructureId?: any) {
    setDelFeeStructureModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal, feeStructureId: feeStructureId || "", }));
  }

  function delModalSubmitHndlr() {
    const { feeStructureId } = delFeeStructureModalState;
    dispatch(deleteHostelFeeStructureAct(generateActionPayload("delete_hostel_fee_structure", { id: feeStructureId })));
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    hostelFeeStructureList(paginationInfo)
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: studentResp, totalElements, totalPages, pageble } = getHostelFeeStructureResp || {}

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="daily attendance" pageTitle="Settings" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Fee Structure Details
                  </h4>
                </div>

                <div className="tw-ml-auto">
                  <div className="tw-flex">
                    <Button
                      variant="primary"
                      onClick={() => toggleAddHostelFeeStructureModal()}
                    >
                      Add New
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-p-4">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-3">
                <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="tw-relative search-box">
                    <TextInput
                      name="searchString"
                      value={hostelFeeStructureFilterState.searchString}
                      onChange={filterHandler}
                      inputClassName="tw-bg-gray-100"
                      formgroupClassName="tw-mb-0"
                      labelText="Search"
                      placeHolder="Search"
                      floatingLabel
                    />

                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                  </div>
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={hostelFeeStructureFilterState.academicYearId}
                    onChange={filterHandler}
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
                    value={hostelFeeStructureFilterState.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="tw-mb-0"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>
              </div>
            </div>
            <TableContainer
              columns={roleColumns || []}
              data={getHostelFeeStructureResp?.data || []}
              divClass="tw-overflow-x-auto tw-mb-3"
              theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
              showPagination={true}
              totalPages={totalPages || 0}
              totalRecords={totalElements || 0}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageble?.pageNumber || 0}
            />
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-hostel-fee-structure-modal"
        isOpen={addHostelFeeStructureModal.showModal}
        toggle={() => toggleAddHostelFeeStructureModal()}
        modalTitle="Hostel Fee Structure"
        modalSize="lg"
      >
        <HostelFeeStructureModel isOpen={addHostelFeeStructureModal.showModal} feeStructureId={addHostelFeeStructureModal?.id} toggle={() => toggleAddHostelFeeStructureModal()} />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-hostel-fee-structure"
        isOpen={delFeeStructureModalState.showModal}
        confirmMessage="Are you sure you want to delete this special structure?"
        cancelHndlr={() => toggleDelModalHndlr()}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />

    </>
  );
};

export default HostelFeeStructure;
