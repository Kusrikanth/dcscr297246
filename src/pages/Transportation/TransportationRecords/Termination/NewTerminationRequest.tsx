import { useFormik } from "formik";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AutoSearchInputUpdated,
  DateInput,
  SelectInput,
  TextInput,
} from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import {
  createNewRequestPayload,
  generateLedgerColumns,
  generateStudentDetailColumn,
  requestForData,
} from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { addTerminationRequestAct,getTermsForTerminationReqAct, requestNoTransportRequestAct } from "../../../../store/transportation/TransportationRecords/transportationrecordsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getStudentsListAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { toast } from "react-toastify";
import { useHistory, useLocation, useParams } from "react-router-dom";
import * as Yup from "yup";
import { getEmployeeByFilterAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { resetTermsForTerminationReqAct } from "../../../../store/transportation/TransportationRecords/transportationrecordsaction";
import Button from "../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required('Academic Year is required.'),
  transportRequestFor: Yup.string().required('Request For is required.'),
  studentId: Yup.string().nullable().when('transportRequestFor', (transportRequestFor, schema) => {
    if (transportRequestFor === "STUDENT") {
      return schema.required("Student is required")
    }
  }),
  employeeId: Yup.string().nullable().when('transportRequestFor', (transportRequestFor, schema) => {
    if (transportRequestFor === "EMPLOYEE") {
      return schema.required("Employee is required")
    }
  }),
  willEffectFromDate: Yup.string().required('Will Effect From Date is required.'),
})


function getTerminationRequestData() {
  return ({
    requestNo:  "",
    academicYearId:"",
    curriculumId:  "",
    classId:  "",
    studentId:  "",
    employeeId:  "",
    pinCode:  "",
    address:  "",
    willEffectFromDate: "",
    remarks: "",
    curriculumName:  "",
    className:  "",
    transportRequestId:null,
    alternativePhoneNo: "",
    isNoTermSelected:"",
    transportRequestFor: "STUDENT",
  })
}

