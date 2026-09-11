import {
    type ChangeEvent,
} from "react";

import { TextInput } from "../../../../Components/Common";
import { type RangeFiltersState } from "./types";

interface RangeFiltersTabProps {
    value: RangeFiltersState;
    onChange: (
        event: ChangeEvent<HTMLInputElement>,
    ) => void;
}

const RangeFiltersTab = ({
    value,
    onChange,
}: RangeFiltersTabProps) => {
    return (
        <div className="tw-grid tw-grid-cols-1 tw-gap-x-8 tw-gap-y-4 xl:tw-grid-cols-2">
            <TextInput
                name="minimumLeadScore"
                labelText="Minimum lead score"
                value={value.minimumLeadScore}
                onChange={onChange}
                inputType="number"
                placeHolder="Enter minimum lead score"
                formgroupClassName="tw-mb-0"
            />
            <TextInput
                name="maximumLeadScore"
                labelText="Maximum lead score"
                value={value.maximumLeadScore}
                onChange={onChange}
                inputType="number"
                placeHolder="Enter maximum lead score"
                formgroupClassName="tw-mb-0"
            />
        </div>
    );
};

export default RangeFiltersTab;
