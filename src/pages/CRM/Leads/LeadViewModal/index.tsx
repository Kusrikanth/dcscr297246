import {
    useState,
    type ChangeEvent,
    type MouseEvent,
} from "react";

import {
    Button,
    SelectInput,
    TextInput,
} from "../../../../Components/Common";
import AcademicDetailsTab from "./AcademicDetailsTab";
import CommunicationDetailsTab from "./CommunicationDetailsTab";
import DateFiltersTab from "./DateFiltersTab";
import LeadDetailsTab from "./LeadDetailsTab";
import MarketingCampaignsTab from "./MarketingCampaignsTab";
import RangeFiltersTab from "./RangeFiltersTab";
import {
    type AcademicDetailsState,
    type DateFiltersFieldName,
    type DateFiltersState,
    type DateRangeValue,
    type CommunicationDetailsState,
    type LeadDetailsState,
    type LeadViewOption,
    type MarketingCampaignsState,
    type RangeFiltersState,
} from "./types";

interface LeadViewModalProps {
    toggle: () => void;
}

const initialLeadDetailsState: LeadDetailsState = {
    touchStatus: [],
    leadAddedVia: [],
    branch: [],
    currentStage: [],
    subStage: [],
    leadSource: [],
    counsellorReferredTo: [],
    campaignCategory: [],
    campaignName: [],
    channelCategory: [],
    channel: [],
};

const initialAcademicDetailsState: AcademicDetailsState = {
    className: [],
    curriculum: [],
    admissionType: [],
    referredFrom: [],
};

const initialCommunicationDetailsState: CommunicationDetailsState = {
    studentName: "",
    primaryPhone: "",
    alternatePhone: "",
    email: "",
    parentName: "",
};

const initialRangeFiltersState: RangeFiltersState = {
    minimumLeadScore: "",
    maximumLeadScore: "",
};

const initialMarketingCampaignsState: MarketingCampaignsState = {
    bulkMarketingCampaign: [],
    whatsappDeliveryStatus: [],
};

const emptyDateRange = {
    startDate: "",
    endDate: "",
};

const initialDateFiltersState: DateFiltersState = {
    added: emptyDateRange,
    updated: emptyDateRange,
    referred: emptyDateRange,
    nextFollowUp: emptyDateRange,
    reEnquired: emptyDateRange,
};

const savedViewOptions = [
    {
        id: "today-followups",
        name: "Today follow-ups",
    },
    {
        id: "new-leads",
        name: "New leads",
    },
];

const leadViewSideBarMenu = [
    {
        id: "lead-details",
        labelName: "Lead details",
    },
    {
        id: "academic-details",
        labelName: "Academic details",
    },
    {
        id: "communication-details",
        labelName: "Communication details",
    },
    {
        id: "marketing-campaigns",
        labelName: "Marketing campaigns",
    },
    {
        id: "date-filters",
        labelName: "Date filters",
    },
    {
        id: "range-filters",
        labelName: "Range filters",
    },
];

const EmptyViewTab = ({
    labelName,
}: {
    labelName: string;
}) => {
    return (
        <div className="tw-card tw-mb-0">
            <div className="tw-card-body">
                <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                    {labelName} filters will be configured next.
                </p>
            </div>
        </div>
    );
};