const initialValues = getTerminationRequestData();
const NewTerminationRequest = () => {
  const [searchStudentState, setSearchStudentState] = useState<any>();
  const [searchEmployeeState, setSearchEmployeeState] = useState<any>();
  const [termsForTermiResp, setTermsForTermiResp] = useState<any>([]);
  const [isNoTermSelected, setIsNoTermSelected] = useState<any>(false);
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
  const [tableStudentState, setTableStudentState] = useState<any>([]);
  const history = useHistory();
  const location:any = useLocation()
  const dispatch = useAppDispatch(),
    {
      academicYearListResp,
      currentBranchIdResp: branchId,
      currentInstIdResp: instituteId,
      requestNoForTransportResp,
      studentsListResp,
      stopsByRouteIdResp,
      termsTransportBySlabIdResp,
      transportationRecordsErrorResp,
      transportRequestByIdResp,
      addTerminationReqResp,
      getEmployeesByFilterResp,
      getTermsForTerminationReqResp,
      showApiLoader,
    }: any = useAppSelector(
      ({ globalData, instAcademics, appData, transportrequest, transportrecords, directoryStudent, directoryEmployee,feeCollections }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        showApiLoader: globalData.showApiLoader,
        requestNoForTransportResp: transportrecords.requestNoForTransportResp,
        studentsListResp: directoryStudent.studentsListResp,
        getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
        stopsByRouteIdResp: transportrequest.stopsByRouteIdResp,
        termsTransportBySlabIdResp: transportrecords.termsTransportBySlabIdResp,
        transportRequestByIdResp: transportrecords.transportRequestByIdResp,
        transportationRecordsErrorResp: transportrecords.transportationRecordsErrorResp,
        getTermsForTerminationReqResp: transportrecords.getTermsForTerminationReqResp,
        addTerminationReqResp: transportrecords.addTerminationReqResp
      }),
      shallowEqual
    );

  const addNewRequestRespRef = useRef({
    prevAcademicYearListResp: undefined,
    preRequestNoForTransportResp: requestNoForTransportResp,
    prevAddTerminationReqResp: addTerminationReqResp,
    prevGetTermsForTerminationReqResp:getTermsForTerminationReqResp,
    prevTransportationRecordsErrorResp: transportationRecordsErrorResp
  })

  useEffect(() => {
    const { prevAcademicYearListResp, prevAddTerminationReqResp,prevGetTermsForTerminationReqResp,
      preRequestNoForTransportResp, prevTransportationRecordsErrorResp } = addNewRequestRespRef.current;

      if (requestNoForTransportResp && preRequestNoForTransportResp !== requestNoForTransportResp) {
        terminationReqForm.setFieldValue("requestNo", requestNoForTransportResp?.requestNo);
      } 

    if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
      if (Array.isArray(academicYearListResp?.data)) {
        const { academicYearId } = academicYearListResp.data?.find((year: any) =>  year.yearStatus === "CURRENT") || {};
        terminationReqForm.setFieldValue("academicYearId", academicYearId);

          dispatch(requestNoTransportRequestAct(generateActionPayload("get_receiptno_transport", undefined, {
            academicYearId,
            branchId,
            transportRequestType : "TERMINATION_REQUEST",
          })));

      }
    }  else if (addTerminationReqResp && prevAddTerminationReqResp !== addTerminationReqResp) {
      toast.success('Termination request added successfully.');
      history.push(`/transportation-records`);
    }  
    else if (transportationRecordsErrorResp && prevTransportationRecordsErrorResp !== transportationRecordsErrorResp) {
      const { details, message }: any = transportationRecordsErrorResp;
      toast.error(details || message || "Something went wrong.");
    }
    else if(getTermsForTerminationReqResp && prevGetTermsForTerminationReqResp !== getTermsForTerminationReqResp){
      if(Array.isArray(getTermsForTerminationReqResp) && getTermsForTerminationReqResp?.length > 0){
        setTermsForTermiResp(getTermsForTerminationReqResp?.map((i:any)=>({...i,isSelected : false})))
      }
      else if(getTermsForTerminationReqResp?.length === 0){
        setTermsForTermiResp([])
      }
    }
    addNewRequestRespRef.current.prevAcademicYearListResp = academicYearListResp;
    addNewRequestRespRef.current.preRequestNoForTransportResp = requestNoForTransportResp;
    addNewRequestRespRef.current.prevAddTerminationReqResp = addTerminationReqResp;
    addNewRequestRespRef.current.prevGetTermsForTerminationReqResp = getTermsForTerminationReqResp;
    addNewRequestRespRef.current.prevTransportationRecordsErrorResp = transportationRecordsErrorResp;
  }, [academicYearListResp,
    stopsByRouteIdResp,
    addTerminationReqResp,
    getTermsForTerminationReqResp,
    requestNoForTransportResp,
    termsTransportBySlabIdResp,
    transportRequestByIdResp,
    transportationRecordsErrorResp]);

    useEffect(() => {
      return ()=>{
      dispatch(resetTermsForTerminationReqAct(undefined))
      }
    }, [])

    useEffect(() => {
      if(location?.state?.studentData){
        const {academicYearId,curriculumId,classId,studentId,employeeId,pinCode,address,remarks,curriculumName,className,alternativePhoneNo,studentName,contactNo,studentCode,employeeName,employeeCode,alternatePhoneNo} = location?.state?.studentData || {}
        terminationReqForm.setValues((prev:any)=>({
          requestNo:  "",
          academicYearId,
          curriculumId,
          classId,
          studentId,
          employeeId,
          pinCode,
          address,
          willEffectFromDate: "",
          remarks,
          curriculumName,
          className,
          alternativePhoneNo : alternativePhoneNo || alternatePhoneNo,
          isNoTermSelected:"",
          transportRequestId:null,
          transportRequestFor: location?.state?.from === "employee" ? "EMPLOYEE" : "STUDENT",
        }))
        if(location?.state?.from === "student"){
          getTermsDetails(studentId, academicYearId);
          setSearchStudentState({
            studentId: studentId,
            studentName: studentName,
            studentCode:studentCode,
          })
        }else{
          setSearchEmployeeState({
            employeeId: employeeId,
            employeeName: employeeName,
            employeeCode:employeeCode,
          })
        }
        setTableStudentState([{
          studentId: studentId,
          studentName: studentName,
          employeeName: employeeName,
          mobileNumber: contactNo,
          alternatePhoneNo: alternativePhoneNo || alternatePhoneNo,
          pinCode,
          residentialAddress: address
        }]);
        
      }
    }, [location])
    
    
  const terminationReqForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (values.transportRequestFor === "STUDENT" && termsForTermiResp?.filter((i:any)=>i.isSelected===true)?.length < 1) {
        setIsNoTermSelected(true)
      }
       else {
        const payload:any = createNewRequestPayload(values, { branchId, approval: true },termsForTermiResp);
        if(location.state?.studentData?.requestId){
          payload.transportRequestId = location.state?.studentData?.requestId
        }

        dispatch(addTerminationRequestAct(generateActionPayload("add_termination_request", undefined, payload)));
      }
    }
  });

  function onInputSearchChange(inputString: any) {
    if (inputString) {
      const { academicYearId } = terminationReqForm.values;
      if (academicYearId) {
        const params = {
          branchId, academicYearId, pageNo: 0, pageSize: 20, searchString: inputString,
        };
        dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
      }
    }
  }

  function onEmployeeSearchChange(inputString: any) {
    if (inputString) {
      const params = { searchString: inputString };
      dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId })));
    }
  }

  const selectStudentHandler = (selectedStudent: any) => {
    setIsNoTermSelected(false)
    resetTermsForTerminationReqAct(undefined)
    getTermsDetails(selectedStudent?.studentId, selectedStudent?.academicYearId);
    setSearchStudentState(selectedStudent);
    terminationReqForm.setValues(prevValues => ({
      ...prevValues,
      studentId: selectedStudent?.studentId || "",
      curriculumId: selectedStudent?.curriculumId || "",
      curriculumName: selectedStudent?.curriculumName || "",
      classId: selectedStudent?.classId || "",
      className: selectedStudent?.className || "",
      pinCode: selectedStudent?.pincode || "",
      alternatePhoneNo: selectedStudent?.alternatePhoneNo || "",
      address: selectedStudent?.address || "",
    }));
    if (!selectedStudent) {
      setTableStudentState([]);
    } else {
      setTableStudentState([{
        studentId: selectedStudent.studentId,
        studentName: selectedStudent.studentName,
        mobileNumber: selectedStudent.phoneNumber,
        alternatePhoneNo: selectedStudent.alternatePhoneNo,
        pinCode: selectedStudent.pincode,
        residentialAddress: selectedStudent.address
      }]);
    }
  }

  const selectEmployeeHandler = (selectedEmployee: any) => {
    setIsNoTermSelected(false)
    setSearchEmployeeState(selectedEmployee);
    terminationReqForm.setValues(prevValues => ({
      ...prevValues,
      employeeId: selectedEmployee?.id || "",
      pinCode: selectedEmployee?.pincode || "",
      address: selectedEmployee?.address || ""
    }));
    if (!selectedEmployee) {
      setTableStudentState([]);
    } else {
      setTableStudentState([{
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.employeeName,
        mobileNumber: selectedEmployee.workPhoneNo,
        pinCode: selectedEmployee.pincode,
        residentialAddress: selectedEmployee.address
      }]);
    }
  }

  const onChangeInputHndlr = (event: any) => {
    if (tableStudentState?.length > 0) {
      const { name, value } = event.target

      terminationReqForm.setFieldValue(name, value)
      const newTableValues = {
        studentId: tableStudentState[0].studentId,
        employeeId: tableStudentState[0].employeeId,
        studentName: tableStudentState[0].studentName,
        employeeName: tableStudentState[0].employeeName,
        mobileNumber: tableStudentState[0].mobileNumber,
        pinCode: name === "pinCode" ? value : tableStudentState[0].pinCode,
        residentialAddress: name === "residentialAddress" ? value : tableStudentState[0].residentialAddress
      }
      setTableStudentState([newTableValues])
    }
  }

  const submitBtnHndler = (event: any, name: string) => {
    terminationReqForm.handleSubmit(event)
  }


