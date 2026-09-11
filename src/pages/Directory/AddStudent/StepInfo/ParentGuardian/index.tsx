import React, { useState } from "react";
import { Label, Input } from "reactstrap";
//Common Component
import { ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput } from "../../../../../Components/Common";

import FatherDetails from "./FatherDetails";
import GuardianDetail from "./GuardianDetail";

export const ParentGuardian: React.FC<any> = (props) => {
    const [guardianTypeState, setGuradianTypeState] = useState<any>("parent");
    function onChangeGuardianHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setGuradianTypeState(value);
    }
    return (
        <div className="row">
            <div className="col-12 d-flex align-items-center mb-2">
                <h5 className="mb-1 me-4">{props.titleName || "Parent/Guardian"}</h5>
                <SelectInput
                    name="branchTypeId"
                    value={guardianTypeState}
                    onChange={onChangeGuardianHndlr}
                    formgroupClassName="mb-0"
                    menuItems={[{ id: "parent", name: "parent" }, { id: "guardian", name: "guardian" }]}
                    hideSelectOption={true}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            {(guardianTypeState === "parent") && <FatherDetails />}
            {(guardianTypeState === "guardian") && <GuardianDetail />}
            <div className="col-12 text-end mt-2">
                <button type="submit" className="btn btn-soft-success me-2">
                    Previous
                </button>
                <button type="submit" className="btn btn-success">
                    Proceed
                </button>
            </div>
        </div>
    )
}