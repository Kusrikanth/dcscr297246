import React, { useMemo } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { Popover, PopoverBody, PopoverHeader } from "reactstrap";
import { useAppSelector } from "../../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { savePrepartoryParentCollectionAct } from "../../../../../../store/examination/examinationsettings/examinationsettingsaction";

interface PopOverProps {
  data: any;
  popOver: boolean;
  id: string;
  entryId: any;
  onClose: () => void;
}

const PopOver = (props: PopOverProps) => {
  const dispatch = useDispatch();

  const {
    getPreparatoryStatusResp
  }: any = useAppSelector(
    ({ examinationSettings }) => ({
      getPreparatoryStatusResp: examinationSettings.getPreparatoryStatusResp
    }),
    shallowEqual
  );


  const getStatusInfo = (activityData: any) => {
    if (activityData && activityData.activityId) {
      return { text: "Completed", color: "text-success" };
    }
    return { text: "Pending", color: "text-warning" };
  };

  const processedSteps = useMemo(() => {
    if (!getPreparatoryStatusResp) {
      return {
        generalInfo: { text: "Pending", color: "text-warning" },
        surroundings: { text: "Pending", color: "text-warning" },
        studentFeedback: { text: "Pending", color: "text-warning" },
        parentFeedback: { text: "Pending", color: "text-warning" },
        domainAssessment: { text: "Pending", color: "text-warning" },
        domainSummary: { text: "Pending", color: "text-warning" },
      };
    }

    const response = getPreparatoryStatusResp;
    
    return {
      generalInfo: getStatusInfo(response.generalInfoSubmitted),
      surroundings: getStatusInfo(response.partA2Submitted),
      studentFeedback: getStatusInfo(response.partA3Submitted),
      parentFeedback: getStatusInfo(response.partAParentFeedBackSubmitted),
      domainAssessment: getStatusInfo(response.domainAssessmentSubmitted),
      domainSummary: getStatusInfo(response.summarySubmitted),
      collection: "Update here"
    };
  }, [getPreparatoryStatusResp]);

  const areAllStepsCompleted = useMemo(() => {
    return (
      processedSteps.generalInfo.text === "Completed" &&
      processedSteps.surroundings.text === "Completed" &&
      processedSteps.studentFeedback.text === "Completed" &&
      processedSteps.parentFeedback.text === "Completed" &&
      processedSteps.domainAssessment.text === "Completed" &&
      processedSteps.domainSummary.text === "Completed"
    );
  }, [processedSteps]);

  const handleCollectionStatusClick = () => {
    if (processedSteps.collection === "Update here") {
      const status = areAllStepsCompleted ? "Y" : "N";      
      const payload = {
        status
      }

      dispatch(savePrepartoryParentCollectionAct(generateActionPayload('save_preparatory_parent_collected_status', {id: props.entryId} , payload)));            
    }
  };

  return (
    <>
      <div>
        <Popover
          flip
          target={`testing-${props.id}`}
          toggle={props.onClose}
          isOpen={props.popOver}
        >
          <PopoverHeader></PopoverHeader>
          <PopoverBody className="p-0">
            <table>
              <tr className="bg-light">
                <th className="p-2">Report Status</th>
                <th className="p-2 text-warning">Status</th>
              </tr>

              <tr>
                <td className="p-2">General Information:</td>
                <td className={`p-2 ${processedSteps.generalInfo.color}`}>
                  {processedSteps.generalInfo.text}
                </td>
              </tr>

              <tr>
                <td className="p-2">Surroundings:</td>
                <td className={`p-2 ${processedSteps.surroundings.color}`}>
                  {processedSteps.surroundings.text}
                </td>
              </tr>
              <tr>
                <td className="p-2">Student Feedback:</td>
                <td className={`p-2 ${processedSteps.studentFeedback.color}`}>
                  {processedSteps.studentFeedback.text}
                </td>
              </tr>
              <tr>
                <td className="p-2">Parent Feedback:</td>
                <td className={`p-2 ${processedSteps.parentFeedback.color}`}>
                  {processedSteps.parentFeedback.text}
                </td>
              </tr>

              <tr>
                <td className="p-2">Domain Assessment:</td>
                <td className={`p-2 ${processedSteps.domainAssessment.color}`}>
                  {processedSteps.domainAssessment.text}
                </td>
              </tr>

              <tr>
                <td className="p-2">Domain Summary:</td>
                <td className={`p-2 ${processedSteps.domainSummary.color}`}>
                  {processedSteps.domainSummary.text}
                </td>
              </tr>
              
              <tr>
                <td className="p-2">{areAllStepsCompleted && "Parent Collected:"}</td>
                <td
                  className={
                    processedSteps.collection === "Update here"
                      ? "p-2 text-info text-decoration-underline cursor-pointer"
                      : "p-2 text-success"
                  }
                  onClick={handleCollectionStatusClick}
                >
                  {areAllStepsCompleted && processedSteps.collection}
                </td>
              </tr>
            </table>
          </PopoverBody>
        </Popover>
      </div>
    </>
  );
};

export default PopOver;