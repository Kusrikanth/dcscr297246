import { useEffect, useState } from "react";
import { AutoSearchInputUpdated, DateInput, InputCheckbox, MenuOptionHrtl, ModalContainerUpdated, SearchInput, TextInput } from "../../../../Components/Common";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getLibraryBookCollectionListAct } from "../../../../store/library/bookcollection/bookcollectionaction";
import { getEmployeeByFilterAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { getStudentsListAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { removeLeadingZeros } from "../../../../utility/commonutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { bookColletionSearchInputOptions } from "../../BookCollectionUpload/helper";
import { SearchInputWithAutoSearch } from "../../../../Components/Common/SearchInputWithautoSearch";
import Button from "../../../../Components/Common/Button";
import { useModal } from "../../../../hooks/modalhook";

export const detailTypeOptions = [
  {
    name: "Student Wise details",
    id: "Student Wise details",
  },
  {
    name: "Class Wise Details",
    id: "Class Wise Details",
  }
]

const TextInputComponent = ({
  row: { original, index },
  name
}: any) => {
  return (
    <div title={original[name]}>
      <TextInput
        name={`${name}-${index}`}
        value={original[name]}
        isDisabled={true}
        onChange={undefined}
      />
    </div>
  )
}

const DateInputComponent = ({
  row: { original, index },
  name
}: any) => {
  return (
    <TextInput
      name={`${name}-${index}`}
      value={original[name]}
      isDisabled={true}
      onChange={undefined}
    />
  )
}
const IssuanceDateInputComponent = ({
  row: { original, index },
  name,
  onChangeInputHndlr,
}: any) => {
  return (
    <DateInput
      name={`${name}-${index}`}
      value={original[name]}
      onChange={(e: any) => {
        const selectedDate = e?.target?.value;
        onChangeInputHndlr(name, selectedDate, original?.matchId);
      }}
    />
  );
};

const AceessionSearchInput = ({
  row: { index, original },
  onChangeInputHndlr,
  rowDataInfo,
}: any) => {
  const [searchStudentState, setSearchStudentState] = useState<any>(null);
  const [searchType, setSearchType] = useState("global");
  const [searchString, setSearchString] = useState(""); 
  const [selectedOptionState, setSelectedOptionState] = useState<any>(undefined);
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (original) {
      setSearchStudentState(original)
    }
  }, [original])


  function onInputSearchChange(inputString: any, filterType?: string) {
    const { academicYearId, libraryId } = rowDataInfo.values;

    if (inputString && academicYearId) {
      const params = {
        branchId: rowDataInfo?.branchId,
        academicYearId,
        onlyUnissued: "TRUE",
        searchString: inputString,
        libraryId,
        sortBy: "accessionCode",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 1000,
        searchFilterType: filterType ?? searchType, 
      };

      dispatch(
        getLibraryBookCollectionListAct(
          generateActionPayload("get_library_book_collection", undefined, params)
        )
      );
    }
  }

  function onSearchHandler(name: string, value: any) {
    setSearchString(value);
    setSelectedOptionState(undefined); 
    onInputSearchChange(value, searchType);
  }

  function onChangeHandler(name: string, id: any, item: any) {
    setSearchType(id);
    setSelectedOptionState(undefined);
    setSearchString("");
    onInputSearchChange("", id);
  }

  return (
    <SearchInputWithAutoSearch
      hideDefaultSelect
      name={`${"bookId"}-${index}`}
      value = {searchType}
      menuItems = {bookColletionSearchInputOptions}
      idKey = "id"
      searchHandler={onSearchHandler}
      onChange={onChangeHandler}
      renderSelectedValue = {(item:any) => item?.name}
      renderOptions={(item:any) => item?.name}
      isDisabled={!original?.isSelected}
      labelKey="title"
      subLabelKey="accessionNumber"
      valueKey="id"
      labelHeaderName="Acc. No"
      subLabelHeaderName="Book Name"
      searchOptions={rowDataInfo?.bookList || []}
      selected={selectedOptionState}
      selectedOptionCallbck={(book: any) =>  {
        setSelectedOptionState(book);
        onChangeInputHndlr("accession", book, original?.matchId,)
      }}
    ></SearchInputWithAutoSearch>
  );
};

const EmployeeSearchInput = ({
  row: { index, original },
  onChangeInputHndlr,
  rowDataInfo,
}: any) => {
  const [searchEmployeeState, setSearchEmployeeState] = useState<any>(null);
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (original) {
      setSearchEmployeeState(original)
    }
  }, [original])

  function onInputSearchEmployeeChange(inputString: any) {
    if (inputString) {
      const params = { searchString: inputString };
      dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId: rowDataInfo?.branchId })));
    }
  }

  return (
    <AutoSearchInputUpdated
      formgroupClassName="search-box"
      name={`${"employeeId"}-${index}`}
      placeHolder="Search..."
      bodyContainer
      onChange={(string: any) => {
        if (!string) onChangeInputHndlr("employee", null, original?.matchId)
        onInputSearchEmployeeChange(string)
      }}
      valueKey="id"
      labelKey="employeeCode"
      subLabelKey="employeeName"
      labelHeader="Emp. Code"
      subLabelHeader="Employee Name"
      isDisabled={!original?.isSelected}
      options={rowDataInfo?.employeeList || []}
      selected={searchEmployeeState}
      selectedOptionCallbck={(employee: any) => onChangeInputHndlr("employee", employee, original?.matchId)}
    ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
  );
};

