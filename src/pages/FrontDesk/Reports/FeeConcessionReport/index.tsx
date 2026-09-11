import React, { useEffect, useRef, useState } from "react";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { SelectInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsslice";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import StatusCard from "./StatusCard";
import ConcessionDetails from "./ConcessionDetails";
import ConcessionChart from "./ConcessionChart";
import { activeStatus, feeType } from "./helper";
import ClassWiseConcession from "./ClassWiseConcession";
import TermwiseConcession from "./TermWiseConcession";
import { getConcessionDashboardDataListAct, getStudentConcessionListAct } from "../../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import { toast } from "react-toastify";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    feeType: "",
    status: "",
};

export default function FeeConcessionReport() {
    const [filterState, setFilterState] = useState(initialValues);
    const dispatch = useAppDispatch();
    const [concessionData, setConcessionData] = useState<any>(null);

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    function getFeeConcessionReportApiCall(skipFilters = false) {
        const payload = {
            branchId,
            // academicYearId: filterState.academicYearId,
            ...filterState,
        };
        dispatch(
            getConcessionDashboardDataListAct(
                generateActionPayload("fee_concession_dashboard_data", undefined, payload)
            )
        );
    }    

    const {
        academicYearListResp,
        brchCurriculumResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        branchClassResp,
        getConcessionDashboardDataListResp,
        masterFeeSettingsErrorResp,
    } = useAppSelector(
        ({ instAcademics, branchAcademics, appData, masterFeeSettings }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            branchClassResp: branchAcademics.branchClassResp,
            getConcessionDashboardDataListResp: masterFeeSettings.getConcessionDashboardDataListResp,
            masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp,
        }),
        shallowEqual
    );

    const feeConcessionDashboardRef = useRef({
        prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp,
    });

    useEffect(() => {
        const { prevMasterFeeSettingsErrorResp } = feeConcessionDashboardRef.current;
        if (masterFeeSettingsErrorResp && masterFeeSettingsErrorResp !== prevMasterFeeSettingsErrorResp) {
            const { details }: any = masterFeeSettingsErrorResp;
            toast.error(details || "Something went wrong.");
        }

        feeConcessionDashboardRef.current.prevMasterFeeSettingsErrorResp = masterFeeSettingsErrorResp;
    }, [masterFeeSettingsErrorResp]);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        
        const payload1 = { academicYearId: yearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }, [academicYearListResp]);

    useEffect(() => {
        if (filterState.academicYearId) {
            getFeeConcessionReportApiCall();
        }
    }, [filterState.academicYearId]);
    

    useEffect(() => {
        if (getConcessionDashboardDataListResp) {
          setConcessionData(getConcessionDashboardDataListResp);
        }
      }, [getConcessionDashboardDataListResp]);

      function getReportHandler() {
        getFeeConcessionReportApiCall();
    }

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setFilterState((prev: any) => {
            const updatedState = { ...prev, [name]: value };
            if (name === 'academicYearId') {
                updatedState.curriculumId = "";
                updatedState.classId = "";
            } else if (name === 'curriculumId') {
                updatedState.classId = "";
            }
            return updatedState;
        });
        pagination.current.pageNo = 0;
        if (name === 'academicYearId') {
            const payload1 = { academicYearId: value, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
            dispatch(resetBrchClassAct(undefined));
        } else if (name === 'curriculumId') {
            const payload = { academicYearId : filterState.academicYearId, branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100  };
            if (!value) {
                dispatch(resetBrchClassAct(undefined));
            } else {
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { data: academicYearList } = academicYearListResp || {};
    const { content: classTypes } = branchClassResp || {};
    
    return (
        <div className="page-content fee-status-reports">
            <div className="container-fluid">
                <BreadCrumb title="Students Management" pageTitle="Fee" />

                <div className="tw-mt-4">
                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                                Fee Concession Report
                            </h4>
                        </div>

                        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mt-4 tw-p-2">
                            <div className="tw-col-span-2">

                            <SelectInput
                                name="academicYearId"
                                value={filterState.academicYearId}
                                onChange={filterHandler}
                                menuItems={academicYearList || []}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                formgroupClassName="tw-mb-0"
                                labelText="Academic Year"
                                floatingLabel
                            />
                            </div>
                            <div className="tw-col-span-2">
                            <SelectInput
                                name="curriculumId"
                                value={filterState.curriculumId}
                                onChange={filterHandler}
                                menuItems={curriculumTypes || []}
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                formgroupClassName="tw-mb-0"
                                labelText="Curriculum"
                                floatingLabel
                            />

                            </div>
                            <div className="tw-col-span-2">
                            <SelectInput
                                name="classId"
                                value={filterState.classId}
                                onChange={filterHandler}
                                menuItems={classTypes || []}
                                valueKey="id"
                                textKey="shortName"
                                labelText="Class"
                                floatingLabel
                                formgroupClassName="tw-mb-0"
                            />

                            </div>
                            <div className="tw-col-span-2">

                            <SelectInput
                                name="feeType"
                                value={filterState.feeType}
                                onChange={filterHandler}
                                menuItems={feeType || []}
                                valueKey="id"
                                textKey="name"
                                labelText="Fee Type"
                                floatingLabel
                                formgroupClassName="tw-mb-0"
                            />
                            </div>
                            <div className="tw-col-span-2">

                            <SelectInput
                                name="status"
                                value={filterState.status}
                                onChange={filterHandler}
                                menuItems={activeStatus || []}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                labelText="Status"
                                floatingLabel
                            />
                            </div>
                        </div>
                        <div className="tw-flex tw-items-center tw-justify-end tw-gap-2 tw-mt-3 tw-p-2">
                            <div
                                style={{ backgroundColor: "#F4F7FA" }}
                                onClick={() => { }}
                                className="tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-1.5 tw-rounded"
                            >
                                <FilterSvg height="18px" width="18px" />
                                <span>Filters</span>
                            </div>
                            <Button
                                type="submit"
                                variant="primary"
                                onClick={getReportHandler}
                            >
                                Get Report
                            </Button>
                        </div>

                    </div>

                    <StatusCard concessionData={concessionData} />

                    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">
                        <div className="tw-col-span-12 xl:tw-col-span-5">
                            <ConcessionChart
                                reportData={getConcessionDashboardDataListResp?.feeConcessionTypeDetails}
                                feeType={filterState.feeType}
                            />
                        </div>
                        <div className="tw-col-span-12  xl:tw-col-span-7">
                            <TermwiseConcession />
                        </div>
                    </div>

                    <div>
                        <ClassWiseConcession feeType={filterState.feeType} />
                    </div>

                    <div>

                    <ConcessionDetails
                        academicYearId={filterState.academicYearId}
                        curriculumId={filterState.curriculumId}
                        classId={filterState.classId}
                    />
                    </div>
                </div>
            </div>
        </div>

    )
}
