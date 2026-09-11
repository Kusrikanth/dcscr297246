import { SelectInput, StatusLabel, TextInput, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";

export const MenuOptions: Array<any> = [
    {
      id: "healthFormVerificationRequests",
      labelName: "Health Form Verification Requests",
      customPadding: "0px 20px",
    },
    {
      id: "healthFormVerificationApprovedList",
      labelName: "Health Form Verification Approved list",
      customPadding: "0px 20px",
    },
  
  ];

  const InputComponentForRemarks = ({
    row: { index, original },
    onChangeInputHndlr,
  }: any) => {
    return (
        <div style={{minWidth:"6rem"}}>
        <TextInput
        name="remarks"
        // labelText="Bank Address"
        inputClassName=""
        value={original?.remarks}
        onChange={(event:any)=>onChangeInputHndlr(event,original?.id,"remarks")}
        />
        </div>
    )
  }

  const InputComponentForStatus = ({
    row: { index, original },
    onChangeInputHndlr,
  }: any) => {
    return  (<div style={{minWidth:"8rem"}}>
    <SelectInput
        name="status"
        // labelText="Class"
        value={ original?.status }
        onChange={(event:any)=>onChangeInputHndlr(event,original?.id,"status")}
        menuItems={[{
            name : "APPROVED",show : "Approved",
        },{
            name : "REJECTED",show : "Rejected",
        }]}
        valueKey="name"
        textKey="show"
        inputClassName=""
        /> 
        </div>)
  }

  export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                      displayName={original?.studentName}
                      displayId={original?.studentCode}
                      size={"xs"}
                      imageUrl={original?.imageUrl}
                      defaultImgType="student"
                    />
                );
            },
        },
        {
            Header:"Curriculum",
            accessor:"curriculumName",
            disableSortBy: true,
        },
        {
            Header:"Class",
            accessor:"className",
            disableSortBy: true,
        },
        {
            Header:"Section",
            accessor:"sectionName",
            disableSortBy: true,
        },
        {
            Header:"SMS Priority No.",
            accessor:"smspriorityNo",
            disableSortBy: true,
        },
        {
            Header:"Approvals",
            accessor:"status",
            disableSortBy: true,
            Cell: InputComponentForStatus,
        },
        {
            Header:"Remarks",
            accessor:"newRemarks",
            disableSortBy: true,
            Cell: InputComponentForRemarks,
        },
       
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
          {
            Header:"Remarks",
            accessor:"remarks",
            disableSortBy: true,
        },
        {
            Header:"Status",
            accessor:"confirmationStatus",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return <StatusLabel type={original?.confirmationStatus} labelName={original?.confirmationStatus} />
            }
        },
    ];
}

export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if ((key === "startDate"))
        count += 1;
    }
  }
  if(count>0) {return {stateChange : showState , count : count}}
  else {return {stateChange : showState , count : count}}
}