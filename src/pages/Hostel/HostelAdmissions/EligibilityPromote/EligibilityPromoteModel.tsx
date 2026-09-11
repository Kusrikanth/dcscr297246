import { useFormik } from "formik";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
// Formik validation
import * as Yup from "yup";
import { SelectInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getBranchCurriculumAct, getBrchSectionsAct, setBrchSectionsAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
  getHigherClassEligibilityStudAct, setHigherClassEligibilityStudAct,
  getHostelEligibleClassesAct, saveEligibleStudForPromoteAct, setHostelEligibleClassesAct
} from "../../../../store/hostel/hostelrequest/hostelrequestactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { generateColumnsModel } from "./helper";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: ""
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic year required."),
  curriculumId: Yup.string().required("Curriculum required."),
  classId: Yup.string().required("Class required."),
});


const EligibilityPromoteModel: React.FC<any> = (props) => {
  const dispatch = useAppDispatch();
  const [selectedStudentState, setSelectedStudentState] = useState<any>([]);

  const { hostelEligibleClassesResp,
    academicYearListResp, brchCurriculumResp, currentInstIdResp: instituteId,
    currentBranchIdResp: branchId, showApiLoader, brchSectionsResp,
    higherClassEligibilityStudResp, saveEligibleStudForPromoteResp } =
    useAppSelector(({ appData, branchAcademics, globalData, instAcademics, hostelRequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      currentInstIdResp: appData.currentInstIdResp,
      brchSectionsResp: branchAcademics.brchSectionsResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      hostelEligibleClassesResp: hostelRequest.hostelEligibleClassesResp,
      higherClassEligibilityStudResp: hostelRequest.higherClassEligibilityStudResp,
      saveEligibleStudForPromoteResp: hostelRequest.saveEligibleStudForPromoteResp,
      showApiLoader: globalData.showApiLoader,
    }), shallowEqual);

  const promoteModalRespRef = useRef({
    prevSaveEligibleStudForPromoteResp: saveEligibleStudForPromoteResp
  });

  useEffect(() => {
    const { prevSaveEligibleStudForPromoteResp } = promoteModalRespRef.current;
    if (saveEligibleStudForPromoteResp && prevSaveEligibleStudForPromoteResp !== saveEligibleStudForPromoteResp) {
      toast.success('Student promoted successfully.');
      props.toggle(true);
    }
    promoteModalRespRef.current.prevSaveEligibleStudForPromoteResp = saveEligibleStudForPromoteResp;
  }, [saveEligibleStudForPromoteResp]);

  function getHigherClassEligibilityApiCall(otherProps?: any) {
    const params = { branchId, ...eligibleForPromoteForm.values, ...otherProps };
    dispatch(getHigherClassEligibilityStudAct(generateActionPayload("get_hostel_higherclasselibility", undefined, params)));
  }

  const eligibleForPromoteForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      getHigherClassEligibilityApiCall(values);
    },
  });

  useEffect(() => {
    return () => {
      dispatch(setHostelEligibleClassesAct(undefined));
      dispatch(setHigherClassEligibilityStudAct(undefined));
    }
  }, []);

  useEffect(() => {
    if (academicYearListResp) {
      const { data } = academicYearListResp || {};
      if (Array.isArray(data)) {
        let yearId = data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId;
        getCurriculumApiCall({academicYearId : yearId})
        eligibleForPromoteForm.setFieldValue("academicYearId", yearId);
      }
    }
  }, [branchId,instituteId,academicYearListResp]);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: eligibleForPromoteForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getClassApiCall(curriculumId: string) {
    const payload = { pageNo: 0, pageSize: 100,academicYearId: eligibleForPromoteForm.values.academicYearId, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId };
    dispatch(getHostelEligibleClassesAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getSectionsApiCall = (branchClassId?: any) => {
    const { academicYearId, curriculumId } = eligibleForPromoteForm.values;
    let payload = {
      branchClassId,
      masterAcademicYearId: academicYearId,
      curriculumId: curriculumId,
      pageNo: 0, pageSize: 100, sortBy: "sectionName", orderBy: "asc"
    }
    dispatch(getBrchSectionsAct(generateActionPayload("get_section_list", undefined, payload)));
  }

  function onChangeCurriculumHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setHigherClassEligibilityStudAct(undefined));
    const { name, value } = event.target;
    dispatch(setHostelEligibleClassesAct(undefined));
    dispatch(setBrchSectionsAct(undefined));
    eligibleForPromoteForm.setValues(prevState => ({ ...prevState, [name]: value, classId: '', sectionId: '' }))
    if (value) {
      getClassApiCall(value);
    }
  }

  function onChangeClassHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setHigherClassEligibilityStudAct(undefined));
    const { name, value } = event.target;
    eligibleForPromoteForm.setValues(prevState => ({ ...prevState, [name]: value, sectionId: '' }))
    dispatch(setBrchSectionsAct(undefined));
    if (value) {
      getSectionsApiCall(value);
    }
  }

  function onChangeAcademicYearHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setHigherClassEligibilityStudAct(undefined));
    const { name, value } = event.target;
    getCurriculumApiCall({academicYearId : value})
    eligibleForPromoteForm.setValues(prevState => ({ ...prevState, [name]: value,curriculumId:"", classId: '', sectionId: '' }))
  }

  const selectedRowHandler = useCallback((row: any) => {
    if (Array.isArray(row)) {
      setSelectedStudentState(row.map(item => item.studentId));
    }
  }, [higherClassEligibilityStudResp]);

  function submitHandler() {
    const { classId, academicYearId, curriculumId, sectionId } = eligibleForPromoteForm.values;
    const paylaod = {
      branchId, branchClassId: classId, academicYearId,
      branchCurriculumId: curriculumId, sectionId, studentIds: selectedStudentState
    }
    dispatch(saveEligibleStudForPromoteAct(generateActionPayload("save_hostel_higherclass_eligibility", undefined, paylaod)));
  }

  const columns = useMemo(() => generateColumnsModel(), []);
  return (
    <div className="tw-p-0">
      <form onSubmit={eligibleForPromoteForm.handleSubmit}>
        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-my-3 tw-mx-3 tw-px-3 tw-pb-3 tw-bg-gray-100 tw-rounded-md tw-p-2">

          <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
            <SelectInput
              name="academicYearId"
              labelText="Academic Year"
              labelClass="tw-font-bold required"
              value={eligibleForPromoteForm.values.academicYearId}
              onChange={onChangeAcademicYearHndlr}
              menuItems={academicYearListResp?.data}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
              invalid={(eligibleForPromoteForm.touched.academicYearId && eligibleForPromoteForm.errors.academicYearId) ? true : false}
              error={(eligibleForPromoteForm.touched.academicYearId && eligibleForPromoteForm.errors.academicYearId) ? eligibleForPromoteForm.errors.academicYearId : ""}

            />
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
            <SelectInput
              name="curriculumId"
              labelText="Curriculum"
              labelClass="tw-font-bold required"
              value={eligibleForPromoteForm.values.curriculumId}
              onChange={onChangeCurriculumHndlr}
              menuItems={brchCurriculumResp?.data}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              formgroupClassName="tw-mb-0"
              invalid={(eligibleForPromoteForm.touched.curriculumId && eligibleForPromoteForm.errors.curriculumId) ? true : false}
              error={(eligibleForPromoteForm.touched.curriculumId && eligibleForPromoteForm.errors.curriculumId) ? eligibleForPromoteForm.errors.curriculumId : ""}

            />
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
            <SelectInput
              name="classId"
              labelText="Class"
              labelClass="tw-font-bold required"
              value={eligibleForPromoteForm.values.classId}
              onChange={onChangeClassHndlr}
              menuItems={hostelEligibleClassesResp?.content}
              valueKey="id"
              textKey="shortName"
              formgroupClassName="tw-mb-0"
              invalid={(eligibleForPromoteForm.touched.classId && eligibleForPromoteForm.errors.classId) ? true : false}
              error={(eligibleForPromoteForm.touched.classId && eligibleForPromoteForm.errors.classId) ? eligibleForPromoteForm.errors.classId : ""}
            />
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
            <SelectInput
              name="sectionId"
              labelText="Section"
              labelClass="tw-font-bold"
              value={eligibleForPromoteForm.values.sectionId}
              onChange={eligibleForPromoteForm.handleChange}
              menuItems={brchSectionsResp?.data}
              valueKey="sectionId"
              textKey="sectionName"
              formgroupClassName="tw-mb-0"
            />
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2 tw-mt-4 tw-flex tw-justify-end tw-items-start">
            <Button
              type="submit"
              variant="hoverInfo"
            >
              Search
            </Button>
          </div>
        </div>
      </form>

      <TableContainer
        columns={columns || []}
        data={Array.isArray(higherClassEligibilityStudResp) ? higherClassEligibilityStudResp : []}
        tableClass="tw-mb-0"
        divClass="tw-overflow-x-auto tw-mb-3"
        theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
        showCheckbox={true}
        showPagination={false}
        selectedRowHandler={selectedRowHandler}
      />

      <div className="tw-flex tw-justify-end tw-gap-2 tw-px-4 tw-pb-3">
        <Button
          type="button"
          variant="secondary"
          onClick={props.toggle}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant="primary"
          disabled={selectedStudentState.length === 0 || showApiLoader}
          onClick={submitHandler}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default EligibilityPromoteModel;
