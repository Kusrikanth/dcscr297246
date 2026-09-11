import React, { useEffect, useMemo, useState } from 'react';
import { DateInput, ModalContainerUpdated, SelectInput, StatusLabel } from '../../../Components/Common';
import { useFormik } from 'formik';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { getAttendanceTrackerReportAct, getExportAttendanceTrackerReportAct } from '../../../store/academic/academicRequest/academicrequestactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import ReactApexChart from 'react-apexcharts';
import { Current_Date_YYYYMMDD } from '../../../utility/dateutility';
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { useModal } from '../../../hooks/modalhook';
import ExportModal from '../../Directory/StudentManagement/ExportModal';
import { toast } from 'react-toastify';
import { downloadExcelFile, toPascalCase } from '../../../utility/commonutility';
import { getInstBranchesAct } from '../../../store/mastersettings/branch/branchactions';
import Button from '../../../Components/Common/Button';

const initialValues = {
    startDate: Current_Date_YYYYMMDD,
    staff: "Teaching",
    academicYearId: "",
};

const AttandanceReport = () => {

    const { closeModal: closeExportSectionModalHnldr, openModal: openExportSectionModalHnldr, modalState: exportSectionModalState } = useModal();
    const [color] = useState(["#0AB39C", "#f06548", "#FEB019", "#405189"]);
    const [series, setSeries] = useState<number[]>([0, 0, 0]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const dispatch = useAppDispatch();
    const studentAttendanceApiCall = (otherProps?: any) => {
        const payload = {
            branchId,
            ...upcomingEvents.values,
            ...otherProps,
        };
        dispatch(getAttendanceTrackerReportAct(generateActionPayload('get_attendance_tracker_report', undefined, payload)))
    }

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        getAttendanceTrackerReportResp,
        currentInstIdResp: instituteId,
        exportAttendanceTrackerReportResp,
        branchListResp,
    } = useAppSelector(
        ({ instAcademics, branch, appData, academicRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            branchListResp: branch.branchListResp,
            getAttendanceTrackerReportResp: academicRequest.getAttendanceTrackerReportResp,
            currentInstIdResp: appData.currentInstIdResp,
            exportAttendanceTrackerReportResp: academicRequest.exportAttendanceTrackerReportResp,
        }),
        shallowEqual
    );

    useEffect(() => {
        if (instituteId) {
            dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, {
                pageSize: 100, pageNo: 0, instituteId,
            })));
        }
    }, [instituteId]);

    const branchInfo = useMemo(() => {
        const { data = [] } = branchListResp || {};
        return data.find((branch: any) => branch.branchId === +branchId);
    }, [branchListResp, instituteId, branchId]);


    const branchDashboardRef = React.useRef({
        prevExportAttendanceTrackerReportResp: exportAttendanceTrackerReportResp,
    });

    useEffect(() => {
        const { prevExportAttendanceTrackerReportResp } = branchDashboardRef.current;

        if (exportAttendanceTrackerReportResp && prevExportAttendanceTrackerReportResp !== exportAttendanceTrackerReportResp) {
            toast.success("Exported Atendance Tracker Report Successfully");
            closeExportSectionModalHnldr();
            studentAttendanceApiCall();
            downloadExcelFile(exportAttendanceTrackerReportResp, "Attendance_Tracker_Report");

        }

        branchDashboardRef.current.prevExportAttendanceTrackerReportResp = exportAttendanceTrackerReportResp;
    }, [exportAttendanceTrackerReportResp])

    useEffect(() => {
        if (branchId && Array.isArray(academicYearListResp?.data) && academicYearListResp.data.length > 0) {
            const { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
            upcomingEvents.setValues((prev) => ({ ...prev, academicYearId }))
            studentAttendanceApiCall({ academicYearId });
        }
    }, [branchId, instituteId, academicYearListResp]);

    useEffect(() => {
        if (getAttendanceTrackerReportResp) {
            const { presentCount, absentCount, notMarkedCount, totalCount } = getAttendanceTrackerReportResp;

            setSeries([presentCount, absentCount, notMarkedCount]);
            setTotalCount(totalCount);
        }
    }, [getAttendanceTrackerReportResp]);

    const upcomingEvents = useFormik({
        initialValues,
        onSubmit: (values) => { },
    })

    const filterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        upcomingEvents.setValues({ ...upcomingEvents.values, [name]: value });
        studentAttendanceApiCall({ [name]: value });
    }

    function submitExportHndlr() {
        const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};

        const payload = {
            branchId,
            academicYearId,
            startDate: upcomingEvents.values.startDate
        };
        dispatch(getExportAttendanceTrackerReportAct(generateActionPayload('export_attendance_tracker_report', undefined, payload, { responseType: 'blob' })))
    }

    const chartOptions: ApexCharts.ApexOptions = useMemo(() => ({
        chart: {
            type: 'donut',
        },
        labels: ["Present", "Absent", "Not Marked"],
        responsive: [
            {
                breakpoint: 1206,
                options: {
                    chart: {
                        width: 260,
                        height: 260,
                    },
                },
            },
            {
                breakpoint: 767,
                options: {
                    chart: {
                        width: 230,
                        height: 230,
                    },
                },
            },
        ],
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        value: {
                            show: true,
                            fontSize: "16px",
                        },
                        name: {
                            show: true,
                            formatter: function () {
                                return "Total";
                            },
                        },
                        total: {
                            show: true,
                            color: "black",
                            fontSize: "16px",
                            showAlways: true,
                            label: "Total",
                            formatter: function () {

                                return `${totalCount}`;
                            },
                        },
                    },
                },
            },
        },
        colors: color,
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return `${val.toFixed(0)}%`;
            },
            style: {
                fontSize: "10px",
                colors: ["#FFFFFF"],
            },
        },
    }), [color, totalCount])

    const { data: academicYearList } = academicYearListResp || {};

    return (
        <div className='tw-bg-white tw-rounded-lg tw-shadow-sm'>
            <div className="tw-py-3 tw-px-4 tw-border-b">
                <div className="tw-flex tw-items-center">
                    <div className="tw-flex-1 tw-pr-0">
                        <h4 className="tw-mb-0 tw-grow tw-text-[15px] tw-font-semibold tw-text-gray-800">Attendance Tracker</h4>
                    </div>
                    <div className="tw-flex-none tw-ml-auto">
                        <Button
                            id="export-btn"
                            variant='exportBtn'
                            onClick={openExportSectionModalHnldr}
                        >
                            <img src={ExportIcon} className="tw-w-4 tw-h-4" />
                            <UncontrolledTooltip placement="bottom" target="export-btn">
                                Export
                            </UncontrolledTooltip>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="tw-pt-3 tw-px-0 tw-pb-2">
                <div className='tw-grid tw-grid-cols-2 tw-gap-3 tw-border-b tw-pb-3 tw-w-full tw-px-3 tw-mx-auto'>
                    <div className='tw-w-full'>
                        <SelectInput
                            name="academicYearId"
                            value={upcomingEvents.values.academicYearId}
                            onChange={filterHandler}
                            menuItems={academicYearList || []}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            formgroupClassName="tw-mb-0"
                            labelText="Academic Year"
                            floatingLabel
                        />
                    </div>
                    <div className='tw-w-full'>
                        <DateInput
                            name="startDate"
                            value={upcomingEvents.values.startDate}
                            onChange={filterHandler}
                            formgroupClassName="tw-mb-0"
                            labelText="Attendance Date"
                            floatingLabel
                            maxDate={Current_Date_YYYYMMDD}
                        />
                    </div>
                </div>
                {totalCount === 0
                    ? (
                        <div
                            className="tw-h-full tw-w-full tw-text-center tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-h-[250px]"
                        >
                            <p className="tw-mb-1 tw-text-gray-600">No Record Found</p>
                            {/* Label muted + medium, value normal */}
                            <div className="tw-text-center tw-mt-2">
                                <div className="tw-py-1 tw-px-2 tw-text-white
                                            tw-bg-[#0ab39c] tw-rounded-[4px]">
                                    <span className="tw-text-gray-100 tw-font-medium">Branch:</span>&nbsp;
                                    {toPascalCase(branchInfo?.branchName) || '-'}
                                </div>
                            </div>
                        </div>
                    )
                    : (
                        <div className='tw-p-4'>
                            <div className="tw-flex tw-flex-col">
                                <div className="tw-w-full">
                                    <div className="tw-flex tw-justify-center">
                                        {series && Array.isArray(series) && series.length > 0 && (
                                            <ReactApexChart
                                                key={upcomingEvents.values.startDate}
                                                type="donut"
                                                options={chartOptions}
                                                series={series}
                                                height={210}
                                                width={210}
                                            />
                                        )}
                                    </div>
                                    {/* Branch name caption: label muted + medium, value normal */}
                                    <div className="tw-flex tw-justify-center tw-text-center tw-mt-2">
                                        <div className="tw-py-1 tw-px-2 tw-text-white
                                            tw-bg-[#0ab39c] tw-rounded-[4px]">
                                            <span className="">Branch:</span>&nbsp;
                                            <span className="tw-font-medium">{toPascalCase(branchInfo?.branchName) || '-'}</span>
                                            
                                        </div>
                                    </div>
                                </div>

                                <div className='tw-w-full tw-px-4'>
                                    <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-mt-3">
                                        {series.map((item: any, index: number) => (
                                            <div className="tw-flex tw-mb-3 tw-w-1/2" key={index}>
                                                <div
                                                    className="tw-flex tw-pl-2"
                                                    style={{
                                                        borderLeft: `3px solid ${color[index]}`,
                                                    }}
                                                >
                                                    <div>
                                                        <h6 className="tw-text-gray-500 tw-text-[12px] tw-font-normal tw-mb-0">{chartOptions?.labels?.[index]}</h6>
                                                        <div className="tw-flex tw-items-center tw-mt-1">
                                                            <span className='tw-text-[12px] tw-mb-0 tw-ml-1 tw-mr-2 tw-font-medium tw-text-gray-700'>
                                                                {item}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="tw-flex tw-mb-3 tw-w-1/2" >
                                            <div
                                                className="tw-flex tw-pl-2"
                                                style={{
                                                    borderLeft: `3px solid #405189`,
                                                }}
                                            >
                                                <div>
                                                    <h6 className="tw-text-gray-500 tw-text-[12px] tw-font-normal tw-mb-0">{"Total"}</h6>
                                                    <div className="tw-flex tw-items-center tw-mt-1">
                                                        <span className='tw-text-[12px] tw-mb-0 tw-ml-1 tw-mr-2 tw-font-medium tw-text-gray-700'>
                                                            {totalCount}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
            <ModalContainerUpdated
                id="export-section-modal"
                isOpen={exportSectionModalState.showModal}
                toggle={closeExportSectionModalHnldr}
                modalTitle="Export Attendance Tracker Report Details"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportSectionModalState.showModal}
                    toggle={closeExportSectionModalHnldr}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={submitExportHndlr}
                    feature="attendance"
                    subFeature="attendance_tracker"
                    remarksText="Enter remarks to export Attendance Tracker Report Details?"
                />
            </ModalContainerUpdated>
        </div>
    );
}

export default AttandanceReport;
