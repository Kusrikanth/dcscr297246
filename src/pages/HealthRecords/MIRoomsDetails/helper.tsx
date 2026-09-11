
import { UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { getDdMmYyyyFormat } from "../../../utility/dateutility";


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header:"Room Name",
            accessor:"roomName",
            disableSortBy: true,
        },
        {
            Header:"In Charge Name",
            accessor:"inchargeName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                    <UserDetails
                      displayName={original?.inchargeName}
                      displayId={original?.inchargeCode}
                      showAvatar={false}
                    />
                    </>
                );
            },
        },
        // {
        //     Header: "Created User",
        //     accessor: "createdDate",
        //     disableSortBy: true,
        // },
        {
            Header: "Created Date",
            accessor: "createdDate",
            disableSortBy: true,
            Cell : ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">{getDdMmYyyyFormat(original?.createdDate)}</span>
            }
        },
        // {
        //     Header: "Modified Date",
        //     accessor: "remarks",
        //     disableSortBy: true,
        // },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return (
              <MenuOptionHrtl actionOptions={actionsList} rowId={original.id}  />
              );
            },
          },
    ];
}
