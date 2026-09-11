
import { useLocation } from "react-router-dom";
import { InputCheckbox, UserDetails } from "../../../../../Components/Common";
import { SelectInput, } from "../../../../../Components/Common";

const punctualityField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].punctualityId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.punctualityId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.punctualityId && original?.errors?.punctualityId) ? original?.errors?.punctualityId : ""}
        invalid={(original?.touched?.punctualityId && original?.errors?.punctualityId) ? true : false}
      />
    </div>
  );
};
const communicationField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].communicationId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.communicationId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.communicationId && original?.errors?.communicationId) ? original?.errors?.communicationId : ""}
        invalid={(original?.touched?.communicationId && original?.errors?.communicationId) ? true : false}
      />
    </div>
  );
};
const adaptabilityIdField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].adaptabilityId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.adaptabilityId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.adaptabilityId && original?.errors?.adaptabilityId) ? original?.errors?.adaptabilityId : ""}
        invalid={(original?.touched?.adaptabilityId && original?.errors?.adaptabilityId) ? true : false}
      />
    </div>
  );
};
const cheerfulField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].cheerfulId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.cheerfulId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.cheerfulId && original?.errors?.cheerfulId) ? original?.errors?.cheerfulId : ""}
        invalid={(original?.touched?.cheerfulId && original?.errors?.cheerfulId) ? true : false}
      />
    </div>
  );
};

const assignmentField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].assignmentId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.assignmentId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.assignmentId && original?.errors?.assignmentId) ? original?.errors?.assignmentId : ""}
        invalid={(original?.touched?.assignmentId && original?.errors?.assignmentId) ? true : false}
      />
    </div>
  );
};
const peTheoryField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].peTheoryId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.peTheoryId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.peTheoryId && original?.errors?.peTheoryId) ? original?.errors?.peTheoryId : ""}
        invalid={(original?.touched?.peTheoryId && original?.errors?.peTheoryId) ? true : false}
      />
    </div>
  );
};
const athleticsField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].athleticsId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.athleticsId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.athleticsId && original?.errors?.athleticsId) ? original?.errors?.athleticsId : ""}
        invalid={(original?.touched?.athleticsId && original?.errors?.athleticsId) ? true : false}
      />
    </div>
  );
};
const gieldGameField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].fieldGameId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.fieldGameId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.fieldGameId && original?.errors?.fieldGameId) ? original?.errors?.fieldGameId : ""}
        invalid={(original?.touched?.fieldGameId && original?.errors?.fieldGameId) ? true : false}
      />
    </div>
  );
};
export function generateColumns(allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any, isEy: boolean, isIgcse: boolean) {
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
        const studentId = original?.softSportSkills?.studentId;
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
        const studentName = original?.softSportSkills?.studentName || "-";
        const studentCode = original?.softSportSkills?.studentCode || "-";
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
      accessor: (row: { softSportSkills: { rollNo: any; }; }) => row.softSportSkills?.rollNo || "-",
      disableSortBy: true,
    },
    {
      Header: "Punctuality",
      accessor: "punctuality",
      disableSortBy: true,
      Cell: punctualityField
    },
    {
      Header: "Communication",
      accessor: "communication",
      disableSortBy: true,
      Cell: communicationField
    },
    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>Adaptability</span>
            <span> with Understanding</span>
          </div>
        )
      },
      accessor: "adaptability",
      disableSortBy: true,
      Cell: adaptabilityIdField
    },
    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>Cheerful with </span>
            <span>active participation</span>
            <span>in a team</span>
          </div>
        )
      },
      accessor: "cheerfulParticipation",
      disableSortBy: true,
      Cell: cheerfulField
    },

    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>On time</span>
            <span>submission</span>
            <span>of assignments</span>
          </div>
        )
      },
      accessor: "assigments",
      disableSortBy: true,
      Cell: assignmentField
    },
    // {
    //   Header: "PE-Theory",
    //   accessor: "peTheory",
    //   disableSortBy: true,
    //   Cell: peTheoryField
    // },
    // {
    //   Header: "Athletics",
    //   accessor: "athletics",
    //   disableSortBy: true,
    //   Cell: athleticsField
    // },
    // {
    //   Header: "Field Game",
    //   accessor: "fieldGame",
    //   disableSortBy: true,
    //   Cell: gieldGameField
    // },
  ];
}