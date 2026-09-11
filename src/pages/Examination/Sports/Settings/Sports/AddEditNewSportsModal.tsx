import { useFormik } from "formik";
import { TextInput } from "../../../../../Components/Common";
import * as Yup from "yup";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../../hooks/storehook";
import {
  editSportsNameItemAct,
  saveSportsNameItemAct,
} from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { useEffect } from "react";

const initialValues = {
  sportName: "",
};

const validationSchema = Yup.object().shape({
  sportName: Yup.string().required("Sports Name is required"),
});

const AddEditNewSportsModal = ({ toggle, sportsId }) => {
  const dispatch = useDispatch();

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
    getSportsNameByIdResp,
  } = useAppSelector(
    ({ globalData, appData, examinationSports }) => ({
      showApiLoader: globalData.showApiLoader,
      currentBranchIdResp: appData.currentBranchIdResp,
      getSportsNameByIdResp: examinationSports.getSportsNameByIdResp,
    }),
    shallowEqual
  );

  const addEditSportsNamesFormik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (sportsId) {
        const payload = {
          sportName: values?.sportName,
        };

        dispatch(
          editSportsNameItemAct(
            generateActionPayload(
              "edit_sports_name_item",
              { id: sportsId },
              payload
            )
          )
        );
      } else {
        const payload = { branchId, sportName: values.sportName };
        dispatch(
          saveSportsNameItemAct(
            generateActionPayload("save_sports_name_item", undefined, payload)
          )
        );
      }
    },
  });

  useEffect(() => {
    if (sportsId && getSportsNameByIdResp) {
      addEditSportsNamesFormik.setValues({
        sportName: getSportsNameByIdResp?.sportName || "",
      });
    }
  }, [sportsId, getSportsNameByIdResp]);

  return (
    <div style={{ padding: "1.25rem" }}>
      <div className="row mb-4">
        <div className="col-12">
          <TextInput
            name="sportName"
            value={addEditSportsNamesFormik.values.sportName}
            onChange={addEditSportsNamesFormik.handleChange}
            onBlur={addEditSportsNamesFormik.handleBlur}
            labelClass="required"
            invalid={
              addEditSportsNamesFormik.touched.sportName &&
              addEditSportsNamesFormik.errors.sportName
                ? true
                : false
            }
            error={
              addEditSportsNamesFormik.touched.sportName &&
              addEditSportsNamesFormik.errors.sportName
                ? addEditSportsNamesFormik.errors.sportName
                : ""
            }
            labelText="Sports Name"
          ></TextInput>
        </div>
      </div>
      <div className="row">
        <div className="d-flex ms-auto w-auto">
          <button className="btn btn-light me-3" onClick={toggle}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-success"
            onClick={(event: any) => {
              addEditSportsNamesFormik.handleSubmit(event);
            }}
            disabled={showApiLoader}
          >
            {sportsId ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditNewSportsModal;
