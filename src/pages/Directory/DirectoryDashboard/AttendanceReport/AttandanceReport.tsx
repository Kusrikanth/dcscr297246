import React, { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { shallowEqual } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { toast } from 'react-toastify';
import { Current_Date_YYYYMMDD } from '../../../../utility/dateutility';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { getAttendanceTrackerReportAct, getExportAttendanceTrackerReportAct } from '../../../../store/academic/academicRequest/academicrequestactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { downloadExcelFile } from '../../../../utility/commonutility';
import { DateInput, ModalContainerUpdated } from '../../../../Components/Common';
import ExportModal from '../../StudentManagement/ExportModal';
import { useModal } from '../../../../hooks/modalhook';
import Button from '../../../../Components/Common/Button';


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

    } = useAppSelector(
        ({ instAcademics, appData, academicRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            getAttendanceTrackerReportResp: academicRequest.getAttendanceTrackerReportResp,
            currentInstIdResp: appData.currentInstIdResp,
            exportAttendanceTrackerReportResp: academicRequest.exportAttendanceTrackerReportResp,
        }),
        shallowEqual
    );

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

    return (
        <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">

            <div className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-100">
                <div className="tw-flex tw-items-center tw-justify-between">

                    <h4 className="tw-text-[16px] tw-font-[500] tw-text-gray-800 text-align-center tw-mb-0">
                        Attendance Tracker
                    </h4>

                    <Button
                        id="export-btn"
                        onClick={openExportSectionModalHnldr}
                        variant='exportBtn'
                    >
                        <img src={ExportIcon} alt="Export" className="tw-w-5 tw-h-5" />
                    </Button>

                    <UncontrolledTooltip placement="bottom" target="export-btn">
                        Export
                    </UncontrolledTooltip>
                </div>
            </div>

            <div className=" tw-py-4">

                <div className="tw-border-b tw-pb-2 tw-mb-4 tw-pr-2">
                    <div className="tw-w-full md:tw-w-1/2 md:tw-ml-auto">
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

                {totalCount === 0 ? (
                    <div className="tw-flex tw-items-center tw-justify-center tw-min-h-[250px] tw-text-gray-500">
                        <p>No Record Found</p>
                    </div>
                ) : (
                    <div className="tw-flex tw-flex-col tw-items-center">

                        <div className="tw-flex tw-justify-center tw-mb-6">
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

                        <div className="tw-grid tw-grid-cols-2 tw-gap-y-4 tw-gap-x-6 tw-w-full">

                            {series.map((item: any, index: number) => (
                                <div key={index} className="tw-flex tw-items-start tw-gap-3">

                                    <div
                                        className="tw-w-1 tw-rounded"
                                        style={{ backgroundColor: color[index] }}
                                    ></div>

                                    <div>
                                        <h6 className="tw-text-xs tw-text-gray-500 tw-font-normal">
                                            {chartOptions?.labels?.[index]}
                                        </h6>

                                        <span className="tw-text-sm tw-font-medium tw-text-gray-700">
                                            {item}
                                        </span>
                                    </div>

                                </div>
                            ))}

                            <div className="tw-flex tw-items-start tw-gap-3">
                                <div
                                    className="tw-w-1 tw-rounded"
                                    style={{ backgroundColor: "#405189" }}
                                ></div>

                                <div>
                                    <h6 className="tw-text-xs tw-text-gray-500 tw-font-normal">
                                        Total
                                    </h6>

                                    <span className="tw-text-sm tw-font-semibold tw-text-gray-800">
                                        {totalCount}
                                    </span>
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
