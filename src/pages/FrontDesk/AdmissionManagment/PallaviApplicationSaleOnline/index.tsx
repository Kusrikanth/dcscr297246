import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { parseQueryStringToObject } from '../../../../utility/commonutility';
import PMS from "../../../../assets/images/brands/pallavilogo.jpg";
import fb from "../../../../assets/images/brands/fb.png";
import twitter from "../../../../assets/images/brands/tw.png";
import insta from "../../../../assets/images/brands/insta.png";
import google from "../../../../assets/images/brands/google+.png";
import footer from "../../../../assets/images/brands/footerlogo.jpg";
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { getInstBranchesAct } from '../../../../store/mastersettings/branch/branchactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getInstAcademicYearAct } from '../../../../store/mastersettings/instacademics/instacademicactions';
import { getRegistrationInstructionAct } from '../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction';

const PallaviApplicationSaleOnline = () => {
  const dispatch = useDispatch();
  const params = useLocation().search;
  const history = useHistory();
  const queryParamsObject = parseQueryStringToObject(params);
  const [branchName, setBranchName] = useState('');
  const [academicYearName, setAcademicYearName] = useState('');

  const {
    branchListResp,
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getRegistrationInstructionResp,

  }: any = useAppSelector(
    ({ classroomManagmentInfo, assignGroupInfo, instAcademics, branchAcademics, appData, feeConcession, feeCollections, admissionAvailabilityRequest, branch }) => ({
      branchListResp: branch.branchListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getRegistrationInstructionResp: admissionAvailabilityRequest.getRegistrationInstructionResp,
    }),
    shallowEqual
  );
  useEffect(() => {

    const payload = { pageSize: 100, pageNo: 0, instituteId: queryParamsObject.instituteId };
    dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload, { hideLoader: true, tokenNotRequired: true })));
    const payload1 = { instituteId: queryParamsObject.instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload1, { tokenNotRequired: true })
      )
    );
    if (queryParamsObject.branchId && queryParamsObject.curriculum) {
      const registrationPayload = {
        branchId: queryParamsObject.branchId,
        curriculumId: queryParamsObject.curriculum,
        instituteId: queryParamsObject.instituteId,
      };
      dispatch(getRegistrationInstructionAct(generateActionPayload('get_registration_isntruction', undefined, registrationPayload, { tokenNotRequired: true })));
    }
  }, [])

  useEffect(() => {
    if (branchListResp) {
      const branchDetails = branchListResp?.data?.find((bnc: any) => +bnc.branchId === +queryParamsObject.branchId)
      setBranchName(branchDetails?.branchName);
    }
  }, [branchListResp])

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let year = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearName
      setAcademicYearName(year);
    }
  }, [academicYearListResp]);


  const { data: academiYearList } = academicYearListResp || {}

  return (
    <div className="instruction-new-container">
      <div className="header">
        <img src={PMS} alt="Logo" className='mw-100' />
      </div>
      <div className="header-content">
        <h5 className='content'><span>{branchName}</span> - Application Form - {academiYearList?.find((year: any) => +year.academicYearId === +queryParamsObject.academicYearId)?.academicYearName}</h5>
      </div>
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
        <button className="button btn-green  py-2 px-4" onClick={() => history.push(`/online-application-sale-form?curriculum=${queryParamsObject.curriculum}&branchId=${queryParamsObject.branchId}&academicYearId=${queryParamsObject.academicYearId}&instituteId=${queryParamsObject.instituteId}`)}>Continue</button>
      </div>
      <div className="instruction-footer">
        <div className='d-flex align-items-center text-center'>
          <p className="text-white">
            {`© ${academicYearName && academicYearName.split('-')[0]} Pallavi Model School, ${branchName}. All Rights Reserved`}
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
  )
}

export default PallaviApplicationSaleOnline
