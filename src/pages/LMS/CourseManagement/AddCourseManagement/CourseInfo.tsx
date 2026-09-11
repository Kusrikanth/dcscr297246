import { useEffect, useRef, useState } from "react";
import { useModal } from "../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useFormik } from "formik";
import { shallowEqual } from "react-redux";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { default as MathsSVG } from "../../../../assets/imagesdps/lms/maths.svg?react";
import { CustomTipTapEditor, ModalContainerUpdated, MultiSelect, SelectInput, TextArea, TextInput } from "../../../../Components/Common";
import ThumbnailColorSelector from "./ThumbnailColorSelector";

const initialValues = {
    academicYearId: "",
    classId: "",
    curriculumId: "",
    description: "",
    subject: "",
    title: "",
};

const CourseInfo = () => {
    const [thumbnailColor, setThumbnailColor] = useState("#E2E8F0"); // default bg-slate-200

    const {
        openModal: addOpenThumbNailModal,
        closeModal: addCloseThumbNailModal,
        modalState: addThumbNailModalState,
    } = useModal();
    const classApiCalled = useRef(false);
    const dispatch = useAppDispatch();
    const signatureForm = useFormik({
        enableReinitialize: true,
        initialValues,
        onSubmit: (values) => { },
    });
    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
    } = useAppSelector(
        ({ instAcademics, globalData, branchAcademics, appData }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,

        }),
        shallowEqual
    );
    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { instituteId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    function getClassApiCall(curriculumId: string, academicYearId?: string) {
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId, academicYearId: academicYearId || signatureForm.values.academicYearId };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    useEffect(() => {
        let yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
        if (yearId) {
            signatureForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
            const payload1 = {
                academicYearId: yearId,
                branchId: branchId,
                pageNo: 0,
                pageSize: 100,
                sortBy: "curriculumName",
                orderBy: "asc",
            };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
            classApiCalled.current = false;
        }
    }, [academicYearListResp]);
    useEffect(() => {
        const { curriculumId } = signatureForm.values;
        if (curriculumId) {
            getClassApiCall(curriculumId);
        }
    }, [signatureForm.values.curriculumId]);
    const onChangeQuillHndlr = (content: any) => {
        signatureForm.setValues((prevState: any) => ({ ...prevState, description: content }));
    }
    const subjectList = [
        { id: '3week', name: '2 Weeks' },
        { id: '4week', name: '3 Weeks' },
        { id: '5week', name: '4 Weeks' },
    ]
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};

    return (
        <>
            <div className="tw-rounded tw-overflow-hidden course">
                <div
                    className="tw-h-[128px] tw-relative tw-mb-12 tw-transition-colors tw-duration-300"
                    style={{ backgroundColor: thumbnailColor }}
                >
                    <div className="tw-h-[68px] tw-w-[68px] tw-rounded tw-bg-white tw-px-3 tw-py-2 tw-border tw-absolute tw-bottom-[0px] tw-transform tw-translate-y-1/2 tw-translate-x-[24px]">
                        <MathsSVG />
                    </div>
                    <div>
                        <button
                            className="tw-flex tw-items-center tw-text-sm tw-text-gray-700 tw-bg-white tw-px-3 tw-py-1.5 tw-rounded-md hover:tw-text-primary hover:tw-bg-gray-100 tw-transition-colors tw-duration-200 tw-absolute tw-bottom-[12px] tw-right-[22px]"
                            onClick={addOpenThumbNailModal}
                        >
                            Upload Thumbnail
                        </button>
                    </div>
                </div>
                <div className="tw-pb-4">
                    <div className="pt-2">
                        <h4 className="tw-mb-0 fs-16">
                            Course Info
                        </h4>
                    </div>
                    <div className="pt-2 pb-3 mb-2">
                        <h4 className="tw-mb-0 fs-14 text-muted fw-medium">
                            Add or update course title, summary, subject, and metadata.
                        </h4>
                    </div>
                    <div>
                        <div className="row align-items-center">
                            <div className="col-12 col-md-12 mb-3">
                                <TextInput
                                    name="title"
                                    value={signatureForm.values.title}
                                    onChange={signatureForm.handleChange}
                                    labelText="Course Title"
                                    floatingLabel
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <SelectInput
                                    name="academicYearId"
                                    value={signatureForm.values.academicYearId}
                                    onChange={signatureForm.handleChange}
                                    menuItems={academicYearList}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    isDisabled={true}
                                    labelText="Academic Year"
                                    floatingLabel
                                />
                            </div>
                            <div className="col-12 col-md-4 ">
                                <SelectInput
                                    name="curriculumId"
                                    value={signatureForm.values.curriculumId}
                                    onChange={signatureForm.handleChange}
                                    menuItems={curriculumTypes}
                                    valueKey="branchCurriculumId"
                                    textKey="curriculumName"
                                    labelText="Curriculum"
                                    floatingLabel
                                />
                            </div>
                            <div className="col-12 col-md-4 ">
                                <SelectInput
                                    name="curriculumId"
                                    value={signatureForm.values.curriculumId}
                                    onChange={signatureForm.handleChange}
                                    menuItems={classTypes}
                                    valueKey="id"
                                    textKey="shortName"
                                    labelText="Class"
                                    floatingLabel
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <MultiSelect
                                    name="category"
                                    onChange={() => { }}
                                    value={""}
                                    valueKey=""
                                    textKey=""
                                    menuItems={[]}
                                    labelText="Sections"
                                />
                            </div>
                            <div className="col-12 col-md-4 ">
                                <SelectInput
                                    name="subject"
                                    labelClass="required"
                                    value={signatureForm.values.subject}
                                    onChange={signatureForm.handleChange}
                                    menuItems={subjectList}
                                    valueKey="id"
                                    textKey="name"
                                    labelText="Subject"
                                    floatingLabel
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <SelectInput
                                    name="subject"
                                    labelClass="required"
                                    value={signatureForm.values.subject}
                                    onChange={signatureForm.handleChange}
                                    menuItems={subjectList}
                                    valueKey="id"
                                    textKey="name"
                                    labelText="Course Type"
                                    floatingLabel
                                />
                            </div>
                            {/* <div className="col-12 col-md-4">
                                <MultiSelect
                                    name="category"
                                    onChange={() => { }}
                                    value={""}
                                    valueKey=""
                                    textKey=""
                                    menuItems={[]}
                                    labelText="Assign Teachers"
                                />
                            </div> */}
                            <div className="col-12 d-flex align-items-center">
                                <h4 className="fs-14 mb-2 fw-normal">
                                    Course Description
                                </h4>
                            </div>
                            <div className="col-12 col-md-12">
                                <CustomTipTapEditor
                                    name="description"
                                    value={signatureForm.values.description}
                                    onChange={onChangeQuillHndlr}
                                    placeHolder="Enter Your Question"
                                />
                            </div>
                        </div>
                        <div className="row mt-3 pt-3">
                            <div className="col-12 text-center mt-2">
                                <button className='btn btn-light fs-12 px-5' >Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary mx-2 fs-12 px-5"
                                // onClick={previousBtnHndlr}

                                >
                                    Save as Draft
                                </button>

                                <button type="button" className="btn btn-success fs-12 px-5" >
                                    Next
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="thumbanail-modal"
                isOpen={addThumbNailModalState.showModal}
                toggle={addCloseThumbNailModal}
                modalTitle="Thumbnail"
                modalSize="md"
            >
                <ThumbnailColorSelector selectedColor={thumbnailColor} onSelectColor={setThumbnailColor} />
            </ModalContainerUpdated>

        </>
    );
};

export default CourseInfo;
