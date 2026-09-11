import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage,
    TextInputWithRegex,
    InputCheckbox
} from "../../../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    admissionTypes
} from "../helper";
import { StepperFormContext } from "../../helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct,
    getHouseDetailsAct
} from "../../../../../../../store/masterdata/masterdataactions";
import {
    getInstAcademicYearAct,
} from "../../../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import {
    getBranchCurriculumAct, getBrchSectionsAct, getBranchClassAct, setBrchClassAct,
    getBrchCurriculumClassAct
} from "../../../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    getAcademicLanguagesDataAct
} from "../../../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import {
    admissionCategroyAct
} from "../../../../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { getStreamList } from "../../../../../../../store/academic/assignGroup/assigngroupactions";
import { getSecoundLanguagesList, getSubjectListForCBSEList, getSubjectListForCambridgeList } from "../../../../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";


const validationSchema = Yup.object().shape({
    branchCurriculumId: Yup.string().required("Select curriculum."),
    branchClassId: Yup.string().required('Select class.'),
    academicSectionId: Yup.string().required("Select section."),
    rollNo: Yup.string().matches(/^[0-5]{1,5}$/, 'Roll no should be less than 5 digit number.').required("Roll No required"),
    houseId: Yup.string().required("House name required."),
    firstLanguageId: Yup.string().required("Select first language."),
    secondLanguageId: Yup.string().required("Select second language.").test("secondLanguageIdCheck", "Second language should not be same as first language.",
        (value: any, schema: any) => {
            if (value && value === schema.parent?.firstLanguageId) {
                return false
            }
            return true;
        }),
    thirdLanguageId: Yup.string().required("Select third language.").test("thirdLanguageIdCheck", "Third language should not be same as first language and second language.",
        (value: any, schema: any) => {
            if (value && ((value === schema.parent?.firstLanguageId) || (value === schema.parent?.secondLanguageId))) {
                return false
            }
            return true;
        }),
    admissionCategoryId: Yup.string().required("Select admission category."),
    admissionType: Yup.string().required("Select admission type."),
});

function getInitialState(initialState?: any) {
    return {
        houseId: initialState?.houseId || "",
        curriculumSoughtId: initialState?.curriculumSoughtId || "",
        admissionSoughtId: initialState?.admissionSoughtId || "",
        firstLanguageId: initialState?.firstLanguageId || "",
        secondLanguageId: initialState?.secondLanguageId || "",
        thirdLanguageId: initialState?.thirdLanguageId || "",
        admissionCategoryId: initialState?.admissionCategoryId || "",
        admissionType: initialState?.admissionType || "",
        transferCertificateNumber: initialState?.transferCertificateNumber || "",
        reasonForSeekingAdmission: initialState?.reasonForSeekingAdmission || "",
        optionalSubjects: initialState?.optionalSubjects || [],
        groupId: initialState?.groupId || "",
    }
}

