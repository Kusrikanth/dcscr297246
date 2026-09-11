import { InputCheckbox, UserDetails } from "../../../../../Components/Common";
import { SelectInput, } from "../../../../../Components/Common";

const LanguageLiteracy = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {

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
}

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

const MathematicsField = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].mathematicsId`}
        inputClassName=""
        value={original?.mathematicsId}
        onChange={onChangeInputHndlr}
        menuItems={rowDataInfo?.data || []}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.mathematicsId && original?.errors?.mathematicsId) ? original?.errors?.mathematicsId : ""}
        invalid={(original?.touched?.mathematicsId && original?.errors?.mathematicsId) ? true : false}
      />
    </div>
  );
};

const UnderstandingWorldField = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].understandingWorldId`}
        inputClassName=""
        value={original?.understandingWorldId}
        onChange={onChangeInputHndlr}
        menuItems={rowDataInfo?.data || []}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.understandingWorldId && original?.errors?.understandingWorldId) ? original?.errors?.understandingWorldId : ""}
        invalid={(original?.touched?.understandingWorldId && original?.errors?.understandingWorldId) ? true : false}
      />
    </div>
  );
};

const PersonalSocialEmotionalField = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].personalSocialEmotionalId`}
        inputClassName=""
        value={original?.personalSocialEmotionalId}
        onChange={onChangeInputHndlr}
        menuItems={rowDataInfo?.data || []}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.personalSocialEmotionalId && original?.errors?.personalSocialEmotionalId) ? original?.errors?.personalSocialEmotionalId : ""}
        invalid={(original?.touched?.personalSocialEmotionalId && original?.errors?.personalSocialEmotionalId) ? true : false}
      />
    </div>
  );
};

const PhysicalDvptNameField = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].physicalDvptId`}
        inputClassName=""
        value={original?.physicalDvptId}
        onChange={onChangeInputHndlr}
        menuItems={rowDataInfo?.data || []}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original.isSelected}
        error={(original?.touched?.physicalDvptId && original?.errors?.physicalDvptId) ? original?.errors?.physicalDvptId : ""}
        invalid={(original?.touched?.physicalDvptId && original?.errors?.physicalDvptId) ? true : false}
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
      Cell: ({ row: { original } }: any) => {
        const { isSelected } = original;
        const studentId = original?.academicPerformance?.studentId;
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
        const studentName = original?.academicPerformance?.studentName || "-";
        const studentCode = original?.academicPerformance?.studentCode || "-";
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
      accessor: (row: { academicPerformance: { rollNo: any; }; }) => row.academicPerformance?.rollNo || "-",
      disableSortBy: true,
    },
    {
      Header: () => (
        <div className="d-flex flex-column">
          <span>Communication,</span>
          <span>Language & </span>
          <span>Literacy - Listening</span>
        </div>
      ),
      accessor: "listenerName",
      disableSortBy: true,
      Cell: LanguageLiteracy,
    },
    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>Communication,</span>
            <span>Language & </span>
            <span>Literacy - Speaking</span>
          </div>
        )
      },
      accessor: "speakingId",
      disableSortBy: true,
      Cell: SpeakingField,
    },
    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>Communication,</span>
            <span>Language & </span>
            <span>Literacy - Reading</span>
          </div>
        )
      },
      accessor: "readingName",
      disableSortBy: true,
      Cell: ReadingField,
    },
    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>Communication,</span>
            <span>Language & </span>
            <span>Literacy - Writing</span>
          </div>
        )
      },
      accessor: "writingName",
      disableSortBy: true,
      Cell: WritingField,
    },
    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>Understanding of</span>
            <span>the World</span>
          </div>
        )
      },
      accessor: "understandingWorld",
      disableSortBy: true,
      Cell: UnderstandingWorldField,
    },
    {
      Header: "Mathematics",
      accessor: "mathematicsName",
      disableSortBy: true,
      Cell: MathematicsField,
    },
    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>Personal, Social</span>
            <span>and Emotional</span>
            <span>Development</span>
          </div>
        )
      },
      accessor: "personalSocialEmotional",
      disableSortBy: true,
      Cell: PersonalSocialEmotionalField,
    },
    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>Physical</span>
            <span>Development</span>
          </div>
        )
      },
      accessor: "physicalDvptName",
      disableSortBy: true,
      Cell: PhysicalDvptNameField,
    },
  ];
}