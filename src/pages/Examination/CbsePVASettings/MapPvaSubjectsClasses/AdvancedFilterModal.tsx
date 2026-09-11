import React, { useState } from 'react'
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { SelectInput } from '../../../../Components/Common';

const initialValues = {
    termId: "",
    pvaSubjectId: "",
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);

    const {
        showApiLoader,
        getPvaSubjectResp,
        getIgseTermNameListResp,
    } = useAppSelector(
        ({ globalData, examinationSettings, pvaReports }) => ({
            showApiLoader: globalData.showApiLoader,
            getPvaSubjectResp: pvaReports.getPvaSubjectResp,
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
                <div className='mb-3'>
                    <SelectInput
                        name="pvaSubjectId"
                        value={advanceFilterState.pvaSubjectId}
                        onChange={filterHandler}
                        menuItems={Array.isArray(getPvaSubjectResp) ? getPvaSubjectResp : []}
                        valueKey="id"
                        textKey="pvaSubjectName"
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
