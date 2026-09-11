
import { AutoSearchInput, SelectInput, Switch, TextInput, UserDetails } from "../../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../../Components/Common/MenuOptions";

const status: any = [
    { status: "Normal_Admission", show :"Normal Admission" },
    // { status: "Absent" , show : "Absent" },
    { status: "Recommended", show :"Recommended" },
    { status: "Admission_With_Undertaking", show :"Admission With Undertaking" },
    { status: "On_Hold", show :"On Hold" },
    { status: "Rejected", show :"Rejected" },
    // { status: "Reobservation", show :"Reobservation" },
]

const RecommendedData = [
    { name: "CHAIRMAN" , show : "CHAIRMAN" },
    { name: "CEO" , show : "CEO" },
    { name: "DIRECTOR" , show : "DIRECTOR" },
    { name: "DGM" , show : "DGM" },
]

const AutoSearchInputComponent = ({
    row: { index, original },
    onChangeInputHndlr,
    onBlurInputHndlr,
    selectedMembersCallback,
    rowDataInfo,
  }: any) => {
    return (
           <div className="mt-2">      
      <AutoSearchInput
        formgroupClassName="search-box"
        name="recommendedEmpId"
        placeHolder="Search..."
        // onChange={(e: any) => setSearchInputState(e.target.value)}
        onChange={(value:any)=>onChangeInputHndlr(original?.id,value,"recommendedEmpId")}
        valueKey={"employeeId"}
        labelKey="employeeName"
        subLabelKey="employeeCode"
        labelHeader="Employee Code"
        subLabelHeader="Employee Name"
        options={rowDataInfo || []}
        selected={original?.employeeDetailsDTO?.employeeName ? original?.employeeDetailsDTO : null}
        selectedOptionCallbck={(employee:any)=>selectedMembersCallback(employee,original?.id)}
    ><i className="ri-search-line search-icon"></i></AutoSearchInput>
</div>
    )
  }

const InputComponent = ({
    row: { index, original },
    onChangeInputHndlr,
  }: any) => {
    return (
        <TextInput
        name="referenceBy"
        // labelText="Bank Address"
        inputClassName="mt-2"
        value={original?.referenceBy}
        isDisabled={!(original?.status === "Recommended") && true}
        onChange={(event:any)=>onChangeInputHndlr(original?.id,event,"referenceBy")}
    />
    )
  }
const InputComponentForRemarks = ({
    row: { index, original },
    onChangeInputHndlr,
  }: any) => {
    return (
        <TextInput
        name="remarks"
        // labelText="Bank Address"
        inputClassName="mt-2"
        value={original?.remarks}
        onChange={(event:any)=>onChangeInputHndlr(original?.id,event,"remarks")}
    />
    )
  }
export function generateColumns(actionsList: Array<IOptionsHrtl>, toggleIntResModal: any,changeStatusHandler:any,changeRecommendHandler:any) {
    return [
        {
            Header: "S.No",
            // accessor: "sNo",
            disableSortBy: true,
            Cell: ({ row }: any) => {
                return row.index + 1
            }
        },
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <UserDetails
                            displayName={original?.studentName}
                            displayId={original?.studentRegNo}
                            showAvatar={false}
                        />
                    </>
                );
            },
        },
        {
            Header: "Class",
            accessor: "className",
            disableSortBy: true,
        },
        {
            Header: "Admission Type",
            accessor: "admissionType",
            disableSortBy: true,
        },
        {
            Header: "Interviewer Report",
            // accessor: "",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <div onClick={()=>toggleIntResModal(original?.id)} className="text-decoration-underline" style={{color:"#1492E6",cursor:"pointer"}}>View</div>
            }
        },
       
        {
            Header: "Admission Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return   <SelectInput
                    name="classId"
                    // labelText="Class"
                    value={ original?.status }
                    onChange={(event:any)=>changeStatusHandler(original?.id,event)}
                    // onBlur={filterForm.handleBlur}
                    menuItems={status || []}
                    // defaultSelect={!(original?.absent) ? "Select" : "No Selected"}
                    valueKey="status"
                    textKey="show"
                    inputClassName="mt-2"
                // isDisabled={!(original?.absent) ? false : true}
                /> 
            }
        },
        {
            Header: "Interviewed by",
            accessor: "interviewedBy",
            disableSortBy: true,
            Cell: AutoSearchInputComponent
        },
        {
            Header: "Recommended by",
            accessor: "recommendedBy",
            disableSortBy: true,
            // Cell: AutoSearchInputComponent,
            Cell: ({ row: { original } }: any) => {
                return   <SelectInput
                    name="recommendedBy"
                    // labelText="Class"
                    value={ original?.recommendedBy }
                    onChange={(event:any)=>changeRecommendHandler(original?.id,event)}
                    // onBlur={filterForm.handleBlur}
                    menuItems={RecommendedData || []}
                    // defaultSelect={!(original?.absent) ? "Select" : "No Selected"}
                    valueKey="name"
                    textKey="show"
                    inputClassName="mt-2"
                isDisabled={!(original?.status === "Recommended") && true}
                /> 
            }
        },
        {
            Header: "Reference by",
            accessor: "referenceBy",
            disableSortBy: true,
            Cell: InputComponent,
        },
        {
            Header: "Remarks",
            accessor: "remarks",
            disableSortBy: true,
            Cell: InputComponentForRemarks,
        },

    ];
}

export const computeSubmitButtonError = (panIntResList:any)=>{
    if(panIntResList?.length){
        let findErr : any;
        panIntResList?.map((item:any)=>{
            if(item?.status){
                findErr = true
            }
        })
        if(!findErr) return true
        else return false;
    }
}
  
export function removeUnderscore (string:any) {
    return string?.split("_")?.join(' ')
}

