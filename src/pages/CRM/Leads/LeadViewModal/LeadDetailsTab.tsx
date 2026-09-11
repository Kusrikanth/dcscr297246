import LeadViewMultiSelectGrid from "./LeadViewMultiSelectGrid";
import {
    type LeadDetailsField,
    type LeadDetailsState,
    type LeadViewOption,
} from "./types";
import { optionList } from "./utils";

interface LeadDetailsTabProps {
    value: LeadDetailsState;
    onChange: (
        selectedOptions: LeadViewOption[],
        config: { name: keyof LeadDetailsState },
    ) => void;
}

const leadDetailsFields: LeadDetailsField[] = [
    {
        id: "touchStatus",
        labelName: "Touch status",
        defaultSelect: "Any touch status",
        options: optionList(["Touched", "Untouched"]),
    },
    {
        id: "leadAddedVia",
        labelName: "Lead added via",
        defaultSelect: "Lead added via",
        options: optionList([
            "Manually added",
            "Imported",
            "Website form",
        ]),
    },
    {
        id: "branch",
        labelName: "Branch",
        defaultSelect: "All branches",
        options: optionList([
            "Nacharam",
            "Bowenpally",
            "Mahendra Hills",
        ]),
    },
    {
        id: "currentStage",
        labelName: "Current stage",
        defaultSelect: "All stages",
        options: optionList([
            "New",
            "Not Connected",
            "Campus Visit",
            "Application",
            "Admission Done",
        ]),
    },
    {
        id: "subStage",
        labelName: "Sub-stage",
        defaultSelect: "All sub-stages",
        options: optionList([
            "New Lead",
            "Call attempted",
            "Campus visit done",
        ]),
    },
    {
        id: "leadSource",
        labelName: "Lead source",
        defaultSelect: "All sources",
        options: optionList([
            "Meta Ads",
            "Website",
            "Google Ads",
            "Walk-in",
        ]),
    },
    {
        id: "counsellorReferredTo",
        labelName: "Counsellor referred to",
        defaultSelect: "All counsellors",
        options: optionList([
            "ARJUN",
            "Gulshan",
            "Unassigned",
        ]),
    },
    {
        id: "campaignCategory",
        labelName: "Campaign category",
        defaultSelect: "All campaign categories",
        options: optionList([
            "Admissions",
            "Transport",
            "Events",
        ]),
    },
    {
        id: "campaignName",
        labelName: "Campaign name",
        defaultSelect: "All campaigns",
        options: optionList([
            "IIT JEE Orientation",
            "Transport Reminder",
            "Admissions 2026",
        ]),
    },
    {
        id: "channelCategory",
        labelName: "Channel category",
        defaultSelect: "All channel categories",
        options: optionList([
            "Digital",
            "Offline",
            "Referral",
        ]),
    },
    {
        id: "channel",
        labelName: "Channel",
        defaultSelect: "All channels",
        options: optionList([
            "WhatsApp",
            "Phone",
            "Email",
            "Walk-in",
        ]),
    },
];

const LeadDetailsTab = ({
    value,
    onChange,
}: LeadDetailsTabProps) => {
    return (
        <LeadViewMultiSelectGrid
            fields={leadDetailsFields}
            value={value}
            onChange={onChange}
        />
    );
};

export default LeadDetailsTab;
