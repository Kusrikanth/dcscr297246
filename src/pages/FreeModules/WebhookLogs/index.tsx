import { useEffect, useMemo, useRef, useState } from "react";
import {
  ConfirmationModal,
  OffCanvasContainer,
  SelectInput,
  TextInput,
} from "../../../Components/Common";
import classnames from "classnames"
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumns, hasStateChanged, statusData } from "./helper";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { shallowEqual } from "react-redux";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  getWebhookLogsAct,
  getWebhookLogsCategoryDetailsAct,
  updateStatusDetailsAct,
} from "../../../store/fee/feecollections/feecollectionactions";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { useModal } from "../../../hooks/modalhook";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";

const initialValues = {
  searchStr: "",
  status: "",
  category: "",
  receivedStartDate: "",
  receivedEndDate: "",
};

const WebhookLogs = () => {
  const dispatch = useAppDispatch();

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const [filterState, setFilterState] = useState(initialValues);
  const [filterCount, setFilterCount] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showClearFilters, setShowClearFilterState] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { closeModal: closeStatusSubmitModal, modalState: statusSubmitState, openModal: openStatusSubmitModal } = useModal();

  const toggleAdvanceFilters = () => {
    setShowAdvancedFilters((prev) => !prev);
  };

  const {
    currentBranchIdResp: branchId,
    academicYearListResp,
    webhookLogsResp,
    webhookLogsCategoryDetailsResp,
    updateStatusResp,
    showApiLoader,
    feeCollectionErrorResp,
  } = useAppSelector(
    ({
      instAcademics,
      appData,
      feeCollections,
      branchAcademics,
      globalData,
    }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      webhookLogsResp: feeCollections.webhookLogsResp,
      updateStatusResp: feeCollections.updateStatusResp,
      webhookLogsCategoryDetailsResp:
        feeCollections.webhookLogsCategoryDetailsResp,
      feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
    }),
    shallowEqual
  );

  const webHookDetailsRef = useRef({
    prevUpdateStatusResp: updateStatusResp,
    prevFeeCollectionErrorAct: feeCollectionErrorResp,

  })

  useEffect(() => {
    const { prevUpdateStatusResp, prevFeeCollectionErrorAct } = webHookDetailsRef.current;
    if (updateStatusResp && prevUpdateStatusResp !== updateStatusResp) {
      toast.success("Status Updated Successfully.");
      closeStatusSubmitModal();
      webhookLogsList();
    }
    else if (feeCollectionErrorResp && prevFeeCollectionErrorAct !== feeCollectionErrorResp) {
      const { details } = feeCollectionErrorResp;
      toast.error(details || "Something went wrong!");
    }
    webHookDetailsRef.current.prevUpdateStatusResp = updateStatusResp;
    webHookDetailsRef.current.prevFeeCollectionErrorAct = feeCollectionErrorResp;

  }, [updateStatusResp, feeCollectionErrorResp,])


  const webhookLogsList = (otherProps?: any) => {
    const payload = {
      branchId,
      orderBy: "desc",
      ...filterState,
      ...paginationRef.current,
      ...otherProps,
    };
    dispatch(
      getWebhookLogsAct(
        generateActionPayload("web_hook_logs", undefined, payload)
      )
    );
  };

  const webhookLogsCategoryDetailsList = () => {
    dispatch(
      getWebhookLogsCategoryDetailsAct(
        generateActionPayload("web_hook_logs_category_details", undefined, {})
      )
    );
  };

  const submitHandler = (otherProps?: any) => {
    const payload = {
      ids: [Number(selectedId)],
    };
    dispatch(updateStatusDetailsAct(generateActionPayload("update_status_details", undefined, payload,)));
  };


  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;
    setFilterState((prev) => ({ ...prev, [name]: value }));
    webhookLogsList({ [name]: value });
  };

  function advanceFilterCallbckHndlr(appliedFilter: any) {
    paginationRef.current.pageNo = 0;
    setFilterState((prevState) => ({ ...prevState, ...appliedFilter }));
    const stateChanged = hasStateChanged({ ...filterState, ...appliedFilter });
    stateChanged?.count === 0
      ? setFilterCount(null)
      : setFilterCount(stateChanged?.count);
    webhookLogsList(appliedFilter);
    toggleAdvanceFilters();
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    webhookLogsList(paginationInfo);
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "statusUpdate",
        actionIcon: <HugeiconsIcon icon={Book02Icon} className="me-2 text-muted" size={18} />,
        actionName: "Re -Trigger",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          const data = webhookLogsResp?.content?.find((item: any) => +item?.id === +id);
          setSelectedId(+id);
          openStatusSubmitModal(data);
        },
      },
    ],
    [webhookLogsResp]
  );

  const columns = useMemo(() => generateColumns(menuOptions), [webhookLogsResp]);

  useEffect(() => {
    webhookLogsList();
    webhookLogsCategoryDetailsList();
  }, []);

  const {
    data: webhookLogsDataResp,
    totalElements,
    totalPages,
    pageable,
  } = webhookLogsResp || {};

  const webhookLogsCategoryDetailsRespList =
    webhookLogsCategoryDetailsResp || [];

  const webhookCategoryList = webhookLogsCategoryDetailsRespList.map(
    (categoryEle: string) => ({
      id: categoryEle,
      name: categoryEle?.split("_").join(" "),
    })
  );

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Fee" pageTitle="Webhooks Logs"></BreadCrumb>

          <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-mb-5">

            <div className="tw-border-b tw-px-6 tw-py-4">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">Webhook Logs</h4>
              </div>
            </div>

            <div className="tw-px-6 tw-py-4">

              <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4">
                  <div className="tw-relative search-box">
                    <TextInput
                      name="searchStr"
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search..."
                      value={filterState.searchStr}
                      onChange={filterHandler}
                      labelText="Search"
                      floatingLabel
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-2 tw-text-gray-400"></i>
                  </div>
                </div>

                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
                  <SelectInput
                    name="category"
                    value={filterState.category}
                    onChange={filterHandler}
                    menuItems={webhookCategoryList || []}
                    valueKey="id"
                    textKey="name"
                    formgroupClassName="tw-mb-0"
                    defaultSelect="Select"
                    labelText="Category"
                    floatingLabel
                  />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
                  <SelectInput
                    name="status"
                    value={filterState?.status}
                    onChange={filterHandler}
                    menuItems={statusData || []}
                    valueKey="id"
                    textKey="name"
                    formgroupClassName="tw-mb-0"
                    defaultSelect="Select"
                    labelText="Status"
                    floatingLabel
                  />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4">
                  <div className="tw-flex tw-items-center tw-gap-3">

                    <div className="tw-relative">
                      <button
                        onClick={toggleAdvanceFilters}
                        className="tw-bg-gray-100 tw-px-3 tw-py-2 tw-rounded-md tw-flex tw-items-center hover:tw-bg-gray-200 tw-transition"
                      >
                        <FilterSvg height="18px" width="18px" />
                        <span className="tw-ml-2">Filters</span>
                      </button>

                      <span className="tw-absolute tw--top-2 tw-right-0 tw-bg-[#0ab39c] tw-text-white tw-text-xs tw-rounded-full tw-px-2">
                        {filterCount}
                      </span>
                    </div>

                    {showClearFilters && (
                      <Button
                        type="button"
                        onClick={() => { }}
                        variant="wrong"
                      >
                        Clear filter
                      </Button>
                    )}

                  </div>
                </div>

              </div>

              <OffCanvasContainer
                isOpen={showAdvancedFilters}
                headerTitle="Advance Filters"
                id="webhool-logs-advanced-filter"
                closeHndlr={toggleAdvanceFilters}
              >
                <AdvanceFilterModal
                  showApiLoader={showApiLoader}
                  isOpen={showAdvancedFilters}
                  toggleAdvanceFilter={toggleAdvanceFilters}
                  appliedFilter={filterState}
                  applyFilterCallback={advanceFilterCallbckHndlr}
                />
              </OffCanvasContainer>

              

            </div>
<TableContainer
                columns={columns}
                data={Array.isArray(webhookLogsDataResp) ? webhookLogsDataResp : []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-4"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber || 0}
              />
          </div>

        </div>

      </div>
      <ConfirmationModal
        id="book-issuance-export"
        isOpen={statusSubmitState.showModal}
        confirmMessage="Are you sure you want to update the status?"
        cancelHndlr={closeStatusSubmitModal}
        confirmHndlr={submitHandler}
        isDisble={showApiLoader}
        btnClassName='btn w-sm btn-success'
        showImgIcon={true}
        iconType="approve"
      />
    </>
  );
};

export default WebhookLogs;
