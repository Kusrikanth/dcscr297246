import { useFormik } from "formik";
import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { SelectInput, TextInput, ConfirmationModal, Button } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import FeeNameModal from "./FeeNameModal";
import { addNewOpenModal, FeeNameFilterProps } from "./feeNameTypes";
import {
  generateColumns,
} from "./helper";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { deleteInstFeeNameAct, getInstFeeNamesAct } from "../../../../store/mastersettings/feesettings/feesettingsactions";
import { getInstCurriculumAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { getInstFeeDepartmentsAct } from "../../../../store/mastersettings/feesettings/feesettingsactions";

//Types
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";

const initialValues: any = {
  // search: "",
  instituteCurriculumId: "",
  instituteFeeDepartmentId: "",
};

const FeeDetails: React.FC<any> = ({ instituteId }) => {
  const [feeNameFilterState, setFeeNameFilterState] =
    useState<any>(initialValues);

  const [addFeeDetailsModalState, setAddFeeDetailsModalState] =
    useState<any>({
      showModal: false,
      feeNameId: "",
      modalData: undefined,
    });
  const [delFeeDetailsModalState, setDelFeeDetailsModalState] = useState<any>({
    showModal: false,
    feeNameId: ""
  });
  const [filterState, setFilterState] = useState<any>({
    instituteDepartmentId: "",
    instituteCurriculumId: "",
    searchString: ""
  });
  const dispatch = useAppDispatch();
  const { instFeeNamesResp, deleteInstFeeNameResp, instFeeDepartmentsResp, instCurriculumResp, instFeeSettingError } = useAppSelector(({ instAcademics, instFeeSettings }) => ({
    instFeeNamesResp: instFeeSettings.instFeeNamesResp,
    deleteInstFeeNameResp: instFeeSettings.deleteInstFeeNameResp,
    instFeeDepartmentsResp: instFeeSettings.instFeeDepartmentsResp,
    instCurriculumResp: instAcademics.instCurriculumResp,
    instFeeSettingError: instFeeSettings.instFeeSettingError
  }), shallowEqual);

  const feeDetailsRespRef = useRef<any>({
    prevDeleteInstFeeNameResp: deleteInstFeeNameResp,
    prevInstFeeSettingError: instFeeSettingError
  });

  useEffect(() => {
    const { prevDeleteInstFeeNameResp, prevInstFeeSettingError } = feeDetailsRespRef.current;
    if (deleteInstFeeNameResp && prevDeleteInstFeeNameResp !== deleteInstFeeNameResp) {
      setDelFeeDetailsModalState((prevState: any) => ({ ...prevState, showModal: false, feeNameId: "" }));
      getFeeNameApiCall();
      toast.success("Fee name deleted successfully.");
    } else if (instFeeSettingError && instFeeSettingError !== prevInstFeeSettingError) {
      const { details }: any = instFeeSettingError;
      toast.error(details || "Something went wrong.");
    }
    feeDetailsRespRef.current.prevDeleteInstFeeNameResp = deleteInstFeeNameResp;
    feeDetailsRespRef.current.prevInstFeeSettingError = instFeeSettingError;
  }, [deleteInstFeeNameResp, instFeeSettingError]);

  useEffect(() => {
    getFeeNameApiCall();
  }, []);
  useEffect(() => {
    if (instituteId && !instCurriculumResp) {
      const payload = { instituteId, pageNo: 0, pageSize: 100,orderBy:"asc",sortBy:"curriculumName" };
      dispatch(getInstCurriculumAct(generateActionPayload("get_inst_curriculum", undefined, payload)));
    }
  }, [instituteId, instCurriculumResp]);

  useEffect(() => {
    if (instituteId && !instFeeDepartmentsResp) {
      const payload = { instituteId, pageNo: 0, pageSize: 100 };
      dispatch(getInstFeeDepartmentsAct(generateActionPayload("get_inst_fee_dept", undefined, payload)));
    }
  }, [instituteId, instFeeDepartmentsResp]);


  const toggleFeeDetailsModal = useCallback((apiCall?: boolean) => {
    setAddFeeDetailsModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
    if (typeof (apiCall) === "boolean" && apiCall) {
      getFeeNameApiCall();
    }
  }, [instituteId, instFeeNamesResp]);

  function addFeeNameModalHndlr() {
    setAddFeeDetailsModalState((prevState: any) => ({
      ...prevState, showModal: true,
      feeNameId: "", modalData: undefined
    }));
  }


  function editFeeDetailsHndlr(event: any) {
    const feeNameId = event.currentTarget.getAttribute("data-id"),
      modalData: any = instFeeNamesResp?.data.find((item: any) => item.instituteFeeNameId === Number(feeNameId));
    if (modalData) {
      setAddFeeDetailsModalState((prevState: any) => ({ ...prevState, showModal: true, feeNameId, modalData }));
    }
  }

  function deleteFeeDetailsHndlr(event: any) {
    const feeNameId = event.currentTarget.getAttribute("data-id");
    if (feeNameId)
      setDelFeeDetailsModalState((prevState: any) => ({ ...prevState, showModal: true, feeNameId }));
  }

  const menuOptions = useMemo((): IOptionsHrtl[] => ([{
    id: "edit",
    actionIcon: <i className="tw-text-[#1bb3a6] ri-pencil-fill tw-text-base"></i>,
    actionName: "Edit",
    onClickHndlr: editFeeDetailsHndlr,
  }, {
    id: "delete",
    actionIcon: <i className="tw-text-red-500 ri-delete-bin-5-fill tw-text-base"></i>,
    actionName: "Delete",
    onClickHndlr: deleteFeeDetailsHndlr
  }]), [instFeeNamesResp]);

  function delModalCancelHndlr() {
    setDelFeeDetailsModalState((prevState: any) => ({ ...prevState, showModal: false }));
  }
  function delModalSubmitHndlr() {
    const { feeNameId } = delFeeDetailsModalState;
    dispatch(deleteInstFeeNameAct(generateActionPayload("delete_inst_fee_name", { feeNameId })));
  }

  function paginationHndlr(paginationInfo: any) {
    getFeeNameApiCall(paginationInfo);
  }


  function getFeeNameApiCall(otherProps?: any) {
    const payload = { instituteId, ...filterState, ...otherProps };
    dispatch(getInstFeeNamesAct(generateActionPayload("get_inst_fee_names", undefined, payload)));
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    getFeeNameApiCall({ [name]: value });
  }


  const roleColumns = useMemo(() => generateColumns(menuOptions), [instFeeNamesResp]),
    { data: feeNames, pageNumber, totalPages, totalElements } = instFeeNamesResp || {},
    { data: feeDepartments } = instFeeDepartmentsResp || {},
    { data: instCurriculumList } = instCurriculumResp || {};
  return (
    <>
      <div className="tw-py-3 tw-px-3">
        <div className="tw-grid tw-grid-cols-12 tw-gap-3">
          <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4">
            <div className="tw-relative search-box">
              <TextInput
                name="searchString"
                value={filterState.searchString}
                onChange={onChangeFilterHndlr}
                // inputClassName="bg-light"
                formgroupClassName="tw-mb-0"
                placeHolder="Search..."
              />

              <i className="ri-search-line tw-absolute tw-left-3 tw-top-[10px] tw-text-gray-400"></i>
            </div>
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
            <SelectInput
              name="instituteCurriculumId"
              value={filterState.instituteCurriculumId}
              onChange={onChangeFilterHndlr}
              menuItems={instCurriculumList}
              valueKey="instituteCurriculumId"
              textKey="curriculumName"
              defaultSelect="Curriculum"
              // inputClassName="bg-light"
              formgroupClassName="tw-mb-0"
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
            <SelectInput
              name="instituteDepartmentId"
              value={filterState.instituteDepartmentId}
              onChange={onChangeFilterHndlr}
              menuItems={feeDepartments}
              valueKey="departmentId"
              textKey="departmentName"
              defaultSelect="Department"
              // inputClassName="bg-light"
              formgroupClassName="tw-mb-0"
            />
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-2 tw-flex tw-justify-end">
            <Button
              variant="primary"
              onClick={addFeeNameModalHndlr}
            >
              <i className="ri-add-line tw-mr-2" />
              Add New
            </Button>
          </div>
        </div>
      </div>
      <TableContainer
        columns={roleColumns || []}
        data={Array.isArray(feeNames) ? feeNames : []}
        divClass="table-responsive tw-mb-1"
        tableClass="table-nowrap"
        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
        // showCheckbox={true}
        showPagination={true}
        totalPages={totalPages}
        totalRecords={totalElements}
        callbackPaginationHndlr={paginationHndlr}
        currentPageNumber={pageNumber}

      />
      <FeeNameModal
        isOpen={addFeeDetailsModalState.showModal}
        toggle={toggleFeeDetailsModal}
        modalTitle={addFeeDetailsModalState.feeNameId ? "Edit Fee Name" : "Add Fee Name"}
        instituteId={instituteId}
        feeNameId={addFeeDetailsModalState.feeNameId}
        editFeeDetails={addFeeDetailsModalState.modalData}
      />

      <ConfirmationModal
        id="delete-feename-modal"
        isOpen={delFeeDetailsModalState.showModal}
        confirmMessage="Are you sure you want to delete this fee name ?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
      />
    </>
  );
};

export default FeeDetails;