const initialValues = getInitialState();
export default function AcademicDetails({ stepId, formId, branchId, instituteId,
    storeMultiFormDataCallback }: any) {
    const { currentMultiFormKeys, tabsData } = useContext<any>(StepperFormContext);
    const dispatch = useAppDispatch();
    const { houseDetailsResp, academicLanguages, branchClassResp, brchCurriculumResp,
        admissionCategoryResp } = useAppSelector(({ masterData, branchAcademics, instituteInfo,
            admissionRegistration
        }) => ({
            houseDetailsResp: masterData.houseDetailsResp,
            academicLanguages: instituteInfo.academicLanguages,
            branchClassResp: branchAcademics.branchClassResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            admissionCategoryResp: admissionRegistration.admissionCategoryResp,
        }), shallowEqual);

    useEffect(() => {
        const brchCurriculumparams = { branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" },
            languagesPayload = { instituteId, pageNo: 0, pageSize: 100, sortBy: "languageName", orderBy: "asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
        dispatch(getAcademicLanguagesDataAct(generateActionPayload("get_academic_language_data", undefined, languagesPayload)));
        dispatch(admissionCategroyAct(generateActionPayload("admission_category")));
    }, []);

    useEffect(() => {
        if (instituteId) {
            const payload = {
                instituteId
            }
            dispatch(getHouseDetailsAct(generateActionPayload("get_house_details", undefined, payload)));
        }
    }, [instituteId]);

    function getClassApiCall(curriculumId: string) {
        if (curriculumId) {
            const classParams = {
                branchId, pageNo: 0, pageSize: 100, sortBy: "className",
                orderBy: "asc", curriculumId: curriculumId
            };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, classParams)));
        }
    }

    const academicDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormDataCallback(formId, true, values);
        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            academicDetailsForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (tabsData[stepId]) {
            const formData = getInitialState(tabsData[stepId]);
            const { curriculumSoughtId } = tabsData[stepId] || {};
            if (curriculumSoughtId) {
                getClassApiCall(curriculumSoughtId);
            }
            academicDetailsForm.resetForm({
                values: formData
            })
        }
    }, [tabsData, stepId]);

    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (value) {
            getClassApiCall(value);
        }
        dispatch(setBrchClassAct(undefined));
        academicDetailsForm.setValues((prevState: any) => ({
            ...prevState, [name]: value, admissionSoughtId: "",
        }))
    }
    return (
        <form onSubmit={academicDetailsForm.handleSubmit}>
            <AccordionHeader tag="h5" targetId="academics">
                Academics
            </AccordionHeader>
            <AccordionBody accordionId="academics">
                <div className="row">
                    <div className="col-4">
                        <SelectInput
                            name="houseId"
                            labelText="House Name"
                            value={academicDetailsForm.values.houseId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.houseId && academicDetailsForm.errors.houseId) ? true : false}
                            error={(academicDetailsForm.touched.houseId && academicDetailsForm.errors.houseId) ? academicDetailsForm.errors.houseId : ""}
                            menuItems={houseDetailsResp}
                            valueKey="id"
                            textKey="houseName"
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="curriculumSoughtId"
                            labelText="Curriculum Sought"
                            value={academicDetailsForm.values.curriculumSoughtId}
                            onChange={onChangeHandler}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.curriculumSoughtId && academicDetailsForm.errors.curriculumSoughtId) ? true : false}
                            error={(academicDetailsForm.touched.curriculumSoughtId && academicDetailsForm.errors.curriculumSoughtId) ? academicDetailsForm.errors.curriculumSoughtId : ""}
                            menuItems={brchCurriculumResp?.data}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="admissionSoughtId"
                            labelText="Admission Sought to"
                            value={academicDetailsForm.values.admissionSoughtId}
                            onChange={onChangeHandler}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.admissionSoughtId && academicDetailsForm.errors.admissionSoughtId) ? true : false}
                            error={(academicDetailsForm.touched.admissionSoughtId && academicDetailsForm.errors.admissionSoughtId) ? academicDetailsForm.errors.admissionSoughtId : ""}
                            menuItems={branchClassResp?.content}
                            valueKey="id"
                            textKey="className"
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="firstLanguageId"
                            labelText="First Language"
                            value={academicDetailsForm.values.firstLanguageId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.firstLanguageId && academicDetailsForm.errors.firstLanguageId) ? true : false}
                            error={(academicDetailsForm.touched.firstLanguageId && academicDetailsForm.errors.firstLanguageId) ? academicDetailsForm.errors.firstLanguageId : ""}
                            menuItems={academicLanguages?.data}
                            valueKey="languageId"
                            textKey="languageName"
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="secondLanguageId"
                            labelText="Second Language"
                            value={academicDetailsForm.values.secondLanguageId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.secondLanguageId && academicDetailsForm.errors.secondLanguageId) ? true : false}
                            error={(academicDetailsForm.touched.secondLanguageId && academicDetailsForm.errors.secondLanguageId) ? academicDetailsForm.errors.secondLanguageId : ""}
                            menuItems={academicLanguages?.data}
                            valueKey="languageId"
                            textKey="languageName"
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="thirdLanguageId"
                            labelText="Third Language"
                            value={academicDetailsForm.values.thirdLanguageId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.thirdLanguageId && academicDetailsForm.errors.thirdLanguageId) ? true : false}
                            error={(academicDetailsForm.touched.thirdLanguageId && academicDetailsForm.errors.thirdLanguageId) ? academicDetailsForm.errors.thirdLanguageId : ""}
                            menuItems={academicLanguages?.data}
                            valueKey="languageId"
                            textKey="languageName"
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="admissionCategoryId"
                            labelText="Admission Category"
                            value={academicDetailsForm.values.admissionCategoryId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.admissionCategoryId && academicDetailsForm.errors.admissionCategoryId) ? true : false}
                            error={(academicDetailsForm.touched.admissionCategoryId && academicDetailsForm.errors.admissionCategoryId) ? academicDetailsForm.errors.admissionCategoryId : ""}
                            menuItems={admissionCategoryResp}
                            valueKey="id"
                            textKey="admissionCategory"
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="admissionType"
                            labelText="Admission Type"
                            value={academicDetailsForm.values.admissionType}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.admissionType && academicDetailsForm.errors.admissionType) ? true : false}
                            error={(academicDetailsForm.touched.admissionType && academicDetailsForm.errors.admissionType) ? academicDetailsForm.errors.admissionType : ""}
                            menuItems={admissionTypes}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>
                    <div className="col-4">
                        <TextInputWithRegex
                            name="transferCertificateNumber"
                            labelText="Transfer Certificate Number"
                            // formgroupClassName="mb-4"
                            value={academicDetailsForm.values.transferCertificateNumber}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.transferCertificateNumber && academicDetailsForm.errors.transferCertificateNumber) ? true : false}
                            error={(academicDetailsForm.touched.transferCertificateNumber && academicDetailsForm.errors.transferCertificateNumber) ? academicDetailsForm.errors.transferCertificateNumber : ""}
                            allowedInputRegex="^[0-9]+$"
                            maxLength={10}
                        // isReadOnly={true}
                        />
                    </div>
                    <div className="col-12">
                        <TextInput
                            name="reasonForSeekingAdmission"
                            labelText="Reason for Seeking Admission"
                            value={academicDetailsForm.values.reasonForSeekingAdmission}
                            onChange={academicDetailsForm.handleChange}
                            invalid={(academicDetailsForm.touched.reasonForSeekingAdmission && academicDetailsForm.errors.reasonForSeekingAdmission) ? true : false}
                            error={(academicDetailsForm.touched.reasonForSeekingAdmission && academicDetailsForm.errors.reasonForSeekingAdmission) ? academicDetailsForm.errors.reasonForSeekingAdmission : ""}
                        />
                    </div>
                    {/* <div className="col-12">
                        <input type="button" value="Submit Academic Details" />
                    </div> */}
                </div>
            </AccordionBody>
        </form>
    )
}