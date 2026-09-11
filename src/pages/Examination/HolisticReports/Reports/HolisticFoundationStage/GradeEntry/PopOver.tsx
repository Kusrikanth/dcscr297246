import React, { useMemo, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { Popover, PopoverBody, PopoverHeader } from "reactstrap";
import { useAppSelector } from "../../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { saveParentCollectedStatusAct } from "../../../../../../store/examination/examinationmanagement/examinationmanagementactions";

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
    getLogActivityStatusResp
  }: any = useAppSelector(
    ({ examinationManagement }) => ({
      getLogActivityStatusResp: examinationManagement.getLogActivityStatusResp
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
    if (!getLogActivityStatusResp) {
      return {
        generalInfo: { text: "Pending", color: "text-warning" },
        surroundings: { text: "Pending", color: "text-warning" },
        domainAssessment: { text: "Pending", color: "text-warning" },
        domainSummary: { text: "Pending", color: "text-warning" },
      };
    }

    const response = getLogActivityStatusResp;
    
    return {
      generalInfo: getStatusInfo(response.generalInfoSubmitted),
      surroundings: getStatusInfo(response.surroundingsSubmitted),
      domainAssessment: getStatusInfo(response.domainAssessmentSubmitted),
      domainSummary: getStatusInfo(response.summarySubmitted),
      collection: "Update here"
    };
  }, [getLogActivityStatusResp]);

  const areAllStepsCompleted = useMemo(() => {
    return (
      processedSteps.generalInfo.text === "Completed" &&
      processedSteps.surroundings.text === "Completed" &&
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

      dispatch(saveParentCollectedStatusAct(generateActionPayload('save_parent_collected_status', {id: props.entryId} , payload)));            
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