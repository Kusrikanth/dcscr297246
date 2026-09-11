import LeadViewMultiSelectGrid from "./LeadViewMultiSelectGrid";
import {
    type AcademicDetailsField,
    type AcademicDetailsState,
    type LeadViewOption,
} from "./types";
import { optionList } from "./utils";

interface AcademicDetailsTabProps {
    value: AcademicDetailsState;
    onChange: (
        selectedOptions: LeadViewOption[],
        config: { name: keyof AcademicDetailsState },
    ) => void;
}

const academicDetailsFields: AcademicDetailsField[] = [
    {
        id: "className",
        labelName: "Class",
        defaultSelect: "All classes",
        options: optionList([
            "Class I",
            "Class II",
            "Class IV",
            "Class V",
            "Class VIII",
        ]),
    },
    {
        id: "curriculum",
        labelName: "Curriculum",
        defaultSelect: "All curriculums",
        options: optionList([
            "CBSE",
            "Cambridge",
            "Integrated",
        ]),
    },
    {
        id: "admissionType",
        labelName: "Admission type",
        defaultSelect: "All admission types",
        options: optionList([
            "New Admission",
            "Transfer",
            "Readmission",
        ]),
    },
    {
        id: "referredFrom",
        labelName: "Referred from",
        defaultSelect: "All referrals",
        options: optionList([
            "Parent referral",
            "Staff referral",
            "Alumni",
            "Walk-in",
        ]),
    },
];

const AcademicDetailsTab = ({
    value,
    onChange,
}: AcademicDetailsTabProps) => {
    return (
        <LeadViewMultiSelectGrid
            fields={academicDetailsFields}
            value={value}
            onChange={onChange}
        />
    );
};

export default AcademicDetailsTab;
