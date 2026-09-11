import React, { useState } from 'react'
import { shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { BloomOptions, ChapterOptions, DifficultyOptions, QuestionTypeOptions, StatusOptions, SubjectsOptions } from './helper';
import { SelectInput } from '../../../../../Components/Common';
import { useAppSelector } from '../../../../../hooks/storehook';

const initialValues = {
    subjectId: "",
    status: "",
    bloom: "",
    difficulty: "",
    questionType: "",
    chapter: "",
    classId: "",
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);
    const location = useLocation();
    const {
        branchClassResp,
    } = useAppSelector(
        ({ globalData, branchAcademics }) => ({
            branchClassResp: branchAcademics.branchClassResp,
            showApiLoader: globalData.showApiLoader,

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
                        menuItems={SubjectsOptions}
                        valueKey="id"
                        textKey="name"
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
                        name="questionType"
                        labelText="Question Type"
                        value={advanceFilterState.questionType}
                        onChange={filterHandler}
                        menuItems={QuestionTypeOptions}
                        valueKey="id"
                        textKey="name"
                        defaultSelect="Select"
                    />
                </div>
                <div className='mb-3'>
                    <SelectInput
                        name="difficulty"
                        labelText="Difficulty"
                        value={advanceFilterState.difficulty}
                        onChange={filterHandler}
                        menuItems={DifficultyOptions}
                        valueKey="id"
                        textKey="name"
                        defaultSelect="Select"
                    />
                </div>
                <div className='mb-3'>
                    <SelectInput
                        name="bloom"
                        labelText="Bloom"
                        value={advanceFilterState.bloom}
                        onChange={filterHandler}
                        menuItems={BloomOptions}
                        valueKey="id"
                        textKey="name"
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
