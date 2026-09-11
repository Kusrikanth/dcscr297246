import { InputCheckbox, UserDetails } from "../../../../../Components/Common";
import { SelectInput, } from "../../../../../Components/Common";
const ListiningField = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {
  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].listeningId`}
        inputClassName=""
        value={original?.listeningId}
        onChange={onChangeInputHndlr}
        menuItems={rowDataInfo?.data || []}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.listeningId && original?.errors?.listeningId) ? original?.errors?.listeningId : ""}
        invalid={(original?.touched?.listeningId && original?.errors?.listeningId) ? true : false}
      />
    </div>
  );
};
const SpeakingField = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {
  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].speakingId`}
        inputClassName=""
        value={original?.speakingId}
        onChange={onChangeInputHndlr}
        menuItems={rowDataInfo?.data || []}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.speakingId && original?.errors?.speakingId) ? original?.errors?.speakingId : ""}
        invalid={(original?.touched?.speakingId && original?.errors?.speakingId) ? true : false}
      />
    </div>
  );
};
const WritingField = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {
  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].writingId`}
        inputClassName=""
        value={original?.writingId}
        onChange={onChangeInputHndlr}
        menuItems={rowDataInfo?.data || []}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.writingId && original?.errors?.writingId) ? original?.errors?.writingId : ""}
        invalid={(original?.touched?.writingId && original?.errors?.writingId) ? true : false}
      />
    </div>
  );
};
const ReadingField = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {
  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].readingId`}
        inputClassName=""
        value={original?.readingId}
        onChange={onChangeInputHndlr}
        menuItems={rowDataInfo?.data || []}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.readingId && original?.errors?.readingId) ? original?.errors?.readingId : ""}
        invalid={(original?.touched?.readingId && original?.errors?.readingId) ? true : false}
      />
    </div>
  );
};
export function generateColumns(allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any,) {
  return [
    {
      Header: () => (
        <InputCheckbox
          name={"all-student"}
          value={allStudentSelectedState}
          onChange={allStudentCheckHndlr}
          formgroupClassName="mb-0"
        />
      ),
      accessor: "id",
      columnClassName: "w-5 sticky-left z-index-1",
      disableSortBy: true,
      Cell: ({ row: { original, index } }: any) => {
        const { isSelected } = original;
        const studentId = original?.iiLang?.studentId;
        return (
          <InputCheckbox
            name={`student-${studentId}`}
            value={isSelected}
            onChange={singleStudentCheckHndlr}
            dataId={studentId}
            formgroupClassName="mb-0"
          />
        );
      },
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "sticky-left-checkbox  min-w-300px w-300px max-w-300px z-index-1",
      Cell: ({ row: { original } }: any) => {
        const studentName = original?.iiLang?.studentName || "-";
        const studentCode = original?.iiLang?.studentCode || "-";
        return (
          <UserDetails
            displayName={studentName}
            displayId={studentCode}
            imageUrl={original?.studentImageBase64}
            size={"xs"}
            defaultImgType="student"
          />
        );
      },
    },
    {
      Header: "Roll No.",
      accessor: (row: { iiLang: { rollNo: any; }; }) => row.iiLang?.rollNo || "-",
      disableSortBy: true,
    },
    {
      Header: "Listening",
      accessor: "listeningId",
      disableSortBy: true,
      Cell: ListiningField
    },
    {
      Header: "Speaking",
      accessor: "speakingName",
      disableSortBy: true,
      Cell: SpeakingField
    },
    {
      Header: "Reading",
      accessor: "readingName",
      disableSortBy: true,
      Cell: ReadingField
    },
    {
      Header: "Writing",
      accessor: "writingName",
      disableSortBy: true,
      Cell: WritingField
    },
  ];
}