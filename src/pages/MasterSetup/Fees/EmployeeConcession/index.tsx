import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, ConfirmationModal, SelectInput, TextInput } from "../../../../Components/Common";
import { useFormik } from "formik";
import {
  EmployeeConcessionModalType,
  EmployeeConcessionProps,
} from "./EmployeeConcessionTypes";
import {
  generateColumns,
  selectData2,
} from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import EmployeeConcessionModal from "./EmployeeConcessionModal";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { deleteInstEmployeeConcessionAct, getInstConcessionDepartmentsAct, getInstEmployeeConcessionAct } from "../../../../store/mastersettings/feesettings/feesettingsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { default as DeleteSvg } from "../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialValues: EmployeeConcessionProps = {
  search: "",
  instituteDepartments: "Campus",
  branchType: "Department",
  experience: "Experince",
};

const EmployeeConcession: React.FC<any> = ({ instituteId }) => {

  //   const [
  //     higherClassEligibilityFilterState,
  //     setHigherClassEligibilityFilterState,
  //   ] = useState<HigherClassEligibilityFilterhProps>(initialValues);

  //   const [higherClassModalState, setHigherClassModalState] =
  //     useState<HigherClassModalType>({
  //       showModal: false,
  //       branchId: "",
  //     });

  //   const toggleHigherClassModal = () => {
  //     setHigherClassModalState((prevState) => ({
  //       ...prevState,
  //       showModal: !prevState.showModal,
  //     }));
  //   };

  const [employeeConcessionFilterState, setEmployeeConcessionFilterState] =
    useState<EmployeeConcessionProps>(initialValues);

  const [employeeConcessionModalState, setEmployeeConcessionModalState] =
    useState<EmployeeConcessionModalType>({
      showModal: false,
      employeeConcessionId: "",
      modalData: undefined,
    });
  const [delEmployeeConcessionModalState, setDelEmployeeConcessionModalState] = useState<any>({
    showModal: false,
    EmployeeConcessionId: ""
  })

  const toggleEmployeeConcessionModal = (apiCall?: any) => {
    setEmployeeConcessionModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
      modalData: undefined
    }));
    if (typeof (apiCall) === "boolean" && apiCall) {
      getEmployeeConssionApiCall();
    }
  };

  const dispatch = useAppDispatch();

  function getEmployeeConssionApiCall(otherProps?: any) {
    const payload = { instituteId, ...otherProps };
    dispatch(getInstEmployeeConcessionAct(generateActionPayload("get_inst_employee_concession", {}, payload)));
  }

  const { instConcessionDepartmentsResp, instEmployeeConcession, deleteInstEmployeeConcessionResp, updateInstEmployeeConcession, addInstEmployeeConcession, instFeeSettingError } = useAppSelector(({ instAcademics, instFeeSettings }) => ({
    instConcessionDepartmentsResp: instFeeSettings.instConcessionDepartmentsResp,
    instEmployeeConcession: instFeeSettings.instEmployeeConcession,
    deleteInstEmployeeConcessionResp: instFeeSettings.deleteInstEmployeeConcessionResp,
    addInstEmployeeConcession: instFeeSettings.addInstEmployeeConcession,
    updateInstEmployeeConcession: instFeeSettings.updateInstEmployeeConcession,
    instFeeSettingError: instFeeSettings.instFeeSettingError
  }), shallowEqual);
  const employeeConcessionRespRef = useRef<any>({
    prevDelInstEmployeeConcessionResp: deleteInstEmployeeConcessionResp,
    prevAddInstEmployeeConcession: addInstEmployeeConcession,
    prevUpdateInstEmployeeConcession: updateInstEmployeeConcession,
    prevInstFeeSettingError: instFeeSettingError
  });
  useEffect(() => {
    if (instituteId && !instConcessionDepartmentsResp) {
      const payload = { instituteId, pageNo: 0, pageSize: 100 };
      dispatch(getInstConcessionDepartmentsAct(generateActionPayload("get_concession_dept", undefined, payload)));
    }
  }, [instituteId, instConcessionDepartmentsResp]);

  useEffect(() => {
    getEmployeeConssionApiCall();
  }, [])
  useEffect(() => {
    const { prevDelInstEmployeeConcessionResp, prevInstFeeSettingError } = employeeConcessionRespRef.current;
    if (deleteInstEmployeeConcessionResp && prevDelInstEmployeeConcessionResp !== deleteInstEmployeeConcessionResp) {
      setDelEmployeeConcessionModalState((prevState: any) => ({ ...prevState, showModal: false, EmployeeConcessionId: "" }));
      getEmployeeConssionApiCall();
      toast.success("Employee Concession deleted successfully.");
    }
    else if (instFeeSettingError && instFeeSettingError !== prevInstFeeSettingError) {
      const { details }: any = instFeeSettingError;
      toast.error(details);
    }
    employeeConcessionRespRef.current.prevDelInstEmployeeConcessionResp = deleteInstEmployeeConcessionResp;
    employeeConcessionRespRef.current.prevInstFeeSettingError = instFeeSettingError;
  }, [deleteInstEmployeeConcessionResp, instFeeSettingError]);
  const changeHandler = (e: any) => {
    employeeConcessionFilterForm.handleChange(e);
    const { name, value } = e.target;
    getEmployeeConssionApiCall({ instituteDepartments: e.target.value, [name]: value })
  }
  const { data: concessionDepartments } = instConcessionDepartmentsResp || {};
  const { data: employeeConcession, pageNumber, totalPages, totalElements } = instEmployeeConcession || {};

  function paginationHndlr(paginationInfo: IPaginationState) {
    getEmployeeConssionApiCall(paginationInfo);
  }
  //   const [chequeHistoryModalState, setChequeHistoryModalState] =
  //     useState<IChequeHistory>({
  //       showModal: false,
  //       branchId: "",
  //     });

  //   const toggleChequeHistoryModal = () => {
  //     setChequeHistoryModalState((prevState) => ({
  //       ...prevState,
  //       showModal: !prevState.showModal,
  //     }));
  //   };

  const employeeConcessionFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: employeeConcessionFilterState,
    onSubmit: (values) => {
    },
  });


  //   const [studentLedgerState, setStudentLedgerState] =
  //     useState<StudentLedgerTypes>(initialValues);

  //   const StudentLedgerForm = useFormik({
  //     enableReinitialize: true,
  //     initialValues: studentLedgerState,
  //     onSubmit: (values) => {
  //     },
  //   });
  function editEmployeeConcessionHndlr(event: any) {
    const employeeConcessionId = event.currentTarget.getAttribute("data-id"),
      modalData: any = instEmployeeConcession?.data.find((item: any) => item.feeEmployeeConcessionId === Number(employeeConcessionId));

    if (modalData) {
      setEmployeeConcessionModalState((prevState: any) => ({ ...prevState, showModal: true, employeeConcessionId, modalData }));
    }
  }
  function deleteEmployeeConcessionHndlr(event: any) {
    const EmployeeConcessionId = event.currentTarget.getAttribute("data-id");
    if (EmployeeConcessionId)
      setDelEmployeeConcessionModalState((prevState: any) => ({ ...prevState, showModal: true, EmployeeConcessionId }));
  }
  function delModalCancelHndlr() {
    setDelEmployeeConcessionModalState((prevState: any) => ({ ...prevState, showModal: false }));
  }
  function delModalSubmitHndlr() {
    const { EmployeeConcessionId } = delEmployeeConcessionModalState;
    dispatch(deleteInstEmployeeConcessionAct(generateActionPayload("del_inst_employee_concession_dept", { employeeId: EmployeeConcessionId })));
  }
  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <EditSvg className="d-inline-block" color="#878A99" />,
        actionName: "Edit",
        onClickHndlr: editEmployeeConcessionHndlr,
      },
      {
        id: "delete",
        actionIcon: <DeleteSvg className="d-inline-block" />,
        actionName: "Delete",
        onClickHndlr: deleteEmployeeConcessionHndlr,
      },
    ], [instEmployeeConcession]);

  const roleColumns = useMemo(() => generateColumns(menuOptions), [instEmployeeConcession]);
  return (
    <>
      <div className="tw-py-3 tw-px-3">
        <form onClick={e => e.preventDefault()}>
          <div className="tw-grid tw-grid-cols-12 tw-gap-3">
            <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4">
              <div className="tw-relative search-box">
                <TextInput
                  name="search"
                  value={employeeConcessionFilterForm.values.search}
                  onChange={employeeConcessionFilterForm.handleChange}
                  // inputClassName="bg-light"
                  formgroupClassName="tw-mb-0"
                  placeHolder="Search..."
                />

                <i className="ri-search-line tw-absolute tw-left-3 tw-top-[10px] tw-text-gray-400"></i>
              </div>
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
              <SelectInput
                name="instituteDepartments"
                value={
                  employeeConcessionFilterForm.values.instituteDepartments
                }
                onChange={changeHandler}
                menuItems={concessionDepartments}
                valueKey="departmentId"
                textKey="departmentName"
                // inputClassName="bg-light"
                formgroupClassName="tw-mb-0"
                defaultSelect="Department"
              />
            </div>

            {/* <div className="col-2">
              <SelectInput
                name="branchType"
                value={employeeConcessionFilterForm.values.branchType}
                onChange={employeeConcessionFilterForm.handleChange}
                menuItems={selectData1}
                valueKey="branchType"
                textKey="branchType"
                inputClassName="bg-light"
                formgroupClassName="mb-0"
              />
            </div> */}

            <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
              <SelectInput
                name="experience"
                value={employeeConcessionFilterForm.values.experience}
                onChange={changeHandler}
                menuItems={selectData2}
                valueKey="experience"
                textKey="experience"
                // inputClassName="bg-light"
                formgroupClassName="tw-mb-0"
              />
            </div>
            <div className="tw-col-span-12 lg:tw-col-span-2 tw-flex tw-justify-end">
              <Button
                variant="primary"
                onClick={toggleEmployeeConcessionModal}
              >
                <i className="ri-add-line tw-mr-2" />
                Add New
              </Button>
            </div>
          </div>
        </form>
      </div>
      <TableContainer
        columns={roleColumns || []}
        data={employeeConcession ? employeeConcession : []}
        divClass="table-responsive tw-mb-1"
        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
        // showCheckbox={true}
        showPagination={true}
        totalPages={totalPages}
        totalRecords={totalElements}
        callbackPaginationHndlr={paginationHndlr}
        currentPageNumber={pageNumber}
      />
      <EmployeeConcessionModal
        isOpen={employeeConcessionModalState.showModal}
        toggle={toggleEmployeeConcessionModal}
        modalTitle={"Employee Concession"}
        instituteId={instituteId}
        instituteName={"Employee Concession"}
        branchId={employeeConcessionModalState.employeeConcessionId}
        modalData={employeeConcessionModalState.modalData}
        departments={concessionDepartments ? concessionDepartments : []}
        editBranchDetails={""}
      />
      <ConfirmationModal
        id="delete-co-modal"
        isOpen={delEmployeeConcessionModalState.showModal}
        confirmMessage="Are you sure you want to delete this employee concession record ?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
      />
      {/* <ToastContainer /> */}
    </>
  );
};

export default EmployeeConcession;
