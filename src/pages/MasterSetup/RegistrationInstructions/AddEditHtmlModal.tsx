import React, { Suspense, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CustomTipTapEditor, QuillEditor } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { saveRegistrationInstructionAct, setResetRegistrationInstructionHtmlByIdAct, updateRegistrationInstructionAct } from "../../../store/FrontDesk/RegistrationInstruction/registrationinstructionaction";

interface IAddEditHtmlModal {
  values: any;
  toggle: any;
  instituteId: any;
  branchId: any;
  curriculumId: any;
}

const initialValues = {
  description: "",
};

const validationSchema = Yup.object().shape({
  description:  Yup.mixed().test(
    "required-doc",
    "Description is required",
    (val) => {
      if (!val) return false;
      if (typeof val === "string") return val.trim().length > 0;
      if (typeof val === "object") {
        return !!val.content && val.content.length > 0;
      }
      return false;
    }
  ),
});

const AddEditHtmlModal = (props: IAddEditHtmlModal) => {

  const dispatch = useAppDispatch();
  
  const [isUserSubmitted, setIsUserSubmitted] = React.useState(false);
  const [htmlContent, setHtmlContent] = React.useState("");

  const htmlFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (!isUserSubmitted) {
        return;
      }

      const payload = {
        instituteId: props.values.instituteId,
        branchId: props.values.branchId,
        curriculumId: props.values.curriculumId,
      }
      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append("content", htmlContent);

      const formData = new FormData();
      formData.append("content", htmlContent);
      
      if (props.values && props.values !== null && props.values.length > 0) {
        dispatch(updateRegistrationInstructionAct(generateActionPayload("update_registration_instruction", { id: props.values }, urlEncodedData)));
      } else {
        dispatch(saveRegistrationInstructionAct(generateActionPayload("save_registration_instruction", {instituteId: props.instituteId, branchId: props.branchId, curriculumId: props.curriculumId}, formData)));
      }
      
      setIsUserSubmitted(false);
    },
  });

  const { getRegistrationInstructionHtmlByIdResp } = useAppSelector(({ registrationInstruction }) => ({
    getRegistrationInstructionHtmlByIdResp: registrationInstruction.getRegistrationInstructionHtmlByIdResp
}), shallowEqual);

  useEffect(() => {
    if (getRegistrationInstructionHtmlByIdResp) {
      htmlFormik.setFieldValue("description", getRegistrationInstructionHtmlByIdResp || "");
    }
  }, [getRegistrationInstructionHtmlByIdResp]);

  const onChangeQuillHndlr = React.useCallback((content: any) => {
    htmlFormik.setFieldValue("description", content, false);
  }, [htmlFormik, props.values]);

  useEffect(() => {
return () => 
    
    {  dispatch(setResetRegistrationInstructionHtmlByIdAct(undefined));
    }  
  }, []);

  const handleSubmit = () => {
    setIsUserSubmitted(true);
    htmlFormik.submitForm();
  };

  return (
    <>
      <div className="col-12 !tw-px-4 !tw-pt-4 !tw-pb-0 add-edit-html-modal">
        <CustomTipTapEditor 
          name="description"
          value={htmlFormik.values.description}
          onChange={onChangeQuillHndlr}
          onHTMLChange={setHtmlContent}
          // invalid={(htmlFormik.touched.description && htmlFormik.errors.description) ? true : false}
          error={(htmlFormik.touched.description && htmlFormik.errors.description) ? htmlFormik.errors.description : ""}
          formgroupClassName="mt-0"
          isStaticOptionsRequired={true}
        />
      </div>
      <div className="px-4 pb-3 hstack gap-2 justify-content-end mt-3">
        <button
          type="button"
          className="btn btn-light"
          onClick={props.toggle}
        >
          Cancel
        </button>
        <button 
          type="button" 
          className="btn btn-success px-4"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default AddEditHtmlModal;
