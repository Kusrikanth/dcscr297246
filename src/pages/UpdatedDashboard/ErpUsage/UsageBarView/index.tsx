import { useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getPlatformStatsLoginCountAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import ReactApexChart from "react-apexcharts";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import BranchWiseUsage from "../BranchWiseUsage";

const colors = [
    "#F4A261",
    "#405189",
    "#F06530",
    "#FEB019",
    "#0AB39C",
    "#6C757D",
    "#f06548",
    "#2A9D8F",
    "#E9C46A",
]

const UsageBarView = (props: any) => {
    const { branchId, academicYearId, startDate, endDate, roleType } = props || {}
    const [activeId, setActiveId] = useState<any>("chart");
    const dispatch = useAppDispatch();

    const {
        currentInstIdResp: instituteId, currentBranchIdResp, academicYearListResp, brchCurriculumResp,
        branchListResp, getPlatformStatsLoginCountResp } =
        useAppSelector(({ appData, branch, instAcademics, branchAcademics, reports }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            branchListResp: branch.branchListResp,
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            getPlatformStatsLoginCountResp: reports.getPlatformStatsLoginCountResp,
        }), shallowEqual)

    // const MenuOptions: Array<IMenuOptions> = [
    //     {
    //         id: "curriculum-wise",
    //         labelName: "Parents",
    //         customPadding: "0px 5px 5px 5px",
    //         Icon: "",
    //     },
    //     {
    //         id: "gender-wise",
    //         labelName: "Staff",
    //         customPadding: "0px 5px 5px 5px",
    //         Icon: "",
    //     },
    // ];

    // function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    //     const { currentTarget } = event;
    //     const menuId = currentTarget.getAttribute("data-id") || "";
    //     setActiveId(menuId);
    // }

    useEffect(() => {
        if (roleType || academicYearId || startDate || endDate) {
            usageBarViewApiCall();
        }
    }, [academicYearId, startDate, endDate, roleType]);

    const usageBarViewApiCall = (otherProps?: any) => {
        const payload = {
            instituteId,
            academicYearId, startDate, endDate, roleType,
            ...otherProps,
        };
        if (payload.roleType) {
            dispatch(getPlatformStatsLoginCountAct(generateActionPayload('get_platform_stats_login_count', undefined, payload)))
        }
    }

    const firstBranch = useMemo(() => getPlatformStatsLoginCountResp?.statCount ? Object.values(getPlatformStatsLoginCountResp?.statCount)[0] : [], [getPlatformStatsLoginCountResp]);
    const category = useMemo(() => firstBranch ? Object.keys(firstBranch).filter(key => (key !== "TOTAL" && key !== "NOTLOGGEDINCOUNT")) : [], [firstBranch]);

    const series = useMemo(() => getPlatformStatsLoginCountResp?.statCount ? Object.entries(getPlatformStatsLoginCountResp?.statCount).map(([name, data]: any, index: number) => {
        return {
            name,
            type: "column",
            data: category.map((cat: any) => data[cat] || 0),
            color: colors[index]
        };
    }) : [], [getPlatformStatsLoginCountResp])

    const MenuOptions = [

        {
            id: "chart",
            labelName: "Chart",
            customPadding: "5px 5px 5px 5px",
        },
        {
            id: "table",
            labelName: "Table",
            customPadding: "5px 5px 5px 5px",
        }

    ];

    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event,
            menuId = currentTarget.getAttribute("data-id");
        setActiveId(menuId);
    }

    const options: ApexCharts.ApexOptions = useMemo(
        () => {
            return {
                chart: {
                    type: "bar",
                    height: 350,
                    stacked: true,
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: true,
                    },
                },
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: "bottom",
                                offsetX: -10,
                                offsetY: 0,
                            },
                        },
                    },
                ],
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: "50%",
                        borderRadiusApplication: "end",
                        borderRadiusWhenStacked: "last",
                        dataLabels: {
                            total: {
                                enabled: true,
                                style: {
                                    fontSize: "10px",
                                    fontWeight: 600,
                                },
                            },
                        },
                    },
                },
                xaxis: {
                    categories: category,
                },
                legend: {
                    position: "bottom",
                },
                fill: {
                    opacity: 1,
                },
                colors: [
                    "#405189",
                    "#0AB39C",
                    "#FEB019",
                    "#f06548",
                    "#2A9D8F",
                    "#E9C46A",
                    "#F4A261",
                ],
            }
        }, [category]
    )

    function getActiveMenuComponent(menuId: string) {
        switch (menuId) {
            case "table":
                return BranchWiseUsage;
            case "chart":
                return () => { <></> };
            default:
                return () => { <></> };
        }
    }

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeId);
        return <TabComponent instituteId={instituteId} academicYearId={academicYearId} startDate={startDate} endDate={endDate} roleType={roleType}></TabComponent>
    }, [activeId]);

    return (
        <>
            <div className="curriculum-wise-strength-container">
                <div className="card !tw-shadow-sm !tw-rounded-2xl">
                    <div className="card-header !tw-p-2 !tw-px-3 !tw-rounded-t-2xl">
                        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-items-center tw-gap-3">
                            <div>
                                <h4 className="card-title !tw-mb-0"> {activeId === "chart" ? "Login Count" : "Branch Wise Usage"}</h4>
                            </div>
                            <div className="lg:tw-justify-self-end">
                                <UpdatedHorizontalTab
                                    MenuOptions={MenuOptions}
                                    clickMenuHandler={clickMenuHandler}
                                    activeTabId={activeId}
                                    horizontalClass="tw-overflow-auto tw-whitespace-nowrap tw-justify-end horizontal-menu-updated-style"
                                ></UpdatedHorizontalTab>
                            </div>
                        </div>
                    </div>

                    {activeId === "chart" && <div className="card-body !tw-p-0">
                        <div className="curriculum-wise-strength-bar-container">
                            <ReactApexChart
                                options={options}
                                series={series}
                                type="bar"
                                height={350}
                            />
                        </div>
                    </div>}
                    {activeComponent}
                </div>
            </div>
        </>
    );
};

export default UsageBarView;
