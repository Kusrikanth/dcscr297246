import { MenuOptionHrtl } from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { getDisplayDateForTableFormat } from "../../../utility/dateutility";

function getClassName(options: (Array<any> | null), index: any) {
  if (Array.isArray(options) && options.length > 0) {
    return (
      <div className="tw-flex tw-flex-wrap tw-gap-1">
        {options.map((item, index) => {
          return (
            <span key={`${index}-${item.classId}`} className="badge badge-soft-secondary">{item.className}</span>
          )
        })}
      </div>
    )
  } else {
    return (<span className="tw-text-gray-500">-</span>)
  }
}

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "classLists",
      disableSortBy: true,
      Cell: ({ value, row: { index } }: any) => {
        return (
          getClassName(value, index)
        );
      },
    },
    {
      Header: "File Name",
      accessor: "fileInfo",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (<a title="Download File" href={value} target="_blank" className="tw-px-2 tw-text-blue-600 tw-cursor-pointer">
          <i style={{ fontSize: "20px" }} className="ri-download-2-line"></i>
        </a>)
      },
    },
    // {
    //   Header: "Created User",
    //   accessor: "createdUser",
    //   disableSortBy: true,
    // },
    // {
    //   Header: "User Date",
    //   accessor: "userDate",
    //   disableSortBy: true,
    // },
    {
      Header: "Created Time",
      accessor: "createdDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="tw-text-nowrap">{getDisplayDateForTableFormat(original.createdDate)}</span>)
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const encodedRowId = `${original.uploadId || ""}__${original.systemFileId || ""}`;
        return (
          <MenuOptionHrtl
            actionOptions={actionList}
            rowId={encodedRowId}
          />
        );
      },
    }
  ];

}