const RecommendedByWithButton = ({
  row: { index, original },
  onChangeInputHndlr,
  rowDataInfo
}: any) => {

  const isSpecimen = rowDataInfo?.isSpecimen;
const openModal = rowDataInfo?.openModal; 
  return (
    <>
    <div>
      <AceessionSearchInput
        row={{ index, original }}
        onChangeInputHndlr={onChangeInputHndlr}
        rowDataInfo={rowDataInfo}
      />

        {isSpecimen && (
          <Button
            onClick={() => openModal()}
            variant="linkBtn"
            className="tw-px-3 tw-mt-1"
          >
            Add book
          </Button>
        )}
    </div>
    </>
  );
};

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
    const { academicYearId, } = rowDataInfo.values || {};
    if (inputString && academicYearId) {

      const params = {
        branchId: rowDataInfo?.branchId, academicYearId,
        searchString: inputString,
      };
      dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
    }
  }

  return (
    <AutoSearchInputUpdated
      formgroupClassName="search-box"
      name="studentId"
      placeHolder="Search..."
      bodyContainer
      onChange={(string: any) => {
        if (!string) onChangeInputHndlr("student", null, original?.matchId)
        onInputSearchChange(string)
      }}
      valueKey="studentId"
      labelHeader="Stu. Code"
      labelKey="studentCode"
      subLabelHeader="Student Name"
      subLabelKey="studentName"
      options={rowDataInfo?.studentList || []}
      selected={searchStudentState}
      selectedOptionCallbck={(student: any) => onChangeInputHndlr("student", student, original?.matchId)}
    ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
  );
};

const RecommendedInput = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  return (
    <TextInput
      name={`recommendedTo-${index}`}
      placeHolder="Enter Name"
      isDisabled={!original?.isSelected}
      value={original?.recommendedTo}
      onChange={(event: any) => onChangeInputHndlr("recommendedTo", event.target.value, original?.matchId)}
    />
  )
}

export function generateColumnsUserDetails(allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any, actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            value={allStudentSelectedState}
            onChange={allStudentCheckHndlr}
            formgroupClassName="mb-0"
          />
        )
      },
      accessor: "isStudentChecked",
      columnClassName: "tw-w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { matchId, isSelected } = original;
        return (
          <>
            <InputCheckbox
              name={`student-${matchId}`}
              value={isSelected}
              onChange={singleStudentCheckHndlr}
              dataId={matchId}
              formgroupClassName="tw-mb-0"
            />
          </>
        )
      }
    },
    {
      Header: "Student",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
      Cell: StudentSearchInput
    },
    {
      Header: "Employee",
      accessor: "employeeName",
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
      Cell: EmployeeSearchInput
    },
    {
      Header: "Recommended To",
      accessor: "recommendedTo",
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
      Cell: RecommendedInput
    },
    {
      Header: "Recommended By",
      accessor: "recommendedBy",
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
      Cell: EmployeeSearchInput
    },
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
      Cell: RecommendedByWithButton
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
    // {
    //   Header: "Book Name",
    //   accessor: "bookName",
    //   disableSortBy: true,
    //   columnClassName: "tw-w-[130px] tw-min-w-[130px] tw-max-w-[130px]",
    //   // Cell: ({ row }: any) => {
    //   //   return (<TextInputComponent row={row} name="bookName" />);
    //   // },
    // },
    {
      Header: "Author Name",
      accessor: "authorName",
      disableSortBy: true,
      columnClassName: "tw-w-[130px] tw-min-w-[130px] tw-max-w-[130px]",
      // Cell: ({ row }: any) => {
      //   return (<TextInputComponent row={row} name="authorName" />);
      // },
    },
    {
      Header: "Publisher Name",
      accessor: "publisherName",
      disableSortBy: true,
      columnClassName: "tw-w-[130px] tw-min-w-[130px] tw-max-w-[130px]",
      // Cell: ({ row }: any) => {
      //   return (<TextInputComponent row={row} name="publisherName" />);
      // },
    },
    {
      Header: "Issuance Date",
      accessor: "issuanceDate",
      disableSortBy: true,
      columnClassName: "tw-w-[130px] tw-min-w-[130px] tw-max-w-[130px]",
      Cell: ({ row,onChangeInputHndlr }: any) => {
        return (<IssuanceDateInputComponent row={row} name="issuanceDate" onChangeInputHndlr={onChangeInputHndlr} />);
      },
    },
    {
      Header: "Return Date",
      accessor: "returnDate",
      disableSortBy: true,
      columnClassName: "tw-w-[130px] tw-min-w-[130px] tw-max-w-[130px]",
      Cell: ({ row }: any) => {
        return (<DateInputComponent row={row} name="returnDate" />);
      },
    },
    {
      Header: "Actions",
      accessor: "actions",
      disableSortBy: true,
      columnClassName: "tw-right-0 tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
      Cell: ({ row: { original, index } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={index} />
        );
      },
    },
  ];
}

export function renderOptionsAccessionNo(item: any) {
  return `${item?.accessionNumber}`;
}

export function renderValueAccessionNo(selectedItems: any) {
  return `${selectedItems?.accessionNumber}`;
}

export const getUserTypeId = (userType: string, response: any) => {
  const data = response?.find((item: any) => item?.userType === userType);
  return data?.id
}

export const computeSubmitButtonError = (studentList: Array<any>, userType: string) => {
  if (studentList?.length && studentList?.some((item: any) => item?.isSelected)) {
    const isValid = studentList?.some((item: any) => item?.isSelected) && studentList?.every((item: any) => {
      if (item?.isSelected) {
        if (userType === "STUDENT") {
          return item?.studentId && item?.accessionNumber;
        } else if (userType === "EMPLOYEE") {
          return item?.employeeId && item?.accessionNumber;
        } else if (userType === "RECOMMENDATION") {
          return item?.recommendedTo && item?.employeeId && item?.accessionNumber;
        }
      }
      return true;
    });
    const submitErr = !isValid;

    if (submitErr) return true
    else return false
  }
}