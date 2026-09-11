import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { TextInput } from "../../../Components/Common";
import * as Yup from "yup";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  editCompanyDetailsListAct,
  saveCompanyDetailsListAct,
} from "../../../store/directory/employeemanagement/employeemanagementactions";
import Button from "../../../Components/Common/Button";

const initialValues = {
  shortName: "",
  companyName: "",
};

const validationSchema = Yup.object().shape({
  shortName: Yup.string().required("Short Name is required."),
  companyName: Yup.string().required("Company Name is required."),
});

const CompanyDetailsModal = (props: any) => {
  const dispatch = useDispatch();

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    getCompanyDetailsListByIdResp,
  }: any = useAppSelector(
    ({ globalData, directoryEmployee, appData }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      getCompanyDetailsListByIdResp:
        directoryEmployee.getCompanyDetailsListByIdResp,
    }),
    shallowEqual
  );

  const addCompanyDetailsRef = useRef<any>({
    prevGetcCompanyDetailsListByIdResp: getCompanyDetailsListByIdResp,
  });

  useEffect(() => {
    const { prevGetCompanyDetailsListByIdResp } =
      addCompanyDetailsRef.current || {};
    if (
      getCompanyDetailsListByIdResp &&
      prevGetCompanyDetailsListByIdResp !== getCompanyDetailsListByIdResp
    ) {
      if (props?.id) {
        const { shortName, companyName } = getCompanyDetailsListByIdResp || {};
        addCompanyDetailsForm.setValues((prev: any) => ({
          ...prev,
          shortName,
          companyName,
        }));
      }
    }

    addCompanyDetailsRef.current.prevGetCompanyDetailsListByIdResp =
      getCompanyDetailsListByIdResp;
  }, [getCompanyDetailsListByIdResp]);

  const addCompanyDetailsForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (props?.id) {
        dispatch(
          editCompanyDetailsListAct(
            generateActionPayload(
              "edit_company_details_list",
              { id: props?.id },
              { ...values, branchId }
            )
          )
        );
      } else {
        dispatch(
          saveCompanyDetailsListAct(
            generateActionPayload("save_company_details", undefined, {
              instituteId,
              branchId,
              ...values,
            })
          )
        );
      }
    },
  });

  return (
    <>
      <form onSubmit={addCompanyDetailsForm.handleSubmit}>
        <div className="tw-p-4">
          <div className="tw-grid tw-grid-cols-1 tw-gap-3">

            <div className="tw-w-full md:tw-w-1/2"></div>

            <div className="tw-w-full">
              <TextInput
                name="companyName"
                labelText="Company Name"
                labelClass="required"
                value={addCompanyDetailsForm.values.companyName}
                onChange={addCompanyDetailsForm.handleChange}
                onBlur={addCompanyDetailsForm.handleBlur}
                invalid={
                  addCompanyDetailsForm.touched.companyName &&
                    addCompanyDetailsForm.errors.companyName
                    ? true
                    : false
                }
                error={
                  addCompanyDetailsForm.touched.companyName &&
                    addCompanyDetailsForm.errors.companyName
                    ? addCompanyDetailsForm.errors.companyName
                    : ""
                }
              />
            </div>

            <div className="tw-w-full">
              <TextInput
                name="shortName"
                labelText="Short Name"
                labelClass="required"
                value={addCompanyDetailsForm.values.shortName}
                onChange={addCompanyDetailsForm.handleChange}
                invalid={
                  addCompanyDetailsForm.touched.shortName &&
                    addCompanyDetailsForm.errors.shortName
                    ? true
                    : false
                }
                error={
                  addCompanyDetailsForm.touched.shortName &&
                    addCompanyDetailsForm.errors.shortName
                    ? addCompanyDetailsForm.errors.shortName
                    : ""
                }
              />
            </div>

          </div>

          <div className="tw-flex tw-flex-wrap tw-justify-end tw-gap-2 tw-mt-6 tw-mb-1">
            <Button
              type="button"
              variant="secondary"
              onClick={props.toggle}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              onClick={(event: any) => {
                addCompanyDetailsForm.handleSubmit(event);
              }}
              disabled={showApiLoader}
            >
              {props.id ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </form>

    </>
  );
};

export default CompanyDetailsModal;
