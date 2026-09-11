import { useFormik } from "formik";
import { SelectInput, Switch, TextInput } from "../../../../../Components/Common";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { saveDigitalCurriculumRulesAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { LEVEL_KEY_OPTIONS } from "./helper";
import { useEffect } from "react";

const initialValues = {
  levelKey: "",
  displayName: "",
  sampleNotes: "",
  isEnabled: true,
};

const validationSchema = Yup.object().shape({
  levelKey: Yup.string().required("Level Key is required."),
  displayName: Yup.string().required("Display Name is required."),
  sampleNotes: Yup.string().required("Sample Notes is required."),
});

const CurriculumRulesModal = (props: any) => {
  const dispatch = useAppDispatch();

  const addCurriculumRulesFormik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const branchName = branchListResp?.data?.find(
        (item: any) => +item.branchId === +branchId
      )?.branchName;

      const payload = {
        ...(props.id?.id && { id: props.id.id }),
        instituteId,
        branchId,
        branchName,
        levelKey: values.levelKey,
        displayName: values.displayName,
        sampleNotes: values.sampleNotes,
        isEnabled: values.isEnabled,
      };

      dispatch(
        saveDigitalCurriculumRulesAct(
          generateActionPayload(
            "save_digital_curriculum_rules",
            undefined,
            payload
          )
        )
      );
    },
  });

  const { showApiLoader, branchListResp, academicYearListResp, currentBranchIdResp: branchId,
    currentInstIdResp: instituteId, instituteListResp, getAcademicDetailsByIdResp } =
    useAppSelector(({ globalData, branch, instAcademics, appData, instituteInfo, lmsSettings }) => ({
      showApiLoader: globalData.showApiLoader,
      branchListResp: branch.branchListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      instituteListResp: instituteInfo.instituteListResp,
      getAcademicDetailsByIdResp: lmsSettings.getAcademicDetailsByIdResp
    }), shallowEqual);

  useEffect(() => {
    if (props.id) {
      addCurriculumRulesFormik.setValues({
        levelKey: props.id.levelKey || "",
        displayName: props.id.displayName || "",
        sampleNotes: props.id.sampleNotes || "",
        isEnabled: props.id.isEnabled ?? true,
      });
    }
  }, [props.id]);

  return (
    <>
      <div className="modal-body p-3">
        <form onSubmit={addCurriculumRulesFormik.handleSubmit}>
          <div className="row">
            <div className="col-12 col-md-6">
              <SelectInput
                name="levelKey"
                labelText="Level Key"
                labelClass="required"
                value={addCurriculumRulesFormik.values.levelKey}
                onChange={addCurriculumRulesFormik.handleChange}
                menuItems={LEVEL_KEY_OPTIONS}
                valueKey="value"
                textKey="label"
                invalid={(addCurriculumRulesFormik.touched.levelKey && addCurriculumRulesFormik.errors.levelKey) ? true : false}
                error={(addCurriculumRulesFormik.touched.levelKey && addCurriculumRulesFormik.errors.levelKey) ? addCurriculumRulesFormik.errors.levelKey : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <TextInput
                name="displayName"
                labelText="Display Name"
                labelClass="required"
                value={addCurriculumRulesFormik.values.displayName}
                onChange={addCurriculumRulesFormik.handleChange}
                formgroupClassName="mb-0"
                invalid={(addCurriculumRulesFormik.touched.displayName && addCurriculumRulesFormik.errors.displayName) ? true : false}
                error={(addCurriculumRulesFormik.touched.displayName && addCurriculumRulesFormik.errors.displayName) ? addCurriculumRulesFormik.errors.displayName : ""}
              />
            </div>
            <div className="col-12">
              <TextInput
                name="sampleNotes"
                labelText="Sample Notes"
                labelClass="required"
                value={addCurriculumRulesFormik.values.sampleNotes}
                onChange={addCurriculumRulesFormik.handleChange}
                formgroupClassName="mb-0"
                invalid={(addCurriculumRulesFormik.touched.sampleNotes && addCurriculumRulesFormik.errors.sampleNotes) ? true : false}
                error={(addCurriculumRulesFormik.touched.sampleNotes && addCurriculumRulesFormik.errors.sampleNotes) ? addCurriculumRulesFormik.errors.sampleNotes : ""}
              />
            </div>
            <div className="col-12 col-md-6 d-flex align-items-center mt-3">
              <Switch
                attributeId="isEnabled"
                labelName="Enable"
                checked={addCurriculumRulesFormik.values.isEnabled}
                onChangeHndlr={(e: any) =>
                  addCurriculumRulesFormik.setFieldValue(
                    "isEnabled",
                    e.target.checked
                  )
                }
                className="form-switch-sm mb-3 form-check-right mb-0"
              />
            </div>
          </div>
          <div className="hstack gap-2 justify-content-end mt-1 mb-1 pb-0">
            <button
              type="button"
              className="btn btn-light"
              onClick={props.toggle}
            >
              Cancel
            </button>
            <button
              className="btn btn-success"
              type="submit"
            >
              {props.id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CurriculumRulesModal;
