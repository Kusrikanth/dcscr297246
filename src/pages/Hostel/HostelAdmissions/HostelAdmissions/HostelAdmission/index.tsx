import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SelectInput, TextInput } from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { admissionTypeOptions, generateColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import {
  getBranchCurriculumAct, getBranchClassAct,
  setBrchClassAct,
  resetBrchClassAct,
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
  getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import { shallowEqual } from "react-redux";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getHostelNotOptedStudentsAct, saveHostelOptedStudentsAct } from "../../../../../store/hostel/hostelrequest/hostelrequestactions";
import { toast } from "react-toastify";
import Button from "../../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  admissionType:"Residential",
};

const HostelAdmission = () => {
  const [filterState, setFilterState] = useState(initialValues);
  const [selectedStudentState, setSelectedStudentState] = useState([]);
  const dispatch = useAppDispatch(),
    { showApiLoader, currentBranchIdResp: branchId,
      currentInstIdResp: instituteId, branchClassResp,
      academicYearListResp, saveHostelOptedStudentsResp,
      brchCurriculumResp, hostelNotOptedStudentsResp, hostelRequestErrorResp } =
      useAppSelector(({ appData, globalData, branchAcademics,
        instAcademics, hostelRequest }) => ({
          showApiLoader: globalData.showApiLoader,
          currentBranchIdResp: appData.currentBranchIdResp,
          currentInstIdResp: appData.currentInstIdResp,

          branchClassResp: branchAcademics.branchClassResp,
          brchCurriculumResp: branchAcademics.brchCurriculumResp,
          academicYearListResp: instAcademics.academicYearListResp,

          hostelNotOptedStudentsResp: hostelRequest.hostelNotOptedStudentsResp,
          saveHostelOptedStudentsResp: hostelRequest.saveHostelOptedStudentsResp,
          hostelRequestErrorResp: hostelRequest.hostelRequestErrorResp,

          instAcademicErrorResp: instAcademics.instAcademicErrorResp,
          brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp
        }), shallowEqual);

  const hostelAdmissionRespRef = useRef({
    prevSaveHostelOptedStudentsResp: saveHostelOptedStudentsResp,
    prevHostelRequestErrorResp: hostelRequestErrorResp
  })

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const { prevSaveHostelOptedStudentsResp, prevHostelRequestErrorResp } = hostelAdmissionRespRef.current;
    if (saveHostelOptedStudentsResp && prevSaveHostelOptedStudentsResp !== saveHostelOptedStudentsResp) {
      toast.success('Hosted request added successfully.');
      getHostelAdmissionRequestApiCall();
    } else if (hostelRequestErrorResp && prevHostelRequestErrorResp !== hostelRequestErrorResp) {
      const { details } = hostelRequestErrorResp || {};
      toast.error(details || 'Something went wrong.');
    }
    hostelAdmissionRespRef.current.prevSaveHostelOptedStudentsResp = saveHostelOptedStudentsResp;
    hostelAdmissionRespRef.current.prevHostelRequestErrorResp = hostelRequestErrorResp;
  }, [saveHostelOptedStudentsResp, hostelRequestErrorResp]);

  useEffect(() => {
    if (academicYearListResp) {
      const { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      setFilterState((prevState: any) => ({
        ...prevState, academicYearId,
      }));
      setFilterState({ ...initialValues, academicYearId });
      getCurriculumApiCall({ academicYearId });
      getHostelAdmissionRequestApiCall({ academicYearId });
    }
  }, [academicYearListResp, branchId,instituteId]);

  function paginationHndlr(paginationInfo: any) {
    paginationRef.current = paginationInfo;
    getHostelAdmissionRequestApiCall();
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function onChangeFilterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      setFilterState((prev:any) => ({ ...prev, [name]: value , classId : "",curriculumId : "" }));
      getHostelAdmissionRequestApiCall({ [name]: value, classId: "" , curriculumId: "" });
    }
    else if (name === "curriculumId") {
        if (value) {
            getClassApiCall(value);
        }
        else {
            dispatch(resetBrchClassAct(undefined));
        }
        getHostelAdmissionRequestApiCall({ [name]: value, classId: "" });
        setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
    } else {
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getHostelAdmissionRequestApiCall({ [name]: value, });
    }
  }

  function getClassApiCall(curriculumId: string) {
    // sortBy: "className", orderBy: "asc"
    const payload = {
      curriculumId, branchId,
      academicYearId : filterState.academicYearId,
      pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function getHostelAdmissionRequestApiCall(otherProps?: any) {
    const payload = {
      branchId,
      ...filterState,
      ...otherProps,
      ...paginationRef.current
    }
    dispatch(getHostelNotOptedStudentsAct(generateActionPayload("hostel_notopted_students", undefined, payload)));
  }

  const selectedRowHandler = useCallback((row: any) => {
    // selectedLedgerRef.current = row;
    setSelectedStudentState(row.map((item: any) => item.studentId));
  }, []);

  function submitHandler() {
    const payload = {
      academicYearId: filterState.academicYearId,
      branchId,
      studentIds: selectedStudentState
    }
    dispatch(saveHostelOptedStudentsAct(generateActionPayload("save_hostelrequest_students", undefined, payload)));
  }

  const columns = useMemo(() => generateColumns(), []);
  const { data: studentsListNotOpted, totalPages, totalElements, pageNo: pageNumber } = hostelNotOptedStudentsResp || {};
  return (
    <>
      <div className="tw-w-full tw-inline-block">
        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pb-3 tw-pt-2">

          <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-2">
            <div className="search-box">
              <TextInput
                name="searchString"
                formgroupClassName="tw-mb-0"
                value={filterState.searchString}
                onChange={onChangeFilterHandler}
                labelText="Search"
                placeHolder="Search"
                floatingLabel
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
            <SelectInput
              name="academicYearId"
              value={filterState.academicYearId}
              onChange={onChangeFilterHandler}
              menuItems={academicYearListResp?.data}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
              labelText="Academic Year"
              floatingLabel
            />
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
            <SelectInput
              name="curriculumId"
              value={filterState.curriculumId}
              onChange={onChangeFilterHandler}
              menuItems={brchCurriculumResp?.data}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              formgroupClassName="tw-mb-0"
              labelText="Curriculum"
              floatingLabel
            />
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
            <SelectInput
              name="classId"
              value={filterState.classId}
              onChange={onChangeFilterHandler}
              menuItems={branchClassResp?.content}
              valueKey="id"
              textKey="shortName"
              formgroupClassName="tw-mb-0"
              labelText="Class"
              floatingLabel
            />
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
            <SelectInput
              name="admissionType"
              value={filterState.admissionType}
              onChange={onChangeFilterHandler}
              menuItems={admissionTypeOptions}
              valueKey="id"
              textKey="name"
              formgroupClassName="tw-mb-0"
              defaultSelect="Admission Type"
              labelText="Admission Type"
              floatingLabel
            />
          </div>

          <div className="tw-col-auto tw-flex tw-justify-end">
            {/* <button
              disabled={selectedStudentState.length <= 0 || showApiLoader}
              onClick={submitHandler}
              type="submit"
              className="tw-bg-[#0ab39c] tw-text-white tw-px-4 tw-py-2 tw-rounded tw-font-medium 
                   disabled:tw-opacity-50 disabled:tw-cursor-not-allowed
                   hover:tw-bg-[#0ab39c] tw-transition"
            >
              Submit
            </button> */}

            <Button disabled={selectedStudentState.length <= 0 || showApiLoader} onClick={submitHandler} className="tw-ml-2" variant="primary">
              Submit
            </Button>
          </div>
        </div>
        <TableContainer
          columns={columns || []}
          data={Array.isArray(studentsListNotOpted) ? studentsListNotOpted : []}
          tableClass="tw-mb-0"
          divClass="tw-overflow-x-auto tw-mb-3"
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
          showCheckbox={true}
          selectedRowHandler={selectedRowHandler}
          showPagination={true}
          totalPages={totalPages}
          totalRecords={totalElements}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageNumber || 0}
        />
      </div>
    </>
  );
};

export default HostelAdmission;
