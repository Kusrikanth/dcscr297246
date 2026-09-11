import { Container, Card, CardBody, Row, Col } from "reactstrap";
import { shallowEqual } from "react-redux";
import { Link } from "react-router-dom";

//Dashboard Types 
import { IUserParam, IUserInfo } from "./progresstypes";
//Common Component
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Pagination from "../../Components/Common/Pagination";
import { UploadFileInput, FileUpload } from "../../Components/Common";

//Actions
import { increment, decrement } from "../../store/login/loginslice";
import { getStudentAct } from "../../store/login/loginaction";
import { IUserList, TLoginError } from "../../store/login/logintypes";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Progress } from "reactstrap";


//Generate Action
import { generateActionPayload } from "../../utility/reduxutility";
//React Pagination
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface IDashboardRef {
    prevCounterValueResp: number,
    prevUserListResp: IUserList[] | undefined,
    prevLoginErrorResp: TLoginError
}

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    // const stateData = useSelector(({  }) =>())));
    const { value, userList, loginErrorResp } = useAppSelector(({ login: { value, userList, loginErrorResp } }) => ({
        value, userList, loginErrorResp
    }), shallowEqual);

    const dashboardRef = useRef<IDashboardRef>({
        prevCounterValueResp: value,
        prevUserListResp: userList,
        prevLoginErrorResp: loginErrorResp
    });

    useEffect(() => {
        const { prevCounterValueResp, prevUserListResp, prevLoginErrorResp } = dashboardRef.current;
        if (value && value !== prevCounterValueResp) {
        } else if (userList && prevUserListResp !== userList) {
        } else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
        }
        dashboardRef.current.prevCounterValueResp = value;
        dashboardRef.current.prevUserListResp = userList;
        dashboardRef.current.prevLoginErrorResp = loginErrorResp;
    }, [value, userList, loginErrorResp]);

    useEffect(() => {

    }, []);

    function increaseHndlr() {
        const userParams: IUserParam = { userId: "1233" };
        // const payload = {
        //     "loginId": "agency.admin@sta.com", "loginPass": "Pass@123dd", "deviceType": "WEB",
        //     "agencyId": "31687141-c489-4a54-98f2-f3d9559ac77c"
        // };
        const payload: any = {
            "instituteName": "  bhatghiyar University ",
            "instituteGroupId": "54a42c4d-47aa-40b7-bd6b-284702aaeba6",
            "instituteCode": 335444,
            "afflicationNo": "ash",
            "trustName": "JNU456",
            "institutionEmail": "santhosh113@elrafact.com",
            "institutionPhoneNo": "8905634782",
            "address": "Jawaharlal Nehru University, New Mehrauli Road, New Delhi 110067",
            "city": "New Delhi",
            "area": "New Mehrauli Road",
            "pinCode": "110067",
            "contactPersonName": "Jawaharlal Nehru",
            "contactPersonPhoneNo": "8954209456",
            "contactPersonEmail": "jnehru@gmail.com",
            "licenceType": "AICT",
            "expiryDate": "2030-01-14",
            "websiteUrl": "https://www.sample.com"
        }
        dispatch(getStudentAct(
            generateActionPayload<IUserInfo>("user_login", userParams, payload)
        ));
        // dispatch(getStudentActTest<IUserInfo>(
        //     generateActionPayload<IUserParam, IUserInfo>("user_login", userParams, payload)
        // ));
    }

    function decreaseHndlr() {
        dispatch(decrement());
    }

    const pageChangeHndlr = useCallback((paginationInfo: any) => {
    }, []);

    const [refreshPage, setRefreshPage] = useState(undefined);

    function clickHandler(event: React.MouseEvent<HTMLInputElement>) {
        const pageIndex: any = event.currentTarget.getAttribute("data-id");
        setRefreshPage(pageIndex)
    }


    function showClick() {
        toast.success(`testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf 
        testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf 
        testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf 
        testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf`, { autoClose: 100000 });
        toast.warning(`testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf 
        testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf 
        testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf 
        testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf`, { autoClose: 100000 });
        toast.error(`testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf 
        testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf 
        testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf 
        testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf testsdfsdf  sdfsdf dsfds sdfsfsd fudsfsf`, { autoClose: 100000 });
    }
    const [countValue, setCountValue] = useState(0);
    function handlePush() {
        const updateLength = [...iframeLength];
        updateLength.push(`doc-${Number(iframeLength.length) + 1}`);
        setIframLength(updateLength);
    }
    const [iframeLength, setIframLength] = useState<any>([]);
    return (
        <div className="page-content">
            {/* <ToastContainer /> */}
            <Container fluid>
                <BreadCrumb title="Dashboard" pageTitle="DPS" />
                <Card>
                    <CardBody>

                        {/* <Pagination
                            forcePage={refreshPage}
                            callbackPaginationHndlr={pageChangeHndlr}
                        /> */}
                        <div className="tw-flex tw-justify-between tw-items-center tw-px-2">
                            Dashboard Screen
                            {/* <input type="button" value="Show modal" onClick={showClick} /> */}
                        </div>
                        <div className="row">
                            {/* <div className="col-12">
                                {countValue}
                                <input type="button" value="Increase the counter"
                                    onClick={() => { setCountValue(countValue + 1) }}
                                />
                                <input type="button" value="Increase fram"
                                    onClick={handlePush}
                                />
                            </div> */}
                            {/* {
                                iframeLength.map((item: any) =>
                                (<div key={item} className="col-12">
                                    <Card>
                                        <CardBody>
                                            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style={{ border: "2px solid red" }} title="Iframe Example"></iframe>
                                        </CardBody>
                                    </Card>
                                </div>)
                                )
                            } */}


                            {/* <div className="col-12">
                                <div className="mb-4">
                                    <Progress value={15} className="animated-progess" />
                                </div>
                                <div className="mb-4">
                                    <Progress value={25} color="success" className="animated-progess" />
                                </div>
                                <div className="mb-4">
                                    <Progress value={50} color="info" className="animated-progess" />
                                </div>
                                <div className="mb-4">
                                    <Progress value={75} color="warning" className="animated-progess" />
                                </div>
                                <div>
                                    <Progress value={100} color="danger" className="animated-progess" />
                                </div>
                            </div> */}
                            {/* <div className="col-12">
                                <UploadFileInput />
                            </div> */}
                            {/* <div className="col-12">
                                <FileUpload
                                    name="upload-file"
                                />
                            </div> */}
                        </div>

                    </CardBody>
                </Card>
            </Container>
        </div>
    )
}

export default Dashboard;

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