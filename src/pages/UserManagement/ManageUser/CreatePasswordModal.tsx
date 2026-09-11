import { useFormik } from "formik";
import React, { useMemo, useState } from "react";
import {
  ModalContainer,
  SelectInput,
  TextInput,
} from "../../../Components/Common";
import classnames from "classnames";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  generateColumnsForCreatePassword,
  selectData1,
  selectData2,
} from "./helper";
import {
  CreatePasswordAccModalProps,
  CreatePasswordProps,
  CreateStudentAccModalProps,
  ManageStudentFilterProps,
} from "./ManageUserTypes";
import { CreateStudentData, generateColumns } from "./helper";
import { Link } from "react-router-dom";

const initialValues: CreatePasswordProps = {
  newPassword: "",
  confirmPassword: "",
};

const CreatePasswordAccModal = (props: CreatePasswordAccModalProps) => {
  const [createPasswordFilterState, setCreatePasswordFilterState] =
    useState<CreatePasswordProps>(initialValues);
  const [passwordState, setPasswordState] = useState<boolean>(false);
  const [confirmPasswordState, setConfirmPasswordState] =
    useState<boolean>(false);
  const CreatePasswordFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: createPasswordFilterState,
    onSubmit: (values) => { },
  });
  function passwordHndlr() {
    setPasswordState(!passwordState);
  }
  function confirmPasswordHndlr() {
    setConfirmPasswordState(!confirmPasswordState);
  }
  const loginForm = useFormik({
    enableReinitialize: false,
    initialValues: initialValues,
    // validationSchema,
    onSubmit: (values) => {
      //   redirectSetupHndlr();
    },
  });
  //   const roleColumns = useMemo(() => generateColumnsForCreatePassword(), []);

  return (
    <>
      <ModalContainer
        id="detec-promo-appro-modal"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={props.toggle}
        submitHndlr={CreatePasswordFilterForm.handleSubmit}
        cancelHndlr={props.toggle}
        cancelTitle={"Cancel"}
        submitTitle={"Save"}
        modalSize={"md"}
        modalBodyClass="p-0"
      >
        <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-px-6 tw-mb-6">
          <div className="tw-col-span-12">
            {/* <div className="float-end">
              <Link to="/#" className="text-muted">
                Forgot password?
              </Link>
            </div> */}
            <div className="tw-mb-4">
              <label className="tw-block tw-mb-1 tw-font-medium" htmlFor="password-input">
                New Password
              </label>
              <div className="tw-relative">
                <TextInput
                  name="newPassword"
                  value={loginForm.values.newPassword}
                  onChange={loginForm.handleChange}
                  formgroupClassName="tw-mb-0"
                  placeHolder="Enter new password"
                  inputType={passwordState ? "text" : "password"}
                />
                {/* <input
                  type={passwordState ? "text" : "password"}
                  className="form-control pe-5"
                  placeholder="Enter password"
                  name="newPassword"
                  onChange={loginForm.handleChange}
                  value={loginForm.values.newPassword}
                  // invalid={
                  //   loginForm.touched.password && loginForm.errors.password
                  //     ? true
                  //     : false
                  // }
                /> */}
                {/* {loginForm.touched.password && loginForm.errors.password && (
                <FormFeedback type="invalid">
                  {loginForm.errors.password}
                </FormFeedback>
              )} */}
                <button
                  onClick={passwordHndlr}
                  className="tw-absolute tw-right-0 tw-top-0 tw-h-full tw-flex tw-items-center tw-px-3 tw-text-gray-400 hover:tw-text-gray-600"
                  type="button"
                  id="password-addon-new"
                >
                  <i
                    className={classnames("tw-align-middle", {
                      "ri-eye-fill": passwordState,
                      "ri-eye-off-fill": !passwordState,
                    })}
                  ></i>
                </button>
              </div>
            </div>
            
            <div className="tw-mb-2">
                <label className="tw-block tw-mb-1 tw-font-medium" htmlFor="password-input">
                Confirm Password
                </label>
                <div className="tw-relative">
                <TextInput
                    name="confirmPassword"
                    value={loginForm.values.confirmPassword}
                    onChange={loginForm.handleChange}
                    formgroupClassName="tw-mb-0"
                    placeHolder="Confirm password"
                    inputType={confirmPasswordState ? "text" : "password"}
                />
                {/* <input
                type={confirmPasswordState ? "text" : "password"}
                className="form-control pe-5"
                placeholder="Confirm password"
                name="confirmPassword"
                onChange={loginForm.handleChange}
                value={loginForm.values.confirmPassword}
              // invalid={
              //   loginForm.touched.password && loginForm.errors.password
              //     ? true
              //     : false
              // }
              /> */}
              {/* {loginForm.touched.password && loginForm.errors.password && (
                <FormFeedback type="invalid">
                  {loginForm.errors.password}
                </FormFeedback>
              )} */}
                <button
                    onClick={confirmPasswordHndlr}
                    className="tw-absolute tw-right-0 tw-top-0 tw-h-full tw-flex tw-items-center tw-px-3 tw-text-gray-400 hover:tw-text-gray-600"
                    type="button"
                    id="password-addon-confirm"
                >
                    <i
                    className={classnames("tw-align-middle", {
                        "ri-eye-fill": confirmPasswordState,
                        "ri-eye-off-fill": !confirmPasswordState,
                    })}
                    ></i>
                </button>
                </div>
            </div>
          </div>
          <div className="tw-col-span-12">
            <Link to="/#" className="tw-text-info tw-underline hover:tw-text-info-dark tw-text-sm">
              Generate Password
            </Link>
          </div>
          {/* <div className="col-xs-12 col-md-12 col-lg-4">
            <div className="search-box">
              <TextInput
                name="search"
                value={CreatePasswordFilterForm.values.search}
                onChange={CreatePasswordFilterForm.handleChange}
                inputClassName="bg-light"
                formgroupClassName="mb-0"
                placeHolder="Search..."
              />
            </div>
          </div> */}

          {/* <div className="col-xs-12 col-md-12 col-lg-4">
            <SelectInput
              name="class"
              value={CreatePasswordFilterForm.values.class}
              onChange={CreatePasswordFilterForm.handleChange}
              menuItems={selectData1}
              valueKey="classType"
              textKey="classType"
              inputClassName="bg-light"
              formgroupClassName="mb-0"
            />
          </div>

          <div className="col-xs-12 col-md-12 col-lg-4">
            <SelectInput
              name="section"
              value={CreatePasswordFilterForm.values.section}
              onChange={CreatePasswordFilterForm.handleChange}
              menuItems={selectData2}
              valueKey="sectionType"
              textKey="sectionType"
              inputClassName="bg-light"
              formgroupClassName="mb-0"
            />
          </div> */}
        </div>
      </ModalContainer>
    </>
  );
};

export default CreatePasswordAccModal;
