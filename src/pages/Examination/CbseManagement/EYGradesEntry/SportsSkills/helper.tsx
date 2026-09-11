
import { useLocation } from "react-router-dom";
import { InputCheckbox, UserDetails } from "../../../../../Components/Common";
import { SelectInput, } from "../../../../../Components/Common";

const basketBallField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].basketballId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.basketballId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.basketballId && original?.errors?.basketballId) ? original?.errors?.basketballId : ""}
        invalid={(original?.touched?.basketballId && original?.errors?.basketballId) ? true : false}
      />
    </div>
  );
};
const footBallField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].footballId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.footballId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.footballId && original?.errors?.footballId) ? original?.errors?.footballId : ""}
        invalid={(original?.touched?.footballId && original?.errors?.footballId) ? true : false}
      />
    </div>
  );
};
const rifleShootingField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].rifleShootingId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.rifleShootingId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.rifleShootingId && original?.errors?.rifleShootingId) ? original?.errors?.rifleShootingId : ""}
        invalid={(original?.touched?.rifleShootingId && original?.errors?.rifleShootingId) ? true : false}
      />
    </div>
  );
};
const lawnTennisField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].lawnTennisId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.lawnTennisId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.lawnTennisId && original?.errors?.lawnTennisId) ? original?.errors?.lawnTennisId : ""}
        invalid={(original?.touched?.lawnTennisId && original?.errors?.lawnTennisId) ? true : false}
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
const cricketField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].cricketId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.cricketId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.cricketId && original?.errors?.cricketId) ? original?.errors?.cricketId : ""}
        invalid={(original?.touched?.cricketId && original?.errors?.cricketId) ? true : false}
      />
    </div>
  );
};
const taekwondoField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].taekwondoId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.taekwondoId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.taekwondoId && original?.errors?.taekwondoId) ? original?.errors?.taekwondoId : ""}
        invalid={(original?.touched?.taekwondoId && original?.errors?.taekwondoId) ? true : false}
      />
    </div>
  );
};

const volleyBallField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].volleyballId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.volleyballId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.volleyballId && original?.errors?.volleyballId) ? original?.errors?.volleyballId : ""}
        invalid={(original?.touched?.volleyballId && original?.errors?.volleyballId) ? true : false}
      />
    </div>
  );
};
const skatingField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].skatingId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.skatingId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.skatingId && original?.errors?.skatingId) ? original?.errors?.skatingId : ""}
        invalid={(original?.touched?.skatingId && original?.errors?.skatingId) ? true : false}
      />
    </div>
  );
};
const PePracticalField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].pePracticalId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.pePracticalId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.pePracticalId && original?.errors?.pePracticalId) ? original?.errors?.pePracticalId : ""}
        invalid={(original?.touched?.pePracticalId && original?.errors?.pePracticalId) ? true : false}
      />
    </div>
  );
};
const SwimmingField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].swimmingId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.swimmingId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.swimmingId && original?.errors?.swimmingId) ? original?.errors?.swimmingId : ""}
        invalid={(original?.touched?.swimmingId && original?.errors?.swimmingId) ? true : false}
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
      Header: "Basket Ball",
      accessor: "punctuality",
      disableSortBy: true,
      Cell: basketBallField
    },
    {
      Header: "Foot Ball",
      accessor: "communication",
      disableSortBy: true,
      Cell: footBallField
    },
    {
      Header: "Cricket",
      accessor: "cricket",
      disableSortBy: true,
      Cell: cricketField
    },
    {
      Header: "Taekwondo",
      accessor: "taekwondo",
      disableSortBy: true,
      Cell: taekwondoField
    },

    {
      Header: "Volley Ball",
      accessor: "volleyBall",
      disableSortBy: true,
      Cell: volleyBallField
    },
    {
      Header: "Swimming",
      accessor: "swimming",
      disableSortBy: true,
      Cell: SwimmingField
    },
    {
      Header: "Skating",
      accessor: "skating",
      disableSortBy: true,
      Cell: skatingField
    },
    // {
    //   Header: "PE-Practical",
    //   accessor: "pePractical",
    //   disableSortBy: true,
    //   Cell: PePracticalField
    // },
    {
      Header: "Athletics",
      accessor: "athletics",
      disableSortBy: true,
      Cell: athleticsField
    },
    {
      Header: "Lawn Tennis",
      accessor: "lawnTennis",
      disableSortBy: true,
      Cell: lawnTennisField
    },
    {
      Header: "Rifle Shooting",
      accessor: "rifelShooting",
      disableSortBy: true,
      Cell: rifleShootingField
    },
  ];
}