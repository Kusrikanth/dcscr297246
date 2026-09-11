import React, { useState, useContext, useEffect, useRef } from "react";
import { nanoid } from 'nanoid';
import { toast } from "react-toastify";
import { Formik, FieldArray, useFormik, Form, ArrayHelpers, FormikErrors, FormikProvider } from "formik";
import { shallowEqual } from "react-redux";
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse, Button } from "reactstrap";

//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage, SelectWithTextInput, AutoSearchInput, UploadFileInput,
    SingleFileUploadInput,
} from "../../../../../../Components/Common";
//Helper
import {
    levelOptions
} from "./helper";
import { StepperFormContext } from "../helper";

//Common Utility
import { generateUniqueNumber } from "../../../../../../utility/commonutility";
import classnames from "classnames";
//Action Generator
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import {
    getStudentByFilterAct, getSiblingDetailsAct, setGetSiblingDetailsAct
} from "../../../../../../store/directory/studentmanagement/studentmanagementactions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { getBranchCurriculumAct, getBranchClassAct, getBrchSectionsAct } from "../../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { TABS_ACTIONS } from "../helper";
import UploadStudent from "../../../../../../Components/Common/UploadStudent";
import {
    uploadActivityCertificateAct,
    addCocurriculurActivityAct,
    getCoCurriculumActivityByIdAct
} from "../../../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";

function getInitialState(editData?: any) {
    const uniqueId = nanoid();
    return {
        activityList: [{
            uniqueId: uniqueId,
            id: "",
            coCurricularActivityId: 0,
            level: "",
            description: "",
            certificateId: "",

            uploadedFile: "",
            isUploaded: false
        }]
    }
}

