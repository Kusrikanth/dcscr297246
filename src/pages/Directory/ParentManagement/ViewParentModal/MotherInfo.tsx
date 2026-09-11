
import {
 AccordionBody,
    AccordionHeader,
} from "reactstrap";

import {
    TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, ShowUploadedImage
} from "../../../../Components/Common";

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

export default function MotherInfo({ parentDetails, occupationResp, designationListResp, qualificationsListResp }: any) {

    return (
        <div>
            <AccordionHeader tag="h4" targetId="mother-info">
                Mother Info
            </AccordionHeader>

            <AccordionBody accordionId="mother-info">
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
                                <TextInput
                                    name="motherName"
                                    labelText="Name"
                                    value={parentDetails?.motherName}
                                    onChange={undefined}
                                    isDisabled={true}
                                    formgroupClassName="tw-mb-0"

                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <TextInput
                                    name="motherDocumentNumber"
                                    labelText="Aadhar Number"
                                    value={parentDetails?.motherDocumentNumber}
                                    onChange={undefined}
                                    isDisabled={true}
                                    maxLength={12}
                                    formgroupClassName="tw-mb-0"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <TextIconInput
                                    name="motherEmailId"
                                    labelText="Email ID"
                                    value={parentDetails?.motherEmailId}
                                    onChange={undefined}
                                    isDisabled={true}
                                    formgroupClassName="tw-mb-0"
                                >
                                    <i className="ri-mail-unread-line"></i>
                                </TextIconInput>
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <PhoneInput
                                    name="motherContactNo"
                                    labelText="Phone No."
                                    value={parentDetails?.motherContactNo}
                                    onChange={undefined}
                                    isDisabled={true}
                                    formgroupClassName="tw-mb-0"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <PhoneInput
                                    name="fatherWhatsappNo"
                                    labelText="Mother WhatsApp No."
                                    value={parentDetails?.motherWhatsappNo}
                                    onChange={undefined}
                                    isDisabled={true}
                                    formgroupClassName="tw-mb-0"
                                />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Professional & Other Details */}
                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mt-4">

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="motherQualificationName"
                            labelText="Qualification"
                            value={parentDetails?.motherQualificationName}
                            onChange={undefined}
                            isDisabled={true}
                            formgroupClassName="tw-mb-0"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="motherOccupationName"
                            labelText="Occupation"
                            value={parentDetails?.motherOccupationName}
                            onChange={undefined}
                            isDisabled={true}
                            formgroupClassName="tw-mb-0"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="motherOrganizationName"
                            labelText="Company"
                            value={parentDetails?.motherOrganizationName}
                            onChange={undefined}
                            isDisabled={true}
                            formgroupClassName="tw-mb-0"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="motherDesignationName"
                            labelText="Designation"
                            value={parentDetails?.motherDesignationName}
                            onChange={undefined}
                            isDisabled={true}
                            formgroupClassName="tw-mb-0"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="motherIncomeId"
                            labelText="Annual Income"
                            value={parentDetails?.motherAnnualIncome}
                            onChange={undefined}
                            isDisabled={true}
                            maxLength={10}
                            formgroupClassName="tw-mb-0"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <RadioInputContainer
                            name="isSingleParent"
                            labelText="Is Single Parent ?"
                            inputContainerClassName="tw-mt-2"
                            radioOptions={trueFalseOptions}
                            value={parentDetails?.isSingleParent}
                            isDisabled={true}
                            onChange={undefined}
                            formgroupClassName="tw-mb-0"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="SingleParentType"
                            labelText="Single Parent Type"
                            value={""}
                            onChange={() => { }}
                            menuItems={[
                                { id: "divorce", name: "Divorce" },
                                { id: "Legally Separated", name: "Legally Separated" },
                                { id: "Widow", name: "Widow" },
                                { id: "Widower", name: "Widower" },
                            ]}
                            valueKey="id"
                            textKey="name"
                            isDisabled={true}
                            formgroupClassName="tw-mb-0"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="motherGraduationName"
                            labelText="Graduation"
                            value={parentDetails?.motherGraduationName}
                            onChange={undefined}
                            isDisabled={true}
                            maxLength={10}
                            formgroupClassName="tw-mb-0"
                        />
                    </div>

                    <div className="tw-col-span-12">
                        <TextInput
                            name="motherOfficeAddress"
                            labelText="Office Address"
                            value={parentDetails?.motherOfficeAddress}
                            onChange={undefined}
                            isDisabled={true}
                            formgroupClassName="tw-mb-0"
                        />
                    </div>

                </div>
            </AccordionBody>
        </div>
    )
}