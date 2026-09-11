import {
    useMemo,
    useState,
    ChangeEvent,
    MouseEvent,
} from "react";

import {
    Button,
    SelectInput,
    TextIconInput,
} from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import CampaignsTab from "./CampaignsTab";
import DownloadsTab from "./DownloadsTab";
import StageChangesTab from "./StageChangesTab";
import UploadsTab from "./UploadsTab";
import {
    bulkActionStatusOptions,
    bulkOperationRecords as sampleOperations,
    bulkUploadRecords as sampleUploads,
    dialerCampaignRecords as sampleCampaigns,
    downloadRecords as sampleDownloads,
    type DownloadRecord,
    initialFilterState,
    type BulkActionsFilterState,
    type BulkOperationRecord,
    type BulkUploadRecord,
    type DialerCampaignRecord,
} from "./helper";
import { toast } from "react-toastify";

const BulkActions = () => {
    const [activeId, setActiveId] =
        useState<string>("uploads");
    const [uploads, setUploads] =
        useState<Array<BulkUploadRecord>>(sampleUploads);
    const [operations, setOperations] = useState<
        Array<BulkOperationRecord>
    >(sampleOperations);
    const [campaigns, setCampaigns] = useState<
        Array<DialerCampaignRecord>
    >(sampleCampaigns);
    const [downloads, setDownloads] =
        useState<Array<DownloadRecord>>(sampleDownloads);
    const [filterState, setFilterState] =
        useState<BulkActionsFilterState>(initialFilterState);

    const menuOptions = useMemo(
        () => [
            {
                id: "uploads",
                labelName: "Uploads",
                customPadding: "0px 10px 0px 10px",
                count: uploads.length,
            },
            {
                id: "operations",
                labelName: "Stage Changes",
                customPadding: "0px 10px 0px 10px",
                count: operations.length,
            },
            {
                id: "downloads",
                labelName: "Downloads",
                customPadding: "0px 10px 0px 10px",
                count: downloads.length,
            },
            {
                id: "campaigns",
                labelName: "Campaigns",
                customPadding: "0px 10px 0px 10px",
                count: campaigns.length,
            },
        ],
        [
            campaigns.length,
            downloads.length,
            operations.length,
            uploads.length,
        ],
    );

    const clickMenuHandler = (
        event: MouseEvent<HTMLElement>,
    ) => {
        const menuId =
            event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setActiveId(menuId);
        }
    };

    const filterChangeHandler = (
        event: ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = event.target;

        setFilterState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const dateRangeChangeHandler = (dates: {
        startDate: string;
        endDate: string;
    }) => {
        setFilterState(prevState => ({
            ...prevState,
            startDate: dates.startDate,
            endDate: dates.endDate,
        }));
    };

    const resetFilterHandler = () => {
        setFilterState(initialFilterState);
    };

    const refreshHandler = () => {
        setUploads(sampleUploads);
        setOperations(sampleOperations);
        setCampaigns(sampleCampaigns);
        setDownloads(sampleDownloads);
        toast.success("Bulk action history refreshed");
    };

    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb pageTitle="CRM" />

                <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                    <div className="tw-flex-1">
                        <UpdatedHorizontalTab
                            MenuOptions={menuOptions}
                            clickMenuHandler={clickMenuHandler}
                            activeTabId={activeId}
                            showBadge
                            horizontalClass=""
                        />
                    </div>
                </div>

                <div className="tw-card tw-mt-3">
                    <div className="tw-card-header">
                        <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                            <h4 className="tw-card-title">Bulk Actions</h4>
                            <div className="tw-flex tw-items-center tw-gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="!tw-h-9 !tw-w-9 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                    title="Refresh bulk action history"
                                    aria-label="Refresh bulk action history"
                                    onClick={refreshHandler}
                                >
                                    <i className="ri-refresh-line"></i>
                                </Button>
                                <Button
                                    type="button"
                                    variant="reject"
                                    onClick={resetFilterHandler}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="tw-border-b tw-border-gray-200 tw-p-3">
                        <div className="row tw-items-end tw-gap-y-3">
                            <div className="col-12 col-md-6 col-xl-4">
                                <TextIconInput
                                    formgroupClassName="search-box tw-mb-0"
                                    name="searchString"
                                    value={
                                        filterState.searchString
                                    }
                                    onChange={
                                        filterChangeHandler
                                    }
                                    placeHolder="Search file, operation or campaign…"
                                    labelText="Search"
                                    floatingLabel
                                >
                                    <i className="ri-search-line search-icon"></i>
                                </TextIconInput>
                            </div>

                            <div className="col-12 col-md-6 col-xl-3">
                                <SelectInput
                                    name="status"
                                    labelText="Status"
                                    defaultSelect="All statuses"
                                    value={filterState.status}
                                    onChange={
                                        filterChangeHandler
                                    }
                                    menuItems={
                                        bulkActionStatusOptions
                                    }
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>
                        </div>
                    </div>

                    {activeId === "uploads" && (
                        <UploadsTab uploads={uploads} />
                    )}

                    {activeId === "operations" && (
                        <StageChangesTab operations={operations} />
                    )}

                    {activeId === "downloads" && (
                        <DownloadsTab downloads={downloads} />
                    )}

                    {activeId === "campaigns" && (
                        <CampaignsTab campaigns={campaigns} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BulkActions;
