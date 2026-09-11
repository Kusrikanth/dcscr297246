
import { InputCheckbox, StatusLabel, Switch, TextInput, TextInputWithRegex, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";
import React, { useCallback, useEffect, useState } from "react";

const validResults:Array<string> = [
  "PANEL INTERVIEW RESULT : RECOMMENDED",
  "PANEL INTERVIEW RESULT : NORMAL_ADMISSION",
  "PANEL INTERVIEW RESULT : CONDITIONAL_ADMISSION",
  "PANEL INTERVIEW RESULT : REJECTED",
  "PANEL INTERVIEW RESULT : ON_HOLD",
  "OBSERVATION AND INTERVIEW REPORT : RECOMMENDED",
  "OBSERVATION AND INTERVIEW REPORT : REOBSERVATION",
  "PANEL INTERVIEW RESULT ADMISSION CANCELLED",
  "OBSERVATION AND INTERVIEW REPORT : REJECTED",
  "OBSERVATION AND INTERVIEW REPORT : ABSENT",
  "ADMISSION CANCELLED",
  "PANEL INTERVIEW RESCHEDULED",
  "PANEL INTERVIEW SCHEDULED",
];

export const isEditAccess = (adminssionProcess:any)=>{
  return !validResults.includes(adminssionProcess);
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Registration ID",
      accessor: "registrationNo",
      disableSortBy: true
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true
    },
    {
      Header: "Student Name",
      accessor: "studentDetail",
      columnClassName: 'w-20',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original.studentName}
              displayId={original.studentCode}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Admission Type",
      accessor: "admissionType",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span>{getDdMmYyyyWithMonthNameFormat(original.admissionType)}</span>)
      },
    },
    {
      Header: "Date",
      accessor: "examDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span>{getDdMmYyyyWithMonthNameFormat(original.examDate)}</span>)
      },
    },
    {
      Header: "Total",
      accessor: "totalMarks",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "recommended",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <StatusLabel type={original?.recommended?.toLowerCase() === "yes" ? 'pass' : "failed"} labelName={original?.recommended?.toLowerCase() === "yes" ? 'Pass' : "Failed"} />
      }
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      columnClassName:
        "sticky-right !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[#f3f6f9]",
      tdClass: "sticky-right !tw-z-10",
      Cell: ({ row: { original } }: any) => {
        return (
          isEditAccess(original?.admissionProcess) && <MoreActions actionOptions={actionsList} rowId={`${original.marksEntryId},${original.studentRegId}`} isHorizontal={true} />
        );
      },
    },
  ];
}

const InputComponent = React.memo(({ row: { original, index: rowIndex }, column, onChangeInputHndlr }: any) => {
  const { sub } = column || {};
  const selectedSubject = original?.subjects.find((subject: any) => +subject?.subjectId === +sub?.subjectId);

  const [state, setState] = useState<any>(selectedSubject?.marksObtained);
  useEffect(() => {
    setState(selectedSubject?.marksObtained || '');
  }, [selectedSubject?.marksObtained]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value <= selectedSubject?.maxMarks) {
      setState(event.target.value);
      onChangeInputHndlr(original?.studentRegId, 'subjectMarks', event.target.value, sub.subjectId)
    }
  };
  // const debounceFun = useCallback(debounce(onChangeInputHndlr, 200), []);
  const inputId = sub?.shortName?.toString().toLowerCase();
  return (
    <div style={{ minWidth: '150px' }} className="d-flex align-items-center">
      <span>
        {/* <input
          style={{ width: '50px' }}
          id={`subject-${rowIndex}-${inputId}`}
          name={`subject-${rowIndex}-${inputId}`}
          disabled={original?.isAbsent && true}
          type="number"
          // onBlur={()}
          value={state}
          className="form-control"
          onChange={onChange}
        /> */}
        <TextInputWithRegex
          formgroupClassName="mb-0"
          name={`subject-${rowIndex}-${inputId}`}
          inputClassName="w-50px"
          value={state}
          onChange={onChange}
          isDisabled={!!original?.isAbsent}
          maxLength={10}
          allowedInputRegex="^[0-9]+$"
        />
      </span>
      <span className="ps-2">/{selectedSubject?.maxMarks}</span>
      <span className="ps-2">
        <StatusLabel
          type={state !== '' ? +state >= +selectedSubject?.passMarks ? 'pass' : 'failed' : ''}
          labelName={state !== '' ? (+state >= +selectedSubject?.passMarks ? 'Pass' : 'Failed') : ''}
        />
      </span>
    </div>
  );
});

InputComponent.displayName = 'InputComponent';

