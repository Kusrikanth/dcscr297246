
import {
     AccordionBody,
    AccordionHeader
} from "reactstrap";


import {
     TextIconInput, TextInput, SelectInput, PhoneInput, ShowUploadedImage
} from "../../../../Components/Common";

export default function FatherInfo({ parentDetails, occupationResp, designationListResp, qualificationsListResp }: any) {
    return (
        <div>
            <AccordionHeader tag="h4" targetId="father-info">
                Father Info
            </AccordionHeader>

            <AccordionBody accordionId="father-info">
                {/* Top Section */}
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                    {/* Image */}
                    <div className="tw-col-span-12 md:tw-col-span-4 tw-flex tw-items-center tw-justify-center">
                        <ShowUploadedImage
                            name="father-image"
                            value={undefined}
                            altText="father image"
                        />
                    </div>

                    {/* Basic Details */}
                    <div className="tw-col-span-12 md:tw-col-span-8">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <TextInput
                                    name="fatherName"
                                    labelText="Name"
                                    formgroupClassName="tw-mb-0"
                                    value={parentDetails?.fatherName}
                                    onChange={undefined}
                                    isReadOnly={true}
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <TextInput
                                    name="fatherDocumentNumber"
                                    labelText="Aadhar Number"
                                    formgroupClassName="tw-mb-0"
                                    value={parentDetails?.fatherDocumentNumber}
                                    onChange={undefined}
                                    isReadOnly={true}
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <TextIconInput
                                    name="fatherEmailId"
                                    labelText="Email ID"
                                    formgroupClassName="tw-mb-0"
                                    value={parentDetails?.fatherEmailId}
                                    onChange={undefined}
                                    isReadOnly={true}
                                >
                                    <i className="ri-mail-unread-line"></i>
                                </TextIconInput>
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <PhoneInput
                                    name="fatherContactNo"
                                    labelText="Phone No."
                                    formgroupClassName="tw-mb-0"
                                    value={parentDetails?.fatherContactNo}
                                    onChange={undefined}
                                    isDisabled={true}
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <PhoneInput
                                    name="fatherWhatsappNo"
                                    labelText="Father WhatsApp No."
                                    formgroupClassName="tw-mb-0"
                                    value={parentDetails?.fatherWhatsappNo}
                                    onChange={undefined}
                                    isDisabled={true}
                                />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Professional Details */}
                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mt-4">

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="fatherQualificationName"
                            labelText="Qualification"
                            formgroupClassName="tw-mb-0"
                            value={parentDetails?.fatherQualificationName}
                            onChange={undefined}
                            isReadOnly={true}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="fatherOccupationName"
                            labelText="Occupation"
                            formgroupClassName="tw-mb-0"
                            value={parentDetails?.fatherOccupationName}
                            onChange={undefined}
                            isReadOnly={true}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="fatherOrganizationName"
                            labelText="Company"
                            formgroupClassName="tw-mb-0"
                            value={parentDetails?.fatherOrganizationName}
                            onChange={undefined}
                            isReadOnly={true}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="fatherDesignationName"
                            labelText="Designation"
                            formgroupClassName="tw-mb-0"
                            value={parentDetails?.fatherDesignationName}
                            onChange={undefined}
                            isReadOnly={true}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="fatherGraduationName"
                            labelText="Graduation"
                            formgroupClassName="tw-mb-0"
                            value={parentDetails?.fatherGraduationName}
                            onChange={undefined}
                            isReadOnly={true}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="fatherIncomeId"
                            labelText="Annual Income"
                            formgroupClassName="tw-mb-0"
                            value={parentDetails?.fatherAnnualIncome}
                            onChange={undefined}
                            isReadOnly={true}
                        />
                    </div>

                    <div className="tw-col-span-12">
                        <TextInput
                            name="fatherOfficeAddress"
                            labelText="Office Address"
                            formgroupClassName="tw-mb-0"
                            value={parentDetails?.fatherOfficeAddress}
                            onChange={undefined}
                            isReadOnly={true}
                        />
                    </div>

                </div>
            </AccordionBody>
        </div>
    )
}