import { useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ModalContainer,
  NewPhoneInput,
  RadioInputContainer,
  SelectInput,
  Switch,
  TextIconInput,
  TextInput, AutoSearchInputUpdated,
  Button
} from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { selectData1, selectData2 } from "../../helper";
import {
  CreateEmployeeAccModalProps,
  CreateEmployeeFilterhProps,
} from "../../ManageUserTypes";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { shallowEqual } from "react-redux";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { uploadImageFileErrorHndlr } from "../../../../../utility/commonutility";
import { multipleCreateUserAct } from "../../../../../store/usermanagement/usermanagementactions";
import { getEmployeeByIdAct } from "../../../../../store/directory/employeemanagement/employeemanagementactions";
import { getAllParentsListAct } from "../../../../../store/directory/studentmanagement/studentmanagementactions";

import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { getInstRoleTypeAct } from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
//Utility
import { generateRandomPassword } from "../../../../../utility/commonutility";
//Constants
import { roleTypes } from "../../../../../Components/constants/common";


export function getCreateParentData(initialState?: any) {
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
    enabled: "true",
    sendLoginDetail: false
  }
}

const validationSchema = Yup.object().shape({
  refId: Yup.string().required("Select parent."),
  username: Yup.string().required("User name is required."),
  password: Yup.string().required("Password is required.").min(6, 'Password length should be more than 6 letters.'),
  email: Yup.string().email("Please enter valid email.").required("Email id is required."),
  roleId: Yup.string().required("Select role."),
});

const CreateParentAccModal = (props: any) => {
  const [createParentDataState, setCreateParentState] = useState<any>(() => getCreateParentData());
  const [searchParentState, setSearchParentState] = useState<any>(null);

  const dispatch = useAppDispatch(), { instRoleTypeListResp, allParentsListResp,
    multipleCreateUserResp,
    userManagementErrorResp,
    studentManagementErrorResp } =
    useAppSelector(({ directoryStudent, userManagement, instituteInfo }) => ({
      allParentsListResp: directoryStudent.allParentsListResp,
      instRoleTypeListResp: instituteInfo.instRoleTypeListResp,
      multipleCreateUserResp: userManagement.multipleCreateUserResp,
      studentManagementErrorResp: directoryStudent.studentManagementErrorResp,
      userManagementErrorResp: userManagement.userManagementErrorResp,
    }), shallowEqual);

  const createParentRespRef = useRef<any>({
    prevMultipleCreateUserResp: multipleCreateUserResp,
    prevStudentManagementErrorResp: studentManagementErrorResp,
    prevUserManagementErrorResp: userManagementErrorResp,
  });


  useEffect(() => {
    const { prevStudentManagementErrorResp, prevMultipleCreateUserResp } = createParentRespRef.current;
    if (multipleCreateUserResp && prevMultipleCreateUserResp !== multipleCreateUserResp) {
      toast.success("Parent login id's created successfully.");
      props.toggle(true);
    } else if (studentManagementErrorResp && prevStudentManagementErrorResp !== studentManagementErrorResp) {
      const { details } = studentManagementErrorResp;
      toast.error(details);
    }
    createParentRespRef.current.prevMultipleCreateUserResp = multipleCreateUserResp;
    createParentRespRef.current.prevStudentManagementErrorResp = studentManagementErrorResp;
    createParentRespRef.current.prevUserManagementErrorResp = userManagementErrorResp;
  }, [multipleCreateUserResp]);

  useEffect(() => {
    const { instituteId, isOpen } = props;
    if (isOpen && instituteId) {
      const rolesApiPayload = { instituteId };
      const roleApiParams = { roleType: roleTypes.PARENT };
      dispatch(getInstRoleTypeAct(generateActionPayload("get_inst_role_type", roleApiParams, rolesApiPayload)));
    } else {
      createEmployeeForm.resetForm({
        values: getCreateParentData()
      });
      setSearchParentState(null);
    }
  }, [props.isOpen, props.instituteId]);


  const createEmployeeForm = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: createParentDataState,
    onSubmit: (values) => {
      const params = { roleType: roleTypes.PARENT };
      dispatch(multipleCreateUserAct(generateActionPayload("create_multiple_user", params, { users: [values] })));
    },
  });

  function onInputSearchChange(inputString: any) {
    if (inputString) {
      const params = { searchString: inputString };
      dispatch(getAllParentsListAct(generateActionPayload("get_all_parents", params)));
    }
  }

  function selectEmployeeHndlr(selectedParent: any) {
    setSearchParentState(selectedParent);
    if (selectedParent) {
      createEmployeeForm.resetForm({
        values: {
          firstName: selectedParent?.fatherName || "",
          lastName: " ",
          email: "",
          refId: selectedParent?.id,
          username: `P${selectedParent?.id}`,
          mobile: selectedParent?.fatherContactNo,
          roleId: "",
          instituteId: props.instituteId,
          branchId: props.branchId,
          password: "1234567",
          enabled: "true",
          sendLoginDetail: false,
        }
      });
    }
  }

  function generateRandomPwdHndlr() {
    const randomPassword = generateRandomPassword();
    createEmployeeForm.setFieldValue("password", randomPassword);
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
                value={roleTypes.PARENT}
                onChange={null}
                isDisabled={true}
              // invalid={(createEmployeeForm.touched.userType && createEmployeeForm.errors.userType) ? true : false}
              // error={(createEmployeeForm.touched.userType && createEmployeeForm.errors.userType) ? createEmployeeForm.errors.userType : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <AutoSearchInputUpdated
                formgroupClassName="search-box"
                name="refId"
                labelText="Parent Details"
                // onChange={(e: any) => setSearchInputState(e.target.value)}
                onChange={onInputSearchChange}
                // onBlur={createEmployeeForm.handleBlur}
                valueKey="id"
                labelHeader="Father Name"
                labelKey="fatherName"
                subLabelHeader="Aadhar Number"
                subLabelKey="fatherDocumentNumber"
                options={allParentsListResp?.data}
                selected={searchParentState}
                selectedOptionCallbck={selectEmployeeHndlr}
                invalid={(createEmployeeForm.touched.refId && createEmployeeForm.errors.refId) ? true : false}
                error={(createEmployeeForm.touched.refId && createEmployeeForm.errors.refId) ? createEmployeeForm.errors.refId : ""}
              ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
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
          <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "33px" }}>
            <p style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Assign Role</p>
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
              <div className="tw-col-span-12 lg:tw-col-span-6">
                <RadioInputContainer
                  name="enabled"
                  labelText="Status"
                  inputContainerClassName="tw-mt-2"
                  radioOptions={[{ id: "true", name: "Active" }, { id: "false", name: "Inactive" }]}
                  value={createEmployeeForm.values.enabled}
                  onChange={createEmployeeForm.handleChange}
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
              <div className="tw-col-span-auto tw-ml-auto">
                <Button className="tw-ml-auto tw-bg-[#F4F7FE] tw-text-[#777777] tw-border-0"
                  onClick={generateRandomPwdHndlr}>
                  <i className="ri-add-fill tw-mr-1 tw-align-bottom"></i> Generate Password</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-col-span-12 lg:tw-col-span-4">
          {/* <SelectInput
              name="section"
              value={createEmployeeForm.values.section}
              onChange={createEmployeeForm.handleChange}
              menuItems={selectData2}
              valueKey="sectionType"
              textKey="sectionType"
              inputClassName="bg-light"
              formgroupClassName="mb-0"
            /> */}
        </div>
        {/* </div> */}

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

export default CreateParentAccModal;
