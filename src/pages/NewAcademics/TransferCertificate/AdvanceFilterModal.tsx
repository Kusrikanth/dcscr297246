import React, { useEffect, useState } from 'react'
import { DateInput, SelectInput } from '../../../Components/Common'
import { TransferCertificateFilterhProps } from './transferCertificateTypes';
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { requestType } from './helper';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from '../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { CustomDatePicker } from '../../DashBoardBranchSummary/CustomDatePicker';
import Button from '../../../Components/Common/Button';
import { getSectionList } from '../../../store/academic/classroomManagment/classroommanagmentactions';

const initialValues: TransferCertificateFilterhProps = {
    nameFilterType:"",
    search: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    requestType: "",
    tcRequestStatus: "",
    tcApplicationStartDt: "",
    tcApplicationEndDt: "",
    date: "",
    sectionId: "",
};

const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();

    const [transferCertificateFilterState, setTransferCertificateFilterState] =
        useState<TransferCertificateFilterhProps>(props.appliedFilter || initialValues);

    const { showApiLoader, currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, classListForAdvanceFilter, tcRequestList, certificateIssuance, cancelTcRequest, loginUserDetailsResp, addTcReqRes, editTcReqRes, issueTcRequest, classroomManagmentErrorResp, sectionListResp }: any =
        useAppSelector(
            ({ globalData, appData, instAcademics, branchAcademics, classroomManagmentInfo, feeCollections }) => ({
                showApiLoader: globalData.showApiLoader,
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                loginUserDetailsResp: appData.loginUserDetailsResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
                tcRequestList: classroomManagmentInfo.tcRequestList,
                certificateIssuance: classroomManagmentInfo.certificateIssuance,
                cancelTcRequest: classroomManagmentInfo.cancelTcRequest,
                addTcReqRes: classroomManagmentInfo.addTcReqRes,
                editTcReqRes: classroomManagmentInfo.editTcReqRes,
                issueTcRequest: classroomManagmentInfo.issueTcRequest,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                sectionListResp: classroomManagmentInfo.sectionListResp,
        }), shallowEqual);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setTransferCertificateFilterState(prev => ({ ...prev, [name]: value }))
        if (name === "curriculumId") {
            if (value) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: value, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }
    const resetHandler = () => {
        setTransferCertificateFilterState((prev: any) => ({ ...prev, tcApplicationStartDt: "", tcRequestStatus: "", requestType: "", classId: "", tcApplicationEndDt: "", date: "" }));
        props.toggleAdvanceFilter();
        props.applyFilterCallback({ ...transferCertificateFilterState, tcApplicationStartDt: "", tcRequestStatus: "", requestType: "", classId: "", tcApplicationEndDt: "", date: "" });
    }
    function applyFilterHndlr() {
        props.applyFilterCallback(transferCertificateFilterState);
    }

    useEffect(() => {
        if (!props.isOpen) {
            dispatch(resetClassListForAdvanceFilterAct(undefined));
            return;
        }
        if (props.appliedFilter.curriculumId) {
            const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: props.appliedFilter.curriculumId, branchId };
            dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        }
        if (
            props.appliedFilter.curriculumId &&
            props.appliedFilter.classId &&
            props.appliedFilter.academicYearId
        ) {
            const payload = { branchClassId: props.appliedFilter.classId, masterAcademicYearId: props.appliedFilter.academicYearId, curriculumId: props.appliedFilter.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc",
            };
            dispatch(getSectionList(generateActionPayload("get_section_list", undefined, payload)));
        }
    }, [props.isOpen])

    const handleDateChange = ({ startDate, endDate }:any)=>{
        if(startDate && endDate){
            setTransferCertificateFilterState((prev:any) => ({ ...prev, tcApplicationStartDt:startDate, tcApplicationEndDt:endDate }));
        }
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = classListForAdvanceFilter || {};
    const { data: sectionTypes } = sectionListResp || [];
    return (
        <>
            <div className="offcanvas-body">
                <div className='tw-mb-3'>
                    <SelectInput
                        name="sectionId"
                        value={transferCertificateFilterState.sectionId}
                        onChange={filterHandler}
                        menuItems={sectionTypes}
                        valueKey="sectionId"
                        textKey="sectionName"
                        formgroupClassName="mb-0"
                        defaultSelect="Section"
                        labelText='Section'
                    />
                </div>
                <div className='tw-mb-3'>
                    <SelectInput
                        name="requestType"
                        value={transferCertificateFilterState.requestType}
                        onChange={filterHandler}
                        menuItems={requestType}
                        valueKey="reqType"
                        textKey="reqType"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Request Type"
                        labelText="Request Type"
                    />
                </div>

                <div className='tw-mb-3'>
                    <CustomDatePicker
                        name="dateRange"
                        startDate={transferCertificateFilterState.tcApplicationStartDt}
                        endDate={transferCertificateFilterState.tcApplicationEndDt}
                        onChange={handleDateChange}
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText='TC Application Date Range'
                        portalId={"transfer-certificate-advance-filter"}
                    />
                </div>
            </div>

            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-items-center tw-justify-end tw-gap-2">
                    {/* <button
                        type="button"
                        className="tw-bg-gray-200 tw-text-gray-800 tw-px-3 tw-py-1 tw-rounded"
                        onClick={resetHandler}
                    >
                        Reset
                    </button> */}
                    <Button
                        type="submit"
                        variant='primary'
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>

        </>
    )
}

export default AdvanceFilterModal
