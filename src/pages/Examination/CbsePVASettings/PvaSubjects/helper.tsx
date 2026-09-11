import { MenuOptionHrtl } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { getDateWithTimeFormat, getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "PVA Subject",
      accessor: "pvaSubjectName",
      disableSortBy: true,
    },
    {
      Header: "Subject Name",
      accessor: "subjectName",
      disableSortBy: true,
    },
    {
      Header: "Table HeaderColor",
      accessor: "color",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="fs-14 badge tw-bg-[#4051891a] px-1 text-dark fw-medium d-inline-flex align-items-center !tw-justify-center">
            <span
              className="rounded"
              style={{
                width: "20px",
                height: "12px",
                display: "inline-block",
                backgroundColor: `${original.color}`,
              }}
            ></span>
          </div>
        );
      },
    },
    {
      Header: "Created Date",
      accessor: "createdDate",
      Cell: ({ row: { original } }: any) => {
        return getDdMmYyyyWithMonthNameFormat(new Date(original?.createdDate));
      }
    },
    {
      Header: "Action",
      thClass: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
        );
      },
    },
  ];
}
