
import { SelectInput, StatusLabel, TextInput, TextInputGroup, UserDetails } from "../../../Components/Common";
import { SpecimenBookReturnsDataTypes, EmployeeDataTypes, StudentDataTypes } from "./SpecimenBookReturnsTypes";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { useState } from "react";
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";

export const selectData1 = [

  {
    libraryType: "Junior Library",
  },
  {
    libraryType: "Sr. Secondary Library",
  },
  {
    libraryType: "Secondary Library",
  },
];
export const selectData2 = [

  {
    yearType: "2023 - 2024",
  },
  {
    yearType: "2022 - 2023",
  },
  {
    yearType: "2021 - 2021",
  },
];
export const selectData3 = [

  {
    selectionType: "Accession No Wise",
  },
  {
    selectionType: "Employee Wise",
  },
];
export const selectData4 = [

  {
    conditionType: "Good",
  },
  {
    conditionType: "Spoil",
  },
  {
    conditionType: "Usuable",
  },
];
export const selectData5 = [

  {
    roomType: "Room 1",
  },
  {
    roomType: "Room 2",
  },
  {
    roomType: "Room 3",
  },
];
export const selectData6 = [

  {
    rackType: "Rack 1",
  },
  {
    rackType: "Rack 2",
  },
  {
    rackType: "Rack 3",
  },
];
export const selectData7 = [

  {
    shelfType: "Shelf 1",
  },
  {
    shelfType: "Shelf 2",
  },
  {
    shelfType: "Shelf 3",
  },
];
export const selectData9 = [

  {
    employeeCategoryType: "Teacher",
  },
  {
    employeeCategoryType: "Staff",
  },
  {
    employeeCategoryType: "HOD",
  },
];

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [

    {
      Header: "Library",
      accessor: "library",
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
              displayId={original?.studentCode}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true,
    },
    {
      Header: "Title",
      accessor: "title",
      disableSortBy: true,
    },
    {
      Header: "Issuance Date",
      accessor: "issuanceDate",
      disableSortBy: true,
    },
    {
      Header: "Return Date",
      accessor: "returnDate",
      disableSortBy: true,
    },
    {
      Header: "Late Return Date",
      accessor: "lateReturnDate",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
        );
      },
    },
  ];
}
export const SpecimenBookReturnsTableData: Array<SpecimenBookReturnsDataTypes> =
  [
    {
      id: 1,
      library: "Junior Library",
      studentName: "Lingam Prkruth",
      studentCode: "124000012",
      title: "Lata Mangeshkar",
      accessionNumber: "3466",
      issuanceDate: "26-04-2024",
      returnDate: "26-04-2024",
      latereturnDate: "26-05-2024",
    },
    {
      id: 2,
      library: "Sr. Secondary Library",
      studentName: "Lingam Prkruth",
      studentCode: "124000012",
      title: "Lata Mangeshkar",
      accessionNumber: "3466",
      issuanceDate: "26-04-2024",
      returnDate: "26-04-2024",
      latereturnDate: "26-05-2024",
    },
    {
      id: 3,
      library: "Secondary Library",
      studentName: "Lingam Prkruth",
      studentCode: "124000012",
      title: "Lata Mangeshkar",
      accessionNumber: "3466",
      issuanceDate: "26-04-2024",
      returnDate: "26-04-2024",
      latereturnDate: "26-05-2024",
    },
    {
      id: 4,
      library: "Pre Primary Library",
      studentName: "Lingam Prkruth",
      studentCode: "124000012",
      title: "Lata Mangeshkar",
      accessionNumber: "3466",
      issuanceDate: "26-04-2024",
      returnDate: "26-04-2024",
      latereturnDate: "26-05-2024",
    },
  ];
