import { InputCheckbox, RadioInputContainer } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";

export function generateColumns( openViewNoOfExtensionModal: (event: React.MouseEvent<HTMLDivElement>) => void, openAssignDocModal: (event: React.MouseEvent<HTMLDivElement>) => void,) {
  return [
    {
      Header: "Curriculam",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Short Name",
      accessor: "shortName",
      disableSortBy: true,
    },
    {
      Header: "Total Extension",
      accessor: "totalDocumentsAssigned",
      disableSortBy: true,
      Cell: ({ row: { original } }: { row: { original: any } }) => {
        return (
          <div
            className="tw-text-blue-500 tw-cursor-pointer tw-underline"
            onClick={() => openViewNoOfExtensionModal(original)}
          >
            {original.totalDocumentsAssigned}
          </div>
        );
      },
    },

    {
      Header: "Assign",
      accessor: "assign",
      disableSortBy: true,
      Cell: ({ row: { original } }: { row: { original: any } }) => {
        return (
          <div
            className="tw-text-blue-500 tw-cursor-pointer tw-underline"
            onClick={() => openAssignDocModal(original)}
          >
            Assign
          </div>
        );
      },
    },
  ];
}

export const documentTypes = [
  {
    documentName: "Document",
    documentType: "DOCUMENT",
  },
  {
    documentName: "Photo",
    documentType: "PHOTO",
  },
  {
    documentName: "Signature",
    documentType: "SIGNATURE",
  },
];
export const paymentModeOptions = [
  {
    id: ".pdf",
    name: "PDF",
    selected: false
  },
  {
    id: ".tif",
    name: "tif",
    selected: false
  },
  {
    id: ".jpg",
    name: "jpg",
    selected: false
  },
  {
    id: ".jpeg",
    name: "jpeg",
    selected: false
  },
  {
    id: ".png",
    name: "png",
    selected: false
  },
  {
    id: ".docx",
    name: "docx",
    selected: false
  },
]

export function generateColumnsExtensionDetails(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Document Name",
      accessor: "documentName",
      disableSortBy:true,
    },
    {
      Header: "Display Name",
      accessor: "displayName",
      disableSortBy:true,
    },
    {
      Header: "Short Name",
      accessor: "shortName",
      disableSortBy:true,
    },
    {
      Header: "Document Type",
      accessor: "documentType",
      disableSortBy:true,
    },
    {
      Header: "Extensions",
      accessor: "acceptedExtensions",
      disableSortBy:true,
    },
    {
      Header: "Mandatory",
      accessor: "mandatory",
      disableSortBy:true,
      columnClassName: "tw-w-[130px] tw-min-w-[130px] tw-max-w-[130px]",
      Cell: ({ row: { original }, onChangeInputHndlr , rowDataInfo }: any) => {
        return (
          <div className="row">
            <RadioInputContainer
              name={`${original.id}`}
              radioOptions={[{ id: "YES", name: "YES" }, { id: "NO", name: "NO" }]}
              isDisabled={rowDataInfo}
              value={original?.isRequired}
              onChange={(e: { target: { value: any; }; }) => {
                onChangeInputHndlr(original.id, e.target.value);
              }}
              labelClassName="tw-text-gray-500"
            />
          </div>
        );
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.id}
          />
        );
      },
    },
  ];
}
export function generateColumnsAssignDocuments(allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            value={allStudentSelectedState}
            onChange={allStudentCheckHndlr}
            formgroupClassName="tw-mb-0"
          />
        )
      },
      accessor: "isStudentChecked",
      columnClassName: "tw-w-[5%]",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { id, isSelected } = original;
        return (
          <>
            <InputCheckbox
              name={`student-${id}`}
              value={isSelected}
              onChange={singleStudentCheckHndlr}
              dataId={id}
              formgroupClassName="tw-mb-0"
            />
          </>
        )
      }
    },
    {
      Header: "Document Name",
      accessor: "documentName",
      disableSortBy:true,
    },
    {
      Header: "Display Name",
      accessor: "displayName",
      disableSortBy:true,
    },
    {
      Header: "Short Name",
      accessor: "shortName",
      disableSortBy:true,
    },
    {
      Header: "Document Type",
      accessor: "documentType",
      disableSortBy:true,
    },
    {
      Header: "Extensions",
      accessor: "acceptedExtensions",
      disableSortBy:true,
    },
    {
      Header: "Mandatory",
      accessor: "mandatory",
      disableSortBy:true,
      columnClassName: "tw-w-[130px] tw-min-w-[130px] tw-max-w-[130px]",
      Cell: ({ row: { original , index }, onChangeInputHndlr }: any) => {
        return (
          <div className="row">
            <RadioInputContainer
              name={`${original.id}-${index}`}
              radioOptions={[{ id: "YES", name: "YES" }, { id: "NO", name: "NO" }]}
              value={original?.isRequired}
              onChange={(e: { target: { value: any; }; }) => {
                onChangeInputHndlr(original.id, e.target.value);
              }}
              isDisabled={!original?.isSelected}
              labelClassName="tw-text-gray-500"
            />
          </div>
        );
      },
    },
  ];
}