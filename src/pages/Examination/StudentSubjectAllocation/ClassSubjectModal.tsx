import React, { useEffect, useState } from "react";
import {  TextInput } from "../../../Components/Common";

import { useFormik } from "formik";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import {
    getAssignedClassSubjectsList,
} from "../../../store/academic/classSubjects/classsubjectsactions";
import { shallowEqual } from "react-redux";

const initialValues: any = {
  searchString: "",
};

const ClassSubjectModal = (props: any) => {
  const [searchState, setSearchState] =
    useState<any>(initialValues);
  const [inputBoxes, setInputBoxes] = useState<Array<any>>([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [className, setClassName] = useState('');
  const [isCheck, setIsCheck] = useState<Array<number>>([]);
  const [initialSub, setInitialSub] = useState<Array<number>>([]);
  const searchStudentsForm = useFormik({
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
    let payload = { branchId: branchId, searchString: searchState.searchString, curriculumId: props.academicDetails.curriculumId,branchClassId : props.academicDetails.classId, pageNo: 0, pageSize: 100,  ...otherProps }
    dispatch(
        getAssignedClassSubjectsList(
          generateActionPayload("get_assigned_class_subject_list", undefined, payload)
        )
      );
  }

  const searchHandler = (event: any) => {
    setSearchState((prev:any) => ({ ...prev, [name]: value }));
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
    // dispatch(
    //   updateClassSubjectsList(
    //     generateActionPayload(
    //       "update_class_subject_list",
    //       {
    //         classId: props.academicDetails.branchClassId,
    //         academicYearId: props.academicDetails.academicYearId,
    //         curriculumId:props.academicDetails.curriculumId
    //       },
    //       [...isCheck, ...initialSub]
    //     )
    //   )
    // );
  }

  const { academicSubjectsListResp, branchClassResp, currentBranchIdResp: branchId,showApiLoader,assignedClassSubjectsListResp } = useAppSelector(
    ({ classSubjectsInfo, appData, branchAcademics,globalData }) => ({
      academicSubjectsListResp: classSubjectsInfo.academicSubjectsListResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader:globalData.showApiLoader,
      assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
    }),
    shallowEqual
  );
  useEffect(() => {

    if (props.isOpen && branchClassResp) {
      getSubjectListApiCall();
      branchClassResp.content.map((cls: any) => {
        cls.classId === props.academicDetails.classId && setClassName(cls.className)
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
    let inital: Array<any> = [];
    let other: Array<any> = [];
    // let checked: Array<string> = [];
    if (assignedClassSubjectsListResp) {
      assignedClassSubjectsListResp.map((sub: any) => {
        // sub.assignedToClass && checked.push(sub.id);
        // checked.push(sub.id)
        initialSub.includes(sub.id) ? inital.push({
          id: sub.id,
          name: sub.subjectName,
          label: sub.subjectName,
        }) : other.push({
          id: sub.id,
          name: sub.subjectName,
          label: sub.subjectName,
        });
      });

      setInputBoxes([...inital, ...other]);
      [...isCheck, ...initialSub].length === assignedClassSubjectsListResp?.length && setIsCheckAll(true);
    }
    // setIsCheck(checked);
  }, [assignedClassSubjectsListResp]);
  return (
    <>
   
      <div >
        <div className="d-flex flex-column border-bottom mb-3">
          <div className="row g-3 my-1 px-4">
            <div
              className="col-xl-12 background-gray p-1 my-2 d-flex align-items-center"
            >
              <h5 className="me-4 mb-0 fs-14">
                <span className="text-muted fw-normal">Subject Allocation To : </span>{" "}
                <span className="fw-semibold">{props.academicDetails?.className}</span>
              </h5>
            </div>
            <div className="col-xl-12">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  value={searchState.searchString}
                  onChange={searchHandler}
                  // inputClassName="bg-light"
                  placeHolder="Search Subject.."
                />

                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center mb-2 px-4">
            <h6 className="card-title mb-0">{className + ' Assigned Subjects : '}</h6>
            <div className="d-flex align-items-center">
              {
                Array.isArray(props.classSubjectList) && props.classSubjectList.length > 1 && <div className="avatar-group">
                  {props.classSubjectList.map((sub: any, index: number) => <div className="avatar-group-item p-2" data-bs-toggle="tooltip" data-bs-placement="top" title={sub.cardName} key={index} style={{ backgroundColor: `${sub.color}`, color: `${sub.bookColor}` }}>
                    {sub.shortName}
                  </div>
                  )
                  }</div>
              }
            </div>
          </div>
        </div>

        <div className="row mb-3 px-4">
          <div className="col">
            <h6 className="card-title mb-3">Select Subject</h6>
            <div className="form-check">
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
              <label className="form-check-label-additional">
                All Subjects
              </label>
            </div>
          </div>
        </div>

        <div className="row px-4 mb-4">
          {inputBoxes &&
            inputBoxes.map((item, index) => (<div key={index} className="col-sm-6 col-xl-6  mb-1">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  // value=""
                  id={item.id}
                  name={item.name}
                  checked={isCheck.includes(+item.id) || initialSub.includes(+item.id)}
                  disabled={initialSub.includes(+item.id)}
                  onChange={handleClick}
                />
                <label className="form-check-label-additional">
                  {item?.label}
                </label>
              </div>
            </div>
            ))}
          <div className="col-xs-6"></div>
        </div>
        <div className="hstack gap-2 justify-content-end mb-1 " style={{padding:"1.25rem"}}>
           
           <button
             type="button"
             className={"btn btn-light"}
             onClick={props.toggle}
           >
             Cancel
           </button>
         
           <button
             type="button"
             className={`btn btn-success
                `}
             onClick={submitHandler}
             disabled={showApiLoader || isCheck.length === 0}
           >
             Save
           </button>
         
       </div>
        </div>
     
    </>
  );
};

export default ClassSubjectModal;
