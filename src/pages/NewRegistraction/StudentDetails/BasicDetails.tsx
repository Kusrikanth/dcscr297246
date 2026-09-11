import React, { useState, useEffect, useImperativeHandle, useContext, useRef, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer,
    TextInputWithRegex,
    AutoSearchInputSingle,
    CustomSelect
} from "../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    trueFalseOptions,
    dipSiteParentOptions
} from "../helper";
import { StepperFormContext } from "../helper";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getTrueFalseOptions, uploadImageFileErrorHndlr } from "../../../utility/commonutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct,
    getSubCasteListAct
} from "../../../store/masterdata/masterdataactions";
import {
    getApplicationSaleClassList,
} from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import {
    getApplicationSaleBySearchAct,
    setApplicationSaleByApplicationNoAct
} from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import {
    getInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import {
    getCasteListAct, getMotherToungeAct
} from "../../../store/masterdata/masterdataactions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Utility 
import {
    getAcademicYears, Current_Date,
    Min_Date, MinDate_YYYYMMDD, Max_Date,
    getYyyyMmDdFormat, getYearGapCurrentDate, Current_Date_YYYYMMDD, getParticularFormatDate, getFormYyyyMmDdFormat, getCurrentTimezoneYyyyMmDdFormat
} from "../../../utility/dateutility";
import { toast } from "react-toastify";
//Helper
import { admissionTypes, getAdmissionTypeOptions } from "../helper";

const Max_Age_Year = 4;
const Student_Dob_MaxDate_YYYYMMDD = getYyyyMmDdFormat(getYearGapCurrentDate(Max_Age_Year));


const validationSchema = Yup.object().shape({
    genderId: Yup.string().required("Select gender.").nullable(),
    priorityMail: Yup.string().email('Invalid Email.').required("Email id required."),
    smsPriorityNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'SMS Priority No. with 10 digit is valid.').required("SMS Priority No. is required."),
    whatsappNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Whatsapp No. with 10 digit is valid.'),
    placeOfBirth: Yup.string().required("Birth place required."),
    bloodGroupId: Yup.string().required("Select blood group."),
    admissionType: Yup.string().required("Select admission type."),
    casteId: Yup.string().required('Select caste.'),
    motherTongueId: Yup.string().required("Select mother toungue."),
    isParentDPSAlumni: Yup.string(),
    dipSiteParent: Yup.string().when('isParentDPSAlumni', {
        is: (isParentDPSAlumni: any) => isParentDPSAlumni === "true",
        then: Yup.string()
            .required('Select father/mother.')
    }),
    dipSiteXYear: Yup.string().when('isParentDPSAlumni', {
        is: (isParentDPSAlumni: any) => isParentDPSAlumni === "true",
        then: Yup.string()
            .required('Year of Xth passing is required.')
    }),
    dipSiteXiiYear: Yup.string().when('isParentDPSAlumni', {
        is: (isParentDPSAlumni: any) => isParentDPSAlumni === "true",
        then: Yup.string()
            .required('Year of XIIth passing is required.')
    }),
});

function getInitialState(initialState?: any) {
    return {
        branchId: "",
        academicYearId: initialState?.academicYearId || "",
        applicationId: initialState?.applicationId || "",
        applicationNo: initialState?.applicationNo || "",
        studentName: initialState?.studentName || "",
        admissionDate: getFormYyyyMmDdFormat(new Date()),
        aadharNo: initialState?.aadharNo || "",
        genderId: initialState?.genderId || "",
        dateOfBirth: initialState?.dateOfBirth || "",
        priorityMail: initialState?.priorityMail || "",
        smsPriorityNo: initialState?.smsPriorityNo || "",
        whatsappNo: initialState?.whatsappNo || "",
        placeOfBirth: initialState?.placeOfBirth || "",
        bloodGroupId: initialState?.bloodGroupId || "",

        admissionType: initialState?.admissionType || "",
        casteId: initialState?.casteId || "",
        subCasteId: initialState?.subCasteId || "",
        motherTongueId: initialState?.motherTongueId || "",

        isParentDPSAlumni: getTrueFalseOptions(initialState?.isParentDPSAlumni),
        dipSiteParent: initialState?.dipSiteParent || "",
        dipSiteXYear: initialState?.dipSiteXYear || "",
        dipSiteXiiYear: initialState?.dipSiteXiiYear || "",

        admissionSoughtId: initialState?.admissionSoughtId || "",
        genderName: initialState?.genderName || "",
    }
}

const initialValues = getInitialState();
export default function BasicDetails({ stepId, formId, branchId, instituteId,
    storeMultiFormDataCallback }: any) {
    const { currentMultiFormKeys, tabsData } = useContext<any>(StepperFormContext);
    const [admissionTypeState, setAdmissionTypeState] = useState<any>([]);
    const [hostelAvaialableState, setHostelAvailableState] = useState("no");
    const dispatch = useAppDispatch();
    const { applicationSaleBySearch, genderListResp, bloodGroupResp,
        academicYearListResp,
        applicationSaleClassListResp,
        admissionCategoryResp, casteListResp, subCasteListResp,
        motherToungeResp,
        applicationSaleError } =
        useAppSelector(({ masterData, applicationSale, branchAcademics, instAcademics, admissionRegistration }) => ({
            applicationSaleBySearch: applicationSale.applicationSaleBySearch,
            genderListResp: masterData.genderListResp,
            bloodGroupResp: masterData.bloodGroupResp,
            applicationSaleClassListResp: applicationSale.applicationSaleClassListResp,
            academicYearListResp: instAcademics.academicYearListResp,
            instAcademicErrorResp: instAcademics.instAcademicErrorResp,
            masterDataErrorResp: masterData.masterDataErrorResp,
            admissionCategoryResp: admissionRegistration.admissionCategoryResp,
            casteListResp: masterData.casteListResp,
            subCasteListResp: masterData.subCasteListResp,
            motherToungeResp: masterData.motherToungeResp,
            applicationSaleError: applicationSale.applicationSaleError,
        }), shallowEqual);

    const basicDetailsRef = useRef({
        prevApplicationSaleClassListResp: applicationSaleClassListResp,
        prevApplicationSaleError: applicationSaleError
    });

    useEffect(() => {
        const { prevApplicationSaleClassListResp } = basicDetailsRef.current;
        if (applicationSaleClassListResp && prevApplicationSaleClassListResp !== applicationSaleClassListResp) {
            const { admissionSoughtId, genderName } = tabsData[stepId] || {};
            const { data } = applicationSaleClassListResp;
            if (Array.isArray(data) && data.length > 0) {
                const { hostelFacility } = data.find((item: any) => item?.classId?.toString().toLowerCase() === admissionSoughtId?.toString().toLowerCase()) || {};
                setHostelAvailableState(hostelFacility);
                const admissionTypeOptions = getAdmissionTypeOptions({
                    genderName, hostelFacility, branchId
                });
                setAdmissionTypeState(admissionTypeOptions);
            }

        }
        basicDetailsRef.current.prevApplicationSaleClassListResp = applicationSaleClassListResp;
    }, [applicationSaleClassListResp]);

    useEffect(() => {
        const academicYearPayload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
        dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, academicYearPayload)));
        dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender", sortBy: "genderName", orderBy: "asc" })));
        dispatch(getBloodGroupAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "blood-group", sortBy: "bloodGroupName", orderBy: "asc" })));
        dispatch(getCasteListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "caste", sortBy: "casteName", orderBy: "asc", pageNo: 0, pageSize: 100 })));
        dispatch(getMotherToungeAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "mother-tongue", sortBy: "id", orderBy: "asc", pageNo: 0, pageSize: 50 })));
    }, []);

    const academicYearList = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return getAcademicYears(currentYear);
    }, []);

    const basicDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            const { admissionSoughtId, genderName, ...payload } = values;
            payload.branchId = branchId;
            storeMultiFormDataCallback(formId, true, basicDetailsForm.dirty, payload);
        }
    })
    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            basicDetailsForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);


    useEffect(() => {
        if (tabsData[stepId]) {
            const { curriculumSoughtId, academicYearId } = tabsData[stepId] || {};
            const formData = getInitialState(tabsData[stepId]);
            basicDetailsForm.resetForm({
                values: formData
            });
            if (curriculumSoughtId && academicYearId) {
                const payload = {
                    instituteId: "1",
                    branchId: branchId,
                    curriculumId: curriculumSoughtId,
                    academicYearId,
                };
                dispatch(getApplicationSaleClassList(generateActionPayload("get_application_sale_class_list", undefined, payload)));
            }
        }
    }, [tabsData, stepId]);

    useEffect(() => {
        const casteId = basicDetailsForm.values.casteId;

        if (casteId) {
            dispatch(getSubCasteListAct(
                generateActionPayload("get_sub_caste", undefined, { casteId, pageNo: 0, pageSize: 100},)
            ));
        }
    }, [basicDetailsForm.values.casteId]);

    function handleSubCasteChange(selected: any, config: any) {
        const { name } = config;
        basicDetailsForm.setFieldValue(name, selected);
    }

    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        basicDetailsForm.setFieldValue(name, updateDate);
    }

    function onChangeGenderHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        const { genderName } = genderListResp?.data?.find((item: any) => item?.genderId?.toString().toLowerCase() === value) || {};
        basicDetailsForm.setValues(prevState => ({
            ...prevState, [name]: value, admissionType: ""
        }));
        if (!value) {
            setAdmissionTypeState([]);
        } else {
            const admissionTypeOptions = getAdmissionTypeOptions({
                genderName, hostelFacility: hostelAvaialableState, branchId
            });
            setAdmissionTypeState(admissionTypeOptions);
        }

    }

    function onChangeParentAlumniHandler(event: any) {
        const { name, value } = event.target;
        basicDetailsForm.setValues(prevState => ({
            ...prevState,
            [name]: value,
            dipSiteParent: "",
            dipSiteXYear: "",
            dipSiteXiiYear: "",
        }))
    }
    
    function renderValueSection(selectedItem: any) {
      return selectedItem?.categoryName || "";
    }
    
    function renderOptionsSubCaste(item: any) {
      return   item?.categoryName?.toString() || "";
    }

    return (
        <form onSubmit={basicDetailsForm.handleSubmit} noValidate>
            <AccordionHeader tag="span" className="fs-normal" targetId="basicInfo">
                Basic Details
            </AccordionHeader>
            <AccordionBody accordionId="basicInfo">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <TextInput
                            name="applicationNo"
                            labelText="Application No."
                            labelClass="required"
                            inputClassName="ng-input"
                            isDisabled={true}
                            value={basicDetailsForm.values.applicationNo}
                            onChange={basicDetailsForm.handleChange}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="academicYearId"
                            labelText="Academic Year"
                            labelClass="required"
                            inputClassName="dps-input"
                            value={basicDetailsForm.values.academicYearId}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.academicYearId && basicDetailsForm.errors.academicYearId) ? true : false}
                            error={(basicDetailsForm.touched.academicYearId && basicDetailsForm.errors.academicYearId) ? basicDetailsForm.errors.academicYearId : ""}
                            menuItems={academicYearListResp?.data}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            isDisabled={true}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <TextInput
                            name="studentName"
                            labelText="Student Name"
                            labelClass="required"
                            inputClassName="ng-input"
                            isDisabled={true}
                            value={basicDetailsForm.values.studentName}
                            onChange={basicDetailsForm.handleChange}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <DateInput
                            name="admissionDate"
                            labelText="Registration Date"
                            inputClassName="ng-input"
                            value={basicDetailsForm.values.admissionDate}
                            onChange={basicDetailsForm.handleChange}
                            maxDate={Current_Date}
                            isReadOnly={true}
                            isDisabled={true}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="genderId"
                            labelText="Gender"
                            labelClass="required"
                            inputClassName="ng-input"
                            value={basicDetailsForm.values.genderId}
                            onChange={onChangeGenderHndlr}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.genderId && basicDetailsForm.errors.genderId) ? true : false}
                            error={(basicDetailsForm.touched.genderId && basicDetailsForm.errors.genderId) ? basicDetailsForm.errors.genderId : ""}
                            menuItems={genderListResp?.data}
                            valueKey="genderId"
                            textKey="genderName"
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <DateInput
                            name="dateOfBirth"
                            labelText="Date of Birth"
                            labelClass="required"
                            inputClassName="ng-input"
                            isDisabled={true}
                            value={basicDetailsForm.values.dateOfBirth}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.dateOfBirth && basicDetailsForm.errors.dateOfBirth) ? true : false}
                            error={(basicDetailsForm.touched.dateOfBirth && basicDetailsForm.errors.dateOfBirth) ? basicDetailsForm.errors.dateOfBirth : ""}
                            maxDate={Student_Dob_MaxDate_YYYYMMDD}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <TextIconInput
                            name="priorityMail"
                            labelText="Priority Email Id"
                            labelClass="required"
                            inputClassName="ng-input"
                            value={basicDetailsForm.values.priorityMail}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.priorityMail && basicDetailsForm.errors.priorityMail) ? true : false}
                            error={(basicDetailsForm.touched.priorityMail && basicDetailsForm.errors.priorityMail) ? basicDetailsForm.errors.priorityMail : ""}
                        ><i className="ri-mail-unread-line"></i></TextIconInput>
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <PhoneInput
                            name="smsPriorityNo"
                            labelText="SMS Priority No"
                            labelClass="required"
                            inputClassName="ng-input"
                            value={basicDetailsForm.values.smsPriorityNo}
                            onChange={onChangePhoneInput}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.smsPriorityNo && basicDetailsForm.errors.smsPriorityNo) ? true : false}
                            error={(basicDetailsForm.touched.smsPriorityNo && basicDetailsForm.errors.smsPriorityNo) ? basicDetailsForm.errors.smsPriorityNo : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <PhoneInput
                            name="whatsappNo"
                            labelText="Whatsapp No"
                            inputClassName="ng-input"
                            value={basicDetailsForm.values.whatsappNo}
                            onChange={onChangePhoneInput}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.whatsappNo && basicDetailsForm.errors.whatsappNo) ? true : false}
                            error={(basicDetailsForm.touched.whatsappNo && basicDetailsForm.errors.whatsappNo) ? basicDetailsForm.errors.whatsappNo : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <TextInput
                            name="placeOfBirth"
                            labelText="Place of Birth"
                            labelClass="required"
                            inputClassName="ng-input"
                            value={basicDetailsForm.values.placeOfBirth}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.placeOfBirth && basicDetailsForm.errors.placeOfBirth) ? true : false}
                            error={(basicDetailsForm.touched.placeOfBirth && basicDetailsForm.errors.placeOfBirth) ? basicDetailsForm.errors.placeOfBirth : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="bloodGroupId"
                            labelText="Blood Group"
                            labelClass="required"
                            inputClassName="ng-input"
                            value={basicDetailsForm.values.bloodGroupId}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.bloodGroupId && basicDetailsForm.errors.bloodGroupId) ? true : false}
                            error={(basicDetailsForm.touched.bloodGroupId && basicDetailsForm.errors.bloodGroupId) ? basicDetailsForm.errors.bloodGroupId : ""}
                            menuItems={bloodGroupResp?.data}
                            valueKey="bloodGroupId"
                            textKey="bloodGroupName"
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="admissionType"
                            labelText="Admission Type"
                            labelClass="required"
                            inputClassName="ng-input"
                            value={basicDetailsForm.values.admissionType}
                            menuItems={admissionTypeState}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.admissionType && basicDetailsForm.errors.admissionType) ? true : false}
                            error={(basicDetailsForm.touched.admissionType && basicDetailsForm.errors.admissionType) ? basicDetailsForm.errors.admissionType : ""}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="casteId"
                            labelText="Caste"
                            labelClass="required"
                            inputClassName="ng-input"
                            value={basicDetailsForm.values.casteId}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.casteId && basicDetailsForm.errors.casteId) ? true : false}
                            error={(basicDetailsForm.touched.casteId && basicDetailsForm.errors.casteId) ? basicDetailsForm.errors.casteId : ""}
                            menuItems={casteListResp?.data}
                            valueKey="casteId"
                            textKey="casteName"
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <CustomSelect
                            name="subCasteId"
                            labelText="Sub Caste"
                            value={basicDetailsForm.values.subCasteId}
                            options={Array.isArray(subCasteListResp?.content)
                                ? subCasteListResp?.content
                                : []}
                            idKey="id"
                            searchKey="categoryName"
                            renderValue={renderValueSection}
                            renderOptions={renderOptionsSubCaste}
                            onChange={handleSubCasteChange}
                            inputClassName="ng-input !tw-py-2.5"
                            defaultSelect="Select"
                            // invalid={(basicDetailsForm.touched.subCasteId && basicDetailsForm.errors.subCasteId) ? true : false}
                            // error={(basicDetailsForm.touched.subCasteId && basicDetailsForm.errors.subCasteId) ? basicDetailsForm.errors.subCasteId : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="motherTongueId"
                            labelText="Mother Tongue"
                            labelClass="required"
                            inputClassName="ng-input"
                            value={basicDetailsForm.values.motherTongueId}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.motherTongueId && basicDetailsForm.errors.motherTongueId) ? true : false}
                            error={(basicDetailsForm.touched.motherTongueId && basicDetailsForm.errors.motherTongueId) ? basicDetailsForm.errors.motherTongueId : ""}
                            menuItems={motherToungeResp?.data}
                            valueKey="motherTongueId"
                            textKey="motherTongueName"
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <RadioInputContainer
                            name="isParentDPSAlumni"
                            labelText="Is the Parent Alumni of DPS ?"
                            inputContainerClassName="tw-mt-3"
                            radioClassName="form-radio-green"
                            radioOptions={trueFalseOptions}
                            value={basicDetailsForm.values.isParentDPSAlumni}
                            onChange={onChangeParentAlumniHandler}
                        // isDisabled={!edit}
                        />
                    </div>
                    {(basicDetailsForm.values.isParentDPSAlumni === "true") && <React.Fragment>
                        <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                            <SelectInput
                                name="dipSiteParent"
                                labelText="Father/Mother"
                                labelClass="required"
                                inputClassName="ng-input"
                                value={basicDetailsForm.values.dipSiteParent}
                                onChange={basicDetailsForm.handleChange}
                                onBlur={basicDetailsForm.handleBlur}
                                invalid={(basicDetailsForm.touched.dipSiteParent && basicDetailsForm.errors.dipSiteParent) ? true : false}
                                error={(basicDetailsForm.touched.dipSiteParent && basicDetailsForm.errors.dipSiteParent) ? basicDetailsForm.errors.dipSiteParent : ""}
                                menuItems={dipSiteParentOptions}
                                valueKey="id"
                                textKey="name"
                            />
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                            <SelectInput
                                name="dipSiteXYear"
                                labelClass="required"
                                labelText="Year of Passing X"
                                inputClassName="ng-input"
                                value={basicDetailsForm.values.dipSiteXYear}
                                onChange={basicDetailsForm.handleChange}
                                onBlur={basicDetailsForm.handleBlur}
                                invalid={(basicDetailsForm.touched.dipSiteXYear && basicDetailsForm.errors.dipSiteXYear) ? true : false}
                                error={(basicDetailsForm.touched.dipSiteXYear && basicDetailsForm.errors.dipSiteXYear) ? basicDetailsForm.errors.dipSiteXYear : ""}
                                menuItems={academicYearList}
                                valueKey="year"
                                textKey="year"
                            />
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                            <SelectInput
                                name="dipSiteXiiYear"
                                labelText="Year of Passing XII"
                                labelClass="required"
                                inputClassName="ng-input"
                                value={basicDetailsForm.values.dipSiteXiiYear}
                                onChange={basicDetailsForm.handleChange}
                                onBlur={basicDetailsForm.handleBlur}
                                invalid={(basicDetailsForm.touched.dipSiteXiiYear && basicDetailsForm.errors.dipSiteXiiYear) ? true : false}
                                error={(basicDetailsForm.touched.dipSiteXiiYear && basicDetailsForm.errors.dipSiteXiiYear) ? basicDetailsForm.errors.dipSiteXiiYear : ""}
                                menuItems={academicYearList}
                                valueKey="year"
                                textKey="year"
                            />
                        </div>

                    </React.Fragment>}

                </div>
            </AccordionBody>
        </form>
    )
}