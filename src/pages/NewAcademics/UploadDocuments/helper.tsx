
import { HugeiconsIcon } from "@hugeicons/react";
import { DownloadCircle02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";

function getClassNames(options: (Array<any> | null)) {
  if (Array.isArray(options) && options.length > 0) {
    return (
      <div className="tw-flex tw-flex-wrap tw-gap-1">
        {options.map((item, index) => {
          return (
            <span key={item.classId} title={item?.classId} className="badge tw-uppercase tw-bg-gray-100 !tw-text-gray-500 tw-p-2">{item.className}</span>
          )
        })}
      </div>
    )
  } else {
    return (<span className="tw-text-blue-600 text">N/A</span>)
  }
}
function getSectionsNames(options: (Array<any> | null)) {
  if (Array.isArray(options) && options.length > 0) {
    return (
      <div className="tw-flex tw-flex-wrap tw-gap-1">
        {options.map((item, index) => {
          return (
            <span key={item.sectionId} title={item?.sectionId} className="badge tw-uppercase tw-bg-gray-100 !tw-text-gray-500 tw-p-2">{item.sectionName}</span>
          )
        })}
      </div>
    )
  } else {
    return (<span className="tw-text-blue-600 text">N/A</span>)
  }
}

export function generateColumns(actionsList: Array<IOptionsHrtl>, handleFileDownload: any) {
  return [
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
      columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px]",
    },
    {
      Header: "Class",
      accessor: "classList",
      disableSortBy: true,
      columnClassName: "tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
      Cell: ({ row }: any) => {
        const { original } = row,
          { classList } = original;
        return (
          getClassNames(classList)
        );
      },
    },
    {
      Header: "Section",
      accessor: "sectionList",
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
      Cell: ({ row }: any) => {
        const { original } = row,
          { sectionList } = original;
        return (
          getSectionsNames(sectionList)
        );
      },
    },
    {
      Header: "Subject",
      accessor: "subject",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { subject } = original;
        const isLink = subject.startsWith("http://") || subject.startsWith("https://");

        return isLink ? (
          <a href={subject} target="_blank" className="tw-text-blue-600">
            {subject}
          </a>
        ) : (
          <span>{subject}</span>
        );
      },
    },
    {
      Header: "Topic",
      accessor: "comment",
      disableSortBy: true,
    },
    {
      Header: "Type of Work",
      accessor: "typeOfWork",
      disableSortBy: true,
    },
    {
      Header: "File Name",
      accessor: "fileName",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        const { systemFileId } = original;
        return (
          <>
            {
              systemFileId ? <a
                tabIndex={0}
                className="tw-text-blue-600"
                onClick={() => handleFileDownload(systemFileId)}
                style={{ cursor: "pointer" }}
              >
                <HugeiconsIcon icon={DownloadCircle02StrokeStandard} size={20} className="tw-text-blue-600" />
              </a> : "-"
            }
          </>
        );
      },
    },
    {
      Header: "Created User",
      accessor: "createdUser",
      disableSortBy: true,
    },
    {
      Header: "Created Date",
      accessor: "createdDate",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return <span className="tw-text-nowrap">{value ? getDdMmYyyyWithMonthNameFormat(value) : "-"}</span>
      },
    },
    {
      Header: "Actions",
      accessor: "actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const encodedRowId = `${original.uploadId || ""}__${original.systemFileId || ""}`;
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={encodedRowId}
          />
        );
      },
    }
  ];
}