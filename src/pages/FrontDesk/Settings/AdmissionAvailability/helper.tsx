import { DateInput, RadioInputContainer, TextInputWithRegex } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyFormat } from "../../../../utility/dateutility";

const DateInputComponent = ({
    row: { index, original },
    onChangeInputHndlr,
}: any) => {
    return (
        <DateInput
            name={`ageLimit-${index}`}
            value={original?.ageLimit}
            onChange={(event: any) => onChangeInputHndlr(original?.id, event.target.value, "ageLimit")}
        />
    )
}

const CountInputComponent = ({
    row: { index, original },
    onChangeInputHndlr,
}: any) => {
    return (
        <TextInputWithRegex
            name="desiredStrength"
            allowedInputRegex="^[0-9]+\.?[0-9]*$"
            value={original.desiredStrength}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChangeInputHndlr(original?.id, event.target.value, "desiredStrength")}
            placeHolder="0"
        >
        </TextInputWithRegex>
    )
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
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
            Header: "Admission availability",
            accessor: "availabilityStatus",
            disableSortBy: true,
        },
        {
            Header: "Desired Strength",
            accessor: "desiredStrength",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => <>{original?.desiredStrength || '-'}</>
        },
        {
            Header: "Age Limit",
            accessor: "ageLimit",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (original?.ageLimit ? getDdMmYyyyFormat(original?.ageLimit) : "");
            },
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl
                        actionOptions={actionsList}
                        rowId={original.id}
                    />
                );
            },
        },
    ];
}
export function generateColumnsAddNewAdmissionAvailability() {
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
            accessor: "className",
            disableSortBy: true,
        },
        {
            Header: "Admission availability",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original, index }, onChangeInputHndlr }: any) => {
                return (
                    <div className="row">
                        <RadioInputContainer
                            name={`availabilityStatus-${index}`}
                            inputContainerClassName="tw-mt-2"
                            radioOptions={[{ id: "Yes", name: "Yes" }, { id: "No", name: "No" }]}
                            value={original?.availabilityStatus}
                            onChange={(e: any) => onChangeInputHndlr(original.id, e.target.value, "availabilityStatus")}
                            labelClassName="tw-text-gray-500"
                        />
                    </div>
                );
            },
        },
        {
            Header: "Desired Strength",
            accessor: "desiredStrength",
            disableSortBy: true,
            Cell: CountInputComponent
        },
        {
            Header: "Age Limit",
            accessor: "ageLimit",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
            Cell: DateInputComponent
        },

    ];
}
