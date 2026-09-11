import { default as ApproveSvg } from "../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { IOptionsHrtl, MenuOptionHrtl } from "../../Components/Common/MenuOptions";
import { InputCheckbox, SelectInput, StatusLabel, TextInput, UserDetails } from "../../Components/Common";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                    <UserDetails
                      displayName={original?.studentName}
                      displayId={original?.studentCode}
                      size={"xs"}
                      defaultImgType="student"
                    />
                    </>
                );
            },
        },
        {
            Header:"Curriculum",
            accessor:"curriculumName",
            disableSortBy: true,
        },
        {
            Header:"Class",
            accessor:"className",
            disableSortBy: true,
        },
        {
            Header:"Section",
            accessor:"sectionName",
            disableSortBy: true,
        },
        {
            Header:"Second Language Name",
            accessor:"secondLanguageName",
            disableSortBy: true,
        },
        {
            Header:"Third Language Name",
            accessor:"thirdLanguageName",
            disableSortBy: true,
        },
        
    ];
}

const InputComponent = ({
    row: { index, original },
    onChangeInputHndlr,
  }: any) => {
    return (
        <TextInput
        name="remarks"
        // labelText="Bank Address"
        inputClassName="mt-2"
        value={original?.remarks}
        // onChange={(event:any)=>onChangeInputHndlr(original?.id,event,"remarks")}
    />
    )
  }

const SecondLanguage = ({ row: { index, original }, onChangeInputHndlr,rowDataInfo }: any) => {
  const {  secoundLanguageResp} = rowDataInfo || {};
  const updatedResp = secoundLanguageResp?.data?.filter((item:any)=>+item.languageId !== +original?.thirdLanguageId)
    return (
        <SelectInput
        name={`secondLanguageId-${index}`}
        // labelText="Second Language"
        value={original.secondLanguageId}
        onChange={(event:any)=>onChangeInputHndlr(event,"secondLanguageId",original?.studentId)}
        menuItems={updatedResp || []}
        valueKey="languageId"
        isDisabled={!original.isSelected}
        textKey="languageName"
        formgroupClassName="mb-0"
    />
    )
  }
  const ThirdLanguage = ({ row: { index, original }, onChangeInputHndlr,rowDataInfo }: any) => {
    const { getThirdLanForChangeStudentResp } = rowDataInfo || {};
    const updatedResp = getThirdLanForChangeStudentResp?.data?.filter((item:any)=>+item.languageId !== +original?.secondLanguageId)
    return (
        <SelectInput
        name={`thirdLanguageId-${index}`}
        // labelText="Third Language"
        value={original.thirdLanguageId}
        onChange={(event:any)=>onChangeInputHndlr(event,"thirdLanguageId",original?.studentId)}
        menuItems={updatedResp || []}
        isDisabled={!original.isSelected}
        valueKey="languageId"
        textKey="languageName"
        formgroupClassName="mb-0"
    />
    )
  }

export function addAssignLangGenerateColumns(allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any) {
    return [
        {
            Header: () => {
              return (
                <InputCheckbox
                  name={"all-student"}
                  // labelName={shortName}
                  value={allStudentSelectedState}
                  onChange={allStudentCheckHndlr}
                  formgroupClassName="tw-mb-0"
                />
              )
            },
            accessor: "isStudentChecked",
            columnClassName: "tw-w-[5%]",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              const { studentId, isSelected } = original;
              return (
                <>
                  <InputCheckbox
                    name={`student-${studentId}`}
                    // labelName={shortName}
                    value={isSelected}
                    onChange={singleStudentCheckHndlr}
                    dataId={studentId}
                    formgroupClassName="tw-mb-0"
                  />
                </>
              )
            }
          },
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "tw-max-w-[200px]",
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                    <UserDetails
                      displayName={original?.studentName}
                      displayId={original?.studentCode}
                      showAvatar={false}
                    />
                    </>
                );
            },
        },
        {
          Header:"Roll No.",
          accessor:"rollNo",
          disableSortBy: true,
      },
        {
          Header: "Second Language",
          accessor: "secondLanguage",
          disableSortBy: true,
          Cell : SecondLanguage,
      },
        {
            Header:"Third Language",
            accessor:"thirdLanguage",
            disableSortBy: true,
            Cell : ThirdLanguage,
        },
    ];
}

export const computeSubmitButtonError = (studentList: any) => {
  let newArr :any = []
  if (studentList?.length) {
    studentList?.map((item: any) => {
      let submitErr: any = true
      if(item.isSelected){
        if (item?.secondLanguageId || item?.thirdLanguageId) {
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