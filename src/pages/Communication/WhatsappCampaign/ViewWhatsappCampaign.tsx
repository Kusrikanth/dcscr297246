import { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";

import {
  Cancel01Icon,
  CheckmarkBadge03Icon,
  Delete02StrokeStandard,
  Download01Icon,
  EyeIcon,
  FilterIcon,
  Message01Icon,
  PencilEdit02Icon,
  PieChartIcon,
  ReloadIcon,
  SentIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import TableContainer from "../../Progress/DummyTable";
import {
  generateColumns,
  recipientsGenerateColumns,
  recipientsTableData,
  statusOptions,
  tableData,
} from "./helper";
import { SelectInput, TextInput } from "../../../Components/Common";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

function Overview() {
  return (
    <div>
      <CampaignStatsRow></CampaignStatsRow>
      <MessagePreviewStatic></MessagePreviewStatic>
    </div>
  );
}
function Recipients() {
  const tableColumns = useMemo(() => recipientsGenerateColumns(), []);

  return (
    <div className="row">
      <div className="col-12 tw-mb-6">
        <div className="row tw-g-1 tw-items-center tw-w-full tw-mx-auto">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="search-box">
              <TextInput
                name="searchString"
                value=""
                placeHolder="Search..."
                onChange={() => {}}
                labelText="Search"
                floatingLabel
                formgroupClassName="mb-0"
              ></TextInput>
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <SelectInput
              name="status"
              labelText="Status"
              onChange={() => {}}
              menuItems={statusOptions || []}
              valueKey="value"
              textKey="label"
              floatingLabel
              formgroupClassName="mb-0"
            ></SelectInput>
          </div>
          <div className="col-auto ms-auto">
            <div className="tw-flex tw-items-center tw-gap-2">
              <button className="btn btn-sm btn-outline-secondary">
                <HugeiconsIcon icon={ReloadIcon} size={16} className="me-2" />
                Export
              </button>
              <button className="btn btn-sm btn-outline-danger">
                <HugeiconsIcon
                  icon={Download01Icon}
                  size={16}
                  className="me-2"
                />
                Retry Failed
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <TableContainer
          columns={tableColumns || []}
          data={recipientsTableData || []}
          tableClass="mb-0"
          divClass="table-responsive mb-3 tw-border tw-rounded"
          theadClass="table-light text-muted align-middle"
          showPagination={true}
          totalPages={0}
          totalRecords={0}
          callbackPaginationHndlr={() => {}}
          currentPageNumber={0}
        ></TableContainer>
      </div>
    </div>
  );
}

const stats = [
  {
    label: "Sent",
    value: 312,
    icon: SentIcon,
  },
  {
    label: "Delivered",
    value: 298,
    icon: CheckmarkBadge03Icon,
  },
  {
    label: "Read",
    value: 261,
    icon: EyeIcon,
  },
  {
    label: "Clicked",
    value: 104,
    icon: Message01Icon,
  },
  {
    label: "Failed",
    value: 14,
    icon: Cancel01Icon,
  },
];

function CampaignStatsRow() {
  return (
    <div className="tw-w-full tw-mb-6">
      <div className="tw-grid tw-grid-cols-2 tw-gap-3 sm:tw-grid-cols-3 lg:tw-grid-cols-5">
        {stats.map((s) => (
          <div className="tw-w-full tw-rounded-xl tw-border tw-border-slate-200 tw-bg-white tw-px-4 tw-py-3 tw-shadow-sm">
            <div className="tw-flex tw-items-start tw-justify-between">
              <div className="tw-min-w-0">
                <p className="tw-text-xs tw-font-medium tw-text-slate-500 tw-mb-2">
                  {s.label}
                </p>
                <p className="tw-mt-1 tw-text-xl tw-font-semibold tw-text-slate-900 tw-mb-0">
                  {s.value}
                </p>
              </div>

              <div className="tw-ml-3 tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-bg-slate-50 tw-text-slate-500">
                <HugeiconsIcon icon={s.icon} size={18}></HugeiconsIcon>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagePreviewStatic() {
  return (
    <div className="tw-w-full tw-rounded-md tw-border tw-border-slate-200 tw-bg-white tw-p-4">
      {/* Header */}
      <div className="tw-space-y-1">
        <div className="tw-text-sm tw-font-semibold tw-text-slate-900">
          Message Preview
        </div>
        <div className="tw-text-xs tw-text-slate-500">
          WhatsApp template <span className="tw-font-medium">fee_due_v3</span>
        </div>
      </div>

      {/* Body */}
      <div className="tw-mt-5 tw-grid tw-grid-cols-1 tw-gap-6 lg:tw-grid-cols-2">
        {/* Left panel */}
        <div className="tw-rounded-2xl tw-border tw-border-slate-200 tw-bg-white tw-p-4">
          <div className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-lg tw-bg-slate-50 tw-px-2 tw-py-1">
            <span className="tw-text-xs tw-font-medium tw-text-slate-700">
              You
            </span>
            <span className="tw-text-xs tw-text-slate-400">•</span>
            <span className="tw-text-xs tw-text-slate-500">preview</span>
          </div>

          <div className="tw-mt-3 tw-w-fit tw-max-w-[420px] tw-rounded-2xl tw-bg-slate-100 tw-px-4 tw-py-3">
            <p className="tw-whitespace-pre-line tw-text-sm tw-leading-5 tw-text-slate-800">
              Dear {"{ParentName},"}
              {"\n"}
              This is a reminder that your ward&apos;s fee is due. Kindly pay at
              the earliest.
              {"\n"}— Accounts
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div>
          <div className="tw-text-sm tw-font-semibold tw-text-slate-900">
            CTA Buttons
          </div>

          <div className="tw-mt-3 tw-flex tw-flex-wrap tw-gap-3">
            <button
              type="button"
              className="tw-rounded-lg tw-border tw-border-slate-200 tw-bg-slate-50 tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-slate-700 hover:tw-bg-slate-100"
            >
              Pay Now
            </button>
            <button
              type="button"
              className="tw-rounded-lg tw-border tw-border-slate-200 tw-bg-slate-50 tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-slate-700 hover:tw-bg-slate-100"
            >
              View Dues
            </button>
            <button
              type="button"
              className="tw-rounded-lg tw-border tw-border-slate-200 tw-bg-slate-50 tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-slate-700 hover:tw-bg-slate-100"
            >
              Contact Office
            </button>
          </div>

          <div className="tw-mt-4 tw-text-xs tw-text-slate-500">
            Template variables resolved at send-time.
          </div>
        </div>
      </div>

      {/* Bottom-right pill */}
      <div className="tw-mt-6 tw-flex tw-justify-end">
        <div className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-bg-slate-900 tw-px-3 tw-py-2 tw-text-xs tw-text-white">
          <span>2 messages</span>
        </div>
      </div>
    </div>
  );
}

const ViewWhatsappCampaign = () => {
  const [activeId, setActiveId] = useState<any>("overview");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "overview",
      labelName: "Overview",
      customPadding: "0px 5px 5px 5px",
    },
    {
      id: "recipients",
      labelName: "Recipients",
      customPadding: "0px 5px 5px 5px",
    },
    {
      id: "delivery-logs",
      labelName: "Delivery Logs",
      customPadding: "0px 5px 5px 5px",
    },
    {
      id: "engagement",
      labelName: "Engagement",
      customPadding: "0px 5px 5px 5px",
    },
    {
      id: "audit",
      labelName: "Audit",
      customPadding: "0px 5px 5px 5px",
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "overview":
        return Overview;
      case "recipients":
      case "delivery-logs":
      case "engagement":
      case "audit":
        return Recipients;

      default:
        return null;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent activeId={activeId} />;
  }, [activeId]);

  return (
    <div className="tw-p-0">
      <div className="card shadow-none border-0">
        <div className="card-header tw-flex tw-items-center tw-justify-between">
          <div>
            <h4 className="card-title mb-0">Fee Reminder</h4>
            <p className="tw-text-xs tw-text-gray-500 tw-mb-0">
              CMP-2398 • Fee Pending (312) • Scheduled 15-Oct-2025 18:00
            </p>
          </div>
          <div className="tw-flex tw-items-center tw-gap-x-2">
            <button className="btn btn-sm btn-outline-primary">
              <HugeiconsIcon icon={SentIcon} size={16} className="me-2" />
              Test
            </button>
            <button className="btn btn-sm btn-outline-secondary">
              <HugeiconsIcon icon={ReloadIcon} size={16} className="me-2" />
              Export
            </button>
            <button className="btn btn-sm btn-outline-danger">
              <HugeiconsIcon icon={Download01Icon} size={16} className="me-2" />
              Retry Failed
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="tw-mb-6">
            <UpdatedHorizontalTab
              MenuOptions={MenuOptions}
              clickMenuHandler={clickMenuHandler}
              activeTabId={activeId}
              horizontalClass="overflow-auto text-nowrap !tw-w-fit horizontal-menu-updated-style"
            />
          </div>
          <div>{activeComponent}</div>
        </div>
      </div>
    </div>
  );
};

export default ViewWhatsappCampaign;
