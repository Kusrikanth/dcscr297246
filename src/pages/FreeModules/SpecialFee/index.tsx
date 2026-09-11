
import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { SelectInput, TextInput, ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, DropDownToggle, SearchInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import AddSpecialFeeModal from "./AddSpecialFeeModal";
import {
  generateColumns,
  hasStateChanged,
  searchInputOptions,
} from "./helper";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getSpecialFeesAct, deleteSpecialFeeAct, getSpecialFeeCategoryListAct, getFeeTypesAct, updateSpecialFeeStatusAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

import {
  getBranchCurriculumAct,
  resetBrchCurriculumAct
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
//Types
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
//Common Utility
import { debounce, getSortingKeys } from "../../../utility/commonutility";
import ShowSpecialFeeStudentModal from "./ShowSpecialFeeStudentModal";
import AdvanceFilterModal from "./AdvanceFilterModal";
import ViewDetailsModal from "./ViewDetailsModal";
import { useModal } from "../../../hooks/modalhook";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02StrokeStandard, Download01Icon, Edit02Icon, EyeIcon, FileUploadIcon, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import BulkUploadSepecialFeeModal from "./BulkUploadSepecialFeeModal";
import DownloadSpecialFeeDocModal from "./DownloadSpecialFeeDocModal";
import Button from "../../../Components/Common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
const initialValues = {
  name: "",
  academicYearId: "",
  branchId: "",
  branchCurriculumId: "",
  categoryId: "",
  feeTypeId: "",
  applicableTo: "",
  isActive: null,
  filterTypes:"SPECIAL_FEE_NAME",
}

const validationSchema = Yup.object().shape({
  branchId: Yup.string().required("Branch required."),
});

const SpecialFee = () => {
  const [searchInputState,setSearchInputState] = useState("SPECIAL_FEE_NAME");
  const [branchState, setBranchState] = useState<any>([]);

  const [specialFeeModalState, setSpecialFeeModalState] =
    useState<any>({
      showModal: false,
      specialFeeId: "",
      modalData: undefined,
    });
  const [delSpecialFeeModalState, setDelSpecialFeeModalState] = useState<any>({
    showModal: false,
    specialFeeId: ""
  });
  const [specialFeeStudentsModalState, setSpecialFeeStudentsModalState] = useState<any>({
    studentList: [],
    showModal: false
  });
  // const [filterState, setFilterState] = useState(initialValues);
  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const [viewTermsModalState, setViewTermsModalState] =
    useState({
      showModal: false,
      id: "",
      modalData: undefined
    });
  const sortingDetailRef = useRef<any>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [count, setCount] = useState<any>(null);
  const [showClearFilterState, setShowClearFilterState] = useState(false);

  const { closeModal: closeUpdateStatusModal, modalState: updateStatusModalState, openModal: openUpdateStatusModal } = useModal();

  const {
    openModal:bulkUploadSepecialFeeOpenModal,
    closeModal:bulkUploadSepecialFeeCloseModal,
    modalState:bulkUploadSepecialFeeModalState,
  } = useModal()

  const {
    openModal:downloadDocOpenModal,
    closeModal:downloadDocCloseModal,
    modalState:downloadDocModalState,
  } = useModal()

  const dispatch = useAppDispatch();
  const { specialFeesResp, deleteSpecialFeeResp,
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    academicYearListResp, brchCurriculumResp, showApiLoader, updateSpecialFeeStatusResp,
    downloadStaticHealthResp,
    specialfFeeBulkUploadResp,
    masterFeeSettingsErrorResp, loggedInUserRole, branchListResp, virtualRoleResp } =
    useAppSelector(({ appData, instAcademics, branchAcademics, masterFeeSettings, branch, globalData,classroomManagmentInfo }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      specialFeesResp: masterFeeSettings.specialFeesResp,
      deleteSpecialFeeResp: masterFeeSettings.deleteSpecialFeeResp,
      updateSpecialFeeStatusResp: masterFeeSettings.updateSpecialFeeStatusResp,
      specialfFeeBulkUploadResp: masterFeeSettings.specialfFeeBulkUploadResp,
      showApiLoader: globalData.showApiLoader,
      downloadStaticHealthResp: classroomManagmentInfo.downloadStaticHealthResp,
      masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp,
      loggedInUserRole: appData.loggedInUserRole,
            branchListResp: branch.branchListResp,
            virtualRoleResp: appData.virtualRoleResp
    }), shallowEqual);

  const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;
   const specialFeeForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
          
        },
      });

  const feeDetailsRespRef = useRef({
    prevDeleteSpecialFeeResp: deleteSpecialFeeResp,
    prevUpdateSpecialFeeStatusResp: updateSpecialFeeStatusResp,
    prevDownloadStaticHealthResp: downloadStaticHealthResp,
    prevSpecialfFeeBulkUploadResp:specialfFeeBulkUploadResp,
    prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp
  });

  useEffect(() => {
    const {
      prevDeleteSpecialFeeResp, prevUpdateSpecialFeeStatusResp, 
      prevDownloadStaticHealthResp,
      prevSpecialfFeeBulkUploadResp,
      prevMasterFeeSettingsErrorResp } = feeDetailsRespRef.current;

    if (deleteSpecialFeeResp && prevDeleteSpecialFeeResp !== deleteSpecialFeeResp) {
      setDelSpecialFeeModalState((prevState: any) => ({ ...prevState, showModal: false, specialFeeId: "" }));
      getSpecialFeeApiCall();
      toast.success("Special fee deleted successfully.");
    }
    else if (updateSpecialFeeStatusResp && prevUpdateSpecialFeeStatusResp !== updateSpecialFeeStatusResp) {
      closeUpdateStatusModal();
      getSpecialFeeApiCall();
      toast.success("Special fee status updated successfully.");
    }
    
    else if (downloadStaticHealthResp && downloadStaticHealthResp !== prevDownloadStaticHealthResp) {
        const { systemFile } = downloadStaticHealthResp,
            { s3URL } = systemFile || {};
          if (s3URL) {
            const url = s3URL || ""
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'concession_template.xlsx');
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click();
            link.remove();
          } else {
            toast.error('Download url for bulk upload form is not found.');
          }
        }
    else if (specialfFeeBulkUploadResp && specialfFeeBulkUploadResp !== prevSpecialfFeeBulkUploadResp) {
      toast.success("Special fee bulk upload Added successfully.");
      getSpecialFeeApiCall();
      bulkUploadSepecialFeeCloseModal();
    }

    else if (masterFeeSettingsErrorResp && masterFeeSettingsErrorResp !== prevMasterFeeSettingsErrorResp) {
      const { details }: any = masterFeeSettingsErrorResp;
      toast.error(details || "Something went wrong.");
    }

    feeDetailsRespRef.current.prevDeleteSpecialFeeResp = deleteSpecialFeeResp;
    feeDetailsRespRef.current.prevDownloadStaticHealthResp = downloadStaticHealthResp;
    feeDetailsRespRef.current.prevSpecialfFeeBulkUploadResp = specialfFeeBulkUploadResp;
    feeDetailsRespRef.current.prevUpdateSpecialFeeStatusResp = updateSpecialFeeStatusResp;
    feeDetailsRespRef.current.prevMasterFeeSettingsErrorResp = masterFeeSettingsErrorResp;
  }, [
    deleteSpecialFeeResp, updateSpecialFeeStatusResp, downloadStaticHealthResp,specialfFeeBulkUploadResp, masterFeeSettingsErrorResp]);

  useEffect(() => {
    if (academicYearListResp?.data && !showInstituteAdminUI) {
      const currentYear = academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      );
      if (currentYear?.academicYearId) {
        const { academicYearId } = currentYear;
        specialFeeForm.setValues((prevState: any) => {
          if (prevState.academicYearId !== academicYearId) {
            getSpecialFeeApiCall({ academicYearId });
            return { ...prevState, academicYearId };
          }
          return prevState;
        });
        dispatch(
          getSpecialFeeCategoryListAct(
            generateActionPayload("get_special_fee_category_list", undefined, { branchId })
          )
        );
        const params = { instituteId };
        dispatch(getFeeTypesAct(generateActionPayload("get_fee_types", undefined, params)));
        const brchCurriculumparams = { academicYearId, branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        if(brchCurriculumparams.branchId){
          dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
        }
      }
    }
    else if(academicYearListResp?.data && showInstituteAdminUI){
      const currentYear = academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      );
      if (currentYear?.academicYearId && branchListResp) {
         const branch = branchListResp?.data[0];
      setBranchState(branchListResp?.data.filter((branch: any) => branch.branchId != branchId))
      specialFeeForm.setFieldValue("branchId", branch.branchId);
        const { academicYearId } = currentYear;
        specialFeeForm.setValues((prevState: any) => {
          if (prevState.academicYearId !== academicYearId) {
            getSpecialFeeApiCall({ academicYearId, branchId: branch.branchId });
            return { ...prevState, academicYearId };
          }
          return prevState;
        });
        dispatch(
          getSpecialFeeCategoryListAct(
            generateActionPayload("get_special_fee_category_list", undefined, { branchId })
          )
        );
        const params = { instituteId };
        dispatch(getFeeTypesAct(generateActionPayload("get_fee_types", undefined, params)));
        const brchCurriculumparams = { academicYearId, branchId: branch.branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        if(brchCurriculumparams.branchId){
          dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
        }
      }
    }
  }, [academicYearListResp, branchId, instituteId]);

  

  // useEffect(() => {
  //   if (branchListResp && showInstituteAdminUI) {
  //     console.log("hi");
      
  //     const branch = branchListResp?.data[0];
  //     setBranchState(branchListResp?.data.filter((branch: any) => branch.branchId != branchId))
  //     setFilterState((prevState: any) => ({ ...prevState, branchId: branch.branchId }));
  //     getSpecialFeeApiCall({ branchId: branch.branchId });

  //     const brchCurriculumparams = { academicYearId: filterState.academicYearId, branchId: branch.branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
  //     dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));

  //   }
  // }, [branchListResp, showInstituteAdminUI])
  

  const toggleSpecialFeeModal = useCallback((apiCall?: boolean) => {
    setSpecialFeeModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
    if (typeof (apiCall) === "boolean" && apiCall) {
      getSpecialFeeApiCall();
    }
  }, [instituteId, specialFeesResp]);

  function addSpecialFeeModalHndlr() {
    setSpecialFeeModalState((prevState: any) => ({
      ...prevState, showModal: true,
      specialFeeId: "",
      modalData: undefined
    }));
  }


  function editSpecialFeeHndlr(event: any) {
    const specialFeeId = event.currentTarget.getAttribute("data-id"),
      modalData = specialFeesResp?.data?.find((item: any) => item.id === Number(specialFeeId));
    if (modalData) {
      setSpecialFeeModalState((prevState: any) => ({
        ...prevState, showModal: true, specialFeeId,
        modalData
      }));
    }
  }

  function deleteSpecialFeeHndlr(event: any) {
    const specialFeeId = event.currentTarget.getAttribute("data-id");
    if (specialFeeId)
      setDelSpecialFeeModalState((prevState: any) => ({ ...prevState, showModal: true, specialFeeId }));
  }

  function updateStatusHndler(event: any) {
    const specialFeeId = event.currentTarget.getAttribute("data-id");
    const data = specialFeesResp?.data?.find((item: any) => +item.id === Number(specialFeeId));
    if (specialFeeId)
      openUpdateStatusModal({
        specialFeeId: specialFeeId,
        isActive: !data?.isActive,
      });
  }

  const menuOptions = useMemo((): IOptionsHrtl[] => ([{
    id: "edit",
    actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
    actionName: "Edit",
    onClickHndlr: editSpecialFeeHndlr,
  }, {
    id: "delete",
    actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
    actionName: "Delete",
    onClickHndlr: deleteSpecialFeeHndlr
  },
  {
    id: "viewDetails",
    actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
    actionName: "View Details",
    onClickHndlr: viewReceiptDetailsHndlr,
  },
  {
    id: "updateStatus",
    actionIcon: <HugeiconsIcon icon={Edit02Icon} className="me-2 text-muted" size={18} />,
    actionName: "Update Status",
    onClickHndlr: updateStatusHndler,
  },
  {
    id: "downloadSpecialFeeDoc",
    actionIcon: <HugeiconsIcon icon={Download01Icon} className="me-2 text-muted" size={18} />,
    actionName: "Download",
    onClickHndlr: (event:any) => {
      const id = event.currentTarget.getAttribute("data-id");
      const docdata = specialFeesResp?.data?.find((item) => +item.id === +id);
      if(docdata){
        downloadDocOpenModal(docdata?.studentDetails)
      }

    }
  }
  ]), [specialFeesResp]);

  function delModalCancelHndlr() {
    setDelSpecialFeeModalState((prevState: any) => ({ ...prevState, showModal: false }));
  }
  function delModalSubmitHndlr() {
    const { specialFeeId } = delSpecialFeeModalState;
    dispatch(deleteSpecialFeeAct(generateActionPayload("delete_special_fee", { specialFeeId })));
  }

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getSpecialFeeApiCall(paginationInfo);
  }


  function getSpecialFeeApiCall(otherProps?: any) {
    const sortingParams = getSortingKeys(sortingDetailRef.current);
    const payload = { instituteId, branchId: branchId || specialFeeForm.values.branchId, ...otherProps, ...paginationDetailRef.current, ...sortingParams };
    dispatch(getSpecialFeesAct(generateActionPayload("get_special_fees", undefined, payload)));
  }

  function onSearchHandler(name: string, value: any) {  
        paginationDetailRef.current.pageNo = 0;
        setSearchInputState((prev) => {
            const updatedFilterType = prev;
            specialFeeForm.setValues((prevState) => {
                const updatedState = { 
                    ...prevState, 
                    name: value, 
                    filterTypes: updatedFilterType
                };
                getSpecialFeeApiCall(updatedState);
                return updatedState;
            });
            return updatedFilterType;
        });
  }

  function onChangeHandler(name: string, id: any, item: any) {
        setSearchInputState(id);
        paginationDetailRef.current.pageNo = 0;
        
        specialFeeForm.setValues((prevState) => {
            const updatedState = { 
                ...prevState, 
                name: "",
                filterTypes: id,
            };
            getSpecialFeeApiCall(updatedState);
            return updatedState;
        });
    }

  const debouncedApiCall = useCallback(debounce((apiCallFn: (arg0: any) => void, filters: any) => apiCallFn(filters), 500), []);

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    const newFilters = { ...specialFeeForm.values, [name]: value };

    if (name === 'academicYearId') {
      newFilters.branchCurriculumId = "";
    }
    specialFeeForm.setValues(newFilters);
    
    paginationDetailRef.current.pageNo = 0;

    if (name === 'name') {
      debouncedApiCall(getSpecialFeeApiCall, newFilters);
    } else if (name === 'academicYearId') {
      if (value) {
        const curriculumParams = { academicYearId: value, branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, curriculumParams)));
      }
      getSpecialFeeApiCall(newFilters);
    } 
    else if(name === "branchId") {
          if(value){
              specialFeeForm.setValues((prev: any) => ({ ...prev, [name]: value, curriculumId: "", feeParticularId: "" }));
              const curriculumParams = { academicYearId: specialFeeForm.values.academicYearId, branchId: value, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", };
              dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, curriculumParams)));
              getSpecialFeeApiCall({ ...specialFeeForm.values, branchId: value });
          }
          else{
              specialFeeForm.setValues((prev: any) => ({ ...prev, [name]: value, curriculumId: "", feeParticularId: "" }));
              dispatch(resetBrchCurriculumAct(undefined));
          }
        }
    else if (name === 'branchCurriculumId') {
      getSpecialFeeApiCall(newFilters);
    }
  }

  function sortingHandler(sortingKeys: any) {
    if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
      sortingDetailRef.current = sortingKeys;
      getSpecialFeeApiCall();
    } else {
      sortingDetailRef.current = sortingKeys;
    }
  }

  const onClickMoreStudentHndlr = useCallback((event: any) => {
    const specialFeeId = event.currentTarget.getAttribute("data-id");
    if (specialFeeId) {
      const { studentDetails } = specialFeesResp.data.find((item: any) => item.id == specialFeeId) || {};
      if (Array.isArray(studentDetails)) {
        setSpecialFeeStudentsModalState({
          showModal: true,
          studentList: studentDetails
        })
      }
    }
  }, [specialFeesResp]);

  function toggleSpecialFeeStudentModalHndlr(event: any) {
    setSpecialFeeStudentsModalState((prevState: any) => ({ ...prevState, showModal: false }));
  }

  function toggleViewTermsModalHndler(id?: any, modalData?: any) {
    setViewTermsModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal, id: id || "", modalData: modalData || "" }));
  }

  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }

  function viewReceiptDetailsHndlr(event: any) {
    const id = event.currentTarget.getAttribute("data-id"),
      modalData = specialFeesResp?.data?.find((item: any) => +item.id === +(id));
    if (modalData) {
      setViewTermsModalState((prev: any) => ({
        ...prev,
        id,
        showModal: true,
        modalData
      }))
    }
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
    const stateChanged = hasStateChanged({ ...specialFeeForm.values, ...appliedFilters });
    setShowClearFilterState(stateChanged?.stateChange)
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    specialFeeForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
    getSpecialFeeApiCall(appliedFilters)
  }

  const clearFilterHndlr = () => {
    paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 };
    const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
    specialFeeForm.setValues({ ...initialValues, academicYearId: academicYearId || "" });
    getSpecialFeeApiCall({ ...initialValues, academicYearId });
    setShowClearFilterState(false);

    const stateChanged = hasStateChanged({ ...initialValues });
    setShowClearFilterState(stateChanged?.stateChange)
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
  };

  const statusModalSubmitHndler = () => {
    dispatch(updateSpecialFeeStatusAct(generateActionPayload("update_status_special_fee", { specialFeeId: updateStatusModalState.modalData?.specialFeeId }, { isActive: updateStatusModalState.modalData?.isActive })));
  }

  const specialFeeColumns = useMemo(() => {
    const { pageNo, pageSize } = paginationDetailRef.current,
      offset = pageNo * pageSize;
    const newColumns = generateColumns(menuOptions, offset, onClickMoreStudentHndlr)
    if (showInstituteAdminUI) {
            return newColumns
        } else {
           return newColumns.filter(item => item?.accessor !== "branchName")
        }
  }, [specialFeesResp]),
    { data: specialFeesList, pageNumber, totalPages, totalElements } = specialFeesResp || {};

    const handleSpecialFeeAction = (type: "single" | "bulk") => {

  if (showInstituteAdminUI && !specialFeeForm.values.branchId) {
    specialFeeForm.setFieldTouched("branchId", true, true);
    return;
  }

  if (type === "single") {
    addSpecialFeeModalHndlr();
  }

  if (type === "bulk") {
    bulkUploadSepecialFeeOpenModal();
  }
};
   
    const dropDownOptions = useMemo(() => [
  {
    id: "create-single-special-fee",
    actionName: "Create Single Special Fee",
    actionIcon: (
      <HugeiconsIcon icon={Add01Icon} className="me-2 text-muted" size={16} />
    ),
    onClickHndlr: () => handleSpecialFeeAction("single"),
  },
  {
    id: "create-bulk-special-fee",
    actionName: "Create Bulk Special Fee",
    actionIcon: (
      <HugeiconsIcon icon={FileUploadIcon} className="me-2 text-muted" size={16} />
    ),
    onClickHndlr: () => handleSpecialFeeAction("bulk"),
  },
], [
  showInstituteAdminUI,
  specialFeeForm.values.branchId
]);

  return (
    <>
      <div className="">
        <div className="tw-w-full">
          {/* <BreadCrumb title="Special Fee" pageTitle="Fee" /> */}

          {/* <div className=""> */}
            <div className="tw-p-2">
              <div className="tw-py-3 ">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-end">

                <div className="tw-col-span-12 sm:tw-col-span-12 lg:tw-col-span-5 xl:tw-col-span-4">
                  <SearchInput
                    hideDefaultSelect
                    name="name"
                    value={searchInputState}
                    menuItems={searchInputOptions}
                    idKey="id"
                    labelName="Search With"
                    searchHandler={onSearchHandler}
                    onChange={onChangeHandler}
                    renderSelectedValue={(item: any) => item?.name}
                    renderOptions={(item: any) => item?.name}
                  />
                </div>

                <div className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={specialFeeForm.values.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearListResp?.data}
                    formgroupClassName="tw-mb-0"
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>

                {showInstituteAdminUI && (
                  <div className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-2">
                    <SelectInput
                      name="branchId"
                      valueKey="branchId"
                      textKey="branchName"
                      value={specialFeeForm.values.branchId}
                      menuItems={branchState}
                      onChange={onChangeFilterHndlr}
                      labelText="Branch Name"
                      floatingLabel
                      formgroupClassName="tw-mb-0"
                      invalid={!!(specialFeeForm.touched.branchId && specialFeeForm.errors.branchId)}
                        error={specialFeeForm.touched.branchId ? specialFeeForm.errors.branchId : ""}
                    />
                  </div>
                )}

                <div className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-2">
                  <SelectInput
                    name="branchCurriculumId"
                    value={specialFeeForm.values.branchCurriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={brchCurriculumResp?.data}
                    formgroupClassName="tw-mb-0"
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>

                <div className="tw-col-span-6 sm:tw-col-span-3 lg:tw-col-span-1 tw-flex tw-items-center tw-relative">
                  <div
                    onClick={toggleAdvanceFilter}
                    className="tw-relative tw-flex tw-items-center tw-gap-2 tw-bg-gray-100 tw-p-2 tw-rounded-md hover:tw-bg-gray-200 tw-cursor-pointer"
                  >
                    <FilterSvg height="18px" width="18px" />
                    <span className="tw-text-sm">Filters</span>

                    {count > 0 && (
                      <span className="tw-absolute -tw-top-2 -tw-right-2 tw-text-xs tw-text-white tw-bg-emerald-500 tw-rounded-full tw-px-2 tw-py-0.5">
                        {count}
                      </span>
                    )}
                  </div>

                  {showClearFilterState && (
                    <Button
                      type="button"
                      variant="wrong"
                      onClick={clearFilterHndlr}
                      className="tw-ml-2 tw-text-sm"
                    >
                      Clear filter
                    </Button>
                  )}
                </div>

                <div className="tw-col-span-6 sm:tw-col-span-3 lg:tw-col-span-3 tw-flex lg:tw-justify-end">
                  <DropDownToggle
                    id="special-fee-dropdown"
                    menuOptions={dropDownOptions}
                    btnName="Add New"
                  />
                </div>

              </div>
              </div>
            </div>

            <TableContainer
              columns={specialFeeColumns || []}
              data={Array.isArray(specialFeesList) ? specialFeesList : []}
              divClass="tw-overflow-x-auto tw-mb-3"
              tableClass="tw-w-full tw-border-collapse"
              theadClass="tw-bg-gray-100 tw-text-gray-600 tw-text-sm tw-align-middle"
              showPagination={true}
              totalPages={totalPages}
              totalRecords={totalElements}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageNumber}
              manualSorting={true}
              sortingHandler={sortingHandler}
            />
          {/* </div> */}
        </div>
      </div>

      <ModalContainerUpdated
        id="add-specialfee-modal"
        isOpen={specialFeeModalState.showModal}
        toggle={toggleSpecialFeeModal}
        modalTitle={specialFeeModalState.specialFeeId ? "Update Special Fee" : "Add Special Fee"}
      >
        <AddSpecialFeeModal
          toggle={toggleSpecialFeeModal}
          instituteId={instituteId}
          branchId={branchId || specialFeeForm.values.branchId}
          specialFeeId={specialFeeModalState.specialFeeId}
          editSpecialFeeDetails={specialFeeModalState.modalData}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id = "create-bulk-special-fee"
        isOpen={bulkUploadSepecialFeeModalState.showModal}
        toggle={bulkUploadSepecialFeeCloseModal}
        modalTitle="Special fee Bulk Upload"
      >
        <BulkUploadSepecialFeeModal
          toggle = {bulkUploadSepecialFeeCloseModal}></BulkUploadSepecialFeeModal>
      </ModalContainerUpdated>

      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-book-issuance"
      >
        <AdvanceFilterModal
          appliedFilter={specialFeeForm.values}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>

      <ModalContainerUpdated
        id="specialfee-student"
        isOpen={specialFeeStudentsModalState.showModal}
        toggle={toggleSpecialFeeStudentModalHndlr}
        modalTitle={"Students"}
        modalSize="md"
      >
        <ShowSpecialFeeStudentModal
          studentList={specialFeeStudentsModalState.studentList}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="view-special-fee-modal"
        isOpen={viewTermsModalState.showModal}
        toggle={() => toggleViewTermsModalHndler()}
        modalTitle={"Term Details"}
        modalSize="md"
      >
        <ViewDetailsModal
          modalData={viewTermsModalState.modalData}
          toggle={toggleViewTermsModalHndler}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="download-doc-fee-modal"
        isOpen={downloadDocModalState.showModal}
        toggle={downloadDocCloseModal}
        modalTitle={"Documnets"}
        modalSize="md"
      >
        <DownloadSpecialFeeDocModal
          modalData={downloadDocModalState.modalData}
          toggle={downloadDocCloseModal}
        />
      </ModalContainerUpdated>


      <ConfirmationModal
        id="delete-specialfee-modal"
        isOpen={delSpecialFeeModalState.showModal}
        confirmMessage="Are you sure you want to delete this special fee?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
        isDisble={showApiLoader}
      />
      <ConfirmationModal
        id="update-status-modal"
        isOpen={updateStatusModalState.showModal}
        confirmMessage={`Are you sure you want to ${updateStatusModalState.modalData?.isActive ? "Activate" : "Deactivate"} this special fee?`}
        cancelHndlr={closeUpdateStatusModal}
        confirmHndlr={statusModalSubmitHndler}
        showImgIcon={true}
        iconType={updateStatusModalState.modalData?.isActive ? "approve" : "reject"}
        isDisble={showApiLoader}
        btnClassName={`btn w-sm ${updateStatusModalState.modalData?.isActive ? "btn-success" : "btn-danger"}`}
      />
    </>
  );
};

export default SpecialFee;
