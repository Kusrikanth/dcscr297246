import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { SelectInput } from '../../../Components/Common';
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { getAdmissionSummaryAct } from '../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { generateActionPayload } from '../../../utility/reduxutility';
import { shallowEqual } from 'react-redux';
import { getBranchCurriculumAct, resetBrchCurriculumAct } from '../../../store/branchsettings/branchacademics/branchacademicsactions';

const initialValues = {
    academicYearId: "",
    curriculumId: "",
};

const TermwiseFee = ({ academicYearId }: any) => {
    const [filterState, setFilterState] = useState(initialValues);
    const [data] = useState(["#0AB39C", "#FEB019"]);
    const [series, setSeries] = useState<number[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const dispatch = useAppDispatch();

    const AdmissionSummaryWiseApiCall = (otherProps?: any) => {

        const { academicYearId, curriculumId } = upcomingEvents.values;
        let payload = {
            academicYearId,
            curriculumId,
            branchId,
            instituteId,
            ...otherProps,
        };
        dispatch(getAdmissionSummaryAct(generateActionPayload('get_admission_summary', undefined, payload)))
    }

    const {
        academicYearListResp,
        brchCurriculumResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getAdmissionSummaryResp,
    } = useAppSelector(
        ({ instAcademics, branchAcademics, appData, applicationSale }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getAdmissionSummaryResp: applicationSale.getAdmissionSummaryResp
        }),
        shallowEqual
    );


    useEffect(() => {
        if (getAdmissionSummaryResp) {
            const { totalDaySchloar, totalHostel, total } = getAdmissionSummaryResp[0];
            setSeries([totalDaySchloar || 0, totalHostel || 0]);
            setTotalCount(total || 0);
        }
    }, [getAdmissionSummaryResp]);


    useEffect(() => {
        if (academicYearId) {
            upcomingEvents.setValues((prev: any) => ({ ...prev, academicYearId }))
            getCurriculumApiCall({ academicYearId });
            AdmissionSummaryWiseApiCall({ academicYearId });
        }
    }, [academicYearId]);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: upcomingEvents.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }


    const chartOptions: ApexCharts.ApexOptions = useMemo(() => ({
        chart: {
            type: 'donut',
        },
        labels: ["Days Scholar", "Hostel"],
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '22px',
                            formatter: function () {
                                return "Total";
                            },
                        },
                        value: {
                            show: true,
                            fontSize: '16px',
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
                        }
                    }
                }
            }
        },
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
        colors: data,
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: true,
            dropShadow: {
                blur: 3,
                opacity: 1
            }
        },
        stroke: {
            show: false,
        },
    }), [data, totalCount]);

    const upcomingEvents = useFormik({
        enableReinitialize: true,
        initialValues: filterState,
        onSubmit: (values) => { },
    })

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "academicYearId") {
            if (value) {
                getCurriculumApiCall({ academicYearId: value });
                upcomingEvents.setValues((prev) => ({ ...prev, [name]: value, curriculumId: "" }))
                AdmissionSummaryWiseApiCall({ [name]: value, curriculumId: "" })
            }
            else {
                upcomingEvents.setValues((prev) => ({ ...prev, [name]: value, curriculumId: "" }))
                AdmissionSummaryWiseApiCall({ [name]: value, curriculumId: "" })
                dispatch(resetBrchCurriculumAct(undefined))
            }
        }
        else if (name === 'curriculumId') {
            upcomingEvents.setValues((prev) => ({ ...prev, [name]: value }))
            AdmissionSummaryWiseApiCall({ [name]: value })
        }
    }

    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { data: academicYearList } = academicYearListResp || {};


    return (
        <>
            <div className="card ">
                <div className="card-header">
                    <div className="row align-items-center">
                        <div className="col-12 ">
                            <h4 className="card-title mb-0">Admission Summary</h4>
                        </div>
                    </div>
                </div>

                <div className="card-body">

                    <div className="row d-flex flex-column h-100">
                        <div className='row pb-2 w-100 mx-auto px-0'>
                            <div className='col-6'>
                                <SelectInput
                                    name="academicYearId"
                                    value={upcomingEvents.values.academicYearId}
                                    onChange={filterHandler}
                                    menuItems={academicYearList || []}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    // inputClassName="border-0"
                                    formgroupClassName="mb-0"
                                    labelText="Academic Year"
                                    floatingLabel
                                />
                            </div>
                            <div className='col-6'>

                                <SelectInput
                                    name="curriculumId"
                                    value={upcomingEvents.values.curriculumId}
                                    onChange={filterHandler}
                                    menuItems={curriculumTypes || []}
                                    valueKey="branchCurriculumId"
                                    textKey="curriculumName"
                                    // inputClassName="bg-light border-0"
                                    formgroupClassName="mb-0"
                                    labelText="Curriculum"
                                    floatingLabel
                                />
                            </div>

                        </div>

                        <div className="col d-flex align-items-center justify-content-center " >
                            <div className="d-flex justify-content-center w-100">
                                <ReactApexChart
                                    type="donut"
                                    options={chartOptions}
                                    series={series}
                                    height={230}
                                    width={230}
                                />
                            </div>
                        </div>

                        <div className='col-12 px-4'>
                            <div className="row d-flex align-items-center justify-content-center mt-3">
                                {Array.isArray(series) && series.length > 0 && series?.map((item: any, index: number) => (
                                    <div className="d-flex align-items-center justify-content-center mb-3 col-4" key={index}>
                                        <div
                                            className="d-flex ps-3"
                                            style={{
                                                borderLeft: `3px solid ${data[index]}`,
                                            }}
                                        >
                                            <div>
                                                <h6 className="text-muted fs-12 fw-normal">{chartOptions?.labels?.[index]}</h6>
                                                <div className="d-flex align-items-center">
                                                    <i className="ri-group-line fs-16 text-muted"></i>
                                                    <span className='fs-12 mb-0 ms-1 me-2'>
                                                        {item}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {Array.isArray(series) && series.length > 0 && <div className="d-flex align-items-center justify-content-center mb-3 col-4" >
                                    <div
                                        className="d-flex ps-3"
                                        style={{
                                            borderLeft: `3px solid #405189`,
                                        }}
                                    >
                                        <div>
                                            <h6 className="text-muted fs-12 fw-normal">{"Total"}</h6>
                                            <div className="d-flex align-items-center">
                                                <i className="ri-group-line fs-16 text-muted"></i>
                                                <span className='fs-12 mb-0 ms-1 me-2'>
                                                    {totalCount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TermwiseFee;