const getTermsDetails = (studentId: any, academicYearId?: any,endDate ?:any) => {
    let payload = {
        studentId: studentId || terminationReqForm.values.studentId,
        branchId: branchId,
        academicYearId:academicYearId || terminationReqForm.values.academicYearId ,
        endDate :endDate || terminationReqForm.values.willEffectFromDate || null, 
    }
    dispatch(getTermsForTerminationReqAct(generateActionPayload('get_terms_for_termination_req', undefined, payload)));
}

  const changeHndler = (event: any) => {
    const { name, value } = event.target;
    setIsNoTermSelected(false)
    if (name === "transportRequestFor") {

      setSearchStudentState(null)
      setSearchEmployeeState(null)
      setTableStudentState([])
      terminationReqForm.setValues((prev: any) => ({
        ...prev, [name]: value,
        curriculumId: "",
        curriculumName: "",
        classId: "",
        className: "",
      }))
    } else if (name === "willEffectFromDate") {
      terminationReqForm.handleChange(event)
      if (terminationReqForm.values?.studentId && terminationReqForm.values.transportRequestFor === "STUDENT") {
        getTermsDetails(terminationReqForm.values?.studentId,terminationReqForm.values.academicYearId,value )
      }
    }
  }

  
  const allStudentCheckHndlr = useCallback((event: any) => {
    setIsNoTermSelected(false)
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    let updateStudentState = [...termsForTermiResp];
    updateStudentState.forEach((item: any) => {
      if(!(item?.paymentStatus?.toLowerCase() === "paid")){
        item.isSelected = checked;
      }
    });
    setTermsForTermiResp(updateStudentState);
}, [termsForTermiResp]);

