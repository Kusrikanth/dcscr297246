
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";

function getClassNames(options: (Array<any> | null)) {
    if (Array.isArray(options) && options.length > 0) {
      return (
        <div className="tw-flex tw-flex-wrap tw-gap-1">
          {options.map((item, index) => {
            return (
              <span key={item.classId} title={item?.classId} className="badge tw-uppercase bg-light tw-text-gray-500 tw-p-2">{item.className}</span>
            )
          })}
        </div>
      )
    } else {
      return (<span className="tw-text-blue-500 text">N/A</span>)
    }
  }
function getSectionsNames(options: (Array<any> | null)) {
    if (Array.isArray(options) && options.length > 0) {
      return (
        <div className="tw-flex tw-flex-wrap tw-gap-1">
          {options.map((item, index) => {
            return (
              <span key={item.sectionId} title={item?.sectionId} className="badge tw-uppercase bg-light tw-text-gray-500 tw-p-2">{item.sectionName}</span>
            )
          })}
        </div>
      )
    } else {
      return (<span className="tw-text-blue-500 text">N/A</span>)
    }
  }

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header:"Subject",
            accessor:"subject",
            disableSortBy: true,
        },
        {
            Header:"Type of Work",
            accessor:"typeOfWork",
            disableSortBy: true,
        },
        {
            Header:"Topic",
            accessor:"comment",
            disableSortBy: true,
        },
        {
            Header:"Created Date",
            accessor:"createdDate",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return <span className="text-nowrap">{value ? getDdMmYyyyWithMonthNameFormat(value) : "-"}</span>
              },
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              const encodedRowId = `${original.uploadId || ""}__${original.systemFileId || ""}`;
              return (
              <MenuOptionHrtl actionOptions={actionsList} rowId={encodedRowId}  />
              );
            },
          },
    ];
}