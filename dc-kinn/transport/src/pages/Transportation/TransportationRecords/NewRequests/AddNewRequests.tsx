import { useFormik } from "formik";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AutoSearchInputUpdated,
  CustomSelect,
  DateInput,
  NewPhoneInput,
  SelectInput,
  TextArea,
  TextInput,
} from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import {
  createNewRequestPayload,
  generateApplicableTermsTableColumns,
  generateStudentDetailColumn,
  renderOptionsRoute,
  renderValueRoute,
  requestForData,
} from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { approveTransportRequestAct, getTermsTransportBySlabIdAct, getTransportRequestByIdAct, requestNoTransportRequestAct } from "../../../../store/transportation/TransportationRecords/transportationrecordsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getStudentsListAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { getDistanceFormStopAct, getRouteListAct, getSlabsListAct, getStopsByRouteidAct } from "../../../../store/transportation/transportationaction";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";
import { getYyyyMmDdFormat } from "../../../../utility/dateutility";
import * as Yup from "yup";
import { getEmployeeByFilterAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
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
  // alternativePhoneNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.'),
  landmark: Yup.string().required('Landmark is required.'),
  // officeAddress: Yup.string().required('Office Address is required.'),
  routeId: Yup.string().required('Route is required.'),
  stopId: Yup.string().required('Stop is required.'),
  slabId: Yup.string().required('Slab is required.'),
  willEffectFromDate: Yup.string().required('Will Effect From Date is required.'),
})


function getTransportRequestData(editData?: any) {
  const slabDistance = editData?.distanceKmsFromBranch || "";
  const { transportChangeRequestTermsDTOList } = editData || {};
  let termIds: any = [];
  if (Array.isArray(transportChangeRequestTermsDTOList)) {
    termIds = transportChangeRequestTermsDTOList.map(item => item.termId?.toString());
  }
  return ({
    requestNo: editData?.requestNumber || "",
    academicYearId: editData?.academicYearId || "",
    curriculumId: editData?.curriculumId || "",
    classId: editData?.classId || "",
    studentId: editData?.studentId || "",
    employeeId: editData?.employeeId || "",
    pinCode: editData?.pinCode || "",
    address: editData?.address || "",
    landmark: editData?.landmark || "",
    officeAddress: editData?.officeAddress || "",
    routeId: editData?.routeId || "",
    stopId: editData?.stopId || "",
    slabId: editData?.slabId || "",
    willEffectFromDate: editData?.willEffectFromDate ? getYyyyMmDdFormat(editData?.willEffectFromDate) : "",
    remarks: editData?.willEffectFromDate || "",
    termIds: termIds,
    approval: editData?.approval || false,
    isNoTermSelected: '',
    curriculumName: editData?.curriculumName || "",
    className: editData?.className || "",
    slabDistance,
    pickUpTime: editData?.pickUpTime || "",
    dropTime: editData?.dropTime || "",
    capacity: "",
    alternativePhoneNo: editData?.alternativePhoneNo || "",
    transportRequestFor: editData?.transportRequestFor || "STUDENT",
    transportRequestType: "NEW_REQUEST",
  })
}

