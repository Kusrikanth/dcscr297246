import React, { useRef, useState, useEffect } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import * as Yup from "yup"
import { RadioInputContainer, SelectInput, Switch, TextInput } from "../../../../Components/Common";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editHostelFeeNameParticularsAct, getHostelFeeNameAct, saveHostelFeeNameParticularsAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import { getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { feeTypeMenu } from "./helper";
import Button from "../../../../Components/Common/Button";

interface IExaminationMarksProps {
  id: any;
  isOpen: boolean,
  toggle: any,
  modalTitle?: string,
}

const initialValues = {
  academicYearId: "",
  branchCurriculumId: "",
  hostelId: "",
  feeNameId: "",
  feeType: "",
  includeInChallan: "NO",
  employeeApplicable: "NO",
  allowRefunds: false,
  uniformSlab: false,
  allowStudentConcession: false,
  allowEmployeeConcession: false,
};

const validationSchema = Yup.object().shape({
  subjects: Yup.array().of(
    Yup.object().shape({
      existingSubId: Yup.string().required("Please select an existing subject"),
      replaceSubId: Yup.string().required("Please select a replacement subject"),
    })
  ),
});

const FeeParticularModel: React.FC<IExaminationMarksProps> = (props) => {

  const dispatch = useAppDispatch();
  
  const getHostelFeeNames = (otherProps?: any) => {
    const payload = {
      curriculumId: feeNameModalForm.values?.branchCurriculumId,
      branchId, hostelId: feeNameModalForm.values?.hostelId, ...otherProps
    }
    if (payload.curriculumId) {
      dispatch(getHostelFeeNameAct(generateActionPayload("get_hostel_fee_names", undefined, payload)));
    }
  }

  const { currentInstIdResp: instituteId, getHostelFeeNameResp, getHostelFeeNameParticularsListByIdResp, currentBranchIdResp: branchId, feeCategoriesResp, brchCurriculumResp, showApiLoader, academicYearListResp, getHostelDetailsResp } = useAppSelector(({ instAcademics, branchAcademics, instFeeSettings,
    masterFeeSettings, hostelSettings, hostelStuLedger, appData, globalData }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      feeTypesResp: masterFeeSettings.feeTypesResp,
      academicYearListResp: instAcademics.academicYearListResp,
      feeParticularByIdResp: masterFeeSettings.feeParticularByIdResp,
      addFeeParticularResp: masterFeeSettings.addFeeParticularResp,
      updateFeeParticularResp: masterFeeSettings.updateFeeParticularResp,
      feeCategoriesResp: masterFeeSettings.feeCategoriesResp,
      getHostelDetailsResp: hostelSettings.getHostelDetailsResp,
      getHostelFeeNameResp: hostelSettings.getHostelFeeNameResp,
      getHostelFeeNameParticularsListByIdResp: hostelSettings.getHostelFeeNameParticularsListByIdResp,
      showApiLoader: globalData.showApiLoader,
    }), shallowEqual);

  const addLibraryDetailsRef = useRef<any>({
    prevGetLibraryDetailsListByIdResp: getHostelFeeNameParticularsListByIdResp,
  })
  useEffect(() => {
    const { prevGetLibraryDetailsListByIdResp } = addLibraryDetailsRef.current || {};

    if (
      getHostelFeeNameParticularsListByIdResp &&
      prevGetLibraryDetailsListByIdResp !== getHostelFeeNameParticularsListByIdResp
    ) {
      if (props?.id) {
        const {
          academicYearId,
          hostelId,
          feeName,
          feeType,
          curriculumName,
          isEmployeeApplicable,
          isChallanIncluded,
          isAllowRefunds,
          isAllowEmployeeConcession,
          isAllowStudentConcession,
          isUniformSlab,
        } = getHostelFeeNameParticularsListByIdResp;

        const curriculumId = (brchCurriculumResp?.data || []).find(
          (item: any) => item.curriculumName === curriculumName
        )?.branchCurriculumId;

        feeNameModalForm.setValues((prev: any) => ({
          ...prev,
          academicYearId,
          branchCurriculumId: curriculumId || "",
          hostelId,
          feeType,
          feeNameId: feeName,
          includeInChallan: isChallanIncluded === "YES" ? "YES" : "NO",
          employeeApplicable: isEmployeeApplicable === "YES" ? "YES" : "NO",
          allowRefunds: isAllowRefunds === "YES",
          allowEmployeeConcession: isAllowEmployeeConcession === "YES",
          allowStudentConcession: isAllowStudentConcession === "YES",
          uniformSlab: isUniformSlab === "YES",
        }));
      }
    }
    addLibraryDetailsRef.current.prevGetLibraryDetailsListByIdResp = getHostelFeeNameParticularsListByIdResp;
  }, [getHostelFeeNameParticularsListByIdResp, getHostelFeeNameResp]);


  useEffect(() => {
    if (academicYearListResp) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      feeNameModalForm.setFieldValue("academicYearId", yearId);
      getCurriculumApiCall({ academicYearId: yearId });
    }
  }, [academicYearListResp,branchId,instituteId]);

  const feeNameModalForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const params = { hostelFeeTypeId: props.id };
      const { feeNameId, feeType, } = values;
      const transformedPayload = {
        hostelId: values.hostelId ? Number(values.hostelId) : undefined,
        curriculumId: values.branchCurriculumId ? Number(values.branchCurriculumId) : undefined,
        feeName: feeNameId,
        feeType: feeType,
        isEmployeeApplicable: values.employeeApplicable === "YES" ? "YES" : "NO",
        isChallanIncluded: values.includeInChallan === "YES" ? "YES" : "NO",
        isAllowRefunds: values.allowRefunds ? "YES" : "NO",
        isAllowEmployeeConcession: values.allowEmployeeConcession ? "YES" : "NO",
        isAllowStudentConcession: values.allowStudentConcession ? "YES" : "NO",
        isUniformSlab: values.uniformSlab ? "YES" : "NO",
      };
      if (props?.id) {
        const params = { hostelFeeTypeId: props.id };
        dispatch(
          editHostelFeeNameParticularsAct(
            generateActionPayload("edit_hostel_fee_particulars", params, transformedPayload)
          )
        );
      }
      else {
        const savePayload = {
          ...transformedPayload,
          instituteDepartmentId: "3",
          academicYearId: values.academicYearId,
          instituteId,
          branchId,
        };
        dispatch(
          saveHostelFeeNameParticularsAct(
            generateActionPayload("save_hostel_fee_particulars", undefined, savePayload)
          )
        );
      }
    },
  });


  useEffect(() => {
    if (feeNameModalForm.values?.hostelId) {
      getHostelFeeNames({ hostelId: feeNameModalForm.values.hostelId });
    }
  }, [feeNameModalForm.values?.hostelId]);

  useEffect(() => {
    const { feeType } = feeNameModalForm.values;

    if (feeType === "Term Wise Fee") {
      feeNameModalForm.setFieldValue("feeNameId", "HOSTEL FEE");
    } else if (feeType === "One Time Fee") {
      feeNameModalForm.setFieldValue("feeNameId", "CAUTION DEPOSIT FEE");
    } else {
      feeNameModalForm.setFieldValue("feeNameId", "");
    }
  }, [feeNameModalForm.values.feeType]);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: feeNameModalForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const filterHandler = (event: any) => {
    const { name, value } = event.target || {};
    if (name === "academicYearId") {
      feeNameModalForm.setValues((prevState: any) => ({ ...prevState, [name]: value, feeNameId: "", feeType: "", roomTypeId: "" }));
      getCurriculumApiCall({ [name]: value })
    }
    else {
      feeNameModalForm.setValues((prevState: any) => ({ ...prevState, [name]: value }));
    }
  }

  return (
    <>
      <form>
        <div className="tw-flex tw-flex-col tw-p-4">
          <div className="tw-grid tw-grid-cols-2 tw-gap-4">

            <div>
              <SelectInput
                name="academicYearId"
                value={feeNameModalForm.values.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearListResp?.data}
                formgroupClassName="tw-mb-0"
                valueKey="academicYearId"
                textKey="academicYearName"
                labelText="Academic Year"
                labelClass="required"
              />
            </div>

            <div>
              <SelectInput
                name="branchCurriculumId"
                labelText="Curriculum"
                value={feeNameModalForm.values.branchCurriculumId}
                onChange={feeNameModalForm.handleChange}
                menuItems={brchCurriculumResp?.data}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelClass="required"
                invalid={!!(feeNameModalForm.touched.branchCurriculumId && feeNameModalForm.errors.branchCurriculumId)}
                error={
                  feeNameModalForm.touched.branchCurriculumId &&
                  feeNameModalForm.errors.branchCurriculumId
                }
              />
            </div>

            <div>
              <SelectInput
                name="hostelId"
                labelText="Hostel Name"
                labelClass="required"
                value={feeNameModalForm.values.hostelId}
                onChange={filterHandler}
                menuItems={(Array.isArray(getHostelDetailsResp?.data) && getHostelDetailsResp?.data) || []}
                valueKey="hostelId"
                textKey="hostelName"
                formgroupClassName="tw-mb-3"
                isDisabled={!!props?.id}
                invalid={!!(feeNameModalForm.touched.hostelId && feeNameModalForm.errors.hostelId)}
                error={
                  feeNameModalForm.touched.hostelId &&
                  feeNameModalForm.errors.hostelId
                }
              />
            </div>

            <div>
              <SelectInput
                name="feeType"
                labelText="Fee Type"
                labelClass="required"
                value={feeNameModalForm.values.feeType}
                onChange={filterHandler}
                menuItems={feeTypeMenu}
                valueKey="feeType"
                textKey="feeType"
                formgroupClassName="tw-mb-0"
                invalid={!!(feeNameModalForm.touched.feeType && feeNameModalForm.errors.feeType)}
                error={
                  feeNameModalForm.touched.feeType &&
                  feeNameModalForm.errors.feeType
                }
              />
            </div>

            <div>
              <TextInput
                name="feeNameId"
                labelText="Fee Name"
                value={feeNameModalForm.values.feeNameId}
                onChange={filterHandler}
                formgroupClassName="tw-mb-0"
                isDisabled={true}
              />
            </div>

            <div>
              <RadioInputContainer
                name="includeInChallan"
                labelText="Include in Challan"
                radioOptions={[
                  { id: "YES", name: "Yes" },
                  { id: "NO", name: "No" }
                ]}
                inputContainerClassName="tw-mt-2"
                value={feeNameModalForm.values.includeInChallan}
                onChange={feeNameModalForm.handleChange}
              />
            </div>

            <div>
              <RadioInputContainer
                name="employeeApplicable"
                labelText="Employee Applicable"
                radioOptions={[
                  { id: "YES", name: "Yes" },
                  { id: "NO", name: "No" }
                ]}
                inputContainerClassName="tw-mt-2"
                value={feeNameModalForm.values.employeeApplicable}
                onChange={feeNameModalForm.handleChange}
              />
            </div>

            <div>
              <Switch
                attributeId="allowRefunds"
                labelName="Allow Refund"
                checked={feeNameModalForm.values.allowRefunds}
                onChangeHndlr={feeNameModalForm.handleChange}
                className="tw-mb-3 tw-mt-1"
              />
            </div>

            <div>
              <Switch
                attributeId="uniformSlab"
                labelName="Uniform Slab"
                checked={feeNameModalForm.values.uniformSlab}
                onChangeHndlr={feeNameModalForm.handleChange}
                className="tw-mb-3 tw-mt-1"
              />
            </div>

            <div>
              <Switch
                attributeId="allowStudentConcession"
                labelName="Allow Student Concession"
                checked={feeNameModalForm.values.allowStudentConcession}
                onChangeHndlr={feeNameModalForm.handleChange}
                className="tw-mb-3"
              />
            </div>

            <div>
              <Switch
                attributeId="allowEmployeeConcession"
                labelName="Allow Employee Concession"
                checked={feeNameModalForm.values.allowEmployeeConcession}
                onChangeHndlr={feeNameModalForm.handleChange}
                className="tw-mb-3"
              />
            </div>
          </div>

          <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={props.toggle}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={(event: any) => feeNameModalForm.handleSubmit(event)}
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

export default FeeParticularModel;
