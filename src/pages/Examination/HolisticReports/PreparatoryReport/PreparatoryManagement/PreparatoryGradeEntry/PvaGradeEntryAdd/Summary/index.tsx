import React, { useContext, useEffect, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import {
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import { StepperFormContext } from "../helper";
import { TextArea } from "../../../../../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CircleArrowRight01Icon,
  ViewIcon,
  FavouriteIcon,
  PaintBoardIcon,
  CircleArrowLeft01Icon,
  StarIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { rubricLevels, getDomainIcon, getDomainDescription, getDomainColor } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../../../../utility/reduxutility";
import { getGeneralInformationByIdAct, getStudentSummaryByIdAct, saveDomainSummaryAct } from "../../../../../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { getPreparatoryGradeEntryListByIdAct, getPreparatorySummaryByIdAct, savePreparatorySummaryAct } from "../../../../../../../../store/examination/examinationsettings/examinationsettingsaction";

const OVERALL_ASSESSMENT_ID = -1;

const Summary = (props: any) => {
  const { stepId, entryId } = props;
  const history = useHistory();
  const {
    nextStepHndlr,
    submitCurrentFormCllbck,
    tabsData,
    isViewMode,
  } = useContext(StepperFormContext);

  const dispatch = useAppDispatch();

  const { showApiLoader, getPreparatorySummaryByIdResp, savePreparatoryDomainStudentsResp, updatePreparatoryDomainStudentsResp, savePreparatoryGradeEntryListResp,getPreparatoryGradeEntryListByIdResp } =
    useAppSelector(({ globalData, examinationManagement,examinationSettings }) => ({
      showApiLoader: globalData.showApiLoader,
      getPreparatorySummaryByIdResp: examinationSettings.getPreparatorySummaryByIdResp,
      updatePreparatoryDomainStudentsResp: examinationSettings.updatePreparatoryDomainStudentsResp,
      savePreparatoryDomainStudentsResp: examinationSettings.savePreparatoryDomainStudentsResp,
      getPreparatoryGradeEntryListByIdResp: examinationSettings.getPreparatoryGradeEntryListByIdResp,
      savePreparatoryGradeEntryListResp: examinationSettings.savePreparatoryGradeEntryListResp
    }), shallowEqual);

  const [domainAssessments, setDomainAssessments] = useState<any>([]);
  const [overallAssessment, setOverallAssessment] = useState<any>({
    domainId: OVERALL_ASSESSMENT_ID,
    name: "Overall Assessment",
    domainIndex: 1,
    icon: StarIcon,
    description: "Overall summary and final feedback.",
    awarenessStatus: "beginner",
    sensitivityStatus: "beginner",
    creativityStatus: "beginner",
    remarks: "",
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const handleRemarksChange = useCallback((domainId: number, remarks: string) => {
    if (domainId === OVERALL_ASSESSMENT_ID) {
      setOverallAssessment((prev: any) => {
        if (prev.remarks === remarks) return prev;
        return { ...prev, remarks: remarks };
      });
    } else {
      setDomainAssessments((prev: any) =>
        prev.map((domain: any) =>
          domain.domainId === domainId
            ? { ...domain, remarks: remarks }
            : domain
        )
      );
    }
  }, []);

   const RemarksSection = useCallback(({ domain }: { domain: any }) => (
    <div className="col-md-12">
      <div className="!tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4">
        <h6 className="mb-3 fw-bold">Comments:</h6>
        <TextArea
          key={`remarks-${domain?.domainId}`}
          name={`remarks-${domain?.domainId}`}
          value={domain?.remarks || ''}
          onChange={(e) => {
            const value = typeof e === 'string' ? e : e?.target?.value || '';
            handleRemarksChange(domain?.domainId, value);
          }}
          placeHolder={`Add remarks for ${domain?.name.toLowerCase()} assessment.`}
          isDisabled={isViewMode}
          formgroupClassName="mb-0"
        />
      </div>
    </div>
  ), [handleRemarksChange, isViewMode]);

  const getSummaryByIdApiCall = (otherProps?: any) => {
    dispatch(getPreparatorySummaryByIdAct(generateActionPayload("get_preparatory_summary_by_id", { id: savePreparatoryGradeEntryListResp?.data || entryId }, {})));
  };

  useEffect(() => {
    if(savePreparatoryDomainStudentsResp || updatePreparatoryDomainStudentsResp) {getSummaryByIdApiCall();}
  }, [ savePreparatoryDomainStudentsResp, updatePreparatoryDomainStudentsResp ]);

 useEffect(() => {
  if (getPreparatorySummaryByIdResp && Array.isArray(getPreparatorySummaryByIdResp) && getPreparatorySummaryByIdResp.length > 0) {
   
    const feedbackList = getPreparatoryGradeEntryListByIdResp?.studentDomainsSummary || [];
    const overallFeedback = getPreparatoryGradeEntryListByIdResp?.overallDomainFeedBack;
    
    const sortedDomains = [...getPreparatorySummaryByIdResp].sort((a, b) => parseInt(a.domainIndex) - parseInt(b.domainIndex));
    
    const processedDomains = sortedDomains.map((domain) => {
      
      const feedbackMatch = feedbackList.find(
        (item) => +item.domainId === +domain.domainId
      );

      return {
        domainId: domain.domainId,
        studentDomainId: domain.studentDomainId,
        name: domain.domainName,
        domainIndex: domain.domainIndex,
        icon: getDomainIcon(domain.domainName),
        description: getDomainDescription(domain.domainName),
    
        awarenessStatus: domain.teacherAwarenessStatus?.toLowerCase() || "beginner",
        sensitivityStatus: domain.teacherSensitivityStatus?.toLowerCase() || "beginner", 
        creativityStatus: domain.teacherCreativityStatus?.toLowerCase() || "beginner",
        
        remarks: feedbackMatch?.feedback || "",
      }
    });
    
    setDomainAssessments(processedDomains);
    
    setOverallAssessment((prev: any) => ({
      ...prev,
      domainId: OVERALL_ASSESSMENT_ID,
      domainIndex: processedDomains.length + 1,
      awarenessStatus: overallFeedback?.overallAwarenessStatus?.toLowerCase() || "beginner",
      sensitivityStatus: overallFeedback?.overallSensitivityStatus?.toLowerCase() || "beginner",
      creativityStatus: overallFeedback?.overallCreativityStatus?.toLowerCase() || "beginner",
      remarks: overallFeedback?.overallFeedback || "",
    }));
    
    setIsDataLoaded(true);
  }
  else if(getPreparatorySummaryByIdResp && getPreparatorySummaryByIdResp.length === 0) {
    const overallFeedback = getPreparatoryGradeEntryListByIdResp?.overallDomainFeedBack;
    
    setOverallAssessment((prev: any) => ({
      ...prev,
      domainId: OVERALL_ASSESSMENT_ID,
      awarenessStatus: overallFeedback?.overallAwarenessStatus?.toLowerCase() || "beginner",
      sensitivityStatus: overallFeedback?.overallSensitivityStatus?.toLowerCase() || "beginner",
      creativityStatus: overallFeedback?.overallCreativityStatus?.toLowerCase() || "beginner",
      remarks: overallFeedback?.overallFeedback || "",
    }));
    setDomainAssessments([]); 
    setIsDataLoaded(true);
  }
  
}, [getPreparatorySummaryByIdResp, getPreparatoryGradeEntryListByIdResp]);
    useEffect(() => {
      if(savePreparatoryGradeEntryListResp?.data || entryId ) {
        dispatch(getPreparatoryGradeEntryListByIdAct(generateActionPayload("get_preparatory_grade_entry_by_id", { id: savePreparatoryGradeEntryListResp?.data || entryId }, undefined)));
      }
    },[savePreparatoryGradeEntryListResp, entryId]);

  useEffect(() => {
    if (tabsData?.[stepId]?.domainAssessments && isDataLoaded) {
      const savedAssessments = tabsData[stepId].domainAssessments;
      
      const savedOverallAssessment = savedAssessments.find(
        (saved: any) => saved.domainId === OVERALL_ASSESSMENT_ID
      );
      
      const savedDomains = savedAssessments.filter(
        (saved: any) => saved.domainId !== OVERALL_ASSESSMENT_ID
      );

      setDomainAssessments((prevDomains: any) => 
        prevDomains.map((domain: any) => {
          const savedDomain = savedDomains.find((saved: any) => saved.domainId === domain.domainId);
          if (savedDomain) {
            return {
              ...domain,
              awarenessStatus: savedDomain.awarenessStatus || domain.awarenessStatus,
              sensitivityStatus: savedDomain.sensitivityStatus || domain.sensitivityStatus,
              creativityStatus: savedDomain.creativityStatus || domain.creativityStatus,
              remarks: savedDomain.remarks || ""
            };
          }
          return domain;
        })
      );
      
      if (savedOverallAssessment) {
        setOverallAssessment((prev: any) => ({
          ...prev,
          awarenessStatus: savedOverallAssessment.awarenessStatus || prev.awarenessStatus,
          sensitivityStatus: savedOverallAssessment.sensitivityStatus || prev.sensitivityStatus,
          creativityStatus: savedOverallAssessment.creativityStatus || prev.creativityStatus,
          remarks: savedOverallAssessment.remarks || ""
        }));
      }
    }
  }, [tabsData, stepId, isDataLoaded]);

  const handleDomainRubricChange = (
    domainId: number,
    rubricType: string,
    level: string
  ) => {
    if (domainId === OVERALL_ASSESSMENT_ID) {
      setOverallAssessment((prev: any) => ({
        ...prev,
        [rubricType]: level,
      }));
    } else {
      setDomainAssessments((prev: any) =>
        prev.map((domain: any) =>
          domain.domainId === domainId
            ? {
                ...domain,
                [rubricType]: level,
              }
            : domain
        )
      );
    }
  };



  const handleNext = () => {
    const domainPayload = domainAssessments.map((domain: any) => ({
      domainId: domain.domainId,
      awarenessStatus: domain.awarenessStatus.toUpperCase(),
      sensitivityStatus: domain.sensitivityStatus.toUpperCase(),
      creativityStatus: domain.creativityStatus.toUpperCase(),
      feedback: domain.remarks,
    }));
    
    const overallDomainFeedBack = {
        overallAwarenessStatus: overallAssessment.awarenessStatus.toUpperCase(),
        overallSensitivityStatus: overallAssessment.sensitivityStatus.toUpperCase(),
        overallCreativityStatus: overallAssessment.creativityStatus.toUpperCase(),
        overallFeedback: overallAssessment.remarks,
    };

    const finalPayloadData = {
      studentDomainsSummaryDTOS: domainPayload,
      overallDomainFeedBack: overallDomainFeedBack,
    };

    dispatch(savePreparatorySummaryAct(generateActionPayload("save_preparatory_summary", { id: savePreparatoryGradeEntryListResp?.data || entryId }, finalPayloadData)));
    history.push("/preparatory-management");      
    toast.success("Grade Entry saved successfully.");
    submitCurrentFormCllbck([], "NEXT_TAB");
    nextStepHndlr(stepId, { domainAssessments: finalPayloadData });
  };

  const handlePrevious = () => {
    const domainPayload = domainAssessments.map((domain: any) => ({
      domainId: domain.domainId,
      awarenessStatus: domain.awarenessStatus,
      sensitivityStatus: domain.sensitivityStatus,
      creativityStatus: domain.creativityStatus,
      remarks: domain.remarks
    }));

    const overallPayload = {
        awarenessStatus: overallAssessment.awarenessStatus,
        sensitivityStatus: overallAssessment.sensitivityStatus,
        creativityStatus: overallAssessment.creativityStatus,
        remarks: overallAssessment.remarks
    };
    
    const finalPayloadData = [...domainPayload, overallPayload];

    submitCurrentFormCllbck([], "PREVIOUS_TAB");
    nextStepHndlr(stepId, { domainAssessments: finalPayloadData });
  };

  if (showApiLoader && !isDataLoaded) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading domains...</span>
        </div>
        <span className="ms-2">Loading assessment domains...</span>
      </div>
    );
  }

  if (isDataLoaded && domainAssessments.length === 0 && !getPreparatorySummaryByIdResp) {
    return (
      <div className="text-center" style={{ minHeight: '400px', paddingTop: '100px' }}>
        <div className="alert alert-info">
          <h5>No Assessment Domains Available</h5>
          <p>No domains have been configured for holistic assessment. Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  const RubricSelection = ({ domain, statusKey, icon, iconColor, title }: { domain: any, statusKey: string, icon: any, iconColor: string, title: string }) => (
    <div className="col-md-12 mb-3">
      <div className="!tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4 !tw-pt-5">
        <div className="d-flex align-items-center mb-3">
          <HugeiconsIcon
            icon={icon}
            size={24}
            className={`me-2 ${iconColor}`}
          />
          <h6 className="mb-0 fw-bold">{title}</h6>
        </div>

        <div className="d-flex flex-row gap-2 mb-3">
          {rubricLevels.map((level) => (
            <div
              key={level.id}
              className={`flex-fill p-3 border !tw-rounded-lg cursor-pointer ${
                domain[statusKey] === level.id
                  ? `${level.borderColor} ${level.backgroundColor}`
                  : "border-light"
              }`}
              onClick={() =>
                !isViewMode &&
                handleDomainRubricChange(
                  domain.domainId,
                  statusKey,
                  level.id
                )
              }
              style={{
                cursor: isViewMode ? "default" : "pointer",
              }}
            >
              <div className="d-flex align-items-center">
                <div
                  className={`me-3 ${
                    domain[statusKey] === level.id
                      ? level.textColor
                      : "text-muted"
                  }`}
                >
                  <div
                    className={`rounded-circle border ${
                      domain[statusKey] === level.id
                        ? `${level.iconBgColor} ${level.iconBorderColor}`
                        : "border-secondary"
                    }`}
                    style={{ width: "20px", height: "20px" }}
                  >
                    {domain[statusKey] === level.id && (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <div
                          className="bg-white rounded-circle"
                          style={{
                            width: "8px",
                            height: "8px",
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div
                    className={`fw-bold ${
                      domain[statusKey] === level.id
                        ? level.textColor
                        : "text-dark"
                    }`}
                  >
                    {level.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );



  return (
    <div>
      <div className="row">
        <div className="col-12">
          {domainAssessments.length > 0 && (
            <UncontrolledAccordion
              defaultOpen={domainAssessments.map(
                (domain: any) => `domain-${domain.domainId}`
              )}
              stayOpen
            >
              {domainAssessments.map((domain: any, index: number) => (
                <AccordionItem key={domain.domainId}>
                  <AccordionHeader tag="h5" targetId={`domain-${domain.domainId}`}>
                    <div className="d-flex align-items-center">
                      <HugeiconsIcon
                        icon={domain.icon}
                        size={24}
                        className="me-3"
                        style={{ color: getDomainColor(domain.name) }}
                      />
                      <div>
                        <div className="fw-bold">
                          {domain.domainIndex}. {domain.name}
                        </div>
                        <small className="text-muted">{domain.description}</small>
                      </div>
                    </div>
                  </AccordionHeader>
                  <AccordionBody accordionId={`domain-${domain.domainId}`}>
                    <div className="row">
                      {/* Awareness Section */}
                      <RubricSelection
                        domain={domain}
                        statusKey="awarenessStatus"
                        icon={ViewIcon}
                        iconColor="text-primary"
                        title="Awareness"
                      />

                      {/* Sensitivity Section */}
                      <RubricSelection
                        domain={domain}
                        statusKey="sensitivityStatus"
                        icon={FavouriteIcon}
                        iconColor="text-danger"
                        title="Sensitivity"
                      />

                      {/* Creativity Section */}
                      <RubricSelection
                        domain={domain}
                        statusKey="creativityStatus"
                        icon={PaintBoardIcon}
                        iconColor="text-warning"
                        title="Creativity"
                      />

                      {/* Remarks Section */}
                      <RemarksSection domain={domain} />
                    </div>
                  </AccordionBody>
                </AccordionItem>
              ))}
            </UncontrolledAccordion>
          )}

          {isDataLoaded && (
            <div className={`mt-4 ${domainAssessments.length > 0 ? '' : 'border rounded p-3'}`}>
              <UncontrolledAccordion defaultOpen={[`domain-${OVERALL_ASSESSMENT_ID}`]} stayOpen>
                <AccordionItem>
                  <AccordionHeader tag="h5" targetId={`domain-${OVERALL_ASSESSMENT_ID}`}>
                    <div className="d-flex align-items-center">
                      <HugeiconsIcon
                        icon={overallAssessment.icon}
                        size={24}
                        className="me-3"
                      />
                      <div>
                        <div className="fw-bold">
                          {overallAssessment.domainIndex}. {overallAssessment.name}
                        </div>
                        <small className="text-muted">{overallAssessment.description}</small>
                      </div>
                    </div>
                  </AccordionHeader>
                  <AccordionBody accordionId={`domain-${OVERALL_ASSESSMENT_ID}`}>
                    <div className="row">
                      <RubricSelection
                        domain={overallAssessment}
                        statusKey="awarenessStatus"
                        icon={ViewIcon}
                        iconColor="text-primary"
                        title="Awareness"
                      />

                      <RubricSelection
                        domain={overallAssessment}
                        statusKey="sensitivityStatus"
                        icon={FavouriteIcon}
                        iconColor="text-danger"
                        title="Sensitivity"
                      />

                      <RubricSelection
                        domain={overallAssessment}
                        statusKey="creativityStatus"
                        icon={PaintBoardIcon}
                        iconColor="text-warning"
                        title="Creativity"
                      />

                      <RemarksSection domain={overallAssessment} />
                    </div>
                  </AccordionBody>
                </AccordionItem>
              </UncontrolledAccordion>
            </div>
          )}          
        </div>
      </div>

      {!isViewMode && (
        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-primary fs-12 px-3"
              onClick={handlePrevious}
              disabled={stepId === "generalInformation"}
            >
              <HugeiconsIcon
                icon={CircleArrowLeft01Icon}
                size={20}
                color="currentColor"
                className="!tw-mr-1"
              />
              Previous Step
            </button>
            <div>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleNext}
              >
                Submit{" "}
                <HugeiconsIcon
                  icon={CircleArrowRight01Icon}
                  size={20}
                  color="currentColor"
                  className="!tw-ml-1"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;