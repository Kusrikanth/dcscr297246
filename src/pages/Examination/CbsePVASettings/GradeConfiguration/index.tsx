import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { debounce } from "../../../../utility/commonutility";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useModal } from "../../../../hooks/modalhook";
import { generateColumns } from "./helper";
import { deletePvaGradesAct, getPvaGradesAct, savePvaGradesAct } from "../../../../store/examination/pvaReports/pvaReportsActions";
import { toast } from "react-toastify";
import TableContainer from "../../../../Components/Common/TableContainer";
import { ConfirmationModal, SelectInput, TextInput } from "../../../../Components/Common";
import * as Yup from "yup";

const initialValues = {
    searchString: "",
    academicYearId: "",
    classId: "",
    curriculumId: "",
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required"),
    curriculumId: Yup.string().required("Curriculum is required"),
});

const GradeConfiguration = () => {
    const { closeModal: closeDelPvaGradeModal, modalState: delPvaGradeModalState, openModal: openDelPvaGradeModal } = useModal();
    const [userDataList, setUserDataList] = useState<any>([]);
    const [selectedAboveRowId, setSelectedAboveRowId] = useState<number | null>(null);
    const [selectedBelowRowId, setSelectedBelowRowId] = useState<number | null>(null);

    const dispatch = useAppDispatch();

    const getPvaGradeListApiCall = (otherProps?: any) => {
        const payload = {
            branchId,
            academicYearId: gradeConfigurationForm.values.academicYearId,
            curriculumId: gradeConfigurationForm.values.curriculumId,
            ...otherProps,
        }
        dispatch(getPvaGradesAct(generateActionPayload("get_pva_grades", undefined, payload)));
    }

    function delModalSubmitHndlr() {
        dispatch(deletePvaGradesAct(generateActionPayload("delete_pva_grades", { id: delPvaGradeModalState.modalData })));
    }

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getPvaGradesResp,
        savePvaGradesResp,
        deletePvaGradesResp,
        pvaReportsErrorAct,
    } = useAppSelector(
        ({ instAcademics, globalData, branchAcademics, appData, pvaReports }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getPvaGradesResp: pvaReports.getPvaGradesResp,
            savePvaGradesResp: pvaReports.savePvaGradesResp,
            deletePvaGradesResp: pvaReports.deletePvaGradesResp,
            pvaReportsErrorAct: pvaReports.pvaReportsErrorAct,

        }),
        shallowEqual
    );

    const pvaGradeRef = useRef({
        prevPvaReportsErrorAct: pvaReportsErrorAct,
        prevSavePvaGradesResp: savePvaGradesResp,
        prevDeletePvaGradesResp: deletePvaGradesResp,
        prevGetPvaGradesResp: getPvaGradesResp,
    })

    useEffect(() => {
        const { prevPvaReportsErrorAct, prevSavePvaGradesResp, prevGetPvaGradesResp, prevDeletePvaGradesResp } = pvaGradeRef.current || {}
        if (pvaReportsErrorAct && prevPvaReportsErrorAct !== pvaReportsErrorAct) {
            const { details } = pvaReportsErrorAct || {}
            toast.error(details || "Something went wrong")
        }
        else if (savePvaGradesResp && prevSavePvaGradesResp !== savePvaGradesResp) {
            toast.success("Grade Added successfully")
            getPvaGradeListApiCall();
        }
        else if (deletePvaGradesResp && prevDeletePvaGradesResp !== deletePvaGradesResp) {
            toast.success("Grade Deleted successfully")
            closeDelPvaGradeModal();
            getPvaGradeListApiCall();
        }
        else if (getPvaGradesResp && getPvaGradesResp !== prevGetPvaGradesResp) {
            const mappedData = getPvaGradesResp.map((i: any) => ({ ...i })) || [];
            
            // Find existing Below and Above rows
            const belowRow = mappedData.find((item: any) => item.fromRating === "Below");
            const aboveRow = mappedData.find((item: any) => item.toRating === "Above");
            
            // Set both states and data in a single batch
            setSelectedBelowRowId(belowRow ? belowRow.id : null);
            setSelectedAboveRowId(aboveRow ? aboveRow.id : null);
            setUserDataList(mappedData);
        }

        pvaGradeRef.current.prevPvaReportsErrorAct = pvaReportsErrorAct;
        pvaGradeRef.current.prevSavePvaGradesResp = savePvaGradesResp;
        pvaGradeRef.current.prevGetPvaGradesResp = getPvaGradesResp;
        pvaGradeRef.current.prevDeletePvaGradesResp = deletePvaGradesResp;
    }, [pvaReportsErrorAct, savePvaGradesResp, getPvaGradesResp, deletePvaGradesResp])

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let shortNameToMatch = "";

            if (location.pathname.includes("/cbse-pva-settings/pva-grade-configuration")) {
                shortNameToMatch = "CBSE";
            }
            // else if (location.pathname.includes("/early-years-settings")) {
            //     shortNameToMatch = "EY1-EY3";
            // } else if (location.pathname.includes("/igcse-settings")) {
            //     shortNameToMatch = "IGCSE";
            // }

            const selectedCurriculum = data.find(
                (item) => item.shortName === shortNameToMatch
            );

            if (selectedCurriculum) {
                gradeConfigurationForm.setValues((prev: any) => ({
                    ...prev,
                    curriculumId: selectedCurriculum.branchCurriculumId,
                }));
            }
        }
    }, [brchCurriculumResp, location.pathname]);

    const gradeConfigurationForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => { },
    });

    const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
        const idStr = event.currentTarget.getAttribute("data-id");
        if (!idStr) return;

        const id = Number(idStr);
        const row = userDataList.find(item => item.id === id);

        if (!row) return;

        if (row.isNew) {
            setUserDataList(prevList => prevList.filter(item => item.id !== id));
        } else {
            openDelPvaGradeModal(id);
        }
    };

    const menuOptions = useMemo(
        () => [
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: handleDeleteClick,
            },
        ],
        [userDataList]
    );

    useEffect(() => {
        if (
            academicYearListResp?.data?.length &&
            !gradeConfigurationForm.values.academicYearId
        ) {
            const currentAcademicYear = academicYearListResp.data.find(
                (year: any) => year.yearStatus === "CURRENT"
            );
            if (currentAcademicYear) {
                gradeConfigurationForm.setFieldValue(
                    "academicYearId",
                    currentAcademicYear.academicYearId
                );
            }
        }
    }, [academicYearListResp]);

    useEffect(() => {
        if (gradeConfigurationForm.values.curriculumId) {
            getPvaGradeListApiCall();
        }
    }, [gradeConfigurationForm.values.curriculumId]);

    useEffect(() => {
        const selectedAcademicYearId = gradeConfigurationForm.values.academicYearId;
        if (selectedAcademicYearId) {
            const payload1 = {
                instituteId,
                branchId,
                pageNo: 0,
                pageSize: 100,
                sortBy: "curriculumName",
                orderBy: "asc",
                academicYearId: selectedAcademicYearId,
            };

            dispatch(
                getBranchCurriculumAct(
                    generateActionPayload("get_brch_curriculum", undefined, payload1)
                )
            );

            gradeConfigurationForm.setFieldValue("curriculumId", "");
        }
    }, [gradeConfigurationForm.values.academicYearId]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
            const updatedValues = { ...gradeConfigurationForm.values, [name]: value };
            gradeConfigurationForm.setValues(updatedValues);
    }

    const singleUserDataCheckHndlr = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        const usedDetailsData = event.currentTarget.getAttribute("data-id");
        const userRowIndex = userDataList.findIndex((item: any) => +item.id === Number(usedDetailsData));
        if (userRowIndex > -1) {
            setUserDataList((prevList: any) => {
                const updatedList = [...prevList];
                updatedList[userRowIndex] = { ...updatedList[userRowIndex], isSelected: checked };
                return updatedList;
            });
        }
    }, [userDataList]);

    const onChangeInputHndlr = (id: number, value: any, name: string) => {
        setUserDataList((prevList: any[]) =>
            prevList.map((item) => {
                if (item.id === id) {
                    if (name === "fromRating" || name === "toRating" || name === "label" || name === "grade") {
                        return { ...item, [name]: value };
                    }
                }
                return item;
            })
        );
    };

    const submitHandler = async () => {

    if (!userDataList || userDataList.length === 0) return;

    const errors = await gradeConfigurationForm.validateForm();

    if (Object.keys(errors).length === 0) {
    
    const payload = {
        instituteId,
        branchId,
        academicYearId: gradeConfigurationForm.values.academicYearId,
        curriculumId: gradeConfigurationForm.values.curriculumId,
        grades: userDataList.map((item: any) => ({
            id: item.isNew ? "" : item.id,
            grade: item.grade,
            label: item.label,
            fromRating: item.fromRating === "Below" ? "Below" : item.fromRating,
            fromRatingValue: item.fromRating === "Below" ? "" : item.fromRating,
            toRating: item.toRating === "Above" ? "Above" : item.toRating,
            toRatingValue: item.toRating === "Above" ? "" : item.toRating,
        }))
    };

    dispatch(savePvaGradesAct(generateActionPayload("save_pva_grades", undefined, payload)));
    }
};


    const addNewRowHandler = async() => {
    const errors = await gradeConfigurationForm.validateForm();
    
    if (Object.keys(errors).length > 0) {
        gradeConfigurationForm.setTouched({
            academicYearId: true,
            curriculumId: true,
        });
        return; 
    }
    
    setUserDataList((prevList: any[]) => [
        ...prevList,
        {
            id: Date.now(),
            academicYearId: gradeConfigurationForm.values.academicYearId,
            instituteId,
            branchId,
            curriculumId: gradeConfigurationForm.values.curriculumId,
            grade: "",
            label: "",
            fromRating: "",
            toRating: "",
            isSelected: true,
            isNew: true,
        },
    ]);
};

    const isAnySelected = useMemo(
        () => userDataList.some((item: any) => item.isSelected),
        [userDataList]
    );

    const columns = useMemo(() =>
        generateColumns(singleUserDataCheckHndlr, menuOptions, {
            setSelectedBelowRowId, 
            setSelectedAboveRowId,
            selectedBelowRowId,
            selectedAboveRowId
        }),
        [userDataList, selectedAboveRowId, selectedBelowRowId]
    );
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { data: academicYearList } = academicYearListResp || {};

    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Examination" pageTitle="Examination" />
                    <div className="card">
                        <div className="card-header">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <h4 className="card-title mb-0 flex-grow-1">Grade Configuration</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="row mx-3 pt-3">
                                <div className="col-xs-12 col-md-12 col-lg-3">
                                    <SelectInput
                                        name="academicYearId"
                                        value={gradeConfigurationForm.values.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="mb-0"
                                        labelText='Academic Year'
                                        labelClass="required"
                                        floatingLabel
                                        invalid={(gradeConfigurationForm.touched.academicYearId && gradeConfigurationForm.errors.academicYearId) ? true : false}
                error={(gradeConfigurationForm.touched.academicYearId && gradeConfigurationForm.errors.academicYearId) ? gradeConfigurationForm.errors.academicYearId : ""}
                                    />
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-3">
                                    <SelectInput
                                        name="curriculumId"
                                        value={gradeConfigurationForm.values.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        labelText="Curriculum"
                                        floatingLabel
                                        labelClass="required"
                                        inputClassName=""
                                        invalid={(gradeConfigurationForm.touched.curriculumId && gradeConfigurationForm.errors.curriculumId) ? true : false}
                error={(gradeConfigurationForm.touched.curriculumId && gradeConfigurationForm.errors.curriculumId) ? gradeConfigurationForm.errors.curriculumId : ""}
                                    />
                                </div>
                                <div className="col-auto ms-auto">
                                    <button
                                        className="btn btn-primary ms-2 float-end d-flex align-items-center"
                                        onClick={addNewRowHandler}
                                    >
                                        <i className="ri-add-line me-2" />
                                        Add New
                                    </button>
                                    
                                </div>
                            </div>
                            <TableContainer
                                columns={columns || []}
                                data={userDataList}
                                tableClass="mb-0"
                                divClass="table-responsive mb-3"
                                theadClass="table-light text-muted align-middle"
                                showPagination={false}
                                onChangeInputHndlr={onChangeInputHndlr}
                                rowDataInfo={{
                                    setSelectedBelowRowId, 
                                    setSelectedAboveRowId,
                                    selectedBelowRowId,
                                    selectedAboveRowId
                                }}
                            />
                        </div>
                                <div className="col-auto ms-auto me-2 mb-2">

                            <button
                                        className="btn btn-success d-flex align-items-center"
                                        onClick={submitHandler}
                                        disabled={!isAnySelected}
                                    >
                                        <i className="ri-check-line me-2" />
                                        Submit
                                    </button>
                                </div>
                    </div>
                </div>
            </div>
            <ConfirmationModal
                id="delete-pva-grade"
                isOpen={delPvaGradeModalState.showModal}
                confirmMessage="Are you sure you want to delete this record ?"
                cancelHndlr={closeDelPvaGradeModal}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
        </>
    );
};

export default GradeConfiguration;
