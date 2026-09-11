import { useEffect, useState } from "react";
import { AutoSearchInputUpdated, InputCheckbox } from "../../../../../Components/Common";
import { useAppDispatch } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getStuListForAllocateBedAct } from "../../../../../store/hostel/hostelrequest/hostelrequestactions";

const StudentSearchInput = ({
    row: { index, original },
    onChangeInputHndlr,
    rowDataInfo,
  }: any) => {
    const [searchStudentState, setSearchStudentState] = useState<any>(null);
    const dispatch = useAppDispatch()
  
    useEffect(() => {
      if (original) {
        setSearchStudentState(original)
      }
    }, [original])
  
    function onInputSearchChange(inputString: any) {
      const { academicYearId } = rowDataInfo || {};
      if (inputString && academicYearId) {
  
          const params = {
              branchId : rowDataInfo?.branchId, academicYearId,
              searchString: inputString,
          };
          dispatch(getStuListForAllocateBedAct(generateActionPayload("get_stu_list_for_allocate_bed", undefined, params)));
      }
  }
  
    return (
      <AutoSearchInputUpdated
        formgroupClassName="search-box"
        name="studentId"
        placeHolder="Search..."
        onChange={(string: any) => {
          if (!string) onChangeInputHndlr("student", null, original?.bedId)
          onInputSearchChange(string)
        }}
        valueKey="studentId"
        labelHeader="Stu. Code"
        labelKey="studentCode"
        subLabelHeader="Student Name"
        subLabelKey="studentName"
        isDisabled={!original?.isSelected}
        options={rowDataInfo?.studentList || []}
        selected={searchStudentState}
        selectedOptionCallbck={(student:any)=>onChangeInputHndlr("student", student, original?.bedId)}
      ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
    );
  };

export function generateColumnsUserDetails(allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any,) {
    return [
      {
        Header: () => {
          return (
            <InputCheckbox
              name={"all-student"}
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
          const { bedId, isSelected } = original;
          return (
            <>
              <InputCheckbox
                name={`student-${bedId}`}
                value={isSelected}
                onChange={singleStudentCheckHndlr}
                dataId={bedId}
                formgroupClassName="tw-mb-0"
              />
            </>
          )
        }
      },
      {
        Header: "Bed No.",
        accessor: "bedName",
        disableSortBy: true,
      },
      {
        Header: "Student",
        accessor: "studentName",
        disableSortBy: true,
        columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
        Cell: StudentSearchInput
      },
      {
        Header: "Curriculum",
        accessor: "curriculumName",
        disableSortBy: true,
      },
      {
        Header: "Class",
        accessor: "className",
        disableSortBy: true,
      },
      {
        Header: "Section",
        accessor: "sectionName",
        disableSortBy: true,
      },

    ];
  }

  export const computeSubmitButtonError = (studentList: Array<any>) => {
    if (studentList?.length && studentList?.some((item: any) => item?.isSelected)) {
      const isValid = studentList?.some((item: any) => item?.isSelected) && studentList?.every((item: any) => {
        if (item?.isSelected) {
          return item?.studentId
        }
        return true;
      });
      const submitErr = !isValid;
  
      if (submitErr) return true
      else return false
    }
  }