const generateDynamicColumns = (assignedClassSubjectsListResp: any, TableValueChanged: any) =>
  assignedClassSubjectsListResp?.data
    ? assignedClassSubjectsListResp.data?.map((sub: any, index: any) => ({
      Header: sub.subjectName,
      accessor: sub.subjectName.toLowerCase().split(' ').join(''),
      disableSortBy: true,
      sub: sub,
      columnClassName: 'w-180px min-w-180px',
      Cell: InputComponent
    }))
    : [];



export function generateExaminationMarksColumns(assignedClassSubjectsListResp: any, TableValueChanged: any, RecommendChangeHandler: any,allStudentSelectedState:any,allStudentCheckHndlr:any,singleStudentCheckHndlr:any) {
  return [
    {
      Header: () => {
          return (
              <InputCheckbox
                  name={"all-student"}
                  // labelName={shortName}
                  value={allStudentSelectedState}
                  onChange={allStudentCheckHndlr}
                  formgroupClassName="mb-0"
              />
          )
      },
      accessor: "studentRegId",
      columnClassName: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original, index } }: any) => {
          const { studentRegId, isSelected } = original;
          return (
              <>
                  <InputCheckbox
                      name={`student-feeledger-${index}`}
                      // labelName={shortName}
                      value={isSelected}
                      // isDisabled={!original?.addExam && !original?.isEditAccess}
                      onChange={singleStudentCheckHndlr}
                      dataId={studentRegId}
                      formgroupClassName="mb-0"
                  />
              </>
          )
      }
  },
    {
      Header: "Registration ID",
      accessor: "registrationNo",
      disableSortBy: true,
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentId}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Is Absent",
      accessor: "isAbsent",
      disableSortBy: true,
      Cell: ({ row: { original, index } }: any) => {
        return <Switch
          attributeId={`absent-${index}`}
          checked={original.isAbsent}
          onChangeHndlr={(event: any) => TableValueChanged(original.studentRegId, 'isAbsent', event.currentTarget.checked)}
          // labelName={"Email Login Details to this user"}
          className="form-switch-sm form-check-left w-70"
        />
      }
    },
    ...generateDynamicColumns(assignedClassSubjectsListResp, TableValueChanged),
    {
      Header: "Admission Type",
      accessor: "admissionType",
      disableSortBy: true,
    },

    // {
    //   Header: "Total",
    //   accessor: "totalMarks",
    //   disableSortBy: true,
    // },
    {
      Header: "Recommend",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            {(original?.isRecommend) ? (<div style={{minWidth:"8rem"}}>
              <span>{original?.isRecommend === "yes" ?
                <StatusLabel type={"pass"} labelName={"Pass"} /> :
                <StatusLabel type={"failed"} labelName={"Failed"} />}</span>
              {!original?.isAbsent && <button style={{ marginLeft: "8px", border: "none" }} className={`text-info cursor-pointer bg-white btn btn-secondary`} onClick={() => RecommendChangeHandler(original.studentRegId, "")}>Reset</button>}
            </div>)
              : <div className="d-flex">
                <button onClick={() => RecommendChangeHandler(original?.studentRegId, "yes")} disabled={(original?.isRecommend === null || original?.isAbsent)} className="btn-sm btn-icon btn btn-outline-primary me-3"><i className="ri-check-line fs-24" /></button>
                <button onClick={() => RecommendChangeHandler(original?.studentRegId, "no")} disabled={(original?.isRecommend === null || original?.isAbsent)}  className="btn-sm btn-icon btn btn-outline-danger"><i className="ri-close-fill fs-24" /></button>
              </div>}
          </>
        );
      },
    },
  ];
}

export const computeSubmitButtonError = (examinationMarksData: any) => {
  let newArr :any = []
  if (examinationMarksData?.length) {
    examinationMarksData?.map((item: any) => {
      let submitErr: any = true
      if(item.isSelected){
        if (item?.isAbsent) {
          submitErr = false
        } else if (item?.isRecommend) {
          submitErr = false
        }
        newArr.push(submitErr)
      }
    })

  }
  if(newArr.length === 0){return true}
  else if (newArr.some((element:any) => element === true)) {return true}
  else return false
}

export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if (!(key === "search" || key === "academicYearId" || key === "classId" || key === "curriculumId" || key === "examStartDate"))
        count += 1;
    }
  }
  if(count>0) {return {stateChange : showState , count : count}}
  else {return {stateChange : showState , count : count}}
}

export const AdmissionTypeMenuOptions = [
  {
    id: "Residential",
    value: "Residential"
  },
  {
    id: "Non-Residential",
    value: "Non-Residential"
  },

]
