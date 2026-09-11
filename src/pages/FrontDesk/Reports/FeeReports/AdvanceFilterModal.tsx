import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getClassListAdvanceFilter } from '../../../../store/fee/feecollections/feecollectionactions';
import { Current_Date_YYYYMMDD } from '../../../../utility/dateutility';
import { DateInput, MultiSelect, RadioInputContainer, SelectInput } from '../../../../Components/Common';
import { paidAtMenuOptions, paymentModeMenuOptions, statusMenuOptions } from './helper';
import Button from '../../../../Components/Common/Button';

const initialValues: any = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    scheduleMode: null,
    interviewDate: null,
    endDate: "",
    Date :"",
    status:"",
    dataType:"",
    paymentMode:"",
    searchString: "",
    feePaid:"",
    paidAt:"",
    feeType:"",
    terms:"",
};

const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] =
        useState<any>(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, classListForAdvanceFilter, tcRequestList, showApiLoader }: any =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, feeCollections,globalData }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                loginUserDetailsResp: appData.loginUserDetailsResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                showApiLoader : globalData.showApiLoader,
                classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,

            }),
            shallowEqual
        );

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setEnquiryFilterState((prev:any) => ({ ...prev, [name]: value }))
        if (name === "curriculumId") {
            if (value) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: value, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }

    
    function applyFilterHndlr() {
        // setEnquiryFilterState((prev: any) => ({ ...prev, paymentModes: paymentModeState, receiptTypes: receiptOptionState }))
        if(enquiryFilterState?.startDate && !enquiryFilterState?.endDate){
            props.applyFilterCallback({...enquiryFilterState , endDate : Current_Date_YYYYMMDD});
        }else{
            props.applyFilterCallback(enquiryFilterState);
        }
    }

    function resetHandler (){
        setEnquiryFilterState((prev: any) => ({ ...prev, startDate: "", endDate: "" }));
        props.toggleAdvanceFilter();
        props.applyFilterCallback({ ...enquiryFilterState, startDate: "", endDate: "" });
    }

    useEffect(() => {
        if (!props.isOpen) {
            // dispatch(resetClassListForAdvanceFilterAct(undefined));
        }
        else {
            if(props.appliedFilter.curriculumId){
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: props.appliedFilter.curriculumId, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }, [props.isOpen])

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { data: TcRequestList, totalElements, totalPages, pageNumber } = tcRequestList || {};
    const { content: classTypes } = classListForAdvanceFilter || {};
    return (
        <>
            <div className="offcanvas-body">
            <div className='tw-mb-3'>
                    <SelectInput
                        name="status"
                        value={enquiryFilterState?.status}
                        onChange={filterHandler}
                        menuItems={statusMenuOptions}
                        valueKey="id"
                        textKey="value"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="tw-mb-0"
                        defaultSelect='Status'
                        labelText='Status'
                    />
                </div>

                <div className='tw-mb-3'>
                 <MultiSelect
                        name="paymentMode"
                        value={enquiryFilterState.paymentMode}
                        onChange={(e: any) => {
                            // examSubjectForm.setFieldValue("streams", e);
                        }}
                        menuItems={paymentModeMenuOptions || []}
                        valueKey="value"
                        textKey="id"
                        closeMenuOnSelect={false}
                        inputClassName="bg-soft-light"
                        formgroupClassName='tw-mb-0'
                        labelText="Payment Mode"
                    />
                </div>

                <div className='tw-mb-3'>
                 <MultiSelect
                        name="paidAt"
                        value={enquiryFilterState.paidAt}
                        onChange={(e: any) => {
                            // examSubjectForm.setFieldValue("streams", e);
                        }}
                        menuItems={paidAtMenuOptions || []}
                        valueKey="value"
                        textKey="id"
                        closeMenuOnSelect={false}
                        inputClassName="bg-soft-light"
                        formgroupClassName='tw-mb-0'
                        labelText="Paid At"
                    />
                </div>

                <div className='tw-mb-3'>
                    <RadioInputContainer
                        name="dataType"
                        labelText="Select Data Type"
                        inputContainerClassName="tw-mt-2"
                        radioOptions={[{ id: "receiptDate", name: "Receipt Date" }, { id: "userDate", name: "User Date" }]}
                        value={enquiryFilterState.dataType}
                        onChange={filterHandler}
                    />
                </div>

                <div className='tw-mb-3'>
                    <SelectInput
                        name="feePaid"
                        value={enquiryFilterState?.feePaid}
                        onChange={filterHandler}
                        menuItems={[{id:"oneDate",value:"One Date"}]}
                        valueKey="id"
                        textKey="value"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="tw-mb-0"
                        defaultSelect='Fee Paid'
                        labelText='Fee Paid'
                    />
                </div>

                <div className='tw-mb-3'>
                    <DateInput
                        name="Date"
                        value={enquiryFilterState?.Date}
                        onChange={filterHandler}
                        // inputClassName="bg-light"
                        formgroupClassName="tw-mb-0"
                        labelText="Date"
                    />
                </div>

                <div className='tw-mb-3'>
                    <SelectInput
                        name="feeType"
                        value={enquiryFilterState?.feeType}
                        onChange={filterHandler}
                        menuItems={[{id:"tutionFee",value:"Tution Fee"}]}
                        valueKey="id"
                        textKey="value"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="tw-mb-0"
                        defaultSelect='Fee Type'
                        labelText='Fee Type'
                    />
                </div>

                <div className='tw-mb-3'>
                    <SelectInput
                        name="terms"
                        value={enquiryFilterState?.terms}
                        onChange={filterHandler}
                        menuItems={[{id:"Term I",value:"Term I"}]}
                        valueKey="id"
                        textKey="value"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="tw-mb-0"
                        defaultSelect='Terms'
                        labelText='Terms'
                    />
                </div>
            </div>
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-gap-2 tw-justify-end">
                {/* <button
                        type="button"
                        className="btn btn-light"
                        onClick={resetHandler}
                    >
                        Reset
                    </button> */}
                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
                        variant='primary'
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AdvanceFilterModal