const initialValues = getInitialState();
export const CoCurriculumActivity: React.FC<any> = ({ branchId, instiuteId, academicYearId }) => {
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const dispatch = useAppDispatch();
    const { uploadActivityCertificateResp, addCocurrilurActivityResp } =
        useAppSelector(({ admissionRegistration }) => ({
            uploadActivityCertificateResp: admissionRegistration.uploadActivityCertificateResp,
            addCocurrilurActivityResp: admissionRegistration.addCocurrilurActivityResp
        }), shallowEqual);

    const coCurriculurActivityRef = useRef({
        prevUploadActivityCertificateResp: uploadActivityCertificateResp,
        prevAddCocurrilurActivityResp: addCocurrilurActivityResp
    });

    useEffect(() => {
        const { prevUploadActivityCertificateResp, prevAddCocurrilurActivityResp } = coCurriculurActivityRef.current;
        if (uploadActivityCertificateResp && prevUploadActivityCertificateResp !== uploadActivityCertificateResp) {
            const { uploadFileId, } = uploadActivityCertificateResp;
            if (uploadFileId) {
                toast.success("File uploaded successfully");
                const rowIndex = coCurriculumForm.values?.activityList.findIndex((item: any) => item.uniqueId === uploadFileId);
                if (rowIndex >= 0) {
                    const updatedRowDetails = { ...coCurriculumForm.values?.activityList[rowIndex], certificateId: uploadActivityCertificateResp?.id, isUploaded: true };
                    formikArrayHelpers.current?.replace(rowIndex, updatedRowDetails);
                }
            }
        } else if (addCocurrilurActivityResp && prevAddCocurrilurActivityResp !== addCocurrilurActivityResp) {
            toast.success("Co-curriculur activity submitted successfully.");
        }
        coCurriculurActivityRef.current.prevUploadActivityCertificateResp = uploadActivityCertificateResp;
    }, [uploadActivityCertificateResp, addCocurrilurActivityResp]);

    const coCurriculumForm = useFormik({
        initialValues,
        onSubmit: (values) => {
            const payload = values.activityList.map(item => {
                return {
                    coCurricularActivityId: item.coCurricularActivityId,
                    level: item.level,
                    description: item.description,
                    certificateId: item.certificateId
                };
            });
            const params = { studentId: "35691" };
            dispatch(addCocurriculurActivityAct(generateActionPayload("add_cocurriculur_activity", params, payload)));
        }
    });


    function removeRoleHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }


    function addNewActivityHandler() {
        var uniqueId = nanoid();
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push(
                {
                    uniqueId: uniqueId,
                    id: "",
                    coCurricularActivityId: 0,
                    level: "",
                    description: "",
                    certificateId: ""
                }
            );
        }
    }

    function onChangeFileInputHndlr(event: any) {
        const file = event.target.files[0];
        const documentIndexKey = event.target.name.split(".")[1];
        coCurriculumForm.setFieldValue(`activityList.${documentIndexKey}.fileName`, file.name);
        coCurriculumForm.setFieldValue(`activityList.${documentIndexKey}.uploadedFile`, file);
    }

    function fileUploadHndlr(event: React.MouseEvent<HTMLInputElement>) {
        const uploadFileId = event.currentTarget.getAttribute("data-id") || "",
            rowFileInfo = coCurriculumForm.values?.activityList.find((item: any) => item.uniqueId === uploadFileId);
        if (rowFileInfo) {
            const formData = new FormData();
            formData.append("file", rowFileInfo.uploadedFile);
            dispatch(uploadActivityCertificateAct(generateActionPayload("upload_activity_file", undefined, formData, { uploadFileId })));
        }
    }

    // useEffect(() => {
    //     if (!studentId) {
    //         const params = { studentId: '35690' };
    //         dispatch(getCoCurriculumActivityByIdAct(generateActionPayload("get_register_student_byid", params)));
    //     }
    // }, [studentId]);

    return (
        <form id="student-info-form" onSubmit={coCurriculumForm.handleSubmit}>
            <div className="row">
                <div className="col-12 mb-3">
                    <div className="border-bottom">
                        <h5>Co-Curricular Activities</h5>
                    </div>

                </div>
            </div>
            <FormikProvider value={coCurriculumForm}>
                <FieldArray name="activityList">
                    {(arrayHelpers: ArrayHelpers) => {
                        if (!formikArrayHelpers.current) {
                            formikArrayHelpers.current = arrayHelpers;
                        }
                        return (
                            <>
                                {coCurriculumForm.values.activityList.length > 0 &&
                                    coCurriculumForm.values.activityList.map((activity, index) => {
                                        const inputFieldErrors: any = coCurriculumForm.errors.activityList && coCurriculumForm.errors.activityList[index] || {};
                                        const inputFieldTouched = coCurriculumForm.touched.activityList && coCurriculumForm.touched.activityList[index] || {};
                                        return (
                                            <div key={activity.uniqueId} className="row gx-3">
                                                <div className="col-3">
                                                    <SelectInput
                                                        name={`activityList.${index}.level`}
                                                        menuItems={levelOptions}
                                                        valueKey="id"
                                                        textKey="name"
                                                        labelText="Level"
                                                        onChange={coCurriculumForm.handleChange}
                                                        value={activity.level}
                                                        invalid={(inputFieldTouched.level && inputFieldErrors.level) ? true : false}
                                                        error={(inputFieldTouched.level && inputFieldErrors.level) ? inputFieldErrors.level : ""}
                                                    />
                                                </div>
                                                <div className="col-5">
                                                    <TextInput
                                                        name={`activityList.${index}.description`}
                                                        value={activity.description}
                                                        formgroupClassName="mb-0"
                                                        onChange={coCurriculumForm.handleChange}
                                                        labelText="Description"
                                                        invalid={inputFieldTouched.description &&
                                                            inputFieldErrors.description
                                                            ? true
                                                            : false}
                                                        error={inputFieldTouched.description &&
                                                            inputFieldErrors.description
                                                            ? inputFieldErrors.description
                                                            : ""}
                                                    />
                                                </div>
                                                <div className="col-4 d-flex">
                                                    <div className="d-flex">
                                                        <SingleFileUploadInput
                                                            labelText="Upload Certificate"
                                                            name={`activityList.${index}.uploadedFile`}
                                                            onChangeFileHndlr={onChangeFileInputHndlr}
                                                            uploadHndlr={fileUploadHndlr}
                                                            uploadedFile={activity.uploadedFile}
                                                            isUploaded={activity.isUploaded}
                                                            dataId={activity.uniqueId}
                                                            error={inputFieldTouched.uploadedFile && inputFieldErrors.uploadedFile ? inputFieldErrors.uploadedFile : ""}
                                                        />
                                                        {(index !== 0) && <div className="d-flex align-items-start pt-4 mt-1 flex-shrink-0 ms-3"><Button data-index={index} onClick={removeRoleHndlr} color="white"
                                                            className="btn-sm btn-icon btn-rounded btn-hover-danger">
                                                            <i className="ri-delete-bin-2-fill" />
                                                        </Button>
                                                        </div>}
                                                    </div>
                                                </div>
                                            </div>)
                                    })}
                            </>
                        )
                    }}

                </FieldArray >
            </FormikProvider>
            <div className="row">
                <div className="col-12">
                    <Button onClick={addNewActivityHandler} color="outline-primary"
                        className="btn">
                        Add New
                    </Button>
                </div>
                <div className="col-12 text-end mt-2">
                    <button type="button" onClick={() => { }} className="btn btn-soft-success me-2">
                        Previous
                    </button>
                    <button type="submit" className="btn btn-success">
                        Next
                    </button>
                </div>
            </div>
        </form >
    )
}