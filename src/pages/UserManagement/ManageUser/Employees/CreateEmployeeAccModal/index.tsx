import { useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ModalContainer,
  NewPhoneInput,
  RadioInputContainer,
  SelectInput,
  Switch,
  TextIconInput,
  TextInput, AutoSearchInput,
  InputCheckbox,
  Button
} from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { selectData1, selectData2 } from "../../helper";
import {
  CreateEmployeeAccModalProps,
  CreateEmployeeFilterhProps,
} from "../../ManageUserTypes";
import { CreateEmployeeData, generateColumns, UserTypeLists } from "./helper";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { shallowEqual } from "react-redux";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { uploadImageFileErrorHndlr } from "../../../../../utility/commonutility";
import { multipleCreateUserAct, singleCreateUserAct } from "../../../../../store/usermanagement/usermanagementactions";
import { getEmployeeByFilterAct, getEmployeeByIdAct } from "../../../../../store/directory/employeemanagement/employeemanagementactions";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { getInstRoleTypeAct } from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
//Utility
import { generateRandomPassword } from "../../../../../utility/commonutility";
//Constants
import { roleTypes } from "../../../../../Components/constants/common";


export function getCreateEmployeeData(initialState?: any) {
  return {
    firstName: "",
    lastName: "",
    email: "",
    refId: "",
    username: "",
    mobile: "",
    roleId: "",
    instituteId: "",
    branchId: "",
    password: "",
    userTypeCreation: "",
    enabled: "true",
    sendLoginDetail: false,
    isOtherEmployee: false,
  }
}

const validationSchema = Yup.object().shape({
  refId: Yup.string().required("Select employee."),
  username: Yup.string().required("User name is required."),
  email: Yup.string().email("Enter valid email.").required("Email id is required."),
  password: Yup.string().required("Password is required.").min(6, 'Password length should be more than 6 letters.'),
  roleId: Yup.string().required("Select role."),
});

