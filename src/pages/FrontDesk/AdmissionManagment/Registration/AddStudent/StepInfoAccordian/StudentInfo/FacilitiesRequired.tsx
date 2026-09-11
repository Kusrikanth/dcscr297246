import React, { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import {
    UncontrolledAccordion, AccordionBody,
    AccordionHeader, AccordionItem, Collapse
} from "reactstrap";

import { useFormik } from "formik";
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
        id: initialState?.id || undefined,
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
    }
}

export default function FacilitiesRequired({ formId, formDetails, branchId, instituteId, academicYearId,
    storeMultiFormDataCallback }: any) {
    const { currentMultiFormKeys, editStudentData } = useContext<any>(StepperFormContext);
    const [facilityState, setFacilityState] = useState({
        schoolTransportation: false,
        lunchFacility: false
    });

    function onSubmitHandler() {
        storeMultiFormDataCallback(formId, true, facilityState);

    }

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            onSubmitHandler();
        }
    }, [currentMultiFormKeys]);

    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, checked } = event.target;
        setFacilityState(prevState => ({ ...prevState, [name]: checked }));
    }
    return (
        <form onSubmit={e => { e.preventDefault(); onSubmitHandler(); }}>
            <AccordionHeader tag="h5" targetId="facilityRequired">
                Facilities Required
            </AccordionHeader>
            <AccordionBody accordionId="facilityRequired">
                <InputCheckbox
                    name="schoolTransportation"
                    labelName="School Transportation"
                    value={facilityState?.schoolTransportation}
                    onChange={onChangeHandler}
                />
                <InputCheckbox
                    name="lunchFacility"
                    labelName="Lunch Facility"
                    value={facilityState?.lunchFacility}
                    onChange={onChangeHandler}
                />
            </AccordionBody>
        </form>
    )
}