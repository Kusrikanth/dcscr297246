
import { InputCheckbox, SelectInput, Switch, TextInput, UserDetails } from "../../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../../../Components/Common/MenuOptions";
import React, { useEffect, useState } from "react";

const status: any = [
    { status: "Recommended" },
    { status: "Absent"  },
    { status: "ReObservation" },
]

export const observationData = [
    { behaviour: "VERY_POOR",show : "VERY POOR" },
    { behaviour: "POOR",show : "POOR" },
    { behaviour: "GOOD",show : "GOOD" },
    { behaviour: "VERY_GOOD" ,show : "VERY GOOD"},
    { behaviour: "SATISFACTORY",show : "SATISFACTORY" },
    { behaviour: "OTHER",show : "OTHER" },
]

const InputComponent = ({
    row: { index, original },
    onChangeInputHndlr,
  }: any) => {
    return (
        <TextInput
        name="reObservationReason"
        customWidth={"10rem"}
        value={original?.reObservationReason}
        isDisabled={(!(original?.status === "ReObservation") || !original?.isSelected || original?.isAbsent || original?.siblingVerification) && true}
          onChange={(event:any)=>onChangeInputHndlr(event,"reasonChange",original?.id)}
          inputClassName="mt-2 "
    />
    )
  }

  const ParentInput = ({
    original,onChangeInputHndlr,rowIndex,lname,fname
  }: any) => {
    return (
        <TextInput
        name={`${lname}-${rowIndex}`}
        customWidth={"10rem"}
        value={original?.observationAndInterviewDetailsOtherDTOS?.length > 0 ? original?.observationAndInterviewDetailsOtherDTOS[0][lname] : ""}
        isDisabled={(original?.observationAndInterviewDetailsOtherDTOS?.length && !(original?.observationAndInterviewDetailsOtherDTOS[0][fname] === "OTHER")) || original?.siblingVerification && true}
          onChange={(event:any)=>onChangeInputHndlr(event,`${lname}`,original?.id)}
          inputClassName="mt-3 ms-3 "
        placeHolder="Other Remarks..."
    />
    )
  }

  const ParentSelect = ({
    original,onChangeInputHndlr,rowIndex,name
  }:any)=>{
    return (
        <SelectInput
        name={`${name}-${rowIndex}`}
        value={original?.observationAndInterviewDetailsOtherDTOS?.length && original?.observationAndInterviewDetailsOtherDTOS[0][name]}
        onChange={(event:any)=>onChangeInputHndlr(event,name,original?.id)}
        menuItems={observationData}
        valueKey="behaviour"
        customWidth={"9rem"}
        textKey="show"
        isDisabled={(!original?.isSelected || original?.isAbsent || original?.siblingVerification) && true}
        formgroupClassName="tw-mb-0"
    />
    )
  }
  
  const ParentInterviewReport = React.memo(({ row: { original, index: rowIndex }, column, onChangeInputHndlr }: any) => {
    const parentInputData = [
        {name : "parentAttitude",lname :"parentAttitudeRemarks",showName : "Attitude"},
        {name : "parentFinance",lname :"parentFinanceRemarks",showName : "Finance"},
        {name : "parentProfession",lname :"parentProfessionRemarks",showName : "Profession"},
        {name : "parentQualification",lname :"parentQualificationRemarks",showName : "Qualification"},
    ]
    return (
        <div className="me-4">
        {parentInputData?.map((item:any,index:any)=>(
            <div className="d-flex align-items-center my-2" style={{height:"40px"}} key={index}>
            <span className="" style={{ color: "#495057",width:"6.5rem" }}> {item?.showName} : </span> 
                <ParentSelect original={original} onChangeInputHndlr={onChangeInputHndlr} rowIndex={rowIndex} name={item?.name}  />
                {original?.observationAndInterviewDetailsOtherDTOS?.length > 0 && original?.observationAndInterviewDetailsOtherDTOS[0][item.name] === "OTHER" && <ParentInput original={original} onChangeInputHndlr={onChangeInputHndlr} rowIndex={rowIndex} fname={item?.name} lname={item?.lname} />}
        </div>
        )) }
    </div>
    );
  });

  ParentInterviewReport.displayName = 'ParentInterviewReport';
  
  const StudentInterviewReport = React.memo(({ row: { original, index: rowIndex }, column, onChangeInputHndlr }: any) => {
    const studentInputData = [
        {name : "studentAcademics",lname :"studentAcademicsRemarks",showName : "Attitude"},
        {name : "studentAttitude",lname :"studentAttitudeRemarks",showName : "Finance"},
        {name : "studentCommunication",lname :"studentCommunicationRemarks",showName : "Profession"},
    ]
    return (
        <div className="me-4">
        {studentInputData?.map((item:any,index:any)=>(
            <div className="d-flex align-items-center my-2" style={{height:"40px"}} key={index}>
            <span className="" style={{ color: "#495057",width:"5.4rem" }}> {item?.showName} : </span> 
                <ParentSelect original={original} onChangeInputHndlr={onChangeInputHndlr} rowIndex={rowIndex} name={item?.name}  />
                {original?.observationAndInterviewDetailsOtherDTOS?.length > 0 && original?.observationAndInterviewDetailsOtherDTOS[0][item.name] === "OTHER" && <ParentInput original={original} onChangeInputHndlr={onChangeInputHndlr} rowIndex={rowIndex} fname={item?.name} lname={item?.lname} />}
        </div>
        )) }
    </div>
    );
  });

  StudentInterviewReport.displayName = 'StudentInterviewReport';
  
  const ExamSubjectInput = React.memo(({ row: { original, index: rowIndex }, column, onChangeInputHndlr }: any)=>{
    const {sub} = column;
    const selectedSubject = original?.interviewSubjectDTOS?.find((subject: any) => +subject?.subjectId === +sub?.subjectId);
    return (
        <>
        <div className="d-flex align-items-center" style={{minWidth:"200px"}}>
           {/* <span style={{minWidth:"65px"}}> Status : </span> */}
           <div className="">
            <SelectInput
            name={`${sub?.subjectName}-${rowIndex}`}
            // labelText="Attitude"
            value={selectedSubject?.status}
            onChange={(event:any)=>onChangeInputHndlr(event,"subjectChange",original?.id,selectedSubject?.subjectId,"status")}
            menuItems={observationData}
            defaultSelect="Status"
            valueKey="behaviour"
            isDisabled={!original?.isSelected || original?.isAbsent || original?.siblingVerification}
            textKey="show"
            formgroupClassName="tw-mb-0"
        />
        </div>
        </div>
        {(selectedSubject?.status === "OTHER") && <div className="d-flex align-items-center" style={{minWidth:"200px"}}>
           {/* <span  style={{minWidth:"65px"}}> Remarks : </span> */}
           <div className="">
           <TextInput
        name={`${sub?.subjectName}-${rowIndex}-Remarks`}
        customWidth={"8rem"}
        value={selectedSubject?.otherRemarks}
        isDisabled={(!(selectedSubject?.status === "OTHER") || original?.siblingVerification) && true}
          onChange={(event:any)=>onChangeInputHndlr(event,"subjectChange",original?.id,selectedSubject?.subjectId,"otherRemarks")}
          inputClassName="mt-3"
          placeHolder="Other Remarks..."
        // onBlur={onBlur}
    />
        </div>
        </div>}
        </>
    )
  })

  ExamSubjectInput.displayName = 'ExamSubjectInput';
  const generateDynamicColumns = (getObservationInterviewSubjectsResp: any) =>
  getObservationInterviewSubjectsResp
    ? getObservationInterviewSubjectsResp?.map((sub: any, index: any) => ({
      Header: sub.subjectName,
      accessor: sub.subjectName?.toLowerCase()?.split(' ')?.join(''),
      disableSortBy: true,
      sub: sub,
      columnClassName: 'w-180px min-w-180px',
      Cell: ExamSubjectInput
    }))
    : [];


