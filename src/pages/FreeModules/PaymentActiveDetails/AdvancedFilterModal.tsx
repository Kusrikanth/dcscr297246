import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/storehook';
import { resetClassListForAdvanceFilterAct, setClassListForAdvanceFilterAct } from '../../../store/fee/feecollections/feecollectionsslice';
import { getClassListAdvanceFilter } from '../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { Current_Date_YYYYMMDD } from '../../../utility/dateutility';
import { DateInput, MultiSelectCheckbox, SelectInput } from '../../../Components/Common';
import { paymentOption, transactionFor, transactionStatus } from './helper';
import { PaymentDetailsFilterhProps } from './PaymentActiveDetailsTypes';
import { CustomDatePicker } from '../../DashBoardBranchSummary/CustomDatePicker';
import Button from '../../../Components/Common/Button';

const initialValues: PaymentDetailsFilterhProps = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  transactionStartDate: "",
  completionStatus: "",
  transactionStatus: "",
  paymentOption: "",
  currentStatus: "",
  transactionFor: "",
};

const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] =
        useState<any>(props.appliedFilter || initialValues);

        const {
            currentBranchIdResp: branchId,
            academicYearListResp,
            brchCurriculumResp,
            branchClassResp,
            currentInstIdResp: instituteId,
            paymentActiveDetailsResp,
            showApiLoader,
            classroomManagmentErrorResp,
          }: any = useAppSelector(
            ({ instAcademics, appData, globalData, feeCollections, branchAcademics, classroomManagmentInfo }) => ({
              academicYearListResp: instAcademics.academicYearListResp,
              currentBranchIdResp: appData.currentBranchIdResp,
              brchCurriculumResp: branchAcademics.brchCurriculumResp,
              branchClassResp: branchAcademics.branchClassResp,
              showApiLoader: globalData.showApiLoader,
              paymentActiveDetailsResp: feeCollections.paymentActiveDetailsResp,
              classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
            }),
            shallowEqual
          );

    const filterHandler = (event: any) => {
        const { name, value } = event.target;

        if (name === "curriculumId") {
            setEnquiryFilterState((prev: any) => ({
                ...prev, [name]: value,
                classId: null,
                selectedClasses: null,
            }))
            dispatch(setClassListForAdvanceFilterAct({}));
            if (value) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: value, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        } else {
            setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value }))
        }
    }


    function applyFilterHndlr() {
        if (enquiryFilterState?.transactionStartDate && !enquiryFilterState?.transactionEndDate) {
            props.applyFilterCallback({ ...enquiryFilterState, transactionEndDate: Current_Date_YYYYMMDD });
        } else {
            props.applyFilterCallback(enquiryFilterState);
        }
    }

    function resetHandler() {
        setEnquiryFilterState((prev: any) => ({ ...prev, transactionStartDate: null, curriculumId: null, classId: null, transactionEndDate: null, completionStatus: null, mode: null, currentStatus: null }));
        props.toggleAdvanceFilter();
        props.applyFilterCallback({ ...enquiryFilterState, transactionStartDate: null, curriculumId: null, classId: null, transactionEndDate: null, completionStatus: null, mode: null, currentStatus: null });
    }

    useEffect(() => {
        if (!props.isOpen) {
            dispatch(resetClassListForAdvanceFilterAct(undefined));
        }
        else {
            if (props.appliedFilter.curriculumId) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: props.appliedFilter.curriculumId, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }, [props.isOpen])

    const handleDateChange = ({ startDate, endDate }:any)=>{
        if(startDate && endDate){
            setEnquiryFilterState((prev:any) => ({ ...prev, transactionStartDate:startDate, transactionEndDate:endDate }));
        }
    }

    return (
        <>
            <div className="offcanvas-body">
              
                <div className="tw-mb-3">
                    <SelectInput
                        name="transactionStatus"
                        value={enquiryFilterState?.transactionStatus}
                        onChange={filterHandler}
                        menuItems={transactionStatus}
                        valueKey="id"
                        textKey="id"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Transaction Status"
                        labelText="Transaction Status"
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="paymentOption"
                        value={enquiryFilterState?.paymentOption}
                        onChange={filterHandler}
                        menuItems={paymentOption}
                        valueKey="id"
                        textKey="id"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Payment Option"
                        labelText="Payment Option"
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="transactionFor"
                        value={enquiryFilterState?.transactionFor}
                        onChange={filterHandler}
                        menuItems={transactionFor}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Transaction For"
                        labelText="Transaction For"
                    />
                </div>

                <div className="tw-mb-3">
                    <CustomDatePicker
                        name="dateRange"
                        startDate={enquiryFilterState.transactionStartDate}
                        endDate={enquiryFilterState.transactionEndDate}
                        onChange={handleDateChange}
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Date Range"
                        portalId="payment-details-advance-filter"
                    />
                </div>

            </div>

            <div className="tw-border-t tw-p-3 tw-flex tw-justify-end tw-gap-3">

                <Button
                    type="submit"
                    onClick={applyFilterHndlr}
                    disabled={showApiLoader}
                    variant='primary'
                >
                    Submit
                </Button>

            </div>
        </>
    )
}

export default AdvanceFilterModal
