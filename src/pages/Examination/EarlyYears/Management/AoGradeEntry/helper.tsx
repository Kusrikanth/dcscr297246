import { useState } from "react";
import { InputCheckbox, SelectInput, TextArea, UserDetails } from "../../../../../Components/Common";

export const subjectType = [
  {
    id: 'COSCHOLASTIC',
    name: 'Co-Scholastic',
  },
];

export const scholasticSubjects = [
  {
    id: 'CORE',
    name: 'Core',
  },
  {
    id: 'LANGUAGE',
    name: 'Language',
  },
];
export const coScholasticSubjects = [
  {
    id: 'AREA',
    name: 'Area',
  },
  {
    id: 'ACTIVITY',
    name: 'Activity',
  },
];
export const btnOptions = [
  {
    id: "GREEN",
    name : "Green",
    btnColor: "success",
  },
  {
    id: "AMBER",
    name : "Amber",
    btnColor: "warning",
  },
  {
    id: "RED",
    name : "Red",
    btnColor: "danger",
  }
]

const RadioInput = ({ row: { original, index: rowIndex }, onChangeInputHndlr, column }: any) => {
  const { sub } = column || {};
  const findObj = original?.aosGradingDtos?.find((obj: any) => +obj.aoSubjectDetailsId === +sub?.aoSubjectDetailsId);
  return (
    <div className='row '>
      <div className="d-flex gap-2 justify-content-center">
        {btnOptions.map((item,index) => (
          <button key={`${item.id}-${index}-${sub?.aoSubjectDetailsId}`} style={{height: "25px", width: "25px"}} disabled={!original?.isSelected} onClick={(() => onChangeInputHndlr("grade", item.id, original?.studentId, sub))} className={`btn ${findObj?.grade === item.id ? `btn-${item.btnColor}` : `btn-outline-${item.btnColor}`} btn-sm btn-icon rounded-circle mx-1`}></button>
        ))}
      </div>
    </div>
  )
}


const CommentsInput = ({ row: { original, index }, onChangeInputHndlr }: any) => {
  return (
    <TextArea
      name={`[${index}].comments`}
      value={original.comments}
      onChange={(event: any) => onChangeInputHndlr("comments", event.target.value, original?.studentId)}
      height='20px'
      isDisabled={!original.isSelected}
      formgroupClassName="mb-0"
    />
  )
}

const AreaOfStrengthInput = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {

  const dataArray = rowDataInfo?.data || [];
  const menuItems = dataArray.flatMap((item: any) =>
    item.areaOfStrengthDescription?.map((description: string, idx: number) => ({
      id: `${item.subjectId}_${idx}`,
      areaOfStrengthDescription: description
    })) || []
  );

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`${index}.areaOfStrength`}
        inputClassName=""
        value={original.areaOfStrength}
        onChange={(event: any) => onChangeInputHndlr("areaOfStrength", event.target.value, original?.studentId)}
        menuItems={menuItems}
        valueKey="areaOfStrengthDescription"
        textKey="areaOfStrengthDescription"
        isDisabled={!original.isSelected}
        error={
          original?.touched?.areaOfStrength && original?.errors?.areaOfStrength
            ? original?.errors?.areaOfStrength
            : ""
        }
        invalid={
          original?.touched?.areaOfStrength && original?.errors?.areaOfStrength
            ? true
            : false
        }
      />
    </div>
  );
};

