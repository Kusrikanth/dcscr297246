import LeadViewMultiSelectGrid from "./LeadViewMultiSelectGrid";
import {
    type LeadViewOption,
    type MarketingCampaignsField,
    type MarketingCampaignsState,
} from "./types";
import { optionList } from "./utils";

interface MarketingCampaignsTabProps {
    value: MarketingCampaignsState;
    onChange: (
        selectedOptions: LeadViewOption[],
        config: { name: keyof MarketingCampaignsState },
    ) => void;
}

const marketingCampaignFields: MarketingCampaignsField[] = [
    {
        id: "bulkMarketingCampaign",
        labelName: "Bulk marketing campaign",
        defaultSelect: "All bulk marketing campaigns",
        options: optionList([
            "Admissions 2026",
            "Transport Reminder",
            "IIT JEE Orientation",
        ]),
    },
    {
        id: "whatsappDeliveryStatus",
        labelName: "WhatsApp delivery status",
        defaultSelect: "All WhatsApp statuses",
        options: optionList([
            "Delivered",
            "Failed",
            "Read",
            "Pending",
        ]),
    },
];

const MarketingCampaignsTab = ({
    value,
    onChange,
}: MarketingCampaignsTabProps) => {
    return (
        <LeadViewMultiSelectGrid
            fields={marketingCampaignFields}
            value={value}
            onChange={onChange}
        />
    );
};

export default MarketingCampaignsTab;
