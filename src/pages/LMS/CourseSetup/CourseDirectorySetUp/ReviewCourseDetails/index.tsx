import {
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import { TextInput } from "../../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bookmark03Icon,
  CircleArrowLeft01Icon,
} from "@hugeicons-pro/core-stroke-standard";

const courseDetails = {
  courseName: "Mathematics — Class 10 (Algebra)",
  academicYear: "Mathematics — Class 10 (Algebra)",
  curriculum: "CBSE",
  class: "X",
  sections: "A, B",
  subject: "Mathematics",
  language: "English",
  assignedTeacher: "Neha Sharma",
  courseCode: "MATH10-A-CBSE-2025",
  thumbnailStatus: "Uploaded",
};

const curriculumData = [
  {
    unitTitle: "Unit 1: Linear Equations",
    topics: 2,
    weeks: "3-4",
    loCoverage: "100%",
    status: "Ready",
    chapters: [
      {
        title: "Chapter 1.1: Introduction to Linear Equations",
        topics: [
          {
            id: 1,
            name: "Topic 1.1.1",
            lo: "ALG-101, ALG-103",
            bloom: "Apply",
            weeks: "3-4",
          },
          {
            id: 2,
            name: "Topic 1.1.2",
            lo: "ALG-101, ALG-103",
            bloom: "Apply",
            weeks: "3-4",
          },
        ],
      },
    ],
  },
  {
    unitTitle: "Unit 2: Quadratic Equations",
    topics: 2,
    weeks: "5-6",
    loCoverage: "80%",
    status: "In Progress",
    chapters: [
      {
        title: "Chapter 2.1: Introduction to Quadratic Equations",
        topics: [
          {
            id: 1,
            name: "Topic 2.1.1",
            lo: "ALG-201, ALG-203",
            bloom: "Understand",
            weeks: "5-6",
          },
        ],
      },
    ],
  },
];

