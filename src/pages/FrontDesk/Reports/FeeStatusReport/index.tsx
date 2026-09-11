import React, { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { SelectInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import FeeCollectionCard from "./FeeCollectionCard";
import FeeReceivedDetails from "./FeeRecievedDetails";
import StatusCard from "./StatusCard";
import TermwisePaid from "./TermwisePaid";
import TotalFeeCollection from "./TotalFeeCollection";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getFeeNameForFilterAct, setFeeNameForFilterAct } from "../../../../store/fee/feereport/feereportactions";
import { feeStatusReportAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { feeTypes } from "./helper";
import Button from "../../../../Components/Common/Button";
export default function FeeStatusReport() {
    const dispatch = useDispatch();
    const [filterState, setFilterState] = useState({
        academicYearId: "",
        curriculumId: "",
        feeType: "",
        feeName: "",
    });
    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp,
        feeStatusReportResp,
        brchCurriculumResp,
        feeNameForFilterResp,
        showApiLoader } =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, globalData, reports, feeReport }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                feeStatusReportResp: reports.feeStatusReportResp,
                feeNameForFilterResp: feeReport.feeNameForFilterResp,
                showApiLoader: globalData.showApiLoader,
            }),
            shallowEqual
        );

    const feeStatusReportRef = useRef({
        prevAcademicYearListResp: academicYearListResp
    });

    useEffect(() => {
        const { prevAcademicYearListResp } = feeStatusReportRef.current;
        if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
            const { data } = academicYearListResp || {};
            if (Array.isArray(data)) {
                let yearId = data.find((year: any) => year.yearStatus === 'CURRENT')?.academicYearId;
                setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
                getFeestatusReportApiCall({ academicYearId: yearId });
                const payload1 = { academicYearId: yearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
                dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    
            }
        }
        feeStatusReportRef.current.prevAcademicYearListResp = academicYearListResp;
    }, [academicYearListResp]);


    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    }, [instituteId]);



    function getFeestatusReportApiCall(otherProps?: any) {
        const payload = {
            branchId,
            ...filterState,
            ...otherProps,
        }
        dispatch(feeStatusReportAct(generateActionPayload("fee_status_report", undefined, payload)));
    }

    function getFeeNameApiCall(feeType: string, academicYearId: string) {
        if (feeType && academicYearId) {
            dispatch(getFeeNameForFilterAct(generateActionPayload("get_feename_byfeetype", undefined, { branchId, feeType, academicYearId })));
        } else {
            dispatch(setFeeNameForFilterAct(undefined));
        }
    }

    function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value }));
    }

    function onChangeAcademicYearHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState,  [name]: value, feeName: "", curriculumId: "", }));
        if (name === 'academicYearId') {
            const payload1 = { academicYearId: value, branchId: branchId,  pageNo: 0,  pageSize: 100,  sortBy: "curriculumName",  orderBy: "asc", };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        }
        getFeeNameApiCall(filterState.feeType, value);
    }

    function onChangeFeeTypeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value, feeName: "" }));
        getFeeNameApiCall(value, filterState.academicYearId);
    }

    function getReportHandler() {
        getFeestatusReportApiCall();
    }

    const feeNameOptions = useMemo(() => {
        if (Array.isArray(feeNameForFilterResp)) {
            return feeNameForFilterResp.map((item: any) => ({ name: item }));
        }
        return [];
    }, [feeNameForFilterResp]);


    return (
        <div className="page-content fee-status-reports">
            <div className="container-fluid">
                <BreadCrumb title="Students Management" pageTitle="Fee" />

                <div className="tw-mt-4">
                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                                Fee Status Reports
                            </h4>
                        </div>

                        <div className="tw-p-4">
                            <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-12 tw-gap-4 tw-items-end">

                                <div className="lg:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={filterState.academicYearId}
                                        onChange={onChangeAcademicYearHndlr}
                                        menuItems={academicYearListResp?.data}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="mb-0"
                                        defaultSelect="Academic Year"
                                    />
                                </div>

                                <div className="lg:tw-col-span-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={filterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={brchCurriculumResp?.data}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="mb-0"
                                        defaultSelect="Curriculum"
                                    />
                                </div>

                                <div className="lg:tw-col-span-2">
                                    <SelectInput
                                        name="feeType"
                                        value={filterState?.feeType}
                                        onChange={onChangeFeeTypeHndlr}
                                        menuItems={feeTypes}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="mb-0"
                                        defaultSelect="Fee Type"
                                    />
                                </div>

                                <div className="lg:tw-col-span-2">
                                    <SelectInput
                                        name="feeName"
                                        value={filterState.feeName}
                                        onChange={filterHandler}
                                        menuItems={feeNameOptions}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="mb-0"
                                        defaultSelect="Fee Name"
                                    />
                                </div>

                                <div className="lg:tw-col-span-4 tw-flex tw-justify-end">
                                    <Button
                                        type="button"
                                        onClick={getReportHandler}
                                        variant="primary"
                                    >
                                        Get Report
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <FeeCollectionCard reportData={feeStatusReportResp?.feeTypeSummary} />
                    <TermwisePaid reportData={feeStatusReportResp?.termDetailsSummary} />
                    <StatusCard reportData={feeStatusReportResp?.unpaidStudentCountSummaryMain} />
                    <TotalFeeCollection reportData={feeStatusReportResp?.classWiseSummary} />
                    <FeeReceivedDetails />
                </div>
            </div>
        </div>

    )
}