const initialValues = getTransportRequestData();
const AddNewChangeRequest = () => {
  const [searchStudentState, setSearchStudentState] = useState<any>();
  const [searchEmployeeState, setSearchEmployeeState] = useState<any>();
  const [submitBtn, setSubmitBtn] = useState<any>(false);
  const [tableStudentState, setTableStudentState] = useState<any>([]);
  const { transportRequestId }: any = useParams();
  const [availableTermsState, setAvailableTermState] = useState<any>([]);
  const initialSelectTermsRef = useRef();
  const history = useHistory();
  const dispatch = useAppDispatch(),
    {
      academicYearListResp,
      currentBranchIdResp: branchId,
      currentInstIdResp: instituteId,
      requestNoForTransportResp,
      studentsListResp,
      routeRequestListResp,
      stopsByRouteIdResp,
      termsTransportBySlabIdResp,
      approveTransportResp,
      transportationRecordsErrorResp,
      transportRequestByIdResp,
      getEmployeesByFilterResp,
      getSlabsListResp,
      distanceFromStopResp,
      showApiLoader,
    }: any = useAppSelector(
      ({ globalData, instAcademics, appData, transportrequest, transportrecords, directoryStudent, directoryEmployee }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        showApiLoader: globalData.showApiLoader,
        requestNoForTransportResp: transportrecords.requestNoForTransportResp,
        studentsListResp: directoryStudent.studentsListResp,
        getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
        routeRequestListResp: transportrequest.routeRequestListResp,
        stopsByRouteIdResp: transportrequest.stopsByRouteIdResp,
        termsTransportBySlabIdResp: transportrecords.termsTransportBySlabIdResp,
        approveTransportResp: transportrecords.approveTransportResp,
        transportRequestByIdResp: transportrecords.transportRequestByIdResp,
        getSlabsListResp: transportrequest.getSlabsListResp,
        distanceFromStopResp: transportrequest.distanceFromStopResp,
        transportationRecordsErrorResp: transportrecords.transportationRecordsErrorResp,
      }),
      shallowEqual
    );

  const addNewRequestRespRef = useRef({
    prevAcademicYearListResp: undefined,
    prevStopsByRouteIdResp: stopsByRouteIdResp,
    preRequestNoForTransportResp: requestNoForTransportResp,
    prevApproveTransportResp: approveTransportResp,
    prevTermsTransportBySlabIdResp: termsTransportBySlabIdResp,
    prevTransportRequestByIdResp: transportRequestByIdResp,
    prevTransportationRecordsErrorResp: transportationRecordsErrorResp
  })

  useEffect(() => {
    const { prevAcademicYearListResp, prevStopsByRouteIdResp, prevApproveTransportResp,
      preRequestNoForTransportResp, prevTransportRequestByIdResp,
      prevTermsTransportBySlabIdResp, prevTransportationRecordsErrorResp } = addNewRequestRespRef.current;

    if (requestNoForTransportResp && preRequestNoForTransportResp !== requestNoForTransportResp) {
      addNewRequestForm.setFieldValue("requestNo", requestNoForTransportResp?.requestNo);
    }

    if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
      if (Array.isArray(academicYearListResp?.data)) {
        const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
        addNewRequestForm.setFieldValue("academicYearId", academicYearId);
        if (!transportRequestId) {
          dispatch(requestNoTransportRequestAct(generateActionPayload("get_receiptno_transport", undefined, {
            academicYearId,
            branchId,
            transportRequestType: "NEW_REQUEST",
          })));
        }
      }
    } else if (stopsByRouteIdResp && prevStopsByRouteIdResp !== stopsByRouteIdResp) {
      if (Array.isArray(stopsByRouteIdResp) && !stopsByRouteIdResp.length) {
        toast.error('No stops available for the selected route.');
      }
    } else if (termsTransportBySlabIdResp && prevTermsTransportBySlabIdResp !== termsTransportBySlabIdResp) {
      if (Array.isArray(termsTransportBySlabIdResp) && !termsTransportBySlabIdResp.length) {
        if (termsTransportBySlabIdResp?.length === 0) {
          setAvailableTermState([])
        }
        toast.error('No terms are available for the selected stop.');
      } else if (Array.isArray(termsTransportBySlabIdResp)) {
        const { termIds }: any = addNewRequestForm.values;
        if (termIds.length > 0) {
          initialSelectTermsRef.current = termsTransportBySlabIdResp.reduce((obj: any, item: any, index: number) => {
            if (termIds.includes(item?.termId?.toString())) {
              obj[index] = true;
            }
            return obj;
          }, {});
        }
        setAvailableTermState(termsTransportBySlabIdResp);
      }

    } else if (approveTransportResp && prevApproveTransportResp !== approveTransportResp) {
      toast.success('Transportation request updated successfully.');
      history.push(`/transportation-records`);
    } else if (transportRequestByIdResp && transportRequestByIdResp !== prevTransportRequestByIdResp) {
      const formData = getTransportRequestData(transportRequestByIdResp);
      if (transportRequestByIdResp?.routeId) {
        dispatch(getStopsByRouteidAct(generateActionPayload("get_stop_byrouteid", {
          routeId: transportRequestByIdResp?.routeId, branchId
        })))
      }
      // if (transportRequestByIdResp?.stopId) {
      //   dispatch(getDistanceFormStopAct(generateActionPayload("get_distance_fromstop", {
      //     stopId: transportRequestByIdResp?.stopId
      //   })))
      // }
      if (!transportRequestByIdResp?.requestNumber) {
        dispatch(requestNoTransportRequestAct(generateActionPayload("get_receiptno_transport", undefined, {
          academicYearId: transportRequestByIdResp?.academicYearId,
          branchId,
          transportRequestType: "NEW_REQUEST",
        })));
      }
      if (transportRequestByIdResp?.slabId) {
        dispatch(getTermsTransportBySlabIdAct(generateActionPayload("get_terms_byslabid", undefined, {
          branchId,
          slabId: transportRequestByIdResp?.slabId,
          academicYearId: 10
        })))
      }
      setTableStudentState([{
        studentId: transportRequestByIdResp.studentId,
        studentName: transportRequestByIdResp.studentName,
        mobileNumber: transportRequestByIdResp.contactNo,
        pinCode: transportRequestByIdResp.pincode,
        residentialAddress: transportRequestByIdResp.address
      }]);
      setSearchStudentState({
        studentId: transportRequestByIdResp?.studentId,
        studentName: transportRequestByIdResp?.studentName,
        studentCode: transportRequestByIdResp?.studentCode
      });
      addNewRequestForm.resetForm({
        values: formData
      });
    } else if (transportationRecordsErrorResp && prevTransportationRecordsErrorResp !== transportationRecordsErrorResp) {
      const { details, message }: any = transportationRecordsErrorResp;
      toast.error(details || message || "Something went wrong.");
    }
    addNewRequestRespRef.current.prevAcademicYearListResp = academicYearListResp;
    addNewRequestRespRef.current.prevStopsByRouteIdResp = stopsByRouteIdResp;
    addNewRequestRespRef.current.preRequestNoForTransportResp = requestNoForTransportResp;
    addNewRequestRespRef.current.prevTermsTransportBySlabIdResp = termsTransportBySlabIdResp;
    addNewRequestRespRef.current.prevApproveTransportResp = approveTransportResp;
    addNewRequestRespRef.current.prevTransportationRecordsErrorResp = transportationRecordsErrorResp;
    addNewRequestRespRef.current.prevTransportRequestByIdResp = transportRequestByIdResp;
  }, [academicYearListResp,
    stopsByRouteIdResp,
    approveTransportResp,
    requestNoForTransportResp,
    termsTransportBySlabIdResp,
    transportRequestByIdResp,
    transportationRecordsErrorResp]);

  useEffect(() => {
    if (branchId && instituteId) {
      dispatch(getRouteListAct(generateActionPayload("get_route_details_list", undefined, {
        branchId,
        instituteId, pageNo: 0, pageSize: 1000,
        sortBy: "routeName", orderBy: "ASC",
      })))
      dispatch(getSlabsListAct(generateActionPayload("get_slabs_list", undefined, { slabName: "", branchId, instituteId })));
    }
  }, [branchId, instituteId]);


  const addNewRequestForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (values.transportRequestFor === "STUDENT" && values?.termIds?.length < 1) {
        addNewRequestForm.setFieldError('isNoTermSelected', "*Select At least One Term")
      } else {
        const payload = createNewRequestPayload(values, { branchId, transportRequestId, approval: true });
        dispatch(approveTransportRequestAct(generateActionPayload("approve_transport_request", undefined, payload)));
      }
    }
  });


  function onInputSearchChange(inputString: any) {
    if (inputString) {
      const { academicYearId } = addNewRequestForm.values;
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
    setSearchStudentState(selectedStudent);
    addNewRequestForm.setValues(prevValues => ({
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
    setSearchEmployeeState(selectedEmployee);
    addNewRequestForm.setValues(prevValues => ({
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

  useEffect(() => {
    if (transportRequestId) {
      dispatch(getTransportRequestByIdAct(generateActionPayload("get_transport_requestbyid", {
        requestId: transportRequestId
      })))
    }

  }, [transportRequestId]);


  function selectRouteHndlr(selectedOptions: any, config?: any) {
    const { name } = config;
    const data = routeRequestListResp?.data?.find((item: any) => +item.id === +selectedOptions);
    addNewRequestForm.setValues(prevValues => ({
      ...prevValues,
      routeId: selectedOptions,
      stopId: "",
      slabId: "",
      pickUpTime: "",
      slabDistance: "",
      dropTime: "",
      capacity: `${data?.capacityOccupied || 0} / ${data?.vehicleCapacity || 0}`,
      termIds: []
    }));
    dispatch(getStopsByRouteidAct(generateActionPayload("get_stop_byrouteid", { routeId: selectedOptions, branchId })))
  }

  function onChangeStopHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    if (value) {
      const stopInfo = stopsByRouteIdResp?.find((item: any) => item.id?.toString() === value);
      // if (stopInfo?.slabId && addNewRequestForm.values.transportRequestFor === "STUDENT") {
      //   dispatch(getTermsTransportBySlabIdAct(generateActionPayload("get_terms_byslabid", undefined, {
      //     branchId,
      //     slabId: stopInfo?.slabId,
      //     willEffectDate: addNewRequestForm.values.willEffectFromDate || "",
      //     academicYearId: addNewRequestForm.values.academicYearId,
      //   })))
      // }
      // dispatch(getDistanceFormStopAct(generateActionPayload("get_distance_fromstop", {
      //   stopId: transportRequestByIdResp?.stopId || value
      // })))
      addNewRequestForm.setValues(prevValues => ({
        ...prevValues,
        stopId: value,
        pickUpTime: stopInfo?.pickupTime,
        latitude: stopInfo?.latitude,
        longitude: stopInfo?.longitude,
        slabDistance: stopInfo?.distanceKmsFromBranch,
        dropTime: stopInfo?.dropTime,
        termIds: []
      }));
    } else {
      addNewRequestForm.setValues(prevValues => ({
        ...prevValues,
        stopId: value,
        pickUpTime: "",
        longitude: "",
        latitude: "",
        slabDistance: "",
        dropTime: "",
        termIds: []
      }));
    }
  }

  const onChangeInputHndlr = (event: any) => {
    if (tableStudentState?.length > 0) {
      const { name, value } = event.target

      addNewRequestForm.setFieldValue(name, value)
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


  const selectedRowHandler = useCallback((row: any) => {
    if (Array.isArray(row)) {
      const termIds = row.map(item => item?.termId);
      addNewRequestForm.setFieldValue("termIds", termIds);
    }
  }, [termsTransportBySlabIdResp]);

  const submitBtnHndler = (event: any, name: string) => {
    if (name === "submit") {
      setSubmitBtn(false)
    } else {
      setSubmitBtn(true)
    }
    addNewRequestForm.handleSubmit(event)
  }

  const changeHndler = (event: any) => {
    const { name, value } = event.target;

    if (name === "transportRequestFor") {

      setSearchStudentState(null)
      setSearchEmployeeState(null)
      setTableStudentState([])
      setAvailableTermState([])
      addNewRequestForm.setValues((prev: any) => ({
        ...prev, [name]: value,
        curriculumId: "",
        curriculumName: "",
        classId: "",
        className: "",
        routeId: "",
        capacity: "",
        stopId: "",
        pickUpTime: "",
        dropTime: "",
        slabDistance: "",
      }))
    } else if (name === "willEffectFromDate") {
      addNewRequestForm.handleChange(event)
      if (addNewRequestForm.values?.slabId && addNewRequestForm.values.transportRequestFor === "STUDENT") {
        dispatch(getTermsTransportBySlabIdAct(generateActionPayload("get_terms_byslabid", undefined, {
          branchId,
          slabId: addNewRequestForm.values?.slabId,
          willEffectDate: value,
          academicYearId: addNewRequestForm.values.academicYearId,
        })))
      }
    }
  }

  const ContactNoChangeHandler = (contactNo: any) => {
    const alternativePhoneNo = contactNo.substring(2)
    addNewRequestForm.setFieldValue('alternativePhoneNo', alternativePhoneNo);
  }

  const onSlabChangeHndler = (event: any) => {
    const { name, value } = event.target;
    addNewRequestForm.setFieldValue('slabId', value);
    if (value && addNewRequestForm.values.transportRequestFor === "STUDENT") {
      dispatch(getTermsTransportBySlabIdAct(generateActionPayload("get_terms_byslabid", undefined, {
        branchId,
        slabId: value,
        willEffectDate: addNewRequestForm.values.willEffectFromDate || "",
        academicYearId: addNewRequestForm.values.academicYearId,
      })))
    }
  }

  const studentColumns = useMemo(() => generateStudentDetailColumn(), [tableStudentState]);
  const roleApplicableTermsTableColumns = useMemo(() => generateApplicableTermsTableColumns(), [termsTransportBySlabIdResp]);
  return (
    <>
      <div className="page-content transportation_change_request_wrap">
        <div className="container-fluid">
          <BreadCrumb title="Transportation Records" pageTitle="Transportation Records" />
          <form onSubmit={addNewRequestForm.handleSubmit}>
            <div className="tw-bg-white tw-shadow tw-rounded tw-mb-6">
              <div className="tw-font-bold tw-text-lg tw-px-4 tw-py-2 tw-border-b">New Request</div>
              <div className="card-body px-4">

                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                  <div className="tw-col-span-4">
                    <TextInput
                      name="type"
                      labelText="Request No."
                      value={addNewRequestForm.values.requestNo}
                      onChange={null}
                      isDisabled={true}
                    />
                    <SelectInput
                      name="transportRequestFor"
                      value={addNewRequestForm.values.transportRequestFor}
                      onChange={changeHndler}
                      menuItems={requestForData}
                      onBlur={addNewRequestForm.handleBlur}
                      valueKey="id"
                      textKey="name"
                      defaultSelect="Select"
                      labelText="Request For"
                      formgroupClassName="mb-2"
                      invalid={(addNewRequestForm.touched.transportRequestFor && addNewRequestForm.errors.transportRequestFor) ? true : false}
                      error={(addNewRequestForm.touched.transportRequestFor && addNewRequestForm.errors.transportRequestFor) ? addNewRequestForm.errors.transportRequestFor : ""}
                    // inputClassName="border-0"
                    />
                  </div>

                  <div className="tw-col-span-4 tw-col-start-9">
                    <SelectInput
                      name="academicYearId"
                      value={addNewRequestForm.values.academicYearId}
                      onChange={addNewRequestForm.handleChange}
                      menuItems={academicYearListResp?.data}
                      onBlur={addNewRequestForm.handleBlur}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      defaultSelect="Academic Year"
                      formgroupClassName="mb-2"
                      invalid={(addNewRequestForm.touched.academicYearId && addNewRequestForm.errors.academicYearId) ? true : false}
                      error={(addNewRequestForm.touched.academicYearId && addNewRequestForm.errors.academicYearId) ? addNewRequestForm.errors.academicYearId : ""}
                    // inputClassName="border-0"
                    />

                    {addNewRequestForm.values.transportRequestFor === "STUDENT" ? (
                      <AutoSearchInputUpdated
                        formgroupClassName="search-box"
                        name="studentId"
                        onChange={onInputSearchChange}
                        onBlur={addNewRequestForm.handleBlur}
                        valueKey="studentId"
                        alignRight={true}
                        labelHeader="Student. Code"
                        labelKey="studentCode"
                        subLabelHeader="Student Name"
                        subLabelKey="studentName"
                        placeHolder="Search student"
                        options={studentsListResp?.data || []}
                        selected={searchStudentState}
                        selectedOptionCallbck={selectStudentHandler}
                        invalid={(addNewRequestForm.touched.studentId && addNewRequestForm.errors.studentId) ? true : false}
                        error={(addNewRequestForm.touched.studentId && addNewRequestForm.errors.studentId) ? addNewRequestForm.errors.studentId : ""}
                      >
                        <i className="ri-search-line search-icon"></i>
                      </AutoSearchInputUpdated>
                    ) : (
                      <AutoSearchInputUpdated
                        formgroupClassName="search-box"
                        name="employeeId"
                        onChange={onEmployeeSearchChange}
                        onBlur={addNewRequestForm.handleBlur}
                        valueKey="employeeId"
                        alignRight={true}
                        labelHeader="Employee. Code"
                        labelKey="employeeCode"
                        subLabelHeader="Employee Name"
                        subLabelKey="employeeName"
                        placeHolder="Search Employee"
                        options={getEmployeesByFilterResp || []}
                        selected={searchEmployeeState}
                        selectedOptionCallbck={selectEmployeeHandler}
                        invalid={(addNewRequestForm.touched.employeeId && addNewRequestForm.errors.employeeId) ? true : false}
                        error={(addNewRequestForm.touched.employeeId && addNewRequestForm.errors.employeeId) ? addNewRequestForm.errors.employeeId : ""}
                      >
                        <i className="ri-search-line search-icon"></i>
                      </AutoSearchInputUpdated>
                    )}

                    {addNewRequestForm.values.transportRequestFor !== "EMPLOYEE" && (
                      <>
                        <TextInput
                          name="curriculumId"
                          value={addNewRequestForm.values.curriculumName}
                          onChange={undefined}
                          formgroupClassName="tw-my-2"
                          isDisabled={true}
                          placeHolder="Curriculum"
                        />

                        <TextInput
                          name="classId"
                          value={addNewRequestForm.values.className}
                          onChange={undefined}
                          formgroupClassName="tw-mb-2"
                          isDisabled={true}
                          placeHolder="Class"
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="tw-w-full">
                  <TableContainer
                    columns={studentColumns}
                    data={tableStudentState}
                    divClass="tw-overflow-x-auto tw-my-3"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    onChangeInputHndlr={onChangeInputHndlr}
                  // showCheckbox={true}
                  />
                </div>
                <div className="py-3">
                  <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">
                    <div className="tw-col-span-7 tw-pr-3">
                      <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">
                        <div className="tw-flex tw-justify-between tw-items-center tw-col-span-12 md:tw-col-span-8">
                          <label className="tw-col-span-5 tw-mb-0">Will Effect Date</label>
                          <DateInput
                            name="willEffectFromDate"
                            value={addNewRequestForm.values.willEffectFromDate}
                            onChange={changeHndler}
                            onBlur={addNewRequestForm.handleBlur}
                            formgroupClassName="tw-col-span-7 tw-mb-0"
                            invalid={(addNewRequestForm.touched.willEffectFromDate && addNewRequestForm.errors.willEffectFromDate) ? true : false}
                            error={(addNewRequestForm.touched.willEffectFromDate && addNewRequestForm.errors.willEffectFromDate) ? addNewRequestForm.errors.willEffectFromDate : ""}
                          />
                        </div>
                      </div>

                      {availableTermsState?.length > 0 && (
                        <div className="tw-mb-3">
                          <h6 className="tw-mb-3">Applicable On</h6>
                          <TableContainer
                            columns={roleApplicableTermsTableColumns || []}
                            data={availableTermsState}
                            divClass="tw-overflow-x-auto tw-mb-1"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            showCheckbox={true}
                            selectedRowHandler={selectedRowHandler}
                            defaultSelect={initialSelectTermsRef.current}
                          />
                          <span className="tw-text-red-500 tw-pl-4">
                            {addNewRequestForm.errors.isNoTermSelected
                              ? addNewRequestForm.errors.isNoTermSelected
                              : ""}
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className="tw-col-span-5 tw-pl-3"
                      style={{ borderLeft: "2px solid rgba(56, 65, 74, 0.10)" }}
                    >
                      <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">
                        <div className="tw-flex tw-mb-3 tw-justify-between tw-gap-4 tw-items-center tw-col-span-12 ">
                          <label className="tw-col-span-5 tw-mb-0">Nearest Landmark</label>
                          <TextInput
                            name="landmark"
                            value={addNewRequestForm.values.landmark}
                            onChange={addNewRequestForm.handleChange}
                            onBlur={addNewRequestForm.handleBlur}
                            formgroupClassName="tw-col-span-7 tw-mb-0 tw-w-[70%]"
                            invalid={(addNewRequestForm.touched.landmark && addNewRequestForm.errors.landmark) ? true : false}
                            error={(addNewRequestForm.touched.landmark && addNewRequestForm.errors.landmark) ? addNewRequestForm.errors.landmark : ""}
                          />
                        </div>

                        <div className="tw-flex tw-justify-between tw-items-center tw-col-span-12 tw-mb-3">
                          <label className="tw-col-span-5">Office</label>
                          <TextInput
                            name="officeAddress"
                            value={addNewRequestForm.values.officeAddress}
                            onChange={addNewRequestForm.handleChange}
                            onBlur={addNewRequestForm.handleBlur}
                            formgroupClassName="tw-col-span-7 tw-mb-0 tw-w-[70%]"
                            invalid={(addNewRequestForm.touched.officeAddress && addNewRequestForm.errors.officeAddress) ? true : false}
                            error={(addNewRequestForm.touched.officeAddress && addNewRequestForm.errors.officeAddress) ? addNewRequestForm.errors.officeAddress : ""}
                          />
                        </div>

                        <div className="tw-my-3 tw-col-span-12">
                          <h5>Pick Up & Drop Point</h5>
                        </div>
                        <div className="tw-flex tw-justify-between tw-items-center tw-col-span-12 tw-mb-3">
                          <label className="tw-col-span-5">New Route</label>
                            <CustomSelect
                              name="routeId"
                              idKey="id"
                              containerClassName={`${addNewRequestForm.values.transportRequestFor === "STUDENT"
                                ? "tw-col-span-7 tw-mb-0 tw-w-[70%]"
                                : "tw-col-span-7 tw-mb-0 tw-w-[70%]"
                                }`}
                              defaultSelect="Select"
                              value={addNewRequestForm.values.routeId}
                              renderValue={renderValueRoute}
                              renderOptions={renderOptionsRoute}
                              onChange={selectRouteHndlr}
                              searchKey="routeName"
                              options={routeRequestListResp?.data || []}
                              invalid={(addNewRequestForm.touched.routeId && addNewRequestForm.errors.routeId) ? true : false}
                              error={(addNewRequestForm.touched.routeId && addNewRequestForm.errors.routeId) ? addNewRequestForm.errors.routeId : ""}
                            />

                            {addNewRequestForm.values.transportRequestFor === "STUDENT"&& addNewRequestForm.values.capacity && (
                              <div
                                className="tw-text-center tw-flex tw-items-center tw-justify-center tw-font-bold"
                                style={{
                                  width: "15%",
                                  backgroundColor: `${addNewRequestForm.values.capacity &&
                                    addNewRequestForm.values.capacity?.split("/")?.length > 0 &&
                                    (+addNewRequestForm.values.capacity?.split("/")?.[0] < 31
                                      ? "#D5FADD"
                                      : +addNewRequestForm.values.capacity?.split("/")?.[0] < 46
                                        ? "#FFEECA"
                                        : "#F9B4A1")
                                    }`,
                                  borderRadius: "5px",
                                  height: "2.3rem",
                                  color: `${addNewRequestForm.values.capacity &&
                                    addNewRequestForm.values.capacity?.split("/")?.length > 0 &&
                                    (+addNewRequestForm.values.capacity?.split("/")?.[0] < 31
                                      ? "#5EC27E"
                                      : +addNewRequestForm.values.capacity?.split("/")?.[0] < 46
                                        ? "#DE900A"
                                        : "#DE470A")
                                    }`,
                                  marginLeft: "9px",
                                }}
                              >
                                {addNewRequestForm.values.capacity}
                              </div>
                            )}
                         
                        </div>

                        <div className="tw-flex tw-justify-between tw-items-center tw-col-span-12 tw-mb-3">
                          <label className="tw-col-span-5">Stops</label>
                          <SelectInput
                            name="stopId"
                            value={addNewRequestForm.values.stopId}
                            onChange={onChangeStopHandler}
                            onBlur={addNewRequestForm.handleBlur}
                            menuItems={stopsByRouteIdResp}
                            valueKey="id"
                            textKey="stopName"
                            formgroupClassName="tw-col-span-7 tw-mb-0 tw-w-[70%]"
                            invalid={(addNewRequestForm.touched.stopId && addNewRequestForm.errors.stopId) ? true : false}
                            error={(addNewRequestForm.touched.stopId && addNewRequestForm.errors.stopId) ? addNewRequestForm.errors.stopId : ""}
                          />
                        </div>

                        <div className="tw-flex tw-justify-between tw-items-center tw-col-span-12 tw-mb-3">
                          <label className="tw-col-span-5 tw-mb-0">
                            Distance from school (Km)
                          </label>
                          <TextInput
                            name="slabDistance"
                            value={addNewRequestForm.values.slabDistance || "-"}
                            onChange={null}
                            isDisabled={true}
                            formgroupClassName="tw-col-span-7 tw-w-[70%]"
                          />
                        </div>

                        <div className="tw-flex tw-justify-between tw-items-center tw-col-span-12 tw-mb-3">
                          <label className="tw-col-span-5">Slab</label>
                          <SelectInput
                            name="slabId"
                            value={addNewRequestForm.values.slabId}
                            onChange={onSlabChangeHndler}
                            onBlur={addNewRequestForm.handleBlur}
                            menuItems={getSlabsListResp}
                            valueKey="slabId"
                            textKey="slabName"
                            formgroupClassName="tw-col-span-7 tw-mb-0 tw-w-[70%]"
                            invalid={(addNewRequestForm.touched.slabId && addNewRequestForm.errors.slabId) ? true : false}
                            error={(addNewRequestForm.touched.slabId && addNewRequestForm.errors.slabId) ? addNewRequestForm.errors.slabId : ""}
                          />
                        </div>

                        <div className="tw-flex tw-justify-between tw-items-center tw-col-span-12 tw-mb-3">
                          <label className="tw-col-span-4">Pick-Up Time</label>
                          <TextInput
                            name="pickUpTime"
                            value={addNewRequestForm.values.pickUpTime}
                            onChange={null}
                            isDisabled={true}
                            formgroupClassName="tw-col-span-7 tw-mb-0 tw-w-[70%]"
                          />
                        </div>

                        <div className="tw-flex tw-justify-between tw-items-center tw-col-span-12 tw-mb-3">
                          <label className="tw-col-span-5">Drop Time</label>
                          <TextInput
                            name="dropTime"
                            value={addNewRequestForm.values.dropTime}
                            onChange={null}
                            isDisabled={true}
                            formgroupClassName="tw-col-span-7 tw-mb-0 tw-w-[70%]"
                          />
                        </div>

                        <div className="tw-flex tw-justify-between tw-items-center tw-col-span-12">
                          <label className="tw-col-span-5">Remarks</label>
                          <TextArea
                            name="remarks"
                            value={addNewRequestForm.values.remarks}
                            onChange={addNewRequestForm.handleChange}
                            formgroupClassName="tw-col-span-7 tw-mb-0 tw-w-[70%]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tw-flex tw-items-center tw-gap-2 tw-justify-end">
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>

                    {/* 
                      <button
                        type="button"
                        disabled={showApiLoader}
                        onClick={(event: any) => submitBtnHndler(event, "submit")}
                        className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded hover:tw-bg-blue-600 disabled:tw-opacity-50"
                      >
                        Submit
                      </button>
                      */}

                    <Button
                      type="button"
                      variant="primary"
                      disabled={showApiLoader}
                      onClick={(event: any) => submitBtnHndler(event, "submitAndApprove")}
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

export default AddNewChangeRequest;
