import { ChangeEvent, Suspense, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../hooks/storehook";
import { DateInput, InputCheckboxUpdated, MultiSelectCheckbox, QuillEditor, SelectInput } from "../../../Components/Common";
import Button from "../../../Components/Common/Button";
import DefaultStudentImage from "../../../assets/imagesdps/student-default-img.png";
import { Current_Date, getDateWithTimeFormat, getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";
import {
  getTcRetentionFollowUp,
  getTcRetentionMasterLists,
  ITcRetentionFollowUp,
  ITcRetentionMaster,
  ITcRetentionMasterLists,
  ITcRetentionRemark,
  saveTcRetentionFollowUp,
} from "../../../utility/tcretentionutility";
import { sampleTcRetentionDetails, USE_SAMPLE_TC_RETENTION } from "./helper";

interface ITcRetentionSibling {
  studentId?: string | number;
  studentCode?: string;
  studentName: string;
  className?: string;
  sectionName?: string;
}

interface ITcRetentionFollowUpModal {
  tcRecord: any;
  toggle: () => void;
}

const stripHtml = (html: string) => {
  const temp = document.createElement("div");
  temp.innerHTML = html || "";
  return temp.textContent?.trim() || "";
};

const findMaster = (records: Array<ITcRetentionMaster>, id?: string) =>
  records.find((item) => `${item.id}` === `${id}`);

const formatDate = (date?: string) => (date ? getDdMmYyyyWithMonthNameFormat(new Date(date)) : "N/A");

const getValidationSchema = (isClosureStatus: (statusId: string) => boolean) => Yup.object({
  remarks: Yup.string()
    .test("not-empty-html", "Remarks is required.", (value) => !!stripHtml(value || ""))
    .required("Remarks is required."),
  leavingReasons: Yup.array().min(1, "Select Reason for Leaving."),
  retentionStatusId: Yup.string().required("Select Retention Status."),
  nextFollowUpDate: Yup.string().when("retentionStatusId", {
    is: (statusId: string) => !isClosureStatus(statusId),
    then: (schema) => schema.required("Select Next Follow-Up Date."),
    otherwise: (schema) => schema.notRequired(),
  }),
  isRetentionPossible: Yup.boolean(),
  retentionMeasureId: Yup.string().when("isRetentionPossible", {
    is: true,
    then: (schema) => schema.required("Select Retention Offer Type."),
    otherwise: (schema) => schema.notRequired(),
  }),
});

// Selections whose master was deleted in Admissions > Settings are dropped, so they can't be resubmitted.
function getFormValues(masters: ITcRetentionMasterLists, followUp?: ITcRetentionFollowUp) {
  const leavingReasonIds = followUp?.leavingReasonIds || [];
  return {
    remarks: "",
    leavingReasons: masters.leavingReasons.filter((item) => leavingReasonIds.includes(`${item.id}`)),
    retentionStatusId: findMaster(masters.retentionStatuses, followUp?.retentionStatusId)?.id || "",
    nextFollowUpDate: followUp?.nextFollowUpDate || "",
    isRetentionPossible: !!followUp?.isRetentionPossible,
    retentionMeasureId: findMaster(masters.retentionOfferTypes, followUp?.retentionMeasureId)?.id || "",
  };
}

const TcRetentionFollowUpModal: React.FC<ITcRetentionFollowUpModal> = ({ tcRecord, toggle }) => {
  const tcId = `${tcRecord?.tcId}`;
  const [followUp, setFollowUp] = useState(() => getTcRetentionFollowUp(tcId));
  // TODO: fetch these from the TC retention master APIs once they are available.
  const [masters] = useState(getTcRetentionMasterLists);

  const isClosureStatus = (statusId: string) => !!findMaster(masters.retentionStatuses, statusId)?.isClosure;
  const [validationSchema] = useState(() => getValidationSchema(isClosureStatus));

  const { userMeResp }: any = useAppSelector(
    ({ login }) => ({
      userMeResp: login.userMeResp,
    }),
    shallowEqual
  );

  // The TC list doesn't carry parent contacts or siblings yet, so fall back to sample data for review.
  const retentionDetails = useMemo(() => {
    const sample: Partial<typeof sampleTcRetentionDetails> = USE_SAMPLE_TC_RETENTION ? sampleTcRetentionDetails : {};
    return {
      contactPersonName: tcRecord?.contactPersonName || sample.contactPersonName,
      fatherContact: tcRecord?.fatherContact || sample.fatherContact,
      motherContact: tcRecord?.motherContact || sample.motherContact,
      reason: tcRecord?.reason || sample.reason,
      siblingDetails: tcRecord?.siblingDetails?.length ? tcRecord.siblingDetails : sample.siblingDetails || [],
    };
  }, [tcRecord]);

  const studentInfo = useMemo(
    () => [
      ["Student Id", tcRecord?.student?.studentCode || "N/A"],
      ["Student Name", tcRecord?.student?.studentName || "N/A"],
      ["Contact Person Name", retentionDetails.contactPersonName || "N/A"],
      ["Curriculum", tcRecord?.curriculumName || "N/A"],
      ["Class & Section", [tcRecord?.className, tcRecord?.sectionName].filter(Boolean).join(" - ") || "N/A"],
      ["Father Contact", retentionDetails.fatherContact || "N/A"],
      ["TC Application Date", formatDate(tcRecord?.tcApplicationDate)],
      ["Last Attendance Date", formatDate(tcRecord?.lastAttendanceDate)],
      ["Mother Contact", retentionDetails.motherContact || "N/A"],
    ],
    [tcRecord, retentionDetails]
  );

  const remarksList = followUp?.remarks || [];

  const retentionForm = useFormik({
    initialValues: getFormValues(masters, followUp),
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const isClosure = isClosureStatus(values.retentionStatusId);
      const retentionStatus = findMaster(masters.retentionStatuses, values.retentionStatusId);
      const retentionMeasure = findMaster(masters.retentionOfferTypes, values.retentionMeasureId);
      const employeeName = [userMeResp?.firstName, userMeResp?.lastName].filter(Boolean).join(" ").trim();
      const remark: ITcRetentionRemark = {
        id: `${Date.now()}`,
        employeeName: employeeName || "User",
        createdAt: new Date().toISOString(),
        remarks: values.remarks,
        leavingReasonNames: values.leavingReasons.map((item) => item.name),
        retentionStatusName: retentionStatus?.name,
        retentionMeasureName: values.isRetentionPossible ? retentionMeasure?.name : undefined,
      };
      // TODO: dispatch the save TC retention remarks API here once it exists, and refetch the follow-up by tcId.
      const updatedFollowUp = saveTcRetentionFollowUp(
        {
          tcId,
          leavingReasonIds: values.leavingReasons.map((item) => `${item.id}`),
          retentionStatusId: values.retentionStatusId,
          nextFollowUpDate: isClosure ? "" : values.nextFollowUpDate,
          isRetentionPossible: !!values.isRetentionPossible,
          retentionMeasureId: values.isRetentionPossible ? values.retentionMeasureId : "",
        },
        remark
      );
      setFollowUp(updatedFollowUp);
      resetForm({ values: getFormValues(masters, updatedFollowUp) });
      toast.success("Retention remarks saved successfully.");
    },
  });

  const onChangeQuillHndlr = (content: string) => {
    retentionForm.setFieldValue("remarks", content);
    retentionForm.setFieldTouched("remarks", true, false);
  };

  const onLeavingReasonsChange = (selectedReasons: Array<ITcRetentionMaster>) => {
    retentionForm.setFieldValue("leavingReasons", Array.isArray(selectedReasons) ? selectedReasons : []);
    retentionForm.setFieldTouched("leavingReasons", true, false);
  };

  const renderLeavingReasons = (selectedReasons: Array<ITcRetentionMaster>) => (
    <div className="tw-truncate">
      {selectedReasons.map((item) => item.name).join(", ")}
    </div>
  );

  const onRetentionStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    retentionForm.handleChange(event);
    if (isClosureStatus(event.target.value)) {
      retentionForm.setFieldValue("nextFollowUpDate", "");
      retentionForm.setFieldTouched("nextFollowUpDate", false, false);
    }
  };

  const onRetentionPossibleToggle = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    retentionForm.setFieldValue("isRetentionPossible", checked);
    if (!checked) {
      retentionForm.setFieldValue("retentionMeasureId", "");
      retentionForm.setFieldTouched("retentionMeasureId", false, false);
    }
  };

  const { values, touched, errors } = retentionForm;
  const isFollowUpClosed = isClosureStatus(values.retentionStatusId);
  const isSubmitDisabled = !stripHtml(values.remarks)
    || values.leavingReasons.length === 0
    || !values.retentionStatusId
    || (!isFollowUpClosed && !values.nextFollowUpDate)
    || (values.isRetentionPossible && !values.retentionMeasureId);

  return (
    <div className="tw-p-5 tw-max-w-full tw-overflow-x-hidden">
      <div className="tw-p-4 tw-pt-0 tw-pb-2">
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-4 lg:tw-gap-x-8 lg:tw-gap-y-4">
          {studentInfo.map(([label, value]) => (
            <div
              key={label}
              className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-[140px_minmax(0,1fr)] lg:tw-grid-cols-[160px_minmax(0,1fr)] tw-gap-1 sm:tw-gap-2 tw-min-w-0"
            >
              <p className="tw-mb-0 tw-font-medium tw-text-gray-600">{label} :</p>
              <p className="tw-mb-0 tw-text-gray-900 tw-break-words [overflow-wrap:anywhere]">{value}</p>
            </div>
          ))}
        </div>
        {retentionDetails.reason && (
          <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-[140px_minmax(0,1fr)] lg:tw-grid-cols-[160px_minmax(0,1fr)] tw-gap-1 sm:tw-gap-2 tw-min-w-0 tw-mt-4">
            <p className="tw-mb-0 tw-font-medium tw-text-gray-600">TC Request Reason :</p>
            <p className="tw-mb-0 tw-text-gray-900 tw-break-words [overflow-wrap:anywhere]">{retentionDetails.reason}</p>
          </div>
        )}
        {retentionDetails.siblingDetails.length > 0 && (
          <div className="tw-mt-4 tw-pt-3 tw-border-t">
            <p className="tw-mb-2 tw-font-medium tw-text-gray-600">Siblings Studying Here :</p>
            <div className="tw-flex tw-flex-wrap tw-gap-2">
              {retentionDetails.siblingDetails.map((sibling: ITcRetentionSibling, index: number) => (
                <span
                  key={sibling.studentId || index}
                  className="tw-inline-flex tw-items-center tw-gap-1.5 tw-rounded-full tw-border tw-border-gray-300 tw-bg-gray-50 tw-px-3 tw-py-1 tw-text-sm"
                >
                  <span className="tw-font-medium tw-text-gray-900">{sibling.studentName}</span>
                  {sibling.studentCode && <span className="tw-text-gray-600">({sibling.studentCode})</span>}
                  <span className="tw-text-gray-400">|</span>
                  <span className="tw-text-gray-700">
                    {[sibling.className, sibling.sectionName].filter(Boolean).join(" - ") || "N/A"}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="tw-p-4 tw-pt-2">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
          <div className="tw-col-span-12 lg:tw-col-span-7 tw-min-w-0">
            <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-h-full tw-flex tw-flex-col tw-min-w-0">
              <div className="tw-border-b tw-p-4">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">Conversations</h4>
              </div>
              <div className="tw-h-[400px] tw-overflow-y-auto tw-overflow-x-hidden tw-px-3 tw-my-3">
                {remarksList.length > 0 ? (
                  remarksList.map((item: ITcRetentionRemark) => (
                    <div className="tw-py-4 tw-border-b last:tw-border-b-0 tw-min-w-0" key={item.id}>
                      <div className="tw-flex tw-items-start tw-gap-3 tw-mb-3 tw-min-w-0">
                        <img
                          src={DefaultStudentImage}
                          alt={item.employeeName || "user"}
                          className="tw-rounded-full tw-w-10 tw-h-10 tw-object-cover tw-shrink-0"
                        />
                        <div className="tw-min-w-0 tw-flex-1">
                          <h4 className="tw-text-base tw-font-semibold tw-mb-1 tw-truncate">{item.employeeName || "User"}</h4>
                          <p className="tw-text-xs tw-text-gray-500 tw-mb-0">
                            {item.createdAt ? `Created At ${getDateWithTimeFormat(item.createdAt)}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="tw-flex tw-flex-wrap tw-gap-2 tw-mb-2">
                        {[item.retentionStatusName, ...(item.leavingReasonNames || []), item.retentionMeasureName]
                          .filter(Boolean)
                          .map((tag) => (
                            <span key={tag} className="tw-rounded-full tw-bg-gray-100 tw-px-2 tw-py-0.5 tw-text-xs tw-text-gray-700">
                              {tag}
                            </span>
                          ))}
                      </div>
                      <div
                        className="tw-text-sm tw-min-w-0 [&_*]:tw-max-w-full [&_*]:tw-break-words [&_*]:[overflow-wrap:anywhere] [&_p]:tw-m-0 [&_ol]:tw-pl-5 [&_ul]:tw-pl-5 [&_li]:tw-mb-1"
                        dangerouslySetInnerHTML={{ __html: item.remarks || "-" }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="tw-p-4 tw-text-sm tw-text-gray-500">No remarks found</div>
                )}
              </div>
            </div>
          </div>
          <div className="tw-col-span-12 lg:tw-col-span-5 tw-grid admissions tw-min-w-0">
            <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-p-4 tw-h-full tw-min-w-0 tw-overflow-hidden">
              <Suspense fallback={<div>Loading...</div>}>
                <QuillEditor
                  name="remarks"
                  value={values.remarks}
                  onChange={onChangeQuillHndlr}
                  invalid={!!(touched.remarks && errors.remarks)}
                  error={touched.remarks && errors.remarks ? errors.remarks : ""}
                  labelText="Remarks"
                  labelClass="required tw-font-semibold"
                  formgroupClassName="mb-0"
                />
              </Suspense>
              <div className="tw-pt-6">
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-end">
                  <div className="tw-col-span-12">
                    <MultiSelectCheckbox
                      name="leavingReasons"
                      idKey="id"
                      labelText="Reason for Leaving"
                      labelClass="required"
                      value={values.leavingReasons}
                      renderValue={renderLeavingReasons}
                      renderOptions={(item: ITcRetentionMaster) => item.name}
                      onChange={onLeavingReasonsChange}
                      searchKey="name"
                      options={masters.leavingReasons}
                      invalid={!!(touched.leavingReasons && errors.leavingReasons)}
                      error={touched.leavingReasons && errors.leavingReasons ? String(errors.leavingReasons) : ""}
                    />
                  </div>
                  <div className="tw-col-span-6">
                    <DateInput
                      name="nextFollowUpDate"
                      labelText="Next Follow-Up Date"
                      labelClass={isFollowUpClosed ? "" : "required"}
                      value={values.nextFollowUpDate}
                      onChange={retentionForm.handleChange}
                      minDate={Current_Date}
                      isDisabled={isFollowUpClosed}
                      formgroupClassName="tw-mb-0"
                      invalid={!!(touched.nextFollowUpDate && errors.nextFollowUpDate)}
                      error={touched.nextFollowUpDate && errors.nextFollowUpDate ? errors.nextFollowUpDate : ""}
                    />
                  </div>
                  <div className="tw-col-span-6">
                    <SelectInput
                      name="retentionStatusId"
                      value={values.retentionStatusId}
                      onChange={onRetentionStatusChange}
                      onBlur={retentionForm.handleBlur}
                      menuItems={masters.retentionStatuses}
                      valueKey="id"
                      textKey="name"
                      labelClass="required"
                      labelText="Retention Status"
                      formgroupClassName="tw-mb-0"
                      invalid={!!(touched.retentionStatusId && errors.retentionStatusId)}
                      error={touched.retentionStatusId && errors.retentionStatusId ? errors.retentionStatusId : ""}
                    />
                  </div>
                  <div className="tw-col-span-6 tw-self-center">
                    <InputCheckboxUpdated
                      name="isRetentionPossible"
                      labelName="Retention Offer"
                      value={values.isRetentionPossible}
                      onChange={onRetentionPossibleToggle}
                      formgroupClassName="tw-mb-0"
                    />
                  </div>
                  <div className="tw-col-span-6">
                    {values.isRetentionPossible && (
                      <SelectInput
                        name="retentionMeasureId"
                        value={values.retentionMeasureId}
                        onChange={retentionForm.handleChange}
                        onBlur={retentionForm.handleBlur}
                        menuItems={masters.retentionOfferTypes}
                        valueKey="id"
                        textKey="name"
                        labelClass="required"
                        labelText="Retention Offer Type"
                        formgroupClassName="tw-mb-0"
                        invalid={!!(touched.retentionMeasureId && errors.retentionMeasureId)}
                        error={touched.retentionMeasureId && errors.retentionMeasureId ? errors.retentionMeasureId : ""}
                      />
                    )}
                  </div>
                  <div className="tw-col-span-12 tw-flex tw-items-center tw-justify-end tw-gap-2">
                    <Button type="button" variant="secondary" onClick={toggle}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={retentionForm.submitForm}
                      disabled={isSubmitDisabled}
                      className="!tw-px-4"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TcRetentionFollowUpModal;
