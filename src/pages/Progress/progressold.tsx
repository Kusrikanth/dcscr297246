import { Container, Card, CardBody, Row, Col } from "reactstrap";
//Common Component
import BreadCrumb from "../../Components/Common/BreadCrumb";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateColumns, searchInputOptions, tableData } from "./helper";
import TableContainer from "./DummyTable";
import {
    DateInput,
    SearchInput,
    // TableExpandable
} from "../../Components/Common";
import {
    AutoSearchInput
} from "../../Components/Common/AutoSearchInput";
import { useFormik } from "formik";
import * as Yup from "yup";

import { generateActionPayload } from "../../utility/reduxutility";
import { getInstituteListAct } from "../../store/mastersettings/instituteinfo/instituteinfoactions";

import { getInstBranchesAct } from "../../store/mastersettings/branch/branchactions";//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { shallowEqual } from "react-redux";
import TreeComponent from "./TreeComponent";
import { treeJson } from "./tree";
import ReactApexChart from 'react-apexcharts';
import { Datepicker } from "./Datepicker";


const initialValues = {
    regexValidation: "999999",
    htmlDateinput: "",
    flatpickerInput: "",
};

const studentListData = [{ "id": "20263", "name": "TALARI SRI LAKSHMI SAHASRA ", "studentCode": "1220100", "rollNumber": "0" }, { "id": "21412", "name": "PUSAPATI SRI AADHYA ", "studentCode": "1220195", "rollNumber": "0" }, { "id": "20172", "name": "SRIYA VELLANKI ", "studentCode": "1220053", "rollNumber": "0" }, { "id": "20121", "name": "AYATHI ", "studentCode": "1220027", "rollNumber": "0" }, { "id": "20277", "name": "KURPAVALLU DHANSHIKA ", "studentCode": "1220112", "rollNumber": "0" }, { "id": "21407", "name": "B NAGA KIRTHAN REDDY ", "studentCode": "1220191", "rollNumber": "0" }, { "id": "21433", "name": "NIMMALA CHAKRIVARDHAN GOUD ", "studentCode": "1220208", "rollNumber": "0" }, { "id": "20228", "name": "RENUSRI AMRUTAM ", "studentCode": "1220087", "rollNumber": "0" }, { "id": "20125", "name": "ARYAN BASWESHWAR  GUJAR ", "studentCode": "1220030", "rollNumber": "0" }, { "id": "21430", "name": "THEA AGARWAL ", "studentCode": "1220206", "rollNumber": "0" }];

let schema = Yup.object().shape({
    email: Yup.string().email('Not a proper email'),
    name: Yup.string().required('Name is required.'),
});

const validationSchema = Yup.object().shape({
    regexValidation: Yup.string().required("Branch name required."),
});

const arrayValidationSchema = Yup.array().of(
    Yup.object().shape({
        id: Yup.number().typeError("Not a valid number"),
        adjustAmount: Yup.number().typeError("Not a valid number").min(10, "Min value should be 10.").required("Value required"),
    })
);

const testValidSchema = Yup.object().shape({
    array: Yup.array().of(
        Yup.object().shape({
            id: Yup.number().typeError("Not a valid number"),
            adjustAmount: Yup.number().typeError("Not a valid number").min(10, "Min value should be 10.").required("Value required"),
        })
    )
});


