import React, { useEffect, useState } from 'react'
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { CustomSelect, SelectInput } from '../../../../../Components/Common';
import { renderOptionsEmployee, renderValueSection } from './helper';
import { set } from 'date-fns';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { getSubjectListAct } from '../../../../../store/examination/examinationsettings/examinationsettingsaction';


const initialValues = {
    curriculumId: "",
    classId: "",
    termId: "",
    examinationId: "",
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);
    const dispatch = useAppDispatch();
    const {
        showApiLoader,
        assignedClassSubjectsListResp,
        getIgseTermNameListResp,
        getSubjectListResp,
    } = useAppSelector(
        ({ globalData, classSubjectsInfo, examinationSettings }) => ({
            showApiLoader: globalData.showApiLoader,
            assignedClassSubjectsListResp:
                classSubjectsInfo.assignedClassSubjectsListResp,
            getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
            getSubjectListResp: examinationSettings.getSubjectListResp
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
                        value={advanceFilterState?.subjectId}
                        onChange={filterHandler}
                        menuItems={Array.isArray(assignedClassSubjectsListResp?.data) ? assignedClassSubjectsListResp?.data : []}
                        valueKey="subjectId"
                        textKey="subjectName"
                        labelText="Subject Name"
                        formgroupClassName="mb-0"
                    />
                </div>


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
