import { useLocation } from "react-router-dom";
import { InputCheckbox, UserDetails } from "../../../../../Components/Common";
import { SelectInput, } from "../../../../../Components/Common";

export function generateColumns(allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any, isEy: boolean, isIgcse: boolean) {
  const ConfidentField = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].workingInfoId`}
        inputClassName=""
        value={original?.workingInfoId}
        onChange={onChangeInputHndlr}
        menuItems={rowDataInfo || []}
        valueKey="id"
        textKey={isIgcse ? "overAllGrades" : "overAllGrade"}
        isDisabled={!original.isSelected}
        error={(original?.touched?.workingInfoId && original?.errors?.workingInfoId) ? original?.errors?.workingInfoId : ""}
        invalid={(original?.touched?.workingInfoId && original?.errors?.workingInfoId) ? true : false}
      />
    </div>
  );
};
const ResponsibleField = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].responsibleId`}
        inputClassName=""
        value={original?.responsibleId}
        onChange={onChangeInputHndlr}
        menuItems={rowDataInfo || []}
        valueKey="id"
        textKey={isIgcse ? "overAllGrades" : "overAllGrade"}
        isDisabled={!original.isSelected}
        error={(original?.touched?.responsibleId && original?.errors?.responsibleId) ? original?.errors?.responsibleId : ""}
        invalid={(original?.touched?.responsibleId && original?.errors?.responsibleId) ? true : false}
      />
    </div>
  );
};
const ReflectField = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].reflectiveId`}
        inputClassName=""
        value={original?.reflectiveId}
        onChange={onChangeInputHndlr}
        menuItems={rowDataInfo || []}
        valueKey="id"
        textKey={isIgcse ? "overAllGrades" : "overAllGrade"}
        isDisabled={!original.isSelected}
        error={(original?.touched?.reflectiveId && original?.errors?.reflectiveId) ? original?.errors?.reflectiveId : ""}
        invalid={(original?.touched?.reflectiveId && original?.errors?.reflectiveId) ? true : false}
      />
    </div>
  );
};
const InnovativeField = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].innovativeId`}
        inputClassName=""
        value={original?.innovativeId}
        onChange={onChangeInputHndlr}
        menuItems={rowDataInfo || []}
        valueKey="id"
        textKey={isIgcse ? "overAllGrades" : "overAllGrade"}
        isDisabled={!original.isSelected}
        error={(original?.touched?.innovativeId && original?.errors?.innovativeId) ? original?.errors?.innovativeId : ""}
        invalid={(original?.touched?.innovativeId && original?.errors?.innovativeId) ? true : false}
      />
    </div>
  );
};
const EngageField = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].engageId`}
        inputClassName=""
        value={original?.engageId}
        onChange={onChangeInputHndlr}
        menuItems={rowDataInfo || []}
        valueKey="id"
        textKey={isIgcse ? "overAllGrades" : "overAllGrade"}
        isDisabled={!original.isSelected}
        error={(original?.touched?.engageId && original?.errors?.engageId) ? original?.errors?.engageId : ""}
        invalid={(original?.touched?.engageId && original?.errors?.engageId) ? true : false}
      />
    </div>
  );
};
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
        const studentId = isIgcse
          ? original?.cambridgeLearnerDto?.studentId
          : original?.entryLearner?.studentId;

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
        const student = isIgcse
          ? original?.cambridgeLearnerDto
          : original?.entryLearner;
        const studentName = student?.studentName || "-";
        const studentCode = student?.studentCode || "-";

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
       accessor: (row: any) =>
        isIgcse
          ? row.cambridgeLearnerDto?.rollNo || "-"
          : row.entryLearner?.rollNo || "-",
      disableSortBy: true,
    },
    {
      Header: "Confident",
      accessor: "confident",
      disableSortBy: true,
      Cell: ConfidentField
    },
    {
      Header: "Responsible",
      accessor: "speakingName",
      disableSortBy: true,
      Cell: ResponsibleField
    },
    {
      Header: "Innovative",
      accessor: "readingName",
      disableSortBy: true,
      Cell: InnovativeField
    },
    {
      Header: "Reflective",
      accessor: "writingName",
      disableSortBy: true,
      Cell: ReflectField
    },
    {
      Header: "Engaged",
      accessor: "mathematicsName",
      disableSortBy: true,
      Cell: EngageField
    },
  ];
}