const CreateEmployeeAccModal = (props: any) => {
  const [createEmployeeState, setCreateEmployeeState] = useState<any>(() => getCreateEmployeeData());
  const [searchEmployeeState, setSearchEmployeeState] = useState<any>(null);
  const [isOtherEmployeeState, setIsOtherEmployeeState] = useState(false);

  const dispatch = useAppDispatch(), { instRoleTypeListResp, getEmployeesByFilterResp, getEmployeeByIdResp,
    singleCreateUserResp,
    userManagementErrorResp,
    employeeManagementErrorResp } =
    useAppSelector(({ directoryEmployee, userManagement, instituteInfo }) => ({
      getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
      getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
      instRoleTypeListResp: instituteInfo.instRoleTypeListResp,
      singleCreateUserResp: userManagement.singleCreateUserResp,
      employeeManagementErrorResp: directoryEmployee.employeeManagementErrorResp,
      userManagementErrorResp: userManagement.userManagementErrorResp,
    }), shallowEqual);

  const createEmployeeRespRef = useRef<any>({
    prevGetEmployeeByIdResp: getEmployeeByIdResp,
    prevSingleCreateUserResp: singleCreateUserResp,
    prevEmployeeManagementErrorResp: employeeManagementErrorResp,
    prevUserManagementErrorResp: userManagementErrorResp,
  });

  useEffect(() => {
    const { prevGetEmployeeByIdResp, prevSingleCreateUserResp } = createEmployeeRespRef.current;
    if (getEmployeeByIdResp && prevGetEmployeeByIdResp !== getEmployeeByIdResp) {
      const { employeeBasicDetails } = getEmployeeByIdResp;     
      createEmployeeForm.resetForm({
        values: {
          firstName: employeeBasicDetails?.employeeName || "",
          lastName: " ",
          email: employeeBasicDetails?.workEmailId || "",
          refId: employeeBasicDetails?.id,
          username: employeeBasicDetails?.employeeCode,
          mobile: employeeBasicDetails?.contactNo,
          roleId: "",
          instituteId: props.instituteId,
          branchId: props.branchId,
          password: "1234567",
          enabled: "true",
          userTypeCreation: "CODE",
          sendLoginDetail: false,
        }
      })
    } else if (singleCreateUserResp && prevSingleCreateUserResp !== singleCreateUserResp) {
      toast.success("Employee login id's created successfully.");
      props.toggle(true);
    }
    createEmployeeRespRef.current.prevGetEmployeeByIdResp = getEmployeeByIdResp;
    createEmployeeRespRef.current.prevSingleCreateUserResp = singleCreateUserResp;
    createEmployeeRespRef.current.prevEmployeeManagementErrorResp = employeeManagementErrorResp;
    createEmployeeRespRef.current.prevUserManagementErrorResp = userManagementErrorResp;
  }, [getEmployeeByIdResp, singleCreateUserResp]);

  useEffect(() => {
    const { instituteId, isOpen } = props;
    if (isOpen && instituteId) {
      const rolesApiPayload = { instituteId };
      const roleApiParams = { roleType: "EMPLOYEE" };
      dispatch(getInstRoleTypeAct(generateActionPayload("get_inst_role_type", roleApiParams, rolesApiPayload)));
    } else {
      createEmployeeForm.resetForm({
        values: getCreateEmployeeData()
      });
      setSearchEmployeeState(null);
    }
  }, [props.isOpen, props.instituteId]);

  useEffect(() => {
    if (!isOtherEmployeeState) {
      setSearchEmployeeState(null);
    }
  }, [isOtherEmployeeState]);

  const createEmployeeForm = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: createEmployeeState,
    onSubmit: (values) => {
      const params = { roleType: "EMPLOYEE" };
      delete values.userTypeCreation;
      dispatch(singleCreateUserAct(generateActionPayload("create_single_user", params, values)));
    },
  });

  function onInputSearchChange(inputString: any) {
    if (inputString) {
      const params = { searchString: inputString };
      const payload = {
        instituteGroupId: 1,
        instituteId: props.instituteId,
        employeeName: inputString,
        isOtherEmployee: isOtherEmployeeState,
        pageNo: 0,
        pageSize: 100,
        ...(isOtherEmployeeState ? {} : { branchId: props.branchId }),
      };

      dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, payload)));
    }
  }

  function selectEmployeeHndlr(selectedEmployee: any) {
    setSearchEmployeeState(selectedEmployee);
    if (selectedEmployee) {
      const { id } = selectedEmployee;
      dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: id })));
    } else {
      createEmployeeForm.resetForm({
        values: getCreateEmployeeData()
      });
    }
  }

  function generateRandomPwdHndlr() {
    const randomPassword = generateRandomPassword();
    createEmployeeForm.setFieldValue("password", randomPassword);
  }

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedUserType = event.target.value;
    createEmployeeForm.setFieldValue("userTypeCreation", selectedUserType);
    const employeeBasicDetails = getEmployeeByIdResp?.employeeBasicDetails;
    
    let newUsername = "";
    
    if (employeeBasicDetails) {
      switch (selectedUserType) {
        case "EMAIL":
          newUsername = employeeBasicDetails.workEmailId || "";
          break;
        case "PHONE":
          newUsername = employeeBasicDetails.contactNo || "";
          break;
        case "CODE":
          newUsername = employeeBasicDetails.employeeCode || "";
          break;
        default:
          newUsername = employeeBasicDetails.employeeCode || "";
      }
    } else {
       toast.error("Employee details not found.");
    }
    
    createEmployeeForm.setFieldValue("username", newUsername);
  }
  
  return (
    <>
      <ModalContainer
        id="detec-promo-appro-modal"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={props.toggle}
        submitHndlr={createEmployeeForm.handleSubmit}
        cancelHndlr={props.toggle}
        cancelTitle={"Cancel"}
        submitTitle={"Submit"}
        modalSize={"lg"}
        modalBodyClass="p-4"
      >
        <div>
          <div className="tw-grid tw-grid-cols-12 tw-mb-3 tw-gap-x-4">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="userType"
                labelText="User Type"
                value={roleTypes.EMPLOYEE}
                onChange={null}
                isDisabled={true}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-12 md:tw-col-span-6 tw-order-2 md:tw-order-1">
                  <h6 className="tw-font-normal tw-mr-2">Employee Name</h6>
                </div>
                <div className="tw-col-span-12 md:tw-col-span-6 tw-flex tw-justify-end tw-order-1 md:tw-order-2">
                  <InputCheckbox
                    name={"isOtherEmployee"}
                    labelName="Is Other Employee"
                    value={isOtherEmployeeState}
                    onChange={() => setIsOtherEmployeeState((prevState) => !prevState)}
                    formgroupClassName="tw-mb-0"
                  />
                </div>
                <div className="tw-col-span-12 tw-order-3">
                  <AutoSearchInput
                    formgroupClassName="search-box"
                    name="refId"
                    onChange={onInputSearchChange}
                    valueKey="id"
                    labelKey="employeeName"
                    subLabelKey="employeeCode"
                    labelHeader="Employee Code"
                    subLabelHeader="Employee Name"
                    options={Array.isArray(getEmployeesByFilterResp) ? getEmployeesByFilterResp : []}
                    selected={searchEmployeeState}
                    selectedOptionCallbck={selectEmployeeHndlr}
                    invalid={(createEmployeeForm.touched.refId && createEmployeeForm.errors.refId) ? true : false}
                    error={(createEmployeeForm.touched.refId && createEmployeeForm.errors.refId) ? createEmployeeForm.errors.refId : ""}
                  ><i className="ri-search-line search-icon"></i></AutoSearchInput>
                </div>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "30px" }}>
            <p style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>User Info</p>
            <div className="tw-grid tw-grid-cols-12 tw-gap-x-4">
              <div className="tw-col-span-12 lg:tw-col-span-6">
                <TextIconInput
                  name="email"
                  labelText="E-mail"
                  value={createEmployeeForm.values.email}
                  onChange={createEmployeeForm.handleChange}
                  onBlur={createEmployeeForm.handleBlur}
                  invalid={(createEmployeeForm.touched.email && createEmployeeForm.errors.email) ? true : false}
                  error={(createEmployeeForm.touched.email && createEmployeeForm.errors.email) ? createEmployeeForm.errors.email : ""}
                // isDisabled={true}
                >
                  <i className="ri-mail-unread-line"></i>
                </TextIconInput>
              </div>

              <div className="tw-col-span-12 lg:tw-col-span-6">
                <NewPhoneInput
                  name="mobile"
                  labelText="Phone No."
                  value={createEmployeeForm.values.mobile}
                  onChange={createEmployeeForm.handleChange}
                  invalid={(createEmployeeForm.touched.mobile && createEmployeeForm.errors.mobile) ? true : false}
                  error={(createEmployeeForm.touched.mobile && createEmployeeForm.errors.mobile) ? createEmployeeForm.errors.mobile : ""}
                  isDisabled={true}
                />
              </div>

            </div>
          </div>
          <div className="tw-relative tw-inline-block tw-w-full tw-p-5 tw-border tw-border-[#CED4DA] tw-rounded-[6px] tw-mb-8">
            <p className="tw-absolute -tw-top-[11px] tw-px-2 tw-text-[#495057] tw-bg-white">Assign Role</p>
            <div className="tw-grid tw-grid-cols-12 tw-gap-x-4">
              <div className="tw-col-span-12 lg:tw-col-span-6">
                <SelectInput
                  name="roleId"
                  labelText="Role Type"
                  value={createEmployeeForm.values.roleId}
                  onChange={createEmployeeForm.handleChange}
                  onBlur={createEmployeeForm.handleBlur}
                  // valueKey="genderId"
                  // textKey="genderName"
                  // menuItems={[]}
                  valueKey="id"
                  textKey="name"
                  menuItems={instRoleTypeListResp?.data}
                  invalid={(createEmployeeForm.touched.roleId && createEmployeeForm.errors.roleId) ? true : false}
                  error={(createEmployeeForm.touched.roleId && createEmployeeForm.errors.roleId) ? createEmployeeForm.errors.roleId : ""}

                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-3">
                <RadioInputContainer
                  name="enabled"
                  labelText="Status"
                  inputContainerClassName="tw-mt-2"
                  radioOptions={[{ id: "true", name: "Active" }, { id: "false", name: "Inactive" }]}
                  value={createEmployeeForm.values.enabled}
                  onChange={createEmployeeForm.handleChange}
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-3">
                <SelectInput
                  name="userTypeCreation"
                  labelText="User Name Type"
                  menuItems={UserTypeLists}
                  value={createEmployeeForm.values.userTypeCreation}
                  onChange={handleUserTypeChange}
                  valueKey="name"
                  textKey="name"
                  error={createEmployeeForm.errors.userTypeCreation}
                />
              </div>
            </div>
          </div>
          <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "33px" }}>
            <p style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Manage Access</p>
            <div className="tw-grid tw-grid-cols-12 tw-gap-x-4">
              <div className="tw-col-span-12 lg:tw-col-span-6">
                <TextInput
                  name="username"
                  labelText="User Name"
                  value={createEmployeeForm.values.username}
                  onChange={createEmployeeForm.handleChange}  
                  invalid={(createEmployeeForm.touched.username && createEmployeeForm.errors.username) ? true : false}
                  error={(createEmployeeForm.touched.username && createEmployeeForm.errors.username) ? createEmployeeForm.errors.username : ""}
                  isDisabled={true}
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-6">
                <TextInput
                  name="password"
                  labelText="Password"
                  value={createEmployeeForm.values.password}
                  onChange={createEmployeeForm.handleChange}
                  onBlur={createEmployeeForm.handleBlur}
                  invalid={(createEmployeeForm.touched.password && createEmployeeForm.errors.password) ? true : false}
                  error={(createEmployeeForm.touched.password && createEmployeeForm.errors.password) ? createEmployeeForm.errors.password : ""}
                />
              </div>
            </div>
            <div className="tw-grid tw-grid-cols-12">
              <div className={"tw-col-span-3 tw-ml-auto"}>
                <Button
                  variant="primary"
                  onClick={generateRandomPwdHndlr}>
                  <i className="ri-add-fill tw-mr-1 tw-align-bottom"></i> Generate Password</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-col-span-12 lg:tw-col-span-4">
        </div>

        <div className="tw-grid tw-grid-cols-12">
          <div className="tw-col-span-12">
            <Switch
              attributeId="sendLoginDetail"
              checked={createEmployeeForm.values.sendLoginDetail}
              onChangeHndlr={createEmployeeForm.handleChange}
              labelName={"Email Login Details to this user"}
              className="form-switch-sm form-check-left tw-w-[70%]"
            />
          </div>
        </div>
      </ModalContainer>
    </>
  );
};

export default CreateEmployeeAccModal;