export function generateColumns(actionsList: Array<IOptionsHrtl>, toggleObservationAndInterviewReportModal: any,  changeStatusHandler: any, getObservationInterviewSubjectsResp: any,reportChangeHandler:any, isAllSelected: any, allStudentSelectedHndlr: any, studentCheckHandler: any) {
    return [
        {
            Header: () => {
              return (
                <InputCheckbox
                  name={"all-student"}
                  // labelName={shortName}
                  value={isAllSelected}
                  onChange={allStudentSelectedHndlr}
                  formgroupClassName="tw-mb-0"
                />
              )
            },
            accessor: "isStudentChecked",
            columnClassName: "w-5",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              const { studentRegId, isSelected , siblingVerification } = original;
              return (
                <>
                  <InputCheckbox
                    name={`student-${studentRegId}`}
                    // labelName={shortName}
                    value={isSelected}
                    onChange={studentCheckHandler}
                    dataId={studentRegId}
                    isDisabled={siblingVerification}
                    formgroupClassName="tw-mb-0"
                  />
                </>
              )
            }
          },
        // {
        //     Header: "S.No",
        //     // accessor: "sNo",
        //     disableSortBy: true,
        //     Cell: ({ row }: any) => {
        //         return row.index + 1
        //     }
        // },
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <UserDetails
                            displayName={original?.studentName}
                            displayId={original?.registrationNo}
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
        // {
        //     Header: "Is Absent",
        //     accessor: "isAbsent",
        //     disableSortBy: true,
        //     Cell: ({ row: { original } }: any) => {
        //         return <Switch
        //             attributeId="allowRefunds"
        //             // labelName="Allow Refund"
        //             checked={original.isAbsent}
        //             onChangeHndlr={() => changeIsAbsentHandler(original?.id)}
        //             className="form-switch-sm form-check-right "
        //         />
        //     }
        // },
        ...generateDynamicColumns(getObservationInterviewSubjectsResp),
        {
            Header: "Student Interviewer Report",
            // accessor: "admissionType",
            disableSortBy: true,
            Cell: StudentInterviewReport
        },
        {
            Header: "Parent Interviewer Report",
            // accessor: "admissionType",
            disableSortBy: true,
            Cell: ParentInterviewReport
        },
        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                function statusChangeHndler(event:any){
                    changeStatusHandler(original?.id, event)
                }
                return <SelectInput
                    name="classId"
                    // labelText="Class"
                    value={original?.status}
                    onChange={statusChangeHndler}
                    // onBlur={filterForm.handleBlur}
                    menuItems={status || []}
                    defaultSelect={"Select"}
                    valueKey="status"
                    textKey="status"
                    customWidth={'10rem'}
                    inputClassName="mt-2 "
                    isDisabled={(!original?.isSelected || original?.siblingVerification) && true}
                />
            }
        },
        {
            Header: "Reason",
            accessor: "reObservationReason",
            disableSortBy: true,
            Cell: InputComponent
        },
        // {
        //     Header: "Update Result",
        //     filterable: false,
        //     disableSortBy: true,
        //     Cell: ({ row: { original } }: any) => {
        //         return (
        //             <div className="mt-2" style={{marginLeft:"2rem"}}>
        //             {!(original.isAbsent) ? <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} /> : " N/A"}
        //             </div>
        //         );
        //     },
        // },
    ];
}

