import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { SelectInput } from "../../../../Components/Common";
import { getCbseExaminationListAct, getIgseTermNameListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { useLocation } from "react-router-dom";
import { getExaminationLanguagesListAct } from "../../../../store/assignlanguages/assignlanguagesaction";

const initialValues = {
    searchString: "",
    academicYearId: "",
    classId: "",
    examinationId: "",
  termId: ""
};

const AdvanceFilterModal = (props: any) => {

    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);
    const dispatch = useAppDispatch();

    const {
        currentBranchIdResp: branchId,
        classListForAdvanceFilter,
        getIgseTermNameListResp,
        getExaminationLanguagesListResp,
    } = useAppSelector(
        ({ appData, branchAcademics, classroomManagmentInfo, feeCollections, examinationSettings, assignLanguages }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
            getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
            getExaminationLanguagesListResp: assignLanguages.getExaminationLanguagesListResp,
        }),
        shallowEqual
    );

    const getClassApiCall = (otherProps?: any) => {
        const payload = { pageNo: 0, pageSize: 100, classFilter:  "HIGHER", sortBy: "classSequence", orderBy: "asc", curriculumId: props.appliedFilter.curriculumId, branchId, academicYearId: props.appliedFilter.academicYearId, ...otherProps };
        dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const cbseExaminationList = (otherProps?: any) => {
        let payload = { branchId, classId: advanceFilterState.classId || null, academicYearId: advanceFilterState.academicYearId, curriculumId: advanceFilterState.curriculumId, termId: advanceFilterState.termId, pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getExaminationLanguagesListAct(generateActionPayload("get_cbse_examination_list", undefined, payload)));
    };

    const examinationTermList = (curriculumId: string) => {
        if (curriculumId) {
            let payload = {
                branchId,
                curriculumId: advanceFilterState.curriculumId,
            };
            dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
        }
    };

    useEffect(() => {
        const { academicYearId, curriculumId } = props.appliedFilter || {};
        setAdvanceFilterState((prev: any) => ({
            ...prev,
            academicYearId,
            curriculumId,
        }));
        if (academicYearId && curriculumId) {
            getClassApiCall({ academicYearId, curriculumId });
            dispatch(resetClassListForAdvanceFilterAct(undefined));
        }
    }, [props.appliedFilter.academicYearId, props.appliedFilter.curriculumId]);
    useEffect(() => {
        examinationTermList(advanceFilterState.curriculumId);
    }, [advanceFilterState.curriculumId]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "curriculumId") {
            if (value) {
                getClassApiCall({
                    curriculumId: value,
                    academicYearId: advanceFilterState.academicYearId,
                });
                examinationTermList(value);
            } else {
                dispatch(resetClassListForAdvanceFilterAct(undefined));
            }
            setAdvanceFilterState((prev: any) => ({
                ...prev,
                [name]: value,
                classId: "",
                examinationId: "",
            }));
        } else if (name === "classId") {
            const updatedState = {
                ...advanceFilterState,
                [name]: value,
                examinationId: "",
            };
            setAdvanceFilterState(updatedState);

            if (value) {
                cbseExaminationList({ classId: value, termId: updatedState.termId });
            }
        } else if (name === "termId") {
            const updatedState = {
                ...advanceFilterState,
                [name]: value,
                examinationId: "",
            };
            setAdvanceFilterState(updatedState);

            if (value && advanceFilterState.classId) {
                cbseExaminationList({
                    classId: advanceFilterState.classId,
                    termId: value,
                });
            }
        } else {
            setAdvanceFilterState((prev: any) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const applyFilterHndlr = () => {
        props.applyFilterCallback({ ...advanceFilterState });
        props.toggleAdvanceFilter();
    };
    
    const location = useLocation();
    const isIgcseManagementPage = location.pathname === "/igcse-management";

    const { content: classTypes } = classListForAdvanceFilter || {};

    return (
        <>
            <div className="offcanvas-body">
                <div className='mb-3'>
                    <SelectInput
                        name="classId"
                        value={advanceFilterState?.classId}
                        onChange={filterHandler}
                        menuItems={classTypes}
                        valueKey="id"
                        textKey="shortName"
                        formgroupClassName="mb-0"
                        defaultSelect="Select"
                        labelText="Class"
                    />
                </div>
                {isIgcseManagementPage && (
                    <div className='mb-3'>
                        <SelectInput
                            name="termId"
                            value={advanceFilterState.termId}
                            onChange={filterHandler}
                            menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                            valueKey="termId"
                            textKey="termName"
                            formgroupClassName="mb-2 mb-xl-0"
                            labelText='Term Name'
                        />
                    </div>
                )}
                <div className='mb-3'>
                    <SelectInput
                        name="examinationId"
                        value={advanceFilterState.examinationId}
                        onChange={filterHandler}
                        menuItems={getExaminationLanguagesListResp?.data}
                        valueKey="id"
                        textKey="examinationName"
                        formgroupClassName="mb-0"
                        labelText="Examination"
                    />
                </div>
            </div>
            <div className="border-top p-2 text-center">
                <div className="hstack gap-2 justify-content-end">
                    <button
                        type="submit"
                        onClick={applyFilterHndlr}
                        className="btn btn-success"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdvanceFilterModal;
