import { useHistory } from "react-router-dom";
import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { getDateWithTimeFormat, getDdMmYyyyFormat } from "../../../utility/dateutility";
import { StatusLabel, UserDetails } from "../../../Components/Common";

export function generateColumns(actionsList: Array<IOptionsHrtl>,toggleMapModal:any) {
    return ([
        {
            Header: "Title",
            accessor: "title",
            disableSortBy: true,
            Cell:({row:{original}}:any)=>{
                const history = useHistory()
                return(
                    <div onClick={() => { history.push(`/events/view-event`, { id: original?.id }); }} className="text-decoration-underline" style={{ color: "#1492E6", cursor: "pointer" }}>
                    <UserDetails
                            imageUrl={original?.iconUrl}
                            defaultImgType="employee"
                            size="xs"
                            displayName={original?.title}
                        />
                    </div>
                )
            }
        },
        {
            Header: "Event Type",
            accessor: "eventType",
            disableSortBy: true,
          },
        {
            Header: "Tags",
            accessor: "tags",
            disableSortBy: true,
            columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px] tw-text-wrap",
            Cell: ({ row: { original } }: any) => {
                const tags = original?.tags?.split(',') || [];
                return (
                    <>
                        {tags.map((tag: string) => (
                            <span className="badge bg-primary tw-me-1 tw-p-1 fs-11" key={tag}>
                                {tag.trim()}
                            </span>
                        ))}
                    </>
                );
            },
        },
        {
            Header: "Published",
            accessor: "published",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                if (original?.published) {
                    return "Yes";
                } else {
                    return "No";
                }
            }
        },
        {
            Header: "Start Date",
            accessor: "startDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.startDate ? getDateWithTimeFormat(new Date(original?.startDate)) : "-";
            },
        },
        {
            Header: "End Date",
            accessor: "endDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.endDate ? getDateWithTimeFormat(new Date(original?.endDate)) : "-";
            },
        },
        {
            Header: "Event Status",
            accessor: "eventStatus",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                  <StatusLabel
                    type={original.eventStatus}
                    labelName={original.eventStatus}
                  />
                );
            },
        },
        {
            Header:"Comment Allowed",
            accessor:"allowedComments",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                if (original?.allowedComments) {
                  return "Yes";
                } else {
                  return "No";
                }
            },
        },
        {
            Header: "Location",
            accessor: "location",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {                
                const { latitude, longitude } = original;
                if (latitude && longitude) {
                  return (
                    <span className="text-info tw-cursor-pointer tw-underline" onClick={()=>toggleMapModal(latitude,longitude,original)}>View</span>
                  )
                } else {
                  return "-";
                }
              }
            
        },
        {
            Header: "Organizer By",
            accessor: "contactPerson",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                  <UserDetails 
                    displayName={original?.contactPerson}
                    displayId={original?.contactPhone}
                    showAvatar={false}
                  />
                );
            }
            
        },
        {
            Header: "Created Date",
            accessor: "createdDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.eventCreatedDate ? `${getDateWithTimeFormat(new Date(original?.eventCreatedDate) + "Z")}` : "-";
            },
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                 <MoreActions actionOptions={actionsList} rowId={original.id} isHorizontal={true} />
                );
            },
        },
    ])
}

export const ignoredKeys = ["searchString", "academicYearId","eventStatus"]

export const eventStatusMenu = [
  {
    id : "LIVE",
    name : "Live"
  },
  {
    id : "UPCOMING",
    name : "Upcoming"
  },
  {
    id : "CLOSED",
    name : "Closed"
  }
]