import React, { useEffect, useState } from "react";
import {  TextInput } from "../../../Components/Common";
import {
  checkBoxOptionTypes,
  classSubjectModalProps,
  searchInputProps,
} from "./classSubjectTypes";
import { useFormik } from "formik";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import {
  getClassSubjectsList,
  updateClassSubjectsList,
} from "../../../store/academic/classSubjects/classsubjectsactions";
import { shallowEqual } from "react-redux";
import Button from "../../../Components/Common/Button";

const initialValues: searchInputProps = {
  searchString: "",
};

const ClassSubjectModal = (props: classSubjectModalProps) => {
  const [searchState, setSearchState] =
    useState<searchInputProps>(initialValues);
  const [inputBoxes, setInputBoxes] = useState<Array<checkBoxOptionTypes>>([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [className, setClassName] = useState('');
  const [isCheck, setIsCheck] = useState<Array<number>>([]);
  const [initialSub, setInitialSub] = useState<Array<number>>([]);
  const searchStudentsForm = useFormik({
    enableReinitialize: true,
    initialValues: searchState,

    onSubmit: (values) => { },
  });
  const dispatch = useAppDispatch();
  const handleSelectAll = () => {
    setIsCheck(inputBoxes.map((input) => +input.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
    setIsCheckAll(prev => !prev);
  };

  const getSubjectListApiCall = (otherProps?: any) => {
    let payload = { branchId: branchId, searchString: searchState.searchString, curriculumId: props.academicDetails.curriculumId, pageNo: 0, pageSize: 100, sortBy: "subjectName", ...otherProps }
    dispatch(
      getClassSubjectsList(
        generateActionPayload("get_class_subject_list", undefined, payload)
      )
    );
  }

  const searchHandler = (event: any) => {
    setSearchState(prev => ({ ...prev, [name]: value }));
    let { name, value } = event.target;
    getSubjectListApiCall({ [name]: value });
  }

  const handleClick = (e: any) => {

    const { id, checked } = e.target;

    let arr = [...isCheck];

    if (!checked) {
      arr = arr.filter((item) => item !== +id);
      // setIsCheck(isCheck.filter((item) => +item !== +id));
    } else {
      arr = [...arr, +id];
    }
    setIsCheck(arr);

    if ([...arr, ...initialSub].length == inputBoxes.length) {
      setIsCheckAll(true);
    } else {
      setIsCheckAll(false);
    }
  };

  const submitHandler = () => {
    dispatch(
      updateClassSubjectsList(
        generateActionPayload(
          "update_class_subject_list",
          {
            classId: props.academicDetails.branchClassId,
            academicYearId: props.academicDetails.academicYearId,
            curriculumId:props.academicDetails.curriculumId
          },
          [...isCheck, ...initialSub]
        )
      )
    );
  }

  // const resetHandler = () => {
  //   let checks: any = []
  //   props.classSubjectList.map((sub: any) => {
  //     // setIsCheck((prev: any) => ([...prev, sub.id]))
  //     checks.push(sub.id);
  //   })
  //   setIsCheck(checks)
  //   checks.length !== academicSubjectsListResp.length && setIsCheckAll(false);
  // }

  const { academicSubjectsListResp, branchClassResp, currentBranchIdResp: branchId,showApiLoader } = useAppSelector(
    ({ classSubjectsInfo, appData, branchAcademics,globalData }) => ({
      academicSubjectsListResp: classSubjectsInfo.academicSubjectsListResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader:globalData.showApiLoader,
    }),
    shallowEqual
  );
  useEffect(() => {

    if (props.isOpen && branchClassResp) {
      getSubjectListApiCall();
      branchClassResp.content.map((cls: any) => {
        cls.classId === props.academicDetails.branchClassId && setClassName(cls.className)
      })
      let checks: any = [];
      props.classSubjectList.map((sub: any) => {
        // setIsCheck((prev: any) => ([...prev, sub.id]))
        checks.push(sub.id);
      })
      setInitialSub(checks)
      branchClassResp.content.length === checks.length ? setIsCheckAll(true) : setIsCheckAll(false);
    }
    else {
      setIsCheck([]);
      setSearchState((prev: any) => ({ ...prev, searchString: "" }))
    }
  }, [props.isOpen]);

  useEffect(() => {
    let inital: Array<checkBoxOptionTypes> = [];
    let other: Array<checkBoxOptionTypes> = [];
    // let checked: Array<string> = [];
    if (academicSubjectsListResp) {
      academicSubjectsListResp.map((sub: any) => {
        // sub.assignedToClass && checked.push(sub.id);
        // checked.push(sub.id)
        initialSub.includes(sub.id) ? inital.push({
          id: sub.id,
          name: sub.subjectName,
          label: sub.subjectName, 
          subjectType: sub.subjectType
        }) : other.push({
          id: sub.id,
          name: sub.subjectName,
          label: sub.subjectName,
          subjectType: sub.subjectType
        });
      });

      setInputBoxes([...inital, ...other]);
      [...isCheck, ...initialSub].length === academicSubjectsListResp.length && setIsCheckAll(true);
    }
    // setIsCheck(checked);
  }, [academicSubjectsListResp]);
  return (
    <>
      <div >
        <div className="tw-flex tw-flex-col tw-border-b tw-mb-4">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-px-5 tw-py-3">
            <div className="tw-col-span-12 tw-bg-gray-100 tw-rounded tw-p-2 tw-flex tw-items-center">
              <h5 className="tw-text-sm tw-font-medium tw-mb-0">
                <span className="tw-text-gray-500">Class :</span>{" "}
                <span className="tw-font-semibold">
                  {props.academicDetails?.className}
                </span>
              </h5>
            </div>
            <div className="tw-col-span-12">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  value={searchState.searchString}
                  onChange={searchHandler}
                  placeHolder="Search Subject.."
                  formgroupClassName="tw-mb-0"
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          </div>
          <div className="tw-flex tw-items-center tw-gap-3 tw-px-5 tw-mb-3">
            <h6 className="card-title mb-0">{className + ' Assigned Subjects : '}</h6>
            <div className="tw-flex tw-items-center">
              {
                Array.isArray(props.classSubjectList) && props.classSubjectList.length > 1 && <div className="avatar-group">
                  {props.classSubjectList.map((sub: any, index: number) => <div className="avatar-group-item tw-p-2" data-bs-toggle="tooltip" data-bs-placement="top" title={sub.cardName} key={index} style={{ backgroundColor: `${sub.color}`, color: `${sub.bookColor}` }}>
                    {sub.shortName}
                  </div>
                  )
                  }</div>
              }
            </div>
          </div>
        </div>
        <div className="tw-px-5 tw-mb-4">
          <h6 className="tw-text-sm tw-font-semibold tw-mb-3">
            Select Subject
          </h6>
          <div className="tw-flex tw-items-center tw-gap-2">
            <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="checkall"
                name="allSubject"
                checked={isCheckAll}
                disabled={initialSub.length === inputBoxes.length}
                onChange={handleSelectAll}
              />
            <label className="tw-text-sm tw-font-medium">
              All Subjects
            </label>
          </div>
        </div>
        <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-px-5 tw-mb-6">
          {inputBoxes &&
            inputBoxes.map((item, index) => (
              <div key={index} className="tw-col-span-12 md:tw-col-span-6">
                <div className="tw-flex tw-items-start tw-gap-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={item.id}
                    name={item.name}
                    checked={isCheck.includes(+item.id) || initialSub.includes(+item.id)}
                    disabled={initialSub.includes(+item.id)}
                    onChange={handleClick}
                  />
                  <div>
                    <label className="tw-text-sm tw-font-medium tw-block">
                      {item?.label}
                    </label>
                    <p className="tw-text-xs tw-text-gray-500 tw-capitalize tw-mb-1">
                      ({item?.subjectType})
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="tw-flex tw-justify-end tw-gap-3 tw-px-5 tw-py-4 tw-border-t">
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
            onClick={submitHandler}
            disabled={showApiLoader || isCheck.length === 0}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default ClassSubjectModal;
