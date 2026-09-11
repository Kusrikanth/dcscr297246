import { useRef } from "react";
import {
  MultiSelect,
  SelectInput,
  TextInput,
} from "../../../../Components/Common";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { eventChannel } from "redux-saga";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  gradingLevel: [
    {
      id: generateUniqueNumber(),
      fromMarks: "",
      toMarks: "",
      grade: "",
    },
  ],
};

const SetupMasterData = () => {
  const bulkUploadDataFormik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  const gradingLevelformikHelper = useRef<ArrayHelpers | null>(null);

  function addNewGradingLevelHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (gradingLevelformikHelper.current) {
      gradingLevelformikHelper.current.push({
        id: generateUniqueNumber(),
        fromMarks: "",
        toMarks: "",
        grade: "",
      });
    }
  }

  function removeGradingLevelHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event?.currentTarget.getAttribute("data-index");
    if (rowIndex != undefined || rowIndex! == null) {
      gradingLevelformikHelper.current?.remove(Number(rowIndex));
    }
  }

  return (
    <div className="bulk-upload-file-container">
      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-x-3 tw-gap-y-4">
        <div className="tw-col-span-1">
          <div className="tw-flex tw-w-full tw-items-center">
            <div className="tw-w-[40%]">Branch Name</div>

            <div className="tw-w-[60%]">
              <SelectInput
                name="branchId"
                value={""}
                onChange={() => { }}
                menuItems={[]}
                valueKey=""
                textKey=""
                formgroupClassName="tw-mb-0"
              ></SelectInput>
            </div>
          </div>
        </div>
        <div className="tw-col-span-1">
          <div className="tw-flex tw-w-full tw-items-center">
            <div className="tw-w-[40%]">Academic Year</div>

            <div className="tw-w-[60%]">
              <SelectInput
                name="academicYearId"
                value={""}
                onChange={() => { }}
                menuItems={[]}
                valueKey=""
                textKey=""
                formgroupClassName="tw-mb-0"
              ></SelectInput>
            </div>
          </div>
        </div>
        <div className="tw-col-span-1">
          <div className="tw-flex tw-w-full tw-items-center">
            <div className="tw-w-[40%]">Curriculum</div>

            <div className="tw-w-[60%]">
              <SelectInput
                name="curriculumId"
                value={""}
                onChange={() => { }}
                menuItems={[]}
                valueKey=""
                textKey=""
                formgroupClassName="tw-mb-0"
              ></SelectInput>
            </div>
          </div>
        </div>
        <div className="tw-col-span-1">
          <div className="tw-flex tw-w-full tw-items-center">
            <div className="tw-w-[40%]">Class</div>

            <div className="tw-w-[60%]">
              <SelectInput
                name="classId"
                value={""}
                onChange={() => { }}
                menuItems={[]}
                valueKey=""
                textKey=""
                formgroupClassName="tw-mb-0"
              ></SelectInput>
            </div>
          </div>
        </div>
        <div className="tw-col-span-1">
          <div className="tw-flex tw-w-full tw-items-center">
            <div className="tw-w-[40%]">Class</div>

            <div className="tw-w-[60%]">
              <MultiSelect
                name="classId"
                value={""}
                onChange={() => { }}
                menuItems={[]}
                valueKey=""
                textKey=""
                formgroupClassName="tw-mb-0"
              ></MultiSelect>
            </div>
          </div>
        </div>
        <div className="tw-col-span-1">
          <div className="tw-flex tw-w-full tw-items-center">
            <div className="tw-w-[40%]">Subject</div>

            <div className="tw-w-[60%]">
              <MultiSelect
                name="subjectId"
                value={""}
                onChange={() => { }}
                menuItems={[]}
                valueKey=""
                textKey=""
                formgroupClassName="tw-mb-0"
              ></MultiSelect>
            </div>
          </div>
        </div>

        <div className="tw-col-span-full">
          <div className="tw-flex tw-items-center">
            <h5 className="tw-mb-0 tw-mr-3">Grading Level</h5>
            <Button
              variant="hoverInfo"
              onClick={addNewGradingLevelHndlr}
            >
              <i className="ri-add-line" />
            </Button>
          </div>
        </div>
        <div className="tw-col-span-full">
          <div className="tw-grid tw-grid-cols-12 tw-py-2 tw-mx-0 tw-bg-gray-100 tw-items-center">
            <div className="tw-col-span-4">
              <h6 className="form-label tw-mb-0 tw-text-center">From Marks</h6>
            </div>
            <div className="tw-col-span-4">
              <h6 className="form-label tw-mb-0 tw-text-center">To Marks</h6>
            </div>
            <div className="tw-col-span-3">
              <h6 className="form-label tw-mb-0 tw-text-center">Grade</h6>
            </div>
          </div>
        </div>

        <div className="tw-col-span-full">
          <div>
            <FormikProvider value={bulkUploadDataFormik}>
              <FieldArray name="gradingLevel">
                {(arrayHelpers: ArrayHelpers) => {
                  gradingLevelformikHelper.current = arrayHelpers;
                  return (
                    <>
                      {bulkUploadDataFormik.values.gradingLevel.map(
                        (ele: any, index: any) => {
                          return (
                            <div key={ele.id} className="tw-mb-3">
                              <div className=" tw-items-center tw-grid tw-grid-cols-12 tw-gap-2">
                                <div className="tw-col-span-4 tw-text-center">
                                  <TextInput
                                    name={`gradingLevel[${index}].fromMarks`}
                                    onChange={() => { }}
                                    value={""}
                                    formgroupClassName="tw-mb-0"
                                  ></TextInput>
                                </div>
                                <div className="tw-col-span-4 tw-text-center">
                                  <TextInput
                                    name={`gradingLevel[${index}].toMarks`}
                                    onChange={() => { }}
                                    value={""}
                                    formgroupClassName="tw-mb-0"
                                  ></TextInput>
                                </div>
                                <div className="tw-col-span-3 tw-text-center">
                                  <TextInput
                                    name={`gradingLevel[${index}].garde`}
                                    onChange={() => { }}
                                    value={""}
                                    formgroupClassName="tw-mb-0"
                                  ></TextInput>
                                </div>
                                {index !== 0 && (
                                  <Button
                                    variant="wrong"
                                    className="!tw-rounded-full !tw-p-2"
                                    type="button"
                                    data-index={index}
                                    onClick={removeGradingLevelHndlr}
                                  >
                                    <HugeiconsIcon
                                      icon={Delete02StrokeStandard}
                                      className="tw-text-red-600"
                                      size={18}
                                    />
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </>
                  );
                }}
              </FieldArray>
            </FormikProvider>
          </div>
        </div>
      </div>
      <div className="tw-flex tw-justify-end tw-mt-5">
        <Button variant="primary">Next</Button>
      </div>
    </div>
  );
};

export default SetupMasterData;
