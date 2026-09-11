import React, { useState } from "react";
//Common Component
import { SelectInput, } from "../../../../../Components/Common";

import FatherDetails from "./FatherDetails";
import GuardianDetail from "./GuardianDetail";
import Button from "../../../../../Components/Common/Button";

export const ParentGuardian: React.FC<any> = (props) => {
    const [guardianTypeState, setGuradianTypeState] = useState<any>("parent");
    function onChangeGuardianHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setGuradianTypeState(value);
    }
    return (
        <div className="tw-grid tw-grid-cols-12">

            <div className="tw-col-span-12 tw-flex tw-items-center tw-mb-2">
                <h5 className="tw-mb-1 tw-mr-4">
                    {props.titleName || "Parent/Guardian"}
                </h5>
                <SelectInput
                    name="branchTypeId"
                    value={guardianTypeState}
                    onChange={onChangeGuardianHndlr}
                    formgroupClassName="tw-mb-0"
                    menuItems={[{ id: "parent", name: "parent" }, { id: "guardian", name: "guardian" }]}
                    hideSelectOption={true}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            {guardianTypeState === "parent" && <FatherDetails />}
            {guardianTypeState === "guardian" && <GuardianDetail />}

            <div className="tw-col-span-12 tw-text-right tw-mt-2">
                <Button
                    type="submit"
                    variant="previous"
                >
                    Previous
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                >
                    Proceed
                </Button>
            </div>
        </div>
    )
}