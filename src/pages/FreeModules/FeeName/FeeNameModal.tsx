import React, { useEffect, useState, useRef } from "react";
import { shallowEqual } from "react-redux";
import {
   RadioInput, SelectInput, TextInput, RadioInputContainer,
  InputCheckbox, Switch
} from "../../../Components/Common";

import { useFormik } from "formik";
import { toast } from "react-toastify";
// Formik validation
import * as Yup from "yup";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";

import { addFeeParticularAct, getFeeParticularByIdAct, updateFeeParticularAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

import { getFeeCategoriesAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import { getFeeTypesAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
//Helper
import { studentCategoryOptions } from "./helper";
import { getBranchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import Button from "../../../Components/Common/Button";

function getTrueFalseOptions(fieldValue: any) {
  if (typeof fieldValue === "string") {
    return fieldValue === "YES";
  }
  return false;
}


function getYesNoOption(fieldValue: any) {
  if (typeof fieldValue === "boolean") {
    return fieldValue ? "YES" : "NO";
  }
  return "NO";
}


function getAddEditFeeName(editData?: any): any {
  return {
    allowEmployeeConcession: getTrueFalseOptions(editData?.allowEmployeeConcession),
    particularName: editData?.particularName || "",
    feeTypeId: editData?.feeTypeId || "",
    includeInChallan: editData?.includeInChallan || "NO",
    branchCurriculumId: editData?.branchCurriculumId || "",
    instituteDeptId: editData?.instituteDeptId || "",
    studentCategory: editData?.studentCategory || undefined,
    allowRefunds: getTrueFalseOptions(editData?.allowRefunds),
    allowStudentConcession: getTrueFalseOptions(editData?.allowStudentConcession),
  }
}

const validationSchema = Yup.object().shape({
  branchCurriculumId: Yup.string().required("Curriculum required."),
  particularName: Yup.string().required("Fee particular required."),
  feeTypeId: Yup.string().required("Fee type required."),
  instituteDeptId: Yup.string().required("Category required."),
  studentCategory: Yup.string().required("Student category required.")
});


const FeeNameModal: React.FC<any> = (props) => {
  const [allConcessionState, setAllConcessionState] = useState(false);
  const [feeNameState, setFeeNameState] = useState<any>(getAddEditFeeName(null));

  const dispatch = useAppDispatch();
  const { feeParticularByIdResp, addFeeParticularResp, updateFeeParticularResp, feeTypesResp, feeCategoriesResp, brchCurriculumResp,showApiLoader, academicYearListResp } = useAppSelector(({ instAcademics, branchAcademics, instFeeSettings,
    masterFeeSettings, globalData }) => ({
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      feeTypesResp: masterFeeSettings.feeTypesResp,
      academicYearListResp: instAcademics.academicYearListResp,
      feeParticularByIdResp: masterFeeSettings.feeParticularByIdResp,
      addFeeParticularResp: masterFeeSettings.addFeeParticularResp,
      updateFeeParticularResp: masterFeeSettings.updateFeeParticularResp,
      feeCategoriesResp: masterFeeSettings.feeCategoriesResp,
      showApiLoader:globalData.showApiLoader,
    }), shallowEqual);

  const feeNameRespRef = useRef<any>({
    prevFeeParticularByIdResp: feeParticularByIdResp,
    prevAddFeeParticularResp: addFeeParticularResp,
    prevUpdateFeeParticularResp: updateFeeParticularResp
  });

  useEffect(() => {
    const { prevFeeParticularByIdResp, prevAddFeeParticularResp, prevUpdateFeeParticularResp } = feeNameRespRef.current;
    if (feeParticularByIdResp && prevFeeParticularByIdResp !== feeParticularByIdResp) {
      const updateFormState = getAddEditFeeName(feeParticularByIdResp);
      feeNameModalForm.resetForm({
        values: {...updateFormState,academicYearId : props?.academicYearId}
      })
    }
    else if (addFeeParticularResp && prevAddFeeParticularResp !== addFeeParticularResp) {
      props.toggle(true);
      toast.success("Fee particular added successfully.");
    } else if (updateFeeParticularResp && prevUpdateFeeParticularResp !== updateFeeParticularResp) {
      props.toggle(true);
      toast.success("Fee particular updated successfully.");
    }
    feeNameRespRef.current.prevFeeParticularByIdResp = feeParticularByIdResp;
    feeNameRespRef.current.prevAddFeeParticularResp = addFeeParticularResp;
    feeNameRespRef.current.prevUpdateFeeParticularResp = updateFeeParticularResp;
  }, [feeParticularByIdResp, addFeeParticularResp, updateFeeParticularResp]);

  useEffect(() => {
    if (props.isOpen) {
      const { instituteId } = props;
      if(props.feeParticularId){
        const params = { feeParticularId: props.feeParticularId };
        dispatch(getFeeParticularByIdAct(generateActionPayload("get_fee_particular_byid", params)));
      }else{
        feeNameModalForm.setFieldValue("academicYearId", props.academicYearId);
        getCurriculumApiCall({ academicYearId : props.academicYearId });
      }
      if (instituteId) {
        const params = { instituteId };
        dispatch(getFeeCategoriesAct(generateActionPayload("get_fee_categories", undefined, params)));
        dispatch(getFeeTypesAct(generateActionPayload("get_fee_types", undefined, params)));
      }
    }
  }, [props.isOpen, props.feeParticularId]);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: feeNameModalForm.values.academicYearId,branchId : props.branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
}

  const feeNameModalForm = useFormik({
    enableReinitialize: true,
    initialValues: feeNameState,
    validationSchema,
    onSubmit: (values) => {
      const { allowRefunds, allowEmployeeConcession, allowStudentConcession, ...otherPayload } = values,
        payload = Object.assign(otherPayload, {
          allowRefunds: getYesNoOption(allowRefunds),
          allowEmployeeConcession: getYesNoOption(allowEmployeeConcession),
          allowStudentConcession: getYesNoOption(allowStudentConcession),
          instituteId: props.instituteId,
          branchId: props.branchId
        });
        delete payload.academicYearId;
      if (props.feeParticularId) {
        const params = { feeParticularId: props.feeParticularId };
        const { branchCurriculumId, ...updatePayload } = payload;
        dispatch(updateFeeParticularAct(generateActionPayload("update_fee_particular", params, updatePayload)));
      } else {
        dispatch(addFeeParticularAct(generateActionPayload("add_fee_particular", undefined, payload)));
      }
    },
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    feeNameModalForm.setValues((prevState: any) => ({
      ...prevState, [name]: value, branchCurriculumId: ""
    }));
    getCurriculumApiCall({ [name]: value });
  }

  function onChangeConcessionHndlr(event: any) {
    const { name, checked } = event.target;
    if (name === "all") {
      feeNameModalForm.setValues((prevState: any) => ({
        ...prevState, allowStudentConcession: checked,
        allowEmployeeConcession: checked
      }))
      setAllConcessionState(checked);
    }
    else if (name === "allowStudentConcession") {
      feeNameModalForm.setValues((prevState: any) => ({
        ...prevState, [name]: checked
      }))
      setAllConcessionState(checked && feeNameModalForm.values.allowEmployeeConcession || false);
    } else {
      feeNameModalForm.setValues((prevState: any) => ({
        ...prevState, [name]: checked
      }))
      setAllConcessionState(checked && feeNameModalForm.values.allowStudentConcession || false);
    }
  }

  return (
    <>
  
      <div className="tw-flex tw-flex-col tw-p-4">

        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

          <div className="tw-col-span-6">
            <SelectInput
              name="academicYearId"
              value={feeNameModalForm.values.academicYearId}
              onChange={handleChange}
              menuItems={academicYearListResp?.data}
              formgroupClassName="tw-mb-0"
              valueKey="academicYearId"
              textKey="academicYearName"
              labelText="Academic Year"
              labelClass="required"
              isDisabled={!!props.feeParticularId}
            />
          </div>

          <div className="tw-col-span-6">
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
              error={feeNameModalForm.touched.branchCurriculumId ? feeNameModalForm.errors.branchCurriculumId : ""}
              isDisabled={!!props.feeParticularId}
            />
          </div>

          <div className="tw-col-span-6">
            <SelectInput
              name="instituteDeptId"
              labelText="Select Category"
              menuItems={feeCategoriesResp?.feeCategoryVOList}
              value={feeNameModalForm.values.instituteDeptId}
              onChange={feeNameModalForm.handleChange}
              valueKey="id"
              textKey="name"
              labelClass="required"
              invalid={!!(feeNameModalForm.touched.instituteDeptId && feeNameModalForm.errors.instituteDeptId)}
              error={feeNameModalForm.touched.instituteDeptId ? feeNameModalForm.errors.instituteDeptId : ""}
            />
          </div>

          <div className="tw-col-span-6">
            <TextInput
              name="particularName"
              labelText="Particular Name"
              value={feeNameModalForm.values.particularName}
              onChange={feeNameModalForm.handleChange}
              labelClass="required"
              invalid={!!(feeNameModalForm.touched.particularName && feeNameModalForm.errors.particularName)}
              error={feeNameModalForm.touched.particularName ? feeNameModalForm.errors.particularName : ""}
            />
          </div>

          <div className="tw-col-span-6">
            <SelectInput
              name="feeTypeId"
              labelText="Fee Type"
              value={feeNameModalForm.values.feeTypeId}
              onChange={feeNameModalForm.handleChange}
              menuItems={feeTypesResp}
              valueKey="feeTypeId"
              textKey="feeTypeName"
              labelClass="required"
              invalid={!!(feeNameModalForm.touched.feeTypeId && feeNameModalForm.errors.feeTypeId)}
              error={feeNameModalForm.touched.feeTypeId ? feeNameModalForm.errors.feeTypeId : ""}
            />
          </div>

          <div className="tw-col-span-6">
            <SelectInput
              name="studentCategory"
              labelText="Student Category"
              value={feeNameModalForm.values.studentCategory}
              onChange={feeNameModalForm.handleChange}
              menuItems={studentCategoryOptions}
              valueKey="id"
              textKey="name"
              labelClass="required"
              invalid={!!(feeNameModalForm.touched.studentCategory && feeNameModalForm.errors.studentCategory)}
              error={feeNameModalForm.touched.studentCategory ? feeNameModalForm.errors.studentCategory : ""}
            />
          </div>

          <div className="tw-col-span-6">
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
              isDisabled={true}
            />
          </div>

          <div className="tw-col-span-12">
            <Switch
              attributeId="allowRefunds"
              labelName="Allow Refund"
              checked={feeNameModalForm.values.allowRefunds}
              onChangeHndlr={feeNameModalForm.handleChange}
              className="tw-mb-3 tw-mt-1"
            />
          </div>

          <div className="tw-col-span-6">
            <Switch
              attributeId="allowStudentConcession"
              labelName="Allow Student Concession"
              checked={feeNameModalForm.values.allowStudentConcession}
              onChangeHndlr={feeNameModalForm.handleChange}
              className="tw-mb-3"
            />
          </div>

          <div className="tw-col-span-6">
            <Switch
              attributeId="allowEmployeeConcession"
              labelName="Allow Employee Concession"
              checked={feeNameModalForm.values.allowEmployeeConcession}
              onChangeHndlr={feeNameModalForm.handleChange}
              className="tw-mb-3"
            />
          </div>

        </div>

        <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-6">
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
            {props.feeParticularId ? "Update" : "Submit"}
          </Button>
        </div>

      </div>

     

    </>
  );
};

export default FeeNameModal;

