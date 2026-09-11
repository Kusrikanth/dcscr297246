import React, { useMemo, useState } from 'react'
import { Container } from 'reactstrap'
import { SelectInput } from '../../Components/Common'
import BreadCrumb from '../../Components/Common/BreadCrumb'
import DonutChart from '../../Components/Common/DonutChart'
import LineChart from '../../Components/Common/LineChart'
import { default as RupeeSvg } from "../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { default as YellowBook } from "../../assets/imagesdps/academics/YellowBook.svg?react";
import TableContainer from '../../Components/Common/TableContainer'
import { generateColumns, homeWorkData } from './helper'
import { Calendar } from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';

const attedenceArr = [34, 47, 19]
const options = {
    chart: {
        offsetX: -50,
        width: 220,
        height: 220
    },
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,
                    value: {
                        show: true,
                        fontSize: "16px",
                        offsetY: 4
                    },
                    name: {
                        show: false,
                    },
                    total: {
                        show: true,
                        color: "black",
                        fontSize: "16px",
                        showAlways: true,
                        formatter: function (w: any) {

                            let total = w.globals.seriesTotals.reduce((a: any, b: any) => {
                                return a + b;
                            }, 0);
                            return `${w.config.series[1]}%`;
                        },
                    },
                    // total: {
                    //     show: true,
                    //     showAlways: true,
                    //     label: "Total"
                    // }
                }
            }
        }
    },
    responsive: [
        {
            breakpoint: 1469,
            options: {
                chart: {
                    width: 260,
                    height: 260,
                    offsetX: -40
                },
            },
        }
        // {
        //     breakpoint: 1469,
        //     options: {
        //         chart: {
        //             width: 180,
        //             height: 180,
        //         },
        //     },
        // },
        // {
        //     breakpoint: 1200,
        //     options: {
        //         chart: {
        //             width: 100,
        //             height: 100,
        //         },
        //     },
        // },
    ],
    // responsive: [{
    //     breakpoint: 480,
    //     options: {
    //         chart: {
    //             width: 200
    //         },
    //         legend: {
    //             position: 'bottom'
    //         }
    //     }
    // }],
    fill: {
        colors: ["#CFCFCF", "#0AB39C"]
    },
    legend: {
        customLegendItems: ['Completed', 'Pending'],
        offsetX: 0,
        offsetY: 10,
        fontSize: '40px',
        // padding:10,
        markers: {
            fillColors: ["#0AB39C", "#CFCFCF"],
            offsetX: -10
        },
        itemMargin: {
            horizontal: 5,
            vertical: 7
        }
    },
    dataLabels: {
        enabled: false
    },
    tooltip: {
        enabled: false
    }
};
const options1 = {
    chart: {
        // offsetX: -50,
        width: "100%"
    },
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,
                    value: {
                        show: true,
                        fontSize: "16px",
                        fontWeight: 700,
                        fontFamily: "Roboto",
                        offsetY: 4
                    },
                    name: {
                        show: false,
                    },
                    total: {
                        show: true,
                        color: "black",
                        // fontSize: "16px",
                        // fontWeight:1000,
                        showAlways: true,
                        formatter: function (w: any) {
                            return `${24} Days`;
                        },
                    },
                    // total: {
                    //     show: true,
                    //     showAlways: true,
                    //     label: "Total"
                    // }
                }
            }
        }
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }],
    fill: {
        colors: ["#F06548", "#0AB39C", "#FFB81F"]
    },
    legend: {
        // customLegendItems: ['Completed', 'Pending'],
        offsetX: 0,
        offsetY: -10,
        // fontSize: '40px',
        position: "bottom",
        // padding:10,
        markers: {
            fillColors: ["#F06548", "#0AB39C", "#FFB81F"],
            // offsetX: -10
        },
        itemMargin: {
            horizontal: 10,
            vertical: 7
        },
        formatter: function (name: any, object: any) {

            return `${object.w.config.series[object.seriesIndex]}%`
        }
    },
    dataLabels: {
        enabled: false
    },
    tooltip: {
        enabled: false
    }
};
const options2: any = {
    chart: {
        height: 400,
        // type: 'line',
        zoom: {
            enabled: false
        },
        toolbar: {
            tools: {
                download: false
            }
        }
    },
    stroke: {
        show: true,
        width: 2,
        colors: ["#0AB39C"]
    },
    axisTicks: {
        show: true,
        borderType: 'solid',
        color: '#78909C',
        height: 6,
        offsetX: 0,
        offsetY: 0
    },
    dataLabels: {
        enabled: false
    },
    //   stroke: {
    //     show:true,
    //     curve: 'straight'
    //   },
    //   title: {
    //     text: 'Product Trends by Month',
    //     align: 'left'
    //   },
    grid: {
        show: true,
        borderColor: 'black',
        row: {
            //   colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
        },
    },
    xaxis: {
        show: true,
        showAlways: true,
        categories: ['ENG', 'MATH', 'HINDI', 'SST', 'SCI', 'II LANG', 'III LANG'],
        tickPlacement: 'between',
        tooltip: {
            enable: false
        }
    },
    yaxis: {
        show: true,
        showAlways: true,
        min: 0,
        max: 100,
        tickAmount: 5,
        axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#78909C',
            width: 6,
            offsetX: 0,
            offsetY: 0
        },
        tooltip: {
            enabled: false,
            offsetX: 0,
        },
    },
    markers: {
        size: 2,
        strokeColors: "#0AB39C",
        strokeWidth: 3,
        shape: "circle",
        hover: {
            size: 3,
            sizeOffset: 3,
            // strokeColors: "#0AB39C"
        }
    },
    tooltip: {
        enabled: false,
        // style: {
        //     fontSize: '12px',
        //     fontFamily: undefined
        // }
    }


};
const feeDefaultersData = [
    {
        icon: <YellowBook width={"15px"} height={"19px"} />,
        color: "#F7B84B1F",
        subject: "Maths",
        time: "09 : 30 am - 10 : 15 am"
    },
    {
        icon: <YellowBook width={"15px"} height={"19px"} />,
        color: "#F7B84B1F",
        subject: "English",
        time: "09 : 30 am - 10 : 15 am"
    },
    {
        icon: <YellowBook width={"15px"} height={"19px"} />,
        color: "#F7B84B1F",
        subject: "Telugu",
        time: "09 : 30 am - 10 : 15 am"
    },
    {
        icon: <YellowBook width={"15px"} height={"19px"} />,
        color: "#F7B84B1F",
        subject: "Social Science",
        time: "09 : 30 am - 10 : 15 am"
    },
];

