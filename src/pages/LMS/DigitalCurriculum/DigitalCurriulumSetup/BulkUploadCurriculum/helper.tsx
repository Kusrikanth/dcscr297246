import { SelectInput } from "../../../../../Components/Common";

export function generateColumns() {
  return [
    {
      Header: "Unit No",
      accessor: "unitNo",
      disableSortBy: true,
    },
    {
      Header: "Unit Name",
      accessor: "unitName",
      disableSortBy: true,
    },
    {
      Header: "Chapter No",
      accessor: "chapterNo",
      disableSortBy: true,
    },
    {
      Header: "Topic No",
      accessor: "topicNo",
      disableSortBy: true,
    },
    {
      Header: "Session No",
      accessor: "sessionNo",
      disableSortBy: true,
    },
    {
      Header: "Lo Codes",
      accessor: "loCodes",
      disableSortBy: true,
    },
    {
      Header: "Week",
      accessor: "week",
      disableSortBy: true,
    },
  ];
}

export const tableData = [
  {
    unitNo: 1,
    unitName: "Number Systems",
    chapterNo: "1.1",
    topicNo: "1.1.1",
    sessionNo: "1.1.1.1",
    loCodes: "LO-MATH-101;LO-MATH-102",
    week: "W1",
  },
  {
    unitNo: 2,
    unitName: "Algebra",
    chapterNo: "2.1",
    topicNo: "2.1.1",
    sessionNo: "2.1.1.1",
    loCodes: "LO-MATH-201;LO-MATH-202",
    week: "W2",
  },
  {
    unitNo: 3,
    unitName: "Geometry",
    chapterNo: "3.1",
    topicNo: "3.1.1",
    sessionNo: "3.1.1.1",
    loCodes: "LO-MATH-301",
    week: "W3",
  },
  {
    unitNo: 4,
    unitName: "Trigonometry",
    chapterNo: "4.1",
    topicNo: "4.1.1",
    sessionNo: "4.1.1.1",
    loCodes: "LO-MATH-401;LO-MATH-402",
    week: "W4",
  },
];

const AttributeSelectInput = () => {
  return (
    <SelectInput
      name="selectInput"
      menuItems={[]}
      value={""}
      onChange={() => {}}
      valueKey=""
      textKey=""
    ></SelectInput>
  );
};

export function generateColumnsModalColumns() {
  return [
    {
      Header: "File Header",
      accessor: "fileHeader",
      disableSortBy: true,
      columnClassName: "w-300px min-w-300px max-w-300px",
    },
    {
      Header: "Attributes",
      accessor: "attributes",
      disableSortBy: true,
      columnClassName: "w-300px min-w-300px max-w-300px",
      Cell: AttributeSelectInput,
    },
  ];
}

export const modalTableData = [
  {
    fileHeader: "Unit Nmae",
    attributes: "",
    attributesValues: "Ramesh, Sunil, Anil",
  },
  {
    fileHeader: "Chapter Name",
    attributes: "",
    attributesValues: "1217812, 1217813, 1217814",
  },
  {
    fileHeader: "Topic Name",
    attributes: "",
    attributesValues: "78, 72, 90",
  },
];