const AreaOfStrengthEditInput = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurInputHndlr
}: any) => {
  const [isEditable, setIsEditable] = useState(false);

  const editRemarksText = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsEditable(!isEditable);
  };

  const handleTextChange = (event: any) => {
    onChangeInputHndlr("areaOfStrength", event.target.value, original?.studentId);
  };

  const handleBlur = (event: any) => {
    if (onBlurInputHndlr) {
      onBlurInputHndlr("areaOfStrength", event.target.value, original?.studentId);
    }
  };

  return (
    <div style={{ minWidth: "20rem", display: "flex", alignItems: "center" }}>
      <TextArea
        name={`${index}.areaOfStrength`}
        inputClassName="h-100 w-100"
        formgroupClassName="w-75"
        maxLength={500}
        value={original.areaOfStrength || ""}
        onChange={handleTextChange}
        onBlur={handleBlur}
        isDisabled={!original.isSelected || !isEditable}
      />
      <button
        onClick={editRemarksText}
        className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white ms-3 ps-1"
        title={isEditable ? "Lock editing" : "Enable editing"}
      >
        <i className={`text-primary ${isEditable ? 'ri-lock-fill' : 'ri-pencil-fill'} fs-16`}></i>
      </button>
    </div>
  );
};

const AreaOfFocusInput = ({ row: { index, original }, onChangeInputHndlr, rowDataInfo }: any) => {
  const dataArray = rowDataInfo?.data || [];
  const menuItems = dataArray.flatMap((item: any) =>
    item.areaOfFocusDescription?.map((description: string, idx: number) => ({
      id: `${item.subjectId}_${idx}`,
      areaOfFocusDescription: description
    })) || []
  );

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`${index}.areaOfFocus`}
        inputClassName=""
        value={original.areaOfFocus}
        onChange={(event: any) => onChangeInputHndlr("areaOfFocus", event.target.value, original?.studentId)}
        menuItems={menuItems}
        valueKey="areaOfFocusDescription"
        textKey="areaOfFocusDescription"
        isDisabled={!original.isSelected}
        error={
          original?.touched?.areaOfFocus && original?.errors?.areaOfFocus
            ? original?.errors?.areaOfFocus
            : ""
        }
        invalid={
          original?.touched?.areaOfFocus && original?.errors?.areaOfFocus
            ? true
            : false
        }
      />
    </div>
  );
};

const AreaOfFocusEditInput = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurInputHndlr
}: any) => {
  const [isEditable, setIsEditable] = useState(false);

  const editRemarksText = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsEditable(!isEditable);
  };

  const handleTextChange = (event: any) => {
    onChangeInputHndlr("areaOfFocus", event.target.value, original?.studentId);
  };

  const handleBlur = (event: any) => {
    if (onBlurInputHndlr) {
      onBlurInputHndlr("areaOfFocus", event.target.value, original?.studentId);
    }
  };

  return (
    <div style={{ minWidth: "20rem", display: "flex", alignItems: "center" }}>
      <TextArea
        name={`${index}.areaOfFocus`}
        inputClassName="h-100 w-100"
        formgroupClassName="w-75"
        maxLength={500}
        value={original.areaOfFocus || ""}
        onChange={handleTextChange}
        onBlur={handleBlur}
        isDisabled={!original.isSelected || !isEditable}
      />
      <button
        onClick={editRemarksText}
        className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white ms-3 ps-1"
        title={isEditable ? "Lock editing" : "Enable editing"}
      >
        <i className={`text-primary ${isEditable ? 'ri-lock-fill' : 'ri-pencil-fill'} fs-16`}></i>
      </button>
    </div>
  );
};

const generateDynamicColumns = (aoTermSubjectsResp: any) =>
  (Array.isArray(aoTermSubjectsResp) && aoTermSubjectsResp.length > 0)
    ? aoTermSubjectsResp?.map((sub: any, index: any) => ({
      Header: (
        <div title={sub?.aosDetails} className="text-truncate-three-lines text-center">
          {sub?.aosDetails}
        </div>
      ),
      accessor: `${sub?.aosDetails?.toLowerCase()?.split(' ')?.join('')}-${index}`,
      disableSortBy: true,
      sub: sub,
      columnClassName: 'w-180px min-w-180px vertical-align-middle',
      Cell: RadioInput
    }))
    : [];

