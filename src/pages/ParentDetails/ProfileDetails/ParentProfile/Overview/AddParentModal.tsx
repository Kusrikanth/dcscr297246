import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Col } from 'reactstrap';
import { AutoSearchInput, NewPhoneInput, RadioInputContainer, SelectInput, TextArea, TextIconInput, TextInput, UploadImageUpdated } from '../../../../../Components/Common'
import { details, relationTypeOptions } from './helper';
import { formSectionSaveKey, getIncomeOptions } from "../../../../Directory/StudentDetails/StudentInfo/helper";
import * as Yup from 'yup';
import ParentImage from "../../../../../assets/imagesdps/default-upload-img.png";
import { useAppSelector } from '../../../../../hooks/storehook';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { getDesignationsAct, getMasterIncomeAct, getOccupationAct, getQualificationAct } from '../../../../../store/masterdata/masterdataactions';
import { getEmployeeByFilterAct, getEmployeeByIdAct, setGetEmployeeByIdAct } from '../../../../../store/directory/employeemanagement/employeemanagementactions';
import { updateStudentAct } from '../../../../../store/directory/studentmanagement/studentmanagementactions';
import { uploadImageFileErrorHndlr } from '../../../../../utility/commonutility';
import { TextInputWithRegex } from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';


interface AddParentDetailsProps {
  parentId: number;
  // eslint-disable-next-line no-restricted-globals
  name: string;
  documentNumber: string;
  relationType: string;
  emailId: string;
  contactNo: string;
  whatsappNo: string;
  isEmployee: string;
  employeeId: string;
  qualificationId: string;
  qualificationName: string;
  occupationId: string;
  occupationName: string;
  organizationName: string;
  designationId: string;
  designationName: string;
  incomeData: string;
  officeAddress: string;
}

const validationSchema = Yup.object().shape({
  isEmployee: Yup.string(),
  employeeId: Yup.string().when("isEmployee", {
    is: (isEmployee: any) => isEmployee === "true",
    then: Yup.string().required("Father details are required."),
    otherwise: Yup.string().notRequired(),
  }),
  name: Yup.string().when("isEmployee", {
    is: (isEmployee: any) => isEmployee === "false",
    then: Yup.string().required("Name is required"),
    otherwise: Yup.string().notRequired(),
  }),
  documentNumber: Yup.string().when("isEmployee", {
    is: (isEmployee: any) => isEmployee === "false",
    then: Yup.string().min(12, "Aadhar number should be 12 digit."),
    otherwise: Yup.string().notRequired(),
  }),
  emailId: Yup.string().when("isEmployee", {
    is: (isEmployee: any) => isEmployee === "false",
    then: Yup.string().email("Invalid Email."),
    otherwise: Yup.string().notRequired(),
  }),
  contactNo: Yup.string().when("isEmployee", {
    is: (isEmployee: any) => isEmployee === "false",
    then: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Phone number with 10 digit is valid.').nullable(),
    otherwise: Yup.string().notRequired(),
  })
});