const upcomingEvents = [
    {
        eventNo: '09',
        backgroundColor: "#50D3A1",
        eventName: "Guest Lecture For XII-Science",
        eventTime: "12:00pm - 03:30pm",
        notificationTime: "9:20 AM"
    }
]

const BranchAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('today');
    const [date, setDate] = useState(new Date());
    const tabHandler = (activeTab: string) => {
        setActiveTab(activeTab);
    }
    const menuOptions = useMemo(() => ([{
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: () => { },
    }]), []);
    const academicTermsColumns = useMemo(() => generateColumns(menuOptions), []);
    return (
        <div className="page-content master-setup-wrapper">
            <Container fluid>
                <BreadCrumb title="Dashboard" pageTitle="DPS" />
                <div className='row'>
                    <div className='col-6 col-xxl-3'>
                        <div className='card' style={{ height: "195px" }}>
                            <div className='card-body'>
                                <div className='d-flex justify-content-between'>
                                    <span className='fs-15'>Quiz</span>
                                    <SelectInput
                                        name='quiz'
                                        valueKey='text'
                                        textKey='text'
                                        menuItems={[{ text: 'Mathematics' }]}
                                        value="Mathematics"
                                        onChange={() => { }}
                                        formgroupClassName="pe-5"
                                        isDisabled={true}
                                        inputClassName={"border-0"}
                                    />
                                </div>
                                <div>
                                    <div>
                                        <DonutChart
                                            options={options}
                                            series={[20, 80]}
                                            height={"120px"}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='col-6 col-xxl-3'>
                        <div className='card' style={{ height: "195px" }}>
                            <div className='card-body'>
                                <div className='d-flex justify-content-between'>
                                    <span className='fs-15'>Homework</span>
                                    <SelectInput
                                        name='quiz'
                                        valueKey='text'
                                        textKey='text'
                                        menuItems={[{ text: 'All Subjects' }]}
                                        value="All Subjects"
                                        onChange={() => { }}
                                        formgroupClassName="pe-5"
                                        isDisabled={true}
                                        inputClassName={"border-0"}
                                    />
                                </div>
                                <div>
                                    <div>
                                        <DonutChart
                                            options={options}
                                            series={[40, 60]}
                                            height={"120px"}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='col-6 col-xxl-3'>
                        <div className='card' style={{ height: "195px" }}>
                            <div className='card-body'>
                                <div className='d-flex justify-content-between'>
                                    <span className='fs-15'>Fee</span>
                                    <SelectInput
                                        name='quiz'
                                        valueKey='text'
                                        textKey='text'
                                        menuItems={[{ text: 'Term Fee' }]}
                                        value="Term Fee"
                                        onChange={() => { }}
                                        formgroupClassName="pe-5"
                                        isDisabled={true}
                                        inputClassName={"border-0"}
                                    />
                                </div>
                                <div>
                                    <div>
                                        <DonutChart
                                            options={options}
                                            series={[40, 60]}
                                            height={"120px"}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='col-6 col-xxl-3'>
                        <div className='card' style={{ height: "195px" }}>
                            <div className='card-body row'>
                                <div className='col-4'>

                                </div>
                                <div className='col-8 d-flex flex-column align-items-center'>
                                    <h6 className='py-2 fs-15'>Thought of the Day</h6>
                                    <p className='text-center'>" The more that you read, the more things you will know. The more you learn, the more places you’ll go! "</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-4'>
                        <div className="card fee_collection_analysis_wrap">
                            <div className="card-header p-0">
                                <div className="row align-items-center gap-2 m-2">
                                    <div className="col mt-0">
                                        <h4 className="card-title mb-0 flex-grow-1">
                                            Attendance
                                        </h4>
                                    </div>

                                    <div className="col mt-0">
                                        <div className='d-flex justify-content-end'>
                                            <span className="p-2 rounded-start cursor-pointer text-nowrap"
                                                style={{ backgroundColor: `${activeTab === 'today' ? "#3577F119" : "#40518919"}`, color: `${activeTab === 'today' ? "#3577F1" : "#405189"}` }}
                                                onClick={() => tabHandler('today')}>Today</span>
                                            <span className="p-2 cursor-pointer text-nowrap"
                                                style={{ backgroundColor: `${activeTab === 'week' ? "#3577F119" : "#40518919"}`, color: `${activeTab === 'week' ? "#3577F1" : "#405189"}` }}
                                                onClick={() => tabHandler('week')}
                                            >Week</span>
                                            <span className="p-2 rounded-end cursor-pointer text-nowrap"
                                                style={{ backgroundColor: `${activeTab === 'week' ? "#3577F119" : "#40518919"}`, color: `${activeTab === 'month' ? "#3577F1" : "#405189"}` }}
                                                onClick={() => tabHandler('month')}
                                            >Month</span>
                                            {/* <span className="p-2 rounded cursor-pointer me-1 text-nowrap"
                                                style={{ backgroundColor: `${activeTab === '1Y' ? "#3577F119" : "#40518919"}`, color: `${activeTab === 'month' ? "#3577F1" : "#405189"}` }}
                                                onClick={() => tabHandler('month')}
                                            >1Y</span> */}

                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className='card-body px-5 pb-5' style={{ height: "315px" }}>
                                <div>
                                    <DonutChart
                                        options={options1}
                                        series={attedenceArr}
                                        height={"220px"}
                                    />
                                </div>
                                <div className='bg-light d-flex align-items-center justify-content-around'>
                                    <div className='d-flex flex-column align-item-center justify-content-center py-2'>
                                        <h5 className='text-center'>21</h5>
                                        <p className='m-0 text-center'>Present</p>
                                    </div>
                                    <div className='py-2'>
                                        <h5 className='text-center'>3</h5>
                                        <p className='m-0 text-center'>Absent</p>
                                    </div>
                                    <div className='py-2'>
                                        <h5 className='text-center'>1</h5>
                                        <p className='m-0 text-center'>Leave</p>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="card-body pt-0 ps-1">
                                <ReactApexChart
                                    options={options}
                                    series={series}
                                    type="bar"
                                    height={350}
                                />
                            </div> */}
                        </div>
                    </div>
                    <div className='col-4'>
                        <div className="card fee_collection_analysis_wrap">
                            <div className="card-header p-0">
                                <div className="row align-items-center gap-2 m-2">
                                    <div className="col mt-0">
                                        <h4 className="card-title mb-0 flex-grow-1">
                                            Progress
                                        </h4>
                                    </div>

                                    <div className="col mt-0">
                                        <div className='d-flex gap-3 justify-content-end'>
                                            <SelectInput
                                                name="test"
                                                value={'Test 1'}
                                                onChange={() => { }}
                                                menuItems={[{ text: "Test 1" }]}
                                                valueKey="text"
                                                textKey="text"
                                                inputClassName="bg-light border-0"
                                                formgroupClassName="mb-0"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className='card-body p-0'>
                                <div>
                                    <LineChart
                                        options={options2}
                                        series={[{
                                            name: "Desktops",
                                            data: [40, 70, 68, 64, 37, 40, 82]
                                        }]}
                                        height={"305px"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-4'>
                        <div className="card fee_collection_analysis_wrap">
                            <div className="card-header p-0">
                                <div className="row align-items-center gap-2 m-2">
                                    <div className="col mt-0">
                                        <h4 className="card-title mb-0 flex-grow-1">
                                            Time Table
                                        </h4>
                                    </div>

                                    <div className="col mt-0">
                                        <div className='d-flex gap-3 justify-content-end'>
                                            <SelectInput
                                                name="test"
                                                value={'Today'}
                                                onChange={() => { }}
                                                menuItems={[{ text: "Today" }]}
                                                valueKey="text"
                                                textKey="text"
                                                inputClassName="bg-light border-0"
                                                formgroupClassName="mb-0"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className='card-body p-4' style={{ height: "315px" }}>
                                {feeDefaultersData &&
                                    feeDefaultersData?.map((item, i) => (
                                        <div
                                            className="d-flex align-items-center justify-content-between pb-2 mb-2 fee_defaulter_card"
                                            key={i}
                                        >
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="bookmark_book_icon_wrap p-2 rounded-3 me-3"
                                                    style={{ backgroundColor: `${item?.color}` }}
                                                >
                                                    {item?.icon}
                                                </div>
                                                {/* <div
                                                    className="d-flex justify-content-center align-items-center me-3 fee_defaulter_icon_card"
                                                    style={{
                                                        background: `${item?.color}`,
                                                    }}
                                                >
                                                    {item?.icon}
                                                </div> */}

                                                <div className="d-flex flex-column">
                                                    <h5 className="fs-14 fw-bold mb-1">
                                                        {item.subject}
                                                    </h5>
                                                    <h6 className="d-flex text-muted align-items-baseline fs-14 mb-0">
                                                        {item.time}
                                                    </h6>
                                                </div>
                                            </div>

                                            {/* <div className="d-inline-block">
                  <div className="flex-shrink-0 avatar-xs avatar-shadow rounded-circle ms-2">
                    <img
                      className="rounded-circle header-profile-user"
                      src={}
                      alt="Header Avatar"
                    />
                  </div>
                </div> */}
                                        </div>
                                    ))}
                            </div>
                        </div>

                    </div>
                </div>
                <div className='row'>
                    <div className='col-8'>
                        <div className='card fee_collection_analysis_wrap'>
                            <div className='card-header p-0'>
                                <div className="row align-items-center gap-2 m-2">
                                    <div className="col mt-0">
                                        <h4 className="card-title mb-0 flex-grow-1">
                                            Homework
                                        </h4>
                                    </div>

                                    <div className="col mt-0">
                                        <div className='d-flex gap-3 justify-content-end'>
                                            <SelectInput
                                                name="test"
                                                value={'02 Nov 2022 to 31 Dec 2022'}
                                                onChange={() => { }}
                                                menuItems={[{ text: "02 Nov 2022 to 31 Dec 2022" }]}
                                                valueKey="text"
                                                textKey="text"
                                                inputClassName="text-muted border-0"
                                                formgroupClassName="mb-0"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className='card-body p-0'>
                                <TableContainer
                                    columns={academicTermsColumns || []}
                                    data={homeWorkData || []}
                                    divClass="table-responsive mb-1"
                                    theadClass="table-light text-muted align-middle"
                                // showPagination={true}
                                // totalPages={totalPages}
                                // totalRecords={totalElements}
                                // callbackPaginationHndlr={paginationHndlr}
                                // currentPageNumber={pageable && pageable.pageNumber}
                                // sortingHandler={sortingHandler}
                                />
                            </div>

                        </div>
                    </div>
                    <div className='col-4'>
                        <div className='card fee_collection_analysis_wrap'>
                            <div className='card-header p-0'>
                                <div className="row align-items-center gap-2 m-2">
                                    <div className="col mt-0">
                                        <h4 className="card-title mb-0 flex-grow-1">
                                            Upcoming Schedules
                                        </h4>
                                    </div>

                                    <div className="col mt-0">
                                        <div className='d-flex gap-3 justify-content-end'>
                                            <SelectInput
                                                name="test"
                                                value={'02 Nov 2022 to 31 Dec 2022'}
                                                onChange={() => { }}
                                                menuItems={[{ text: "02 Nov 2022 to 31 Dec 2022" }]}
                                                valueKey="text"
                                                textKey="text"
                                                inputClassName="text-muted border-0"
                                                formgroupClassName="mb-0"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className='card-body p-0'>
                                <Calendar
                                    // onChange={setDate}
                                    value={date} />
                                <div className='m-3'>
                                    <h6 className='text-muted'>EVENTS:</h6>
                                    {upcomingEvents &&
                                        upcomingEvents?.map((item, i) => (
                                            <div
                                                className="d-flex align-items-center justify-content-between pb-2 mb-2 fee_defaulter_card"
                                                key={i}
                                            >
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className='d-flex align-items-center'>
                                                        <div
                                                            className="bookmark_book_icon_wrap p-2 rounded-circle me-2"
                                                            style={{ backgroundColor: `${item?.backgroundColor}`, color: "#0AB39C" }}
                                                        >
                                                            {item?.eventNo}
                                                        </div>
                                                        {/* <div
                                                    className="d-flex justify-content-center align-items-center me-3 fee_defaulter_icon_card"
                                                    style={{
                                                        background: `${item?.color}`,
                                                    }}
                                                >
                                                    {item?.icon}
                                                </div> */}

                                                        <div className="d-flex flex-column">
                                                            <h5 className="fs-14 fw-bold mb-1">
                                                                {item.eventName}
                                                            </h5>
                                                            <h6 className="d-flex text-muted align-items-baseline fs-14 mb-0">
                                                                {item.eventTime}
                                                            </h6>
                                                        </div>
                                                    </div>
                                                    <p className='text-muted'>
                                                        {item.notificationTime}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default BranchAdminDashboard
