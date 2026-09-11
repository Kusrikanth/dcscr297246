import React, { useState, useEffect } from "react";
import { shallowEqual } from "react-redux";

import {
     AccordionBody, AccordionHeader,
} from "reactstrap";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Common Component
import { TextIconInput, TextInput, SelectInput, PhoneInput,
    UploadImage,
    RadioInputContainer,  ShowUploadedImage
} from "../../../../Components/Common";
//helper
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";

import {
    getRelationTypeAct
} from "../../../../store/masterdata/masterdataactions";

export const trueFalseOptions: Array<any> = [
    {
        id: "true",
        name: "Yes",
    },
    {
        id: "false",
        name: "No",
    }
]

export default function GuardianDetails({ parentDetails, occupationResp, designationListResp }: any) {
    const dispatch = useAppDispatch();
    const { relationTypeListResp } =
        useAppSelector(({ masterData, instAcademics }) => ({
            relationTypeListResp: masterData.relationTypeListResp
        }), shallowEqual);


    useEffect(() => {
        dispatch(getRelationTypeAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "RELATION", pageNo: 0, pageSize: 100 })));
    }, []);

    return (
        <React.Fragment>
            <div>
                <AccordionHeader tag="h4" targetId="guardian-info">
                    Guardian Info
                </AccordionHeader>

                <AccordionBody accordionId="guardian-info">
                    {/* Top Section */}
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                        {/* Image */}
                        <div className="tw-col-span-12 md:tw-col-span-4 tw-flex tw-justify-center">
                            <ShowUploadedImage
                                name="mother-image"
                                value={undefined}
                                altText="mother image"
                            />
                        </div>

                        {/* Basic Details */}
                        <div className="tw-col-span-12 md:tw-col-span-8">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                                <div className="tw-col-span-12 md:tw-col-span-6">
                                    <RadioInputContainer
                                        name="isGuardianRequired"
                                        labelText="Guardian ?"
                                        inputContainerClassName="tw-mt-2"
                                        radioOptions={trueFalseOptions}
                                        value={parentDetails?.guardianName ? "true" : "false"}
                                        onChange={undefined}
                                        isDisabled={true}
                                        formgroupClassName="tw-mb-0"

                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-6">
                                    <TextInput
                                        name="guardianName"
                                        labelText="Name"
                                        value={parentDetails?.guardianName}
                                        onChange={undefined}
                                        isDisabled={true}
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-6">
                                    <TextInput
                                        name="guardianDocumentNumber"
                                        labelText="Aadhar Number"
                                        value={parentDetails?.guardianDocumentNumber}
                                        onChange={undefined}
                                        isDisabled={true}
                                        formgroupClassName="tw-mb-0"

                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-6">
                                    <TextIconInput
                                        name="guardianEmailId"
                                        labelText="Email ID"
                                        value={parentDetails?.guardianEmailId}
                                        onChange={undefined}
                                        isDisabled={true}
                                        formgroupClassName="tw-mb-0"
                                    >
                                        <i className="ri-mail-unread-line"></i>
                                    </TextIconInput>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Contact & Professional Details */}
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mt-4">

                        <div className="tw-col-span-12 md:tw-col-span-4">
                            <PhoneInput
                                name="guardianContactNo"
                                labelText="Phone No."
                                value={parentDetails?.guardianContactNo}
                                onChange={undefined}
                                isDisabled={true}
                                formgroupClassName="tw-mb-0"
                            />
                        </div>

                        <div className="tw-col-span-12 md:tw-col-span-4">
                            <PhoneInput
                                name="guardianWhatsappNo"
                                labelText="Guardian WhatsApp No."
                                value={parentDetails?.guardianWhatsappNo}
                                onChange={undefined}
                                isDisabled={true}
                                formgroupClassName="tw-mb-0"
                            />
                        </div>

                        <div className="tw-col-span-12 md:tw-col-span-4">
                            <SelectInput
                                name="guardianRelationTypeId"
                                labelText="Relation Type"
                                value={parentDetails?.guardianRelationTypeId}
                                onChange={undefined}
                                menuItems={relationTypeListResp?.data}
                                valueKey="id"
                                textKey="relationType"
                                isDisabled={true}
                                formgroupClassName="tw-mb-0"
                            />
                        </div>

                        <div className="tw-col-span-12 md:tw-col-span-4">
                            <TextInput
                                name="guardianOccupationName"
                                labelText="Occupation"
                                value={parentDetails?.guardianOccupationName}
                                onChange={undefined}
                                isDisabled={true}
                                formgroupClassName="tw-mb-0"
                            />
                        </div>

                        <div className="tw-col-span-12 md:tw-col-span-4">
                            <TextInput
                                name="guardianDesignationName"
                                labelText="Designation"
                                value={parentDetails?.guardianDesignationName}
                                onChange={undefined}
                                isDisabled={true}
                                formgroupClassName="tw-mb-0"
                            />
                        </div>

                    </div>
                </AccordionBody>
            </div>
        </React.Fragment>

    )
}