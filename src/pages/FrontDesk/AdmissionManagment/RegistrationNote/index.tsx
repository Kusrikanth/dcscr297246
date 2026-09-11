import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { parseQueryStringToObject } from "../../../../utility/commonutility";
import DPS from "../../../../assets/images/brands/DPS.png";
import fb from "../../../../assets/images/brands/fb.png";
import twitter from "../../../../assets/images/brands/tw.png";
import insta from "../../../../assets/images/brands/insta.png";
import google from "../../../../assets/images/brands/google+.png";
import footer from "../../../../assets/images/brands/footerlogo.jpg";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstBranchesAct } from "../../../../store/mastersettings/branch/branchactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { getRegistrationInstructionAct, setRegistrationInstructionAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { getInstituteListAct } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import VideoComponent from "../../../../Components/Common/VideoComponent";

import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

const RegistrationNote = () => {
  const dispatch = useDispatch();
  const params = useLocation().search;

  const queryParamsObject = parseQueryStringToObject(params);
  const [component, setComponent] = useState(<></>);
  const [branchName, setBranchName] = useState("");
  const [academicYearName, setAcademicYearName] = useState('');
  const [logoUrl, setLogoUrl] = useState("")
  const [instituteName, setInstituteName] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const history = useHistory();
  const {
    branchListResp,
    instituteListResp,
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getRegistrationInstructionResp,
    showApiLoader,
  }: any = useAppSelector(
    ({
      instAcademics,
      instituteInfo,
      appData,
      branch,
      globalData,
      admissionAvailabilityRequest,
    }) => ({
      branchListResp: branch.branchListResp,
      instituteListResp: instituteInfo.instituteListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getRegistrationInstructionResp: admissionAvailabilityRequest.getRegistrationInstructionResp,
    }),
    shallowEqual
  );

  const instructionApicall = () => {
    if (queryParamsObject.branchId && queryParamsObject.curriculum) {
      const registrationPayload = {
        branchId: queryParamsObject.branchId,
        curriculumId: queryParamsObject.curriculum,
        instituteId: queryParamsObject.instituteId,
        type: "reg_instructions",
      };
      dispatch(getRegistrationInstructionAct(generateActionPayload('get_registration_isntruction', undefined, registrationPayload,)));
    }
  }

  const initalAPICalls = () => {

    const payload = { pageSize: 100, pageNo: 0, instituteId: queryParamsObject.instituteId };
    dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload, { hideLoader: true })));

    const payload1 = { instituteId: queryParamsObject.instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload1,)));

    const payload2 = { instituteGroupId: "1", pageNo: 0, pageSize: 10 };
    dispatch(getInstituteListAct(generateActionPayload("get_institute_list", undefined, payload2,)));

    const payload3 = { pageSize: 100, pageNo: 0, instituteId: queryParamsObject.instituteId, };
    dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload3, { hideLoader: true, })));

  }

  useEffect(() => {
    if (branchListResp) {
      const branchDetails = branchListResp?.data?.find(
        (bnc: any) => +bnc.branchId === +queryParamsObject.branchId
      );
      setBranchName(branchDetails?.branchName);
    }
  }, [branchListResp]);

  useEffect(() => {
    if (instituteListResp) {
      const { instituteName = "", logoUrl = "" } = instituteListResp?.data?.find((inst: any) => +inst.id === +queryParamsObject.instituteId) || {}
      setInstituteName(instituteName);
      setLogoUrl(logoUrl);
    }
  }, [instituteListResp])

  useEffect(() => {
    instructionApicall();
    initalAPICalls();
    return () => {
      dispatch(setRegistrationInstructionAct(undefined));
    }
  }, [])

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let year = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearName || ""
      setAcademicYearName(year);
    }
  }, [academicYearListResp]);

  const { data: academiYearList } = academicYearListResp || {}

  return (
    <div className="instruction-new-container">
      {logoUrl ? (
        <div className="instruction-new-container tw-mx-auto">
          <div className="header tw-flex tw-items-center tw-justify-center">
            <img
              src={logoUrl}
              alt="Logo"
              style={{ minHeight: "60px" }}
              className="tw-max-w-full tw-px-3 tw-py-3 tw-h-[62px] lg:tw-h-[80px] tw-max-h-[80px] tw-object-contain"
            />
          </div>
          <div className="header-content">
            <h5 className="content">
              <span>{branchName}</span> - Application Form -{" "}
              {
                academiYearList?.find(
                  (year: any) =>
                    +year.academicYearId === +queryParamsObject.academicYearId
                )?.academicYearName
              }
            </h5>
          </div>
        </div>
      ) : null}
      <div className="instruction-new-container tw-mb-3 !tw-mt-[62px]">
        <div className="inner-instruction-container tw-border-0 registration-video">
          <UncontrolledAccordion open="personal-details" defaultOpen={["personal-details", "education",
            "identification", "past-education", "medical-info"]} stayOpen>
            <AccordionItem>
              <AccordionHeader tag="span" className="tw-text-base" targetId="personal-details" style={{ backgroundColor: "#" }}>
                <div className="instruction-heading tw-mt-0 tw-p-2">
                  <span>Demo Video</span>
                </div>
              </AccordionHeader>
              <AccordionBody accordionId="personal-details">
                <VideoComponent
                  showTitle={false}
                  defaultVideo={{
                    id: "default",
                    title: "Demo Video",
                    url: "https://youtu.be/VoTJSBptPBo",
                    videoDuration: 480,
                    hasCompleted: false,
                    transcript: "",
                    thumbnail: "",
                  }}
                />
              </AccordionBody>
            </AccordionItem>
          </UncontrolledAccordion>
        </div>
      </div>
      <div className="instruction-new-container tw-mb-4">
        <div className="inner-instruction-container tw-mt-0">
          <div className="instruction-heading tw-mt-0 tw-p-2">
            <span>GENERAL INSTRUCTIONS</span>
          </div>
          <div className="instruction-container-section-1">
            {getRegistrationInstructionResp && (
              <div
                dangerouslySetInnerHTML={{
                  __html: getRegistrationInstructionResp || ''
                }}
                className='tw-mb-4 tw-w-full'>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="instruction-new-container">
        <div className="inner-instruction-container tw-border-0 tw-my-0 !tw-mt-[48px]">
          <div className="tw-w-full">
            <div className="tw-mb-2 tw-flex tw-items-center">
              <input
                type="checkbox"
                className="tw-form-checkbox tw-cursor-pointer tw-rounded tw-float-left tw-h-[25px] tw-w-[25px]"
                onChange={(event: any) => setIsChecked(event.target.checked)}
                id="flexCheckDefault"
                checked={isChecked}
              />
              <label
                className="tw-mt-[2px] tw-p-2 tw-text-black tw-text-[18px] tw-font-normal tw-leading-[29px] tw-w-auto"
                htmlFor="flexCheckDefault"
              >
                I have read the above and understood
                <span className="tw-ml-1 tw-text-red-500">*</span>
              </label>
            </div>
          </div>
        </div>
        <div className="button-container tw-mt-4 tw-p-0">
          <button className="btn btn-green"
            type="submit"
            onClick={() => history.replace("/new-registration")}
            disabled={!isChecked}
          >
            Continue
          </button>
        </div>
      </div>
      <div className="instruction-footer">
        <div className='tw-flex tw-items-center tw-text-center'>
          <p className="tw-text-white">
            {`© ${academicYearName && academicYearName.split('-')[0]} ${instituteName}, ${branchName}. All Rights Reserved`}
          </p>
        </div>
        <div className="footer-content">
          <div className="footer-icon">
            <img src={fb} alt="fb" />
            <img src={twitter} alt="twitter" />
            <img src={insta} alt="insta" />
            <img src={google} alt="google+" />
          </div>
          <div>
            <img src={footer} alt="footerlogo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationNote;
