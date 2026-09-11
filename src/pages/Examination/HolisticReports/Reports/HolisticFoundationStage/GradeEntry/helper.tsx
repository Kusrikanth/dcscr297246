import { UserDetails } from "../../../../../../Components/Common";
import {
  IOptionsHrtl,
  MoreActions,
} from "../../../../../../Components/Common/MenuOptions";
import {
  convertUTCToISTTimeOnly,
  getDdMmYyyyWithMonthNameFormat,
  getFormattedDateddMMMYYYY,
} from "../../../../../../utility/dateutility";
import { StatusLabelWithStepper } from "./StatusLabelWithStepper";

const dummyStepperData = {
  prepared: [
    { label: "Requested", status: "done" },
    { label: "Prepared", status: "current" },
    { label: "Delivered", status: "pending" },
  ],
  yettoprepare: [
    { label: "Requested", status: "current" },
    { label: "Prepared", status: "pending" },
    { label: "Delivered", status: "pending" },
  ],
};


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "sticky-left",
      Cell: ({ row: { original } }: any) => (
        <UserDetails
          displayName={original?.studentName}
          displayId={original?.studentCode}
          size="xs"
          imageUrl={original?.studentImageBase64 || ""}
        />
      ),
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "classShortName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <UserDetails
          displayName={original.classShortName}
          displayId={original.curriculumName}
          showAvatar={false}
        ></UserDetails>
      ),
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span>{original.sectionName ? original.sectionName : "-"}</span>;
      },
    },
    {
      Header: "Roll number",
      accessor: "rollNo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span>{original.rollNo ? original.rollNo : "-"}</span>;
      },
    },
    {
      Header: "Admission Number",
      accessor: "admissionNumber",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>
            {original.admissionNumber ? original.admissionNumber : "-"}
          </span>
        );
      },
    },
    {
      Header: "Date of birth",
      accessor: "dob",
      disableSortBy: true,
      columnClassName: "w-150px min-w-150px max-w-150px",
      Cell: ({ value }: any) => {
        return (<span>{getDdMmYyyyWithMonthNameFormat(value)}</span>)
      }
    },
    {
      Header: "Phone No.",
      accessor: "contactNo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span>{original.contactNo ? original.contactNo : "-"}</span>;
      },
    },
    {
      Header: "Created Date",
      accessor: "createdDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { createdDate } = original || {};

        const [date, time] = createdDate ? createdDate.split("T") : ["", ""];

        return (
          <UserDetails
            displayName={getFormattedDateddMMMYYYY(date)}
            displayId={convertUTCToISTTimeOnly(time)}
            showAvatar={false}
          />
        );
      },
    },
    {
      Header: "Last Modified",
      accessor: "lastModifiedDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { lastModifiedDate } = original || {};

        const [date, time] = lastModifiedDate
          ? lastModifiedDate.split("T")
          : ["", ""];

        return (
          <UserDetails
            displayName={getFormattedDateddMMMYYYY(date)}
            displayId={convertUTCToISTTimeOnly(time)}
            showAvatar={false}
          />
        );
      },
    },
    {
      Header: "Process",
      accessor: "entryProcessStatus",
      disableSortBy: true,
      columnClassName: "w-250px min-w-250px max-w-250px",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>
            {original?.entryProcessStatus
              ? original?.entryProcessStatus
                  .replace(/[_-]/g, " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase())
              : "-"}
          </span>
        );
      },
    },
    {
      Header: "Status",
      accessor: "entryStatus",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        const key = original?.entryStatus
          ?.replace(/\s+/g, "")
          .toLowerCase();

        return original?.entryStatus ? (
          <StatusLabelWithStepper
            id={`${original?.studentId}`}
            entryId={original?.entryId}
            type={key}
            labelName={original.entryStatus}
            steps={dummyStepperData[key]}
          />
        ) : (
          <span>-</span>
        );
      },
    },
    {
      Header: "Action",
      accessor: "action",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        let updatedActionList: any = [];
        if (original.entryId) {
          actionsList.forEach((action: any) => {
            action.id === "edit" && updatedActionList.push(action);
          });
        } else {
          actionsList.forEach((action: any) => {
            action.id === "initiate" && updatedActionList.push(action);
          });
        }

        return (
          <MoreActions
            actionOptions={updatedActionList}
            rowId={original.studentId}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}

const entryProcessStatusList = [
  "GENERAL_INFO_SUBMITTED",
  "SURROUNDINGS_SUBMITTED",
  "DOMAIN_ASSESSMENT_SUBMITTED",
  "SUMMARY_SUBMITTED",
  "DOMAIN_ASSESSMENT_INPROGRESS",
];

export const entryProcessStatusFilterList = entryProcessStatusList.map(
  (item) => ({
    id: item,
    value: item
      .split(/[_-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" "),
  })
);

const entryStatus = ["PENDING", "INPROGRESS", "COMPLETED"];

export const entryStatusMenuItems = entryStatus.map((status, index) => ({
  id: status,
  name: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
}));

export const ignoredKeys = [
  "searchString",
  "academicYearId",
  "curriculumId",
  "classId",
];
export function renderOptionsStudent(item: any) {
    return `${item?.name} - ${item?.studentCode}`;
}

export function renderValueStudent(selectedItems: any, removeItemHandler: any) {
    if (Array.isArray(selectedItems)) {
        return (<div className="selected-container">
            {
                selectedItems.map((item, index) => {
                    return (<div key={`item-${item?.id}`} className="selectedoption-item">
                        <span>{item?.name}</span>
                        <span data-id={item?.id} onClick={removeItemHandler} className="remove-icon">
                            <i className="ri-close-line"></i>
                        </span>

                    </div>)
                })
            }
        </div>)
    }
}
export function generateValidateStudentsColumns() {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.name || "-"}
            displayId={original?.studentCode || "-"}
            showAvatar={false}
          />
        );
      },
    },
    {
      Header: "SMS Priority Number",
      accessor: "smsPriorityNumber",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return <span>{value ? value : "-"}</span>;
      },
    },
  ];
}