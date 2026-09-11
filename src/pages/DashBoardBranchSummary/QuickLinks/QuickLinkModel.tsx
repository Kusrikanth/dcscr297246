import { useFormik } from "formik";
import * as Yup from "yup";
import { SelectInput, TextInput } from "../../../Components/Common";
import { selectData1} from "./helper";
import { useAppDispatch } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { saveQuickLinkAct } from "../../../store/academic/academicRequest/academicrequestactions";
import Button from "../../../Components/Common/Button";

const initialValues = {
  link: "",
  name: "",
  linkType: "EXTERNAL",
  linkColor: "",
  iconType: "",
  moduleName: "",
  featureName: "",
};

const validationSchema = Yup.object().shape({
  linkType: Yup.string().required("Link Type is required."),
  link: Yup.string().required("Link is required."),
  name: Yup.string().required("Link Title is required."),
  moduleName: Yup.string().required("Module Name is required."),
});

const QuickLinkModel = (props: any) => {
  const dispatch = useAppDispatch();

  const addQuickLinkDetailsForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      const payload = { 
        featureName: values.name,
        linkType: values.linkType,
        featureLink: values.link,
        moduleName: values.moduleName,
       };
      dispatch(saveQuickLinkAct(generateActionPayload("save_quick_link", undefined, payload)));
      
    },
  });

  return (
    <>
      <form onSubmit={addQuickLinkDetailsForm.handleSubmit}>
        <div className="tw-p-3">

          <div className="tw-flex tw-flex-wrap tw--mx-2">

            <div className="tw-w-full md:tw-w-1/2 tw-px-2"></div>

            <div className="tw-w-full tw-px-2">
              <SelectInput
                name="linkType"
                value={addQuickLinkDetailsForm.values.linkType}
                onChange={addQuickLinkDetailsForm.handleChange}
                menuItems={selectData1}
                valueKey="linkType"
                textKey="linkType"
                labelText="Link Type"
                labelClass="required"
                defaultSelect="EXTERNAL"
                defaultValue="EXTERNAL"
                invalid={
                  addQuickLinkDetailsForm.touched.linkType &&
                    addQuickLinkDetailsForm.errors.linkType
                    ? true
                    : false
                }
                error={
                  addQuickLinkDetailsForm.touched.linkType &&
                    addQuickLinkDetailsForm.errors.linkType
                    ? addQuickLinkDetailsForm.errors.linkType
                    : ""
                }
              />
            </div>

            <div className="tw-w-full tw-px-2">
              <TextInput
                name="name"
                labelText="Link Title"
                labelClass="required"
                value={addQuickLinkDetailsForm.values.name}
                onChange={addQuickLinkDetailsForm.handleChange}
                onBlur={addQuickLinkDetailsForm.handleBlur}
                invalid={
                  addQuickLinkDetailsForm.touched.name &&
                    addQuickLinkDetailsForm.errors.name
                    ? true
                    : false
                }
                error={
                  addQuickLinkDetailsForm.touched.name &&
                    addQuickLinkDetailsForm.errors.name
                    ? addQuickLinkDetailsForm.errors.name
                    : ""
                }
              />
            </div>

            <div className="tw-w-full tw-px-2">
              <TextInput
                name="moduleName"
                labelText="Module Name"
                labelClass="required"
                value={addQuickLinkDetailsForm.values.moduleName}
                onChange={addQuickLinkDetailsForm.handleChange}
                onBlur={addQuickLinkDetailsForm.handleBlur}
                invalid={
                  addQuickLinkDetailsForm.touched.moduleName &&
                    addQuickLinkDetailsForm.errors.moduleName
                    ? true
                    : false
                }
                error={
                  addQuickLinkDetailsForm.touched.moduleName &&
                    addQuickLinkDetailsForm.errors.moduleName
                    ? addQuickLinkDetailsForm.errors.moduleName
                    : ""
                }
              />
            </div>

            <div className="tw-w-full tw-px-2">
              <TextInput
                name="link"
                labelText={
                  addQuickLinkDetailsForm.values.linkType === "INTERNAL"
                    ? "Internal Link"
                    : "External Link"
                }
                labelClass="required"
                value={addQuickLinkDetailsForm.values.link}
                onChange={addQuickLinkDetailsForm.handleChange}
                invalid={
                  addQuickLinkDetailsForm.touched.link &&
                    addQuickLinkDetailsForm.errors.link
                    ? true
                    : false
                }
                error={
                  addQuickLinkDetailsForm.touched.link &&
                    addQuickLinkDetailsForm.errors.link
                    ? addQuickLinkDetailsForm.errors.link
                    : ""
                }
              />
            </div>

          </div>

          <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-4 tw-mb-1">
            <Button
              type="button"
              variant="secondary"
              onClick={props.toggle}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              onClick={(event: any) => {
                addQuickLinkDetailsForm.handleSubmit(event);
              }}
            >
              {props.id ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default QuickLinkModel;
