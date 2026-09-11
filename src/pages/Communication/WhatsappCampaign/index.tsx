import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppDispatch } from "../../../hooks/storehook";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  EyeIcon,
  FilterIcon,
  PencilEdit02Icon,
  SentIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { IPaginationState } from "../../../Components/Common/Pagination";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  ModalContainerUpdated,
  OffCanvasContainer,
  TextInput,
} from "../../../Components/Common";
import TableContainer from "../../../Components/Common/TableContainer";
import { useModal } from "../../../hooks/modalhook";
import { generateColumns, tableData } from "./helper";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import {
  convertToFullTime,
  convertToFullTimeWithPeriod,
  Current_Date,
} from "../../../utility/dateutility";
import { useFilterState } from "../../../hooks/filterhook";
import AdvanceFilterModal from "./AdvanceFilterModal";
import WhatsappCampaignStats from "./WhatsappCampaignStats";
import ViewWhatsappCampaign from "./ViewWhatsappCampaign";
import Button from "../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  fromDate: convertToFullTime(Current_Date),
  toDate: convertToFullTimeWithPeriod(Current_Date),
};

const WhatsappCampaign = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { showClearFilterState, count, advanceFilterChange } = useFilterState();
  const {
    openModal: addEditSportNameOpenModal,
    closeModal: addEditSportNameCloseModal,
    modalState: addEditSportNameModalState,
  } = useModal();

  const {
    openModal: viewWhatsappCampaignOpenModal,
    closeModal: viewWhatsappCampaignCloseModal,
    modalState: viewWhatsappCampaignModalState,
  } = useModal();

  const dispatch = useAppDispatch();
  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const whatsappCampaignFormik = useFormik({
    initialValues,
    onSubmit: (value) => {},
  });

  const menuOptions = useMemo(
    () => [
      {
        id: "send",
        actionIcon: (
          <HugeiconsIcon icon={SentIcon} className="text-muted" size={18} />
        ),
        actionName: "Send",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          addEditSportNameOpenModal(id);
        },
      },
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          addEditSportNameOpenModal(id);
        },
      },
      {
        id: "view",
        actionIcon: (
          <HugeiconsIcon icon={EyeIcon} className="text-muted" size={18} />
        ),
        actionName: "View",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          viewWhatsappCampaignOpenModal(id);
        },
      },
    ],
    []
  );

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
  }

  const toggleAdvanceFilter = () => {
    setOpen((prev) => !prev);
  };

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions]
  );

  return (
    <>
      <div className="tw-py-6 tw-px-4 transportaion_dashboard_wrapper">
  <div className="tw-max-w-full tw-mx-auto">
    <BreadCrumb pageTitle="Whatsapp Campaign" />

    <WhatsappCampaignStats />

    <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200">
      
      {/* Header */}
      <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200">
        <div className="tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-gap-4">
          
          <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
            Whatsapp Campaign
          </h4>

          <Button
            onClick={() => {}}
            variant="primary"
          >
            <i className="ri-add-line" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="tw-p-0">

        {/* Filters Row */}
        <div className="tw-grid tw-grid-cols-1 
                        md:tw-grid-cols-2 
                        lg:tw-grid-cols-4 
                        tw-gap-4 
                        tw-px-6 tw-pt-6">

          {/* Search */}
          <div className="tw-col-span-1">
            <div className="search-box">
              <TextInput
                name="searchString"
                formgroupClassName="tw-mb-3"
                placeHolder="Search..."
                value={whatsappCampaignFormik.values.searchString}
                onChange={() => {}}
                floatingLabel
                labelText="Search"
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>

          {/* Date Picker */}
          <div className="tw-col-span-1">
            <CustomDatePicker
              name="dateRange"
              startDate={whatsappCampaignFormik.values.fromDate}
              endDate={whatsappCampaignFormik.values.toDate}
              onChange={() => {}}
              placeholder="Select a Date Range"
              monthsShown={2}
              formgroupClassName="tw-mb-0"
              labelText="Date Range"
              floatingLabel
            />
          </div>

          {/* Filter Button */}

           <div className="tw-relative tw-col-span-1">
                      <div
                        onClick={toggleAdvanceFilter}
                        className="tw-flex tw-items-center tw-gap-2 tw-bg-gray-100 tw-p-2 tw-cursor-pointer tw-rounded"
                      >
                        <HugeiconsIcon
                      icon={FilterIcon}
                      className="tw-me-2"
                      size={18}
                    />
                        <span>Filters</span>
                      </div>
          
                      <span
                        className="tw-absolute tw--top-2 tw-left-16 tw-rounded-full tw-bg-emerald-500 tw-text-white tw-text-xs tw-px-2"
                      >
                        {count}
                      </span>
                    </div>
        </div>

        {/* Table */}
        <div className="tw-px-6 tw-pb-6">
          <TableContainer
            columns={tableColumns || []}
            data={tableData || []}
            tableClass="tw-mb-0"
            divClass="tw-overflow-x-auto tw-mb-3"
            theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
            showPagination={true}
            totalPages={0}
            totalRecords={0}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={0}
          />
        </div>

      </div>
    </div>
  </div>
</div>


      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-whatsapp-campaign"
      >
        <AdvanceFilterModal applyFilterHndlr={() => {}} isOpen={open} />
      </OffCanvasContainer>

      <ModalContainerUpdated
        id="view-whatsapp-campaign-modal"
        isOpen={viewWhatsappCampaignModalState.showModal}
        toggle={viewWhatsappCampaignCloseModal}
        modalTitle="View Whatsapp Campaign"
        modalSize="xl"
      >
        <ViewWhatsappCampaign></ViewWhatsappCampaign>
      </ModalContainerUpdated>
    </>
  );
};

export default WhatsappCampaign;
