import { useEffect, useMemo, useRef, useState } from "react";
import BasicDetails from "./BasicDetails";
import PaymentDetails from "./PaymentDetails";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { parseQueryStringToObject } from "../../../../utility/commonutility";
import frame from "../../../../assets/images/frame.png";
import fb from "../../../../assets/images/brands/fb.png";
import twitter from "../../../../assets/images/brands/tw.png";
import insta from "../../../../assets/images/brands/insta.png";
import google from "../../../../assets/images/brands/google+.png";
import footer from "../../../../assets/images/brands/footerlogo.jpg";
import CIE from "../../../../assets/images/brands/CIE_LOGO.png";
import "./_applicationsaleonlinev2.scss";
import { FullPageLoader, NewStepsContainerV2 } from "../../../../Components/Common";
import ApplicationSaleInstructions from "./ApplicationSaleInstructions";
import { getApplicationDetailsByCurriculumAct, getRegistrationInstructionAct, getRegistrationInstructionSecondAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useStateManager } from "react-select";
import { getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "../../../../utility/storageUtility";
import { AnyAction } from "redux-saga";
import { generateTokenForUserAct } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { resetRegistrationInstructionSecondAct, setRegistrationInstructionSecondAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityslice";
import { getInstituteListAct } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { getInstBranchesAct } from "../../../../store/mastersettings/branch/branchactions";
import { HugeiconsIcon } from '@hugeicons/react'
import { CallIcon, Mail01Icon, WhatsappIcon } from '@hugeicons-pro/core-stroke-standard'

export default function ApplicationSaleOnlineV2() {
  const [activeStepId, setActiveStepId] = useState("1");
  const isGuestAccessTokenExist = getLocalStorage("accesstoken");
  const [selectedBranch, setSelectedBranch] = useState<any>(undefined);
  const [academicYearName, setAcademicYearName] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const params = useLocation().search;
  const queryParamsObject = parseQueryStringToObject(params);
  const [branchName, setBranchName] = useState('');
  const [logoUrl, setLogoUrl] = useState("")
  const isLowerClass = useRef(false)
  const currentPage = useRef(0)
  const dispatch = useDispatch();
  const [applicationSaleDetails, setApplicationSaleDetails] = useState({
    curriculumId: "",
    academicYearId: "",
    hostelType: "",
  });
  const [totalPages, setTotalPages] = useState(1)

  const applicationSaleData = useRef({
    basicDetails: {},
    otherDetails: {},
  });

  const {
    branchListResp,
    academicYearListResp,
    instituteListResp,
    showApiLoader,
    getApplicationDetailsByCurriculumResp,
    getRegistrationInstructionResp,
    getRegistrationInstructionSecondResp,
    generateTokenForUserResp,
  } = useAppSelector(
    ({
      branch, instAcademics, instituteInfo, globalData, admissionAvailabilityRequest, appData, applicationSale
    }) => ({
      branchListResp: branch.branchListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      instituteListResp: instituteInfo.instituteListResp,
      showApiLoader: globalData.showApiLoader,
      getApplicationDetailsByCurriculumResp: admissionAvailabilityRequest.getApplicationDetailsByCurriculumResp,
      getRegistrationInstructionResp: admissionAvailabilityRequest.getRegistrationInstructionResp,
      getRegistrationInstructionSecondResp: admissionAvailabilityRequest.getRegistrationInstructionSecondResp,
      generateTokenForUserResp: applicationSale.generateTokenForUserResp,
    }),
    shallowEqual
  );

  const applicationSaleRespRef = useRef({
    prevGenerateTokenForUserResp: generateTokenForUserResp
  });

  useEffect(() => {
    const { prevGenerateTokenForUserResp } = applicationSaleRespRef.current;
    if (generateTokenForUserResp && generateTokenForUserResp !== prevGenerateTokenForUserResp) {
      setLocalStorage('accesstoken', generateTokenForUserResp.token);
    }
    applicationSaleRespRef.current.prevGenerateTokenForUserResp = generateTokenForUserResp;
  }, [generateTokenForUserResp]);

  useEffect(() => {
    if (!isGuestAccessTokenExist) {
      const formData = new FormData();
      formData.append("clientName","WEB")
      formData.append("publicKey",import.meta.env.VITE_GENERATE_TOKEN_PUBLIC_KEY)
      dispatch(generateTokenForUserAct(generateActionPayload("generate_token_for_user", undefined, formData, { tokenNotRequired: true })));
    }
  }, [isGuestAccessTokenExist]);

  const steps = [
    {
      id: 1,
      title: "Basic Details",
    },
    {
      id: 2,
      title: "Payment Details",
    },
  ];

  const instructionsSectionRef = useRef<HTMLDivElement>(null);

  function handleInstructionScroll() {
    setTimeout(() => {
      if (instructionsSectionRef.current) {
        instructionsSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 200);
  }


  const stepHandler = (name?: string, values = {}, id?: string) => {
    if (name === "stepup") {
      if (id === "1") {
        applicationSaleData.current.basicDetails = values;
      } else if (id === "2") {
        applicationSaleData.current.otherDetails = values;
      }

      if (+activeStepId + 1 <= steps.length) {
        setActiveStepId((prev) => `${+prev + 1}`);
      }
    } else if (name === "stepback") {
      if (+activeStepId - 1 > 0) {
        applicationSaleData.current.basicDetails = {};
        setActiveStepId((prev) => `${+prev - 1}`);
      }
    }
  };

  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "1":
        return BasicDetails;
      case "2":
        return PaymentDetails;
    }
  }

  useEffect(() => {
    dispatch(getInstAcademicYearAct(
      generateActionPayload("get_inst_academic_year", undefined, { instituteId: queryParamsObject.instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" })
    ));
    dispatch(getInstituteListAct(generateActionPayload("get_institute_list", undefined, {
      pageSize: 100,
      pageNo: 0,
      instituteId: queryParamsObject.instituteId,
    })));
    dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, {
      pageNo: 0,
      pageSize: 100
    })));
  }, []);

  useEffect(() => {
    if (branchListResp) {
      const branchDetails:any = branchListResp?.data?.find(
        (bnc: any) => +bnc.branchId === +queryParamsObject.branchId
      );
      setSelectedBranch(branchDetails);
    }
  }, [branchListResp]);

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let year = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearName || ""
      setAcademicYearName(year);
    }
  }, [academicYearListResp]);

  useEffect(() => {
    if (instituteListResp) {
      const { instituteName = "" } = instituteListResp?.data?.find((inst: any) => +inst.id === +queryParamsObject.instituteId) || {}
      setInstituteName(instituteName);
    }
  }, [instituteListResp])

  const initalAPICalls = () => {
    dispatch(getApplicationDetailsByCurriculumAct(generateActionPayload("get_application_details_by_curriculum", { curriculumId: applicationSaleDetails.curriculumId })));
  }

  useEffect(() => {
    if (applicationSaleDetails.curriculumId) {
      initalAPICalls()
    }
  }, [applicationSaleDetails.curriculumId])

  const instructionApicall = (type: string, pageNo: number) => {
    if (queryParamsObject.branchId && applicationSaleDetails.curriculumId) {
      const registrationPayload = {
        branchId: queryParamsObject.branchId,
        curriculumId: applicationSaleDetails.curriculumId,
        instituteId: queryParamsObject.instituteId,
        type,
      };
      currentPage.current = pageNo;
      dispatch(
        getRegistrationInstructionAct(
          generateActionPayload(
            "get_registration_isntruction",
            undefined,
            registrationPayload
          )
        )
      );
    }
  };

  const instructionApicallSecond = (type: string, pageNo: number) => {
    if (queryParamsObject.branchId && applicationSaleDetails.curriculumId) {
      const registrationPayload = {
        branchId: queryParamsObject.branchId,
        curriculumId: applicationSaleDetails.curriculumId,
        instituteId: queryParamsObject.instituteId,
        type,
      };
      currentPage.current = pageNo;
      dispatch(
        getRegistrationInstructionSecondAct(
          generateActionPayload(
            "get_registration_isntruction",
            undefined,
            registrationPayload
          )
        )
      );
    }
  }

  const applicationsaleOnlineRef = useRef({
    prevGetApplicationDetailsByCurriculumResp: getApplicationDetailsByCurriculumResp,
  });

  useEffect(() => {
    const { prevGetApplicationDetailsByCurriculumResp } = applicationsaleOnlineRef.current || {};

    if (
      getApplicationDetailsByCurriculumResp &&
      prevGetApplicationDetailsByCurriculumResp !==
      getApplicationDetailsByCurriculumResp
    ) {
      const { branchDetailsDto, curriculumShortName } =
        getApplicationDetailsByCurriculumResp || {};
      const { branchName, isHostelAvailable, schoolName, logo } =
        branchDetailsDto || {};
      if (!curriculumShortName) return;

      setBranchName(branchName);
      setInstituteName(schoolName);
      setLogoUrl(logo);

      if (curriculumShortName === "IGCSE") {
        if (isHostelAvailable && !isLowerClass.current) {
          setTotalPages(2);
          instructionApicallSecond("cb_general_instructions", 1);
          instructionApicall("application_sale", 2);
        } else {
          setTotalPages(2);
          instructionApicallSecond("cb_general_instructions", 1);
          instructionApicall("application_sale", 2);
        }
      } else {
        setTotalPages(1);
        dispatch(resetRegistrationInstructionSecondAct(undefined));
        instructionApicall("application_sale", 1);
      }
    } else if (
      !getRegistrationInstructionResp &&
      getApplicationDetailsByCurriculumResp
    ) {
      if (
        getApplicationDetailsByCurriculumResp?.curriculumShortName === "IGCSE"
      ) {
        instructionApicall("application_sale", 1);
        setTotalPages(1);
        dispatch(resetRegistrationInstructionSecondAct(undefined));
      }
    }
    applicationsaleOnlineRef.current.prevGetApplicationDetailsByCurriculumResp = getApplicationDetailsByCurriculumResp;
  }, [getApplicationDetailsByCurriculumResp, getRegistrationInstructionResp, getRegistrationInstructionSecondResp]);


  useEffect(() => {
    if (applicationSaleDetails.hostelType) {
      if (applicationSaleDetails.hostelType === "dayScholar") {
        isLowerClass.current = true;
      }
    }
  }, [applicationSaleDetails.hostelType]);

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeStepId);
    return <TabComponent applicationSaleData={applicationSaleData} activeStepId={activeStepId} updateStepHndlr={stepHandler} onApplicationSaleDetails={setApplicationSaleDetails} instructionsSectionRef={instructionsSectionRef} onInstructionScroll={handleInstructionScroll} />;
  }, [activeStepId, getActiveMenuComponent, applicationSaleData, instructionsSectionRef]);

  const { data: academiYearList } = academicYearListResp || {}
  return (
    <>
      {showApiLoader && <FullPageLoader />}
      {/* {logoUrl ? (
        <div className="instruction-new-container" style={{ margin: "auto" }}>
          <div className="header tw-flex tw-items-center tw-justify-center">
            <img
              src={logoUrl}
              alt="Logo"
              style={{ minHeight: "60px" }}
              className="mw-100 tw-px-3 tw-py-3 tw-h-[62px] lg:tw-h-[80px] tw-max-h-[80px] tw-object-contain"
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
      ) : null} */}
      <div className="!tw-pt-[56px] tw-bg-[#F7FAF9]">
        <div className="main tw-bg-[#F7FAF9]">
          <div>
            {/* Wrapper grid: left form + right help panel (separate boxes) */}
            <div className="
              tw-w-[94%] sm:tw-w-[94%] md:tw-w-[92%] lg:tw-w-[90%] xl:tw-w-[86%] 2xl:tw-w-[80%]
              tw-mx-auto tw-grid tw-gap-4
              lg:tw-grid-cols-[minmax(0,1fr)_300px]
              xl:tw-grid-cols-[minmax(0,1fr)_320px] 
              2xl:tw-grid-cols-[minmax(0,1fr)_340px]
              tw-mb-10
            ">
              {/* Left: Form container */}
              <div className="
                tw-bg-white tw-shadow-[0px_3px_6px_#F3F6F5]
                tw-rounded-[18px] tw-px-3.5 md:tw-px-7 tw-py-4 md:tw-py-8 tw-border
              ">
                <div className="form-body">
                  <div className="tw-flex tw-flex-wrap tw-items-start">
                    <div className="tw-w-full sm:tw-w-2/3">
                      <h2 className="tw-text-xl tw-font-bold tw-mr-3 tw-mb-0">Applicant Details</h2>
                      <p className="tw-mb-0 tw-text-gray-500">Enter details as per Aadhaar / Birth Certificate.</p>
                    </div>
                    <div className="tw-w-full sm:tw-w-1/3">
                      {selectedBranch?.websiteUrl && (
                        <div className="tw-flex tw-justify-end">
                          <button
                            type="button"
                            className="tw-bg-[#0d6efd] tw-text-white tw-text-sm tw-font-medium tw-rounded tw-px-3 tw-py-2 hover:tw-bg-[#0b5ed7] tw-transition-colors"
                            onClick={() => window.open(`https://${selectedBranch?.websiteUrl}`, "_blank")}
                          >
                            RETURN TO THE MAIN WEBSITE
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="tw-flex tw-justify-between tw-w-full tw-flex-col md:tw-flex-row tw-gap-y-3">
                      <div className="">
                        <div className="tw-flex tw-flex-wrap">
                          {/* {getApplicationDetailsByCurriculumResp?.curriculumShortName === "IGCSE" && (
                            <div className="tw-w-full tw-mb-3">
                              <img src={CIE} alt="Cambridge Logo" className="tw-max-w-full tw-h-auto tw-object-contain" />
                            </div>
                          )} */}
                          {+queryParamsObject.branchId === 1 && applicationSaleDetails.curriculumId === "5" && (
                            <div className="tw-w-full">
                              <h3 className="tw-mt-3 tw-text-[13px] tw-font-bold">
                                * Hostel Facility Available from stage 6 onwards.
                              </h3>
                            </div>
                          )}
                          {+queryParamsObject.branchId === 1 && applicationSaleDetails.curriculumId === "1" && (
                            <div className="tw-w-full tw-mb-3">
                              <h3 className="tw-mt-3 tw-text-[13px] tw-font-bold">Instructions:</h3>
                              <h3 className="tw-mt-3 tw-text-[13px] tw-font-bold">
                                * Hostel Facility Available from class (VI-XII).
                              </h3>
                              <h3 className="tw-mt-3 tw-text-[13px] tw-font-bold">
                                * Class X/XII admissions are bound by CBSE norms.
                              </h3>
                            </div>
                          )}
                        </div>

                        {+queryParamsObject.branchId === 3 && applicationSaleDetails.curriculumId === "4" && (
                          <div className="tw-w-full">
                            <h3 className="tw-mt-3 tw-text-[13px] tw-font-bold">Instructions:</h3>
                            <h3 className="tw-mt-3 tw-text-[13px] tw-font-bold">
                              * Class X/XII admissions are bound by CBSE norms.
                            </h3>
                          </div>
                        )}

                        {+queryParamsObject.branchId === 2 && applicationSaleDetails.curriculumId === "3" && (
                          <div className="tw-w-full">
                            <h3 className="tw-mt-3 tw-text-[13px] tw-font-bold">Instructions:</h3>
                            <h3 className="tw-mt-3 tw-text-[13px] tw-font-bold">
                              * Class X admissions are bound by CBSE norms
                            </h3>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="tw-mt-6">
                    {isGuestAccessTokenExist && <div className="tw-w-full application-sale-online-conatiner">{activeComponent}</div>}
                  </div>
                </div>
              </div>

              {/* Right: Help panel (separate box, widened, table-like layout) */}
              <div className="
                tw-bg-white tw-border tw-shadow-[0px_3px_6px_#F3F6F5]
                tw-rounded-xl tw-p-0 tw-h-fit lg:tw-sticky lg:tw-top-[8px]
              ">
                {/* Header */}
                <div className="tw-p-4 tw-border-b tw-border-gray-200">
                  <h2 className="tw-text-base tw-font-semibold tw-mb-0">Need Help?</h2>
                </div>
                {/* Body */}
                <div className="tw-p-4 tw-space-y-3 tw-text-sm">
                  {/* Email row */}
                  <div className="tw-grid tw-grid-cols-[102px_1fr] tw-gap-x-4 tw-items-center">
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <HugeiconsIcon icon={Mail01Icon} size={16} />
                      <span className="tw-text-[#6B7280]">Email</span>
                    </div>
                    <a
                      href="mailto:admissions@dpssecunderabad.in"
                      className="tw-font-semibold tw-break-words tw-truncate tw-text-[#212529] tw-inline-block hover:tw-text-[#212529]"
                    >
                      admissions@dpssecunderabad.in
                    </a>
                  </div>
                  {/* Helpline row */}
                  <div className="tw-grid tw-grid-cols-[102px_1fr] tw-gap-x-4 tw-items-center">
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <HugeiconsIcon icon={CallIcon} size={16} />
                      <span className="tw-text-[#6B7280]">Helpline</span>
                    </div>
                    <div>
                      <span className="tw-inline-block tw-font-semibold tw-truncate leading-none tw-text-[#212529]">+91 9182547498</span>
                    </div>
                  </div>
                  {/* Whatsapp row */}
                  <div className="tw-grid tw-grid-cols-[102px_1fr] tw-gap-x-4 tw-items-center">
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <HugeiconsIcon icon={WhatsappIcon} size={16} />
                      <span className="tw-text-[#6B7280]">Whatsapp</span>
                    </div>
                    <span className="tw-font-semibold tw-text-[#212529]">+91 9182547498</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {(getRegistrationInstructionResp ||
                getRegistrationInstructionSecondResp) &&
                activeStepId === "2" ? (
                <div className="tw-w-[94%] sm:tw-w-[94%] md:tw-w-[92%] lg:tw-w-[90%] xl:tw-w-[86%] 2xl:tw-w-[80%]
              tw-mx-auto !tw-rounded-[18px] tw-mb-8 lg-tw-mb-10">
                  <ApplicationSaleInstructions applicationSaleData={applicationSaleData} updateStepHndlr={stepHandler} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="tw-p-4 lg:tw-p-6 tw-bg-[#2c732a]">
          <div className="tw-flex tw-justify-between tw-items-center tw-flex-col md:tw-flex-row tw-gap-4">
            <div className="text-center">
              <p className="text-white tw-mb-0">
                {`© ${academicYearName && academicYearName.split("-")[0]
                  } ${instituteName}, ${selectedBranch?.branchName
                  }. All Rights Reserved`}
              </p>
            </div>
            <div className="tw-flex tw-items-center tw-gap-4 tw-flex-col lg:tw-flex-row">
              <div className="footer-icon d-none">
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
      </div>




    </>
  );
}
