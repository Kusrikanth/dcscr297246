import React, { useCallback, useEffect, useMemo, useState } from "react";
import { generateColumns } from "./helper";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { getSkillEntryListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import * as Yup from "yup";
import { IErrorState } from "../../StudentRemarks/StudentReviesTypes";
import { touchTableFieldOnBlur, validateOnChange, validateOnSubmit } from "../../../../../utility/validationutility";
import { TextInput } from "../../../../../Components/Common";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

interface Pageable {
  pageNumber?: number;
}
interface EyGradeEntryListResp {
  content?: any[];
  totalElements?: number;
  totalPages?: number;
  pageable?: Pageable;
}
interface SoftSkillsProps {
  getEyGradeEntryListResp: EyGradeEntryListResp;
  eyGradesEntryList: any;
  onSubmitApiCall:any;
}

const subjectSkillValidationSchema = Yup.array()
  .of(
    Yup.object().shape({
      punctualityId: Yup.string().nullable(),
      communicationId: Yup.string().nullable(),
      adaptabilityId: Yup.string().nullable(),
      cheerfulId: Yup.string().nullable(),
      assignmentId: Yup.string().nullable(),
    })
  )

const SoftSkills: React.FC<SoftSkillsProps> = ({ getEyGradeEntryListResp, eyGradesEntryList, onSubmitApiCall }) => {
  const dispatch = useAppDispatch();
  const [searchString, setSearchString] = useState('');
  const [studentData, setStudentData] = useState<any[]>([]);
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
  const location = useLocation();
  const isEy = location.pathname.includes("/early-years-management");
  const isIgcse = location.pathname.includes("/igcse-management");
  const eyAoDataList = () => {
    let payload = { branchId };
    dispatch(getSkillEntryListAct(generateActionPayload("get_skill_entry_list", undefined, payload)));
  };

  const { currentBranchIdResp: branchId, getSkillEntryListResp, showApiLoader } = useAppSelector(
    ({ appData, examinationSettings, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      getSkillEntryListResp: examinationSettings.getSkillEntryListResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  useEffect(() => {
    eyAoDataList();
  }, []);

  useEffect(() => {
    if (Array.isArray(getEyGradeEntryListResp)) {
      if (getEyGradeEntryListResp.length > 0) {
        const modifiedData = getEyGradeEntryListResp?.map((item: any) => ({
          ...item,
          isSelected: true,
          ...item?.softSportSkills
        }))
        setStudentData(modifiedData)
        setAllStudentSelectedState(true);
      } else {
        setStudentData([]);
      }
    }
  }, [getEyGradeEntryListResp])

  async function onChangeTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const [indexKey, nameKey] = name.split(".");

    if (indexKey && nameKey) {
      const indexMatch = indexKey.match(/\[(.*?)\]/) || "";
      const index = Number(indexMatch[1]);

      if (!isNaN(index)) {
        const updatedTermState = [...studentData];
        updatedTermState[index] = {
          ...studentData[index],
          [nameKey]: value,
        };
        const { items } = await validateOnChange(subjectSkillValidationSchema, name, updatedTermState);
        setStudentData(
          items.map((item: any, idx: number) => ({
            ...item,
            isSelected: updatedTermState[idx]?.isSelected || false,
          }))
        );
      }
    }
  }

    async function onBlurTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target;
      const [indexKey, nameKey] = name.split(".");
  
      if (indexKey && nameKey) {
        const indexMatch = indexKey.match(/\[(.*?)\]/) || "";
        const index = Number(indexMatch[1]);
  
        if (!isNaN(index)) {
          const updatedStudentsListData = [...studentData];
          updatedStudentsListData[index] = {
            ...updatedStudentsListData[index],
            [nameKey]: value,
          };
  
          const studentsListDataTouched = await touchTableFieldOnBlur(index, nameKey, updatedStudentsListData);
          setStudentData(
            studentsListDataTouched.map((subject: any, idx: any) => ({
              ...subject,
              isSelected: studentData[idx]?.isSelected || false,
            }))
          );
        }
      }
    }

  const allStockCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    setStudentData((prevData) => {
      const updatedData = prevData.map((item) => {
        if (!checked) {
          item.errors = {};
        }
        return {...item,
        isSelected: checked}
      });
      return updatedData;
    });
  }, []);

  const singleStockCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget;
    const studentId = event.currentTarget.getAttribute("data-id");
    setStudentData((prevData) => {
      const updatedData = prevData.map((student) => {
        if (student.softSportSkills?.studentId === Number(studentId)) {
          return { ...student, isSelected: checked , ...(checked ? {} : { errors: {} }) };
        }
        return student;
      });
      const isAllSelected = updatedData.every((item) => item.isSelected);
      setAllStudentSelectedState(isAllSelected);
      return updatedData;
    });
  }, []);

    const submitHndlr = async () => {
      const selectedStudent = studentData.filter((student: any) => student.isSelected);
  
      if (!selectedStudent.length) {
        toast.warning("Please select at least one student.");
        return;
      }
  
      const { items, isValid: isStudentStateValid } = await validateOnSubmit(
        subjectSkillValidationSchema,
        selectedStudent
      );
  
      if (!isStudentStateValid) {
        setStudentData((prev: any) =>
          prev.map((student: any) => {
            const validatedStudent = items.find(
              (item: { studentId: number }) => item.studentId === student.studentId
            );
            return validatedStudent
              ? { ...student, errors: validatedStudent.errors }
              : student;
          })
        );
        return;
      }
      else {
        onSubmitApiCall("softSportSkills", selectedStudent)
      }
    }

  const onChangeHndler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearchString(value)
    eyGradesEntryList({ searchString: value });
  }

  const columns = useMemo(
    () => generateColumns(allStockCheckHndlr, singleStockCheckHndlr, allStudentSelectedState, isEy, isIgcse),
    [studentData, getSkillEntryListResp]
  );

  return (
    <div className="d-inline-block w-100">
      <div className="row px-3 pt-3 mb-3">
        <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
          <div className="search-box">
            <TextInput
              name="searchString"
              formgroupClassName="mb-0"
              labelText='Search'
              placeHolder="Search"
              value={searchString}
              onChange={onChangeHndler}
              floatingLabel
            />
            <i className="ri-search-line search-icon"></i>
          </div>
        </div>
      </div>
      <TableContainer
        columns={columns || []}
        data={studentData || []}
        tableClass="mb-0"
        divClass="table-responsive mb-3"
        theadClass="table-light text-muted align-middle"
        showCheckbox={false}
        showPagination={false}
        rowDataInfo={getSkillEntryListResp}
        onChangeInputHndlr={onChangeTableHndlr}
        onBlurInputHndlr={onBlurTableHndlr}
      />
      <div className="row px-3 mb-3">
        <div className="col-auto ms-auto">
          <button
            type="button"
            className={`btn btn-success`}
            disabled={showApiLoader}
            onClick={submitHndlr}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default SoftSkills;