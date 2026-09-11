import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { Suspense, useEffect, useMemo } from "react";
import { DateInput, QuillEditor, SelectInput } from "../../../../Components/Common";
import { useFormik } from "formik";
import * as Yup from "yup";
import DefaultStudentImage from "../../../../assets/imagesdps/student-default-img.png";
import { Current_Date, getDateWithTimeFormat } from "../../../../utility/dateutility";
import { getApplicationRemarksStatusAct, saveApplicationRemarksById } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    remarks: "",
    nextRemarkActionDate: "",
    statusId: "",
};

const stripHtml = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html || "";
    return temp.textContent?.trim() || "";
};

const validationSchema = Yup.object({
    remarks: Yup.string()
        .test("not-empty-html", "Description is required.", (value) => {
            return !!stripHtml(value || "");
        })
        .required("Description is required."),
    nextRemarkActionDate: Yup.date().required("Select Next Action Date."),
    statusId: Yup.date().required("Select Status."),
});

const ReviewRemarksModal = (props: any) => {
    const dispatch = useAppDispatch();

    const { applicationRemarksByIdResp, getApplicationRemarksStatusResp } = useAppSelector(
        ({ applicationSale }) => ({
            applicationRemarksByIdResp: applicationSale.applicationRemarksByIdResp,
            getApplicationRemarksStatusResp: applicationSale.getApplicationRemarksStatusResp,
        }),
        shallowEqual
    );

    useEffect(() => {
        if (applicationRemarksByIdResp) {
            const latestRemark =
                applicationRemarksByIdResp?.remarks?.[0];

            reviewRemarksForm.setValues({
                remarks: "",
                nextRemarkActionDate:
                    applicationRemarksByIdResp?.nextRemarkActionDate
                        ? applicationRemarksByIdResp.nextRemarkActionDate.split("T")[0]
                        : "",
                statusId: latestRemark?.statusId
                    ? String(latestRemark.statusId)
                    : "",
            });
        }
    }, [applicationRemarksByIdResp]);

    useEffect(() => {
        const payload = {
            feeFollowUpCategory: "ADMISSIONS"
        }
        dispatch(
            getApplicationRemarksStatusAct(
                generateActionPayload(
                    "get_application_remarks_stauts",
                    undefined,
                    payload
                )
            )
        );
    }, []);

    const saleData = applicationRemarksByIdResp;
    const remarksList = saleData?.remarks || [];

    const applicationInfo = useMemo(
        () => [
            ["Application Number", saleData?.applicationNumber || "N/A"],
            ["Contact Person Name", saleData?.contactPersonaName || "N/A"],
            ["Student Name", saleData?.studentName || "N/A"],
            ["Curriculum", saleData?.curriculumName || "N/A"],
            ["Class", saleData?.admissionClassName || "N/A"],
        ],
        [saleData]
    );

    const screenMap: Record<string, string> = {
        applicationSale: "APPLICATION_SALE",
        registration: "REGISTRATION",
        interviewResult: "INTERVIEW_RESULT",
    };

    const reviewRemarksForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            const screen = screenMap[props?.tabId] || "APPLICATION_SALE";
            const selectedStatus = getApplicationRemarksStatusResp?.find(
                (item: any) => Number(item.id) === Number(values.statusId)
            );

            const payload = {
                remarks: values.remarks,
                nextRemarkActionDate: values.nextRemarkActionDate,
                statusId: values.statusId,
                statusName: selectedStatus?.status || "",
                screen,
            };

            dispatch(
                saveApplicationRemarksById(
                    generateActionPayload(
                        "save_application_remarks_by_id",
                        { applicationSaleId: saleData?.applicationSaleId },
                        payload
                    )
                )
            );
        },
    });

    const onChangeQuillHndlr = (content: string) => {
        reviewRemarksForm.setFieldValue("remarks", content);
        reviewRemarksForm.setFieldTouched("remarks", true, false);
    };

    const isCommentEmpty = !stripHtml(reviewRemarksForm.values.remarks) || !reviewRemarksForm.values.nextRemarkActionDate;

    return (
        <>
            <div className="tw-p-5 tw-max-w-full tw-overflow-x-hidden">
                <div className="tw-p-4 tw-pt-0 tw-pb-2">
                    <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-4 lg:tw-gap-x-8 lg:tw-gap-y-4">
                        {applicationInfo.map(([label, value]) => (
                            <div
                                key={label}
                                className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-[140px_minmax(0,1fr)] lg:tw-grid-cols-[160px_minmax(0,1fr)] tw-gap-1 sm:tw-gap-2 tw-min-w-0"
                            >
                                <p className="tw-mb-0 tw-font-medium tw-text-gray-600">{label} :</p>
                                <p className="tw-mb-0 tw-text-gray-900 tw-break-words [overflow-wrap:anywhere]">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="tw-p-4 tw-pt-2">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                        <div className="tw-col-span-12 lg:tw-col-span-7 tw-min-w-0">
                            <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-h-full tw-flex tw-flex-col tw-min-w-0">
                                <div className="tw-border-b tw-p-4">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">Conversations</h4>
                                </div>
                                <div className="tw-h-[325px] tw-overflow-y-auto tw-overflow-x-hidden tw-px-3 tw-my-3">
                                    {remarksList.length > 0 ? (
                                        remarksList.map((item: any) => (
                                            <div
                                                className="tw-py-4 tw-border-b last:tw-border-b-0 tw-min-w-0"
                                                key={item?.id || `${item?.employeeName}-${item?.createdAt}`}
                                            >
                                                <div className="tw-flex tw-items-start tw-gap-3 tw-mb-3 tw-min-w-0">
                                                    <img
                                                        src={item?.imageUrl || DefaultStudentImage}
                                                        alt={item?.employeeName || "user"}
                                                        className="tw-rounded-full tw-w-10 tw-h-10 tw-object-cover tw-shrink-0"
                                                    />
                                                    <div className="tw-min-w-0 tw-flex-1">
                                                        <h4 className="tw-text-base tw-font-semibold tw-mb-1 tw-truncate">
                                                            {item?.employeeName || "User"}
                                                        </h4>
                                                        <p className="tw-text-xs tw-text-gray-500 tw-mb-0">
                                                            {item?.createdAt
                                                                ? `Created At ${getDateWithTimeFormat(`${item?.createdAt}Z`)}`
                                                                : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    className="tw-text-sm tw-min-w-0 [&_*]:tw-max-w-full [&_*]:tw-break-words [&_*]:[overflow-wrap:anywhere] [&_p]:tw-m-0 [&_ol]:tw-pl-5 [&_ul]:tw-pl-5 [&_li]:tw-mb-1"
                                                    dangerouslySetInnerHTML={{ __html: item?.remarks || "-" }}
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
                                        value={reviewRemarksForm.values.remarks}
                                        onChange={onChangeQuillHndlr}
                                        invalid={
                                            !!(
                                                reviewRemarksForm.touched.remarks &&
                                                reviewRemarksForm.errors.remarks
                                            )
                                        }
                                        error={
                                            reviewRemarksForm.touched.remarks &&
                                                reviewRemarksForm.errors.remarks
                                                ? reviewRemarksForm.errors.remarks
                                                : ""
                                        }
                                        labelText="Remarks"
                                        labelClass="required tw-font-semibold"
                                        formgroupClassName="mb-0"
                                    />
                                </Suspense>
                                <div className="tw-pt-6">
                                    <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-end">

                                        {/* Date Input */}
                                        <div className="tw-col-span-6">
                                            <DateInput
                                                name="nextRemarkActionDate"
                                                labelText="Next Action Date"
                                                labelClass="required"
                                                value={reviewRemarksForm.values.nextRemarkActionDate}
                                                onChange={reviewRemarksForm.handleChange}
                                                minDate={Current_Date}
                                                invalid={
                                                    !!(
                                                        reviewRemarksForm.touched.nextRemarkActionDate &&
                                                        reviewRemarksForm.errors.nextRemarkActionDate
                                                    )
                                                }
                                                error={
                                                    reviewRemarksForm.touched.nextRemarkActionDate &&
                                                        reviewRemarksForm.errors.nextRemarkActionDate
                                                        ? reviewRemarksForm.errors.nextRemarkActionDate
                                                        : ""
                                                }
                                            />
                                        </div>
                                        {props.tabId === "applicationSale" && (
                                            <div className="tw-col-span-6">
                                                <SelectInput
                                                    name="statusId"
                                                    value={reviewRemarksForm.values.statusId}
                                                    onChange={reviewRemarksForm.handleChange}
                                                    onBlur={reviewRemarksForm.handleBlur}
                                                    menuItems={getApplicationRemarksStatusResp || []}
                                                    valueKey="id"
                                                    textKey="status"
                                                    labelClass='required'
                                                    labelText='Status'
                                                    isDisabled={props.applicationId}
                                                    invalid={reviewRemarksForm.touched.statusId &&
                                                        reviewRemarksForm.errors.statusId
                                                        ? true
                                                        : false}
                                                    error={reviewRemarksForm.touched.statusId &&
                                                        reviewRemarksForm.errors.statusId
                                                        ? reviewRemarksForm.errors.statusId
                                                        : ""}
                                                />
                                            </div>
                                        )}
                                        <div
                                            className={
                                                props.tabId === "applicationSale"
                                                    ? "tw-col-span-7"
                                                    : "tw-col-span-1"
                                            }
                                        ></div>
                                        <div className="tw-col-span-5 tw-flex tw-items-center tw-justify-end tw-gap-2 tw-h-full">

                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={props.toggle}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                onClick={reviewRemarksForm.submitForm}
                                                disabled={isCommentEmpty}
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
        </>
    );
};

export default ReviewRemarksModal;