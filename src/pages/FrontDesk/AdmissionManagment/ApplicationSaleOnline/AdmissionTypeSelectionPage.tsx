import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { parseQueryStringToObject } from "../../../../utility/commonutility";

const AdmissionTypeSelectionPage = (props: any) => {
  const history = useHistory();
  const [hostelType, setHostelType] = useState('');
  const params = useLocation().search;
  const { getApplicationDetailsByCurriculumResp } = props || {};

  const queryParamsObject = parseQueryStringToObject(params);

  const onClickHndler = () => {
    props.setStepper("acceptance")
    const { curriculumShortName } = getApplicationDetailsByCurriculumResp || {};
    if (curriculumShortName === "IGCSE") {
      props.instructionApicall("cb_general_instructions", 1)
    } else {
      props.instructionApicall("application_sale", 1)
    }

    history.push(`/online-application-sale?curriculum=${queryParamsObject.curriculum}&branchId=${queryParamsObject.branchId}&instituteId=${queryParamsObject.instituteId}&academicYearId=${queryParamsObject.academicYearId}&hostelType=${hostelType}`)
  }

  return <div className="inner-instruction-container">
    <div className="admission-type">
      <span className="title-type">Admission Type :&nbsp;</span>
      <span className="textbox">
        <input
          id="AdmissionType1_0"
          type="radio"
          name="AdmissionType1"
          value="hostel"
          checked={hostelType === "hostel"}
          onClick={(event: any) => setHostelType(event.target.value)}
        />
        <label htmlFor="AdmissionType1_0">&nbsp;Hostel</label> &nbsp;
        <input
          id="AdmissionType1_1"
          type="radio"
          name="AdmissionType1"
          value="dayScholar"
          checked={hostelType === "dayScholar"}
          onClick={(event: any) => setHostelType(event.target.value)}
        />
        <label htmlFor="AdmissionType1_1">&nbsp;Day Scholar</label>
      </span>
    </div>

    <div className="instruction-container-section-1">
      <div className="button-container">
        <button className="button btn-green" onClick={onClickHndler}>Continue</button>
      </div>
    </div>
  </div>
}

export default AdmissionTypeSelectionPage;
