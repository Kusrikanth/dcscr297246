import { MenuOptionHrtl } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { Input } from "reactstrap";

const handleProposedSaved = (id: any) => {

    // const dispatch = useDispatch()
    
    const params = {
        academicYearId: 8,
        curriculumId: "",
        classId: id,
        branchId: 1
    }

    // dispatch(addProposedAdmissionAct(
    //     generateActionPayload('get_proposed_admission', params)
    // ))
}

const editConcessionAmount = ({
    row: { index, original },
    onChangeInputHndlr,
    onBlurInputHndlr
}: any) => {
    return <div className="tw-mb-0 tw-w-[30%] tw-flex tw-items-center">
        <Input type="text" value={original.proposedAdmissionCount} onChange={onChangeInputHndlr} data-id={original.id} name="proposedAdmissionCount" disabled={!original?.isEdit}/>
        {/* <AllowSvg className="ms-3 d-inline-block" fill="#212529" style={{ width: "30px", height: "30px" }} onClick={() => handleProposedSaved(original)} /> */}
    </div>
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {


    return [
        {
            Header: "Class",
            accessor: "className",
            disableSortBy: true,
            columnClassName: "tw-w-[30%]"
        },
        {
            Header: "Proposed Admission",
            accessor: "proposedAdmission",
            disableSortBy: true,
            columnClassName: "tw-w-[40%]",
            Cell: editConcessionAmount
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            columnClassName: "tw-w-[30%]",
            Cell: ({ row: { original } }: any) => {
                const newActionList = actionsList?.map((i:any)=>{
                    if(original?.isEdit === false && i?.id==="edit"){
                        return i
                    }else if(original?.isEdit === true && i?.id==="success") {
                        return i
                    }
                })
                return (
                    <MenuOptionHrtl
                        actionOptions={newActionList.filter((i:any)=>i)}
                        rowId={original.id}
                    />
                );
            },
        },
    ];
}

export const ProposedAdmissionData = [
    {
        class: "VI",
        proposedAdmission: "50",
    }
]