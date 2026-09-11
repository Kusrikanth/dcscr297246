import { useEffect, useRef, useState } from 'react'
import { AutoSearchInputUpdated, DateInput, SelectInput, TextInput, UploadFileInput } from '../../../Components/Common';
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { generateActionPayload } from '../../../utility/reduxutility';
import { editStuLongLeavesAct, saveStuLongLeavesAct, searchStuLongLeavesAct } from '../../../store/StudentAttendance/StudentLongLeaves/studentlongleavesaction';
import { getRaisedByKey, leaveTypes } from './helper';
import Button from '../../../Components/Common/Button';

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required('Academic Year is required'),
  studentId: Yup.string().required('Please Search student after selecting academic year .'),
  fromDate: Yup.string().required('From Date is required'),
  toDate: Yup.string().required('To Date is required'),
  leaveType: Yup.string().required('Leave Type is required'),
})


const AddStudentLongLeaveModal = (props: any) => {
  const { raisedBy, studentDetails } = props;
  const dispatch = useDispatch();
  const [selectedStudentState, setSelectedStudentState] = useState({
    studentId: studentDetails?.childId,
    studentCode: studentDetails?.childCode,
    studentName: studentDetails?.childName,
    studentClassId: studentDetails?.classId,
    curriculumId: studentDetails?.curriculumId,
    studentSectionId: studentDetails?.sectionId,
    curriculumName: studentDetails?.curriculumName || "",
    studentClassName: studentDetails?.classShortName || "",
    studentSectionName: studentDetails?.sectionName || "",
  });
  const [errorHealthForm, setErrorHealthForm] = useState("")
  const [document, setDocument] = useState<any>("");
  const {
    academicYearListResp,
    brchCurriculumResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    searchStuLongLeavesResp,
    getStuLongLeavesByIdResp,
  } = useAppSelector(
    ({ applicationSale, globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, studentLongLeaves }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      searchStuLongLeavesResp: studentLongLeaves.searchStuLongLeavesResp,
      getStuLongLeavesByIdResp: studentLongLeaves.getStuLongLeavesByIdResp,
    }),
    shallowEqual
  );

  const addStuLongLeaveForm = useFormik({
    initialValues: {
      studentId: studentDetails?.childId,
      academicYearId: studentDetails?.academicYearId || "",
      fromDate: "",
      toDate: "",
      reason: "",
      document: "",
      leaveType: "",
    },
    validationSchema,
    onSubmit: (values: any) => {
      const { academicYearId, studentId, fromDate, toDate, reason, document, leaveType } = values || {};
      if (!props?.id) {
        const payload = {
          academicYearId, studentId, fromDate, toDate, reason, branchId,
          classId: selectedStudentState?.studentClassId,
          curriculumId: selectedStudentState?.curriculumId,
          sectionId: selectedStudentState?.studentSectionId,
          leaveType: leaveType.toUpperCase(),
          raisedBy: getRaisedByKey(props.raisedBy),
          source: 'WEB'
        }

        const formData = new FormData()
        formData.append("request", JSON.stringify(payload))
        if (addStuLongLeaveForm.values.document) {
          formData.append("multipartFile", addStuLongLeaveForm.values.document)
        }
        dispatch(saveStuLongLeavesAct(generateActionPayload("save_long_leaves", undefined, formData)));
      } else {
        const formData = new FormData()
        const payload: any = {
          fromDate, toDate, reason, leaveType: leaveType.toUpperCase(),
          raisedBy: getRaisedByKey(props.raisedBy),
          source: 'WEB'
        }
        if (!document?.id) {
          payload.documentId = getStuLongLeavesByIdResp?.document?.id;
          formData.append("multipartFile", document)
        }
        formData.append("request", JSON.stringify(payload))

        dispatch(editStuLongLeavesAct(generateActionPayload("edit_long_leaves", { id: props?.id }, formData)));
      }

    },
  });

  useEffect(() => {
    if (!props?.id && raisedBy !== 'PARENT_ROLE') {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      addStuLongLeaveForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }))
    }
  }, [raisedBy]);


  const changeStudentDetailRef = useRef({
    prevGetStuLongLeavesByIdResp: getStuLongLeavesByIdResp,
  });

  useEffect(() => {
    const { prevGetStuLongLeavesByIdResp } = changeStudentDetailRef.current;

    if (getStuLongLeavesByIdResp && getStuLongLeavesByIdResp !== prevGetStuLongLeavesByIdResp) {
      if (getStuLongLeavesByIdResp && props?.id) {
        const { academicYearId, classShortName, fromDate, toDate, leaveType, sectionName, reason, document, studentName, studentCode, studentId, curriculumName } = getStuLongLeavesByIdResp || {};

        addStuLongLeaveForm.setValues((prev: any) => ({ ...prev, academicYearId, className: classShortName, fromDate, toDate, leaveType, sectionName, curriculumName, reason, document: { ...document, name: document?.originalFileName }, studentId }));
        setSelectedStudentState((prev: any) => ({ ...prev, studentId, studentName, studentCode, studentClassName: classShortName, studentSectionName: sectionName, curriculumName: curriculumName }));
        setDocument({ ...document, name: document?.originalFileName })
      }
    }
    changeStudentDetailRef.current.prevGetStuLongLeavesByIdResp = getStuLongLeavesByIdResp;

  }, [getStuLongLeavesByIdResp]);


  function onInputSearchChange(inputString: any) {
    const { academicYearId } = addStuLongLeaveForm.values;
    if (inputString && academicYearId) {
      const params = { academicYearId: academicYearId, branchId: branchId, searchString: inputString };
      dispatch(searchStuLongLeavesAct(generateActionPayload("search_long_leaves", undefined, params)));
    }
  }

  function selectStudentHandler(selectedStudent: any) {
    setSelectedStudentState(selectedStudent);
    addStuLongLeaveForm.setValues((values: any) => ({
      ...values,
      studentId: selectedStudent?.studentId || "",
    }));
  }

  function uploadFileErrorHndlr(fileSize: any, fileType: string, validFileFormaters: Array<string>) {
    if (!isNaN(fileSize) && (Math.ceil(fileSize / (1024 * 1024)) > 2)) {
      return "Upload file should be less than 2mb.";
    }
    return "";
  }

  const handleFileUploadHnlr = (event: any) => {
    const { name } = event.target;
    const file = event.target.files[0];
    if (name === "document") {

      let error = uploadFileErrorHndlr(file.size, file.type, ['application/pdf']);
      if (error === "") {
        setErrorHealthForm('');
        setDocument(file);
        addStuLongLeaveForm.setFieldValue('document', file)
      }
      else {
        setErrorHealthForm(error);
      }
    }
  }

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <form onSubmit={addStuLongLeaveForm.handleSubmit}>
      <div className="tw-p-4">
        <div
          className="
      tw-grid tw-gap-4
      tw-grid-cols-1
      md:tw-grid-cols-2
    "
        >
          {/* Academic Year */}
          <SelectInput
              name="academicYearId"
              labelClass={(props?.id || raisedBy === 'PARENT_ROLE') ? "" : "required"}
              value={addStuLongLeaveForm.values.academicYearId}
              onChange={addStuLongLeaveForm.handleChange}
              onBlur={addStuLongLeaveForm.handleBlur}
              menuItems={academicYearList}
              valueKey="academicYearId"
              textKey="academicYearName"
              isDisabled={props?.id || raisedBy === 'PARENT_ROLE'}
              defaultSelect="Academic Year"
              labelText='Academic Year'
              invalid={(addStuLongLeaveForm.touched.academicYearId && addStuLongLeaveForm.errors.academicYearId) ? true : false}
              error={(addStuLongLeaveForm.touched.academicYearId && addStuLongLeaveForm.errors.academicYearId) ? addStuLongLeaveForm.errors.academicYearId : ""}
            />

          {/* Student */}
          <AutoSearchInputUpdated
              formgroupClassName="search-box mb-3"
              name="studentId"
              labelClass={(props?.id || raisedBy === 'PARENT_ROLE') ? "" : "required"}
              placeHolder="Search..."
              onChange={onInputSearchChange}
              onBlur={addStuLongLeaveForm.handleBlur}
              valueKey="studentId"
              labelKey="studentCode"
              subLabelKey="studentName"
              isDisabled={props?.id || raisedBy === 'PARENT_ROLE'}
              labelHeader="Student Id"
              subLabelHeader="Student Name"
              options={searchStuLongLeavesResp}
              selected={selectedStudentState}
              selectedOptionCallbck={selectStudentHandler}
              labelText={"Student"}
              invalid={(addStuLongLeaveForm.touched.studentId && addStuLongLeaveForm.errors.studentId) ? true : false}
              error={(addStuLongLeaveForm.touched.studentId && addStuLongLeaveForm.errors.studentId) ? addStuLongLeaveForm.errors.studentId : ""}

            >
            <i className="ri-search-line search-icon"></i>
          </AutoSearchInputUpdated>

          {/* Curriculum */}
          <TextInput
              name="curriculumName"
              labelText="Curriculum"
              value={selectedStudentState?.curriculumName}
              onChange={undefined}
              isReadOnly={true}
              isDisabled={true}
            />

            <TextInput
              name="className"
              labelText="Class"
              value={selectedStudentState?.studentClassName}
              onChange={undefined}
              isReadOnly={true}
              isDisabled={true}
            />

          {/* Section */}
          <TextInput
              name="sectionName"
              labelText="Section"
              value={selectedStudentState?.studentSectionName}
              onChange={undefined}
              isReadOnly={true}
              isDisabled={true}
            />

          {/* Leave Type */}
         <SelectInput
              name="leaveType"
              labelClass='required'
              value={addStuLongLeaveForm.values.leaveType}
              onChange={addStuLongLeaveForm.handleChange}
              onBlur={addStuLongLeaveForm.handleBlur}
              menuItems={leaveTypes || []}
              valueKey="id"
              textKey="leaveType"
              defaultSelect="Leave Type"
              labelText='Leave Type'
              invalid={(addStuLongLeaveForm.touched.leaveType && addStuLongLeaveForm.errors.leaveType) ? true : false}
              error={(addStuLongLeaveForm.touched.leaveType && addStuLongLeaveForm.errors.leaveType) ? addStuLongLeaveForm.errors.leaveType : ""}
            />

          {/* Reason – full width */}
          <div className="md:tw-col-span-2">
            <TextInput
              name="reason"
              labelText="Reason"
              value={addStuLongLeaveForm.values?.reason}
              onChange={addStuLongLeaveForm.handleChange}
              onBlur={addStuLongLeaveForm.handleBlur}
              maxLength={500}
            />
          </div>

          {/* From Date */}
          <DateInput
              name="fromDate"
              labelText="Leave From Date"
              labelClass='required'
              value={addStuLongLeaveForm.values.fromDate}
              onChange={addStuLongLeaveForm.handleChange}
              onBlur={addStuLongLeaveForm.handleBlur}
              invalid={(addStuLongLeaveForm.touched.fromDate && addStuLongLeaveForm.errors.fromDate) ? true : false}
              error={(addStuLongLeaveForm.touched.fromDate && addStuLongLeaveForm.errors.fromDate) ? addStuLongLeaveForm.errors.fromDate : ""}
            />

          {/* To Date */}
          <DateInput
              name="toDate"
              labelText="Leave To Date"
              labelClass='required'
              value={addStuLongLeaveForm.values.toDate}
              onChange={addStuLongLeaveForm.handleChange}
              onBlur={addStuLongLeaveForm.handleBlur}
              invalid={(addStuLongLeaveForm.touched.toDate && addStuLongLeaveForm.errors.toDate) ? true : false}
              error={(addStuLongLeaveForm.touched.toDate && addStuLongLeaveForm.errors.toDate) ? addStuLongLeaveForm.errors.toDate : ""}
            />

          {/* Document – full width */}
          <div className="md:tw-col-span-2">
            <UploadFileInput
              name="document"
              labelText="Document"
              value={document?.name || ""}
              onChange={handleFileUploadHnlr}
              hideUploadBtn
              invalid={!!errorHealthForm}
              error={errorHealthForm}
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2">
          <Button
            type="button"
            variant='secondary'
            onClick={props.toggle}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant='primary'
            disabled={showApiLoader}
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  )
}

export default AddStudentLongLeaveModal