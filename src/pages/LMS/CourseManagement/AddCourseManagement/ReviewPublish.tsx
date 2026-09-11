import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { SelectInput, TextInputWithRegex } from "../../../../Components/Common";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import UncontrolledAccordionCard from "../../../../Components/Common/UncontrolledAccordionCard";
import AccordionCardItem from "../../../../Components/Common/AccordionCardItem";
import AccordionCardHeader from "../../../../Components/Common/AccordionCardHeader";
import AccordionCardBody from "../../../../Components/Common/AccordionCardBody";
import { default as MathsSVG } from "../../../../assets/imagesdps/lms/maths.svg?react";

const initialValues = {
  plannedSessions: "",
  lectures: "",
  labs: "",
  academicPacing: "35",
  sessionDistribution: "",
  startDate: "",
  endDate: "",
};

const ReviewPublish = () => {

  const signatureForm = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => { },
  });

  return (
    <>
      <div className="tw-rounded tw-overflow-hidden course">
        <div className="pt-2">
          <h4 className="tw-mb-0 fs-16">
            Review & Publish
          </h4>
        </div>
        <div className="pt-2 pb-3 mb-2" >
          <h4 className="tw-mb-0 fs-14 text-muted fw-medium">
            Review & Publish the Course.
          </h4>
        </div>
        <div className="row mb-3 employee-management-details-container">
          <div>
            <UncontrolledAccordionCard
              defaultOpen={[
                '1',
              ]}
            >
              <AccordionCardItem>
                <AccordionCardHeader targetId="1" title="Course Info" />
                <AccordionCardBody accordionId="1" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px", padding: "0px", border: "0px" }} >
                  <div>
                    <div
                      className="tw-h-[128px] tw-relative tw-mb-12 tw-transition-colors tw-duration-300"
                      style={{ backgroundColor: "#94A3B8" }}
                    >
                      <div className="tw-h-[68px] tw-w-[68px] tw-rounded tw-bg-white tw-px-3 tw-py-2 tw-border tw-absolute tw-bottom-[0px] tw-transform tw-translate-y-1/2 tw-translate-x-[24px]">
                        <MathsSVG />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Course Title  </span>
                        </h6>
                      </div>
                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">XYZ</span>
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Academic Year </span>
                        </h6>
                      </div>

                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">2025-2026</span>
                        </h6>
                      </div>
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Curriculum </span>
                        </h6>
                      </div>

                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">CBSE</span>
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Class </span>
                        </h6>
                      </div>

                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">VII</span>
                        </h6>
                      </div>
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Sections </span>
                        </h6>
                      </div>

                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">A, B, C, D</span>
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Subject </span>
                        </h6>
                      </div>

                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">English</span>
                        </h6>
                      </div>
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Course Type </span>
                        </h6>
                      </div>

                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">Elective</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </AccordionCardBody>
              </AccordionCardItem>
              <AccordionCardItem>
                <AccordionCardHeader targetId="2" title="Sessions Plan" />
                <AccordionCardBody accordionId="2" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px", padding: "0px", border: "0px" }} >
                  <div>
                    <div className="row">
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Course Start & End Date </span>
                        </h6>
                      </div>

                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">28-07-2025 to 27-07-2026</span>
                        </h6>
                      </div>
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Total Planned Sessions </span>
                        </h6>
                      </div>

                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">200</span>
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Lecture Sessions  </span>
                        </h6>
                      </div>

                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">150</span>
                        </h6>
                      </div>
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Lab Sessions </span>
                        </h6>
                      </div>
                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">50</span>
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Academic Pacing <br />(Weeks)  </span>
                        </h6>
                      </div>

                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">35</span>
                        </h6>
                      </div>
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Session Pacing </span>
                        </h6>
                      </div>
                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">10</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </AccordionCardBody>
              </AccordionCardItem>
              <AccordionCardItem>
                <AccordionCardHeader targetId="3" title="Chapters Mapping" />
                <AccordionCardBody accordionId="3" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px", padding: "0px", border: "0px" }} >
                  <div>
                    <div className="row">
                      <div className="col-3">
                        <h6>
                          <span className="fw-600">Selected Chapter </span>
                        </h6>
                      </div>

                      <div className="col-1">
                        :
                      </div>
                      <div className="col-8">
                        <h6 className="fw-600 text-muted">
                          <ul className="list-unstyled">
                            <li>Unit 1 &gt; Chapter 1 &gt; Topic 1</li>
                            <li className="ms-4">California K12 Standards</li>
                            <li className="ms-4">DRDP2011-SA (complete version)</li>
                            <li className="ms-4">DRDP2010-SA (simplified version)</li>
                          </ul>
                        </h6>

                      </div>
                    </div>
                  </div>
                </AccordionCardBody>
              </AccordionCardItem>
              <AccordionCardItem>
                <AccordionCardHeader targetId="4" title="Course Config Settings" />
                <AccordionCardBody accordionId="4" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px", padding: "0px", border: "0px" }} >
                  <div>
                    <div className="row">
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Enable Resources </span>
                        </h6>
                      </div>
                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">Yes</span>
                        </h6>
                      </div>
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Enable Assignments </span>
                        </h6>
                      </div>
                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">Yes</span>
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Enable Assessments </span>
                        </h6>
                      </div>
                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">No</span>
                        </h6>
                      </div>
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Enable Activities </span>
                        </h6>
                      </div>
                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">Yes</span>
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Enable Student Access  </span>
                        </h6>
                      </div>
                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">Yes</span>
                        </h6>
                      </div>
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Enable Question Bank </span>
                        </h6>
                      </div>
                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">No</span>
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 col-md-3 mb-3">
                        <h6>
                          <span className="fw-600">Enable Timetable View  </span>
                        </h6>
                      </div>
                      <div className="col-1">
                        :
                      </div>
                      <div className="col-6 col-md-2 mb-3">
                        <h6>
                          <span className="fw-600 text-muted">Yes</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </AccordionCardBody>
              </AccordionCardItem>
            </UncontrolledAccordionCard>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12 text-center">
            <button className='btn btn-light fs-12 px-5' >Cancel</button>
            <button
              type="button"
              className="btn btn-outline-primary mx-2 fs-12 px-5"
            >
              Save as Draft
            </button>
            <button type="button" className="btn btn-success fs-12 px-5" >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewPublish;
