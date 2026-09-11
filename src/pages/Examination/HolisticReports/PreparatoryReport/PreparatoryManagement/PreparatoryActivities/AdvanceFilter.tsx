import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from "../../../../../../store/fee/feecollections/feecollectionactions";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { SelectInput } from "../../../../../../Components/Common";
import { getHolisticDomainAct, getPreparatoryDomainAct } from "../../../../../../store/examination/examinationsettings/examinationsettingsaction";

const initialValues = {
    classId: "",
    examinationId: "",
};

const AdvanceFilterModal = (props: any) => {

    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);
    const dispatch = useAppDispatch();

    const {
        currentBranchIdResp: branchId,
        classListForAdvanceFilter,
        getHolisticDomainResp,
        getPreparatoryDomainResp
    } = useAppSelector(
        ({ appData, feeCollections, examinationSettings }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
            getHolisticDomainResp: examinationSettings.getHolisticDomainResp,
            getPreparatoryDomainResp: examinationSettings.getPreparatoryDomainResp,

        }),
        shallowEqual
    );

    const getClassApiCall = (otherProps?: any) => {
        const payload = {
            branchId,
            pageNo: 0,
            pageSize: 100,
            classFilter: "HIGHER",
            sortBy: "classSequence",
            orderBy: "asc",
            curriculumId: props.appliedFilter.curriculumId,
            academicYearId: props.appliedFilter.academicYearId,
            ...otherProps
        };
        dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    const getHolisticDomainApiCall = (otherProps?: any) => {
        dispatch(
      getPreparatoryDomainAct(
        generateActionPayload("get_preparatory_domain", undefined, {})
      )
    );
    };
    useEffect(() => {
        getHolisticDomainApiCall();
    }, []);
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

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "curriculumId") {
            if (value) {
                getClassApiCall({
                    curriculumId: value,
                    academicYearId: advanceFilterState.academicYearId,
                });
            } else {
                dispatch(resetClassListForAdvanceFilterAct(undefined));
            }
            setAdvanceFilterState((prev: any) => ({
                ...prev,
                [name]: value,
                classId: "",
                examinationId: "",
            }));
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

    const { content: classTypes } = classListForAdvanceFilter || {};

    return (
        <>
            <div className="offcanvas-body">
                {/* <div className='mb-3'>
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
                </div> */}
                <div className='mb-3'>
                    <SelectInput
                        name="domainId"
                        value={advanceFilterState?.domainId}
                        onChange={filterHandler}
                        menuItems={getPreparatoryDomainResp}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="mb-0"
                        defaultSelect="Select"
                        labelText="Domain"
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
