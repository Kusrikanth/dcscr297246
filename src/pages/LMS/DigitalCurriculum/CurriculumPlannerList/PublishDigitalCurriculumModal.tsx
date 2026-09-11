import { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getAssignLanSectionListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { DateInput } from "../../../../Components/Common";
import { publishDigitalCurriculumAct } from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { toast } from "react-toastify";
import { Current_Date_YYYYMMDD } from "../../../../utility/dateutility";

const initialValues = {
    effectiveFrom: "",
    effectiveTo: "",
};

const validationSchema = Yup.object({
    effectiveFrom: Yup.string().required("From is required."),
    effectiveTo: Yup.string()
        .required("To is required.")
        .test(
            "is-after",
            "Effective To must be after Effective From",
            function (value) {
                const { effectiveFrom } = this.parent;
                return !effectiveFrom || !value || value >= effectiveFrom;
            }
        ),
});

const PublishDigitalCurriculumModal = (props: any) => {
    const dispatch = useAppDispatch();
    const [selectedSections, setSelectedSections] = useState<number[]>([]);
    const selectAllRef = useRef<HTMLInputElement | null>(null);

    const { getAssignLanSectionListResp, getDigitalCurriculumBasicDetailsByIdResp } =
        useAppSelector(
            ({ assignLanguages, lmsdigitalcurriculum }) => ({
                getAssignLanSectionListResp: assignLanguages.getAssignLanSectionListResp,
                getDigitalCurriculumBasicDetailsByIdResp: lmsdigitalcurriculum.getDigitalCurriculumBasicDetailsByIdResp,
            }),
            shallowEqual
        );

    useEffect(() => {
        if (!getDigitalCurriculumBasicDetailsByIdResp?.academicYearId || !getDigitalCurriculumBasicDetailsByIdResp?.classId || !getDigitalCurriculumBasicDetailsByIdResp?.curriculumId) { return; }
        const payload = {
            branchClassId: getDigitalCurriculumBasicDetailsByIdResp.classId,
            masterAcademicYearId: getDigitalCurriculumBasicDetailsByIdResp.academicYearId,
            curriculumId: getDigitalCurriculumBasicDetailsByIdResp.curriculumId,
            sortBy: "sectionName",
            orderBy: "asc",
            pageNo: 0,
            pageSize: 20,
        };
        dispatch(
            getAssignLanSectionListAct(
                generateActionPayload("get_section_list", undefined, payload)
            )
        );
    }, [dispatch, getDigitalCurriculumBasicDetailsByIdResp?.academicYearId, getDigitalCurriculumBasicDetailsByIdResp?.classId, getDigitalCurriculumBasicDetailsByIdResp?.curriculumId]);

    const sections = getAssignLanSectionListResp?.data ?? [];

    const handleSectionToggle = (sectionId: number) => {
        setSelectedSections((prev) =>
            prev.includes(sectionId)
                ? prev.filter((id) => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const isAllSelected = sections.length > 0 && selectedSections.length === sections.length;
    const isIndeterminate =
        sections.length > 0 && selectedSections.length > 0 && !isAllSelected;

    useEffect(() => {
        if (selectAllRef.current) selectAllRef.current.indeterminate = isIndeterminate;
    }, [isIndeterminate]);

    const handleSelectAll = () => {
        setSelectedSections(isAllSelected ? [] : sections.map((s: any) => s.sectionId));
    };

    const publishDigitalCurriculumModalForm = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: () => {
            if (!selectedSections.length) {
                toast.error("Please select at least one section");
                return;
            }
            const subjectCurriculumId =
                getDigitalCurriculumBasicDetailsByIdResp?.id;

            if (!subjectCurriculumId) {
                toast.error("Unable to publish curriculum. Please try again.");
                return;
            }

            const payload = {
                sections: sections
                    .filter((s: any) => selectedSections.includes(s.sectionId))
                    .map((s: any) => ({
                        sectionId: s.sectionId,
                        sectionName: s.sectionName,
                    })),
                effectiveStartDate: publishDigitalCurriculumModalForm.values.effectiveFrom,
                effectiveEndDate: publishDigitalCurriculumModalForm.values.effectiveTo,
            };

            dispatch(
                publishDigitalCurriculumAct(
                    generateActionPayload(
                        "publish_digital_curriculum",
                        { subjectCurriculumId },
                        payload
                    )
                )
            );
        },
    });

    return (
        <>
            <form onSubmit={publishDigitalCurriculumModalForm.handleSubmit}>
                {getDigitalCurriculumBasicDetailsByIdResp && (
                    <div className="tw-px-4 tw-pt-3 tw-pb-3 tw-border-b tw-mb-3">
                        <div className="tw-grid tw-grid-cols-10 tw-gap-4">
                            <div className="tw-col-span-10 md:tw-col-span-5">
                                <div className="tw-text-slate-500 tw-text-xs">Academic Year</div>
                                <div className="tw-font-semibold">
                                    {getDigitalCurriculumBasicDetailsByIdResp.academicYearName || "-"}
                                </div>
                            </div>
                            <div className="tw-col-span-10 md:tw-col-span-5">
                                <div className="tw-text-slate-500 tw-text-xs">Curriculum</div>
                                <div className="tw-font-semibold">
                                    {getDigitalCurriculumBasicDetailsByIdResp.subjectCurriculumName || "-"}
                                </div>
                            </div>
                            <div className="tw-col-span-10 md:tw-col-span-5">
                                <div className="tw-text-slate-500 tw-text-xs">Class</div>
                                <div className="tw-font-semibold">
                                    {getDigitalCurriculumBasicDetailsByIdResp.className || "-"}
                                </div>
                            </div>
                            <div className="tw-col-span-10 md:tw-col-span-5">
                                <div className="tw-text-slate-500 tw-text-xs">Created By</div>
                                <div className="tw-font-semibold">
                                    {getDigitalCurriculumBasicDetailsByIdResp.createdByName || "-"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="tw-px-4">
                    <div className="tw-flex tw-flex-wrap tw-items-end tw-justify-between tw-gap-3 tw-mb-2">
                        <div>
                            <div className="tw-flex tw-items-center tw-gap-2">
                                <h6 className="tw-font-semibold tw-mb-0">Select Sections</h6>
                                <div className="tw-text-xs tw-text-slate-500">
                                    Selected:
                                    <span className="tw-font-semibold">
                                        {" "}{selectedSections.length} Sections
                                    </span>
                                </div>
                            </div>
                            <div className="tw-text-xs tw-text-slate-500 tw-mt-1">
                                Select individual sections or use “All Sections”.
                            </div>
                        </div>
                        <div className="tw-flex tw-items-center tw-gap-2">
                            <label className="tw-flex tw-items-center tw-gap-2 tw-cursor-pointer">
                                <input
                                    ref={selectAllRef}
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                    className="tw-h-4 tw-w-4"
                                />
                                <span className="tw-font-semibold">All Sections</span>
                            </label>
                            {selectedSections.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedSections([])}
                                    className="tw-text-sm tw-border tw-border-slate-300 tw-rounded-md tw-px-3 tw-py-1 hover:tw-bg-slate-50"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="tw-border tw-rounded-lg tw-p-3">
                        <div className="tw-bg-white tw-rounded-lg tw-p-2 tw-max-h-[360px] tw-overflow-auto">
                            <div className="tw-grid tw-grid-cols-10 tw-gap-4">
                                {sections.map((section: any) => {
                                    const checked = selectedSections.includes(section.sectionId);
                                    return (
                                        <label
                                            key={section.sectionId}
                                            htmlFor={`section-${section.sectionId}`}
                                            className={[
                                                "tw-col-span-10 md:tw-col-span-5",
                                                "tw-rounded-lg tw-border tw-bg-white tw-p-3 tw-flex tw-items-start tw-gap-2 tw-cursor-pointer",
                                                "tw-transition tw-duration-150",
                                                "hover:tw-shadow-[0_10px_22px_rgba(0,0,0,0.06)] hover:tw--translate-y-[1px]",
                                                checked
                                                    ? "tw-bg-blue-50 tw-border-blue-400"
                                                    : "tw-border-slate-200",
                                            ].join(" ")}
                                        >
                                            <input
                                                type="checkbox"
                                                id={`section-${section.sectionId}`}
                                                checked={checked}
                                                onChange={() => handleSectionToggle(section.sectionId)}
                                                className="tw-mt-1"
                                            />
                                            <div className="tw-min-w-0">
                                                <div className="tw-font-semibold tw-truncate">
                                                    {section.sectionName}
                                                </div>
                                                <div className="tw-text-[10px] tw-text-slate-500 tw-mt-1">
                                                    ({section.className})
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tw-px-4 tw-mt-3">
                    <div className="tw-border tw-rounded-xl tw-p-4">
                        <div className="tw-grid tw-grid-cols-10 tw-gap-4">
                            <div className="tw-col-span-10 md:tw-col-span-5">
                                <DateInput
                                    name="effectiveFrom"
                                    labelText="Effective From"
                                    labelClass="required"
                                    value={publishDigitalCurriculumModalForm.values.effectiveFrom}
                                    onChange={publishDigitalCurriculumModalForm.handleChange}
                                    minDate={Current_Date_YYYYMMDD}
                                    invalid={
                                        !!(
                                            publishDigitalCurriculumModalForm.touched.effectiveFrom &&
                                            publishDigitalCurriculumModalForm.errors.effectiveFrom
                                        )
                                    }
                                    error={
                                        publishDigitalCurriculumModalForm.touched.effectiveFrom &&
                                            publishDigitalCurriculumModalForm.errors.effectiveFrom
                                            ? publishDigitalCurriculumModalForm.errors.effectiveFrom
                                            : ""
                                    }
                                />
                            </div>
                            <div className="tw-col-span-10 md:tw-col-span-5">
                                <DateInput
                                    name="effectiveTo"
                                    labelText="Effective To"
                                    labelClass="required"
                                    value={publishDigitalCurriculumModalForm.values.effectiveTo}
                                    onChange={publishDigitalCurriculumModalForm.handleChange}
                                    minDate={Current_Date_YYYYMMDD}
                                    invalid={
                                        !!(
                                            publishDigitalCurriculumModalForm.touched.effectiveTo &&
                                            publishDigitalCurriculumModalForm.errors.effectiveTo
                                        )
                                    }
                                    error={
                                        publishDigitalCurriculumModalForm.touched.effectiveTo &&
                                            publishDigitalCurriculumModalForm.errors.effectiveTo
                                            ? publishDigitalCurriculumModalForm.errors.effectiveTo
                                            : ""
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tw-flex tw-justify-between tw-items-center tw-mt-4 tw-mb-5 tw-px-4">
                    <button
                        type="button"
                        onClick={props.toggle}
                        className="tw-flex tw-items-center tw-gap-2 tw-border tw-border-slate-300 tw-rounded-lg tw-px-4 tw-py-2 tw-bg-white hover:tw-bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!selectedSections.length}
                        className="tw-flex tw-items-center tw-gap-2 tw-rounded-lg tw-px-5 tw-py-2 tw-bg-[#0ab39c] tw-text-white hover:tw-opacity-90 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                    >
                        Publish
                    </button>
                </div>
            </form>
        </>
    );
};

export default PublishDigitalCurriculumModal;