const ReviewCourseDetails = () => {
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="card !tw-rounded-lg border tw-overflow-hidden">
            <div className="card-body">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="mb-0">Review & Publish</h4>
                <div className="tw-flex tw-items-center  tw-gap-3">
                  <button className="btn btn-primary">
                    Export PDF Syllabus
                  </button>
                  <button className="btn btn-secondary">Export CVS</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card !tw-rounded-lg border tw-overflow-hidden">
            <div className="card-header">
              <p className="tw-mb-0 tw-text-lg tw-font-semibold">
                Course Details ( Selected )
              </p>
            </div>
            <div className="card-body tw-p-4">
              <div className="tw-grid tw-grid-cols-2 tw-gap-y-4 tw-gap-x-6">
                <div className="tw-grid tw-grid-cols-[150px_1fr] tw-gap-4">
                  <p className="tw-text-gray-500 tw-mb-0">Course Name</p>
                  <p className="tw-font-semibold tw-mb-0">
                    {courseDetails.courseName}
                  </p>
                </div>
                <div className="tw-grid tw-grid-cols-[150px_1fr] tw-gap-4">
                  <p className="tw-text-gray-500 tw-mb-0">Academic Year</p>
                  <p className="tw-font-semibold tw-mb-0">
                    {courseDetails.academicYear}
                  </p>
                </div>
                <div className="tw-grid tw-grid-cols-[150px_1fr] tw-gap-4">
                  <p className="tw-text-gray-500 tw-mb-0">Curriculum</p>
                  <p className="tw-font-semibold tw-mb-0">
                    {courseDetails.curriculum}
                  </p>
                </div>
                <div className="tw-grid tw-grid-cols-[150px_1fr] tw-gap-4">
                  <p className="tw-text-gray-500 tw-mb-0">Class</p>
                  <p className="tw-font-semibold mb-0">{courseDetails.class}</p>
                </div>
                <div className="tw-grid tw-grid-cols-[150px_1fr] tw-gap-4">
                  <p className="tw-text-gray-500 tw-mb-0">Sections</p>
                  <p className="tw-font-semibold mb-0">
                    {courseDetails.sections}
                  </p>
                </div>
                <div className="tw-grid tw-grid-cols-[150px_1fr] tw-gap-4">
                  <p className="tw-text-gray-500 tw-mb-0">Subject</p>
                  <p className="tw-font-semibold mb-0">
                    {courseDetails.subject}
                  </p>
                </div>
                <div className="tw-grid tw-grid-cols-[150px_1fr] tw-gap-4">
                  <p className="tw-text-gray-500 tw-mb-0">Language</p>
                  <p className="tw-font-semibold mb-0">
                    {courseDetails.language}
                  </p>
                </div>
                <div className="tw-grid tw-grid-cols-[150px_1fr] tw-gap-4">
                  <p className="tw-text-gray-500 tw-mb-0">Assigned Teacher</p>
                  <p className="tw-font-semibold mb-0">
                    {courseDetails.assignedTeacher}
                  </p>
                </div>
                <div className="tw-grid tw-grid-cols-[150px_1fr] tw-gap-4">
                  <p className="tw-text-gray-500 tw-mb-0">Course Code</p>
                  <p className="tw-font-semibold mb-0">
                    {courseDetails.courseCode}
                  </p>
                </div>
                <div className="tw-grid tw-grid-cols-[150px_1fr] tw-gap-4">
                  <p className="tw-text-gray-500 tw-mb-0">Thumbnail</p>

                  <div className="tw-flex">
                    <p className="tw-flex tw-bg-green-100 tw-text-green-700 tw-px-4 tw-py-1 tw-rounded-full tw-text-sm">
                      {courseDetails.thumbnailStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card !tw-rounded-lg border tw-overflow-hidden tw-space-y-4">
            <div className="card-header">
              <p className="tw-mb-0 tw-text-lg tw-font-semibold">
                Curriculum Outline
              </p>
            </div>
            <div className="card-body py-2">
              <div className="tw-flex tw-justify-between tw-items-center tw-mb-8">
                <div className="search-box">
                  <TextInput
                    name="searchString"
                    formgroupClassName="mb-0"
                    placeHolder="Search..."
                    value={""}
                    onChange={() => {}}
                    labelText="Search"
                    floatingLabel
                  />
                  <i className="ri-search-line search-icon"></i>
                </div>

                <button className="btn btn-light">Expand all</button>
              </div>

              <UncontrolledAccordion stayOpen>
                {curriculumData.map((unit, index) => (
                  <AccordionItem
                    key={index}
                    className="border !tw-rounded-lg border tw-overflow-hidden"
                  >
                    <AccordionHeader targetId={`${index}`}>
                      <div className="tw-flex tw-justify-between tw-items-center tw-w-full">
                        <span className="tw-font-semibold">
                          {unit.unitTitle}
                        </span>
                      </div>
                    </AccordionHeader>
                    <AccordionBody accordionId={`${index}`}>
                      <div className="tw-flex tw-gap-2 tw-mb-4">
                        <span className="tw-bg-gray-200 tw-px-2 tw-py-1 tw-rounded text-xs">
                          Topics: {unit.topics}
                        </span>
                        <span className="tw-bg-indigo-200 tw-px-2 tw-py-1 tw-rounded text-xs">
                          Weeks: {unit.weeks}
                        </span>
                        <span className="tw-bg-purple-200 tw-px-2 tw-py-1 tw-rounded text-xs">
                          LO Coverage: {unit.loCoverage}
                        </span>
                        <span className="tw-bg-green-200 tw-px-2 tw-py-1 tw-rounded text-xs">
                          Status: {unit.status}
                        </span>
                      </div>
                      <div className="tw-space-y-2">
                        {unit.chapters.map((chapter, idx) => (
                          <div
                            key={idx}
                            className="tw-border tw-border-gray-200 tw-rounded tw-p-3 tw-bg-white"
                          >
                            <p className="tw-font-semibold">{chapter.title}</p>
                            {chapter.topics.map((topic) => (
                              <p
                                key={topic.id}
                                className="tw-text-sm tw-bg-gray-50 tw-px-2 tw-py-1 tw-rounded tw-mt-1"
                              >
                                <strong>{topic.name}</strong> - LO: {topic.lo} -
                                Bloom: {topic.bloom} - Weeks: {topic.weeks}
                              </p>
                            ))}
                          </div>
                        ))}
                      </div>
                    </AccordionBody>
                  </AccordionItem>
                ))}
              </UncontrolledAccordion>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4 w-100 mx-auto">
        <div className="col-12 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-success me-2"
            //   onClick={handlePrevious}
            //   disabled={stepId === "generalInformation"}
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
            <button type="button" className="btn btn-outline-primary me-2">
              <HugeiconsIcon
                icon={Bookmark03Icon}
                size={20}
                color="currentColor"
                className="!tw-mr-1"
              />
              Save as draft
            </button>
            <button
              type="button"
              className="btn btn-success"
              // onClick={handleNext}
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewCourseDetails;
