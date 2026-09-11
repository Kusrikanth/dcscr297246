import React, { useRef, useState, useEffect, useMemo } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import * as Yup from "yup";
import { SelectInput, TextInput } from "../../../../Components/Common";
import { AoSelectionTableDataI, generateColumnsI, selectData1, selectData2, selectData4, selectData5, selectData6, selectData7, } from "./helper";
import { IChangeAoSelectionProps } from "./AoSelectionTypes";
  import TableContainer from "../../../../Components/Common/TableContainer";

const initialValues = {
  subject: "",
  termName: "",
  section: "",
  class: "",
};

const AoSelection: React.FC<IChangeAoSelectionProps> = (props) => {
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const [changeAoSelection, setChangeAoSelection] =
    useState(initialValues);

  const ChangeAoSelectionFormik = useFormik({
    enableReinitialize: true,
    initialValues: changeAoSelection,
    onSubmit: (values) => {},
  });

  useEffect(() => {
    if (!props.isOpen) {
      ChangeAoSelectionFormik.resetForm();
    }
  }, [props.isOpen, ChangeAoSelectionFormik]);


  const roleColumns = useMemo(() => generateColumnsI(), []);

  return (
    <>
      <form>
      <div className="row px-4">
          <div className="row g-3 mb-3">
            
            <div className="col-xs-12 col-md-3">
              <SelectInput
                 name="class"
                 labelText="Class"
                 value={ChangeAoSelectionFormik.values.class}
                 onChange={ChangeAoSelectionFormik.handleChange}
                 menuItems={selectData2}
                 valueKey="classType"
                 textKey="classType"
                 formgroupClassName="mb-0"
              />
            </div>
            <div className="col-xs-12 col-md-3">
              <SelectInput
                 name="section"
                 labelText="Section"
                 value={ChangeAoSelectionFormik.values.section}
                 onChange={ChangeAoSelectionFormik.handleChange}
                 menuItems={selectData6}
                 valueKey="sectionType"
                 textKey="sectionType"
                 formgroupClassName="mb-0"
              />
            </div>
            <div className="col-xs-12 col-md-3">
              <SelectInput
                name="subject"
                labelText="Subject"
                value={ChangeAoSelectionFormik.values.subject}
                onChange={ChangeAoSelectionFormik.handleChange}
                menuItems={selectData7}
                valueKey="subjectType"
                textKey="subjectType"
                formgroupClassName="mb-0"
              />
            </div>
            <div className="col-xs-12 col-md-3">
            <SelectInput
                name="termName"
                labelText="Term Name"
                value={ChangeAoSelectionFormik.values.termName}
                onChange={ChangeAoSelectionFormik.handleChange}
                menuItems={selectData5}
                valueKey="termType"
                textKey="termType"
                formgroupClassName="mb-0"
              />
            </div>
          </div>
          <TableContainer
          columns={roleColumns || []}
          data={AoSelectionTableDataI}
          showCheckbox={true}
          divClass="table-responsive overflow-auto"
          theadClass="table-light text-muted align-middle"
        />
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
              onClick={(event: any) =>
                ChangeAoSelectionFormik.handleSubmit(event)
              }
            >
              Submit
            </button>
          </div>
        </div>
        </div>
        
      </form>
    </>
  );
};

export default AoSelection;
