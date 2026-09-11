import React from "react";
import { useHistory } from "react-router-dom";
//Images
import DPSLogo from "../../assets/imagesdps/mastersetup/dps_logo.png";
import DefaultUserImg from "../../assets/imagesdps/default-user.png";
import DefaultStudentImage from "../../assets/imagesdps/student-default-img.png";
import DefaultEmployeeImage from "../../assets/imagesdps/employee-default-img.png";
import classNames from "classnames";

interface IUserProfile {
  displayId?: string | undefined;
  displayName: string | undefined;
  imageUrl?: string | undefined;
  contentNotCenter?: boolean;
  paddingTop?: string;
  size?: string;
  displayNameClass?: string;
  mainDivClass?: string;
  defaultImgType?: string;
  redirectUrl?: any;
  showAvatar?: boolean;
  urlProps?: any;
  isBranchAdmin?: boolean;
}
function getDefaultImg(type: string | undefined) {
  if (type === "user") {
    return DefaultUserImg;
  } else if (type === "student") {
    return DefaultStudentImage;
  } else if (type === "employee") {
    return DefaultEmployeeImage;
  } else {
    return DPSLogo;
  }
}

const colorArr = [
  { bgColor: "#FFF9C4", txtColor: "#827717" },
  { bgColor: "#BBDEFB", txtColor: "#0D47A1" },
  { bgColor: "#C8E6C9", txtColor: "#1B5E20" },
  { bgColor: "#FFE0B2", txtColor: "#E65100" },
  { bgColor: "#F8BBD0", txtColor: "#880E4F" },
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const letterColors = alphabet.reduce((acc: any, letter, index) => {
  const colorIndex = index % colorArr.length;
  acc[letter] = {
    foreground: colorArr[colorIndex].txtColor,
    background: colorArr[colorIndex].bgColor,
  };
  return acc;
}, {});

export const UserProfile = (userDetails: IUserProfile) => {
  const { showAvatar = true, isBranchAdmin = true } = userDetails;

  const history = useHistory();
  function replaceBrokeImg(error: any) {
    //replacement of broken Image
    error.target.src = getDefaultImg(userDetails.defaultImgType);
  }
  const firstLetter = userDetails.displayName
    ? userDetails.displayName.trim().charAt(0).toUpperCase()
    : "";

  const onClickHndler = () => {
    if (userDetails.redirectUrl && isBranchAdmin) {
      if (userDetails.urlProps) {
        history.push(userDetails.redirectUrl, userDetails.urlProps);
      } else {
        history.push(userDetails.redirectUrl);
      }
    }
  };

  return (
    <div
      className={classNames(
        userDetails.contentNotCenter
          ? "tw-flex"
          : `tw-flex tw-items-center ${userDetails.mainDivClass}`
      )}
    >
      {showAvatar && (
        <div
          onClick={onClickHndler}
          className={
            userDetails.redirectUrl && isBranchAdmin && "tw-cursor-pointer "
          }
        >
          {userDetails.imageUrl ? (
            <div
              className={
                `avatar-${userDetails.size ? userDetails.size : "sm"} ` +
                "tw-flex-shrink-0 tw-rounded-full tw-me-2"
              }
            >
              <img
                src={
                  userDetails.imageUrl ||
                  getDefaultImg(userDetails.defaultImgType)
                }
                className="img-fluid tw-w-full tw-h-full tw-object-contain tw-block tw-rounded-full"
                onError={replaceBrokeImg}
              />
            </div>
          ) : (
            <div
              style={{
                background: letterColors[firstLetter]?.background || "#FFF9C4",
                color: letterColors[firstLetter]?.foreground || "#827717",
                border: "4px solid #fff",
              }}
              className={`avatar-${
                userDetails.size ? userDetails.size : "sm"
              } flex-shrink-0 rounded-circle d-flex justify-content-center align-items-center fw-bold fs-22`}
            >
              <span>{firstLetter}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
