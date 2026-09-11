
import { useLocation } from "react-router-dom";
import { InputCheckbox, UserDetails } from "../../../../../Components/Common";
import { SelectInput, } from "../../../../../Components/Common";

const ArtDesignField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].artAndDesignId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.artAndDesignId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.artAndDesignId && original?.errors?.artAndDesignId) ? original?.errors?.artAndDesignId : ""}
        invalid={(original?.touched?.artAndDesignId && original?.errors?.artAndDesignId) ? true : false}
      />
    </div>
  );
};
const MusicField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].musicId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.musicId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.musicId && original?.errors?.musicId) ? original?.errors?.musicId : ""}
        invalid={(original?.touched?.musicId && original?.errors?.musicId) ? true : false}
      />
    </div>
  );
};
const DanceField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].danceId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.danceId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.danceId && original?.errors?.danceId) ? original?.errors?.danceId : ""}
        invalid={(original?.touched?.danceId && original?.errors?.danceId) ? true : false}
      />
    </div>
  );
};
const DramaField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].dramaId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.dramaId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.dramaId && original?.errors?.dramaId) ? original?.errors?.dramaId : ""}
        invalid={(original?.touched?.dramaId && original?.errors?.dramaId) ? true : false}
      />
    </div>
  );
};

const LifeSkillField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].valuesAndLifeSkillsId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.valuesAndLifeSkillsId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.valuesAndLifeSkillsId && original?.errors?.valuesAndLifeSkillsId) ? original?.errors?.valuesAndLifeSkillsId : ""}
        invalid={(original?.touched?.valuesAndLifeSkillsId && original?.errors?.valuesAndLifeSkillsId) ? true : false}
      />
    </div>
  );
};
const CraftField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].craftModelAndMakingId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.craftModelAndMakingId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.craftModelAndMakingId && original?.errors?.craftModelAndMakingId) ? original?.errors?.craftModelAndMakingId : ""}
        invalid={(original?.touched?.craftModelAndMakingId && original?.errors?.craftModelAndMakingId) ? true : false}
      />
    </div>
  );
};
const YogaField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].yogaFormsId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.yogaFormsId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.yogaFormsId && original?.errors?.yogaFormsId) ? original?.errors?.yogaFormsId : ""}
        invalid={(original?.touched?.yogaFormsId && original?.errors?.yogaFormsId) ? true : false}
      />
    </div>
  );
};
const CelebrationField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].celebrationId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.celebrationId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.celebrationId && original?.errors?.celebrationId) ? original?.errors?.celebrationId : ""}
        invalid={(original?.touched?.celebrationId && original?.errors?.celebrationId) ? true : false}
      />
    </div>
  );
};
const OracyField = ({ row: { index, original }, onBlurTableHndlr, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].oracyId`}
        inputClassName=""
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        value={original?.oracyId}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.oracyId && original?.errors?.oracyId) ? original?.errors?.oracyId : ""}
        invalid={(original?.touched?.oracyId && original?.errors?.oracyId) ? true : false}
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
        const studentId = original?.creativeExpressions?.studentId;
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
        const studentName = original?.creativeExpressions?.studentName || "-";
        const studentCode = original?.creativeExpressions?.studentCode || "-";
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
      accessor: (row: { creativeExpressions: { rollNo: any; }; }) => row.creativeExpressions?.rollNo || "-",
      disableSortBy: true,
    },
    ...(isIgcse
      ? [
        {
          Header: "Values & Life Skills",
          accessor: "lifeSkillName",
          disableSortBy: true,
          Cell: LifeSkillField,
        }
      ]
      : []),
    {
      Header: "Art & Design",
      accessor: "artDesign",
      disableSortBy: true,
      Cell: ArtDesignField
    },
    // ...(isIgcse
    //   ? [
    //     {
    //       Header: "Craft Model & Making",
    //       accessor: "craftName",
    //       disableSortBy: true,
    //       Cell: CraftField,
    //     }
    //   ]
    //   : []),
    {
      Header: "Music",
      accessor: "musicName",
      disableSortBy: true,
      Cell: MusicField
    },
    {
      Header: "Dance",
      accessor: "danceName",
      disableSortBy: true,
      Cell: DanceField
    },

    ...(isIgcse
      ? [
        {
          Header: "Telugu",
          accessor: "yogaName",
          disableSortBy: true,
          Cell: YogaField,
        }
      ]
      : []),
    ...(isIgcse
      ? [
        {
          Header: "Events & Celebrations",
          accessor: "celebrationName",
          disableSortBy: true,
          Cell: CelebrationField,
        }
      ]
      : []),
    ...(isIgcse
      ? [
        // {
        //   Header: "Oracy",
        //   accessor: "oracyName",
        //   disableSortBy: true,
        //   Cell: OracyField,
        // }
      ]
      : []),
    ...(isEy
      ? [
        {
          Header: "Drama",
          accessor: "dramaName",
          disableSortBy: true,
          Cell: DramaField,
        }
      ]
      : []),
  ];
}