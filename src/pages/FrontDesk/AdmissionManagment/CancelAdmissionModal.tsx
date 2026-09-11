import React, { useEffect, useState } from "react";
import { default as ConfirmationIcon } from "../../../assets/imagesdps/academics/confirmation-icon.svg?react";

import { shallowEqual } from "react-redux";
import * as Yup from 'yup';

import { SelectInput, TextIconInput } from "../../../Components/Common";
import { getInstBranchesAct } from "../../../store/mastersettings/branch/branchactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useFormik } from "formik";
import Button from "../../../Components/Common/Button";

const initialValues = {
  reason: "",
  recommendedCampusId: "",
  curriculumId: "",
  classId: "",
}

const CancelAdmissionModal = (props: any) => {

  const { isOpen } = props;
  const dispatch = useAppDispatch();
  const validationSchema = Yup.object().shape({
    reason: Yup.string().required('Reason is required'),
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
    brchCurriculumResp,
    branchClassResp,
  } = useAppSelector(
    ({ appData, branch,branchAcademics }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      branchListResp: branch.branchListResp,
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
      props.submitHandler(values.reason,values.recommendedCampusId,values.curriculumId,values.classId)
    },
  });

  useEffect(() => {

    if (!isOpen) {
      CancelAdmissionForm.resetForm();
    } else {
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
      branchId :CancelAdmissionForm.values.recommendedCampusId,
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
    const { recommendedCampusId, curriculumId } = CancelAdmissionForm.values;
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
        reason: `The student has requested a transfer to ${
        branchListResp?.data?.find(
        (item: any) => +item?.branchId === +value
      )?.branchName
      } campus.`,
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
            reason: "" }))
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
    CancelAdmissionForm.setFieldValue("reason",`The student has requested a transfer to ${branchListResp?.data?.find((item: any) => +item?.branchId === +value )?.branchName} campus.`);
  }

  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};    

  return (
    <>
      <div className="tw-p-5">
        <div className="tw-flex tw-flex-col tw-items-center">

          {/* Icon */}
          <div className="tw-flex tw-mb-4">
            <ConfirmationIcon fill="#f06548" width={"70px"} height="70px" />
          </div>

          {/* Title */}
          <h5 className="tw-mb-2">Are you sure?</h5>

          {/* Subtitle */}
          <span className="tw-font-normal tw-mb-4 tw-text-center">
            {`You want to Cancel this Admission !`}
          </span>

          {/* Form Section */}
          <div className="tw-w-full">

            {/* Recommended Campus */}
            <div className="tw-flex tw-justify-center tw-w-full">
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
                formgroupClassName="tw-w-[70%] tw-mb-4"
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

            {/* Conditional Fields */}
            {CancelAdmissionForm.values.recommendedCampusId && (
              <>
                <div className="tw-flex tw-justify-center tw-w-full">
                  <SelectInput
                    name="curriculumId"
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    menuItems={curriculumTypes}
                    value={CancelAdmissionForm.values.curriculumId}
                    onChange={filterHandler}
                    formgroupClassName="tw-w-[70%] tw-mb-4"
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

                <div className="tw-flex tw-justify-center tw-w-full">
                  <SelectInput
                    name="classId"
                    valueKey="id"
                    textKey="shortName"
                    menuItems={classTypes || []}
                    value={CancelAdmissionForm.values.classId}
                    onChange={filterHandler}
                    formgroupClassName="tw-w-[70%] tw-mb-4"
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

            {/* Reason */}
            <div className="tw-flex tw-justify-center tw-w-full">
              <TextIconInput
                name="reason"
                value={CancelAdmissionForm.values.reason}
                onChange={CancelAdmissionForm.handleChange}
                 invalid={
              CancelAdmissionForm.touched.reason &&
              CancelAdmissionForm.errors.reason
                ? true
                : false
            }
            error={
              CancelAdmissionForm.touched.reason &&
              CancelAdmissionForm.errors.reason
                ? CancelAdmissionForm.errors.reason
                : ""
            }
                inputClassName="tw-w-full"
                placeHolder="Reason.."
                formgroupClassName="tw-w-[70%] tw-mb-4"
                maxLength={500}
              >
                <i className="ri-pencil-line tw-text-gray-500"></i>
              </TextIconInput>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="tw-flex tw-justify-center tw-gap-3 tw-mt-6">
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
            disabled={props.showApiLoader}
          >
            Yes Cancel It !
          </Button>
        </div>
      </div>

    </>
  );
};

export default CancelAdmissionModal;