const LeadViewModal = ({ toggle }: LeadViewModalProps) => {
    const [activeMenuId, setActiveMenuId] =
        useState<string>("lead-details");
    const [savedViewId, setSavedViewId] =
        useState<string>("default");
    const [viewName, setViewName] =
        useState<string>("");
    const [leadDetailsState, setLeadDetailsState] =
        useState<LeadDetailsState>(
            initialLeadDetailsState,
        );
    const [
        academicDetailsState,
        setAcademicDetailsState,
    ] = useState<AcademicDetailsState>(
        initialAcademicDetailsState,
    );
    const [
        communicationDetailsState,
        setCommunicationDetailsState,
    ] = useState<CommunicationDetailsState>(
        initialCommunicationDetailsState,
    );
    const [rangeFiltersState, setRangeFiltersState] =
        useState<RangeFiltersState>(
            initialRangeFiltersState,
        );
    const [
        marketingCampaignsState,
        setMarketingCampaignsState,
    ] = useState<MarketingCampaignsState>(
        initialMarketingCampaignsState,
    );
    const [dateFiltersState, setDateFiltersState] =
        useState<DateFiltersState>(
            initialDateFiltersState,
        );

    const menuClickHandler = (
        event: MouseEvent<HTMLElement>,
    ) => {
        const menuId =
            event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setActiveMenuId(menuId);
        }
    };

    const savedViewChangeHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        setSavedViewId(event.target.value);
    };

    const viewNameChangeHandler = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        setViewName(event.target.value);
    };

    const leadDetailsChangeHandler = (
        selectedOptions: LeadViewOption[],
        config: { name: keyof LeadDetailsState },
    ) => {
        setLeadDetailsState(prevState => ({
            ...prevState,
            [config.name]: selectedOptions,
        }));
    };

    const academicDetailsChangeHandler = (
        selectedOptions: LeadViewOption[],
        config: { name: keyof AcademicDetailsState },
    ) => {
        setAcademicDetailsState(prevState => ({
            ...prevState,
            [config.name]: selectedOptions,
        }));
    };

    const communicationDetailsChangeHandler = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = event.target;

        setCommunicationDetailsState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const rangeFilterChangeHandler = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = event.target;

        setRangeFiltersState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const marketingCampaignsChangeHandler = (
        selectedOptions: LeadViewOption[],
        config: {
            name: keyof MarketingCampaignsState;
        },
    ) => {
        setMarketingCampaignsState(prevState => ({
            ...prevState,
            [config.name]: selectedOptions,
        }));
    };

    const dateFilterChangeHandler = (
        name: DateFiltersFieldName,
        dates: DateRangeValue,
    ) => {
        setDateFiltersState(prevState => ({
            ...prevState,
            [name]: dates,
        }));
    };

    const resetHandler = () => {
        setLeadDetailsState(initialLeadDetailsState);
        setAcademicDetailsState(
            initialAcademicDetailsState,
        );
        setCommunicationDetailsState(
            initialCommunicationDetailsState,
        );
        setRangeFiltersState(initialRangeFiltersState);
        setMarketingCampaignsState(
            initialMarketingCampaignsState,
        );
        setDateFiltersState(initialDateFiltersState);
        setSavedViewId("default");
        setViewName("");
    };

    const activeMenu =
        leadViewSideBarMenu.find(
            item => item.id === activeMenuId,
        );

    const activeComponent = (() => {
        switch (activeMenuId) {
            case "lead-details":
                return (
                    <LeadDetailsTab
                        value={leadDetailsState}
                        onChange={
                            leadDetailsChangeHandler
                        }
                    />
                );
            case "academic-details":
                return (
                    <AcademicDetailsTab
                        value={academicDetailsState}
                        onChange={
                            academicDetailsChangeHandler
                        }
                    />
                );
            case "communication-details":
                return (
                    <CommunicationDetailsTab
                        value={communicationDetailsState}
                        onChange={
                            communicationDetailsChangeHandler
                        }
                    />
                );
            case "range-filters":
                return (
                    <RangeFiltersTab
                        value={rangeFiltersState}
                        onChange={rangeFilterChangeHandler}
                    />
                );
            case "marketing-campaigns":
                return (
                    <MarketingCampaignsTab
                        value={marketingCampaignsState}
                        onChange={
                            marketingCampaignsChangeHandler
                        }
                    />
                );
            case "date-filters":
                return (
                    <DateFiltersTab
                        value={dateFiltersState}
                        onChange={dateFilterChangeHandler}
                    />
                );
            default:
                return (
                    <EmptyViewTab
                        labelName={
                            activeMenu?.labelName ||
                            "This section"
                        }
                    />
                );
        }
    })();

    return (
        <div className="tw-flex tw-h-[78vh] tw-flex-col tw-bg-white">
            <div className="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                <div className="tw-flex tw-items-center tw-gap-3">
                    <div className="tw-w-[360px]">
                        <SelectInput
                            name="savedViewId"
                            value={savedViewId}
                            onChange={
                                savedViewChangeHandler
                            }
                            labelText="Select View"
                            menuItems={savedViewOptions}
                            valueKey="id"
                            textKey="name"
                            formgroupClassName="tw-mb-0"
                            inputClassName=""
                            floatingLabel
                        />
                    </div>
                </div>
            </div>

            <div className="tw-flex tw-flex-1 tw-gap-3 tw-overflow-hidden tw-bg-gray-50 tw-p-3">
                <div className="tw-w-1/3 tw-flex-shrink-0 lg:tw-w-1/4">
                    <div className="tw-bg-white tw-shadow tw-rounded-lg">
                        <ul className="tw-list-none tw-p-0 tw-m-0">
                            {leadViewSideBarMenu.map(item => (
                                <li
                                    key={item.id}
                                    data-id={item.id}
                                    onClick={menuClickHandler}
                                    className={`tw-cursor-pointer tw-py-2 tw-px-4 tw-border-b tw-border-gray-100 ${item.id === activeMenuId
                                        ? "tw-bg-[#4051891a] tw-text-[#405189] tw-font-medium"
                                        : "hover:tw-bg-gray-50"
                                        }`}
                                >
                                    {item.labelName}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="tw-w-2/3 tw-overflow-y-auto lg:tw-w-3/4">
                    {activeComponent}
                </div>
            </div>

            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3 tw-border-t tw-border-gray-200 tw-bg-white tw-px-4 tw-py-3">
                <div className="tw-w-full md:tw-w-[360px]">
                    <TextInput
                        name="viewName"
                        value={viewName}
                        onChange={viewNameChangeHandler}
                        placeHolder="Name this filter or view"
                        formgroupClassName="tw-mb-0"
                        inputClassName="tw-h-12"
                    />
                </div>

                <div className="tw-flex tw-flex-wrap tw-gap-2">
                    <Button
                        type="button"
                        variant="hoverInfo"
                        onClick={resetHandler}
                    >
                        <i className="ri-reset-left-line"></i>
                        Reset
                    </Button>
                    <Button
                        type="button"
                        variant="hoverInfo"
                    >
                        <i className="ri-save-3-line"></i>
                        Save filter
                    </Button>
                    <Button
                        type="button"
                        variant="hoverInfo"
                    >
                        <i className="ri-filter-3-line"></i>
                        Save view
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={toggle}
                    >
                        Apply filter
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LeadViewModal;
