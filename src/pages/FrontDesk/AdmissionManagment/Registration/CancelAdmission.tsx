import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import classnames from "classnames";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Common Component
import {
    TextIconInput, ProgressIndicator, ModalComponent,
    TextArea,
    SelectInput
} from "../../../../Components/Common";

//Generate Action
import { generateActionPayload } from "../../../../utility/reduxutility";
import { deactivateRoleTypeUserAct } from "../../../../store/usermanagement/usermanagementactions";
//Icons
import { default as CancelIcon } from "../../../../assets/imagesdps/academics/CancelIcon.svg?react";

import { default as ApproveIcon } from "../../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { cancelAdmissionAct } from "../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { getInstBranchesAct } from "../../../../store/mastersettings/branch/branchactions";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";

const validationSchema = Yup.object().shape({
    reason: Yup.string().required("Remarks are required."),
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
});

const initialValues = { reason: "" , recommendedCampusId:"",curriculumId: "",
  classId: "", };
export default function CancelAdmission(props: any) {
    const dispatch = useAppDispatch();

    const { cancelAdmissionResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        branchListResp,
        showApiLoader,
        brchCurriculumResp,
        branchClassResp
    } = useAppSelector(({ admissionRegistration, appData, branch , globalData,branchAcademics }) => ({
        cancelAdmissionResp: admissionRegistration.cancelAdmissionResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        branchListResp: branch.branchListResp,
        showApiLoader : globalData.showApiLoader,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
    }), shallowEqual);

    const cancelAdmissionRef = useRef({
        prevCancelAdmissionResp: cancelAdmissionResp
    });
    useEffect(() => {
        const { prevCancelAdmissionResp } = cancelAdmissionRef.current;
        if (cancelAdmissionResp && prevCancelAdmissionResp !== cancelAdmissionResp) {
            toast.success("Admission canceled successfully.");
            props.toggle(true);
        }
        cancelAdmissionRef.current.prevCancelAdmissionResp = cancelAdmissionResp;
    }, [cancelAdmissionResp]);


    const cancelAdmissionForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const params = {
                studentRegNo: props.studentRegNo,
                reason: values.reason
            }, payload = {
                reason: values.reason,
                isAdmissionScreen: true,
                recommendedCampusId : values.recommendedCampusId || "",
                curriculumId:values?.curriculumId,
                recommendedClassId:values?.classId
            }
            dispatch(cancelAdmissionAct(generateActionPayload("cancel_admission", params, payload)));
        },
    });
    console.log(cancelAdmissionForm.errors)


    useEffect(() => {
        if (!props.isOpen) {
            cancelAdmissionForm.resetForm();
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
    }, [props.isOpen]);

    function fetchCurriculumList(otherProps?: any) {
        const payload = {
          academicYearId: props.selectedAcademicyearId,
          branchId:cancelAdmissionForm.values.recommendedCampusId,
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
        const {  curriculumId,recommendedCampusId } = cancelAdmissionForm.values;
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
          cancelAdmissionForm.setValues((prev: any) => ({
            ...prev,
            [name]: value,
            curriculumId: "",
            classId: "",
            reason: `The student has requested a transfer to ${branchListResp?.data?.find((item: any) => +item?.branchId === +value )?.branchName} campus.`,
          }));
          if (value) {
            fetchCurriculumList({
              academicYearId: props.selectedAcademicyearId,
              branchId: value,
            });
          }
          else if(!value){
            cancelAdmissionForm.setValues((prev: any) => ({...prev,
            [name]: value,
            curriculumId: "",
            classId: "",
            reason: "" }))
          }
        } else if (name === "curriculumId") {
          cancelAdmissionForm.setValues((prev: any) => ({
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
          cancelAdmissionForm.setValues((prev: any) => ({
            ...prev,
            [name]: value,
          }));
        }
      }

    const campusChangeHndler = (event:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        cancelAdmissionForm.setFieldValue(name, value);
        cancelAdmissionForm.setFieldValue("reason",`The student has requested a transfer to ${branchListResp?.data?.find((item: any) => +item?.branchId === +value )?.branchName} campus.`);
      }

    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};    


    const { isUserActive } = props;
    return (
        <form onSubmit={cancelAdmissionForm.handleSubmit}>
            <div className="modal-body">
                <div className="d-flex flex-column align-items-center">
                    <div className="d-flex mb-4">
                        <CancelIcon style={{ height: "70px", width: "70px" }} />
                    </div>
                    <h5 className="flex-grow-1 mb-2">You want to cancel the admission?</h5>
                    <span className="flex-grow-1 fw-normal mb-3">
                        Admission will be cancelled for the student.
                    </span>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center">
                            <SelectInput
                                name="recommendedCampusId"
                                value={cancelAdmissionForm.values?.recommendedCampusId}
                                onChange={filterHandler}
                                menuItems={branchListResp?.data?.filter((item: any) => +item?.branchId !== +branchId)}
                                valueKey="branchId"
                                textKey="branchName"
                                labelText='Recommended Campus'
                                floatingLabel
                                inputClassName="w-100"
                                formgroupClassName="w-70 mb-3"
                                // invalid={(cancelAdmissionForm.touched.recommendedCampusId && cancelAdmissionForm.errors.recommendedCampusId) ? true : false}
                                // error={(cancelAdmissionForm.touched.recommendedCampusId && cancelAdmissionForm.errors.recommendedCampusId) ? cancelAdmissionForm.errors.recommendedCampusId : ""}
                            />
                        </div>
                        {
                          cancelAdmissionForm.values.recommendedCampusId  && <>
                          
                          <div className="col-12 d-flex justify-content-center">
                                        <SelectInput
                                            name="curriculumId"
                                            valueKey="branchCurriculumId"
                                            textKey="curriculumName"
                                            menuItems={curriculumTypes}
                                            value={cancelAdmissionForm.values.curriculumId}
                                            onChange={filterHandler}
                                            formgroupClassName="w-70 mb-3"
                                            labelText="Curriculum"
                                            floatingLabel
                                            invalid={(cancelAdmissionForm.touched.curriculumId && cancelAdmissionForm.errors.curriculumId) ? true : false}
                                            error={(cancelAdmissionForm.touched.curriculumId && cancelAdmissionForm.errors.curriculumId) ? cancelAdmissionForm.errors.curriculumId : ""}
                                          />
                                      </div>
                                      <div className="col-12 d-flex justify-content-center">
                                        <SelectInput
                                      name="classId"
                                      valueKey="id"
                                      textKey="shortName"
                                      menuItems={classTypes || []}
                                      value={cancelAdmissionForm.values.classId}
                                      onChange={filterHandler}
                                      formgroupClassName="w-70 mb-3"
                                      labelText="Class"
                                      floatingLabel
                                      invalid={(cancelAdmissionForm.touched.classId && cancelAdmissionForm.errors.classId) ? true : false}
                                      error={(cancelAdmissionForm.touched.classId && cancelAdmissionForm.errors.classId) ? cancelAdmissionForm.errors.classId : ""}
                                    />
                                      </div>
                          </>
                        }
                        <div className="col-12 d-flex justify-content-center">
                            <TextIconInput
                            name="reason"
                            value={cancelAdmissionForm.values.reason}
                            onChange={cancelAdmissionForm.handleChange}
                            invalid={(cancelAdmissionForm.touched.reason && cancelAdmissionForm.errors.reason) ? true : false}
                            error={(cancelAdmissionForm.touched.reason && cancelAdmissionForm.errors.reason) ? cancelAdmissionForm.errors.reason : ""}
                            inputClassName="w-100"
                            placeHolder="Reason.."
                            formgroupClassName="w-70"
                            maxLength={500}
                            >
                            <i className="ri-pencil-line text-muted"></i>
                
                            </TextIconInput>
                        </div>
                    </div>

                </div>

            </div>
            <div className="modal-footer">
                <div className="text-align-center mt-4">
                    <button type="button"
                        className="btn btn-light me-2" onClick={props.toggle}>Cancel</button>
                    <button type="submit" disabled={showApiLoader}
                        className={classnames("btn", (isUserActive ? "btn-danger" : "btn-success"))}>Confirm</button>
                </div>
            </div>
        </form >
    )
}