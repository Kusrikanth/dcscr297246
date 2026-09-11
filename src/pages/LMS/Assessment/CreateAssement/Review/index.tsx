import { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { StepperFormContext, TABS_ACTIONS } from "../helper";
import { assessmentReviewData } from "./helper";
import { Switch } from "../../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getAssessmentReviewAct, getSettingsAssessmentIdAct, savePublishAssessmentAct } from "../../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { convertUTCToISTTimeOnly } from "../../../../../utility/dateutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { File01Icon } from "@hugeicons-pro/core-solid-standard";
import { ArrowRight03Icon } from "@hugeicons-pro/core-stroke-standard";

const DetailItem = ({ label, value }) => (
  <>
    <div className="tw-text-gray-500 tw-whitespace-nowrap">{label}</div>
    <div className="tw-text-gray-800 tw-font-medium">{value}</div>
  </>
);

const Review = () => {
  const { submitCurrentFormCllbck } = useContext<any>(StepperFormContext);
  const [reviewData, setReviewData] = useState(assessmentReviewData);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getAssessmentByIdResp,
    saveAssessmentQuestionsResp,
    saveBasicAssessmentResp,
    studentsListResp,
    sectionListResp,
    getAssessmentReviewResp,
    virtualRoleResp,
    loggedInUserRole
  } = useAppSelector(
    ({ instAcademics, globalData, branchAcademics, appData, classSubjectsInfo, directoryEmployee, branch, lmsAssessment, directoryStudent, classroomManagmentInfo }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getAssessmentByIdResp: lmsAssessment.getAssessmentByIdResp,
      saveAssessmentQuestionsResp: lmsAssessment.saveAssessmentQuestionsResp,
      saveBasicAssessmentResp: lmsAssessment.saveBasicAssessmentResp,
      studentsListResp: directoryStudent.studentsListResp,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      getAssessmentReviewResp: lmsAssessment.getAssessmentReviewResp,
      virtualRoleResp: appData.virtualRoleResp,
      loggedInUserRole: appData.loggedInUserRole,
    }),
    shallowEqual
  );



  const previousBtnHndlr = useCallback((e: any) => {
    submitCurrentFormCllbck(["settings"], TABS_ACTIONS.PREVIOUS_TAB);
    if (saveBasicAssessmentResp?.data) {
      dispatch(
        getSettingsAssessmentIdAct(
          generateActionPayload("get_global_settings_assessment_id", {
            assessmentId: saveBasicAssessmentResp?.data,
          })
        )
      );
    }
  }, [submitCurrentFormCllbck, saveBasicAssessmentResp?.data, dispatch]);

  useEffect(() => {
    if (saveBasicAssessmentResp?.data) {
      dispatch(getAssessmentReviewAct(generateActionPayload("get_assessment_review", { id: saveBasicAssessmentResp?.data }, {})));
    }
  }, [saveBasicAssessmentResp?.data]);

  function submitBtnHndlr() {
    history.push("/assessment-list");
    const publishStatus = (loggedInUserRole === 'INSTITUTE_ADMIN' && virtualRoleResp) || loggedInUserRole === 'BRANCH_ADMIN' ? 'PUBLISHED' : 'SAVE';
    dispatch(savePublishAssessmentAct(generateActionPayload("get_published_assessment", { id: saveBasicAssessmentResp?.data }, { publishStatus })));
  }

  const handleToggle = (category, key) => {
    setReviewData(prevData => {
      const currentValue = prevData[category][key];
      const newValue = (currentValue.toUpperCase() === 'ON') ? 'OFF' : 'ON';
      return {
        ...prevData,
        [category]: {
          ...prevData[category],
          [key]: newValue,
        },
      };
    });
  };

  const handleNotificationToggle = (itemId: string) => {
    setReviewData((prevData: any) => {
      const newNotifications = prevData.notifications.map((item: any) => {
        if (item.id === itemId) {
          const newStatus = item.status.toUpperCase() === 'ON' ? 'OFF' : 'ON';
          return { ...item, status: newStatus };
        }
        return item;
      });
      return { ...prevData, notifications: newNotifications };
    });
  };


  return (
    <>
      <div className='card h-100 mb-0' style={{ borderRadius: "10px" }}>
        <div className='card-header' style={{
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          padding: "20px"
        }}>
          <div className='d-flex align-items-center' style={{ gap: "16px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#CBF3EF",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <HugeiconsIcon
                icon={File01Icon}
                size={24}
                color="#0AB39C"
              />
            </div>
            <div className='d-grid'>
              <h4 className='mb-1' style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#333",
                lineHeight: "1.3"
              }}>
                Step 5: Review & Publish
              </h4>
              <span className='text-muted' style={{
                fontSize: "14px",
                color: "#6c757d",
                lineHeight: "1.4"
              }}>
                Review all requirements met - Ready to publish
              </span>
            </div>
          </div>
        </div>
        <div className='card-body'>

          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-6">
            <div className="lg:tw-col-span-12">
              <div className="tw-grid tw-grid-cols-3 md:tw-grid-cols-3 tw-gap-6">

                <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm tw-flex tw-flex-col">
                  <div className="tw-px-5 tw-py-4 tw-flex tw-justify-between tw-items-center tw-border-b">
                    <h3 className="tw-text-base tw-font-bold tw-text-gray-900 tw-m-0">Basic Details</h3>
                    {/* <div onClick={()=> } className="tw-text-sm tw-font-semibold" style={{ color: '#0AB39C' }}>Edit</div> */}
                  </div>
                  <div className="tw-p-5 tw-text-sm tw-flex-grow">
                    <div className="tw-grid tw-grid-cols-[max-content,1fr] tw-gap-x-4 tw-gap-y-3">
                      <DetailItem label="Name:" value={getAssessmentReviewResp?.assessment?.assessmentName} />
                      <DetailItem label="Code:" value={getAssessmentReviewResp?.assessment?.assessmentCode} />
                      <DetailItem label="Mode:" value={getAssessmentReviewResp?.assessment?.assessmentMode} />
                      <DetailItem label="Curriculum:" value={getAssessmentReviewResp?.assessment?.curriculumName} />
                      <DetailItem label="Class:" value={getAssessmentReviewResp?.assessment?.className} />
                      <DetailItem label="Subject:" value={getAssessmentReviewResp?.assessment?.subjectName} />
                      <DetailItem label="Topics" value={reviewData.basicDetails.topics} />
                      <DetailItem label="Skill Tags" value={reviewData.basicDetails.skillTags} />
                    </div>
                  </div>
                </div>

                <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm tw-flex tw-flex-col">
                  <div className="tw-px-5 tw-py-4 tw-flex tw-justify-between tw-items-center tw-border-b">
                    <h3 className="tw-text-base tw-font-bold tw-text-gray-900 tw-m-0">Questions</h3>
                    {/* <a href="#" className="tw-text-sm tw-font-semibold" style={{ color: '#0AB39C' }}>Edit</a> */}
                  </div>
                  <div className="tw-p-5 tw-text-sm tw-flex-grow">
                    <div className="tw-grid tw-grid-cols-[max-content,1fr] tw-gap-x-4 tw-gap-y-3">
                      <DetailItem label="Total Questions" value={getAssessmentReviewResp?.assessment?.totalQuestions} />
                      <DetailItem label="Total Marks" value={getAssessmentReviewResp?.assessment?.totalMarks} />
                      <DetailItem label="Types" value={reviewData.questions.types} />
                      <DetailItem label="Shuffle Questions" value={getAssessmentReviewResp?.assessmentSettings?.shuffleQuestions === true ? 'ENABLE' : 'DISABLE'} />
                      <DetailItem label="Shuffle Options" value={getAssessmentReviewResp?.assessmentSettings?.shuffleOptions === true ? 'ENABLE' : 'DISABLE'} />
                      <DetailItem label="Negative Marking" value={getAssessmentReviewResp?.assessmentSettings?.negativeMarking === true ? 'Yes' : 'No'} />
                    </div>
                  </div>
                </div>

                <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm tw-flex tw-flex-col">
                  <div className="tw-px-5 tw-py-4 tw-flex tw-justify-between tw-items-center tw-border-b">
                    <h3 className="tw-text-base tw-font-bold tw-text-gray-900 tw-m-0">Assignments</h3>
                    {/* <a href="#" className="tw-text-sm tw-font-semibold" style={{ color: '#0AB39C' }}>Edit</a> */}
                  </div>
                  <div className="tw-p-5 tw-text-sm tw-flex-grow">
                    <div className="tw-grid tw-grid-cols-[max-content,1fr] tw-gap-x-4 tw-gap-y-3">
                      {/* <DetailItem label="Assigned To" value={getAssessmentReviewResp?.assignedStudents.assignedTo} /> */}
                      <div className="tw-text-gray-500 tw-whitespace-nowrap">Assigned To</div>
                      <div className="tw-text-gray-800 tw-font-medium">
                        {getAssessmentReviewResp?.assignedStudents.sectionDTOS?.length ? (
                          getAssessmentReviewResp.assignedStudents.sectionDTOS.map((item, index, arr) => (
                            <span key={item.sectionName} className="tw-mx-1">
                              {item.sectionName}
                              {index < arr.length - 1 && ","}
                            </span>
                          ))
                        ) : (
                          <span className="tw-mx-1">No sections assigned</span>
                        )}
                      </div>
                      <DetailItem label="Students Assigned" value={getAssessmentReviewResp?.assignedStudents.studentDetailsResponseDTOS.length} />
                      <DetailItem label="Status" value={
                        <span className="tw-bg-[#0ab39c4a] tw-text-[#0AB39C] tw-text-xs tw-font-bold tw-px-3 tw-py-1 tw-rounded-md tw-border tw-border-[#0AB39C]">
                          {reviewData.assignments.status}
                        </span>
                      } />
                    </div>
                  </div>
                </div>

                <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm tw-flex tw-flex-col">
                  <div className="tw-px-5 tw-py-4 tw-flex tw-justify-between tw-items-center tw-border-b">
                    <h3 className="tw-text-base tw-font-bold tw-text-gray-900 tw-m-0">Schedule</h3>
                    {/* <a href="#" className="tw-text-sm tw-font-semibold" style={{ color: '#0AB39C' }}>Edit</a> */}
                  </div>
                  <div className="tw-p-5 tw-text-sm tw-space-y-3">
                    <div><span className="tw-text-gray-500">Start:</span> <span className="tw-text-gray-800 tw-font-medium">{getAssessmentReviewResp?.assessment?.startDate} | {convertUTCToISTTimeOnly(getAssessmentReviewResp?.assessment?.startTime)}</span></div>
                    <div><span className="tw-text-gray-500">End:</span> <span className="tw-text-gray-800 tw-font-medium">{getAssessmentReviewResp?.assessment?.expiryDate} | {convertUTCToISTTimeOnly(getAssessmentReviewResp?.assessment?.expiryTime)}</span></div>
                    <div><span className="tw-text-gray-500">Grace Period to Join (in minutes):</span> <span className="tw-text-gray-800 tw-font-medium">{getAssessmentReviewResp?.assessmentSettings?.gracePeriod}</span></div>
                  </div>
                </div>

                <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm tw-flex tw-flex-col">
                  <div className="tw-px-5 tw-py-4 tw-flex tw-justify-between tw-items-center tw-border-b">
                    <h3 className="tw-text-base tw-font-bold tw-text-gray-900 tw-m-0">Result Settings</h3>
                    {/* <a href="#" className="tw-text-sm tw-font-semibold" style={{ color: '#0AB39C' }}>Edit</a> */}
                  </div>
                   <div className="tw-p-5 tw-text-sm tw-space-y-3">
                    <div className="tw-grid tw-grid-cols-[max-content,1fr] tw-gap-x-4 tw-gap-y-3">
                      <span className="tw-text-gray-500">Publishes:</span>
                      <span className="tw-text-gray-800 tw-font-medium">{getAssessmentReviewResp?.assessmentSettings?.durationMode}</span>
                    </div>
                    <div className="tw-grid tw-grid-cols-[max-content,1fr] tw-gap-x-4 tw-gap-y-3">
                      {/* <span className="tw-text-gray-500">Show Correct Answers</span> */}
                      <DetailItem label="Show Correct Answers" value={getAssessmentReviewResp?.assessmentSettings?.showCorrectAnswersAfterSubmission === true ? 'Yes' : 'No'} />
                    </div>
                  </div>
                </div>

                <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm tw-flex tw-flex-col">
                  <div className="tw-px-5 tw-py-4 tw-flex tw-justify-between tw-items-center tw-border-b">
                    <h3 className="tw-text-base tw-font-bold tw-text-gray-900 tw-m-0">Grade Bands</h3>
                    {/* <a href="#" className="tw-text-sm tw-font-semibold" style={{ color: '#0AB39C' }}>Edit</a> */}
                  </div>
                   <div className="tw-p-5">
                    <div className="tw-flex tw-flex-wrap tw-gap-2">
                      {getAssessmentReviewResp?.assessmentSettings?.gradesSettingDTOs?.map((band) => (
                        <span key={band.grade} className="tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded-md">
                          {band.grade}: {band.fromMarks} - {band.toMarks}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm tw-flex tw-flex-col">
                  <div className="tw-px-5 tw-py-4 tw-flex tw-justify-between tw-items-center tw-border-b">
                    <h3 className="tw-text-base tw-font-bold tw-text-gray-900 tw-m-0">Notifications</h3>
                    {/* <a href="#" className="tw-text-sm tw-font-semibold" style={{ color: '#0AB39C' }}>Edit</a> */}
                  </div>
                   <div className="tw-p-5 tw-text-sm tw-flex-grow">
                    <div className="tw-grid tw-grid-cols-[max-content,1fr] tw-gap-x-4 tw-gap-y-3">
                      <DetailItem label="Added to exam" value={getAssessmentReviewResp?.assessmentSettings?.addedToExam === true ? 'Yes' : 'No'} />
                      <DetailItem label="Starting soon" value={getAssessmentReviewResp?.assessmentSettings?.examStarting === true ? 'Yes' : 'No'} />
                      <DetailItem label="Results ready" value={getAssessmentReviewResp?.assessmentSettings?.examResultsReady === true ? 'Yes' : 'No'} />
                      <DetailItem label="Missed exam" value={getAssessmentReviewResp?.assessmentSettings?.missedExam === true ? 'Yes' : 'No'} />
                      <DetailItem label="Ongoing reminder" value={getAssessmentReviewResp?.assessmentSettings?.examOngoing === true ? 'Yes' : 'No'} />
                    </div>
                  </div>
                </div>

                <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm tw-flex tw-flex-col">
                  <div className="tw-px-5 tw-py-4 tw-flex tw-justify-between tw-items-center tw-border-b">
                    <h3 className="tw-text-base tw-font-bold tw-text-gray-900 tw-m-0">Rules & Security</h3>
                    {/* <a href="#" className="tw-text-sm tw-font-semibold" style={{ color: '#0AB39C' }}>Edit</a> */}
                  </div>
                  {/* <div className="tw-p-5 tw-text-sm tw-flex-grow">
                <div className="tw-space-y-3">
                  {Object.entries(reviewData.rulesAndSecurity).map(([key, value]: any) => {
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return (
                      <div key={key} className="tw-flex tw-justify-between tw-items-center">
                        <span className="tw-text-gray-500">{label}</span>
                        <Switch
                          attributeId={key}
                          checked={value.toUpperCase() === 'ON'}
                          onChangeHndlr={() => handleToggle('rulesAndSecurity', key)}
                          className="form-switch-sm mb-0"
                        />
                      </div>
                    );
                  })}
                  <DetailItem label="Assigned To" value={reviewData.assignments.assignedTo} />
                  <DetailItem label="Students Assigned" value={reviewData.assignments.studentsAssigned} />
                </div>
              </div> */}
                  <div className="tw-p-5 tw-text-sm tw-flex-grow">
                    <div className="tw-grid tw-grid-cols-[max-content,1fr] tw-gap-x-4 tw-gap-y-3">
                      <DetailItem label="Fullscreen Mode" value={getAssessmentReviewResp?.assessmentSettings?.fullScreenMode === true ? 'Yes' : 'No'} />
                      <DetailItem label="No Extra Screens" value={getAssessmentReviewResp?.assessmentSettings?.negativeMarking === true ? 'Yes' : 'No'} />
                      <DetailItem label="No Dev Console" value={getAssessmentReviewResp?.assessmentSettings?.blockDevTools === true ? 'Yes' : 'No'} />
                      <DetailItem label="Cursor Lock" value={getAssessmentReviewResp?.assessmentSettings?.cursorMustStayInsideWindow === true ? 'Yes' : 'No'} />
                      <DetailItem label="Session Switch" value={getAssessmentReviewResp?.assessmentSettings?.negativeMarking === true ? 'Yes' : 'No'} />
                      <DetailItem label="Camera Capture" value={getAssessmentReviewResp?.assessmentSettings?.negativeMarking === true ? 'Yes' : 'No'} />

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="row my-3">
            <div className="col-12 d-flex justify-content-between mt-2 px-0">
              <button
                type="button"
                style={{ borderRadius: "8px" }}
                className="btn btn-outline-primary mx-2 fs-12 px-4 py-2 d-flex align-items-center"
                onClick={previousBtnHndlr}
              >
                Previous
              </button>
              <div className='pe-2'>
                <button className="btn btn-light fs-12 px-4 py-2 h-100" style={{ borderRadius: "8px" }} onClick={() => { history.push("/assessment-list") }}>Cancel</button>
                <button
                  type="button"
                  style={{ borderRadius: "8px" }}
                  className="btn btn-success fs-12 px-4 py-2 ms-3"
                  onClick={submitBtnHndlr}
                  disabled={showApiLoader}
                >
                  {loggedInUserRole === 'INSTITUTE_ADMIN' && virtualRoleResp || loggedInUserRole === 'BRANCH_ADMIN' ? 'Save & Publish' : 'Submit'}<HugeiconsIcon
                    icon={ArrowRight03Icon}
                    size={24}
                    color="#fafafa"
                    className='ms-1'
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-0 pt-2">

      </div>
    </>
  );
};

export default Review;