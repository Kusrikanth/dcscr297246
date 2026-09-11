import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useState, useRef, useEffect } from "react";
import { SelectInput, TextInput } from "../../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { generateUniqueNumber } from "../../../../../utility/commonutility";

const initialValues = {
  mainAttributeId: "",
  sportsId: "",
  classId: "",
  subAttributes: [
    {
      id: generateUniqueNumber(),
      subAttribute: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  subAttributes: Yup.array().of(
    Yup.object().shape({
      subAttribute: Yup.string()
        .required("Sub Attribute is required")
        .nullable(),
    })
  ),
});

const AddEditGradeEntryModal = ({ isOpen, toggle }) => {
  const [formState, setFormState] = useState(initialValues);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: formState,
    validationSchema,
    onSubmit: (values) => {
      console.log("Form submitted", values);
    },
  });

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  function addNewSubAttribute() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: generateUniqueNumber(),
        subAttribute: "",
      });
    }
  }

  function removeSubAttribute(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  useEffect(() => {
    if (isOpen) {
      setFormState(initialValues);
    }
  }, [isOpen]);

  return (
    <div style={{ padding: "1.25rem" }}>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-12 col-lg-4">
              <SelectInput
                name="Main Attribute"
                value={formik.values.sportsId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                menuItems={[]}
                valueKey=""
                textKey=""
                labelText="Main Attribute"
                labelClass="required"
              />
            </div>
            <div className="col-12 col-lg-4">
              <SelectInput
                name="gameSkillAttribute"
                value={formik.values.mainAttributeId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                menuItems={[]}
                valueKey="id"
                textKey="name"
                labelText="Game Skill Attribute"
                labelClass="required"
              />
            </div>

            <div className="col-12 col-lg-4">
              <SelectInput
                name="grade"
                value={formik.values.classId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                menuItems={[]}
                valueKey=""
                textKey=""
                labelText="Grade"
                labelClass="required"
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="d-flex ms-auto w-auto">
              <button
                type="button"
                className="btn btn-light me-3"
                onClick={toggle}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </div>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default AddEditGradeEntryModal;
