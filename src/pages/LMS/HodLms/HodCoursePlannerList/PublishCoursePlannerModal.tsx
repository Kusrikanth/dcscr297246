import { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getAssignLanSectionListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { DateInput } from "../../../../Components/Common";
import { publishDigitalCurriculumAct, saveBuildPublishAct } from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
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

const PublishCoursePlannerModal = (props: any) => {
    
    const dispatch = useAppDispatch();
    const [selectedSections, setSelectedSections] = useState<number[]>([]);
    const selectAllRef = useRef<HTMLInputElement | null>(null);

    const { getAssignLanSectionListResp, getDigitalCurriculumBasicDetailsByIdResp, getDigitalCurriculumListResp } =
        useAppSelector(
            ({ assignLanguages, lmsdigitalcurriculum }) => ({
                getAssignLanSectionListResp: assignLanguages.getAssignLanSectionListResp,
                getDigitalCurriculumBasicDetailsByIdResp: lmsdigitalcurriculum.getDigitalCurriculumBasicDetailsByIdResp,
                getDigitalCurriculumListResp: lmsdigitalcurriculum.getDigitalCurriculumListResp,
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
            const subjectCurriculumId = getDigitalCurriculumListResp?.content?.find((s: any) => +s.id === +props.id)?.buildId;

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
                saveBuildPublishAct(
                    generateActionPayload(
                        "save_build_publish",
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
                    <div className="px-4 pt-3 pb-3 border-bottom mb-3">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="text-muted fs-12">Academic Year</div>
                                <div className="fw-semibold">
                                    {getDigitalCurriculumBasicDetailsByIdResp.academicYearName || "-"}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="text-muted fs-12">Curriculum</div>
                                <div className="fw-semibold">
                                    {getDigitalCurriculumBasicDetailsByIdResp.subjectCurriculumName || "-"}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="text-muted fs-12">Class</div>
                                <div className="fw-semibold">
                                    {getDigitalCurriculumBasicDetailsByIdResp.className || "-"}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="text-muted fs-12">Created By</div>
                                <div className="fw-semibold">
                                    {getDigitalCurriculumBasicDetailsByIdResp.createdByName || "-"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="px-4">
                    <div className="d-flex align-items-end justify-content-between gap-2 flex-wrap mb-2">
                        <div>
                            <div className="d-flex align-items-center gap-2">
                                <h6 className="card-title mb-0">Select Sections</h6>
                                <div className="text-muted fs-12 mt-1">
                                    Selected: <span className="fw-semibold">{selectedSections.length} Sections</span>
                                </div>

                            </div>
                            <div className="text-muted fs-12 mt-1">
                                Select individual sections or use “All Sections”.
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <div className="form-check m-0">
                                <input
                                    ref={selectAllRef}
                                    className="form-check-input"
                                    type="checkbox"
                                    id="checkall"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                />
                                <label className="form-check-label fw-semibold" htmlFor="checkall">
                                    All Sections
                                </label>
                            </div>
                            {selectedSections.length > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => setSelectedSections([])}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="tw-border tw-rounded-lg tw-px-2 tw-py-3">
                        <div className="tw-rounded-lg tw-bg-white tw-p-2 tw-max-h-[360px] tw-overflow-auto">
                            <div className="row g-3">
                                {sections.map((section: any) => {
                                    const checked = selectedSections.includes(section.sectionId);
                                    return (
                                        <div key={section.sectionId} className="col-12 col-md-6">
                                            <label
                                                htmlFor={`section-${section.sectionId}`}
                                                className={[
                                                    "tw-w-full tw-rounded-lg tw-border tw-bg-white tw-p-3 tw-flex tw-items-start tw-gap-2 tw-cursor-pointer",
                                                    "tw-transition tw-duration-150 tw-ease-out",
                                                    "hover:tw-shadow-[0_10px_22px_rgba(0,0,0,0.06)] hover:tw--translate-y-[1px] hover:tw-border-blue-200",
                                                    checked ? "tw-bg-blue-50 tw-border-blue-400" : "tw-border-slate-200",
                                                ].join(" ")}
                                            >
                                                <input
                                                    className="form-check-input tw-mt-1"
                                                    type="checkbox"
                                                    id={`section-${section.sectionId}`}
                                                    checked={checked}
                                                    onChange={() => handleSectionToggle(section.sectionId)}
                                                />
                                                <div className="tw-min-w-0">
                                                    <div className="tw-font-semibold tw-truncate">{section.sectionName}</div>
                                                    <div className="tw-text-slate-500 tw-text-[10px] tw-mt-1">
                                                        ({section.className})
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 mt-3">
                    <div className="border rounded-10 p-3 pb-1" style={{ borderRadius: "10px" }}>
                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <DateInput
                                    name="effectiveFrom"
                                    labelText="Effective From"
                                    labelClass="required"
                                    value={publishDigitalCurriculumModalForm.values.effectiveFrom}
                                    onChange={publishDigitalCurriculumModalForm.handleChange}
                                    minDate={Current_Date_YYYYMMDD}
                                    invalid={
                                        publishDigitalCurriculumModalForm.touched.effectiveFrom &&
                                            publishDigitalCurriculumModalForm.errors.effectiveFrom
                                            ? true
                                            : false
                                    }
                                    error={
                                        publishDigitalCurriculumModalForm.touched.effectiveFrom &&
                                            publishDigitalCurriculumModalForm.errors.effectiveFrom
                                            ? (publishDigitalCurriculumModalForm.errors.effectiveFrom as any)
                                            : ""
                                    }
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <DateInput
                                    name="effectiveTo"
                                    labelText="Effective To"
                                    labelClass="required"
                                    value={publishDigitalCurriculumModalForm.values.effectiveTo}
                                    onChange={publishDigitalCurriculumModalForm.handleChange}
                                    minDate={Current_Date_YYYYMMDD}
                                    invalid={
                                        publishDigitalCurriculumModalForm.touched.effectiveTo && publishDigitalCurriculumModalForm.errors.effectiveTo
                                            ? true
                                            : false
                                    }
                                    error={
                                        publishDigitalCurriculumModalForm.touched.effectiveTo && publishDigitalCurriculumModalForm.errors.effectiveTo
                                            ? (publishDigitalCurriculumModalForm.errors.effectiveTo as any)
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

export default PublishCoursePlannerModal;
