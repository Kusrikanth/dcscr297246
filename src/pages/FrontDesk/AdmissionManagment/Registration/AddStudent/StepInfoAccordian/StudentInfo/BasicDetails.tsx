import React, { useState, useEffect, useImperativeHandle, useContext, useRef, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer,
    TextInputWithRegex,
    AutoSearchInputSingle
} from "../../../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    trueFalseOptions,
    dipSiteParentOptions
} from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import { getTrueFalseOptions, uploadImageFileErrorHndlr } from "../../../../../../../utility/commonutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct
} from "../../../../../../../store/masterdata/masterdataactions";
import {
    getApplicationSaleBySearchAct,
    setApplicationSaleByApplicationNoAct
} from "../../../../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import {
    getInstAcademicYearAct,
} from "../../../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";

//Utility 
import {
    getAcademicYears, Current_Date,
    Min_Date, MinDate_YYYYMMDD, Max_Date,
    getYyyyMmDdFormat, getYearGapCurrentDate, Current_Date_YYYYMMDD, getParticularFormatDate, getFormYyyyMmDdFormat
} from "../../../../../../../utility/dateutility";
import { toast } from "react-toastify";

const Max_Age_Year = 4;
const Student_Dob_MaxDate_YYYYMMDD = getYyyyMmDdFormat(getYearGapCurrentDate(Max_Age_Year));


