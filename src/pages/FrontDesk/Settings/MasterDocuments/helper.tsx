import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Document Name",
      accessor: "documentName",
      disableSortBy: true,
    },
    {
      Header: "Display Name",
      accessor: "displayName",
      disableSortBy: true,
    },
    {
      Header: "Short Name",
      accessor: "shortName",
      disableSortBy: true,
    },
    {
      Header: "Type",
      accessor: "documentType",
      disableSortBy: true,
    },
    {
      Header: "Extension",
      accessor: "acceptedExtensions",
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
    id: "pdf",
    name: "PDF",
  },
  {
    id: "tif",
    name: "tif",
  },
  {
    id: "jpg",
    name: "jpg",
  },
  {
    id: "jpeg",
    name: "jpeg",
  },
  {
    id: "png",
    name: "png",
  },
  {
    id: "docx",
    name: "docx",
  },
];