const BookReturnInput = ({ }) => {
  const [search, setSearch] = useState("");


  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearch(event.target.value);
  };

  return (
    <div className="tw-mb-0 tw-flex tw-items-center" style={{ width: "100px" }}>
      <TextInput
        value={search}
        onChange={handleChange}
        name="BookReturn"
      />
    </div>
  );
};
const BookCostInput = ({ }) => {
  const [search, setSearch] = useState("");


  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearch(event.target.value);
  };

  return (
    <div className="tw-mb-0 tw-flex tw-items-center" style={{ width: "100px" }}>

      <TextInputGroup
        name="price"
        formgroupClassName="tw-mb-0"
        inputgroupClassName="input-group-sm"
        inputClassName="form-control-sm"
        allowedInputRegex="^[0-9]+\.?[0-9]*$"
        inputGroupStart={true} value={search}
        onChange={handleChange}
      >
        <RupeeSvg width="11px" height="11px" fill={"#495057"} />
      </TextInputGroup>
    </div>
  );
};
const BookReturnDisabledInput = ({ }) => {
  const [search, setSearch] = useState("");
  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearch(event.target.value);
  };
  return (
    <div className="tw-mb-0 tw-flex tw-items-center" style={{ width: "100px" }}>
      <TextInput
        value={search}
        onChange={handleChange}
        name="BookReturnDisabled"
        isDisabled
      />
    </div>
  );
};
const BookConditionInput = ({ row: { index, original }, onChangeInputHndlr }: any) => {
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoute(event.target.value);
    onChangeInputHndlr(original?.id, event.target.value, "secondLanguage");
  };
  return (
    <SelectInput
      name="Book Condition"
      menuItems={[
        { value: "Good", label: "Good" },
        { value: "Spoil", label: "Spoil" },
        { value: "Usable", label: "Usable" },
      ]}
      value={selectedRoute}
      onChange={handleChange}
      valueKey="value"
      textKey="label"
      formgroupClassName="tw-mb-0"
    />
  )
}
export function EmployeeDataTableDetails() {
  return [
    {
      Header: "Employee",
      accessor: "employeeName",
      disableSortBy: true,
      columnClassName: "tw-w-full",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.employeeName}
              displayId={original?.employeeCode}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Book Title",
      accessor: "bookTitle",
      disableSortBy: true,
    },
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="text-info cursor-pointer">
              {original?.accessionNumber}
            </div>
          </>
        );
      },
    },
    {
      Header: "Issuance Date",
      accessor: "issuanceDate",
      disableSortBy: true,
      Cell: BookReturnDisabledInput
    },
    {
      Header: "Return Date",
      accessor: "returnDate",
      disableSortBy: true,
      columnClassName: "tw-w-72",
      Cell: BookReturnDisabledInput
    },
    {
      Header: "Current Date",
      accessor: "currentDate",
      disableSortBy: true,
      columnClassName: "tw-w-72",
      Cell: BookReturnInput
    },
    {
      Header: "No of Late dates",
      accessor: "lateDatesNo",
      disableSortBy: true,
      columnClassName: "tw-w-72",
      Cell: BookReturnDisabledInput
    },
    {
      Header: "Book Condition",
      accessor: "bookCondition",
      disableSortBy: true,
      columnClassName: "tw-w-72",
      Cell: BookConditionInput
    },
    {
      Header: "Fine",
      accessor: "fine",
      disableSortBy: true,
      columnClassName: "tw-w-72",
      Cell: BookCostInput
    },
    {
      Header: "Book Cost",
      accessor: "bookCost",
      disableSortBy: true,
      columnClassName: "tw-w-72",
      Cell: BookCostInput
    },
    {
      Header: "Total Amount",
      accessor: "totalAmount",
      disableSortBy: true,
      columnClassName: "tw-w-72",
      Cell: BookCostInput
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy: true,
      columnClassName: "tw-w-72",
      Cell: BookReturnInput
    },
    {
      Header: "",
      accessor: "save",
      disableSortBy: true,

      Cell: ({ row: { original } }: any) => {
        return (
          <button className="btn btn-outline-primary btn-sm btn-icon "><i className="ri-check-line fs-24" /></button>
        );
      },

    },
  ];
}
export const EmployeeDataTableData: Array<EmployeeDataTypes> = [
  {
    id: 1,
    employeeName: "Lingam Prkruth",
    employeeCode: "124000012",
    bookTitle: "Lata Mangeshkar",
    accessionNumber: "25215",
  },
  {
    id: 2,
    employeeName: "Lingam Prkruth",
    employeeCode: "124000012",
    bookTitle: "Lata Mangeshkar",
    accessionNumber: "25256",
  },
  {
    id: 3,
    employeeName: "Lingam Prkruth",
    employeeCode: "124000012",
    bookTitle: "Lata Mangeshkar",
    accessionNumber: "25298",
  },
];