const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Select academic year."),
    applicationNo: Yup.string().required("Application number required."),
    studentName: Yup.string().required("Student name required."),
    admissionDate: Yup.date().required('Date of admission required.')
        .min(MinDate_YYYYMMDD, `Date of admission should be more than ${Min_Date}.`).max(Current_Date_YYYYMMDD, `Date of admission cannot be future date.`),
    aadharNo: Yup.string().matches(/^[0-9]{12,12}$/, 'Aadhar card number should be 12 digit.').required("Aadhar number required."),
    genderId: Yup.string().required("Select gender.").nullable(),
    dateOfBirth: Yup.date().min(MinDate_YYYYMMDD, `DOB should be more than ${Min_Date}.`)
        .max(Student_Dob_MaxDate_YYYYMMDD, `Student age should be greater than ${Max_Age_Year} year.`).required("Select dob."),
    priorityMail: Yup.string().email('Invalid Email.').required("Email id required."),
    smsPriorityNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'SMS Priority No. with 10 digit is valid.').required("SMS Priority No. is required."),
    placeOfBirth: Yup.string().required("Birth place required."),
    bloodGroupId: Yup.string().required("Select blood group."),
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
        admissionDate: getFormYyyyMmDdFormat(initialState?.admissionDate),
        aadharNo: initialState?.aadharNo || "",
        genderId: initialState?.genderId || "",
        dateOfBirth: getFormYyyyMmDdFormat(initialState?.dateOfBirth),
        priorityMail: initialState?.priorityMail || "",
        smsPriorityNo: initialState?.smsPriorityNo || "",
        placeOfBirth: initialState?.placeOfBirth || "",
        bloodGroupId: initialState?.bloodGroupId || "",
        isParentDPSAlumni: getTrueFalseOptions(initialState?.isParentDPSAlumni),
        dipSiteParent: initialState?.dipSiteParent || "",
        dipSiteXYear: initialState?.dipSiteXYear || "",
        dipSiteXiiYear: initialState?.dipSiteXiiYear || "",
    }
}

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const initialValues = getInitialState();
export default function BasicDetails({ stepId, formId, branchId, instituteId, storeMultiFormDataCallback }: any) {
    const { setApplicationSaleInfo, currentMultiFormKeys, tabsData } = useContext<any>(StepperFormContext);
    const [selectedApplicationNoState, setSelectedApplicationNoState] = useState<any>(null);
    const [applicationNoListState, setApplicationNoListState] = useState<any>([]);
    const dispatch = useAppDispatch();
    const { applicationSaleBySearch, genderListResp, bloodGroupResp,
        academicYearListResp, instAcademicErrorResp, masterDataErrorResp,
        applicationSaleError } =
        useAppSelector(({ masterData, applicationSale, instAcademics }) => ({
            applicationSaleBySearch: applicationSale.applicationSaleBySearch,
            genderListResp: masterData.genderListResp,
            bloodGroupResp: masterData.bloodGroupResp,
            academicYearListResp: instAcademics.academicYearListResp,
            instAcademicErrorResp: instAcademics.instAcademicErrorResp,
            masterDataErrorResp: masterData.masterDataErrorResp,
            applicationSaleError: applicationSale.applicationSaleError,
        }), shallowEqual);

    const basicDetailsRef = useRef({
        prevApplicationSaleBySearch: applicationSaleBySearch,
        prevApplicationSaleError: applicationSaleError
    });

    useEffect(() => {
        const { prevApplicationSaleBySearch, prevApplicationSaleError } = basicDetailsRef.current;
        if (applicationSaleBySearch && prevApplicationSaleBySearch !== applicationSaleBySearch) {
            if (Array.isArray(applicationSaleBySearch)) {
                const applicateSalesList = applicationSaleBySearch.map(item => ({
                    ...item?.saleFormDetails
                }))
                setApplicationNoListState(applicateSalesList);
            } else {
                setApplicationNoListState([]);
            }
        } else if (applicationSaleError && prevApplicationSaleError !== applicationSaleError) {
            const { message } = applicationSaleError;
            setApplicationNoListState([]);
            setSelectedApplicationNoState(null);
            toast.error(message || "Something went wrong.");
        }
        basicDetailsRef.current.prevApplicationSaleBySearch = applicationSaleBySearch;
        basicDetailsRef.current.prevApplicationSaleError = applicationSaleError;
    }, [applicationSaleBySearch, applicationSaleError]);

    useEffect(() => {
        const academicYearPayload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
        const payload = { instituteId, pageNo: 0, pageSize: 100 };
        dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, academicYearPayload)));
        dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender", sortBy: "genderName", orderBy: "asc" })));
        dispatch(getBloodGroupAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "blood-group", sortBy: "bloodGroupName", orderBy: "asc" })));
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
            const payload = { ...values };
            // payload.admissionDate = getParticularFormatDate(admissionDate, "dd-MM-yyyy");
            // payload.dateOfBirth = getParticularFormatDate(dateOfBirth, "dd-MM-yyyy");
            payload.branchId = branchId;
            storeMultiFormDataCallback(formId, true, payload);
        }
    })
    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            basicDetailsForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (tabsData[stepId]) {
            const { applicationNo, applicationId } = tabsData[stepId] || {};
            const formData = getInitialState(tabsData[stepId]);
            basicDetailsForm.resetForm({
                values: formData
            });

            setSelectedApplicationNoState({
                applicationNumber: applicationNo, applicationId
            });
        }
    }, [tabsData, stepId]);

    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        basicDetailsForm.setFieldValue(name, updateDate);
    }

    function selectedApplicationHndlr(selectedApplicationInfo: any) {
        const { applicationNumber } = selectedApplicationInfo || {};
        setSelectedApplicationNoState(selectedApplicationInfo);
        basicDetailsForm.setFieldValue("applicationNo", applicationNumber || "");
        if (applicationNumber) {
            const info = applicationSaleBySearch.find((item: any) => item?.saleFormDetails?.applicationNumber === applicationNumber);
            setApplicationSaleInfo(info);
        } else {
            setApplicationSaleInfo({});
        }
    }

    function onSearchApplicationNoHndlr(inputString: any) {
        dispatch(getApplicationSaleBySearchAct(generateActionPayload("application_sale_bynum", {
            applicationNumber: inputString
        })))
    }

    return (
        <form onSubmit={basicDetailsForm.handleSubmit} noValidate>
            <AccordionHeader tag="span" className="fs-normal" targetId="basicInfo">
                Basic Details
            </AccordionHeader>
            <AccordionBody accordionId="basicInfo">
                <div className="row">
                    <div className="col-4">
                        <SelectInput
                            name="academicYearId"
                            labelText="Academic Year"
                            // formgroupClassName="mb-4"
                            value={basicDetailsForm.values.academicYearId}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.academicYearId && basicDetailsForm.errors.academicYearId) ? true : false}
                            error={(basicDetailsForm.touched.academicYearId && basicDetailsForm.errors.academicYearId) ? basicDetailsForm.errors.academicYearId : ""}
                            menuItems={academicYearListResp?.data}
                            // defaultSelect="Academic Year"
                            valueKey="academicYearId"
                            textKey="academicYearName"
                        />
                    </div>
                    <div className="col-4">
                        <AutoSearchInputSingle
                            formgroupClassName="search-box mb-3"
                            name="applicationNo"
                            labelText="Application No."
                            placeHolder="Search..."
                            // onChange={(e: any) => setSearchInputState(e.target.value)}
                            onChange={onSearchApplicationNoHndlr}
                            onBlur={basicDetailsForm.handleBlur}
                            valueKey="applicationNumber"
                            labelHeader="Application No"
                            labelKey="applicationNumber"
                            options={applicationNoListState}
                            selected={selectedApplicationNoState}
                            selectedOptionCallbck={selectedApplicationHndlr}
                            invalid={(basicDetailsForm.touched.applicationNo && basicDetailsForm.errors.applicationNo) ? true : false}
                            error={(basicDetailsForm.touched.applicationNo && basicDetailsForm.errors.applicationNo) ? basicDetailsForm.errors.applicationNo : ""}
                        ><i className="ri-search-line search-icon"></i>
                        </AutoSearchInputSingle>
                        {/* <TextInput
                            name="applicationNo"
                            labelText="Application No."
                            // formgroupClassName="mb-4"
                            value={basicDetailsForm.values.applicationNo}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.applicationNo && basicDetailsForm.errors.applicationNo) ? true : false}
                            error={(basicDetailsForm.touched.applicationNo && basicDetailsForm.errors.applicationNo) ? basicDetailsForm.errors.applicationNo : ""}
                        /> */}
                    </div>
                    <div className="col-4">
                        <TextInput
                            name="studentName"
                            labelText="Student Name"
                            value={basicDetailsForm.values.studentName}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.studentName && basicDetailsForm.errors.studentName) ? true : false}
                            error={(basicDetailsForm.touched.studentName && basicDetailsForm.errors.studentName) ? basicDetailsForm.errors.studentName : ""}
                        // helperText="Full name as displayed on Aadhar Number"
                        />
                    </div>
                    <div className="col-4">
                        <DateInput
                            name="admissionDate"
                            labelText="Admission Date"
                            // formgroupClassName="mb-4"
                            value={basicDetailsForm.values.admissionDate}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.admissionDate && basicDetailsForm.errors.admissionDate) ? true : false}
                            error={(basicDetailsForm.touched.admissionDate && basicDetailsForm.errors.admissionDate) ? basicDetailsForm.errors.admissionDate : ""}
                            maxDate={Current_Date}
                        />
                    </div>
                    <div className="col-4">
                        <TextInputWithRegex
                            name="aadharNo"
                            labelText="Aadhar Number"
                            value={basicDetailsForm.values.aadharNo}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.aadharNo && basicDetailsForm.errors.aadharNo) ? true : false}
                            error={(basicDetailsForm.touched.aadharNo && basicDetailsForm.errors.aadharNo) ? basicDetailsForm.errors.aadharNo : ""}
                            maxLength={12}
                            allowedInputRegex="^[0-9]+$"
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="genderId"
                            labelText="Gender"
                            value={basicDetailsForm.values.genderId}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.genderId && basicDetailsForm.errors.genderId) ? true : false}
                            error={(basicDetailsForm.touched.genderId && basicDetailsForm.errors.genderId) ? basicDetailsForm.errors.genderId : ""}
                            menuItems={genderListResp?.data}
                            valueKey="genderId"
                            textKey="genderName"
                        />
                    </div>
                    <div className="col-4">
                        <DateInput
                            name="dateOfBirth"
                            labelText="Date of Birth"
                            value={basicDetailsForm.values.dateOfBirth}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.dateOfBirth && basicDetailsForm.errors.dateOfBirth) ? true : false}
                            error={(basicDetailsForm.touched.dateOfBirth && basicDetailsForm.errors.dateOfBirth) ? basicDetailsForm.errors.dateOfBirth : ""}
                            maxDate={Student_Dob_MaxDate_YYYYMMDD}
                        />
                    </div>
                    <div className="col-4">
                        <TextIconInput
                            name="priorityMail"
                            labelText="Priority Email Id"
                            value={basicDetailsForm.values.priorityMail}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.priorityMail && basicDetailsForm.errors.priorityMail) ? true : false}
                            error={(basicDetailsForm.touched.priorityMail && basicDetailsForm.errors.priorityMail) ? basicDetailsForm.errors.priorityMail : ""}
                        ><i className="ri-mail-unread-line"></i></TextIconInput>
                    </div>
                    <div className="col-4">
                        <PhoneInput
                            name="smsPriorityNo"
                            labelText="SMS Priority No"
                            value={basicDetailsForm.values.smsPriorityNo}
                            onChange={onChangePhoneInput}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.smsPriorityNo && basicDetailsForm.errors.smsPriorityNo) ? true : false}
                            error={(basicDetailsForm.touched.smsPriorityNo && basicDetailsForm.errors.smsPriorityNo) ? basicDetailsForm.errors.smsPriorityNo : ""}
                        />
                    </div>
                    <div className="col-4">
                        <TextInput
                            name="placeOfBirth"
                            labelText="Place of Birth"
                            value={basicDetailsForm.values.placeOfBirth}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.placeOfBirth && basicDetailsForm.errors.placeOfBirth) ? true : false}
                            error={(basicDetailsForm.touched.placeOfBirth && basicDetailsForm.errors.placeOfBirth) ? basicDetailsForm.errors.placeOfBirth : ""}
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="bloodGroupId"
                            labelText="Blood Group"
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
                    <div className="col-4">
                        <RadioInputContainer
                            name="isParentDPSAlumni"
                            labelText="Is the Parent Alumni of DPS ?"
                            inputContainerClassName="mt-2"
                            radioOptions={trueFalseOptions}
                            value={basicDetailsForm.values.isParentDPSAlumni}
                            onChange={basicDetailsForm.handleChange}
                        // isDisabled={!edit}
                        />
                    </div>

                    {(basicDetailsForm.values.isParentDPSAlumni === "true") &&
                        <React.Fragment>
                            <div className="col-4">
                                <SelectInput
                                    name="dipSiteParent"
                                    labelText="Father/Mother"
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
                            <div className="col-4">
                                <SelectInput
                                    name="dipSiteXYear"
                                    labelText="Year of Passing X"
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
                            <div className="col-4">
                                <SelectInput
                                    name="dipSiteXiiYear"
                                    labelText="Year of Passing XII"
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