import React, { useEffect, useState } from 'react'
import { AutoSearchInput, DateInput, NewPhoneInput, RadioInputContainer, SelectInput, TextIconInput, TextInput } from '../../../Components/Common'
import { useFormik } from 'formik';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/storehook';
import { getInstAcademicYearAct } from '../../../store/mastersettings/instacademics/instacademicactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchCurriculumAct } from '../../../store/branchsettings/branchacademics/branchacademicsactions';
import { getEmployeeByFilterAct, getEmployeesListAct } from '../../../store/directory/employeemanagement/employeemanagementactions';
import { getGenderListAct, getHrmDepartmentsListAct } from '../../../store/masterdata/masterdataactions';
import { getEnquiryDetailsByIdAct, setAddEnquiryAct, setUpdateEnquiryAct, getEnquirySourceListAct, resetEnquirySourceList } from '../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import * as Yup from 'yup';
import { getYyyyMmDdFormat } from '../../../utility/dateutility';
import { getAssignCurriculumListAct, getAssignLanClassListAct } from '../../../store/assignlanguages/assignlanguagesaction';
import { resetAssignLanClassListAct } from '../../../store/assignlanguages/assignlanguagesslice';
import Button from '../../../Components/Common/Button';

const initialValue = {
    academicYearId: "",
    curriculumId: "",
    parentName: "",
    eos: "false",
    employeeId: "",
    employeeDepartmentId: "",
    emailId: "",
    contactNumber: "",
    studentName: "",
    genderId: "",
    dob: "",
    classId: "",
    source: "",
    reasonForAdmission: "",
    fatherContactNumber: "",
    motherContactNumber: "",
    schoolLastStudied: "",
    address: ""
}