const AddParentModal = (props: any) => {
  const dispatch = useDispatch();
  const [searchEmployeeState, setSearchEmployeeState] = useState<any>({
    id: "",
    employeeCode: "",
    employeeName: ""
  });
  const [userImageState, setUserImageState] = useState<any>("");
  const [userImageErrorState, setUserImageErrorState] = useState<any>("");
  const initialValues = (editData?: any) => {
    let savedWhatsappNo = "";
    const { relationType, fatherWhatsappNo, motherWhatsappNo, guardianWhatsappNo } = editData || {};
    if (relationType === "Father") {
      savedWhatsappNo = fatherWhatsappNo;
    } else if (relationType === "Mother") {
      savedWhatsappNo = motherWhatsappNo;
    } else if (relationType === "Guardian") {
      savedWhatsappNo = guardianWhatsappNo;
    }
    return {
      parentId: editData?.id || "",
      name: editData?.name || "",
      documentNumber: editData?.documentNumber || "",
      emailId: editData?.emailId || "",
      relationType: editData?.relationType || "",
      contactNo: editData?.contactNo || "",
      whatsappNo: savedWhatsappNo,
      isEmployee: editData ? editData.isEmployee ? "true" : "false" : "false",
      employeeId: editData?.employeeId || "",
      qualificationId: editData?.qualificationId || "",
      qualificationName: editData?.qualificationName || "",

      occupationId: editData?.occupationId || "",
      occupationName: editData?.occupationName || "",

      organizationName: editData?.organizationName || "",
      designationId: editData?.designationId || "",
      designationName: editData?.designationName || "",

      incomeData: editData?.incomeData || "",
      officeAddress: editData?.officeAddress || ""
    }
  }


  const { affectedSection, masterIncomeResp, updateStudentResp, qualificationsListResp, occupationResp, designationListResp, getEmployeesByFilterResp, getEmployeeByIdResp, showApiLoader } = useAppSelector(
    ({ directoryStudent, directoryEmployee, masterData, globalData }) => ({
      affectedSection: directoryStudent.affectedSection,
      updateStudentResp: directoryStudent.updateStudentResp,
      masterIncomeResp: masterData.masterIncomeResp,
      getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
      getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
      qualificationsListResp: masterData.qualificationsListResp,
      occupationResp: masterData.occupationResp,
      designationListResp: masterData.designationListResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  const ParentDetailsRef = useRef<any>({
    preUpdateStudentDetails: updateStudentResp
  });

  const [initialData, setInitialData] = useState<AddParentDetailsProps>(initialValues());
  const [realationType, setRelationType] = useState();
  useEffect(() => {
    if (props.isOpen) {
      const { editData } = props, { relationType } = editData || {};
      if (relationType === "Father") {
        setSearchEmployeeState({
          id: editData?.id,
          employeeCode: editData?.fatherEmployeeCode,
          employeeName: editData?.name
        });
      } else if (relationType === "Mother") {
        setSearchEmployeeState({
          id: editData?.id,
          employeeCode: editData?.motherEmployeeCode,
          employeeName: editData?.name,
        });
      } else {
        setSearchEmployeeState({
          id: "",
          employeeCode: "",
          employeeName: ""
        });
      }
      setInitialData(initialValues(props.editData));
      setUserImageState(props.editData && props.editData?.imageBase64 ? `data:image/png;base64,${props.editData?.imageBase64}` : ParentImage)
      dispatch(getQualificationAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "QUALIFICATIONS", searchString: "", pageNo: 0, pageSize: 1500, orderBy: "asc", sortBy: "qualification" })));
      dispatch(getOccupationAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "OCCUPATION", searchString: "", pageNo: 0, pageSize: 1500, orderBy: "asc", sortBy: "occupationName" })));
      dispatch(getDesignationsAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "DESIGNATION", searchString: "", pageNo: 0, pageSize: 1500, sortBy: "designationName", orderBy: "asc" })));
      dispatch(getMasterIncomeAct(generateActionPayload("get_master_income")));

    }
    else {
      addParentDetailsForm.resetForm();
      setUserImageErrorState('');
    }
    if (props.editData) {
      dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name",
        { searchString: props.editData.name })));
    }
  }, [props.isOpen])

  const addParentDetailsForm = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema,
    onSubmit: (values) => {

      let data;
      if (values.relationType === "Father") {
        data = {
          parentId: initialData.parentId,
          fatherContactNo: values.contactNo,
          fatherWhatsappNo: values.whatsappNo,
          fatherDocumentNumber: values.documentNumber,
          fatherEmailId: values.emailId,
          fatherName: values.name,
          isFatherEmployee: values.isEmployee === "true" ? true : false,
          fatherEmployeeId: values.employeeId,

          fatherQualificationId: values.qualificationId,
          fatherQualificationName: values.qualificationName,

          fatherOccupationId: values.occupationId,
          fatherOccupationName: values.occupationName,

          fatherOrganizationName: values.organizationName,
          fatherDesignationId: values.designationId,
          fatherDesignationName: values.designationName,

          fatherIncomeData: values.incomeData || '',
          fatherOfficeAddress: values.officeAddress,
        }
      }
      else if (values.relationType === "Mother") {
        data = {
          parentId: initialData.parentId,
          motherContactNo: values.contactNo,
          motherWhatsappNo: values.whatsappNo,
          motherDocumentNumber: values.documentNumber,
          motherEmailId: values.emailId,
          motherName: values.name,
          isMotherEmployee: values.isEmployee === "true" ? true : false,
          motherEmployeeId: values.employeeId,
          motherQualificationId: values.qualificationId,
          motherQualificationName: values.qualificationName,

          motherOccupationId: values.occupationId,
          motherOccupationName: values.occupationName,

          motherOrganizationName: values.organizationName,
          motherDesignationId: values.designationId,
          motherDesignationName: values.designationName,

          motherIncomeData: values.incomeData || '',
          motherOfficeAddress: values.officeAddress,
        }
      }
      else if (values.relationType === "Guardian") {
        data = {
          parentId: initialData.parentId,
          guardianContactNo: values.contactNo,
          guardianWhatsappNo: values.whatsappNo,
          guardianDocumentNumber: values.documentNumber,
          guardianEmailId: values.emailId,
          guardianName: values.name,
          isGuardianEmployee: values.isEmployee === "true" ? true : false,
          guardianOccupationId: values.occupationId,
          guardianDesignationId: values.designationId
        }
      }
      const formData = new FormData();
      let updateSectionKey = "";
      const { relationType } = values || {};
      if (relationType === "Father") {
        updateSectionKey = formSectionSaveKey.parentFather;
      } else if (relationType === "Mother") {
        updateSectionKey = formSectionSaveKey.parentMother;
      } else if (relationType === "Guardian") {
        updateSectionKey = formSectionSaveKey.parentGuardian;
      }
      const val = details(props.data, data, { branchId: props.branchId, instituteId: props.instituteId }, updateSectionKey)
      formData.append("studentRequest", JSON.stringify(val));
      dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, formData, {
        affectedSection: "Parent Details"
      })));

    },
  });

  useEffect(() => {
    const { preUpdateStudentDetails } =
      ParentDetailsRef.current;

    if (updateStudentResp &&
      preUpdateStudentDetails !== updateStudentResp) {
      affectedSection === "Parent Details" && toast.success("Parent Updated successfully.");
      affectedSection === "Parent Details" && props.toggle(true);
    }
    ParentDetailsRef.current.preUpdateStudentDetails = updateStudentResp;
  }, [affectedSection, updateStudentResp]);


  const employeeRespRef = useRef(getEmployeeByIdResp);
  useEffect(() => {
    if (getEmployeeByIdResp && employeeRespRef.current !== getEmployeeByIdResp) {
      setInitialData(initialValues({
        id: initialData.parentId,
        isEmployee: "true",
        employeeId: getEmployeeByIdResp?.employeeBasicDetails?.id,
        relationType: initialData?.relationType,
        name: getEmployeeByIdResp?.employeeBasicDetails?.employeeName,
        documentNumber: getEmployeeByIdResp?.employeeBasicDetails?.aadharNo,
        emailId: getEmployeeByIdResp?.employeeBasicDetails?.personalEmailId,
        contactNo: getEmployeeByIdResp?.employeeBasicDetails?.contactNo,
        qualificationId: getEmployeeByIdResp?.employeeEducationDetails?.qualificationId,
        qualificationName: getEmployeeByIdResp?.employeeEducationDetails?.qualificationName,

        occupationId: getEmployeeByIdResp?.employeeEducationDetails?.occupationId,
        occupationName: getEmployeeByIdResp?.employeeEducationDetails?.occupationName,

        designationId: getEmployeeByIdResp?.employeeDesignationDetails?.designationId,
        designationName: getEmployeeByIdResp?.employeeDesignationDetails?.designationName,

        incomeData: getIncomeOptions(getEmployeeByIdResp?.employeeSalaryDetails?.grossSalary),

        officeAddress: getEmployeeByIdResp?.employeeCurrentJob?.workLocation
      }))
    }
    employeeRespRef.current = getEmployeeByIdResp;
  }, [getEmployeeByIdResp])

  useEffect(() => {
    return () => {
      dispatch(setGetEmployeeByIdAct(undefined));
    }
  }, []);

  function getEmployeeApiCall(otherProps?: any) {
    const params = { ...otherProps }
    dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", params)));
  }
  function handleSelectedEmployee(selectedSingle?: any, meta?: any) {
    setSearchEmployeeState(selectedSingle);
    if (selectedSingle) {
      const { id } = selectedSingle;
      getEmployeeApiCall({ employeeId: id });
    } else {
      // getEmployeeApiCall({ employeeId: "" });
      addParentDetailsForm.setValues(prevValues => ({
        ...initialValues(),
        isEmployee: prevValues.isEmployee,
        relationType: prevValues.relationType
      }));
    }
  }

  function onChangePhoneInput(date: string, otherData: any, event: any) {
    const { target } = event, { name } = target || {},
      updateDate = date.substring(2);
    addParentDetailsForm.setFieldValue(name, updateDate);
  }

  function handleSearchEmployeeHndlr(inputString: string, inputAction: any) {
    if (inputString) {
      dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name",
        { searchString: inputString }, { genderId: addParentDetailsForm.values.relationType === "Father" ? 1 : 2 })));
    }
  }

  const updateProfile = (formData: any) => {
    dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, formData, {
      affectedSection: "Profile Picture"
    })));
  }
  function handleFileUploadHnlr(event: any) {

    const file = event.target.files[0];
    let error = uploadImageFileErrorHndlr(file.size, file.type);
    // branchLogoFileRef.current = event.target.files[0];
    if (error === "") {
      setUserImageErrorState('')
      setUserImageState(URL.createObjectURL(file));
      const formData = new FormData();
      const data: any = details(props.data, {}, { branchId: 1, instituteId: 1 })
      formData.append("studentRequest", JSON.stringify(data));

      if (addParentDetailsForm.values.relationType === "Father") {
        formData.append("fatherImage", file);
        updateProfile(formData);
      }
      else if (addParentDetailsForm.values.relationType === "Mother") {
        formData.append("motherImage", file);
        updateProfile(formData);
      }
      else if (addParentDetailsForm.values.relationType === "Guardian") {
        formData.append("guardianImage", file);
        updateProfile(formData);
      }
    }
    else {
      setUserImageErrorState(error);
    }


  }
  function isEmployeeHandler(event: any) {
    setSearchEmployeeState({
      id: "",
      employeeCode: "",
      employeeName: ""
    })
    addParentDetailsForm.setValues(prevValues => ({ ...initialValues(), relationType: prevValues.relationType }));
    addParentDetailsForm.handleChange(event);
  }
  return (

    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-my-1 tw-p-4 tw-pt-0">
      <div className="tw-col-span-12 tw-flex tw-justify-center tw-mb-2">
        <UploadImageUpdated
          name="parent-image"
          acceptFileFormat="image/png, image/gif, image/jpeg"
          value={userImageState}
          onChange={handleFileUploadHnlr}
          error={userImageErrorState}
        />
      </div>

      {addParentDetailsForm.values.relationType !== "Guardian" && (
        <div className="tw-col-span-12 md:tw-col-span-6">
          <RadioInputContainer
            name="isEmployee"
            labelText="Is Employee of School"
            inputContainerClassName="tw-mt-2"
            radioOptions={[{ id: "true", name: "Yes" }, { id: "false", name: "No" }]}
            value={addParentDetailsForm.values.isEmployee}
            onChange={isEmployeeHandler}
            invalid={addParentDetailsForm.touched.isEmployee && addParentDetailsForm.errors.isEmployee ? true : false}
            error={addParentDetailsForm.touched.isEmployee && addParentDetailsForm.errors.isEmployee ? addParentDetailsForm.errors.isEmployee : ""}
          />
        </div>
      )}

      {addParentDetailsForm.values.relationType !== "Guardian" && addParentDetailsForm.values.isEmployee === "true" && (
        <div className="tw-col-span-12 md:tw-col-span-6">
          <AutoSearchInput
            formgroupClassName="tw-relative"
            name="searchString"
            placeHolder="Search..."
            onChange={handleSearchEmployeeHndlr}
            valueKey="id"
            labelKey="employeeName"
            subLabelKey="employeeCode"
            labelHeader="Employee Code"
            subLabelHeader="Employee Name"
            options={(Array.isArray(getEmployeesByFilterResp) && getEmployeesByFilterResp) || []}
            selected={searchEmployeeState}
            selectedOptionCallbck={handleSelectedEmployee}
            labelText="Employee Name/Code"
            invalid={addParentDetailsForm.touched.employeeId && addParentDetailsForm.errors.employeeId ? true : false}
            error={addParentDetailsForm.touched.employeeId && addParentDetailsForm.errors.employeeId ? addParentDetailsForm.errors.employeeId : ""}
          >
            <i className="ri-search-line search-icon"></i>
          </AutoSearchInput>
        </div>
      )}

      <div className="tw-col-span-12 md:tw-col-span-6">
        <TextInput
          name="name"
          labelText="Name"
          value={addParentDetailsForm.values.name}
          onChange={addParentDetailsForm.handleChange}
          onBlur={addParentDetailsForm.handleBlur}
          isDisabled={true}
          invalid={addParentDetailsForm.touched.name && addParentDetailsForm.errors.name ? true : false}
          error={addParentDetailsForm.touched.name && addParentDetailsForm.errors.name ? addParentDetailsForm.errors.name : ""}
        />
      </div>

      <div className="tw-col-span-12 md:tw-col-span-6">
        <TextInputWithRegex
          name="documentNumber"
          labelText="Aadhar No"
          value={addParentDetailsForm.values.documentNumber}
          onChange={addParentDetailsForm.handleChange}
          onBlur={addParentDetailsForm.handleBlur}
          isDisabled={addParentDetailsForm.values.isEmployee === "true"}
          invalid={addParentDetailsForm.touched.documentNumber && addParentDetailsForm.errors.documentNumber ? true : false}
          error={addParentDetailsForm.touched.documentNumber && addParentDetailsForm.errors.documentNumber ? addParentDetailsForm.errors.documentNumber : ""}
          allowedInputRegex="^[0-9]+$"
          maxLength={12}
        />
      </div>

      <div className="tw-col-span-12 md:tw-col-span-6">
        <SelectInput
          name="relationType"
          labelText="Relation Type"
          value={addParentDetailsForm.values.relationType}
          onChange={addParentDetailsForm.handleChange}
          onBlur={addParentDetailsForm.handleBlur}
          menuItems={relationTypeOptions}
          isDisabled={!!props.editData}
          valueKey="relationType"
          textKey="relationType"
          invalid={addParentDetailsForm.touched.relationType && addParentDetailsForm.errors.relationType ? true : false}
          error={addParentDetailsForm.touched.relationType && addParentDetailsForm.errors.relationType ? addParentDetailsForm.errors.relationType : ""}
        />
      </div>

      <div className="tw-col-span-12 md:tw-col-span-6">
        <TextIconInput
          name="emailId"
          labelText="Email"
          value={addParentDetailsForm.values.emailId}
          onChange={addParentDetailsForm.handleChange}
          onBlur={addParentDetailsForm.handleBlur}
          isDisabled={addParentDetailsForm.values.isEmployee === "true"}
          invalid={addParentDetailsForm.touched.emailId && addParentDetailsForm.errors.emailId ? true : false}
          error={addParentDetailsForm.touched.emailId && addParentDetailsForm.errors.emailId ? addParentDetailsForm.errors.emailId : ""}
        >
          <i className="ri-mail-unread-line"></i>
        </TextIconInput>
      </div>

      <div className="tw-col-span-12 md:tw-col-span-6">
        <NewPhoneInput
          name="contactNo"
          labelText="Phone No."
          value={addParentDetailsForm.values.contactNo}
          onChange={onChangePhoneInput}
          onBlur={addParentDetailsForm.handleBlur}
          isDisabled={addParentDetailsForm.values.isEmployee === "true"}
          invalid={(addParentDetailsForm.touched.contactNo && addParentDetailsForm.errors.contactNo) ? true : false}
          error={(addParentDetailsForm.touched.contactNo && addParentDetailsForm.errors.contactNo) ? addParentDetailsForm.errors.contactNo : ""}
        />
      </div>

      <div className="tw-col-span-12 md:tw-col-span-6">
        <NewPhoneInput
          name="whatsappNo"
          labelText="WhatsApp Number"
          value={addParentDetailsForm.values.whatsappNo}
          onChange={onChangePhoneInput}
          onBlur={addParentDetailsForm.handleBlur}
          invalid={(addParentDetailsForm.touched.whatsappNo && addParentDetailsForm.errors.whatsappNo) ? true : false}
          error={(addParentDetailsForm.touched.whatsappNo && addParentDetailsForm.errors.whatsappNo) ? addParentDetailsForm.errors.whatsappNo : ""}
        />
      </div>

      {addParentDetailsForm.values.relationType !== "Guardian" && (
        <div className="tw-col-span-12 md:tw-col-span-6">
          <TextInput
            name="qualificationName"
            labelText="Qualification"
            value={addParentDetailsForm.values.qualificationName}
            onChange={addParentDetailsForm.handleChange}
            onBlur={addParentDetailsForm.handleBlur}
            isDisabled={addParentDetailsForm.values.isEmployee === "true"}
            invalid={addParentDetailsForm.touched.qualificationName && addParentDetailsForm.errors.qualificationName ? true : false}
            error={addParentDetailsForm.touched.qualificationName && addParentDetailsForm.errors.qualificationName ? addParentDetailsForm.errors.qualificationName : ""}
          />
        </div>
      )}

      <div className="tw-col-span-12 md:tw-col-span-6">
        <TextInput
          name="occupationName"
          labelText="Occupation"
          value={addParentDetailsForm.values.occupationName}
          onChange={addParentDetailsForm.handleChange}
          onBlur={addParentDetailsForm.handleBlur}
          isDisabled={addParentDetailsForm.values.isEmployee === "true"}
          invalid={addParentDetailsForm.touched.occupationName && addParentDetailsForm.errors.occupationName ? true : false}
          error={addParentDetailsForm.touched.occupationName && addParentDetailsForm.errors.occupationName ? addParentDetailsForm.errors.occupationName : ""}
        />
      </div>

      {addParentDetailsForm.values.relationType !== "Guardian" && (
        <div className="tw-col-span-12 md:tw-col-span-6">
          <TextInput
            name="organizationName"
            labelText="Company"
            value={addParentDetailsForm.values.organizationName}
            onChange={addParentDetailsForm.handleChange}
            onBlur={addParentDetailsForm.handleBlur}
            isDisabled={addParentDetailsForm.values.isEmployee === "true"}
            invalid={addParentDetailsForm.touched.organizationName && addParentDetailsForm.errors.organizationName ? true : false}
            error={addParentDetailsForm.touched.organizationName && addParentDetailsForm.errors.organizationName ? addParentDetailsForm.errors.organizationName : ""}
          />
        </div>
      )}

      <div className="tw-col-span-12 md:tw-col-span-6">
        <TextInput
          name="designationName"
          labelText="Designation"
          value={addParentDetailsForm.values.designationName}
          onChange={addParentDetailsForm.handleChange}
          onBlur={addParentDetailsForm.handleBlur}
          isDisabled={addParentDetailsForm.values.isEmployee === "true"}
          invalid={addParentDetailsForm.touched.designationName && addParentDetailsForm.errors.designationName ? true : false}
          error={addParentDetailsForm.touched.designationName && addParentDetailsForm.errors.designationName ? addParentDetailsForm.errors.designationName : ""}
        />
      </div>

      {addParentDetailsForm.values.relationType !== "Guardian" && (
        <div className="tw-col-span-12 md:tw-col-span-6">
          <SelectInput
            name="incomeData"
            labelText="Annual Income"
            formgroupClassName="tw-relative tw-mb-3"
            value={addParentDetailsForm.values.incomeData}
            onChange={addParentDetailsForm.handleChange}
            onBlur={addParentDetailsForm.handleBlur}
            isDisabled={addParentDetailsForm.values.isEmployee === "true"}
            menuItems={masterIncomeResp}
            textKey="annualIncome"
            valueKey="annualIncome"
            invalid={addParentDetailsForm.touched.incomeData && addParentDetailsForm.errors.incomeData ? true : false}
            error={addParentDetailsForm.touched.incomeData && addParentDetailsForm.errors.incomeData ? addParentDetailsForm.errors.incomeData : ""}
          />
        </div>
      )}

      {addParentDetailsForm.values.relationType !== "Guardian" && (
        <div className="tw-col-span-12">
          <TextArea
            name="officeAddress"
            labelText="Office Address"
            value={addParentDetailsForm.values.officeAddress}
            onChange={addParentDetailsForm.handleChange}
            onBlur={addParentDetailsForm.handleBlur}
            isDisabled={addParentDetailsForm.values.isEmployee === "true"}
            invalid={addParentDetailsForm.touched.officeAddress && addParentDetailsForm.errors.officeAddress ? true : false}
            error={addParentDetailsForm.touched.officeAddress && addParentDetailsForm.errors.officeAddress ? addParentDetailsForm.errors.officeAddress : ""}
          />
        </div>
      )}

      <div className="tw-col-span-12 tw-flex tw-justify-end tw-gap-2">
        <Button
          type="button"
          variant='secondary'
          onClick={props.toggle}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant='primary'
          onClick={(event: any) => addParentDetailsForm.handleSubmit(event)}
          disabled={showApiLoader}
        >
          {props.editData ? "Update" : "Submit"}
        </Button>
      </div>
    </div>

  )
}

export default AddParentModal
