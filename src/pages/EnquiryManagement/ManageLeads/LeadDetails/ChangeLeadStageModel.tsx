import React, { useEffect, useState } from "react";
import { DateInput, SelectInput, TextArea } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";


export default function ChangeLeadStageModel(props: any) {

    function applyFilterHndlr() {

    }
    return (
        <React.Fragment>
            <div className="offcanvas-body">
                <SelectInput
                    name="leadStage"
                    value={""}
                      onChange={undefined}
                    menuItems={[]}
                    valueKey="leadStage"
                    textKey="leadStage"
                    defaultSelect="Lead Stage"
                />
                <SelectInput
                    name="leadSubStage"
                    value={""}
                      onChange={undefined}
                    menuItems={[]}
                    valueKey="leadSubStage"
                    textKey="leadSubStage"
                    defaultSelect="Lead Sub Stage"
                />
                <SelectInput
                    name="owner"
                    value={""}
                      onChange={undefined}
                    menuItems={[]}
                    valueKey="owner"
                    textKey="owner"
                    defaultSelect="Select Owner"
                />
                <SelectInput
                    name="timeZone"
                    value={""}
                      onChange={undefined}
                    menuItems={[]}
                    valueKey="timeZone"
                    textKey="timeZone"
                    defaultSelect="Time Zone"
                />
                <DateInput
                    name="startDate"
                    placeHolder="Follow-Up Date"
                    labelText="Follow-Up Date"
                    value={""}
                      onChange={undefined}
                />
                <DateInput
                    name="startDate"
                    placeHolder="Follow-Up End Date"
                    labelText="Follow-Up End Date"
                    value={""}
                    onChange={undefined}
                /> 
                <TextArea
                    name="notes"
                    value={""}
                    onChange={""}
                    placeHolder="Notes"

                />
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        // disabled={showApiLoader}
                        variant="primary"
                    >
                        Save
                    </Button>
                </div>
            <div className="tw-border-t tw-mt-3">
                <p className=" tw-text-base  tw-font-bold tw-mt-3">Previous Activities</p>
                
            </div>
            </div>
        </React.Fragment>

    )
}