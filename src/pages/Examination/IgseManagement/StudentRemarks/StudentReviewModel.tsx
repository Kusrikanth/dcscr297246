import React, { useRef, useState, useEffect, useMemo } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import { SelectInput, TextInput } from "../../../../Components/Common";
import { addStuAttData, addStuAttGenerateColumns, selectData3, selectData4, } from "./helper";
import { IAssignLanguageProps } from "./StudentReviesTypes";
import TableContainer from "../../../../Components/Common/TableContainer";

const initialValues = {
  year: "",
  term: "",
  class: "",
  section: "",
  order: "",
  secondLanguage: "",
  thirdLanguage: "",
};

const StudentReviewModel: React.FC<IAssignLanguageProps> = (props) => {
  const [StudentReview, setStudentReview] = useState(initialValues);

  const StudentReviewFormik = useFormik({
    enableReinitialize: true,
    initialValues: StudentReview,
    onSubmit: (values) => {},
  });

  useEffect(() => {
    if (!props.isOpen) {
      StudentReviewFormik.resetForm();
    }
  }, [props.isOpen]);

  const roleColumns = useMemo(() => addStuAttGenerateColumns(), []);

  return (
    <>
      <form>
        <div className="row px-4">
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-3">
              <SelectInput
                name="class"
                labelText="Class"
                value={StudentReviewFormik.values.class}
                onChange={StudentReviewFormik.handleChange}
                menuItems={selectData3}
                valueKey="classType"
                textKey="classType"
                labelClass="fw-bold"
                formgroupClassName="mb-0"
              />
            </div>
            <div className="col-12 col-md-3">
              <SelectInput
                name="section"
                labelText="Section"
                value={StudentReviewFormik.values.section}
                onChange={StudentReviewFormik.handleChange}
                menuItems={selectData4}
                valueKey="sectionType"
                textKey="sectionType"
                labelClass="fw-bold"
                formgroupClassName="mb-0"
              />
            </div>
            <div className="col-12 col-md-3">
              <SelectInput
                name="term"
                labelText="Term Name"
                value={StudentReviewFormik.values.term}
                onChange={StudentReviewFormik.handleChange}
                menuItems={selectData4}
                valueKey="termType"
                textKey="termType"
                labelClass="fw-bold"
                formgroupClassName="mb-0 "
              />
            </div>
          </div>
        </div>
        <TableContainer
          columns={roleColumns || []}
          data={addStuAttData || []}
          divClass="table-responsive "
          theadClass="table-light text-muted align-middle"
        />
        <tr style={{ color: "#38414A26" }} />
        <div className="row">
          <div className="d-flex gap-2 w-auto ms-auto mx-4 my-3">
            <button
              type="button"
              className={"btn btn-light"}
            >
              Reset
            </button>
            <button
              type="button"
              className={`btn btn-success
                `}
              onClick={(event: any) => StudentReviewFormik.handleSubmit(event)}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default StudentReviewModel;
