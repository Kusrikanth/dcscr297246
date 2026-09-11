import React, { useEffect, useState } from "react";

import { default as ConfirmationIcon } from "../../../../assets/imagesdps/academics/confirmation-icon.svg?react";

import { shallowEqual, useDispatch } from "react-redux";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { generateActionPayload } from "../../../../utility/reduxutility";
import {  SelectInput, TextIconInput } from "../../../../Components/Common";
import { panIntResCancelAdmissionAct } from "../../../../store/FrontDesk/Interview/interviewactions";
import { useAppSelector } from "../../../../hooks/storehook";
import { getInstBranchesAct } from "../../../../store/mastersettings/branch/branchactions";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  remarks: "",
  recommendedCampusId : "",
  curriculumId: "",
  classId: "",
}

const ConfirmationModalIntRes = (props: any) => {

const {resultId , isOpen} = props;
const dispatch = useDispatch();
const validationSchema = Yup.object().shape({
  remarks: Yup.string().required('Remarks is required'),
  recommendedCampusId: Yup.string().nullable(),
  curriculumId: Yup.string().when("recommendedCampusId", {
  is: (val: any) => !!val, 
  then: (schema) => schema.required("Curriculum is required."),
  otherwise: (schema) => schema.notRequired(),
  }),
  classId: Yup.string().when("recommendedCampusId", {
  is: (val: any) => !!val,
  then: (schema) => schema.required("Class is required."),
  otherwise: (schema) => schema.notRequired(),
  }),
})

const {
  currentInstIdResp: instituteId,
  currentBranchIdResp: branchId,
  branchListResp,
  showApiLoader,
  brchCurriculumResp,
  branchClassResp
} = useAppSelector(
  ({ appData, branch , globalData,branchAcademics }) => ({
    currentInstIdResp: appData.currentInstIdResp,
    currentBranchIdResp: appData.currentBranchIdResp,
    branchListResp: branch.branchListResp,
    showApiLoader : globalData.showApiLoader,
    brchCurriculumResp: branchAcademics.brchCurriculumResp,
    branchClassResp: branchAcademics.branchClassResp,
  }),
  shallowEqual
);

const CancelAdmissionForm = useFormik({
  initialValues,
  validationSchema,
  enableReinitialize: true,
  onSubmit: (values) => {
    const payload = {
      reason:values?.remarks ,
      recommendedCampusId : values.recommendedCampusId || "",
      curriculumId:values?.curriculumId,
      recommendedClassId:values?.classId
    }
    dispatch(panIntResCancelAdmissionAct(generateActionPayload('pan_int_res_cancel_admission',{panelInterviewDetailId : resultId},{...payload}
    )))
  },
});
    
  useEffect(() => {
    
    if(!isOpen){
      CancelAdmissionForm.resetForm();
    }else{
      const payload = {
        pageSize: 100,
        pageNo: 0,
        instituteId,
      };
      dispatch(
        getInstBranchesAct(
          generateActionPayload("get_inst_branches", undefined, payload, {
            hideLoader: true,
          })
        )
      );
    }
  }, [isOpen])

  function fetchCurriculumList(otherProps?: any) {
      const payload = {
        academicYearId: props.selectedAcademicyearId,
        branchId:CancelAdmissionForm.values.recommendedCampusId,
        pageNo: 0,
        pageSize: 100,
        sortBy: "curriculumName",
        orderBy: "asc",
        ...otherProps,
      };
  
      dispatch(
        getBranchCurriculumAct(
          generateActionPayload("get_brch_curriculum", undefined, payload)
        )
      );
    }
  
    function fetchClassNamesList(otherProps?: any) {
      const {  curriculumId,recommendedCampusId } = CancelAdmissionForm.values;
      const payload = {
        branchId:recommendedCampusId,
        academicYearId : props.selectedAcademicyearId,
        curriculumId,
        sortBy: "classSequence",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
        ...otherProps,
      };
  
      dispatch(
        getBranchClassAct(
          generateActionPayload("get_brch_curriculum_class", undefined, payload)
        )
      );
    }

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target;
  
      if (name === "recommendedCampusId") {
        CancelAdmissionForm.setValues((prev: any) => ({
          ...prev,
          [name]: value,
          curriculumId: "",
          classId: "",
          remarks: `The student has requested a transfer to ${branchListResp?.data?.find((item: any) => +item?.branchId === +value )?.branchName} campus.`,
        }));
        if (value) {
          fetchCurriculumList({
            academicYearId: props.selectedAcademicyearId,
            branchId: value,
          });
        }
        else if(!value){
            CancelAdmissionForm.setValues((prev: any) => ({...prev,
            [name]: value,
            curriculumId: "",
            classId: "",
            remarks: "" }))
          }
      } else if (name === "curriculumId") {
        CancelAdmissionForm.setValues((prev: any) => ({
          ...prev,
          [name]: value,
          classId: "",
        }));
        if (value) {
          fetchClassNamesList({
            curriculumId: value,
          });
        }
      } else {
        CancelAdmissionForm.setValues((prev: any) => ({
          ...prev,
          [name]: value,
        }));
      }
    }

  const campusChangeHndler = (event:React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      CancelAdmissionForm.setFieldValue(name, value);
      CancelAdmissionForm.setFieldValue("remarks",`The student has requested a transfer to ${branchListResp?.data?.find((item: any) => +item?.branchId === +value )?.branchName} campus.`);
    }

    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};  
    
  return (
    <>
      <div style={{ padding: "1.25rem" }}>
        <div className="tw-flex tw-flex-col tw-items-center">

          <div className="tw-flex tw-mb-3">
            <ConfirmationIcon width={"70px"} height="70px" />
          </div>

          <h5 className="tw-flex-grow tw-mb-2">Are you sure?</h5>

          <span className="tw-flex-grow tw-font-normal tw-mb-3">
            {`You want to Cancel this Admission !`}
          </span>

          <div className="tw-grid tw-grid-cols-12 tw-w-full">

            <div className="tw-col-span-12 tw-flex tw-justify-center">
              <SelectInput
                name="recommendedCampusId"
                value={CancelAdmissionForm.values?.recommendedCampusId}
                onChange={filterHandler}
                menuItems={branchListResp?.data?.filter(
                  (item: any) => +item?.branchId !== +branchId
                )}
                valueKey="branchId"
                textKey="branchName"
                labelText="Recommended Campus"
                floatingLabel
                inputClassName="tw-w-full"
                formgroupClassName="tw-w-[70%] tw-mb-3"
                invalid={
                  CancelAdmissionForm.touched.recommendedCampusId &&
                    CancelAdmissionForm.errors.recommendedCampusId
                    ? true
                    : false
                }
                error={
                  CancelAdmissionForm.touched.recommendedCampusId &&
                    CancelAdmissionForm.errors.recommendedCampusId
                    ? CancelAdmissionForm.errors.recommendedCampusId
                    : ""
                }
              />
            </div>

            {CancelAdmissionForm.values.recommendedCampusId && (
              <>
                <div className="tw-col-span-12 tw-flex tw-justify-center">
                  <SelectInput
                    name="curriculumId"
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    menuItems={curriculumTypes}
                    value={CancelAdmissionForm.values.curriculumId}
                    onChange={filterHandler}
                    formgroupClassName="tw-w-[70%] tw-mb-3"
                    labelText="Curriculum"
                    floatingLabel
                    invalid={
                      CancelAdmissionForm.touched.curriculumId &&
                        CancelAdmissionForm.errors.curriculumId
                        ? true
                        : false
                    }
                    error={
                      CancelAdmissionForm.touched.curriculumId &&
                        CancelAdmissionForm.errors.curriculumId
                        ? CancelAdmissionForm.errors.curriculumId
                        : ""
                    }
                  />
                </div>

                <div className="tw-col-span-12 tw-flex tw-justify-center">
                  <SelectInput
                    name="classId"
                    valueKey="id"
                    textKey="shortName"
                    menuItems={classTypes || []}
                    value={CancelAdmissionForm.values.classId}
                    onChange={filterHandler}
                    formgroupClassName="tw-w-[70%] tw-mb-3"
                    labelText="Class"
                    floatingLabel
                    invalid={
                      CancelAdmissionForm.touched.classId &&
                        CancelAdmissionForm.errors.classId
                        ? true
                        : false
                    }
                    error={
                      CancelAdmissionForm.touched.classId &&
                        CancelAdmissionForm.errors.classId
                        ? CancelAdmissionForm.errors.classId
                        : ""
                    }
                  />
                </div>
              </>
            )}

            <div className="tw-col-span-12 tw-flex tw-justify-center">
              <TextIconInput
                name="remarks"
                value={CancelAdmissionForm.values.remarks}
                onChange={CancelAdmissionForm.handleChange}
                invalid={
                  CancelAdmissionForm.touched.remarks &&
                    CancelAdmissionForm.errors.remarks
                    ? true
                    : false
                }
                error={
                  CancelAdmissionForm.touched.remarks &&
                    CancelAdmissionForm.errors.remarks
                    ? CancelAdmissionForm.errors.remarks
                    : ""
                }
                inputClassName="tw-w-full"
                placeHolder="Reason.."
                formgroupClassName="tw-w-[70%]"
                maxLength={500}
              >
                <i className="ri-pencil-line tw-text-gray-400"></i>
              </TextIconInput>
            </div>
          </div>
        </div>

        <div className="tw-flex tw-gap-2 tw-justify-center tw-mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={props.toggle}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="reject"
            onClick={(event: any) => CancelAdmissionForm.handleSubmit(event)}
            disabled={showApiLoader}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModalIntRes;
