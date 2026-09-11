import React, { useRef, useState, useEffect, useMemo } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import { SelectInput, TextInput } from "../../../../Components/Common";
import {   selectData6, selectData7, } from "./helper";
import { IAssignLanguageProps } from "./AssignLanguageTypes";

const initialValues = {
  search: "",
  class: "",
  section: "",
  secondLanguage: "",
  thirdLanguage: "",
};

const AssignLanguageModel: React.FC<IAssignLanguageProps> = (props) => {
  const [AssignLanguage, setAssignLanguage] = useState(initialValues);

  const AssignLanguageFormik = useFormik({
    enableReinitialize: true,
    initialValues: AssignLanguage,
    onSubmit: (values) => {},
  });

  useEffect(() => {
    if (!props.isOpen) {
      AssignLanguageFormik.resetForm();
    }
  }, [props.isOpen]);


  return (
    <>
      <form>
        <div className="row px-4">
          <div className="row g-3">
          <div className="col-12">
            <TextInput
                  name="search"
                  formgroupClassName="mb-0"
                  value={AssignLanguageFormik.values.search}
                  onChange={AssignLanguageFormik.handleChange}
                  labelText="Search"
                />
            </div>
            <div className="col-12 col-md-6">
              <TextInput
                name="class"
                labelText="Class"
                value={AssignLanguageFormik.values.class}
                onChange={AssignLanguageFormik.handleChange}
                formgroupClassName="mb-0"
                isReadOnly={true}
              />
            </div>
            <div className="col-12 col-md-6">
              <TextInput
                name="section"
                labelText="Section"
                value={AssignLanguageFormik.values.section}
                onChange={AssignLanguageFormik.handleChange}
                formgroupClassName="mb-0"
                isReadOnly={true}
              />
            </div>

            <div className="col-12 col-md-12">
              <SelectInput
                name="secondLanguage"
                labelText="Second Language"
                value={AssignLanguageFormik.values.secondLanguage}
                onChange={AssignLanguageFormik.handleChange}
                menuItems={selectData6}
                valueKey="languageIIType"
                textKey="languageIIType"
                formgroupClassName="mb-0"
              />
            </div>
            <div className="col-12 col-md-12">
              <SelectInput
                name="thirdLanguage"
                labelText="Second Language"
                value={AssignLanguageFormik.values.thirdLanguage}
                onChange={AssignLanguageFormik.handleChange}
                menuItems={selectData7}
                valueKey="languageIIIType"
                textKey="languageIIIType"
                formgroupClassName="mb-0"
              />
            </div>
          </div>
        </div>
        <tr style={{ color: "#38414A26" }} />
        <div className="row">
          <div className="d-flex gap-2 w-auto ms-auto mx-4 my-3">
            <button
              type="button"
              className={"btn btn-light"}
              onClick={props.toggle}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-success
                `}
              onClick={(event: any) => AssignLanguageFormik.handleSubmit(event)}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AssignLanguageModel;
