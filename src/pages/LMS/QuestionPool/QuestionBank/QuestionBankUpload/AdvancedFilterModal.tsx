import React, { useState } from 'react'
import { shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { BloomOptions, ChapterOptions, DifficultyOptions, QuestionTypeOptions, StatusOptions, SubjectsOptions } from './helper';
import { SelectInput } from '../../../../../Components/Common';
import { useAppSelector } from '../../../../../hooks/storehook';

const initialValues = {
    subjectId: "",
    status: "",
    bloomTaxonomyIds: "",
    difficultyLevelId: "",
    questionTypeId: "",
    chapter: "",
    classId: "",
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);
    const location = useLocation();
    const {
        branchClassResp,
        getQuestionTypesResp,
        getDifficultyLevelsResp,
        instSubjectNameResp,
        getBloomTaxonomyResp,
        assignedClassSubjectsListResp
    } = useAppSelector(
        ({ globalData, branchAcademics, lmsSettings, classSubjectsInfo }) => ({
            branchClassResp: branchAcademics.branchClassResp,
            showApiLoader: globalData.showApiLoader,
            getQuestionTypesResp: lmsSettings.getQuestionTypesResp,
            getDifficultyLevelsResp: lmsSettings.getDifficultyLevelsResp,
            instSubjectNameResp: branchAcademics.instSubjectNameResp,
            getBloomTaxonomyResp: lmsSettings.getBloomTaxonomyResp,
            assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,

        }),
        shallowEqual
    );
    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value }))
    }
    const applyFilterHndlr = () => {
        props.applyFilterCallback({ ...advanceFilterState });
        props.toggleAdvanceFilter();
    };

    return (
        <>
            <div className="offcanvas-body">
                <div className='mb-3'>
                    <SelectInput
                        name="subjectId"
                        labelText="Subject"
                        value={advanceFilterState.subjectId}
                        onChange={filterHandler}
                        menuItems={
                            Array.isArray(instSubjectNameResp?.content)
                                ? instSubjectNameResp.content
                                : []
                        }
                        valueKey="id"
                        textKey="subjectName"
                        defaultSelect="Select"
                    />
                </div>
                <div className='mb-3'>
                    <SelectInput
                        name="chapter"
                        labelText="Chapter"
                        value={advanceFilterState.chapter}
                        onChange={filterHandler}
                        menuItems={ChapterOptions}
                        valueKey="id"
                        textKey="name"
                        defaultSelect="Select"
                    />
                </div>
                <div className='mb-3'>
                    <SelectInput
                        name="questionTypeId"
                        labelText="Question Type"
                        value={advanceFilterState.questionTypeId}
                        onChange={filterHandler}
                        menuItems={getQuestionTypesResp?.data}
                        valueKey="id"
                        textKey="questionType"
                        defaultSelect="Select"
                    />
                </div>
                <div className='mb-3'>
                    <SelectInput
                        name="difficultyLevelId"
                        labelText="Difficulty"
                        value={advanceFilterState.difficultyLevelId}
                        onChange={filterHandler}
                        menuItems={getDifficultyLevelsResp?.data}
                        valueKey="id"
                        textKey="difficultyLevel"
                        defaultSelect="Select"
                    />
                </div>
                <div className='mb-3'>
                    <SelectInput
                        name="bloomTaxonomyIds"
                        labelText="Bloom Taxonomy"
                        value={advanceFilterState.bloomTaxonomyIds}
                        onChange={filterHandler}
                        menuItems={getBloomTaxonomyResp?.data}
                        valueKey="id"
                        textKey="bloomLevel"
                        defaultSelect="Select"
                    />
                </div>
                <div className='mb-3'>
                    <SelectInput
                        name="status"
                        labelText="Status "
                        value={advanceFilterState.status}
                        onChange={filterHandler}
                        menuItems={StatusOptions}
                        valueKey="id"
                        textKey="name"
                        defaultSelect="Select"
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
    )
}

export default AdvanceFilterModal
