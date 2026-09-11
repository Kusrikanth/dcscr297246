import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
export function generateColumns(actionList: Array<IOptionsHrtl>) {
    return [
      {
        Header: "S.no",
        accessor: "sno",
        disableSortBy: true,
        Cell: ({ row: { original,index } }: any) => {
          return (<span>{index+1}</span>)
        },
      },
      {
        Header: "Name",
        accessor: "name",
        disableSortBy: true,
      },
      {
        Header: "Color Code",
        accessor: "colorCode",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "8px" }}>{original.colorCode}</span>
              <div
                style={{
                  width: "30px",
                  height: "16px",
                  backgroundColor: original.colorCode,
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          );
        },
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
  
  export const eventData = [
  {
    id: 1,
    sno: 1,
    name: "Summer Break",
    colorCode: "#FF0000",
  },
  {
    id: 2,
    sno: 2,
    name: "Diwali Holiday",
    colorCode: "#008000",
  },
  {
    id: 3,
    sno: 3,
    name: "Holi Holiday",
    colorCode: "#FFFF00",
  },
  {
    id: 4,
    sno: 4,
    name: "Winter Break",
    colorCode: "#0000FF",
  },
]