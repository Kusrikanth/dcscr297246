import React from "react";
import { Link } from "react-router-dom";
import classNames from 'classnames';
//Images
import DPSLogo from "../../assets/imagesdps/mastersetup/dps_logo.png";
import DefaultUserImg from "../../assets/imagesdps/default-user.png";
import DefaultStudentImage from "../../assets/imagesdps/student-default-img.png";
import DefaultEmployeeImage from "../../assets/imagesdps/employee-default-img.png";

interface IUserDetails {
  displayId?: string | undefined;
  displayName: string | undefined;
  contentNotCenter?: boolean;
  paddingTop?: string;
  displayNameClass?: string;
}
export const UpdatedUserDetails = (userDetails: IUserDetails) => {
  return (
    <span
      className={
        userDetails.contentNotCenter ? "tw-flex" : "tw-flex tw-items-center"
      }
    >
      <div
        className={classNames("tw-overflow-hidden", userDetails.paddingTop && userDetails.paddingTop + " " + "tw-text-start")}
      >
        <div>
          <span title={userDetails.displayName}  className={`${userDetails.displayNameClass}
           tw-block user-name-text`}
            style={{
              color: "#212529",
            }}
          >
            {userDetails.displayName || "-"}
          </span>
        </div>
        <span className="tw-block tw-text-xs tw-text-gray-500 user-name-sub-text">
          {userDetails.displayId || ""}
        </span>
      </div>
    </span>
  );
};