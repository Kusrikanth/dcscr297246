import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { SelectInput, TextInput } from "../../../../../Components/Common";
import { Input, FormGroup, Label } from "reactstrap";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import * as Yup from "yup";
import React, { useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";

const AddEditMarkingRulesModal = (props: any) => {
  return (
    <>
      <div className="modal-body p-3">
        <form>
          <div className="row">
            <div className="col-12">
              <TextInput
                name="questionType"
                value={""}
                onChange={() => {}}
                labelText="Question Type"
              ></TextInput>
            </div>
            <div className="col-12">
              <TextInput
                name="marks"
                value={""}
                onChange={() => {}}
                labelText="Marks"
              ></TextInput>
            </div>
            <div className="col-12">
              <SelectInput
                name="partialAllowed"
                value=""
                onChange={() => {}}
                menuItems={[]}
                valueKey=""
                textKey=""
                labelText="Partial Allowed"
              ></SelectInput>
            </div>
          </div>

          <div className="hstack gap-2 justify-content-end mt-4 mb-1 pt-3 pb-0">
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
              onClick={() => {}}
            >
              {props.id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEditMarkingRulesModal;
