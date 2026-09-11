
import { MenuOptionHrtl, RadioInputContainer } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [

    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Hostel Facility",
      accessor: "hostelAvailability",
      disableSortBy: true,
    },
    {
      Header: "Action",
      accessor: "action",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.classId}
          />
        );
      },
    },

  ];
}

export function generateColumnsModel() {

  return [
    {
      Header: "S.No",
      accessor: "id",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        return row.index + 1
      }
    },
    {
      Header: "Class",
      accessor: "classShortName",
      disableSortBy: true,
    },
    {
      Header: "Hostel Facility",
      accessor: "hostelFacility",
      disableSortBy: true,
      Cell: ({ row: { original }, onChangeInputHndlr }: any) => {
        return (
          <div className="row">
            <RadioInputContainer
              name={`${original.classId}`}
              radioOptions={[{ id: "YES", name: "YES" }, { id: "NO", name: "NO" }]}
              value={(original.hostelAvailability === undefined) ? ("") : (original.hostelAvailability)}
              onChange={(e: any) => onChangeInputHndlr(original.classId, e.target.value)}
              labelClassName="tw-text-gray-500"
            />
          </div>
        );
      },
    },

  ];
}