export function generateColumns(allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any, aoTermSubjectsResp: any, isEy: boolean, isIgcse: boolean) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            // labelName={shortName}
            value={allStudentSelectedState}
            onChange={allStudentCheckHndlr}
            formgroupClassName="mb-0"
          />
        )
      },
      accessor: "id",
      columnClassName: "w-5 sticky-left z-index-1",
      disableSortBy: true,
      rowSpan: 2,
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "isStudentChecked",
          columnClassName: "sticky-left w-5 z-index-1",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            const { studentId, isSelected } = original;
            return (
              <>
                <InputCheckbox
                  name={`student-${studentId}`}
                  // labelName={shortName}
                  value={isSelected}
                  onChange={singleStudentCheckHndlr}
                  dataId={studentId}
                  formgroupClassName="mb-0"
                />
              </>
            )
          },
          Footer: "",
          footerClassName: "text-white fw-bold",
        },
      ],
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "sticky-left-checkbox  min-w-200px w-200px max-w-200px z-index-1",
      columns: [
        {
          Header: "Student Name",
          displayNone: true,
          accessor: "studentName",
          columnClassName: "sticky-left-checkbox min-w-200px w-200px max-w-200px z-index-1",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            return (
              <>
                <UserDetails
                  showAvatar
                  imageUrl={original.studentImageBase64}
                  displayName={original.studentName}
                  displayId={original.studentCode}
                  size="xs"
                />
              </>
            );
          },
          Footer: "",
          footerClassName: "text-white fw-bold",
        },
      ],
      rowSpan: 2,
    },
    {
      Header: "AO Objectives",
      accessor: "workExperiense",
      disableSortBy: true,
      columnClassName: "text-center",
      columns: [...generateDynamicColumns(aoTermSubjectsResp)]
    },
    ...(isEy
      ? [
       {
      Header: "Area of Strength",
      accessor: "areaOfStrength",
      disableSortBy: true,
      columnClassName: "text-center min-w-500px w-500px max-w-500px",

      rowSpan: 2,
      columns: [
        {
          Header: "Area of Strength",
          displayNone: true,
          accessor: "areaOfStrength",
          columnClassName: "text-center min-w-250px w-250px max-w-250px",
          disableSortBy: true,
          Cell: AreaOfStrengthInput,
          Footer: "",
          footerClassName: "text-white fw-bold",
        },
        {
          Header: "Area of Strength",
          displayNone: true,
          accessor: "areaOfStrengthEdit",
          columnClassName: "text-center min-w-300px w-300px max-w-300px",
          disableSortBy: true,
          Cell: AreaOfStrengthEditInput,
          Footer: "",
          footerClassName: "text-white fw-bold",
        },
      ],
    },
        {
          Header: "Area of Focus",
          accessor: "areaOfFocus",
          disableSortBy: true,
          columnClassName: "text-center min-w-500px w-500px max-w-500px",

          rowSpan: 2,
          columns: [
            {
              Header: "Area of Focus",
              displayNone: true,
              accessor: "areaOfFocus",
              columnClassName: "text-center min-w-250px w-250px max-w-250px",
              disableSortBy: true,
              Cell: AreaOfFocusInput,
              Footer: "",
              footerClassName: "text-white fw-bold",
            },
            {
              Header: "Area of Focus",
              displayNone: true,
              accessor: "areaOfFocusEdit",
              columnClassName: "text-center min-w-300px w-300px max-w-300px",
              disableSortBy: true,
              Cell: AreaOfFocusEditInput,
              Footer: "",
              footerClassName: "text-white fw-bold",
            },
          ],
        },
      ]
      : []),
    ...(isIgcse
      ? [
        {
          Header: "Comments",
          accessor: "comments",
          disableSortBy: true,
          columnClassName: "text-center min-w-200px w-200px max-w-200px",

          rowSpan: 2,
          columns: [
            {
              Header: "Comments",
              displayNone: true,
              accessor: "comments",
              columnClassName: "text-center min-w-200px w-200px max-w-200px",
              disableSortBy: true,
              Cell: CommentsInput,
              Footer: "",
              footerClassName: "text-white fw-bold",
            },
          ],
        }
      ]
      : []),
  ];
}
