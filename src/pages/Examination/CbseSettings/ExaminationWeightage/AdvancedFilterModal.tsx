import { useState } from 'react'
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { SelectInput } from '../../../../Components/Common';

const initialValues = {
    curriculumId: "",
    classId: "",
    termId: "",
    examinationId: "",
};

const AdvanceFilterModal = (props: any) => {

    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp,
        getCbseExaminationRequestListResp, getIgseTermNameListResp, showApiLoader }: any =
        useAppSelector(
            ({ appData, instAcademics, examinationSettings, branchAcademics, classroomManagmentInfo, feeCollections, globalData }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                loginUserDetailsResp: appData.loginUserDetailsResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                showApiLoader: globalData.showApiLoader,
                getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
       
            }),
            shallowEqual
        );

    const filterHandler = (event: any) => {
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
                        name="examinationId"
                        value={advanceFilterState?.examinationId}
                        onChange={filterHandler}
                        menuItems={(Array.isArray(getCbseExaminationRequestListResp?.data) && getCbseExaminationRequestListResp?.data) || []}
                        valueKey="id"
                        textKey="examinationName"
                        formgroupClassName="w-100"
                        labelText='Examination Name'
                    />
                </div>
                <div className='mb-3'>
                    <SelectInput
                        name="termId"
                        value={advanceFilterState?.termId}
                        onChange={filterHandler}
                        menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                        valueKey="termId"
                        textKey="termName"
                        formgroupClassName="w-100"
                        labelText='Term Name'
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
