import React, { useEffect, useRef, useState } from 'react'
import { AutoSearchInputUpdated,TextInput, TextInputGroup, TimeInput } from '../../../../Components/Common'
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getStudentsListAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { getEmpHealthDetailsAct, getStuHealthDetailsAct } from '../../../../store/healthrecords/healthrecordsaction';
import { useLocation } from 'react-router-dom';
import { calculateAge } from './helper';
import { getEmployeeByFilterAct } from '../../../../store/directory/employeemanagement/employeemanagementactions';
import { getAllocationDetailsAct } from '../../../../store/transportation/TransportationRecords/transportationrecordsaction';
import { toast } from 'react-toastify';


const StudentDetails = (props: any) => {

    const { addStudentHealthRecordForm , route } = props || {};
    const { isDisabled , isEditDisabled } = route || {};

    const dispatch = useDispatch();
    const location:any = useLocation()

    const [searchStudentState, setSearchStudentState] = useState<any>(null);
    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(null);

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        studentsListResp,
        getEmployeesByFilterResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getStuHealthDetailsResp,
        getEmpHealthDetailsResp,
        getAllocationDetailsResp,
        getHealthRecordsListByIdResp,
        transportationRecordsErrorResp,
    }: any = useAppSelector(
        ({globalData, instAcademics, branchAcademics, appData, directoryStudent, directoryEmployee, transportrecords, healthRecords }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            studentsListResp: directoryStudent.studentsListResp,
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getStuHealthDetailsResp : healthRecords.getStuHealthDetailsResp,
            getEmpHealthDetailsResp : healthRecords.getEmpHealthDetailsResp,
            getAllocationDetailsResp: transportrecords.getAllocationDetailsResp,
            getHealthRecordsListByIdResp : healthRecords.getHealthRecordsListByIdResp,
            transportationRecordsErrorResp: transportrecords.transportationRecordsErrorResp,
        }),
        shallowEqual
    );
    const studentDetailsRef = useRef<any>({
        prevGetStuHealthDetailsResp : getStuHealthDetailsResp,
        prevGetEmpHealthDetailsResp : getEmpHealthDetailsResp,
        prevGetAllocationDetailsResp : getAllocationDetailsResp,
        prevGetHealthRecordsListByIdResp : getHealthRecordsListByIdResp,
        prevTransportationRecordsErrorResp: transportationRecordsErrorResp,
    })

    useEffect(() => {
        const { prevGetStuHealthDetailsResp, prevGetEmpHealthDetailsResp, prevGetHealthRecordsListByIdResp, prevGetAllocationDetailsResp, prevTransportationRecordsErrorResp } = studentDetailsRef.current;

        if (getStuHealthDetailsResp && prevGetStuHealthDetailsResp !== getStuHealthDetailsResp) {
            if (Array.isArray(getStuHealthDetailsResp) && getStuHealthDetailsResp.length > 0) {
                const student = getStuHealthDetailsResp[0];
                const { classId, sectionId, className, sectionName, gender, motherContactNo, fatherContactNo, dob, } = student || {};

                addStudentHealthRecordForm.setValues((prev: any) => ({
                    ...prev, branchClassId: classId, className, sectionId, sectionName, age: calculateAge(dob), gender, motherMobileNo: motherContactNo, fatherMobileNo: fatherContactNo,
                }));
            }
        }
        else if (getEmpHealthDetailsResp && prevGetEmpHealthDetailsResp !== getEmpHealthDetailsResp) {
            if (Array.isArray(getEmpHealthDetailsResp) && getEmpHealthDetailsResp.length > 0) {
                const emp = getEmpHealthDetailsResp[0];
                const { departmentId, genderName, bloodGroupName, contactNo, workEmailId, departmentName, employeeName, employeeCode, age, dob, remarks } = emp || {};

                addStudentHealthRecordForm.setValues((prev: any) => ({
                    ...prev, age: calculateAge(dob), genderName, bloodGroupName, employeeMobileNo: contactNo, employeeEmail: workEmailId, departmentId, employeeDepartmentName: departmentName, employeeName, employeeCode
                }));
            }
        }
        else if (getHealthRecordsListByIdResp && prevGetHealthRecordsListByIdResp !== getHealthRecordsListByIdResp) {
            if (location?.state?.id) {
                const {
                    studentName, studentCode, studentId,
                    employeeName, employeeCode, employeeId, transportRoute, transportRouteId
                } = getHealthRecordsListByIdResp || {};
                setSearchStudentState({ studentDetailId: studentId, studentName, studentCode });
                setSearchEmployeeState({ employeeId, employeeName, employeeCode });
                addStudentHealthRecordForm.setValues((prev: any) => ({
                    ...prev,
                    transportId: transportRouteId,
                    transportRouteName: transportRoute,
                }));
            }
        }

        else if (getAllocationDetailsResp && prevGetAllocationDetailsResp !== getAllocationDetailsResp) {
            const { routeId, routeName } = getAllocationDetailsResp || {};
            addStudentHealthRecordForm.setValues((prev: any) => ({
                ...prev,
                transportId: routeId,
                transportRouteName: routeName,
            }));

        }
        else if (transportationRecordsErrorResp && prevTransportationRecordsErrorResp !== transportationRecordsErrorResp) {
            const { details } = transportationRecordsErrorResp || {};
            toast.error(details || "Something went wrong");
        }

        studentDetailsRef.current.prevGetStuHealthDetailsResp = getStuHealthDetailsResp;
        studentDetailsRef.current.prevGetEmpHealthDetailsResp = getEmpHealthDetailsResp;
        studentDetailsRef.current.prevGetHealthRecordsListByIdResp = getHealthRecordsListByIdResp;
        studentDetailsRef.current.prevGetAllocationDetailsResp = getAllocationDetailsResp;
        studentDetailsRef.current.prevTransportationRecordsErrorResp = transportationRecordsErrorResp;

    }, [getStuHealthDetailsResp, getEmpHealthDetailsResp, getHealthRecordsListByIdResp, getAllocationDetailsResp]);


    function onInputSearchChange(inputString: any) {
        const { academicYearId, } = addStudentHealthRecordForm.values;
        if (inputString && academicYearId) {
            const params = {
                branchId, academicYearId,
                searchString: inputString,
            };
            dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
        }
    }
    function onEmpInputSearchChange(inputString: any) {
        if (inputString) {
            const params = { branchId, searchString: inputString,};
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_emp_health_details", undefined,  params )));
          }
    }

    const selectedStudent = (student: any) => {
        setSearchStudentState(student);
        const { academicYearId, } = addStudentHealthRecordForm.values;

        if (!student) {
            addStudentHealthRecordForm.setValues((prevValue: any) => ({
                ...prevValue, studentDetailId: "",
                branchClassId : "" , className : "", sectionId : "",sectionName : "",age : "", gender : "",motherMobileNo : "",fatherMobileNo : "" , transportId : "" , transportRouteName  : "" ,
            }));
        } else {

            const payload = { branchId , searchString : student?.studentCode,academicYearId }
            dispatch(getStuHealthDetailsAct(generateActionPayload("get_stu_health_details", undefined, payload)));
            dispatch(
                getAllocationDetailsAct(
                    generateActionPayload("get_details_by_student_id", {
                        id: student?.studentId,
                        academicYearId,
                    })
                )
            );
            addStudentHealthRecordForm.setFieldValue('studentDetailId', student?.studentId);
        }
    }
    const selectedEmployee = (employee: any) => {
        setSearchEmployeeState(employee);

        if (!employee) {
            addStudentHealthRecordForm.setValues((prevValue: any) => ({
                ...prevValue, employeeId: "",
                branchClassId : "" , age : "", genderName : "",bloodGroupName : "",employeeMobileNo : "",employeeEmail : "" , departmentId : "" , employeeDepartmentName  : "" ,
            }));
        } else {

            const payload = { branchId , searchString : employee?.employeeCode,}
            dispatch(getEmpHealthDetailsAct(generateActionPayload("get_emp_health_details", undefined, payload)));

            addStudentHealthRecordForm.setFieldValue('employeeId', employee?.employeeId);
        }
    }

    const { data: StudentList } = studentsListResp || {};

    return (
        <>
            {addStudentHealthRecordForm.values.userType === "STUDENT" && (
                <>
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                        {/* Student AutoSearch */}
                        <div className="tw-col-span-12 lg:tw-col-span-8">
                            <AutoSearchInputUpdated
                                formgroupClassName="search-box tw-mb-3"
                                name="studentDetailId"
                                placeHolder="Search..."
                                onChange={(string: any) => {
                                    if (!string) addStudentHealthRecordForm.setFieldValue('studentId', "");
                                    onInputSearchChange(string);
                                }}
                                isDisabled={isDisabled || isEditDisabled}
                                onBlur={addStudentHealthRecordForm.handleBlur}
                                valueKey="studentId"
                                labelHeader="Student Code"
                                labelKey="studentCode"
                                subLabelHeader="Student Name"
                                subLabelKey="studentName"
                                labelText="Student"
                                labelClass='tw-font-bold tw-text-sm tw-mb-1'
                                options={StudentList}
                                selected={searchStudentState}
                                selectedOptionCallbck={selectedStudent}
                                invalid={
                                    addStudentHealthRecordForm.touched.studentDetailId &&
                                        addStudentHealthRecordForm.errors.studentDetailId
                                        ? true
                                        : false
                                }
                                error={
                                    addStudentHealthRecordForm.touched.studentDetailId &&
                                        addStudentHealthRecordForm.errors.studentDetailId
                                        ? addStudentHealthRecordForm.errors.studentDetailId
                                        : ""
                                }
                            >
                                <i className="ri-search-line search-icon"></i>
                            </AutoSearchInputUpdated>
                        </div>

                        {/* Class */}
                        <div className="tw-col-span-12 lg:tw-col-span-4">
                            <TextInput
                                name="className"
                                labelText="Class"
                                value={addStudentHealthRecordForm.values.className}
                                isDisabled={true}
                                onChange={undefined}
                            />
                        </div>

                        {/* Section */}
                        <div className="tw-col-span-12 lg:tw-col-span-4">
                            <TextInput
                                name="sectionName"
                                labelText="Section"
                                value={addStudentHealthRecordForm.values.sectionName}
                                isDisabled={true}
                                onChange={undefined}
                            />
                        </div>

                        {/* Age */}
                        <div className="tw-col-span-12 lg:tw-col-span-4">
                            <TextInput
                                name="age"
                                labelText="Age"
                                value={addStudentHealthRecordForm.values.age}
                                isDisabled={true}
                                onChange={undefined}
                            />
                        </div>

                        {/* Gender */}
                        <div className="tw-col-span-12 lg:tw-col-span-4">
                            <TextInput
                                name="gender"
                                labelText="Gender"
                                value={addStudentHealthRecordForm.values.gender}
                                isDisabled={true}
                                onChange={undefined}
                            />
                        </div>

                        {/* Mother Mobile */}
                        <div className="tw-col-span-12 lg:tw-col-span-4">
                            <TextInput
                                name="motherMobileNo"
                                labelText="Mother Mobile No"
                                value={addStudentHealthRecordForm.values.motherMobileNo}
                                isDisabled={true}
                                onChange={undefined}
                            />
                        </div>

                        {/* Father Mobile */}
                        <div className="tw-col-span-12 lg:tw-col-span-4">
                            <TextInput
                                name="fatherMobileNo"
                                labelText="Father Mobile No"
                                value={addStudentHealthRecordForm.values.fatherMobileNo}
                                isDisabled={true}
                                onChange={undefined}
                            />
                        </div>

                        {/* Transport Route */}
                        <div className="tw-col-span-12 lg:tw-col-span-4">
                            <TextInput
                                name="transportRouteName"
                                labelText="Transport Route"
                                value={addStudentHealthRecordForm.values.transportRouteName || "OWN TRANSPORT"}
                                isDisabled={true}
                                onChange={addStudentHealthRecordForm.handleChange}
                            />
                        </div>

                        {/* Height */}
                        <div className="tw-col-span-12 lg:tw-col-span-4">
                            <TextInputGroup
                                name="height"
                                value={addStudentHealthRecordForm.values.height}
                                onChange={addStudentHealthRecordForm.handleChange}
                                labelText="Height"
                                allowedInputRegex='^[0-9.]+$'
                                isDisabled={isDisabled}
                            >
                                Cms
                            </TextInputGroup>
                        </div>

                        {/* Weight */}
                        <div className="tw-col-span-12 lg:tw-col-span-4">
                            <TextInputGroup
                                name="weight"
                                value={addStudentHealthRecordForm.values.weight}
                                onChange={addStudentHealthRecordForm.handleChange}
                                labelText="Weight"
                                allowedInputRegex='^[0-9.]+$'
                                isDisabled={isDisabled}
                            >
                                Kgs
                            </TextInputGroup>
                        </div>

                        {/* Time */}
                        <div className="tw-col-span-12 lg:tw-col-span-4">
                            <TimeInput
                                name="time"
                                value={addStudentHealthRecordForm.values.time}
                                onChange={addStudentHealthRecordForm.handleChange}
                                labelText="Time"
                                isDisabled={isDisabled}
                            />
                        </div>

                    </div>
            </>
            )}
            {(addStudentHealthRecordForm.values.userType === "EMPLOYEE") && <>
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                    {/* Employee AutoSearch */}
                    <div className="tw-col-span-12 lg:tw-col-span-8">
                        <AutoSearchInputUpdated
                            formgroupClassName="tw-search-box tw-mb-3"
                            name="employeeId"
                            placeHolder="Search..."
                            onChange={(string: any) => {
                                if (!string) addStudentHealthRecordForm.setFieldValue('employeeId', "");
                                onEmpInputSearchChange(string);
                            }}
                            isDisabled={isDisabled || isEditDisabled}
                            onBlur={addStudentHealthRecordForm.handleBlur}
                            valueKey="employeeId"
                            labelHeader="Employee Code"
                            labelKey="employeeCode"
                            subLabelHeader="Employee Name"
                            subLabelKey="employeeName"
                            labelText="Employee"
                            labelClass="tw-font-bold tw-text-sm tw-mb-1 required"
                            options={(Array.isArray(getEmployeesByFilterResp) && getEmployeesByFilterResp) || []}
                            selected={searchEmployeeState}
                            selectedOptionCallbck={selectedEmployee}
                            invalid={
                                addStudentHealthRecordForm.touched.employeeId &&
                                    addStudentHealthRecordForm.errors.employeeId
                                    ? true
                                    : false
                            }
                            error={
                                addStudentHealthRecordForm.touched.employeeId &&
                                    addStudentHealthRecordForm.errors.employeeId
                                    ? addStudentHealthRecordForm.errors.employeeId
                                    : ""
                            }
                        >
                            <i className="ri-search-line tw-text-gray-400 tw-absolute tw-left-2 tw-top-1/2 -tw-translate-y-1/3" />
                        </AutoSearchInputUpdated>
                    </div>

                    {/* Gender */}
                    <div className="tw-col-span-12 sm:tw-col-span-4">
                        <TextInput
                            name="genderName"
                            labelText="Gender"
                            value={addStudentHealthRecordForm.values.genderName}
                            isDisabled={true}
                            onChange={undefined}
                        />
                    </div>

                    {/* Mobile No */}
                    <div className="tw-col-span-12 sm:tw-col-span-4">
                        <TextInput
                            name="employeeMobileNo"
                            labelText="Mobile No"
                            value={addStudentHealthRecordForm.values.employeeMobileNo}
                            isDisabled={true}
                            onChange={undefined}
                        />
                    </div>

                    {/* Email */}
                    <div className="tw-col-span-12 sm:tw-col-span-4">
                        <TextInput
                            name="employeeEmail"
                            labelText="Email"
                            value={addStudentHealthRecordForm.values.employeeEmail}
                            isDisabled={true}
                            onChange={undefined}
                        />
                    </div>

                    {/* Department */}
                    <div className="tw-col-span-12 sm:tw-col-span-4">
                        <TextInput
                            name="employeeDepartmentName"
                            labelText="Department"
                            value={addStudentHealthRecordForm.values.employeeDepartmentName}
                            isDisabled={true}
                            onChange={undefined}
                        />
                    </div>

                    {/* Blood Group */}
                    <div className="tw-col-span-12 sm:tw-col-span-4">
                        <TextInput
                            name="bloodGroupName"
                            labelText="Blood Group"
                            value={addStudentHealthRecordForm.values.bloodGroupName}
                            isDisabled={true}
                            onChange={undefined}
                        />
                    </div>

                </div>
            </>}
        </>
    )
}

export default StudentDetails