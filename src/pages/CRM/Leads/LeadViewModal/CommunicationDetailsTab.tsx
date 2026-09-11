import {
    type ChangeEvent,
} from "react";

import { TextInput } from "../../../../Components/Common";
import {
    type CommunicationDetailsField,
    type CommunicationDetailsState,
} from "./types";

interface CommunicationDetailsTabProps {
    value: CommunicationDetailsState;
    onChange: (
        event: ChangeEvent<HTMLInputElement>,
    ) => void;
}

const communicationDetailsFields: CommunicationDetailsField[] = [
    {
        id: "studentName",
        labelName: "Student name",
        placeHolder: "Enter student name",
    },
    {
        id: "primaryPhone",
        labelName: "Primary phone",
        placeHolder: "Enter primary phone",
    },
    {
        id: "alternatePhone",
        labelName: "Alternate phone",
        placeHolder: "Enter alternate phone",
    },
    {
        id: "email",
        labelName: "Email",
        placeHolder: "Enter email",
    },
    {
        id: "parentName",
        labelName: "Parent name",
        placeHolder: "Enter parent name",
    },
];

const CommunicationDetailsTab = ({
    value,
    onChange,
}: CommunicationDetailsTabProps) => {
    return (
        <div className="tw-grid tw-grid-cols-1 tw-gap-x-8 tw-gap-y-4 xl:tw-grid-cols-2">
            {communicationDetailsFields.map(field => (
                <TextInput
                    key={field.id}
                    name={field.id}
                    labelText={field.labelName}
                    value={value[field.id]}
                    onChange={onChange}
                    placeHolder={field.placeHolder}
                    inputType={field.inputType || "text"}
                    formgroupClassName="tw-mb-0"
                />
            ))}
        </div>
    );
};

export default CommunicationDetailsTab;
