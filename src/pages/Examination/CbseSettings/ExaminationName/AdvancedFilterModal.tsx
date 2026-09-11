import React, { useState } from 'react'
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { SelectInput } from '../../../../Components/Common';
import { useLocation } from 'react-router-dom';

const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    examCategoryId: "",
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);
    const location = useLocation();

    const {
        showApiLoader,
        getExamCategoryResp,
        getIgseTermNameListResp,
    } = useAppSelector(
        ({ globalData, examinationSettings }) => ({
            showApiLoader: globalData.showApiLoader,
            getExamCategoryResp: examinationSettings.getExamCategoryResp,
            getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
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
                        name="examCategoryId"
                        value={advanceFilterState.examCategoryId}
                        onChange={filterHandler}
                        menuItems={getExamCategoryResp}
                        valueKey="id"
                        textKey="displayName"
                        formgroupClassName="mb-0"
                        labelText='Exam Category'
                    />
                </div>
                {location.pathname === '/igcse-settings/term-wise-examination' && (
                    <div className='mb-3'>
                        <SelectInput
                            name="termId"
                            value={advanceFilterState.termId}
                            onChange={filterHandler}
                            menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                            valueKey="termId"
                            textKey="termName"
                            formgroupClassName="mb-0"
                            labelText='Term Name'
                        />
                    </div>
                )}
            </div>
            <div className="border-top p-2 text-center">
                <div className="hstack gap-2 justify-content-end">
                    <button
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
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
