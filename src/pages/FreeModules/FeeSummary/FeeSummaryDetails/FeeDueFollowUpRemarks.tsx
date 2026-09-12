import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { ChangeEvent, Suspense, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { DateInput, InputCheckboxUpdated, QuillEditor, SelectInput } from "../../../../Components/Common";
import { useFormik } from "formik";
import * as Yup from "yup";
import DefaultStudentImage from "../../../../assets/imagesdps/student-default-img.png";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { Current_Date, getDateWithTimeFormat } from "../../../../utility/dateutility";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import Button from "../../../../Components/Common/Button";
import { getByIdFeeDueFollowUpRemarksAct, getChronicParentTypesListAct, saveFeeDueFollowUpRemarksAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { sampleChronicParentTypes, USE_SAMPLE_CHRONIC_PARENT_TYPES } from "../../ChronicParentType/helper";
import { getApplicationRemarksStatusAct } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";

interface ISiblingFeeDue {
    studentId: string | number | undefined;
    academicYearId: string | number | undefined;
    studentName: string;
    dueAmount: number;
}

// TODO: remove once the fee-remarks follow-up APIs (status list, get-by-id) are reliable on the backend.
// Lets this modal be reviewed without a live backend, and demos the sibling due-amount UI.
export const USE_SAMPLE_FEE_DUE_FOLLOW_UP = true;

const sampleApplicationRemarksStatusList: Array<{ id: number; status: string }> = [
    { id: 1, status: "Promised to Pay" },
    { id: 2, status: "Not Reachable" },
    { id: 3, status: "Requested Time" },
    { id: 4, status: "Disputed" },
    { id: 5, status: "Paid" },
    { id: 6, status: "Cheque Bounced" },
];

const sampleFeeDueFollowUpDetails = {
    studentCode: "1260072",
    contactPersonName: "re",
    studentName: "eewW",
    curriculum: "CBSE",
    className: "II",
    fatherContact: "9343434324",
    motherContact: "N/A",
    nextRemarkActionDate: "",
    isChronicParent: false,
    chronicParentTypeId: "",
    remarks: [
        {
            id: 1,
            employeeName: "User",
            createdAt: "2026-09-12T11:40:00",
            statusId: 1,
            remarks: "<p>Spoke with the parent, payment expected by next week.</p>",
        },
    ],
    siblingDetails: [
        { studentId: 65999, studentName: "Aarav Sharma", dueAmount: 12500 },
        { studentId: 66000, studentName: "Diya Sharma", dueAmount: 4300 },
    ],
};

const initialValues = {
    remarks: "",
    nextRemarkActionDate: "",
    statusId: "",
    isChronicParent: false,
    chronicParentTypeId: "",
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
    isChronicParent: Yup.boolean(),
    chronicParentTypeId: Yup.string().when("isChronicParent", {
        is: true,
        then: (schema) => schema.required("Select Chronic Parent Type."),
        otherwise: (schema) => schema.notRequired(),
    }),
});

const FeeDueFollowUpRemarks = (props: any) => {
    const dispatch = useAppDispatch();
    const history = useHistory();

    const { getByIdFeeDueFollowUpRemarksResp, getApplicationRemarksStatusResp, getChronicParentTypesListResp, branchId } = useAppSelector(
        ({ feeCollections, applicationSale, appData }) => ({
            getByIdFeeDueFollowUpRemarksResp: feeCollections.getByIdFeeDueFollowUpRemarksResp,
            getApplicationRemarksStatusResp: applicationSale.getApplicationRemarksStatusResp,
            getChronicParentTypesListResp: feeCollections.getChronicParentTypesListResp,
            branchId: appData.currentBranchIdResp,
        }),
        shallowEqual
    );

    const chronicParentTypes = useMemo(() => {
        const apiList = getChronicParentTypesListResp?.data;
        if (Array.isArray(apiList) && apiList.length > 0) return apiList;
        return USE_SAMPLE_CHRONIC_PARENT_TYPES ? sampleChronicParentTypes : [];
    }, [getChronicParentTypesListResp]);

    const applicationRemarksStatusList = useMemo(() => {
        if (Array.isArray(getApplicationRemarksStatusResp) && getApplicationRemarksStatusResp.length > 0) {
            return getApplicationRemarksStatusResp;
        }
        return USE_SAMPLE_FEE_DUE_FOLLOW_UP ? sampleApplicationRemarksStatusList : [];
    }, [getApplicationRemarksStatusResp]);

    const saleData = useMemo(() => {
        if (getByIdFeeDueFollowUpRemarksResp) return getByIdFeeDueFollowUpRemarksResp;
        return USE_SAMPLE_FEE_DUE_FOLLOW_UP ? sampleFeeDueFollowUpDetails : undefined;
    }, [getByIdFeeDueFollowUpRemarksResp]);

    useEffect(() => {
        dispatch(
            getChronicParentTypesListAct(
                generateActionPayload("get_chronic_parent_types_list", undefined, { branchId, pageNo: 0, pageSize: 100, sortBy: "createdAt", orderBy: "desc" })
            )
        );
    }, [branchId]);

    useEffect(() => {
        if (saleData) {
            const latestRemark = saleData?.remarks?.[0];

            reviewRemarksForm.setValues({
                remarks: "",
                nextRemarkActionDate:
                    saleData?.nextRemarkActionDate
                        ? saleData.nextRemarkActionDate.split("T")[0]
                        : "",
                statusId: latestRemark?.statusId
                ? String(latestRemark.statusId)
                : "",
                isChronicParent: !!saleData?.isChronicParent,
                chronicParentTypeId: saleData?.chronicParentTypeId
                    ? String(saleData.chronicParentTypeId)
                    : "",
            });
        }
    }, [saleData]);

    useEffect(() => {
        const payload = {
            feeFollowUpCategory: "FEE"
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

    useEffect(() => {
        if (props?.studentId && props?.academicYearId) {
            const payload = {
                studentId: props.studentId,
                academicYearId: props.academicYearId,
            };
            dispatch(
                getByIdFeeDueFollowUpRemarksAct(
                    generateActionPayload(
                        "get_by_id_fee_due_follow_up_remarks",
                        undefined,
                        payload
                    )
                )
            );
        }
    }, [props?.studentId, props?.academicYearId]);

    const remarksList = saleData?.remarks || [];

    const siblingDetails = useMemo((): ISiblingFeeDue[] => {
        const realSiblings = saleData?.siblingDetails || saleData?.siblingFeeDueDetails || [];
        // The backend doesn't return sibling due-amount data yet on any student, real or sample.
        // Fall back to sample siblings here too so this UI can be reviewed/demoed regardless.
        const siblings = Array.isArray(realSiblings) && realSiblings.length > 0
            ? realSiblings
            : (USE_SAMPLE_FEE_DUE_FOLLOW_UP ? sampleFeeDueFollowUpDetails.siblingDetails : []);
        if (!Array.isArray(siblings)) return [];
        return siblings.map((sibling: Record<string, unknown>) => ({
            studentId: (sibling?.studentId ?? sibling?.siblingStudentId ?? sibling?.id) as string | number | undefined,
            academicYearId: (sibling?.academicYearId ?? props.academicYearId) as string | number | undefined,
            studentName: (sibling?.studentName || sibling?.siblingName || "N/A") as string,
            dueAmount: (sibling?.dueAmount ?? sibling?.totalDueAmount ?? sibling?.balanceAmount ?? 0) as number,
        }));
    }, [saleData, props.academicYearId]);

    const onSiblingClickHndlr = (sibling: ISiblingFeeDue) => {
        if (!sibling?.studentId) return;
        props.toggle?.();
        history.push("/student-fee-ledger/fee-details", {
            studentId: sibling.studentId,
            academicYearId: sibling.academicYearId,
        });
    };

    const applicationInfo = useMemo(
        () => [
            ["Student Id", saleData?.studentCode || "N/A"],
            ["Contact Person Name", saleData?.contactPersonName || "N/A"],
            ["Student Name", saleData?.studentName || "N/A"],
            ["Curriculum", saleData?.curriculum || "N/A"],
            ["Class", saleData?.className || "N/A"],
            ["Father Contact", saleData?.fatherContact || "N/A"],
            ["Mother Contact", saleData?.motherContact || "N/A"],
        ],
        [saleData]
    );

    const reviewRemarksForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            const screen = "STUDENT_FEE_LEDGER";
            const params = {
                studentId: props.studentId,
                academicYearId: props.academicYearId,
            };
            const selectedStatus = applicationRemarksStatusList?.find(
                (item: any) => Number(item.id) === Number(values.statusId)
            );
            const selectedChronicType = chronicParentTypes.find(
                (item: any) => String(item.id) === String(values.chronicParentTypeId)
            );
            const payload = {
                remarks: values.remarks,
                nextRemarkActionDate: values.nextRemarkActionDate,
                screen,
                statusId: values.statusId,
                statusName: selectedStatus?.status || "",
                isChronicParent: !!values.isChronicParent,
                chronicParentTypeId: values.isChronicParent ? values.chronicParentTypeId : "",
                chronicParentTypeName: values.isChronicParent ? selectedChronicType?.chronicParentTypeName || "" : "",
            };

            dispatch(
                saveFeeDueFollowUpRemarksAct(
                    generateActionPayload(
                        "save_fee_due_follow_up_remarks",
                        params,
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

    const onChronicParentToggle = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        reviewRemarksForm.setFieldValue("isChronicParent", checked);
        if (!checked) {
            reviewRemarksForm.setFieldValue("chronicParentTypeId", "");
            reviewRemarksForm.setFieldTouched("chronicParentTypeId", false, false);
        }
    };

    const isCommentEmpty = !stripHtml(reviewRemarksForm.values.remarks)
        || !reviewRemarksForm.values.nextRemarkActionDate
        || (reviewRemarksForm.values.isChronicParent && !reviewRemarksForm.values.chronicParentTypeId);

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
                    {siblingDetails.length > 0 && (
                        <div className="tw-mt-4 tw-pt-3 tw-border-t">
                            <p className="tw-mb-2 tw-font-medium tw-text-gray-600">Siblings :</p>
                            <div className="tw-flex tw-flex-wrap tw-gap-2">
                                {siblingDetails.map((sibling: ISiblingFeeDue, index: number) => (
                                    <button
                                        type="button"
                                        key={sibling.studentId || index}
                                        onClick={() => onSiblingClickHndlr(sibling)}
                                        disabled={!sibling.studentId}
                                        title={sibling.studentId ? "View sibling's fee ledger" : ""}
                                        className={`tw-inline-flex tw-items-center tw-gap-1.5 tw-rounded-full tw-border tw-border-gray-300 tw-bg-gray-50 tw-px-3 tw-py-1 tw-text-sm ${sibling.studentId ? "hover:tw-bg-gray-100 tw-cursor-pointer" : "tw-cursor-default"}`}
                                    >
                                        <span className="tw-font-medium tw-text-gray-900">{sibling.studentName}</span>
                                        <span className="tw-text-gray-400">|</span>
                                        <span className="tw-flex tw-items-center tw-gap-0.5 tw-text-gray-700">
                                            <RupeeSvg width="10px" height="10px" fill={"#495057"} />
                                            {getDisplayAmountValue(sibling.dueAmount)}
                                        </span>
                                    </button>
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
                                        <div className="tw-col-span-6">
                                                                                    <SelectInput
                                                                                        name="statusId"
                                                                                        value={reviewRemarksForm.values.statusId}
                                                                                        onChange={reviewRemarksForm.handleChange}
                                                                                        onBlur={reviewRemarksForm.handleBlur}
                                                                                        menuItems={applicationRemarksStatusList}
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
                                        <div className="tw-col-span-6 tw-self-center">
                                            <InputCheckboxUpdated
                                                name="isChronicParent"
                                                labelName="Is Chronic Parent"
                                                value={reviewRemarksForm.values.isChronicParent}
                                                onChange={onChronicParentToggle}
                                                formgroupClassName="tw-mb-0"
                                            />
                                        </div>
                                        <div className="tw-col-span-6">
                                            {reviewRemarksForm.values.isChronicParent && (
                                                <SelectInput
                                                    name="chronicParentTypeId"
                                                    value={reviewRemarksForm.values.chronicParentTypeId}
                                                    onChange={reviewRemarksForm.handleChange}
                                                    onBlur={reviewRemarksForm.handleBlur}
                                                    menuItems={chronicParentTypes}
                                                    valueKey="id"
                                                    textKey="chronicParentTypeName"
                                                    labelClass="required"
                                                    labelText="Chronic Parent Type"
                                                    formgroupClassName="tw-mb-0"
                                                    invalid={!!(reviewRemarksForm.touched.chronicParentTypeId && reviewRemarksForm.errors.chronicParentTypeId)}
                                                    error={reviewRemarksForm.touched.chronicParentTypeId && reviewRemarksForm.errors.chronicParentTypeId
                                                        ? String(reviewRemarksForm.errors.chronicParentTypeId)
                                                        : ""}
                                                />
                                            )}
                                        </div>
                                                                                <div className="tw-col-span-7"></div>
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

export default FeeDueFollowUpRemarks;