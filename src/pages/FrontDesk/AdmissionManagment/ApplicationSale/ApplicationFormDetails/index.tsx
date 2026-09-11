import React, { useEffect, useState } from 'react'
import { default as NoteSvg } from "../../../../assets/imagesdps/academics/NoteSvg.svg?react";
import { DateInput, NewPhoneInput, SelectInput, TextArea, TextIconInput, TextInput } from '../../../../../Components/Common';
import { Button } from 'reactstrap';
import { useFormik } from 'formik';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../hooks/storehook';
import { getInstAcademicYearAct } from '../../../../../store/mastersettings/instacademics/instacademicactions';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchCurriculumAct } from '../../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { getCountriesAct, getGenderListAct } from '../../../../../store/masterdata/masterdataactions';
import { admissionTypesForDps, genderList } from '../helper';
import { getAcademicLanguagesDataAct } from '../../../../../store/mastersettings/instituteinfo/instituteinfoactions';
import * as Yup from 'yup';
import { getApplicationSaleClassList } from '../../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    fullName: "",
    dob: "",
    contactNumber: "",
    genderId: "",
    emailId: "",
    admissionClassId: "",
    secondLanguageId: "",
    admissionType: "",
    address: "",
    country: ""
}
const ApplicationFormDetails = (props: any) => {

    const dispatch = useDispatch();

    const [initialState, setInitialState] = useState(initialValues);

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        applicationSaleListResp,
        applicationSaleClassListResp,
        countriesResp,
        academicLanguages,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
    }: any = useAppSelector(
        ({ classroomManagmentInfo, assignGroupInfo, instAcademics, instituteInfo, branchAcademics, appData, masterData, feeConcession, feeCollections, applicationSale }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            applicationSaleListResp: applicationSale.applicationSaleListResp,
            applicationSaleClassListResp: applicationSale.applicationSaleClassListResp,
            countriesResp: masterData.countriesResp,
            academicLanguages: instituteInfo.academicLanguages,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
        }),
        shallowEqual
    );

    const validationSchema = Yup.object().shape({
        academicYearId: Yup.string().required('Select Academic Year'),
        curriculumId: Yup.string().required('Select Curriculum'),
        fullName: Yup.string().required('Enter Full Name'),
        dob: Yup.string().required('Select DOB'),
        contactNumber: Yup.string().required('Enter Contact Number'),
        genderId: Yup.string().required('Select Gender'),
        emailId: Yup.string().required('Enter Email Id'),
        admissionClassId: Yup.string().required('Select Class'),
        secondLanguageId: Yup.string().required('Select Secound Language'),
        admissionType: Yup.string().required('Select Admission Type'),
        address: Yup.string().required('Enter Address'),
        country: Yup.string().required('Select Country')
    })

    const ApplicationDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialState,
        validationSchema,
        onSubmit: (values) => {
            props.updateStepHndlr('payment_details', values)
        }
    })

    // useEffect(() => {
    //     const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    //     dispatch(
    //         getInstAcademicYearAct(
    //             generateActionPayload("get_inst_academic_year", undefined, payload)
    //         )
    //     );
    //     const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
    //     dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    //     return () => {
    //         dispatch(resetBrchCurriculumAct(undefined));
    //     }
    // }, []);

    const ChangeHandler = (event: any) => {
        ApplicationDetailsForm.handleChange(event);
        const { academicYearId } = ApplicationDetailsForm.values;
        const { name, value } = event.target;

        if (name === "curriculumId") {
            const payload = { instituteId: instituteId, branchId: branchId, curriculumId: value, academicYearId: academicYearId };
            dispatch(getApplicationSaleClassList(generateActionPayload("get_application_sale_class_list", undefined, payload)));
        }
    }
    const ContactNoChangeHandler = (contactNo: any) => {
        const contactNumber = contactNo.substring(2)
        ApplicationDetailsForm.setFieldValue('contactNumber', contactNumber);
    }


    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (props.isOpen) {
            if (Array.isArray(data) && data.length > 0) {
                let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
                ApplicationDetailsForm.setFieldValue('academicYearId', yearId);
                // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
                //  ((prev: any) => ({ ...prev, academicYearId: yearId }))
                // ApplicationSaleList({academicYearId:yearId})
            }
            dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender", sortBy: "genderName", orderBy: "asc" })));
            const payload = { instituteId, pageNo: 0, pageSize: 10000, sortBy: "languageName", orderBy: "asc" };
            dispatch(
                getAcademicLanguagesDataAct(
                    generateActionPayload("get_academic_language_data", undefined, payload)
                )
            );
            dispatch(getCountriesAct(generateActionPayload("get_countries")));
        }
    }, [props.isOpen]);

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { data: classTypes } = applicationSaleClassListResp || {};
    const { data: languages } = academicLanguages || {};

    return (
        <div className='px-4'>
            <div className='row mb-3'>
                <div className='col-6'>
                    <SelectInput
                        name="academicYearId"
                        value={ApplicationDetailsForm.values.academicYearId}
                        onChange={ChangeHandler}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='Academic Year'
                        invalid={ApplicationDetailsForm.touched.academicYearId &&
                            ApplicationDetailsForm.errors.academicYearId
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.academicYearId &&
                            ApplicationDetailsForm.errors.academicYearId
                            ? ApplicationDetailsForm.errors.academicYearId
                            : ""}
                    />
                </div>
                <div className='col-6'>
                    <SelectInput
                        name="curriculumId"
                        value={ApplicationDetailsForm.values.curriculumId}
                        onChange={ChangeHandler}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='Curriculum'
                        invalid={ApplicationDetailsForm.touched.curriculumId &&
                            ApplicationDetailsForm.errors.curriculumId
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.curriculumId &&
                            ApplicationDetailsForm.errors.curriculumId
                            ? ApplicationDetailsForm.errors.curriculumId
                            : ""}
                    />
                </div>

                {/* <div className='row mb-3'> */}
                <div className='col-6'>
                    <TextInput
                        name='fullName'
                        labelText='Full name along with Surname(as per Aadhar)'
                        value={ApplicationDetailsForm.values.fullName}
                        onChange={ChangeHandler}
                        formgroupClassName='mb-0'
                        invalid={ApplicationDetailsForm.touched.fullName &&
                            ApplicationDetailsForm.errors.fullName
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.fullName &&
                            ApplicationDetailsForm.errors.fullName
                            ? ApplicationDetailsForm.errors.fullName
                            : ""}
                    />
                </div>
                <div className='col-6'>
                    <DateInput
                        name={'dob'}
                        value={ApplicationDetailsForm.values.dob}
                        formgroupClassName="mb-0"
                        onChange={ChangeHandler}
                        labelText='DOB'
                        invalid={ApplicationDetailsForm.touched.dob &&
                            ApplicationDetailsForm.errors.dob
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.dob &&
                            ApplicationDetailsForm.errors.dob
                            ? ApplicationDetailsForm.errors.dob
                            : ""}
                    />
                </div>
                {/* </div> */}
                {/* <div className='row'> */}
                <div className='col-6'>
                    <NewPhoneInput
                        name="contactNumber"
                        labelText="Contact No(For SMS)"
                        value={ApplicationDetailsForm.values.contactNumber}
                        onChange={ContactNoChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        // isDisabled={!edit}
                        // labelClass="text-muted"
                        // inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent phone_no' : ""}`}
                        invalid={(ApplicationDetailsForm.touched.contactNumber && ApplicationDetailsForm.errors.contactNumber) ? true : false}
                        error={(ApplicationDetailsForm.touched.contactNumber && ApplicationDetailsForm.errors.contactNumber) ? ApplicationDetailsForm.errors.contactNumber : ""}
                    />
                </div>

                <div className='col-6'>
                    <TextIconInput
                        name="emailId"
                        labelText="Email Id(For Communication)"
                        value={ApplicationDetailsForm.values.emailId}
                        onChange={ChangeHandler}
                        formgroupClassName='mb-0'
                        invalid={ApplicationDetailsForm.touched.emailId &&
                            ApplicationDetailsForm.errors.emailId
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.emailId &&
                            ApplicationDetailsForm.errors.emailId
                            ? ApplicationDetailsForm.errors.emailId
                            : ""}
                    // onBlur={employeeCurrentJobForm.handleBlur}
                    // isReadOnly={!edit}
                    // inputClassName={`bg-transparent ${!edit ? 'border-0 border-bottom rounded-0' : ""}`}
                    // labelClass="text-muted"
                    >
                        <i className="ri-mail-unread-line"></i>
                    </TextIconInput>
                </div>
                {/* </div> */}
                {/* <div className='row mb-3'> */}
                <div className='col-6'>
                    <SelectInput
                        name="admissionType"
                        value={ApplicationDetailsForm.values.admissionType}
                        onChange={ChangeHandler}
                        menuItems={admissionTypesForDps}
                        valueKey="id"
                        textKey="name"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='Admission Type'
                        invalid={ApplicationDetailsForm.touched.admissionType &&
                            ApplicationDetailsForm.errors.admissionType
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.admissionType &&
                            ApplicationDetailsForm.errors.admissionType
                            ? ApplicationDetailsForm.errors.admissionType
                            : ""}
                    />
                </div>

                <div className='col-6'>
                    <SelectInput
                        name="genderId"
                        value={ApplicationDetailsForm.values.genderId}
                        onChange={ChangeHandler}
                        menuItems={genderList}
                        valueKey="id"
                        textKey="value"
                        // inputClassName="bg-light border-0"
                        // isDisabled={ApplicationDetailsForm.values.admissionType === "residential"}
                        formgroupClassName="mb-0"
                        labelText='Gender'
                        invalid={ApplicationDetailsForm.touched.genderId &&
                            ApplicationDetailsForm.errors.genderId
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.genderId &&
                            ApplicationDetailsForm.errors.genderId
                            ? ApplicationDetailsForm.errors.genderId
                            : ""}
                    />
                </div>
                {/* </div> */}
                {/* <div className='row mb-3'> */}
                <div className='col-6'>
                    <SelectInput
                        name="admissionClassId"
                        value={ApplicationDetailsForm.values.admissionClassId}
                        onChange={ChangeHandler}
                        menuItems={classTypes || []}
                        valueKey="classId"
                        textKey="classShortName"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='Admission For Class'
                        invalid={ApplicationDetailsForm.touched.admissionClassId &&
                            ApplicationDetailsForm.errors.admissionClassId
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.admissionClassId &&
                            ApplicationDetailsForm.errors.admissionClassId
                            ? ApplicationDetailsForm.errors.admissionClassId
                            : ""}
                    />
                </div>
                <div className='col-6'>
                    <SelectInput
                        name="secondLanguageId"
                        value={ApplicationDetailsForm.values.secondLanguageId}
                        onChange={ChangeHandler}
                        menuItems={languages || []}
                        valueKey="languageId"
                        textKey="languageName"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='Second Language'
                        invalid={ApplicationDetailsForm.touched.secondLanguageId &&
                            ApplicationDetailsForm.errors.secondLanguageId
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.secondLanguageId &&
                            ApplicationDetailsForm.errors.secondLanguageId
                            ? ApplicationDetailsForm.errors.secondLanguageId
                            : ""}
                    />
                </div>

                {/* </div> */}
                {/* <div className='row mb-3'> */}
                <div className='col-12'>
                    <TextArea
                        name="address"
                        value={ApplicationDetailsForm.values.address}
                        onChange={ChangeHandler}
                        formgroupClassName="mb-0"
                        labelText="Residential Address"
                        helperText='Note : Please fill the complete address including H.No,Landmark,city,state and country in address columns'
                        invalid={ApplicationDetailsForm.touched.address &&
                            ApplicationDetailsForm.errors.address
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.address &&
                            ApplicationDetailsForm.errors.address
                            ? ApplicationDetailsForm.errors.address
                            : ""}
                    />
                </div>
                {/* </div> */}
                {/* <div className='row mb-4'> */}
                <div className='col-6'>
                    <SelectInput
                        name="country"
                        value={ApplicationDetailsForm.values.country}
                        onChange={ChangeHandler}
                        menuItems={countriesResp || []}
                        valueKey="id"
                        textKey="countryName"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='Country'
                        invalid={ApplicationDetailsForm.touched.country &&
                            ApplicationDetailsForm.errors.country
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.country &&
                            ApplicationDetailsForm.errors.country
                            ? ApplicationDetailsForm.errors.country
                            : ""}
                    />
                </div>
            </div>
            {/* </div> */}
            <div className='row'>
                <div className='d- flex w-auto ms-auto mx-4 my-3'>
                    <button
                        type="submit"
                        className="btn btn-success px-4"
                        onClick={(event: any) => ApplicationDetailsForm.handleSubmit(event)}
                    >
                        Submit
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ApplicationFormDetails;
