import React, { useEffect, useState } from "react";
import { DateInput, SelectInput, TextArea, TextInput } from "../../../../Components/Common";
import "./progress.scss";
import Button from "../../../../Components/Common/Button";


export default function AddEventModel(props: any) {

    function applyFilterHndlr() {

    }
    return (
        <React.Fragment>
            <div className="offcanvas-body">
                <SelectInput
                    name="eventType"
                    value={""}
                    onChange={undefined}
                    menuItems={[]}
                    valueKey="eventType"
                    textKey="eventType"
                    defaultSelect="Event Type"
                />
                <TextInput
                    name="applicant"
                    value={""}
                    onChange={undefined}
                    placeHolder="Applicant"
                    isDisabled={true}

                />
                <TextInput
                    name="subject"
                    value={""}
                    onChange={undefined}
                    placeHolder="Subject"
                    isDisabled={false}

                />
                <div className="tw-relative tw-inline-block tw-w-full tw-p-3 tw-mb-3 tw-rounded tw-border tw-mt-3">
                    <p className='tw-text-base tw-text-gray-500 filter-container' >Event Duration</p>
                    <DateInput
                        name="fromDate"
                        placeHolder="From"
                        labelText="From"
                        value={""}
                        onChange={undefined}
                    />
                    <DateInput
                        name="toDate"
                        placeHolder="To"
                        labelText="To"

                        value={""}
                        onChange={undefined}
                    />
                </div>
                <SelectInput
                    name="owner"
                    value={""}
                    onChange={undefined}
                    menuItems={[]}
                    valueKey="owner"
                    textKey="owner"
                    defaultSelect="Owner"
                />
                <TextInput
                    name="organiser"
                    value={""}
                    onChange={undefined}
                    placeHolder="Organiser"
                    isDisabled={true}


                />
                <TextArea
                    name="description"
                    value={""}
                    onChange={""}
                    placeHolder="Description"

                />
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        // disabled={showApiLoader}
                        variant="primary"
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </React.Fragment>

    )
}