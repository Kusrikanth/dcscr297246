
import { Link } from "react-router-dom";
import DefaultUserImg from "../../assets/imagesdps/default-upload-img.png";
import { Button } from "reactstrap";


import { getDdMmYyyyWithMonthNameFormat } from "../../utility/dateutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { ResetPasswordStrokeStandard } from "@hugeicons-pro/core-stroke-standard";


export default function LoginUserInfoCard({ userDetails, changePasswordHndlr }: any) {
    return (
        <div className="card" id="contact-view-detail">
            <div className="card-body">
                <div className="position-relative text-center mb-2">
                    <img
                        src={DefaultUserImg}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail mb-2"
                    />
                    <span className="d-block fs-normal fw-bold">{`${userDetails?.firstName} ${userDetails?.lastName}` || "-"}</span>
                    <p className="text-muted mb-1">{userDetails?.username || "-"}</p>
                    {/* <span className="badge text-uppercase badge-soft-warning px-2 py-2 fs-14">DPS Nacharam</span> */}
                </div>
                {/* <h5 className="mt-4 mb-1">{userDetails?.instituteName || ""}</h5> */}
                {/* <p className="text-muted">{userDetails?.shortName || ""}</p> */}

                <div className="table-card mb-0 mt-1">
                    <table className="table table-borderless mb-0">
                        <tbody>
                            <tr>
                                <td className="fw-bold text-nowrap">
                                    User Name
                                </td>
                                <td>{userDetails?.username}</td>
                            </tr>
                            <tr>
                                <td className="fw-bold text-nowrap">
                                    Role
                                </td>
                                <td>{userDetails?.role?.name}</td>
                            </tr>
                            <tr>
                                <td className="fw-bold text-nowrap">
                                    Email
                                </td>
                                <td className="text-break text-primary">{userDetails?.email}</td>
                            </tr>
                            <tr>
                                <td className="fw-bold text-nowrap">
                                    Phone No.
                                </td>
                                <td>{userDetails?.mobile || "-"}</td>
                            </tr>
                            <tr>
                                <td className="fw-bold text-nowrap">
                                    Created Date
                                </td>
                                <td>{getDdMmYyyyWithMonthNameFormat(userDetails?.createdDate)}</td>
                            </tr>
                            <tr>
                                <td className="fw-bold text-nowrap">
                                    Password
                                </td>
                                <td>**********</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-2">
                    <Button color="success"
                        onClick={changePasswordHndlr}>
                        <HugeiconsIcon icon={ResetPasswordStrokeStandard}
                            className="me-1 " size={18} /> Change Password</Button>
                </div>
            </div>

        </div>
    )
}