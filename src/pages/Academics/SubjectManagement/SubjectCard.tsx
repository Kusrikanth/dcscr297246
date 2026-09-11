import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardBody, CardHeader, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu, Input, Label } from "reactstrap";
import { ISubjectInfo } from "./helper";
import { StatusLabel } from "../../../Components/Common";

interface IBranchCardProps {
    branchDetails: ISubjectInfo
}

const SubjectCard = ({ branchDetails }: IBranchCardProps) => {
    const data = true;
    return (
        <Col>
            <Card className="team-box">
                <div className="team-cover">
                    {/* <img src={""} alt="" className="img-fluid" /> */}
                </div>
                <CardBody className="p-4">
                    <Row className="align-items-center team-row">
                        <Col className="team-settings">
                            <Row>
                                <Col>
                                    <div className="bookmark-icon flex-shrink-0 me-2">
                                        <i className="ri-star-line text-muted fs-17"></i>

                                    </div>
                                </Col>
                                <UncontrolledDropdown direction='start' className="col text-end">
                                    <DropdownToggle tag="a" id="dropdownMenuLink2" role="button">
                                        <i className="ri-more-fill fs-17"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem><i className="ri-pencil-fill me-2 align-middle" />Edit</DropdownItem>
                                        <DropdownItem><i className="ri-delete-bin-5-fill me-2 align-middle" />Delete</DropdownItem>
                                        <DropdownItem onClick={() => { }}><i className="ri-settings-5-fill me-2 align-middle" />Configuration</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Row>
                        </Col>
                        <Col lg={4} className="col">
                            <div className="team-profile-img">
                                <div className="avatar-lg avatar-shadow p-1 bg-white rounded-circle flex-shrink-0">
                                    {(!data) ?
                                        <img src={""} alt="" className="img-fluid d-block rounded-circle" /> :
                                        <div className={"avatar-title rounded-circle bg-soft-info text-success"}>
                                            AB
                                        </div>}
                                </div>
                                <div className="team-content">
                                    <Link to="#" onClick={() => { }}>
                                        <h5 className="fs-17 mb-1">{branchDetails.subjectName}</h5></Link>
                                    <p className="text-muted mb-0">{branchDetails.subjectId}</p>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4} className="col d-flex justify-content-center">
                            <StatusLabel type="active" labelName="Active" />
                        </Col>
                        <Col lg={2} className="col">
                            <div className="text-end">
                                <Link to="/pages-profile" className="btn btn-light view-btn">View Profile</Link>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
    )
};

export default SubjectCard;