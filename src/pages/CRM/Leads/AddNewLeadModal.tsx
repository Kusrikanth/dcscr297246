import type { ReactNode } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    SelectInput,
    TextArea,
    TextInput,
} from "../../../Components/Common";

const academicYearOptions = [
    {
        id: "2027-2028",
        name: "2027-2028",
    },
];

const admissionTypeOptions = [
    {
        id: "",
        name: "Not specified admission type",
    },
    {
        id: "day-scholar",
        name: "Day Scholar",
    },
];

const curriculumOptions = [
    {
        id: "1",
        name: "Cambridge",
    },
    {
        id: "2",
        name: "Power BI",
    },
];

const classOptions = [
    {
        id: "1",
        name: "EY - 1",
    },
    {
        id: "2",
        name: "Class I",
    },
    {
        id: "3",
        name: "Class II",
    },
    {
        id: "4",
        name: "Class III",
    },
    {
        id: "5",
        name: "Class IV",
    },
];

const channelOptions = [
    {
        id: "",
        name: "Not specified channel",
    },
    {
        id: "phone-enquiry",
        name: "Phone enquiry",
    },
    {
        id: "walk-in",
        name: "Walk-in",
    },
    {
        id: "website",
        name: "Website",
    },
    {
        id: "email",
        name: "Email",
    },
    {
        id: "social-media",
        name: "Social media",
    },
    {
        id: "whatsapp",
        name: "WhatsApp",
    },
];

const sourceOptions = [
    {
        id: "",
        name: "Not specified source",
    },
    {
        id: "meta-ads",
        name: "Meta Ads",
    },
];

const campaignOptions = [
    {
        id: "",
        name: "Not specified campaign",
    },
    {
        id: "admissions-2026-27",
        name: "Admissions 2026-27",
    },
    {
        id: "general-enquiry",
        name: "General enquiry",
    },
    {
        id: "meta-ads",
        name: "Meta Ads",
    },
];

const stageOptions = [
    {
        id: "new",
        name: "New",
    },
    {
        id: "not-connected",
        name: "Not Connected",
    },
    {
        id: "campus-visit",
        name: "Campus Visit",
    },
    {
        id: "not-interested",
        name: "Not Interested",
    },
    {
        id: "lost",
        name: "Lost",
    },
    {
        id: "application",
        name: "Application",
    },
    {
        id: "admission-done",
        name: "Admission Done",
    },
];

const subStageOptions = [
    {
        id: "new-lead",
        name: "New Lead",
    },
    {
        id: "new-pending",
        name: "New - Pending",
    },
];

const leadOwnerOptions = [
    {
        id: "",
        name: "Not specified lead owner",
    },
    {
        id: "1",
        name: "Gulshan",
    },
    {
        id: "2",
        name: "ARJUN",
    },
];

const initialValues = {
    studentName: "",
    primaryPhone: "",
    alternatePhone: "",
    email: "",
    parentName: "",
    city: "",

    academicYear: "",
    branchId: "",
    admissionTypeId: "",
    curriculumId: "",
    classId: "",

    channelId: "",
    sourceId: "",
    campaignId: "",

    stageId: "",
    subStageId: "",
    leadOwnerId: "",
    nextFollowUp: "",
    followUpType: "",
    remarks: "",
    leadScore: "",
};

const validationSchema = Yup.object().shape({
    studentName: Yup.string()
        .trim()
        .required("Student Name is required"),

    primaryPhone: Yup.string()
        .trim()
        .required("Primary Phone is required")
        .matches(
            /^[0-9+ ]+$/,
            "Enter a valid phone number",
        ),

    alternatePhone: Yup.string()
        .trim()
        .matches(
            /^[0-9+ ]*$/,
            "Enter a valid phone number",
        ),

    email: Yup.string()
        .trim()
        .email("Enter a valid email address"),

    academicYear: Yup.string()
        .required("Academic Year is required"),

    branchId: Yup.string()
        .required("Branch is required"),

    curriculumId: Yup.string()
        .required("Curriculum is required"),

    classId: Yup.string()
        .required("Class is required"),

    stageId: Yup.string()
        .required("Stage is required"),

    subStageId: Yup.string()
        .required("Sub-stage is required"),

    leadScore: Yup.number()
        .typeError("Lead Score must be a number")
        .nullable(),
});

interface AddNewLeadModalProps {
    toggle: () => void;
    data?: Partial<typeof initialValues>;
}

