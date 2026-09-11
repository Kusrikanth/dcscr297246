import { InputCheckbox } from "../../../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Domain Index",
      accessor: "domainIndex",
      disableSortBy: true,

    },
    {
      Header: "Domain",
      accessor: "domainName",
      disableSortBy: true,
    },
    {
      Header: "Activity",
      accessor: "activities",
      columnClassName: 'w-400px min-w-400px max-w-400px',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <ol style={{ listStyleType: "decimal", paddingLeft: "20px" }}>
              {original.activities?.map((item, index) => (
                <li key={item.id || index}>
                  {item.title}
                </li>
              ))}
            </ol>
          </>
        );
      },
    },

    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.domainId}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

export const tableData = [
  { id: 1, domainName: "Cricket", order: 1 , createdAt: "2023-01-01 12:00:00" },
  { id: 2, domainName: "Football", order: 2, createdAt: "2023-02-01 12:00:00" },
  { id: 3, domainName: "Basketball", order: 3, createdAt: "2023-03-01 12:00:00" },
  { id: 4, domainName: "Tennis", order: 4, createdAt: "2023-04-01 12:00:00" },
  { id: 5, domainName: "Badminton", order: 5, createdAt: "2023-05-01 12:00:00" },
  { id: 6, domainName: "Hockey", order: 6, createdAt: "2023-06-01 12:00:00" },
  { id: 7, domainName: "Table Tennis", order: 7, createdAt: "2023-07-01 12:00:00" },
  { id: 8, domainName: "Baseball", order: 8, createdAt: "2023-08-01 12:00:00" },
  { id: 9, domainName: "Swimming", order: 9, createdAt: "2023-09-01 12:00:00" },
  { id: 10, domainName: "Volleyball", order: 10, createdAt: "2023-10-01 12:00:00" },
];

export function renderValueSection(selectedItems: any) {
    return `${selectedItems?.domainIndex} - ${selectedItems?.name}`;
  }

  export function renderOptionsEmployee(item: any) {
    return `${item?.domainIndex} - ${item?.name}`;
  }

  export function renderOptionsStatus(item: any) {
        return item?.title;
    }

  export function renderValueStaff(selectedItems: any, removeItemHandler: any) {
    if (Array.isArray(selectedItems)) {
        return (<div className="selected-container">
            {
                selectedItems.map((item, index) => {
                    return (<div key={`item-${item?.id}`} className="selectedoption-item">
                        <span>{item?.title}</span>
                        <span data-id={item?.id} onClick={removeItemHandler} className="remove-icon">
                            <i className="ri-close-line"></i>
                        </span>

                    </div>)
                })
            }
        </div>)
    }
}

export function generateColumnsI(allStudentSelectedState: any, allStudentCheckHndlr: any, singleStudentCheckHndlr: any) {
  return [
{
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            // labelName={shortName}
            value={allStudentSelectedState}
            onChange={allStudentCheckHndlr}
            formgroupClassName="mb-0"
          />
        )
      },
      accessor: "isStudentChecked",
      columnClassName: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { id, isSelected } = original;   
             
        return (
          <>
            <InputCheckbox
              name={`student-${id}`}
              // labelName={shortName}
              value={isSelected}
              onChange={singleStudentCheckHndlr}
              dataId={id}
              formgroupClassName="mb-0"
            />
          </>
        )
      }
    },
    {
      Header: "Activity",
      accessor: "title",
      disableSortBy: true,
    },

  ];
}