const Progress: React.FC = () => {

    const [isDataloading, setIsDataLoading] = useState(true);
    const dispatch = useAppDispatch();
    const { userDetails, instituteListResp, branchListResp } = useAppSelector(({ instituteInfo, branch, Profile }) => ({
        userDetails: Profile.userDetails,
        branchListResp: branch.branchListResp,
        instituteListResp: instituteInfo.instituteListResp
    }), shallowEqual);


    // function sortingHndlr() {
    // }


    const testingForm = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
        }
    });

    function regexChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        testingForm.setFieldValue(name, value);
    }

    function flatDateChangeHndlr(event: any) {
    }

    function invalidRegexHndlr(inputName: string) {
        testingForm.setFieldValue(inputName, "");
    }

    function onInputSearchChange(inputString: any) {
    }

    function selectedStudentHndlr(selectedStudent: any) {
    }

    function apiCallHndlr() {
        const params = {
            instituteGroupId: "1", pageNo: 0, pageSize: 10,
            // approvalStatus: "APPROVED"
        };
        dispatch(getInstituteListAct(generateActionPayload("get_institute_list", undefined, params, { stopRequest: true })));
        setTimeout(() => {
            const payload = { pageSize: 100, pageNo: 0, instituteId: 1 };
            dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload)));
        }, 1000);
    }

    const [selectedStudentState, setSelectedStudentState] = useState(undefined);

    useEffect(() => {

    }, []);



    function changeHndlr(event: any) {
        // setTextValue(event.target.value);
        // schema.validate({ email: event.target.value, name: "" }, { abortEarly: false }).then((isValid: any) => {

        // }).catch((err: any) => {

        // })
        const data = [
            {
                id: "1",
                adjustAmount: "",
            },
            {
                id: "",
                adjustAmount: "",
            }
        ]
        arrayValidationSchema.validate(data).then((valid: any) => {

        }).catch((e: any) => {

        })
    }
    const [textValue, setTextValue] = useState("");

    const [selectedData, setSelectedData] = useState<string | undefined>("");
    function onChangeDateHndlr(name: string, value: string | undefined, event: React.ChangeEvent<HTMLInputElement>) {

        setSelectedData(value);
    }

    function onBlurHndlr(event: any) {

        // const { name, value } = event.currentTarget;

    }

    const returnSubRows = React.useCallback(({ row }: any) => {
        const { cells, original } = row,
            { return_geofence_trip } = original || {},
            columnLength = Array.isArray(cells) ? cells.length : 0,
            { in_progress } = return_geofence_trip || {};
        return (
            <React.Fragment>

            </React.Fragment>
        )
    }, []);

    const [searchType, setSearchType] = useState('name');
    function onSearchHandler(name: string, value: any) {
        console.log({ name, value });
    }

    function onChangeHandler(name: string, id: any, item: any) {
        console.log({ name, id, item });
    }

    const state = {
        options: {},
        series: [44, 55, 41, 17, 15],
        labels: ['A', 'B', 'C', 'D', 'E']
    }

    const columnChartState = {
        options: {
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
            }
        },
        series: [
            {
                name: "series-1",
                data: [30, 40, 45, 50, 49, 60, 70, 91]
            },
            {
                name: "series-2",
                data: [10, 20, 15, 80, 49, 60, 70, 91]
            }
        ]
    };


    const columns = useMemo(() => generateColumns(), []);
    return (
        <div className="page-content">
            {/* <ToastContainer /> */}
            <Container fluid>
                <BreadCrumb title="Dashboard" pageTitle="DPS" />
                <Card>
                    <CardBody>
                        <div className="tw-grid tw-grid-cols-12">
                            <div className="tw-col-span-12">

                            </div>
                            {/* <div className="col-4">
                                <SearchInput
                                    hideDefaultSelect
                                    name="search"
                                    value={searchType}
                                    menuItems={searchInputOptions}
                                    idKey="id"
                                    labelName="Search With"
                                    searchHandler={onSearchHandler}
                                    onChange={onChangeHandler}
                                    renderSelectedValue={(item: any) => item?.name}
                                    renderOptions={(item: any) => item?.name}
                                />
                            </div> */}
                            {/* <div className="col-12">
                                <div className="donut">vaibhav updated
                                    <ReactApexChart
                                        options={state.options} series={state.series} type="donut" width="380" />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mixed-chart">
                                    <ReactApexChart
                                        options={columnChartState.options}
                                        series={columnChartState.series}
                                        type="bar"
                                        width="500"
                                    />
                                </div>
                            </div> */}
                        </div>

                        {/* <TableExpandable
                            columns={columns}
                            data={tableData}
                            divClass="table-responsive mb-3"
                            theadClass="table-light text-muted align-middle"
                            tableClass="table-header-border"
                        /> */}
                        {/* <div>TEstin</div> */}
                        {/* <TreeComponent permissionDetails={treeJson} /> */}
                        {/* <input type="text" value={textValue} onChange={changeHndlr} /> */}

                        {/* <div className="row">
                            <div className="col-5">
                                <Datepicker
                                    name="test-input"
                                    value={selectedData}
                                    onChange={onChangeDateHndlr}
                                    onBlur={onBlurHndlr}
                                />
                            </div>

                            <div className="col-4">
                                <FlatPicker
                                    name="inputDate"
                                    labelText="Date Selector"
                                    value="2023-01-02"
                                />
                            </div>
                            <div className="col-4">
                                <FlatPicker
                                    name="inputTime"
                                    labelText="Time Selector"
                                    placeHolder="hh:mm"
                                    dateFormat="H:i K"
                                    enableTime={true}
                                    noCalendar={true}
                                />
                            </div>
                            <div className="col-4">
                                <FlatPicker
                                    name="dateTime"
                                    labelText="Date Time Selector"
                                    placeHolder="dd-mm-yyyy hh:mm"
                                    dateFormat="d-m-Y h:i K"
                                    enableTime={true}
                                />
                            </div>
                            <div className="col-4">
                                <FlatPicker
                                    name="multipleDate"
                                    labelText="Multiple"
                                    dateMode="multiple"
                                    placeHolder="dd-mm-yyyy"
                                    enableTime={true}
                                />
                            </div>
                            <div className="col-4">
                                <FlatPicker
                                    name="rangeSelector"
                                    dateMode="range"
                                    labelText="Range Date Selector"
                                    placeHolder="dd-mm-yyyy"
                                    enableTime={true}
                                />
                            </div>
                        </div> */}
                    </CardBody>
                </Card>
            </Container>
        </div>
    )
}

