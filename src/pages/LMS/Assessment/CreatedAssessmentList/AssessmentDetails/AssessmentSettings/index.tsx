import React, { useEffect } from 'react'
import UncontrolledAccordionCard from '../../../../../../Components/Common/UncontrolledAccordionCard';
import AccordionCardItem from '../../../../../../Components/Common/AccordionCardItem';
import AccordionCardHeader from '../../../../../../Components/Common/AccordionCardHeader';
import AccordionCardBody from '../../../../../../Components/Common/AccordionCardBody';
import ScheduleType from './ScheduleType';
import AdvanceSettings from './AdvanceSettings';
import GradesDistribution from './GradesDistribution';
import Notifcations from './Notifcations';
import Rules from './Rules';
import ResultSettings from './ResultSettings';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/storehook';
import { getSettingsAssessmentIdAct } from '../../../../../../store/lms/lmsAssessment/lmsAssessmentaction';
import { generateActionPayload } from '../../../../../../utility/reduxutility';
import { shallowEqual } from 'react-redux';

const AssessmentSettings = (props: any) => {
    const dispatch = useAppDispatch();

      const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        saveBasicAssessmentResp,
        getSettingsByAssessmentIdResp,
        getGlobalSettingsBranchIdResp,
      } = useAppSelector(
        ({
          branchAcademics,
          appData,
          lmsAssessment,
        }) => ({
          branchClassResp: branchAcademics.branchClassResp,
          currentBranchIdResp: appData.currentBranchIdResp,
          currentInstIdResp: appData.currentInstIdResp,
          saveBasicAssessmentResp: lmsAssessment.saveBasicAssessmentResp,
          getSettingsByAssessmentIdResp: lmsAssessment.getSettingsByAssessmentIdResp,
          getGlobalSettingsBranchIdResp: lmsAssessment.getGlobalSettingsBranchIdResp,
        }),
        shallowEqual
      );

useEffect(() => {
    if(props.id){
     dispatch(
          getSettingsAssessmentIdAct(
            generateActionPayload("get_global_settings_assessment_id", {
              assessmentId: props.id,
            })
          )
        );
    }
  },[props.id])
    return (
        <div className="row gx-2 justify-content-center">
            <div className='col-12'>
                <div className='card'>
                    <div className='card-body'>
                        <h4 className="card-title mb-3   flex-grow-1">
                            Assessment Settings
                        </h4>
                        <div>
                            <UncontrolledAccordionCard
                                defaultOpen={['1', '2', '3', '4', '5', '6']}
                            >
                                <AccordionCardItem>
                                    <AccordionCardHeader targetId="1" title="Schedule Type" />
                                    <AccordionCardBody accordionId="1" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px", padding: "0px", border: "0px" }} >

                                    <ScheduleType data={getSettingsByAssessmentIdResp}/>
                                    </AccordionCardBody>
                                </AccordionCardItem>

                                <AccordionCardItem>
                                    <AccordionCardHeader targetId="2" title="Advance Settings" />

                                    <AccordionCardBody accordionId="2" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px" }}>

                                    <AdvanceSettings data={getSettingsByAssessmentIdResp}/>

                                    </AccordionCardBody>
                                </AccordionCardItem>
                                <AccordionCardItem>
                                    <AccordionCardHeader targetId="3" title="Grades Distribution" />

                                    <AccordionCardBody accordionId="3" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px" }}>

                                    <GradesDistribution data={getSettingsByAssessmentIdResp}/>

                                    </AccordionCardBody>
                                </AccordionCardItem>
                                <AccordionCardItem>
                                    <AccordionCardHeader targetId="4" title="Notifcations" />

                                    <AccordionCardBody accordionId="4" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px" }}>

                                    <Notifcations data ={getSettingsByAssessmentIdResp}/>

                                    </AccordionCardBody>
                                </AccordionCardItem>
                                <AccordionCardItem>
                                    <AccordionCardHeader targetId="5" title="Rules" />

                                    <AccordionCardBody accordionId="5" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px" }}>

                                    <Rules data={getSettingsByAssessmentIdResp}/>

                                    </AccordionCardBody>
                                </AccordionCardItem>
                                <AccordionCardItem>
                                    <AccordionCardHeader targetId="6" title="Result Settings" />

                                    <AccordionCardBody accordionId="6" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px" }}>

                                    <ResultSettings data={getSettingsByAssessmentIdResp}/>

                                    </AccordionCardBody>
                                </AccordionCardItem>

                            </UncontrolledAccordionCard>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssessmentSettings
