import React, { useMemo, useState } from "react";
import {
  AutoSearchInput,
  DateInput,
  ModalContainer,
  SelectInput,
  Switch,
  TextInput,
} from "../../../../Components/Common";
import { useFormik } from "formik";
import { shallowEqual, useDispatch } from "react-redux";
import { getStudentsListAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppSelector } from "../../../../hooks/storehook";
import Button from "../../../../Components/Common/Button";

const initialValues: any = {
  curriculumId: "",
  academicYearId: "",
  classId: "",
  date: "",
  registrationNo: "",
  studentId: ""
};

const ExaminationModal = (props: any) => {
  const dispatch = useDispatch();
  const [feeStuctureModalFilterState, setFeeStuctureModalFilterState] =
    useState<any>(initialValues);
  const [studentDetails, setStudentDetails] = useState({});

  const ObservationandInterviewerReportForm = useFormik({
    enableReinitialize: true,
    initialValues: feeStuctureModalFilterState,
    onSubmit: (values) => { },
  });

  const { brchCurriculumResp, branchClassResp, brchSectionsResp, studentsListResp, getSiblingDetailsResp, currentBranchIdResp: branchId, currentInstIdResp: instituteId } =
    useAppSelector(({ branchAcademics, directoryStudent, appData }) => ({
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      brchSectionsResp: branchAcademics.brchSectionsResp,
      studentsListResp: directoryStudent.studentsListResp,
      getSiblingDetailsResp: directoryStudent.getSiblingDetailsResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,

    }), shallowEqual);

  function onInputSearchChange(inputString: any) {
    const { academicYearId, classId, curriculumId } = ObservationandInterviewerReportForm.values;
    if (inputString) {
      const params = {
        branchId, academicYearId, classId: classId,
        curriculumId: curriculumId, searchString: inputString,
      };
      dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
    }
  }
  function selectedStudentHndlr(student: any) {
    setStudentDetails(student);
  }



  return (
    <>
      
      <div className="tw-flex tw-flex-col tw-mb-3">
        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-my-1 tw-px-4 tw-mb-4">
          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="academicYearId"
              labelText="Academic Year"
              value={ObservationandInterviewerReportForm.values.academicYearId}
              onChange={ObservationandInterviewerReportForm.handleChange}
              formgroupClassName="tw-mb-0"
              menuItems={[]}
              valueKey="academicYear"
              textKey="academicYear"
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="curriculumId"
              labelText="Curriculum"
              value={ObservationandInterviewerReportForm.values.curriculumId}
              onChange={ObservationandInterviewerReportForm.handleChange}
              formgroupClassName="tw-mb-0"
              menuItems={[]}
              valueKey="curriculumType"
              textKey="curriculumType"
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="classId"
              labelText="Class"
              value={ObservationandInterviewerReportForm.values.classId}
              onChange={ObservationandInterviewerReportForm.handleChange}
              formgroupClassName="tw-mb-0"
              menuItems={[]}
              valueKey="id"
              textKey="shortName"
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6">
            <DateInput
              name="date"
              value={ObservationandInterviewerReportForm.values.date}
              onChange={ObservationandInterviewerReportForm.handleChange}
              formgroupClassName="tw-mb-0"
              labelText="Date"
              isReadOnly={true}
              inputClassName="tw-bg-gray-100"
              invalid={ObservationandInterviewerReportForm.touched.date && ObservationandInterviewerReportForm.errors.date ? true : false}
              error={ObservationandInterviewerReportForm.touched.date && ObservationandInterviewerReportForm.errors.date ? ObservationandInterviewerReportForm.errors.date : ""}
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6">
            <TextInput
              name="registrationNo"
              labelText="Registration No."
              value={ObservationandInterviewerReportForm.values.feeType}
              onChange={ObservationandInterviewerReportForm.handleChange}
              formgroupClassName="tw-mb-0"
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6">
            <AutoSearchInput
              labelText="Student Name"
              formgroupClassName="tw-relative"
              name="studentName"
              placeHolder="Search..."
              onChange={onInputSearchChange}
              valueKey="id"
              labelKey="name"
              subLabelKey="studentCode"
              labelHeader="Student Code"
              subLabelHeader="Student Name"
              options={studentsListResp?.data || []}
              selected={studentDetails}
              selectedOptionCallbck={selectedStudentHndlr}
              invalid={ObservationandInterviewerReportForm.touched.studentId && ObservationandInterviewerReportForm.errors.studentId ? true : false}
              error={ObservationandInterviewerReportForm.touched.studentId && ObservationandInterviewerReportForm.errors.studentId ? ObservationandInterviewerReportForm.errors.studentId : ""}
            >
              <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 tw--translate-y-1/2"></i>
            </AutoSearchInput>
          </div>
        </div>

        <hr className="tw-my-2" />

        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-my-1 tw-px-4 tw-mb-4">
          <div className="tw-col-span-12">
            <label className="tw-block">Is Absent :</label>
            <Switch
              attributeId="isSpecialChild"
              labelClass="tw-m-0"
              className="tw-inline-block tw-mb-3 tw-form-switch-sm tw-float-right"
            />
          </div>

          <div className="tw-col-span-12 tw-bg-gray-100 tw-px-2 tw-py-1">
            <span className="tw-p-3">Student Interviewer Report</span>
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="english"
              value={ObservationandInterviewerReportForm.values.english}
              onChange={ObservationandInterviewerReportForm.handleChange}
              menuItems={[]}
              valueKey=""
              textKey=""
              labelText="English"
              formgroupClassName="tw-mb-0"
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6">
            <TextInput
              name="other"
              value={ObservationandInterviewerReportForm.values.other}
              onChange={ObservationandInterviewerReportForm.handleChange}
              formgroupClassName="tw-mb-0"
              labelText=" "
            />
          </div>

          <div className="tw-col-span-12 tw-bg-gray-100 tw-px-2 tw-py-1 tw-mt-3">
            <span className="tw-p-3">Parent Interviewer Report</span>
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="attitude"
              value={ObservationandInterviewerReportForm.values.attitude}
              onChange={ObservationandInterviewerReportForm.handleChange}
              menuItems={[]}
              valueKey=""
              textKey=""
              labelText="Attitude"
              formgroupClassName="tw-mb-0"
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="qualification"
              value={ObservationandInterviewerReportForm.values.qualification}
              onChange={ObservationandInterviewerReportForm.handleChange}
              menuItems={[]}
              valueKey=""
              textKey=""
              labelText="Qualification"
              formgroupClassName="tw-mb-0"
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="profession"
              value={ObservationandInterviewerReportForm.values.profession}
              onChange={ObservationandInterviewerReportForm.handleChange}
              menuItems={[]}
              valueKey=""
              textKey=""
              labelText="Profession"
              formgroupClassName="tw-mb-0"
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="finance"
              value={ObservationandInterviewerReportForm.values.finance}
              onChange={ObservationandInterviewerReportForm.handleChange}
              menuItems={[]}
              valueKey=""
              textKey=""
              labelText="Finance"
              formgroupClassName="tw-mb-0"
            />
          </div>

          <div className="tw-col-span-12 tw-bg-gray-100 tw-px-2 tw-py-1 tw-mt-3">
            <span className="tw-p-3">Recommendation Status</span>
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="status"
              value={ObservationandInterviewerReportForm.values.status}
              onChange={ObservationandInterviewerReportForm.handleChange}
              menuItems={[]}
              valueKey=""
              textKey=""
              labelText="Status"
              formgroupClassName="tw-mb-0"
            />
          </div>

          <div className="tw-col-span-12 tw-flex tw-justify-end tw-gap-2">
            <Button type="button" variant="secondary" onClick={props.toggle}>Cancel</Button>
            <Button type="submit" variant="primary">Submit</Button>
          </div>
        </div>
      </div>
     
    </>
  );
};

export default ExaminationModal