const AddNewLeadModal = ({
    toggle,
    data,
}: AddNewLeadModalProps) => {
    const formik = useFormik({
        enableReinitialize: true,

        initialValues: data
            ? {
                studentName:
                    data?.studentName || "",

                primaryPhone:
                    data?.primaryPhone || "",

                alternatePhone:
                    data?.alternatePhone || "",

                email:
                    data?.email || "",

                parentName:
                    data?.parentName || "",

                city:
                    data?.city || "",

                academicYear:
                    data?.academicYear || "",

                branchId:
                    data?.branchId || "",

                admissionTypeId:
                    data?.admissionTypeId || "",

                curriculumId:
                    data?.curriculumId || "",

                classId:
                    data?.classId || "",

                channelId:
                    data?.channelId || "",

                sourceId:
                    data?.sourceId || "",

                campaignId:
                    data?.campaignId || "",

                stageId:
                    data?.stageId || "",

                subStageId:
                    data?.subStageId || "",

                leadOwnerId:
                    data?.leadOwnerId || "",

                nextFollowUp:
                    data?.nextFollowUp || "",

                followUpType:
                    data?.followUpType || "",

                remarks:
                    data?.remarks || "",

                leadScore:
                    data?.leadScore ?? "",
            }
            : initialValues,

        validationSchema,

        onSubmit: () => {
            toggle();
        },
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="tw-p-4"
        >
            <FormSectionTitle title="Lead name & contact details">
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4">
                        <TextInput
                            name="studentName"
                            labelText="Student Name"
                            placeHolder="Enter Student Name"
                            value={
                                formik.values.studentName
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                                !!(
                                    formik.touched
                                        .studentName &&
                                    formik.errors
                                        .studentName
                                )
                            }
                            error={
                                formik.touched
                                    .studentName &&
                                    formik.errors
                                        .studentName
                                    ? formik.errors
                                        .studentName
                                    : ""
                            }
                            labelClass="required"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <TextInput
                            name="primaryPhone"
                            labelText="Primary Phone"
                            placeHolder="Enter Primary Phone"
                            value={
                                formik.values.primaryPhone
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                                !!(
                                    formik.touched
                                        .primaryPhone &&
                                    formik.errors
                                        .primaryPhone
                                )
                            }
                            error={
                                formik.touched
                                    .primaryPhone &&
                                    formik.errors
                                        .primaryPhone
                                    ? formik.errors
                                        .primaryPhone
                                    : ""
                            }
                            labelClass="required"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <TextInput
                            name="alternatePhone"
                            labelText="Alternate Phone"
                            placeHolder="Enter Alternate Phone"
                            value={
                                formik.values
                                    .alternatePhone
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                                !!(
                                    formik.touched
                                        .alternatePhone &&
                                    formik.errors
                                        .alternatePhone
                                )
                            }
                            error={
                                formik.touched
                                    .alternatePhone &&
                                    formik.errors
                                        .alternatePhone
                                    ? formik.errors
                                        .alternatePhone
                                    : ""
                            }
                        />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <TextInput
                            name="email"
                            labelText="Email"
                            placeHolder="Enter Email"
                            value={
                                formik.values.email
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                                !!(
                                    formik.touched.email &&
                                    formik.errors.email
                                )
                            }
                            error={
                                formik.touched.email &&
                                    formik.errors.email
                                    ? formik.errors.email
                                    : ""
                            }
                        />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <TextInput
                            name="parentName"
                            labelText="Parent Name"
                            placeHolder="Enter Parent Name"
                            value={
                                formik.values.parentName
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <TextInput
                            name="city"
                            labelText="City"
                            placeHolder="Enter City"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                </div>
            </FormSectionTitle>

            <FormSectionTitle title="Academic requirements">
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4">
                        <SelectInput
                            name="academicYear"
                            labelText="Academic Year"
                            value={
                                formik.values.academicYear
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            menuItems={
                                academicYearOptions
                            }
                            valueKey="id"
                            textKey="name"
                            invalid={
                                !!(
                                    formik.touched
                                        .academicYear &&
                                    formik.errors
                                        .academicYear
                                )
                            }
                            error={
                                formik.touched
                                    .academicYear &&
                                    formik.errors
                                        .academicYear
                                    ? formik.errors
                                        .academicYear
                                    : ""
                            }
                            labelClass="required"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <SelectInput
                            name="admissionTypeId"
                            labelText="Admission Type"

                            value={
                                formik.values
                                    .admissionTypeId
                            }
                            onChange={formik.handleChange}
                            menuItems={
                                admissionTypeOptions
                            }
                            valueKey="id"
                            textKey="name"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <SelectInput
                            name="curriculumId"
                            labelText="Curriculum"

                            value={
                                formik.values
                                    .curriculumId
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            menuItems={
                                curriculumOptions
                            }
                            valueKey="id"
                            textKey="name"
                            invalid={
                                !!(
                                    formik.touched
                                        .curriculumId &&
                                    formik.errors
                                        .curriculumId
                                )
                            }
                            error={
                                formik.touched
                                    .curriculumId &&
                                    formik.errors
                                        .curriculumId
                                    ? formik.errors
                                        .curriculumId
                                    : ""
                            }
                            labelClass="required"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <SelectInput
                            name="classId"
                            labelText="Class"

                            value={
                                formik.values.classId
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            menuItems={classOptions}
                            valueKey="id"
                            textKey="name"
                            invalid={
                                !!(
                                    formik.touched
                                        .classId &&
                                    formik.errors
                                        .classId
                                )
                            }
                            error={
                                formik.touched.classId &&
                                    formik.errors.classId
                                    ? formik.errors
                                        .classId
                                    : ""
                            }
                            labelClass="required"
                        />
                    </div>
                </div>
            </FormSectionTitle>

            <FormSectionTitle title="Source details">
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4">
                        <SelectInput
                            name="channelId"
                            labelText="Channel"

                            value={
                                formik.values.channelId
                            }
                            onChange={formik.handleChange}
                            menuItems={
                                channelOptions
                            }
                            valueKey="id"
                            textKey="name"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <SelectInput
                            name="sourceId"
                            labelText="Source"

                            value={
                                formik.values.sourceId
                            }
                            onChange={formik.handleChange}
                            menuItems={
                                sourceOptions
                            }
                            valueKey="id"
                            textKey="name"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <SelectInput
                            name="campaignId"
                            labelText="Campaign"

                            value={
                                formik.values.campaignId
                            }
                            onChange={formik.handleChange}
                            menuItems={
                                campaignOptions
                            }
                            valueKey="id"
                            textKey="name"
                        />
                    </div>
                </div>
            </FormSectionTitle>

            <FormSectionTitle title="Follow-up details">
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4">
                        <SelectInput
                            name="stageId"
                            labelText="Stage"

                            value={
                                formik.values.stageId
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            menuItems={stageOptions}
                            valueKey="id"
                            textKey="name"
                            invalid={
                                !!(
                                    formik.touched
                                        .stageId &&
                                    formik.errors
                                        .stageId
                                )
                            }
                            error={
                                formik.touched.stageId &&
                                    formik.errors.stageId
                                    ? formik.errors
                                        .stageId
                                    : ""
                            }
                            labelClass="required"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <SelectInput
                            name="subStageId"
                            labelText="Sub-stage"

                            value={
                                formik.values
                                    .subStageId
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            menuItems={
                                subStageOptions
                            }
                            valueKey="id"
                            textKey="name"
                            invalid={
                                !!(
                                    formik.touched
                                        .subStageId &&
                                    formik.errors
                                        .subStageId
                                )
                            }
                            error={
                                formik.touched
                                    .subStageId &&
                                    formik.errors
                                        .subStageId
                                    ? formik.errors
                                        .subStageId
                                    : ""
                            }
                            labelClass="required"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <SelectInput
                            name="leadOwnerId"
                            labelText="Lead Owner"

                            value={
                                formik.values
                                    .leadOwnerId
                            }
                            onChange={formik.handleChange}
                            menuItems={
                                leadOwnerOptions
                            }
                            valueKey="id"
                            textKey="name"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <TextInput

                            name="nextFollowUp"
                            labelText="Next Follow-up"
                            placeHolder="Select Next Follow-up"
                            value={
                                formik.values
                                    .nextFollowUp
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    <div className="col-12">
                        <TextArea
                            name="remarks"
                            labelText="Remarks"
                            placeHolder="Enter Remarks"
                            value={
                                formik.values.remarks
                            }
                            onChange={
                                formik.handleChange
                            }
                            onBlur={
                                formik.handleBlur
                            }
                        />
                    </div>
                </div>
            </FormSectionTitle>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                >
                    {data
                        ? "Update Lead"
                        : "Add Lead"}
                </Button>
            </div>
        </form>
    );
};

export default AddNewLeadModal;

const FormSectionTitle = ({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) => {
    return (
        <div
            style={{
                position: "relative",
                display: "inline-block",
                width: "100%",
                padding: "20px",
                border: "1px solid #ced4da",
                borderRadius: "6px",
                marginTop: "14px",
                marginBottom: "22px",
            }}
        >
            <p
                style={{
                    position: "absolute",
                    top: "-11px",
                    padding: "0px 10px",
                    color: "#495057",
                    backgroundColor: "white",
                }}
            >
                {title}
            </p>
            {children}
        </div>
    );
};
