import React, { useEffect, useRef, useState } from "react";
import { InputCheckbox, TextInput } from "../../../Components/Common";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import {
  assignSubjectToStudentAct,
  getAssignedClassSubjectsList, setAssignedClassSubjectsListAct,
} from "../../../store/academic/classSubjects/classsubjectsactions";
import { searhWithTextInList } from "../../../utility/commonutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import Button from "../../../Components/Common/Button";

const AllocateStudentSubjectModal = ({ branchId, allocatedSubjectInfo, closeModalHndlr }: any) => {
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [availableSubState, setAvailableSubState] = useState<any>([]);
  const [searchedSubListState, setSearchedSubListState] = useState<any>([]);
  const [searchString, setSearchString] = useState("");
  const dispatch = useAppDispatch();

  const getSubjectListApiCall = (otherProps?: any) => {
    const { academicYearId, classId, curriculumId } = allocatedSubjectInfo || {};
    if (academicYearId && classId && curriculumId) {
      const payload = {
        branchId, academicYearId, curriculumId,
        branchClassId: classId, ...otherProps, pageNo: 0, pageSize: 100,
      }
      dispatch(getAssignedClassSubjectsList(generateActionPayload("get_assigned_class_subject_list", undefined, payload)));
    }
  }

  const { assignSubjectToStudentResp, showApiLoader, assignedClassSubjectsListResp } = useAppSelector(
    ({ classSubjectsInfo, appData, branchAcademics, globalData }) => ({
      showApiLoader: globalData.showApiLoader,
      assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
      assignSubjectToStudentResp: classSubjectsInfo.assignSubjectToStudentResp,
    }), shallowEqual);

  const allocateSubjectRespRef = useRef({
    prevAssignSubjectToStudentResp: assignSubjectToStudentResp
  });

  useEffect(() => {
    const { prevAssignSubjectToStudentResp } = allocateSubjectRespRef.current;
    if (assignSubjectToStudentResp && prevAssignSubjectToStudentResp !== assignSubjectToStudentResp) {
      toast.success("Student subjects allocation updated successfully.");
      closeModalHndlr(true);
    }

    allocateSubjectRespRef.current.prevAssignSubjectToStudentResp = assignSubjectToStudentResp;
  }, [assignSubjectToStudentResp]);

  useEffect(() => {
    if (allocatedSubjectInfo) {
      getSubjectListApiCall();
    }
  }, [allocatedSubjectInfo]);

  useEffect(() => {
    return () => {
      dispatch(setAssignedClassSubjectsListAct(undefined));
    }
  }, []);

  function updateSelectedAllHndlr(availableSubjectList: any) {
    const isAllSelected = availableSubjectList.every((item: any) => item.isChecked);
    setIsCheckAll(isAllSelected);
  }

  function updateSearchedSubjectsHandlr(subjectList: Array<any>, searchValue: string) {
    const searchedItems = searhWithTextInList(subjectList, 'subjectName', searchValue);
    setSearchedSubListState(searchedItems);
  }

  function selectSubjectHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target,
      subjectId = event.target.getAttribute("data-id") || 0,
      subjectIndex = availableSubState.findIndex((item: any) => item.subjectId === +subjectId);

    if (subjectIndex > -1) {
      const subjectDetails = availableSubState[subjectIndex],
        updatedSubjectList = [...availableSubState];
      updatedSubjectList.splice(subjectIndex, 1, { ...subjectDetails, isChecked: checked });
      updateSelectedAllHndlr(updatedSubjectList);
      setAvailableSubState(updatedSubjectList);
      updateSearchedSubjectsHandlr(updatedSubjectList, searchString);
    }
  }

  function onSearchHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setSearchString(value);
    updateSearchedSubjectsHandlr(availableSubState, value);
  }

  function selectAllHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;
    setIsCheckAll(checked);
    const updatedSubjectList = availableSubState.map((item: any) => ({ ...item, isChecked: checked }));
    setAvailableSubState(updatedSubjectList);
    updateSearchedSubjectsHandlr(updatedSubjectList, searchString);
  }


  useEffect(() => {
    const { data: classSubjects } = assignedClassSubjectsListResp || {},
      { subjectIds } = allocatedSubjectInfo;
    if (Array.isArray(classSubjects) && classSubjects.length > 0) {
      const updatedClassSubjects = classSubjects.map(item => {
        return ({
          subjectId: item?.subjectId,
          classSubjectId: item?.classSubjectId,
          subjectName: item?.subjectName,
          subjectType: item?.subjectType,
          isChecked: Array.isArray(subjectIds) ? subjectIds.includes(item?.subjectId) : false
        })
      })
      setAvailableSubState(updatedClassSubjects);
      setSearchedSubListState(updatedClassSubjects);
      setIsCheckAll(updatedClassSubjects.every((item: any) => item.isChecked));
    }
  }, [allocatedSubjectInfo, assignedClassSubjectsListResp]);

  function saveHandler() {
    const { academicYearId, classId, studentId, curriculumId } = allocatedSubjectInfo || {},
      subjectIds = availableSubState.filter((item: any) => item.isChecked).map((item: any) => item.subjectId);
    const payload = {
      branchId,
      academicYearId,
      studentId,
      subjectIds
    }
    dispatch(assignSubjectToStudentAct(generateActionPayload("assign_subject_tostudent", undefined, payload)));

  }

  const isAnySubjectedSelected = availableSubState.some((item: any) => item.isChecked);
  return (
    <div className="tw-p-0">
      <div className="tw-p-4">
        <div className="search-box">
          <TextInput
            name="searchString"
            value={searchString}
            onChange={onSearchHandler}
            inputClassName="bg-soft-light"
            formgroupClassName="tw-mb-0"
            placeHolder="Search..."
          />
          <i className="ri-search-line search-icon"></i>
        </div>
      </div>
      <div className="tw-flex tw-items-center tw-border-b tw-px-4 tw-pb-3">
        <h6 className="tw-text-sm tw-text-gray-500 tw-font-normal tw-mr-2 tw-mb-0">
          Subject Allocated To:
        </h6>
        <div className="tw-text-sm tw-font-semibold tw-text-gray-800">
          {allocatedSubjectInfo?.studentCode} - {allocatedSubjectInfo?.studentName}
        </div>
      </div>
      <div className="tw-px-4 tw-pt-4">
        <h6 className="tw-text-sm tw-font-semibold tw-mb-3">
          Select Subject
        </h6>
        <InputCheckbox
          labelName="All Subject"
          name="all-subject"
          value={isCheckAll}
          onChange={selectAllHandler}
        />
        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mt-4 tw-max-h-[45vh] tw-overflow-y-auto">
          {Array.isArray(searchedSubListState) &&
            searchedSubListState.map((item) => (
              <div
                key={`subject-${item.subjectId}`}
                className="tw-col-span-12 sm:tw-col-span-6"
              >
                <InputCheckbox
                  name={`subject-${item?.subjectId}`}
                  labelName={item?.subjectName}
                  value={item.isChecked}
                  onChange={selectSubjectHndlr}
                  dataId={item?.subjectId}
                />

                {item?.subjectType && (
                  <p className="tw-text-xs tw-text-gray-500 tw-ml-5 tw-mb-2">
                    ({item.subjectType})
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
      <div className="tw-flex tw-justify-end tw-gap-3 tw-px-4 tw-py-4 tw-border-t tw-mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={closeModalHndlr}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={saveHandler}
          disabled={!isAnySubjectedSelected || showApiLoader}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default AllocateStudentSubjectModal;
