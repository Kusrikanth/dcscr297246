import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { parseQueryStringToObject } from '../../../../utility/commonutility';
import AdmissionTypeSelectionPage from './AdmissionTypeSelectionPage';
import fb from "../../../../assets/images/brands/fb.png";
import twitter from "../../../../assets/images/brands/tw.png";
import insta from "../../../../assets/images/brands/insta.png";
import google from "../../../../assets/images/brands/google+.png";
import footer from "../../../../assets/images/brands/footerlogo.jpg";
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getInstAcademicYearAct } from '../../../../store/mastersettings/instacademics/instacademicactions';
import { getApplicationDetailsByCurriculumAct, getRegistrationInstructionAct } from '../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction';
import { removeLocalStorage, setLocalStorage } from '../../../../utility/storageUtility';
import { generateTokenForUserAct } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { FullPageLoader } from '../../../../Components/Common';

const ApplicationSaleOnline = () => {
  const dispatch = useDispatch();
  const params = useLocation().search;
  const history = useHistory();
  const queryParamsObject = parseQueryStringToObject(params);
  const [branchName, setBranchName] = useState('');
  const [academicYearName, setAcademicYearName] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [logoUrl, setLogoUrl] = useState("")
  const [totalPages, setTotalPages] = useState(1)
  const [stepper, setStepper] = useState("")
  const isLowerClass = useRef(false)

  const currentPage = useRef(0)

  const {
    academicYearListResp,
    getRegistrationInstructionResp,
    generateTokenForUserResp,
    getApplicationDetailsByCurriculumResp,
    showApiLoader,
  } = useAppSelector(
    ({ admissionAvailabilityRequest, instAcademics, applicationSale, globalData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      getRegistrationInstructionResp: admissionAvailabilityRequest.getRegistrationInstructionResp,
      getApplicationDetailsByCurriculumResp: admissionAvailabilityRequest.getApplicationDetailsByCurriculumResp,
      generateTokenForUserResp: applicationSale.generateTokenForUserResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  const applicationsaleOnlineRef = useRef({
    prevGetApplicationDetailsByCurriculumResp: getApplicationDetailsByCurriculumResp,
    prevGetRegistrationInstructionResp: getRegistrationInstructionResp,
  })

  useEffect(() => {
    const { prevGetApplicationDetailsByCurriculumResp } = applicationsaleOnlineRef.current || {};

    if (getApplicationDetailsByCurriculumResp && prevGetApplicationDetailsByCurriculumResp !== getApplicationDetailsByCurriculumResp) {
      const { branchDetailsDto, curriculumShortName } = getApplicationDetailsByCurriculumResp || {};
      const { branchName, isHostelAvailable , schoolName , logo } = branchDetailsDto || {};

      setBranchName(branchName);
      setInstituteName(schoolName);
      setLogoUrl(logo);

      if(isHostelAvailable && curriculumShortName === "IGCSE" && !isLowerClass.current){
        setStepper("verification")
        setTotalPages(2)
        instructionApicall("cb_general_instructions", 1)
      }
      else if (isHostelAvailable && !isLowerClass.current) {
        setStepper("verification")
      }
      else if (curriculumShortName === "IGCSE") {
        setStepper("acceptance")
        setTotalPages(2)
        instructionApicall("cb_general_instructions", 1)
      } else {
        setStepper("acceptance")
        setTotalPages(1)
        instructionApicall("application_sale", 1)
      }
    }
    else if(!getRegistrationInstructionResp && getApplicationDetailsByCurriculumResp){
      if(getApplicationDetailsByCurriculumResp?.curriculumShortName === "IGCSE"){
        instructionApicall("application_sale", 1)
        setTotalPages(1)
      }
    }

    applicationsaleOnlineRef.current.prevGetApplicationDetailsByCurriculumResp = getApplicationDetailsByCurriculumResp;
    applicationsaleOnlineRef.current.prevGetRegistrationInstructionResp = getRegistrationInstructionResp;
  }, [getApplicationDetailsByCurriculumResp,getRegistrationInstructionResp])

  const instructionApicall = (type: string, pageNo: number) => {
    if (queryParamsObject.branchId && queryParamsObject.curriculum) {
      const registrationPayload = {
        branchId: queryParamsObject.branchId,
        curriculumId: queryParamsObject.curriculum,
        instituteId: queryParamsObject.instituteId,
        type,
      };
      currentPage.current = pageNo
      dispatch(getRegistrationInstructionAct(generateActionPayload('get_registration_isntruction', undefined, registrationPayload,)));
    }
  }

  const initalAPICalls = () => {
    const payload1 = { instituteId: queryParamsObject.instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload1,)
      )
    );

    dispatch(getApplicationDetailsByCurriculumAct(generateActionPayload("get_application_details_by_curriculum", { curriculumId: queryParamsObject.curriculum })));
  }

  useEffect(() => {
    const formData = new FormData();
    formData.append("clientName","WEB")
    formData.append("publicKey",import.meta.env.VITE_GENERATE_TOKEN_PUBLIC_KEY)
    removeLocalStorage('accesstoken')
    dispatch(generateTokenForUserAct(generateActionPayload("generate_token_for_user", undefined, formData, { tokenNotRequired: true })));
    
    if(queryParamsObject.hostelType === "dayScholar"){
      setStepper("acceptance")
      isLowerClass.current = true
    }
  }, []);

  useEffect(() => {
    if (generateTokenForUserResp?.token) {
      setLocalStorage('accesstoken', generateTokenForUserResp.token);
      initalAPICalls();
    }
  }, [generateTokenForUserResp]);

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let year = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearName || ""
      setAcademicYearName(year);
    }
  }, [academicYearListResp]);

  const onClickHndler = () => {

    if (currentPage.current === totalPages) {
      if (queryParamsObject.hostelType) {
        history.push(`/online-application-sale-form?curriculum=${queryParamsObject.curriculum}&branchId=${queryParamsObject.branchId}&academicYearId=${queryParamsObject.academicYearId}&instituteId=${queryParamsObject.instituteId}&hostelType=${queryParamsObject.hostelType}`)
      } else {
        history.push(`/online-application-sale-form?curriculum=${queryParamsObject.curriculum}&branchId=${queryParamsObject.branchId}&academicYearId=${queryParamsObject.academicYearId}&instituteId=${queryParamsObject.instituteId}`)
      }
    } else {
      instructionApicall("application_sale", 2)
    }
  }

  const { data: academiYearList } = academicYearListResp || {}

  return (
    <>
      {showApiLoader && <FullPageLoader />}
      <div className="instruction-new-container">
        <div className="header">
          <img src={logoUrl} alt="Logo" style={{ width: "650px", minHeight: "60px" }} className='mw-100 py-2' />
        </div>
        <div className="header-content">
          <h5 className='content'><span>{branchName}</span> - Application Form - {academiYearList?.find((year: any) => +year.academicYearId === +queryParamsObject.academicYearId)?.academicYearName}</h5>
        </div>

        {stepper === "verification" && <div>
          <AdmissionTypeSelectionPage getApplicationDetailsByCurriculumResp={getApplicationDetailsByCurriculumResp} setStepper={setStepper} instructionApicall={instructionApicall} details={queryParamsObject} />
        </div>}
        {stepper === "acceptance" && <>
          <div className="instruction-new-container mb-4">
            <div className="inner-instruction-container">
              <div className="instruction-heading mt-0 p-2">
                <span>GENERAL INSTRUCTIONS</span>
              </div>
              <div className="instruction-container-section-1">
                {getRegistrationInstructionResp && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: getRegistrationInstructionResp || ''
                    }}
                    className='mb-4 w-100'>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="button-container mt-4 p-0">
            <button disabled={showApiLoader} className="button btn-green py-2 px-4" onClick={onClickHndler}>Continue</button>
          </div>
        </>
        }
        <div className="instruction-footer">
          <div className='d-flex align-items-center text-center'>
            <p className="text-white">
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
    </>
  )
}

export default ApplicationSaleOnline