const EnquiryFormModal = (props: any) => {

    const dispatch = useDispatch();

    const [employeeState, setEmployeeState] = useState<any>(null);

    const [enquiryState, setEnquiryState] = useState(initialValue);
    const [academicYearListFilter, setAcademicYearListFilter] = useState<any>([]);

    const validationSchema = Yup.object().shape({
        academicYearId: Yup.string().required("Academic Year required."),
        curriculumId: Yup.string().required("Curriculum required."),
        parentName: Yup.string().required('Parent Name required.'),
        emailId: Yup.string().required('Email ID required.'),
        contactNumber: Yup.string().required('Contact Number required.'),
        studentName: Yup.string().required('Student Name required.'),
        genderId: Yup.string().required('Gender required.'),
        dob: Yup.string().required('DOB required.'),
        classId: Yup.string().required('Admission For required.'),
        source: Yup.string().required('Source required.'),
        reasonForAdmission: Yup.string().required('Reason For Admission required.'),
        fatherContactNumber: Yup.string().required('Father Contact Number required.'),
        motherContactNumber: Yup.string().required('Mother Contact Number required.'),
        schoolLastStudied: Yup.string().required('School Last Studied required.'),
        address: Yup.string().required('Address required.'),
    });

    const EnquiryForm = useFormik({
        initialValues: enquiryState,
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            let payload = {
                branchId: branchId,
                instituteId: instituteId,
                ...values,
                curriculumName: " ",
                curriculumId: +values.curriculumId,
                academicYearId: +values.academicYearId,
                genderId: +values.genderId,
                classId: +values.classId,
                contactNumber: +values.contactNumber,
                enquiryDate: new Date().toISOString(),
                eos: values.eos === "true" ? true : false,
                classAdmission: "abc",
                fatherContactNumber: +values.fatherContactNumber,
                motherContactNumber: +values.motherContactNumber,
                schoolLastStudied: values.schoolLastStudied,
                address: values.address,
            }
            if (props.enquiryId) {
                dispatch(setUpdateEnquiryAct(generateActionPayload('get_enquiry_details_by_id', { enquiryId: props.enquiryId }, payload)))
            }
            else {
                dispatch(setAddEnquiryAct(generateActionPayload('add_enquiry', undefined, payload)))
            }
        }
    })

    const {
        academicYearListResp,
        getAssignListCurriculumResp,
        getAssignLanClassListResp,
        getEmployeesByFilterResp,
        employeesListResp,
        enquiryByIdResp,
        genderListResp,
        hrmDepartmentResp,
        enquirySourceListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader
    } = useAppSelector(
        ({ assignLanguages, globalData, masterData, directoryEmployee, instAcademics, branchAcademics, appData, feeConcession, feeCollections, applicationSale }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
            getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
            branchClassResp: branchAcademics.branchClassResp,
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            hrmDepartmentResp: masterData.hrmDepartmentResp,
            employeesListResp: directoryEmployee.employeesListResp,
            enquiryByIdResp: applicationSale.enquiryByIdResp,
            genderListResp: masterData.genderListResp,
            enquirySourceListResp: applicationSale.enquirySourceListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    function onEmployeeInputSearchChange(inputString: any) {
        if (inputString) {
            // const params = { searchString: inputString };
            // dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId })));
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name",
                { searchString: inputString }, { branchId })));
        }
    }
    function getEmployeeApiCall(employeeId: any) {
        // const sortingParams = getSortingKeys(sortingRef.current, true);
        const params = { employeeIds: employeeId, branchId: branchId };
        dispatch(getEmployeesListAct(generateActionPayload("get_employees", undefined, params)));
    }
    const selectedEmployee = (employee: any) => {
        EnquiryForm.setFieldValue('employeeId', employee.id)
        setEmployeeState(employee);
        getEmployeeApiCall(employee.id);
    }

    const getClassApiCall = (otherProps?:any)=>{
        const payload = { branchId: branchId, academicYearId : EnquiryForm.values.academicYearId, curriculumId: EnquiryForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
        dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload = { academicYearId: EnquiryForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
    }

    const ChangeHandler = (event: any) => {
        const { name, value } = event.target;

        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetAssignLanClassListAct(undefined));
            EnquiryForm.setValues((prev:any) => ({ ...prev, [name]: value ,curriculumId:"", classId : "" }));
        }
        else if (name === "curriculumId") {
            if (value) {
                getClassApiCall({ curriculumId: value,academicYearId:EnquiryForm.values.academicYearId});
            }
            else {
                dispatch(resetAssignLanClassListAct(undefined));
            }
            EnquiryForm.setValues((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
        } else {
            EnquiryForm.setValues((prevState: any) => ({ ...prevState, [name]: value }));
        }

    }
    function onChangePhoneInput(date: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = date.substring(2);
        EnquiryForm.setFieldValue(name, updateDate);
    }

    useEffect(() => {
        // const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        // dispatch(
        //     getInstAcademicYearAct(
        //         generateActionPayload("get_inst_academic_year", undefined, payload)
        //     )
        // );
        // const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        // dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        // dispatch(getHrmDepartmentsListAct(generateActionPayload("get_hrm_department", undefined, { instituteId: props.instituteId, sortBy: "departmentName", orderBy: "asc" })));
        dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender", sortBy: "genderName", orderBy: "asc" })));
        return () => {
            // dispatch(resetBrchCurriculumAct(undefined));
            // dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        if (employeesListResp && Array.isArray(employeesListResp.data) && employeesListResp.data.length > 0) {
            EnquiryForm.setFieldValue('employeeDepartmentId', employeesListResp.data[0].empDepartmentName);
            EnquiryForm.setFieldValue('emailId', employeesListResp.data[0].personalEmailId);
            EnquiryForm.setFieldValue('contactNumber', employeesListResp.data[0].contactNumber);
        }
    }, [employeesListResp])

    useEffect(() => {
        if(enquiryByIdResp){
            setEnquiryState({...enquiryByIdResp,eos:enquiryByIdResp?.eos||"false"});
            const payload = { branchId: branchId,academicYearId : enquiryByIdResp.academicYearId, curriculumId: enquiryByIdResp.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            payload.curriculumId && getClassApiCall(payload);
        }
    }, [enquiryByIdResp])
    useEffect(()=>{
        if(!props.isOpen){
            EnquiryForm.resetForm();
            setEnquiryState(initialValue)
        }else{
            if (props.enquiryId) {
                dispatch(getEnquiryDetailsByIdAct(generateActionPayload('get_enquiry_details_by_id', { enquiryId: props.enquiryId },)))
            }
        }
    },[props.isOpen])

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = getAssignListCurriculumResp || {};
    const { data: employeeList, pageNumber, totalPages, totalRecords } = employeesListResp || {};
    const { content: classTypes } = getAssignLanClassListResp || {};

    useEffect(() => {
    if(academicYearListResp){
        const academicYearId = academicYearList?.filter((i:any)=>i.yearStatus === "UPCOMING")[0]?.academicYearId;        
        EnquiryForm.setFieldValue('academicYearId', academicYearId);
        setAcademicYearListFilter(academicYearList?.filter((i:any)=>{
            return (i.yearStatus === "CURRENT") || (i.yearStatus === "UPCOMING")
        }))
        getCurriculumApiCall({ academicYearId: academicYearId });
    }
    }, [academicYearListResp])

    useEffect(() => {
            dispatch(getEnquirySourceListAct(generateActionPayload("get_enquiry_source_list", undefined, {})));
    }, [])

    return (
        <>
            <div className='tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-3 tw-p-3'>
                <div>
                    <SelectInput
                        name="academicYearId"
                        value={EnquiryForm.values.academicYearId}
                        onChange={ChangeHandler}
                        menuItems={academicYearListFilter || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        // inputClassName="tw-border-0"
                        formgroupClassName="tw-mb-0"
                        // isDisabled={true}
                        labelText='Academic Year'
                        invalid={
                            EnquiryForm.touched.academicYearId &&
                                EnquiryForm.errors.academicYearId
                                ? true
                                : false
                        }
                        error={
                            EnquiryForm.touched.academicYearId &&
                                EnquiryForm.errors.academicYearId
                                ? EnquiryForm.errors.academicYearId
                                : ""
                        }
                        labelClass='required'
                    />
                </div>
                <div>
                    <SelectInput
                        name="curriculumId"
                        value={EnquiryForm.values.curriculumId}
                        onChange={ChangeHandler}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        formgroupClassName="tw-mb-0"
                        labelText='Curriculum'
                        invalid={
                            EnquiryForm.touched.curriculumId &&
                                EnquiryForm.errors.curriculumId
                                ? true
                                : false
                        }
                        error={
                            EnquiryForm.touched.curriculumId &&
                                EnquiryForm.errors.curriculumId
                                ? EnquiryForm.errors.curriculumId
                                : ""
                        }
                        labelClass='required'
                    />
                </div>
                <div>
                    <TextInput
                        name={'parentName'}
                        value={EnquiryForm.values.parentName}
                        formgroupClassName="tw-mb-0"
                        onChange={EnquiryForm.handleChange}
                        labelText='Parent Name'
                        invalid={
                            EnquiryForm.touched.parentName &&
                                EnquiryForm.errors.parentName
                                ? true
                                : false
                        }
                        error={
                            EnquiryForm.touched.parentName &&
                                EnquiryForm.errors.parentName
                                ? EnquiryForm.errors.parentName
                                : ""
                        }
                        labelClass='required'
                    />
                </div>
                <div>
                    <RadioInputContainer
                        name="eos"
                        labelText="Are You Employee Of School"
                        inputContainerClassName="tw-mt-2"
                        radioOptions={[{ id: "true", name: "Yes" }, { id: "false", name: "No" }]}
                        value={EnquiryForm.values.eos}
                        onChange={EnquiryForm.handleChange}
                        formgroupClassName="tw-mb-0"
                    />
                </div>
                {EnquiryForm.values.eos === "true" && <div>
                    <label>Employee</label>
                    <AutoSearchInput
                        formgroupClassName="search-box tw-w-full"
                        name="employeeString"
                        placeHolder="Search..."
                        // onChange={(e: any) => setSearchInputState(e.target.value)}
                        onChange={(string: any) => {
                            if (!string) EnquiryForm.setFieldValue('employeeId', "");
                            onEmployeeInputSearchChange(string)
                        }}
                        valueKey="id"
                        labelKey="employeeName"
                        subLabelKey="employeeCode"
                        labelHeader="Employee Code"
                        subLabelHeader="Employee Name"
                        options={(Array.isArray(getEmployeesByFilterResp) && getEmployeesByFilterResp) || []}
                        selected={employeeState}
                        selectedOptionCallbck={selectedEmployee}
                        invalid={
                            EnquiryForm.touched.employeeId &&
                                EnquiryForm.errors.employeeId
                                ? true
                                : false
                        }
                        error={
                            EnquiryForm.touched.employeeId &&
                                EnquiryForm.errors.employeeId
                                ? EnquiryForm.errors.employeeId
                                : ""
                        }
                        labelClass='required'
                    ><i className="ri-search-line search-icon"></i></AutoSearchInput>
                </div>}
                {EnquiryForm.values.eos === "true" && <div>
                    <TextInput
                        name={'employeeDepartmentId'}
                        value={EnquiryForm.values.employeeDepartmentId}
                        formgroupClassName="tw-mb-0"
                        onChange={EnquiryForm.handleChange}
                        isDisabled={true}
                        labelText='Department'
                    />
                </div>}
                <div>
                    <TextIconInput
                        name="emailId"
                        labelText="Email ID"
                        value={EnquiryForm.values.emailId}
                        onChange={EnquiryForm.handleChange}
                        formgroupClassName='tw-mb-0'
                        invalid={(EnquiryForm.touched.emailId && EnquiryForm.errors.emailId) ? true : false}
                        error={(EnquiryForm.touched.emailId && EnquiryForm.errors.emailId) ? EnquiryForm.errors.emailId : ""}
                        labelClass='required'
                    ><i className="ri-mail-unread-line"></i></TextIconInput>
                </div>
                <div>
                    <NewPhoneInput
                        name="contactNumber"
                        labelText="Phone No."
                        value={EnquiryForm.values.contactNumber}
                        onChange={onChangePhoneInput}
                        formgroupClassName='tw-mb-0'
                        invalid={(EnquiryForm.touched.contactNumber && EnquiryForm.errors.contactNumber) ? true : false}
                        error={(EnquiryForm.touched.contactNumber && EnquiryForm.errors.contactNumber) ? EnquiryForm.errors.contactNumber : ""}
                        labelClass='required'
                    // isDisabled={true}
                    />
                </div>
                <div>
                    <TextInput
                        name={'studentName'}
                        value={EnquiryForm.values.studentName}
                        formgroupClassName="tw-mb-0"
                        onChange={EnquiryForm.handleChange}
                        // isDisabled={true}
                        labelText='Student Name'
                        invalid={EnquiryForm.touched.studentName &&
                            EnquiryForm.errors.studentName
                            ? true
                            : false}
                        error={EnquiryForm.touched.studentName &&
                            EnquiryForm.errors.studentName
                            ? EnquiryForm.errors.studentName
                            : ""}
                        labelClass='required'
                    />
                </div>
                <div>
                    <SelectInput
                        name="genderId"
                        value={EnquiryForm.values.genderId}
                        onChange={EnquiryForm.handleChange}
                        menuItems={genderListResp?.data || []}
                        valueKey="genderId"
                        textKey="genderName"
                        formgroupClassName="tw-mb-0"
                        labelText='Gender'
                        invalid={EnquiryForm.touched.genderId &&
                            EnquiryForm.errors.genderId
                            ? true
                            : false}
                        error={EnquiryForm.touched.genderId &&
                            EnquiryForm.errors.genderId
                            ? EnquiryForm.errors.genderId
                            : ""}
                        labelClass='required'
                    />
                </div>
                <div>
                    <DateInput
                        name="dob"
                        labelText="DOB"
                        value={EnquiryForm.values.dob}
                        onChange={EnquiryForm.handleChange}
                        invalid={(EnquiryForm.touched.dob && EnquiryForm.errors.dob) ? true : false}
                        error={(EnquiryForm.touched.dob && EnquiryForm.errors.dob) ? EnquiryForm.errors.dob : ""}
                        formgroupClassName='tw-mb-0'
                        maxDate={getYyyyMmDdFormat(new Date().toDateString())}
                        labelClass='required'
                    />
                </div>
                <div>
                    <NewPhoneInput
                        name="fatherContactNumber"
                        labelText="Father Contact No."
                        value={EnquiryForm.values.fatherContactNumber}
                        onChange={onChangePhoneInput}
                        formgroupClassName='tw-mb-0'
                        invalid={(EnquiryForm.touched.fatherContactNumber && EnquiryForm.errors.fatherContactNumber) ? true : false}
                        error={(EnquiryForm.touched.fatherContactNumber && EnquiryForm.errors.fatherContactNumber) ? EnquiryForm.errors.fatherContactNumber : ""}
                        labelClass='required'
                    // isDisabled={true}
                    />
                </div>
                <div>
                    <NewPhoneInput
                        name="motherContactNumber"
                        labelText="Mother Contact No."
                        value={EnquiryForm.values.motherContactNumber}
                        onChange={onChangePhoneInput}
                        formgroupClassName='tw-mb-0'
                        invalid={(EnquiryForm.touched.motherContactNumber && EnquiryForm.errors.motherContactNumber) ? true : false}
                        error={(EnquiryForm.touched.motherContactNumber && EnquiryForm.errors.motherContactNumber) ? EnquiryForm.errors.motherContactNumber : ""}
                        labelClass='required'
                    // isDisabled={true}
                    />
                </div>
                <div>
                    <TextInput
                        name={'schoolLastStudied'}
                        value={EnquiryForm.values.schoolLastStudied}
                        formgroupClassName="tw-mb-0"
                        onChange={EnquiryForm.handleChange}
                        // isDisabled={true}
                        labelText='Last School Studied'
                        invalid={EnquiryForm.touched.schoolLastStudied &&
                            EnquiryForm.errors.schoolLastStudied
                            ? true
                            : false}
                        error={EnquiryForm.touched.schoolLastStudied &&
                            EnquiryForm.errors.schoolLastStudied
                            ? EnquiryForm.errors.schoolLastStudied
                            : ""}
                        labelClass='required'
                    />
                </div>
                <div>
                    <TextInput
                        name={'address'}
                        value={EnquiryForm.values.address}
                        formgroupClassName="tw-mb-0"
                        onChange={EnquiryForm.handleChange}
                        // isDisabled={true}
                        labelText='Address'
                        invalid={EnquiryForm.touched.address &&
                            EnquiryForm.errors.address
                            ? true
                            : false}
                        error={EnquiryForm.touched.address &&
                            EnquiryForm.errors.address
                            ? EnquiryForm.errors.address
                            : ""}
                        labelClass='required'
                    />
                </div>
                <div>
                    <SelectInput
                        name="classId"
                        value={EnquiryForm.values.classId}
                        onChange={EnquiryForm.handleChange}
                        menuItems={classTypes || []}
                        valueKey="id"
                        textKey="shortName"
                        formgroupClassName="tw-mb-0"
                        labelText='Admission For'
                        invalid={EnquiryForm.touched.classId &&
                            EnquiryForm.errors.classId
                            ? true
                            : false}
                        error={EnquiryForm.touched.classId &&
                            EnquiryForm.errors.classId
                            ? EnquiryForm.errors.classId
                            : ""}
                        labelClass='required'
                    />
                </div>
                <div>
                    <SelectInput
                        name="source"
                        value={EnquiryForm.values.source}
                        onChange={EnquiryForm.handleChange}
                        menuItems={enquirySourceListResp || []}
                        valueKey="sourceName"
                        textKey="sourceName"
                        formgroupClassName="tw-mb-0"
                        labelText='Source'
                        invalid={EnquiryForm.touched.source &&
                            EnquiryForm.errors.source
                            ? true
                            : false}
                        error={EnquiryForm.touched.source &&
                            EnquiryForm.errors.source
                            ? EnquiryForm.errors.source
                            : ""}
                        labelClass='required'
                    />
                </div>
                <div>
                    <TextInput
                        name={'reasonForAdmission'}
                        value={EnquiryForm.values.reasonForAdmission}
                        formgroupClassName="tw-mb-0"
                        onChange={EnquiryForm.handleChange}
                        labelText='Reason For Seeking Admission'
                        // isDisabled={true}
                        invalid={EnquiryForm.touched.reasonForAdmission &&
                            EnquiryForm.errors.reasonForAdmission
                            ? true
                            : false}
                        error={EnquiryForm.touched.reasonForAdmission &&
                            EnquiryForm.errors.reasonForAdmission
                            ? EnquiryForm.errors.reasonForAdmission
                            : ""}
                        labelClass='required'
                    />
                </div>
            </div>
            <div className='tw-grid tw-grid-cols-1'>
                <div className='tw-flex tw-justify-end tw-gap-3 tw-mx-4 tw-my-3'>
                    <Button
                        type="submit"
                        variant='secondary'
                        onClick={() => props.toggle()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant='primary'
                        disabled={showApiLoader}
                        onClick={(event: any) => EnquiryForm.handleSubmit(event)}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default EnquiryFormModal
