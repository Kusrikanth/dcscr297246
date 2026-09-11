export const MenuOptions: Array<any> = [
    {
      id: "comments",
      labelName: "Comments ( For User )",
      customPadding: "0px 10px",
    },
    {
      id: "remarks",
      labelName: "Remarks ( Internal User )",
      customPadding: "0px 10px",
    },

  ];

  export const updatedMenuOptions = [
    {
      id: "comments",
      labelName: "Comments ( For User )",
      customPadding: "0px 10px",
    },
  ]

  export const accessRoles = ["STUDENT","PARENT","EMPLOYEE","TEACHER","ADM_CONS","ADM_HEAD","TRANSPORT_HEAD","ACCOUNT_HEAD","ACCOUNT","TRANSPORT","PRINCIPAL","VICE_PRINCIPAL","PA","HR","HR_HEAD", "EMPLOYEE", "HOSTEL", "MEDICAL", "LIBRARY", "GRIEVANCE", "PARENT_ROLE",]

  export const priorityFilter = [
    {
        id: "LOW",
        name: "LOW"
    },
    {
        id: "MEDIUM",
        name: "MEDIUM"
    },
    {
        id: "HIGH",
        name: "HIGH"
    },
    {
        id: "CRITICAL",
        name: "CRITICAL"
    },
]

  export const complaintStatusOptions = [
    {
        id: "OPEN",
        name: "OPEN"
    },
    {
        id: "INPROGRESS",
        name: "INPROGRESS"
    },
    {
        id: "CLOSED",
        name: "CLOSED"
    },
    {
        id: "ON_HOLD",
        name: "ON HOLD"
    },
    {
        id: "BLOCKED",
        name: "BLOCKED"
    },
]

  export const statusOptions = [
    {
        id: "OPEN",
        name: "OPEN"
    },
    {
        id: "INPROGRESS",
        name: "INPROGRESS"
    },
    {
        id: "CLOSED",
        name: "CLOSED"
    },
    {
        id: "ON_HOLD",
        name: "ON HOLD"
    },
    {
        id: "BLOCKED",
        name: "BLOCKED"
    },

]

export function getAssigneesName(options: (Array<any> | null)) {
  if (Array.isArray(options) && options.length > 0) {
    return (
      <div className="d-flex flex-wrap gap-1">
        {options.map((item, index) => {
          return (
            <span key={item.assigneeIds} title={item?.employeeName} className="badge text-uppercase bg-light text-muted p-2 !tw-whitespace-break-spaces !tw-text-left !tw-leading-normal">{item.employeeName}</span>
          )
        })}
      </div>
    )
  } else {
    return (<span className="text-info text">N/A</span>)
  }
}

