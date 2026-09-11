import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { useEffect } from "react";
import { useFormik } from "formik";
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
  getOverallGradeColorListAct,
  saveOverallGradeColorAct,
} from "../../../../store/examination/examinationsettings/examinationsettingsaction";

const initialValues = {
  academicYearId: "",
  gradesList: [],
};

const SetGradeColorModal = ({ toggle }) => {
  const dispatch = useDispatch();
  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getOverallGradeColorListResp,
    showApiLoader,
  } = useAppSelector(
    ({ globalData, instAcademics, appData, examinationSettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getOverallGradeColorListResp:
        examinationSettings.getOverallGradeColorListResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );
  const gradeColorFormik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const payload = {
        academicYearId: values.academicYearId,
        branchId,
        grades: values.gradesList,
      };
      dispatch(
        saveOverallGradeColorAct(
          generateActionPayload("save_overall_grade_color", undefined, payload)
        )
      );
    },
  });

  function fecthOverallGradeColorList(otherProps?: any) {
    const payload = {
      academicYearId: gradeColorFormik.values.academicYearId,
      branchId: branchId,
      ...otherProps,
    };

    dispatch(
      getOverallGradeColorListAct(
        generateActionPayload(
          "get_overall_grade_color_list",
          undefined,
          payload
        )
      )
    );
  }

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    gradeColorFormik.setFieldValue("academicYearId", yearId);
    fecthOverallGradeColorList({ academicYearId: yearId });
  }, [academicYearListResp]);


  useEffect(() => {
    const list = getOverallGradeColorListResp;
    if (Array.isArray(list)) {
      gradeColorFormik.setFieldValue(
        "gradesList",
        list.map((grade) => ({
          overAllGrade: grade.overAllGrade ?? "",
          gradeColor: grade.gradeColor ?? "",
        }))
      );
    }
  }, [getOverallGradeColorListResp]);

  return (
    <div className="tw-p-4 tw-flex tw-flex-col tw-h-[75vh]">
      <div className="tw-flex-1 tw-overflow-y-auto tw-scrollbar-thin tw-scrollbar-thumb-gray-300 tw-scrollbar-track-gray-100">
        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-me-2">
          <div className="tw-col-span-6 tw-font-semibold">Overall Grade</div>
          <div className="tw-col-span-6 tw-font-semibold">Grade Color</div>

          {gradeColorFormik.values.gradesList?.map((row: any, index) => (
            <div
              key={index}
              className="tw-col-span-12 tw-grid tw-grid-cols-12 tw-gap-3"
            >
              <div className="tw-col-span-6">
                <input
                  className="form-control"
                  value={row?.overAllGrade}
                  readOnly
                  disabled
                />
              </div>

              <div className="tw-col-span-6 tw-flex tw-gap-2 tw-items-center">
                <input
                  type="color"
                  value={row?.gradeColor || "#000000"}
                  onChange={(e) =>
                    gradeColorFormik.setFieldValue(
                      `gradesList[${index}].gradeColor`,
                      e.target.value
                    )
                  }
                  formTarget="Please select the Color"
                  className="p-0 tw-w-8 tw-h-8 tw-border-0 tw-cursor-pointer tw-rounded-[2px]"
                />

                <input
                  className="form-control"
                  placeholder="#RRGGBB"
                  name={`gradesList[${index}].gradeColor`}
                  value={row?.gradeColor}
                  onChange={gradeColorFormik.handleChange}
                  onBlur={gradeColorFormik.handleBlur}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tw-flex tw-justify-end tw-mt-4 tw-border-t tw-pt-4">
        <button className="btn btn-light me-3" onClick={toggle}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-success"
          disabled={showApiLoader}
          onClick={(event: any) => gradeColorFormik.handleSubmit(event)}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SetGradeColorModal;
