import { useFormik } from "formik";
import { DateInput, MultipleFileUpload, QuillEditor, SelectInput, TextInput } from "../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { Suspense, useEffect, useRef, useState } from "react";
import * as Yup from 'yup';
import { generateActionPayload } from "../../utility/reduxutility";
import { addConcernsFeedbackListAct } from "../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction";
import { toast } from "react-toastify";
import { Label } from "reactstrap";
import Button from "../../Components/Common/Button";

const initialValues = {
  subject: "",
  description: "",
  priority: "",
  categories: "NON_ACADEMIC",
  departmentId: "",
  departmentName: "",
  requestType: "",
  targetDate: "",
  document: [],
};

const HelpDeskConcernFloatingModal = (props: any) => {
  const [document, setDocument] = useState<any>([]);
  const dispatch = useAppDispatch()

  const {
    academicYearListResp,
    getComplaintDepartmentListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    concernsFeedbackErrResp,
    addConcernsFeedbackListResp,
    loggedInUserRole,
  } =
    useAppSelector(({ appData, directoryEmployee, directoryStudent, instAcademics, globalData, concernsFeedback, complaintDepartment, login, instituteInfo }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getComplaintDepartmentListResp: complaintDepartment.getComplaintDepartmentListResp,
      showApiLoader: globalData.showApiLoader,
      loggedInUserRole: appData.loggedInUserRole,
      concernsFeedbackErrResp: concernsFeedback.concernsFeedbackErrResp,
      addConcernsFeedbackListResp: concernsFeedback.addConcernsFeedbackListResp,
    }), shallowEqual);


  const isInstituteAdmin =
    loggedInUserRole === "INSTITUTE_ADMIN" ||
    loggedInUserRole === "BRANCH_ADMIN";


  const addConcernFeedbackRef = useRef({
    prevConcernsFeedbackErrResp: concernsFeedbackErrResp,
    prevAddConcernsFeedbackListResp: addConcernsFeedbackListResp,
  });

  useEffect(() => {
    const { prevConcernsFeedbackErrResp, prevAddConcernsFeedbackListResp } = addConcernFeedbackRef.current;
    if (addConcernsFeedbackListResp && addConcernsFeedbackListResp !== prevAddConcernsFeedbackListResp) {
      toast.success("Complaint Created Successfully");
      props.toggle()
    }
    else if (concernsFeedbackErrResp && concernsFeedbackErrResp !== prevConcernsFeedbackErrResp) {
      const { details }: any = concernsFeedbackErrResp;
      toast.error(details || "Something went wrong.");
    }

    addConcernFeedbackRef.current.prevAddConcernsFeedbackListResp = addConcernsFeedbackListResp;
    addConcernFeedbackRef.current.prevConcernsFeedbackErrResp = concernsFeedbackErrResp;

  }, [concernsFeedbackErrResp, addConcernsFeedbackListResp,]);

  const validationSchema = Yup.object().shape({
    subject: Yup.string().required("Subject is required."),
    description: Yup.string().required("Description is required."),
  });

  const addConcernFeedbackForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const currentYear =
        academicYearListResp?.data?.find(
          (y: any) => y.yearStatus?.toLowerCase() === "current"
        );

      const payload = {
        branchId,
        academicYearId: currentYear?.academicYearId,
        subject: values.subject,
        description: values.description,
        source: "WEB",
        issueType: "reportIssue",
        complaintUserType:
          loggedInUserRole === "PARENT_ROLE" ? "PARENT" : "EMPLOYEE",

        ...(isInstituteAdmin && {
          priority: values.priority,
          requestType: values.requestType,
          // targetDate: values.targetDate,
        }),
      };

      const formData = new FormData();
      formData.append("request", JSON.stringify(payload));
      if (values.document?.length > 0) {
        values.document.forEach((file: File) => {
          formData.append("multipartFile", file);
        });
      }
      dispatch(addConcernsFeedbackListAct(generateActionPayload("add_concern_feedback_list", undefined, formData)));
    }
  });

  useEffect(() => {
    const departments = getComplaintDepartmentListResp?.data;

    if (departments?.length) {
      const defaultDept = departments.find(
        (d: any) => d.departmentName === "APPLICATION SUPPORT"
      );

      if (defaultDept) {
        addConcernFeedbackForm.setValues((prev: any) => ({
          ...prev,
          departmentId: defaultDept.id,
          departmentName: defaultDept.departmentName,
        }));
      }
    }
  }, [getComplaintDepartmentListResp]);

  const onChangeQuillHndlr = (content: any) => {
    addConcernFeedbackForm.setValues((prevState: any) => ({ ...prevState, description: content }));
  }

  const onChangeFilterHndlr = (event: any) => {
    const { name, value } = event.target;

    if (name === "departmentId") {
      const dept = getComplaintDepartmentListResp?.data?.find(
        (d: any) => d.id === Number(value)
      );

      addConcernFeedbackForm.setValues((prev: any) => ({
        ...prev,
        departmentId: value,
        departmentName: dept?.departmentName || "",
      }));
      return;
    }

    addConcernFeedbackForm.setFieldValue(name, value);
  };

  const priorityOptions = [
    {
      id: "LOW",
      name: "LOW"
    },
    {
      id: "MEDIUM",
      name: "MEDIUM"
    },
    {
      id: "HIGH",
      name: "HIGH"
    },
    {
      id: "CRITICAL",
      name: "CRITICAL"
    },

  ]

  const requestType = [
    {
      reqType: "BUG_ISSUE",
      name: "Bug Issue"
    },
    {
      reqType: "CHANGE_REQUEST",
      name: "Change Request"
    },
    {
      reqType: "NEW_IMPLEMENTATION",
      name: "New Implementation"
    },
    {
      reqType: "SUPPORT_REQUEST",
      name: "Support Request"
    },
    {
      reqType: "CLARIFICATION",
      name: "Clarification"
    },
    {
      reqType: "DATA_REQUEST",
      name: "Data Request"
    },
  ]

  const handleFileChange = (files: any) => {
    setDocument(files);
    addConcernFeedbackForm.setFieldValue('document', files);
  }

  return (
    <div className="tw-p-3">
      <form onSubmit={addConcernFeedbackForm.handleSubmit}>
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4">
          <div className="md:tw-col-span-8">
            <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "10px", marginTop: "20px" }}>
              <p className='tw-text-sm' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Concern Details</p>
              <div className="tw-space-y-4">
                <div>
                  <div className="tw-flex tw-items-center tw-gap-1 tw-mb-1">
                    <Label className="required !tw-mb-0" htmlFor="subject">
                      Subject
                    </Label>
                    <span className="tw-text-xs tw-text-red-500">
                      ( Only related to the Digital caampus software related queries )
                    </span>
                  </div>
                  <TextInput
                    name="subject"
                    value={addConcernFeedbackForm.values.subject}
                    onChange={onChangeFilterHndlr}
                    invalid={(addConcernFeedbackForm.touched.subject && addConcernFeedbackForm.errors.subject) ? true : false}
                    error={(addConcernFeedbackForm.touched.subject && addConcernFeedbackForm.errors.subject) ? addConcernFeedbackForm.errors.subject : ""}
                    maxLength={50}
                    placeHolder="Enter Subject"
                  />
                </div>
                <div>
                   <Suspense fallback={<div className="tw-text-sm tw-text-gray-400">Loading editor...</div>}>
                    <QuillEditor
                      name="description"
                      value={addConcernFeedbackForm.values.description}
                      onChange={onChangeQuillHndlr}
                      invalid={
                        addConcernFeedbackForm.touched.description &&
                        !!addConcernFeedbackForm.errors.description
                      }
                      error={
                        addConcernFeedbackForm.touched.description &&
                        addConcernFeedbackForm.errors.description
                      }
                      labelText="Description"
                      labelClass="required"
                    />
                  </Suspense>
                </div>
                {isInstituteAdmin && (
                  <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
                    <SelectInput
                      name="priority"
                      value={addConcernFeedbackForm.values.priority}
                      onChange={onChangeFilterHndlr}
                      menuItems={priorityOptions || []}
                      valueKey="id"
                      textKey="name"
                      formgroupClassName="tw-mb-0"
                      labelText="Priority"
                      defaultSelect="Select"
                    />
                    <SelectInput
                      name="requestType"
                      value={addConcernFeedbackForm.values.requestType}
                      onChange={addConcernFeedbackForm.handleChange}
                      menuItems={requestType || []}
                      valueKey="reqType"
                      textKey="name"
                      formgroupClassName="tw-mb-0"
                      labelText="Request Type"
                      defaultSelect="Select"
                    />
                    <DateInput
                      name="targetDate"
                      formgroupClassName="tw-mb-0"
                      labelText="Target Date"
                      value={addConcernFeedbackForm.values.targetDate}
                      onChange={addConcernFeedbackForm.handleChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="md:tw-col-span-4">
            <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "10px", marginTop: "20px" }}>
              <p className='tw-text-sm' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}> Attached files</p>

              <div className="tw-space-y-4 tw-pt-2">
                <div className="tw-text-sm tw-text-gray-500">
                  Add Attached files here.
                </div>
                <MultipleFileUpload
                  name="document"
                  prevFiles={document}
                  onChange={handleFileChange}
                  containerClass="tw-w-full"
                  maxSizeInMb={2}
                  helperText="Note: Max file size is 2MB"
                  invalid={(addConcernFeedbackForm.touched.document && addConcernFeedbackForm.errors.document) ? true : false}
                  error={(addConcernFeedbackForm.touched.document && addConcernFeedbackForm.errors.document) ? addConcernFeedbackForm.errors.document : ""}
                   />

              </div>
            </div>
          </div>
        </div>
        <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-4 tw-mb-3 tw-px-3">
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
            onClick={(event: any) =>
              addConcernFeedbackForm.handleSubmit(event)
            }
            disabled={showApiLoader}
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HelpDeskConcernFloatingModal;
