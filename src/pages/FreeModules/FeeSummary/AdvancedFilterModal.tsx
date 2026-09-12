import { useEffect, useMemo, useState } from "react";
import { MultiSelectCheckbox, SelectInput } from "../../../Components/Common";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import { eliteParentOptions } from "./helper";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import Button from "../../../Components/Common/Button";
import { getFeeTermByTypeAct } from "../../../store/fee/feereport/feereportactions";
import { getChronicParentTypesListAct } from "../../../store/fee/feecollections/feecollectionactions";
import { sampleChronicParentTypes, USE_SAMPLE_CHRONIC_PARENT_TYPES } from "../ChronicParentType/helper";
import { generateActionPayload } from "../../../utility/reduxutility";

const initialValues: any = {
    recentFollowupRemarksStartDate: null,
    recentFollowupRemarksEndDate: null,
    nextFollowupRemarksStartDate: null,
    nextFollowupRemarksEndDate: null,
    termIds: [],
    isEliteParent: "",
    chronicParentTypeIds: [],
};

/** Only these keys belong to the advance panel; everything else is managed by the inline filter row. */
const pickPanelFilters = (filters: any) =>
    Object.keys(initialValues).reduce((acc: any, key) => ({ ...acc, [key]: filters?.[key] ?? initialValues[key] }), {});

const AdvanceFilterModal = (props: any) => {
    const { appliedFilter, applyFilterCallback, toggleAdvanceFilter } = props;

    const [enquiryFilterState, setEnquiryFilterState] = useState<any>(
        appliedFilter ? pickPanelFilters(appliedFilter) : initialValues
    );

    const dispatch = useAppDispatch();
    const { showApiLoader, feeTermByTypeResp, instituteId, branchId, getChronicParentTypesListResp }: any =
        useAppSelector(
            ({ globalData, feeReport, appData, feeCollections }) => ({
                showApiLoader: globalData.showApiLoader,
                feeTermByTypeResp: feeReport.feeTermByTypeResp,
                instituteId: appData.currentInstIdResp,
                branchId: appData.currentBranchIdResp,
                getChronicParentTypesListResp: feeCollections.getChronicParentTypesListResp,
            }),
            shallowEqual
        );

    const chronicParentTypes = useMemo(() => {
        const apiList = getChronicParentTypesListResp?.data;
        if (Array.isArray(apiList) && apiList.length > 0) return apiList;
        return USE_SAMPLE_CHRONIC_PARENT_TYPES ? sampleChronicParentTypes : [];
    }, [getChronicParentTypesListResp]);

    useEffect(() => {
        dispatch(
            getChronicParentTypesListAct(
                generateActionPayload("get_chronic_parent_types_list", undefined, { branchId, pageNo: 0, pageSize: 100, sortBy: "createdAt", orderBy: "desc" })
            )
        );
    }, [branchId]);

    useEffect(() => {
        if (instituteId) {
            dispatch(getFeeTermByTypeAct(generateActionPayload("get_feeterm_bytype", undefined, { feeType: "TERM", instituteId })));
        }
    }, [instituteId]);

    function onSelectOptionHandler(selectedOptions: any, config?: any) {
        const { name } = config || {};
        if (!name) return;
        setEnquiryFilterState((prev: any) => ({
            ...prev,
            [name]: Array.isArray(selectedOptions) ? selectedOptions : [],
        }));
    }

    function renderSelectedValue(labelKey: string) {
        return (selectedItems: any) =>
            Array.isArray(selectedItems) ? (
                <div className="text-truncate">
                    {selectedItems.map((item: any) => item?.[labelKey]).join(", ")}
                </div>
            ) : null;
    }

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (
        { startDate, endDate }: any,
        startKey: string,
        endKey: string
    ) => {
        setEnquiryFilterState((prev: any) => ({
            ...prev,
            [startKey]: startDate || null,
            [endKey]: endDate || null,
        }));
    };

    function applyFilterHndlr() {
        applyFilterCallback({ ...pickPanelFilters(enquiryFilterState), branchId: appliedFilter?.branchId });
    }

    function resetHandler() {
        const resetFilterState = {
            ...initialValues,
        };

        setEnquiryFilterState(resetFilterState);
        applyFilterCallback(resetFilterState, true);
    }

    return (
        <>
            <div className="offcanvas-body">
                <div className="tw-mb-4">
                    <SelectInput
                        name="isEliteParent"
                        value={enquiryFilterState.isEliteParent}
                        onChange={handleChange}
                        menuItems={eliteParentOptions}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        labelText="Is Elite Parent"
                    />
                </div>
                <div className="tw-mb-4">
                    <MultiSelectCheckbox
                        name="termIds"
                        idKey="termId"
                        labelText="Terms"
                        value={enquiryFilterState.termIds || []}
                        renderValue={renderSelectedValue("termTypeName")}
                        renderOptions={(item: any) => item?.termTypeName}
                        onChange={onSelectOptionHandler}
                        searchKey="termTypeName"
                        options={Array.isArray(feeTermByTypeResp) ? feeTermByTypeResp : []}
                    />
                </div>
                <div className="tw-mb-4">
                    <MultiSelectCheckbox
                        name="chronicParentTypeIds"
                        idKey="id"
                        labelText="Chronic Parent Type"
                        value={enquiryFilterState.chronicParentTypeIds || []}
                        renderValue={renderSelectedValue("chronicParentTypeName")}
                        renderOptions={(item: any) => item?.chronicParentTypeName}
                        onChange={onSelectOptionHandler}
                        searchKey="chronicParentTypeName"
                        options={chronicParentTypes}
                    />
                </div>
                <div className="tw-mb-4">
                    <CustomDatePicker
                        name="recentDateRange"
                        startDate={enquiryFilterState.recentFollowupRemarksStartDate}
                        endDate={enquiryFilterState.recentFollowupRemarksEndDate}
                        onChange={(dates: any) =>
                            handleDateChange(
                                dates,
                                "recentFollowupRemarksStartDate",
                                "recentFollowupRemarksEndDate"
                            )
                        }
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Follow Up Date Range"
                        portalId="fee-summary-advance-filter"
                    />
                </div>
                <div className="tw-mb-4">
                    <CustomDatePicker
                        name="nextDateRange"
                        startDate={enquiryFilterState.nextFollowupRemarksStartDate}
                        endDate={enquiryFilterState.nextFollowupRemarksEndDate}
                        onChange={(dates: any) =>
                            handleDateChange(
                                dates,
                                "nextFollowupRemarksStartDate",
                                "nextFollowupRemarksEndDate"
                            )
                        }
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Next Action Date"
                        portalId="fee-summary-advance-filter"
                    />
                </div>
            </div>
            <div className="border-top p-2 text-center">
                <div className="hstack gap-2 justify-content-end">
                    <Button
                        type="button"
                        className="btn btn-light"
                        onClick={resetHandler}
                        variant="secondary"
                    >
                        Reset
                    </Button>
                    <Button
                        type="button"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
                        variant='primary'
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AdvanceFilterModal;