const singleStudentCheckHndlr = useCallback((event: any) => {
  setIsNoTermSelected(false)
    const { checked } = event.currentTarget,
        registrationNumber = event.currentTarget.getAttribute("data-id"),
        studentRowIndex = termsForTermiResp.findIndex((item: any) => +item.studentLedgerId === Number(registrationNumber));
    if (studentRowIndex > -1) {
        const studentDetails: any = termsForTermiResp[studentRowIndex];
        let updateStudentState: any = [...termsForTermiResp];
        updateStudentState.splice(studentRowIndex, 1, {
            ...studentDetails, isSelected: checked,
        });
        setTermsForTermiResp(updateStudentState);
        const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
        setAllStudentSelectedState(isAllSelected);
    }
}, [termsForTermiResp]);

  const LedgerColumns = useMemo(() => generateLedgerColumns(allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState), [termsForTermiResp]);

  const studentColumns = useMemo(() => generateStudentDetailColumn(), [tableStudentState]);
  return (
    <>
      <div className="page-content transportation_change_request_wrap">
        <div className="container-fluid">
          <BreadCrumb title="Transportation Records" pageTitle="Transportation Records" />
          <form onSubmit={terminationReqForm.handleSubmit}>
            <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
              <div className="tw-border-b tw-px-4 tw-py-3 tw-font-bold tw-text-lg">
                Termination Request
              </div>

              <div className="tw-px-4 tw-py-4">
                <div className="tw-flex tw-flex-row tw-gap-6">
                  <div className="tw-w-4/12">
                    <TextInput
                      name="type"
                      labelText="Request No."
                      value={terminationReqForm.values.requestNo}
                      onChange={null}
                      isDisabled={true}
                    />

                    <SelectInput
                      name="transportRequestFor"
                      // labelText="Academic Year"
                      value={terminationReqForm.values.transportRequestFor}
                      onChange={changeHndler}
                      menuItems={requestForData}
                      // isDisabled={true}
                      onBlur={terminationReqForm.handleBlur}
                      valueKey="id"
                      isDisabled={location?.state?.studentData && true}
                      textKey="name"
                      defaultSelect="Select"
                      labelText="Request For"
                      formgroupClassName="mb-2"
                      invalid={(terminationReqForm.touched.transportRequestFor && terminationReqForm.errors.transportRequestFor) ? true : false}
                      error={(terminationReqForm.touched.transportRequestFor && terminationReqForm.errors.transportRequestFor) ? terminationReqForm.errors.transportRequestFor : ""}
                    />
                  </div>

                  <div className="tw-w-4/12 tw-ml-auto">
                    <SelectInput
                      name="academicYearId"
                      value={terminationReqForm.values.academicYearId}
                      onChange={terminationReqForm.handleChange}
                      menuItems={academicYearListResp?.data}
                      onBlur={terminationReqForm.handleBlur}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      defaultSelect="Academic Year"
                      formgroupClassName="tw-mb-2"
                      isDisabled={location?.state?.studentData && true}
                      invalid={(terminationReqForm.touched.academicYearId && terminationReqForm.errors.academicYearId) ? true : false}
                      error={(terminationReqForm.touched.academicYearId && terminationReqForm.errors.academicYearId) ? terminationReqForm.errors.academicYearId : ""}
                    />

                    {terminationReqForm.values.transportRequestFor === "STUDENT" ? (
                      <AutoSearchInputUpdated
                        formgroupClassName="search-box"
                        name="studentId"
                        onChange={onInputSearchChange}
                        onBlur={terminationReqForm.handleBlur}
                        valueKey="studentId"
                        alignRight={true}
                        isDisabled={location?.state?.studentData && true}
                        labelHeader="Student. Code"
                        labelKey="studentCode"
                        subLabelHeader="Student Name"
                        subLabelKey="studentName"
                        placeHolder="Search student"
                        options={studentsListResp?.data || []}
                        selected={searchStudentState}
                        selectedOptionCallbck={selectStudentHandler}
                        invalid={(terminationReqForm.touched.studentId && terminationReqForm.errors.studentId) ? true : false}
                        error={(terminationReqForm.touched.studentId && terminationReqForm.errors.studentId) ? terminationReqForm.errors.studentId : ""}
                      >
                        <i className="ri-search-line search-icon"></i>
                      </AutoSearchInputUpdated>
                    ) : (
                      <AutoSearchInputUpdated
                        formgroupClassName="search-box"
                        name="employeeId"
                        onChange={onEmployeeSearchChange}
                        onBlur={terminationReqForm.handleBlur}
                        valueKey="employeeId"
                        alignRight={true}
                        isDisabled={location?.state?.studentData && true}
                        labelHeader="Employee. Code"
                        labelKey="employeeCode"
                        subLabelHeader="Employee Name"
                        subLabelKey="employeeName"
                        placeHolder="Search Employee"
                        options={getEmployeesByFilterResp || []}
                        selected={searchEmployeeState}
                        selectedOptionCallbck={selectEmployeeHandler}
                        invalid={(terminationReqForm.touched.employeeId && terminationReqForm.errors.employeeId) ? true : false}
                        error={(terminationReqForm.touched.employeeId && terminationReqForm.errors.employeeId) ? terminationReqForm.errors.employeeId : ""}
                      >
                        <i className="ri-search-line search-icon"></i>
                      </AutoSearchInputUpdated>
                    )}

                    {terminationReqForm.values.transportRequestFor !== "EMPLOYEE" && (
                      <>
                        <TextInput
                          name="curriculumId"
                          value={terminationReqForm.values.curriculumName}
                          onChange={undefined}
                          formgroupClassName="tw-my-2"
                          isDisabled={true}
                          placeHolder="Curriculum"
                        />
                        <TextInput
                          name="classId"
                          value={terminationReqForm.values.className}
                          onChange={undefined}
                          formgroupClassName="tw-mb-2"
                          isDisabled={true}
                          placeHolder="Class"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="tw-my-3">
                  <TableContainer
                    columns={studentColumns}
                    data={tableStudentState}
                    divClass="tw-overflow-x-auto"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    onChangeInputHndlr={onChangeInputHndlr}
                  />
                </div>

                <div className="tw-py-3">
                  <div className="tw-mb-4">
                    <div className="tw-flex tw-items-center tw-gap-4 tw-w-8/12">
                      <label className="tw-w-2/12 tw-mb-0">
                        Will Effect Date :
                      </label>
                      <DateInput
                        name="willEffectFromDate"
                        value={terminationReqForm.values.willEffectFromDate}
                        onChange={changeHndler}
                        onBlur={terminationReqForm.handleBlur}
                        formgroupClassName="tw-w-3/12 tw-mb-0"
                        invalid={(terminationReqForm.touched.willEffectFromDate && terminationReqForm.errors.willEffectFromDate) ? true : false}
                        error={(terminationReqForm.touched.willEffectFromDate && terminationReqForm.errors.willEffectFromDate) ? terminationReqForm.errors.willEffectFromDate : ""}
                      />
                    </div>
                  </div>

                  {terminationReqForm.values.transportRequestFor === "STUDENT" && (
                    <div>
                      <TableContainer
                        columns={LedgerColumns || []}
                        data={termsForTermiResp || []}
                        divClass="tw-overflow-x-auto tw-my-3"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                      />
                      <span className="tw-text-red-600 tw-pl-4">
                        {isNoTermSelected ? "Select At least One Term" : ""}
                      </span>
                    </div>
                  )}

                  <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-6">
                    <Button
                      type="button"
                      variant="secondary"
                      className="tw-bg-gray-100 tw-text-gray-700 tw-px-4 tw-py-2 tw-rounded"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      disabled={showApiLoader}
                      onClick={(event: any) =>
                        submitBtnHndler(event, "submitAndApprove")
                      }
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

    </>
  );
};

export default NewTerminationRequest;
