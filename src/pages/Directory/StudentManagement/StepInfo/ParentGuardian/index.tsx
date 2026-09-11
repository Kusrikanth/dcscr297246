import React, { useState } from "react";
import { Label, Input } from "reactstrap";
//Common Component
import { ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput } from "../../../../../Components/Common";
import Button from "../../../../../Components/Common/Button";

import FatherDetails from "./FatherDetails";
import GuardianDetail from "./GuardianDetail";

export const ParentGuardian: React.FC<any> = (props) => {
    const [guardianTypeState, setGuradianTypeState] = useState<any>("parent");
    function onChangeGuardianHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setGuradianTypeState(value);
    }
    return (
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 tw-flex tw-items-center tw-mb-2">
                <h5 className="tw-mb-1 tw-me-4">{props.titleName || "Parent/Guardian"}</h5>
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
            {(guardianTypeState === "parent") && <FatherDetails />}
            {(guardianTypeState === "guardian") && <GuardianDetail />}
            <div className="tw-col-span-12 tw-text-right tw-mt-2">
                <Button type="submit" variant="secondary" className="tw-me-2">
                    Previous
                </Button>
                <Button type="submit" variant="primary">
                    Proceed
                </Button>
            </div>
        </div>
    )
}