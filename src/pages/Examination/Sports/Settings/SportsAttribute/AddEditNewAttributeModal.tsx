import { shallowEqual, useDispatch } from "react-redux";
import { SelectInput, TextInput } from "../../../../../Components/Common";
import * as Yup from "yup";
import { useAppSelector } from "../../../../../hooks/storehook";
import { useFormik } from "formik";
import { useEffect } from "react";
import {
  editSportsAttributeItemAct,
  saveSportsAttributeItemAct,
} from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { FormGroup, Input } from "reactstrap";


const initialValues = {
  attributeName: "",
  academicYearId: "",
  colorCode: "",
};
const validationSchema = Yup.object().shape({
  attributeName: Yup.string().required("Sports Attribute Name is required"),
  academicYearId: Yup.string().required("Academic Year is required."),
});

const AddEditNewAttributeModal = ({ isOpen, toggle, attributeId }) => {
  const dispatch = useDispatch();

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
    academicYearListResp,
    getSportsAttributeByIdResp,
  } = useAppSelector(
    ({ globalData, appData, instAcademics, examinationSports }) => ({
      showApiLoader: globalData.showApiLoader,
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,

      getSportsAttributeByIdResp: examinationSports.getSportsAttributeByIdResp,
    }),
    shallowEqual
  );

  const addEditSportsAttributeFormik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (attributeId) {
        const payload = {
          attributeName: values?.attributeName,
          tableHeaderColor: values?.colorCode,
        };

        dispatch(
          editSportsAttributeItemAct(
            generateActionPayload(
              "edit_sports_attribute_item",
              { id: attributeId },
              payload
            )
          )
        );
      } else {
        const payload = {
          branchId,
          attributeName: values.attributeName,
          academicYearId: values.academicYearId,
          tableHeaderColor: values.colorCode,
        };
        dispatch(
          saveSportsAttributeItemAct(
            generateActionPayload(
              "save_sports_attribute_item",
              undefined,
              payload
            )
          )
        );
      }
    },
  });

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    addEditSportsAttributeFormik.setFieldValue("academicYearId", yearId);
  }, [academicYearListResp]);

  useEffect(() => {
    if (attributeId && getSportsAttributeByIdResp) {
      addEditSportsAttributeFormik.setFieldValue(
        "attributeName",
        getSportsAttributeByIdResp?.attributeName || ""
      );
      addEditSportsAttributeFormik.setFieldValue(
        "colorCode",
        getSportsAttributeByIdResp?.tableHeaderColor || ""
      );
    }
  }, [attributeId, getSportsAttributeByIdResp]);  

  return (
    <div style={{ padding: "1.25rem" }}>
      <div className="row">
        <div className="col-12">
          <SelectInput
            name="academicYearId"
            labelText="Academic Year"
            labelClass="required"
            value={addEditSportsAttributeFormik.values.academicYearId}
            menuItems={academicYearListResp?.data}
            valueKey="academicYearId"
            textKey="academicYearName"
            isDisabled={attributeId}
            onChange={addEditSportsAttributeFormik.handleChange}
            onBlur={addEditSportsAttributeFormik.handleBlur}
            invalid={
              addEditSportsAttributeFormik.touched.academicYearId &&
              addEditSportsAttributeFormik.errors.academicYearId
                ? true
                : false
            }
            error={
              addEditSportsAttributeFormik.touched.academicYearId &&
              addEditSportsAttributeFormik.errors.academicYearId
                ? addEditSportsAttributeFormik.errors.academicYearId
                : ""
            }
          ></SelectInput>
        </div>
        <div className="col-12">
          <TextInput
            name="attributeName"
            value={addEditSportsAttributeFormik.values.attributeName}
            onChange={addEditSportsAttributeFormik.handleChange}
            onBlur={addEditSportsAttributeFormik.handleBlur}
            labelText="Attribute Name"
            labelClass="required"
            invalid={
              addEditSportsAttributeFormik.touched.attributeName &&
              addEditSportsAttributeFormik.errors.attributeName
                ? true
                : false
            }
            error={
              addEditSportsAttributeFormik.touched.attributeName &&
              addEditSportsAttributeFormik.errors.attributeName
                ? addEditSportsAttributeFormik.errors.attributeName
                : ""
            }
          ></TextInput>
        </div>
        <div className="col-12">
          <FormGroup>
            <Input
              name="colorCode"
              type="color"
              className="form-control form-control-color w-100"
              id="colorCode"
              value={addEditSportsAttributeFormik.values.colorCode || "#364574"} 
              onChange={addEditSportsAttributeFormik.handleChange} 
            />

          </FormGroup>
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
              addEditSportsAttributeFormik.handleSubmit(event);
            }}
            disabled={showApiLoader}
          >
            {attributeId ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditNewAttributeModal;
