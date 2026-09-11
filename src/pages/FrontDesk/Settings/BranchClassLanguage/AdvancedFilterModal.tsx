import React, { useEffect, useState } from 'react'
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { CustomSelect, SelectInput } from '../../../../Components/Common';
import { renderOptionsEmployee, renderValueSection } from './helper';
import { set } from 'date-fns';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getSubjectListAct } from '../../../../store/examination/examinationsettings/examinationsettingsaction';
import Button from '../../../../Components/Common/Button';


const initialValues = {
    subjectId: "",
    languageId: "",
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);
    const dispatch = useAppDispatch();
    const {
        showApiLoader,
        assignedClassSubjectsListResp,
        getIgseTermNameListResp,
        getSubjectListResp,
        academicLanguages,
        academicSubjectsListResp
    } = useAppSelector(
        ({ globalData, instituteInfo, classSubjectsInfo, examinationSettings }) => ({
            showApiLoader: globalData.showApiLoader,
            assignedClassSubjectsListResp:
                classSubjectsInfo.assignedClassSubjectsListResp,
            getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
            getSubjectListResp: examinationSettings.getSubjectListResp,
        academicLanguages: instituteInfo.academicLanguages,
      academicSubjectsListResp: classSubjectsInfo.academicSubjectsListResp,

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
                <div className='tw-mb-3'>
                    <SelectInput
                        name="subjectId"
                        value={advanceFilterState?.subjectId}
                        onChange={filterHandler}
                        menuItems={Array.isArray(academicSubjectsListResp) ? academicSubjectsListResp : []}
                        valueKey="id"
                        textKey="subjectName"
                        labelText="Subject Name"
                        formgroupClassName="tw-mb-0"
                    />
                </div>
                <div className='tw-mb-3'>
                    <SelectInput
                        name="languageId"
                        value={advanceFilterState?.languageId}
                        menuItems={academicLanguages?.data}
                        valueKey="languageId"
                        textKey="languageName"
                        formgroupClassName="tw-mb-0"
                        onChange={filterHandler}
                        labelText="Language Name"
                    />
                </div>
            </div>
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-gap-2 tw-justify-content-end">
                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
                        variant='primary'
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AdvanceFilterModal
