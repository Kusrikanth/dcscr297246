import React, { useContext, useEffect, useState, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";
import { StepperFormContext } from "../helper";
import { TextArea } from "../../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { CircleArrowRight01Icon, ViewIcon, FavouriteIcon, PaintBoardIcon, CircleArrowLeft01Icon } from "@hugeicons-pro/core-stroke-standard";
import { rubricLevels, getDomainIcon, getDomainDescription, getDomainColor } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getGeneralInformationByIdAct, getStudentSummaryByIdAct, saveDomainSummaryAct } from "../../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

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

  const { showApiLoader, saveGeneralInformationResp, getStudentSummaryByIdResp, saveDaominStudentDetailsResp, updateDomainDetailsStudentResp, examinationManagementErrorResp, saveDomainSummaryResp, getGeneralInformationByIdResp } =
    useAppSelector(({ globalData, examinationManagement }) => ({
      showApiLoader: globalData.showApiLoader,
      saveGeneralInformationResp: examinationManagement.saveGeneralInformationResp,
      getStudentSummaryByIdResp: examinationManagement.getStudentSummaryByIdResp,
      updateDomainDetailsStudentResp: examinationManagement.updateDomainDetailsStudentResp,
      saveDaominStudentDetailsResp: examinationManagement.saveDaominStudentDetailsResp,
      examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
      saveDomainSummaryResp: examinationManagement.saveDomainSummaryResp,
      getGeneralInformationByIdResp: examinationManagement.getGeneralInformationByIdResp,
    }), shallowEqual);

  const [domainAssessments, setDomainAssessments] = useState<any>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const recordId = saveGeneralInformationResp?.data || entryId;
  const summaryFetchKeyRef = useRef<string>("");
  const summaryRetryRef = useRef<number>(0);
  const fetchGeneralInfo = () => {
    if (!recordId) return;
    dispatch(
      getGeneralInformationByIdAct(
        generateActionPayload("get_general_information_by_id", { id: recordId }, undefined)
      )
    );
  };

  const fetchSummary = () => {
    if (!recordId) return;
    dispatch(
      getStudentSummaryByIdAct(
        generateActionPayload("get_student_summary_by_id", { id: recordId }, {})
      )
    );
  };

  useEffect(() => {
    fetchGeneralInfo();
    summaryFetchKeyRef.current = "";
    summaryRetryRef.current = 0;
  }, [recordId]);

  useEffect(() => {
    if (!recordId) return;

    const hasDomains =
      Array.isArray(getGeneralInformationByIdResp?.studentDomains) &&
      getGeneralInformationByIdResp.studentDomains.length > 0;

    if (!hasDomains) return;

    const versionKey = `${recordId}-${saveDaominStudentDetailsResp ? "saved" : ""
      }-${updateDomainDetailsStudentResp ? "updated" : ""}`;

    if (summaryFetchKeyRef.current === versionKey) return;

    summaryFetchKeyRef.current = versionKey;
    summaryRetryRef.current = 0;

    fetchSummary();
  }, [
    recordId,
    getGeneralInformationByIdResp?.studentDomains?.length,
    saveDaominStudentDetailsResp,
    updateDomainDetailsStudentResp,
  ]);

  useEffect(() => {
    if (!recordId) return;

    const hasDomains =
      Array.isArray(getGeneralInformationByIdResp?.studentDomains) &&
      getGeneralInformationByIdResp.studentDomains.length > 0;

    if (!hasDomains) return;

    if (!Array.isArray(getStudentSummaryByIdResp)) return;

    if (getStudentSummaryByIdResp.length === 0 && summaryRetryRef.current < 2) {
      summaryRetryRef.current += 1;

      const t = setTimeout(() => {
        fetchSummary();
      }, 700);

      return () => clearTimeout(t);
    }
  }, [recordId, getStudentSummaryByIdResp, getGeneralInformationByIdResp?.studentDomains?.length]);
  useEffect(() => {
    if (getGeneralInformationByIdResp?.studentDomains && Array.isArray(getGeneralInformationByIdResp.studentDomains) && getGeneralInformationByIdResp.studentDomains.length > 0) {
      const feedbackList = getGeneralInformationByIdResp?.domainsSummary || [];
      const studentSummaryList = getStudentSummaryByIdResp || [];

      const sortedDomains = [...getGeneralInformationByIdResp.studentDomains].sort((a, b) => parseInt(a.domainIndex) - parseInt(b.domainIndex));

      const processedDomains = sortedDomains.map((domain) => {
        const feedbackMatch = feedbackList.find(
          (item) => +item.domainId === +domain.domainId
        );

        const summaryMatch = studentSummaryList.find(
          (item) => +item.domainId === +domain.domainId
        );

        return {
          domainId: domain.domainId,
          studentDomainId: summaryMatch?.studentDomainId || domain.studentDomainId,
          name: domain.domainName,
          domainIndex: domain.domainIndex,
          icon: getDomainIcon(domain.domainName),
          description: getDomainDescription(domain.domainName),
          awarenessStatus: feedbackMatch?.awarenessStatus?.toLowerCase() || summaryMatch?.rubicAwarenessStatus?.toLowerCase() || "stream",
          sensitivityStatus: feedbackMatch?.sensitivityStatus?.toLowerCase() || summaryMatch?.rubicSensitivityStatus?.toLowerCase() || "stream",
          creativityStatus: feedbackMatch?.creativityStatus?.toLowerCase() || summaryMatch?.rubicCreativityStatus?.toLowerCase() || "stream",
          remarks: feedbackMatch?.feedback || "",
        }
      });

      setDomainAssessments(processedDomains);
      setIsDataLoaded(true);
    }
  }, [getStudentSummaryByIdResp, getGeneralInformationByIdResp]);

  useEffect(() => {
    if (saveGeneralInformationResp?.data || entryId) {
      dispatch(getGeneralInformationByIdAct(generateActionPayload("get_general_information_by_id", { id: saveGeneralInformationResp?.data || entryId }, undefined)));
    }
  }, [saveGeneralInformationResp, entryId]);

  useEffect(() => {
    if (tabsData?.[stepId]?.domainAssessments && isDataLoaded) {
      const savedAssessments = tabsData[stepId].domainAssessments;

      setDomainAssessments((prevDomains: any) =>
        prevDomains.map((domain: any) => {
          const savedDomain = savedAssessments.find((saved: any) => saved.domainId === domain.domainId);
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
    }
  }, [tabsData, stepId, isDataLoaded]);

  const handleDomainRubricChange = (
    domainId: number,
    rubricType: string,
    level: string
  ) => {
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
  };

  const handleRemarksChange = (domainId: number, remarks: string) => {
    setDomainAssessments((prev: any) =>
      prev.map((domain: any) =>
        domain.domainId === domainId
          ? {
            ...domain,
            remarks: remarks,
          }
          : domain
      )
    );
  };


  const handleNext = () => {
    const payloadData = domainAssessments.map((domain: any) => ({
      domainId: domain.domainId,
      awarenessStatus: domain.awarenessStatus.toUpperCase(),
      sensitivityStatus: domain.sensitivityStatus.toUpperCase(),
      creativityStatus: domain.creativityStatus.toUpperCase(),
      feedback: domain.remarks,
    }));

    dispatch(saveDomainSummaryAct(generateActionPayload("save_domain_summary", { id: saveGeneralInformationResp?.data || entryId }, payloadData)));
    history.push("/holistic-management");
    toast.success("Grade saved successfully.");
    submitCurrentFormCllbck([], "NEXT_TAB");
    nextStepHndlr(stepId, { domainAssessments: payloadData });
  };

  const handlePrevious = () => {
    const payloadData = domainAssessments.map((domain: any) => ({
      domainId: domain.domainId,
      awarenessStatus: domain.awarenessStatus,
      sensitivityStatus: domain.sensitivityStatus,
      creativityStatus: domain.creativityStatus,
      remarks: domain.remarks
    }));

    submitCurrentFormCllbck([], "PREVIOUS_TAB");
    nextStepHndlr(stepId, { domainAssessments: payloadData });
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

  if (isDataLoaded && domainAssessments.length === 0) {
    return (
      <div className="text-center" style={{ minHeight: '400px', paddingTop: '100px' }}>
        <div className="alert alert-info">
          <h5>No Assessment Domains Available</h5>
          <p>No domains have been configured for holistic assessment. Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Domain Assessment Section */}
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
                      <div className="col-md-12 mb-3">
                        <div className="!tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4 !tw-pt-5">
                          <div className="d-flex align-items-center mb-3">
                            <HugeiconsIcon
                              icon={ViewIcon}
                              size={24}
                              className="me-2 text-primary"
                            />
                            <h6 className="mb-0 fw-bold">Awareness</h6>
                          </div>

                          <div className="d-flex flex-row gap-2 mb-3">
                            {rubricLevels.map((level) => (
                              <div
                                key={level.id}
                                className={`flex-fill p-3 border !tw-rounded-lg cursor-pointer ${domain.awarenessStatus === level.id
                                  ? `${level.borderColor} ${level.backgroundColor}`
                                  : "border-light"
                                  }`}
                                onClick={() =>
                                  !isViewMode &&
                                  handleDomainRubricChange(
                                    domain.domainId,
                                    "awarenessStatus",
                                    level.id
                                  )
                                }
                                style={{
                                  cursor: isViewMode ? "default" : "pointer",
                                }}
                              >
                                <div className="d-flex align-items-center">
                                  <div
                                    className={`me-3 ${domain.awarenessStatus === level.id
                                      ? level.textColor
                                      : "text-muted"
                                      }`}
                                  >
                                    <div
                                      className={`rounded-circle border ${domain.awarenessStatus === level.id
                                        ? `${level.iconBgColor} ${level.iconBorderColor}`
                                        : "border-secondary"
                                        }`}
                                      style={{ width: "20px", height: "20px" }}
                                    >
                                      {domain.awarenessStatus === level.id && (
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
                                      className={`fw-bold ${domain.awarenessStatus === level.id
                                        ? level.textColor
                                        : "text-dark"
                                        }`}
                                    >
                                      {level.name}
                                    </div>
                                    {/* <div
                                      className={`small ${
                                        domain.awarenessStatus === level.id
                                          ? level.textColor
                                          : "text-muted"
                                      }`}
                                    >
                                      {level.description}
                                    </div> */}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Sensitivity Section */}
                      <div className="col-md-12 mb-3">
                        <div className="!tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4 !tw-pt-5">
                          <div className="d-flex align-items-center mb-3">
                            <HugeiconsIcon
                              icon={FavouriteIcon}
                              size={24}
                              className="me-2 text-danger"
                            />
                            <h6 className="mb-0 fw-bold">Sensitivity</h6>
                          </div>

                          <div className="d-flex flex-row gap-2 mb-3">
                            {rubricLevels.map((level) => (
                              <div
                                key={level.id}
                                className={`flex-fill p-3 border !tw-rounded-lg cursor-pointer ${domain.sensitivityStatus === level.id
                                  ? `${level.borderColor} ${level.backgroundColor}`
                                  : "border-light"
                                  }`}
                                onClick={() =>
                                  !isViewMode &&
                                  handleDomainRubricChange(
                                    domain.domainId,
                                    "sensitivityStatus",
                                    level.id
                                  )
                                }
                                style={{
                                  cursor: isViewMode ? "default" : "pointer",
                                }}
                              >
                                <div className="d-flex align-items-center">
                                  <div
                                    className={`me-3 ${domain.sensitivityStatus === level.id
                                      ? level.textColor
                                      : "text-muted"
                                      }`}
                                  >
                                    <div
                                      className={`rounded-circle border ${domain.sensitivityStatus === level.id
                                        ? `${level.iconBgColor} ${level.iconBorderColor}`
                                        : "border-secondary"
                                        }`}
                                      style={{ width: "20px", height: "20px" }}
                                    >
                                      {domain.sensitivityStatus === level.id && (
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
                                      className={`fw-bold ${domain.sensitivityStatus === level.id
                                        ? level.textColor
                                        : "text-dark"
                                        }`}
                                    >
                                      {level.name}
                                    </div>
                                    {/* <div
                                      className={`small ${
                                        domain.sensitivityStatus === level.id
                                          ? level.textColor
                                          : "text-muted"
                                      }`}
                                    >
                                      {level.description}
                                    </div> */}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Creativity Section */}
                      <div className="col-md-12 mb-3">
                        <div className="!tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4 !tw-pt-5">
                          <div className="d-flex align-items-center mb-3">
                            <HugeiconsIcon
                              icon={PaintBoardIcon}
                              size={24}
                              className="me-2 text-warning"
                            />
                            <h6 className="mb-0 fw-bold">Creativity</h6>
                          </div>

                          <div className="d-flex flex-row gap-2 mb-3">
                            {rubricLevels.map((level) => (
                              <div
                                key={level.id}
                                className={`flex-fill p-3 border !tw-rounded-lg cursor-pointer ${domain.creativityStatus === level.id
                                  ? `${level.borderColor} ${level.backgroundColor}`
                                  : "border-light"
                                  }`}
                                onClick={() =>
                                  !isViewMode &&
                                  handleDomainRubricChange(
                                    domain.domainId,
                                    "creativityStatus",
                                    level.id
                                  )
                                }
                                style={{
                                  cursor: isViewMode ? "default" : "pointer",
                                }}
                              >
                                <div className="d-flex align-items-center">
                                  <div
                                    className={`me-3 ${domain.creativityStatus === level.id
                                      ? level.textColor
                                      : "text-muted"
                                      }`}
                                  >
                                    <div
                                      className={`rounded-circle border ${domain.creativityStatus === level.id
                                        ? `${level.iconBgColor} ${level.iconBorderColor}`
                                        : "border-secondary"
                                        }`}
                                      style={{ width: "20px", height: "20px" }}
                                    >
                                      {domain.creativityStatus === level.id && (
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
                                      className={`fw-bold ${domain.creativityStatus === level.id
                                        ? level.textColor
                                        : "text-dark"
                                        }`}
                                    >
                                      {level.name}
                                    </div>
                                    {/* <div
                                      className={`small ${
                                        domain.creativityStatus === level.id
                                          ? level.textColor
                                          : "text-muted"
                                      }`}
                                    >
                                      {level.description}
                                    </div> */}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Remarks Section */}
                      <div className="col-md-12">
                        <div className="!tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4">
                          <h6 className="mb-3 fw-bold">Comments:</h6>
                          <TextArea
                            name={`remarks-${domain.domainId}`}
                            value={domain.remarks}
                            onChange={(e) => {
                              const value = typeof e === 'string' ? e : e?.target?.value || '';
                              handleRemarksChange(domain.domainId, value);
                            }}
                            placeHolder={`Add remarks for ${domain.name.toLowerCase()} assessment.`}
                            isDisabled={isViewMode}
                            formgroupClassName="mb-0"
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionBody>
                </AccordionItem>
              ))}
            </UncontrolledAccordion>
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