import React, { useEffect, useMemo, useState } from 'react'
import BreadCrumb from '../../../../Components/Common/BreadCrumb'
import { useFormik } from 'formik';
import { DateInput, SelectInput } from '../../../../Components/Common';
import {  dateFormatter, getYyyyMmDdFormat } from '../../../../utility/dateutility';
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import StatusCard from './StatusCard';
import { generateColumns } from './helper';
import OrderStatus from './OrderStatus';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { ccAvenueOrderStatsAct } from '../../../../store/fee/feereport/feereportactions';
import UpdatedHorizontalTab from '../../../../Components/Common/UpdatedHorizontalTab';
import Button from '../../../../Components/Common/Button';
import { setPaymentReconciliationTabIdAct } from '../../../../store/global/globalslice';
import All from './All';
import Matched from './Matched';
import Unmatched from './Unmatched';
import { getPaymentReconciliationAct } from '../../../../store/fee/feecollections/feecollectionactions';
const formatDefaultDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const today = new Date();
  
  const initialValues = {
    dateFilter: "dateRange",
    startDate: formatDefaultDate(yesterday),
    endDate: formatDefaultDate(today),
  };

const CCAvenueReport = () => {
    const dispatch = useAppDispatch();
    const ccAvenueStatsApiCall = ( otherProps?: any) => {
        let payload = {
            date_from : feeReportFilterForm.values.startDate,
            date_to : feeReportFilterForm.values.endDate,
            ...otherProps,
        };
        payload.date_from = dateFormatter(payload.date_from);
        payload.date_to = dateFormatter(payload.date_to);
            dispatch(ccAvenueOrderStatsAct(generateActionPayload('cc_avenue_order_stats', {branchId}, payload)))
    }

    const getPaymentReconciliationApiCall = (otherProps?: any) => {
        const payload = {
          date_from: feeReportFilterForm.values.startDate ,
          date_to: feeReportFilterForm.values.endDate,
          ...otherProps,
        };
        payload.date_from = dateFormatter(payload.date_from);
        payload.date_to = dateFormatter(payload.date_to);
        if(activeId === "matched") payload.recon_status = "VERIFIED";
        else if(activeId === "unmatched") payload.recon_status = "VERIFICATION_FAILED";
        dispatch(
          getPaymentReconciliationAct(
            generateActionPayload('get_payment_reconciliation_details', { branchId }, payload)
          )
        );
      };

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        feeReportErrorResp,
        ccAvenueOrderStatsResp,
        paymentReconciliationTabId

    } = useAppSelector(
        ({ applicationSale, globalData, instAcademics, branchAcademics, appData,
            feeConcession, feeCollections, reports, feeReport }) => ({
                academicYearListResp: instAcademics.academicYearListResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                showApiLoader: globalData.showApiLoader,
                feeReportErrorResp: feeReport.feeReportErrorResp,
                ccAvenueOrderStatsResp: feeReport.ccAvenueOrderStatsResp,
                paymentReconciliationTabId: globalData.paymentReconciliationTabId,
            }),
        shallowEqual
    );

      const [activeId, setActiveId] = useState(paymentReconciliationTabId || "all");

    const MenuOptions = [
        {
          id: "all",
          labelName: "All",
          customPadding: "0px 15px",
        },
        {
          id: "matched",
          labelName: "Matched",
          customPadding: "0px 15px",
        },
        {
          id: "unmatched",
          labelName: "Unmatched",
          customPadding: "0px 15px",
        },
      ];

      function getActiveMenuComponent(menuId: any) {
        dispatch(setPaymentReconciliationTabIdAct(menuId))
        switch (menuId) {
          case "all":
            return All;
          case "matched":
            return Matched;
          case "unmatched":
            return Unmatched;
          default:
            return null;
        }
      }

      function clickMenuHandler(event: any) {
        const { currentTarget } = event,
          menuId = currentTarget.getAttribute("data-id");
        setActiveId(menuId);
      }
    useEffect(() => {
      if(activeId){
        getPaymentReconciliationApiCall()
      }
    }, [activeId])

    useEffect(() => {
        ccAvenueStatsApiCall();
    },[])
    const feeReportFilterForm = useFormik({
        initialValues,
        // validationSchema,
        onSubmit: (values) => {
            ccAvenueStatsApiCall({date_from : values.startDate, date_to : values.endDate});
            getPaymentReconciliationApiCall({date_from : values.startDate, date_to : values.endDate});
        },
    });

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        feeReportFilterForm.setValues((prev) => ({ ...prev, [name]: value }));
    }
    const ccavenuColumns = useMemo(() => generateColumns(), []);
    const transformedReportData = useMemo(() => {
        if (!ccAvenueOrderStatsResp) return {};

        const {
            totalOrderCount = 0,
            totalSuccessOrderCount = 0,
            totalMatchedOrderCount = 0,
            totalMisMatchOrderCount = 0,
        } = ccAvenueOrderStatsResp.orderCount || {};

        return {
            unpaidStudentCountSummary: {
                "Total Orders": [{ studentCount: totalOrderCount }],
                "Total success orders": [{ studentCount: totalSuccessOrderCount }],
                "Total Recon Match": [{ studentCount: totalMatchedOrderCount }],
                "Total Recon Mismatch": [{ studentCount: totalMisMatchOrderCount }],
            },
            totalUnpaidStudents: ccAvenueOrderStatsResp.totalFailedOrders || 0,
        };
    }, [ccAvenueOrderStatsResp]);

    const ActiveComponent = getActiveMenuComponent(activeId);


    return (
        <>
            <div className="page-content fee-payment-reports fee-status-reports">
                <div className="container-fluid">
                    <BreadCrumb title="Students Management" pageTitle="Fee" />
                    <div className="tw-bg-white tw-shadow-sm tw-rounded-lg tw-mb-4">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-m-0">
                                CCavenue daily collection report
                            </h4>
                        </div>
                        <div className="tw-p-4">
                            <form onSubmit={feeReportFilterForm.handleSubmit}>
                                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 xl:tw-grid-cols-6 tw-gap-4 tw-items-end">
                                    <div className="tw-col-span-1 xl:tw-col-span-1">
                                        <SelectInput
                                            name="dateFilter"
                                            formgroupClassName="tw-mb-0"
                                            value={feeReportFilterForm.values.dateFilter}
                                            onChange={feeReportFilterForm.handleChange}
                                            menuItems={[{ id: "oneDate", value: "Any Date" }, { id: "dateRange", value: "Date Range" }]}
                                            valueKey="id"
                                            textKey="value"
                                            hideSelectOption={true}
                                            isDisabled={true}
                                        />
                                    </div>
                                    <div className="tw-col-span-1 xl:tw-col-span-1">
                                        <DateInput
                                            name="startDate"
                                            formgroupClassName="tw-mb-0"
                                            value={feeReportFilterForm.values.startDate}
                                            onChange={filterHandler}
                                        />
                                    </div>
                                    <div className="tw-col-span-1 xl:tw-col-span-1">
                                        <DateInput
                                            name="endDate"
                                            formgroupClassName="tw-mb-0"
                                            minDate={getYyyyMmDdFormat(feeReportFilterForm.values.startDate)}
                                            value={feeReportFilterForm.values.endDate}
                                            onChange={filterHandler}
                                            isDisabled={!feeReportFilterForm.values.startDate || (feeReportFilterForm.values.dateFilter !== "dateRange")}
                                        />
                                    </div>
                                    <div className="tw-col-span-1 md:tw-col-span-2 lg:tw-col-span-1 xl:tw-col-span-3 tw-flex tw-justify-end">
                                        <Button
                                            type="submit" 
                                            variant="primary"
                                            disabled={showApiLoader}
                                        >
                                            Get Report
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <OrderStatus reportData={transformedReportData} />
                    <StatusCard
                        paymentModeAmount={ccAvenueOrderStatsResp?.collection}
                    />

                    <div className="tw-bg-white tw-shadow-sm tw-rounded-lg tw-mb-4">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-m-0">
                                Payment Mode Wise Collection
                            </h4>
                        </div>
                        <div className="tw-p-0">
                        <UpdatedHorizontalTab
                            MenuOptions={MenuOptions}
                            clickMenuHandler={clickMenuHandler}
                            activeTabId={activeId}
                            showBadge={true}
                            horizontalClass="tw-pt-2 tw-mb-2 tw-overflow-auto tw-text-nowrap"
                        />
                        </div>
                     {ActiveComponent && <ActiveComponent filterState={{ date_from: feeReportFilterForm.values.startDate, date_to: feeReportFilterForm.values.endDate }} />}

                    </div>
                </div>
            </div >
        </>
    )
}

export default CCAvenueReport