export const classFiveAboveArr:any = [
    "parentAttitude","parentFinance","parentProfession","studentAcademics","parentQualification","studentAttitude","studentCommunication",
]

const classFiveBelowArr = [
    "parentAttitude","parentFinance","parentProfession","parentQualification"
]

export function computeSubmitButtonError(UpdatedList:any,subjectResp:any) {
    
    if(UpdatedList?.length){
        let newArr:any = [];
        UpdatedList?.map((item:any)=>{
            let findErr :boolean = false;
            if(item?.isSelected && !item?.siblingVerification){
                if(item?.isAbsent){
                    findErr = true;
                }else if(item?.isRecommended && item?.observationAndInterviewDetailsOtherDTOS?.length > 0){
                    const observationDetails = item?.observationAndInterviewDetailsOtherDTOS?.[0];
                    if (
                        !(item?.interviewSubjectDTOS?.length) &&
                        !(classFiveAboveArr.some((prop:any) => !observationDetails[prop]))
                      ) {
                        findErr = true;
                    }else if(
                        subjectResp?.length > 0 &&
                        (item?.interviewSubjectDTOS?.length) &&
                        !(classFiveBelowArr.some((prop:any) => !observationDetails[prop])) && 
                        (item?.interviewSubjectDTOS?.every((prop:any) => prop?.status))
                    ){
                        findErr = true;
                    }
                }else if(item?.isReObservation){
                    findErr = true;
                }
                newArr.push(findErr)
            }
        })

        if(newArr.length === 0){return true}
        else if(newArr.some((element:any) => element === false)) {return true}
        else { return false}
    }
  }
  
  export function refDataHndler (obsAndIntRepData:any[],list:any){
    obsAndIntRepData.map((item: any) => {
      const findIndex = list.findIndex((i: any) => i?.id === item?.id)
      if (!item?.isSelected && (findIndex > -1)) {
          list.splice(findIndex, 1)
      } else if (item?.isSelected) {
          if ((findIndex > -1)) {
              list.splice(findIndex, 1, { ...item })
          } else {
              list.push(item)
          }
      }
    })
    return list
  }
