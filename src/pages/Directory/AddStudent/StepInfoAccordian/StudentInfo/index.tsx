import React, { useState, useContext, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { FormikProvider, useFormik } from 'formik';
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";


//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage
} from "../../../../../Components/Common";


//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions,

} from "../helper";
import { StepperFormContext } from "../../helper";
import BasicDetails from "./BasicDetails";
import AcademicDetails from "./AcademicDetails";
import IdentificationDetails from "./IdentificationDetails";
import PastEducation from "./PastEducation";
import MedicalInfo from "./MedicalInfo";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct
} from "../../../../../store/masterdata/masterdataactions";
import Select from "react-select";
import { TABS_ACTIONS } from "../../helper";
import Button from "../../../../../Components/Common/Button";
const SingleOptions = [
    { value: 'Choices 1', label: 'Choices 1', test: "data" },
    { value: 'Choices 2', label: 'Choices 2' },
    { value: 'Choices 3', label: 'Choices 3' },
    { value: 'Choices 4', label: 'Choices 4' }
];




const validationSchema = Yup.object().shape({

});

function getStudentData(studentDetails?: any): any {
    return ({
        id: studentDetails?.id || "",
        studentName: studentDetails?.studentName || "",
        firstName: studentDetails?.firstName || "n/a",
        lastName: studentDetails?.lastName || "n/a",
        admissionNo: studentDetails?.admissionNo || "",
        regId: studentDetails?.regId || "",
        branchId: studentDetails?.branchId || "",
        studentUidNo: studentDetails?.studentUidNo || "",
        admissionType: studentDetails?.admissionType || "",
        phone: studentDetails?.phone || "",
        emailId: studentDetails?.emailId || "",
        gender: studentDetails?.gender || "",
        nationality: studentDetails?.nationality || "",
        motherTongue: studentDetails?.motherTongue || "",
        bloodGroupId: studentDetails?.bloodGroupId || "",
        religion: studentDetails?.religion || "",
        caste: studentDetails?.caste || "",
        aadharEnrollmentNo: studentDetails?.aadharEnrollmentNo || "",
        identificationMarks1: studentDetails?.identificationMarks1 || "",
        identificationMarks2: studentDetails?.identificationMarks2 || "",
        houseId: studentDetails?.houseId || "",
        admissionCategoryId: studentDetails?.admissionCategoryId || "",
        isSpecialChild: studentDetails?.isSpecialChild || "",
        hasSiblings: studentDetails?.hasSiblings || "",
        isSingleParent: studentDetails?.isSingleParent || "",
        singleParentType: studentDetails?.singleParentType || "",
        formId: studentDetails?.formId || "",
        dateOfBirth: studentDetails?.dateOfBirth || "",
        placeOfBirth: studentDetails?.placeOfBirth || "",
        passportNo: studentDetails?.passportNo || "",
        dateOfAdmission: studentDetails?.dateOfAdmission || "",
        studentPhotoUrl: studentDetails?.studentPhotoUrl || "",
        studentPhotoId: studentDetails?.studentPhotoId || "",
        allergicTo: studentDetails?.allergicTo || "",
        smsPriorityNo: studentDetails?.smsPriorityNo || "",
        studentInterest: studentDetails?.studentInterest || "",
        newOrExistingStudents: studentDetails?.newOrExistingStudents || ""
    })
}

function getSiblingData(siblingDetails?: any): any {
    return ({
        siblingClassId: siblingDetails?.siblingClassId || "",
        siblingSectionId: siblingDetails?.siblingSectionId || "",
        siblingStudentId: siblingDetails?.siblingStudentId || "",
        siblingStudentName: siblingDetails?.siblingStudentName || "",
        siblingBranchId: siblingDetails?.siblingBranchId || "",
        siblingCurriculumId: siblingDetails?.siblingCurriculumId || ""
    })
}


export const StudentInfo: React.FC<any> = ({ branchId, instituteId, academicYearId }) => {
    const { submitCurrentFormCllbck } = useContext<any>(StepperFormContext);


    function submitHndlr(e: any) {
        submitCurrentFormCllbck(["studentDetails", "studentAcademicDetails", "identificationDetail",
            "pastEducation", "medicalInfo"], TABS_ACTIONS.NEXT_TAB);

        // formAref.current.Submit();
        // formBref.current.Submit();
        // e.preventDefault();
    }

    useEffect(() => {
        // const nationa
        // dispatch(getGlobalRecordsAct(generateActionPayload("get_inst_global_records", undefined, {})));
    }, []);

    function handleSelectSingle(selectedSingle?: any) {
        setSelectedSingle(selectedSingle);
    }

    const [selectedSingle, setSelectedSingle] = useState(null);

    function handleInputChange(inputString: string, inputAction: any) {
        // const { name, value } = event.target;
    }
    return (
        <div>
            <div className="tw-flex tw-flex-wrap">
                <div className="tw-w-full tw-mb-3">
                    <div className="tw-border-b tw-border-gray-300">
                        <span className="tw-text-base tw-font-bold tw-block tw-mb-2">
                            1. Student Profile
                        </span>
                    </div>

                </div>
            </div>
            <UncontrolledAccordion open="basic-details" defaultOpen={["basic-details", "academics",
                "identification", "past-education", "medical-info"]} stayOpen>
                <AccordionItem>
                    <BasicDetails branchId={branchId} instituteId={instituteId} />
                </AccordionItem>
                <AccordionItem>
                    <AcademicDetails branchId={branchId} instituteId={instituteId} academicYearId={academicYearId} />
                </AccordionItem>
                <AccordionItem>
                    <IdentificationDetails branchId={branchId} instituteId={instituteId} />
                </AccordionItem>
                <AccordionItem>
                    <PastEducation branchId={branchId} instituteId={instituteId} />
                </AccordionItem>
                <AccordionItem>
                    <MedicalInfo branchId={branchId} instituteId={instituteId} />
                </AccordionItem>
            </UncontrolledAccordion>
            <div className="tw-flex tw-flex-wrap tw-mt-3">
                <div className="tw-w-full tw-text-right tw-mt-2">
                    {/* 
        <button
            type="submit"
            className="tw-bg-green-50 tw-text-green-600 tw-font-medium tw-px-4 tw-py-2 tw-rounded tw-mr-2 hover:tw-bg-green-100"
        >
            Cancel
        </button> 
        */}
                    <Button
                        variant="primary"
                        type="button"
                        onClick={submitHndlr}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}