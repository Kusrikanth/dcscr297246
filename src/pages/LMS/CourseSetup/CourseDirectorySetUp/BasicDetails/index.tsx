import { HugeiconsIcon } from "@hugeicons/react";
import {
  MultipleFileUpload,
  SelectInput,
  TextArea,
  TextInput,
} from "../../../../../Components/Common";
import {
  Bookmark03Icon,
  CircleArrowLeft01Icon,
  CircleArrowRight01Icon,
} from "@hugeicons-pro/core-stroke-standard";

const BasicDetails = () => {
  return (
    <div className="row">
      <div className="col-12 col-lg-6">
        <div className="card !tw-rounded-lg border tw-overflow-hidden">
          <div className="card-body">
            <div className="row">
              <div className="col-12 tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-mb-6">
                <p className="tw-mb-0 tw-font-semibold tw-text-lg">
                  Course Details
                </p>
                <p className="tw-mb-0 tw-font-semibold tw-text-base">
                  {/* Course Details */}
                </p>
              </div>

              <div className="col-12">
                <TextInput
                  name="courseName"
                  value={""}
                  onChange={() => {}}
                  labelText="Course Name"
                  labelClass="required"
                  formgroupClassName="mb-3"
                ></TextInput>
              </div>
              <div className="col-12">
                <TextArea
                  name="courseDescription"
                  value={""}
                  onChange={() => {}}
                  labelText="Description"
                  labelClass=""
                  formgroupClassName="mb-3"
                  height="92px"
                ></TextArea>
              </div>
              <div className="col-12 mb-3">
                <div className="fs-14 mb-1">Course Thumbnail</div>
                <div>
                  <MultipleFileUpload
                    name="document"
                    prevFiles={""}
                    onChange={() => {}}
                    containerClass="col-12"
                    maxSizeInMb={2}
                    helperText="Note : Max File Size is 5MB"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-6 ">
        <div className="card !tw-rounded-lg border tw-overflow-hidden">
          <div className="card-body">
            <div className="row">
              <div className="col-12 tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-mb-6">
                <p className="tw-mb-0 tw-font-semibold tw-text-lg">
                  Course Details
                </p>
              </div>
              <div className="col-12 col-lg-6">
                <SelectInput
                  name="academicYearId"
                  value={""}
                  onChange={() => {}}
                  valueKey=""
                  textKey=""
                  menuItems={[]}
                  labelText="Academic year"
                  labelClass="required"
                ></SelectInput>
              </div>
              <div className="col-12 col-lg-6">
                <SelectInput
                  name="curriculumId"
                  value={""}
                  onChange={() => {}}
                  valueKey=""
                  textKey=""
                  menuItems={[]}
                  labelText="Curriculum"
                  labelClass="required"
                ></SelectInput>
              </div>
              <div className="col-12 col-lg-6">
                <SelectInput
                  name="classId"
                  value={""}
                  onChange={() => {}}
                  valueKey=""
                  textKey=""
                  menuItems={[]}
                  labelText="Class"
                  labelClass="required"
                ></SelectInput>
              </div>
              <div className="col-12 col-lg-6">
                <SelectInput
                  name="sectionId"
                  value={""}
                  onChange={() => {}}
                  valueKey=""
                  textKey=""
                  menuItems={[]}
                  labelText="Section"
                  labelClass="required"
                ></SelectInput>
              </div>
              <div className="col-12">
                <SelectInput
                  name="subject"
                  value={""}
                  onChange={() => {}}
                  valueKey=""
                  textKey=""
                  menuItems={[]}
                  labelText="Subject"
                ></SelectInput>
              </div>

              <div className="col-12">
                <SelectInput
                  name="teacherId"
                  value={""}
                  onChange={() => {}}
                  valueKey=""
                  textKey=""
                  menuItems={[]}
                  labelText="Assigned Teacher"
                ></SelectInput>
              </div>
              <div className="col-12">
                <div className="tw-p-4 tw-bg-slate-100 tw-rounded">
                  <p className="tw-mb-4 tw-text-lg tw-font-semibold">
                    Auto-generated Course Codes
                  </p>
                  <div className="tw-grid tw-gap-3">
                    <div className="tw-flex tw-items-center tw-justify-between">
                      <p className="tw-mb-0 tw-font-semibold">Course ID:</p>
                      <div className="tw-border tw-rounded tw-px-3 tw-py-1 tw-bg-white tw-text-base">
                        MATH-12-2024-001
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4 w-100 mx-auto">
        <div className="col-12 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-success d-none"
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
              Next Step{" "}
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
    </div>
  );
};

export default BasicDetails;
