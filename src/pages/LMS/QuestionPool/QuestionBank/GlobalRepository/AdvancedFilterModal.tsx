import React, { useState } from 'react'
import { shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { BloomOptions, ChapterOptions, DifficultyOptions, QuestionTypeOptions, StatusOptions, SubjectsOptions } from './helper';
import { SelectInput, TextInput } from '../../../../../Components/Common';
import { useAppSelector } from '../../../../../hooks/storehook';

const initialValues = {
    subjectId: "",
    tags: "",
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);
    const location = useLocation();
    const {
        branchClassResp,
        instSubjectNameResp,
        assignedClassSubjectsListResp
    } = useAppSelector(
        ({ globalData, branchAcademics, classSubjectsInfo }) => ({
            branchClassResp: branchAcademics.branchClassResp,
            showApiLoader: globalData.showApiLoader,
            instSubjectNameResp: branchAcademics.instSubjectNameResp,
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
                        formgroupClassName='mb-3'
                        inputClassName=""
                    />
                </div>
                <div>
                    <TextInput
                        name='tags'
                        labelText="Tags"
                        onChange={filterHandler}
                        value={advanceFilterState.tags}
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
