import { useFormik } from "formik";
import React, { useEffect } from "react";
import { TextInput } from "../../../../../Components/Common";

interface Props {
  toggle: () => void;
  onSubmit: (unitName: string) => void;
  unitName: string;
}

const AddUnitModel = ({ toggle, onSubmit, unitName }: Props) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      unitName: unitName || "",
    },
    onSubmit: (values) => {
      onSubmit(values.unitName);
    },
  });

  return (
    <div style={{ padding: "1rem" }}>
      <div className="row">
        <div className="col-12">
          <TextInput
            name="unitName"
            labelText="Unit Name"
            formgroupClassName="mb-3"
            value={formik.values.unitName}
            onChange={formik.handleChange}
            placeHolder="Enter Unit Name"
          />
        </div>
      </div>
      <div className="hstack gap-2 justify-content-end mt-4 mb-1">
        <button type="button" className="btn btn-light" onClick={toggle}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => formik.handleSubmit()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddUnitModel;