export default Progress;

// <CardBody>
// <div className="d-flex justify-content-between align-items-center px-2">
//     Dashboard Screen
// </div>
// <div>
//     <input onClick={apiCallHndlr} type="button" value="Institute API call" />
// </div>
// <div className="row">
//     <form onSubmit={testingForm.handleSubmit}>
//         {/* <div className="col-12">
//             <TextInputWithRegex
//                 name="regexValidation"
//                 labelText="Regex Validation"
//                 value={testingForm.values.regexValidation}
//                 allowedInputRegex={"^[0-9]+$"}
//                 onChange={regexChangeHndlr}
//                 maxLength={12}
//                 invalid={(testingForm.touched.regexValidation && testingForm.errors.regexValidation) ? true : false}
//                 error={(testingForm.touched.regexValidation && testingForm.errors.regexValidation) ? testingForm.errors.regexValidation : ""}
//             />
//         </div> */}
//         <div className="col-12">
//             {/* <DatePicker
//                 name="flatpickerInput"
//                 value={testingForm.values.flatpickerInput}
//                 onChange={flatDateChangeHndlr}
//             /> */}
//         </div>
//         <div className="col-12">
//             <DateInput
//                 name="pick-date"
//                 value={testingForm.values.htmlDateinput}
//                 onChange={(event: any) => {
//
//                     testingForm.handleChange(event);
//                 }}
//             />
//         </div>
//         <div className="col-3">
//             <AutoSearchInput
//                 formgroupClassName="search-box"
//                 name="searchString"
//                 placeHolder="Search..."
//                 // onChange={(e: any) => setSearchInputState(e.target.value)}
//                 onChange={onInputSearchChange}
//                 valueKey="id"
//                 labelKey="name"
//                 subLabelKey="studentCode"
//                 options={studentListData}
//                 selected={selectedStudentState}
//                 selectedOptionCallbck={selectedStudentHndlr}
//             ><i className="ri-search-line search-icon"></i></AutoSearchInput>
//         </div>
//         <div className="col-12">
//             <button type="submit">
//                 button
//             </button>
//         </div>
//     </form>
//     {/* <div className="col-12">
//         <input type="text" value={textValue} onChange={(event) => setTextValue(event.target.value)} />
//     </div>
//     <div className="col-12">
//         <TableContainer
//             columns={columns}
//             data={tableDataState}
//             sortHndlr={sortingHndlr}
//             divClass="table-responsive mb-1"
//             tableClass="table-nowrap"
//             theadClass="table-light text-muted align-middle"
//             thClass="thmainclass"
//             isLoading={isDataloading}
//         />
//     </div> */}
// </div>
// </CardBody>

// <div className="d-flex justify-content-between align-items-center px-2">
// <input type="button" value="Increment" onClick={increaseHndlr} />
// <span>{value}</span>
// <input type="button" value="Decrement" onClick={decreaseHndlr} />

// </div>
// <Row className="g-0 text-center text-sm-start align-items-center mb-4">
// <Col sm={6}>
//     <div>
//         <p className="mb-sm-0 text-muted">Showing <span className="fw-semibold">1</span> to <span className="fw-semibold">10</span> of <span className="fw-semibold text-decoration-underline">12</span> entries</p>
//     </div>
// </Col>

// <Col sm={6}>
//     <ul className="pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
//         <li className="page-item disabled">
//             <Link to="#" className="page-link">Previous</Link>
//         </li>
//         <li className="page-item active">
//             <Link to="#" className="page-link">1</Link>
//         </li>
//         <li className="page-item ">
//             <Link to="#" className="page-link">2</Link>
//         </li>
//         <li className="page-item">
//             <Link to="#" className="page-link">3</Link>
//         </li>
//         <li className="page-item">
//             <Link to="#" className="page-link">4</Link>
//         </li>
//         <li className="page-item">
//             <Link to="#" className="page-link">5</Link>
//         </li>
//         <li className="page-item">
//             <Link to="#" className="page-link">Next</Link>
//         </li>
//     </ul>
// </Col>
// </Row>
// <Row>
// <Col>
//     <input type="button" data-id="1" value="Set page 1" onClick={clickHandler} />
//     <input type="button" data-id="8" value="Set page 8" onClick={clickHandler} />
//     <input type="button" data-id="10" value="Set page 10" onClick={clickHandler} />
//     <input type="button" data-id="0" value="Set page 0" onClick={clickHandler} />
// </Col>
// </Row>