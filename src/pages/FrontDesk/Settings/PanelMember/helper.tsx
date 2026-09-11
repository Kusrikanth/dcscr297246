import { MenuOptionHrtl, MoreActions, UserDetails } from "../../../../Components/Common";
import { AvatarGroup } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import TeacherSvg from "../../../../assets/imagesdps/employee-default-img.png"
import DefaultStudentImage from "../../../../assets/imagesdps/student-default-img.png";

function getPanelMembers(options: (Array<any> | null)) {
  if (Array.isArray(options) && options.length > 0) {
    return (
      <div className="tw-flex tw-flex-wrap tw-gap-1">
        {options.map((item, index) => {
          return (
            <span key={item.employeeId} title={item?.employeeId} className="badge text-uppercase bg-light text-muted p-2">{item.employeeName}</span>
          )
        })}
      </div>
    )
  } else {
    return (<span className="tw-text-blue-500">N/A</span>)
  }
}


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Classes",
      accessor: "classNames",
      disableSortBy: true,
      // columnClassName:"w-30"
    },
    {
      Header: "Panel Member",
      accessor: "panelMember",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        const { original } = row,
          { employeeDetailsPanelMembersDTOS } = original;
        return (
          getPanelMembers(employeeDetailsPanelMembersDTOS)
        );
      },
      // columnClassName:"w-30"
    },
    // {
    //     Header: "Stream",
    //     accessor: "stream",
    //     disableSortBy: true,
    //     columnClassName:"w-30"
    // },
    // {
    //     Header: "Subject",
    //     accessor: "subject",
    //     disableSortBy: true,
    //     columnClassName:"w-10"
    // },
    // {
    //     Header: "Max Marks",
    //     accessor: "maxMarks",
    //     disableSortBy: true,
    //     columnClassName:"w-10"
    // },
    // {
    //     Header: "Pass Marks",
    //     accessor: "passMarks",
    //     disableSortBy: true,
    //     columnClassName:"w-10"
    // },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      columnClassName: "tw-w-[10%]",
      Cell: ({ row: { original } }: any) => {
        return (
          <MoreActions
            actionOptions={actionsList}
            rowId={original.id}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}


{/* <div>

  {Array.isArray(row.original.employeeDetailsPanelMembersDTOS) && row.original.employeeDetailsPanelMembersDTOS.length > 0 ? <div className="avatar-group">
    <>{row.original.employeeDetailsPanelMembersDTOS.slice(0, 2).map((stu: any, index: number) => <div className="avatar-group-item" data-bs-toggle="tooltip" data-bs-placement="top" title={stu.employeeName} key={index} >
      <img src={stu?.thumbnailImage?.s3URL || TeacherSvg} alt="" className="rounded-circle avatar-xs" />
    </div>
    )
    }
      {row.original.employeeDetailsPanelMembersDTOS.length > 2 && <div className="avatar-group-item cursor-pointer" data-bs-toggle="tooltip" data-bs-placement="top" title="more" data-id={row.index} onClick={toggleShowPanelMembersModal}>
        <div className="avatar-xs">
          <div className="avatar-title rounded-circle" style={{ backgroundColor: "#D4F5F0", color: "#0AB39C" }}>
            {row.original.employeeDetailsPanelMembersDTOS.length - 2 + "+"}
          </div>
        </div>
      </div>}
    </>
  </div> : <UserDetails
    imageUrl={row.original.employeeDetailsPanelMembersDTOS[0]?.thumbnailImage?.s3URL}
    displayName={row.original.employeeDetailsPanelMembersDTOS[0]?.employeeName}
    displayId={row.original.employeeDetailsPanelMembersDTOS[0]?.employeeCode}
    defaultImgType="student"
    size="xs"
  />}
</div> */}
export const PanelMemberData = [
  {
    classes: "IV,V,VI,VII,VIII",
    panelMember: [
      {
        name: "Abc",
        img: DefaultStudentImage
      },
      {
        name: "Xyz",
        img: DefaultStudentImage
      },
      {
        name: "Cde",
        img: DefaultStudentImage
      },
    ]
  }
]

export function showPanelMembersDetails() {
  return [
    {
      Header: "Student",
      accessor: "student",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              imageUrl={original.thumbnailImage}
              displayName={original?.employeeName}
              displayId={original?.employeeCode}
              defaultImgType="employee"
            />

          </>
        );
      },
    },
  ]
}

export function renderValueClasses(selectedItems: any, removeItemHandler: any) {
  if (Array.isArray(selectedItems)) {
    return (<div className="text-truncate">
        {
            selectedItems.map((item, index) => {
                return item?.shortName + (index !== (selectedItems.length - 1) ? ', ' : '')
            })
        }
    </div>)
}
}

export function renderOptionsClasses(item: any) {
  return `${item?.shortName}`;
}