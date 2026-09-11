import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import {  SelectInput, InputCheckbox } from "../../../Components/Common";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

// Formik validation
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstClassAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { getCurriculumClassAct, addCurriculumClassAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import Button from "../../../Components/Common/Button";

function getInitialClassState(editData?: any) {
    return ([]);
}

const AddEditClassStructure: React.FC<any> = (props) => {
    const [addClassStructureState, setAddClassStructureState] = useState<any>({
        selectAllClass: false,
        curriculumError: "",
        curriculumId: "",
    });
    const [classListState, setClassListState] = useState<any>([]);
    const dispatch = useAppDispatch();
    const { instClassResp, instCurriculumResp, curriculumClassResp, addCurriculumClassResp,showApiLoader } = useAppSelector(({ instAcademics,globalData }) => ({
        instClassResp: instAcademics.instClassResp,
        instCurriculumResp: instAcademics.instCurriculumResp,
        curriculumClassResp: instAcademics.curriculumClassResp,
        addCurriculumClassResp: instAcademics.addCurriculumClassResp,
        showApiLoader: globalData.showApiLoader,
    }), shallowEqual);

    const addClassStructRespRef = useRef<any>({
        prevAddCurriculumClassResp: addCurriculumClassResp
    });
    //Update Curriculum
    useEffect(() => {
        const { prevAddCurriculumClassResp } = addClassStructRespRef.current;
        if (addCurriculumClassResp && prevAddCurriculumClassResp !== addCurriculumClassResp) {
            props.toggle(true);
            toast.success("Class structure added successfully.")
        }
        addClassStructRespRef.current.prevAddCurriculumClassResp = addCurriculumClassResp;
    }, [addCurriculumClassResp]);

    useEffect(() => {
        if (props.isOpen) {
            const payload = { instituteId: props.instituteId, sortBy: "className", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getInstClassAct(generateActionPayload("get_inst_class", undefined, payload)));
        }
    }, [props.isOpen]);

    useEffect(() => {
        if (props.isOpen && instClassResp) {
            updateSelectedClass(instClassResp, curriculumClassResp);
        }
    }, [props.isOpen, instClassResp, curriculumClassResp]);

    useEffect(() => {
        if (props.isOpen) {
            setAddClassStructureState((prevState: any) => ({ ...prevState, curriculumId: "" }))
        } else if (!props.isOpen) {
            setAddClassStructureState((prevState: any) => ({ ...prevState, selectAllClass: false }));
        }
    }, [props.isOpen]);

    function updateSelectedClass(classList: any, curriculumClasses: any) {
        const curriculumClassId = curriculumClasses?.data?.map((item: any) => {
            return item?.instituteClassId || ""
        }) || [];
        const updateClassList = classList?.data.map((item: any) => Object.assign({}, item, { selected: curriculumClassId.includes(item?.instituteClassId) }));
        updateSelectedAllHndlr(updateClassList);
        setClassListState(updateClassList);
    }

    function selectClassHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target,
            classId = Number(event.target.getAttribute("data-id")),
            classIndex = classListState.findIndex((item: any) => item.instituteClassId === classId);
        if (classIndex > -1) {
            const classDetails = classListState[classIndex],
                updateClassList = [...classListState];
            updateClassList.splice(classIndex, 1, { ...classDetails, selected: checked });
            updateSelectedAllHndlr(updateClassList);
            setClassListState(updateClassList);
        }
    }

    function selectAllClassHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = event.target;
        setAddClassStructureState((prevState: any) => ({ ...prevState, [name]: checked }));
        const updateClassList = [...classListState];
        if (checked) {
            updateClassList.forEach((item) => {
                item.selected = true;
            });
            setClassListState(updateClassList);
        } else {
            updateClassList.forEach((item) => {
                item.selected = false;
            });
            setClassListState(updateClassList);
        }
    }

    function onChangeCurriculumHndlr(event: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = event.target,
            updateClassList = [...classListState];

        if (value) {
            const payload = { instituteCurriculumId: value, pageNo: 0, pageSize: 100 };
            dispatch(getCurriculumClassAct(generateActionPayload("get_class_structure", undefined, payload)));
            updateClassList.forEach((item) => {
                item.selected = false;
            });
            setClassListState(updateClassList);
            setAddClassStructureState((prevState: any) => ({ ...prevState, [name]: value, selectAllClass: false }));
        }
        // else {
        //     setAddClassStructureState((prevState: any) => ({ ...prevState, [name]: value, selectAllClass: false }));
        // }
    }

    function submitCurriculum(event: React.ChangeEvent<HTMLButtonElement>) {
        event.preventDefault();
        const selectedClassIds = classListState.filter((item: any) => item.selected).map((item: any) => item.instituteClassId),
            params = { instituteId: props.instituteId },
            payload = {
                instituteCurriculumId: addClassStructureState.curriculumId,
                instituteClassIds: selectedClassIds
            }
        dispatch(addCurriculumClassAct(generateActionPayload("add_class_structure", params, payload)));
    }

    function updateSelectedAllHndlr(classList: any) {
        const isAllSelected = classList.every((item: any) => item.selected);
        if (isAllSelected) {
            setAddClassStructureState((prevState: any) => ({ ...prevState, selectAllClass: true }));
        } else {
            setAddClassStructureState((prevState: any) => ({ ...prevState, selectAllClass: false }));
        }
    }

    const { data: instCurriculumList } = instCurriculumResp || {};
    return (

        <div className="tw-w-full">

            <div className="tw-grid tw-grid-cols-12">

                <div className="tw-col-span-12 tw-pt-3 tw-pb-4 tw-px-4">
                    <SelectInput
                        name="curriculumId"
                        value={addClassStructureState.curriculumId}
                        onChange={onChangeCurriculumHndlr}
                        menuItems={instCurriculumList}
                        formgroupClassName="tw-mb-0"
                        valueKey="instituteCurriculumId"
                        textKey="curriculumName"
                        labelText="Curriculum"
                        floatingLabel
                    />
                </div>

                <div className="tw-col-span-12 tw-border-t tw-px-4 tw-py-2">
                    <label className="tw-text-lg tw-font-medium tw-mb-0">
                        Select Classes
                    </label>
                </div>

                <div className="tw-col-span-12 tw-px-4">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-y-2">

                        <div className="tw-col-span-12 tw-mb-2">
                            <InputCheckbox
                                name="selectAllClass"
                                labelName="Select All"
                                value={addClassStructureState.selectAllClass}
                                onChange={selectAllClassHndlr}
                            />
                        </div>

                        {Array.isArray(classListState) &&
                            classListState.map((item: any, index: number) => (
                                <div
                                    key={item.instituteClassId}
                                    className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-4"
                                >
                                    <InputCheckbox
                                        name={`class-${index}`}
                                        labelName={item.shortName}
                                        value={item.selected}
                                        onChange={selectClassHndlr}
                                        dataId={item.instituteClassId}
                                    />
                                </div>
                            ))}

                    </div>
                </div>

            </div>

            <div className="tw-flex tw-justify-end tw-gap-2 tw-mb-1 tw-p-3">

                <Button
                    type="button"
                    variant="secondary"
                    onClick={props.toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    onClick={(event: any) => submitCurriculum(event)}
                    disabled={showApiLoader}
                >
                    Submit
                </Button>

            </div>

        </div>
    )
}

export default AddEditClassStructure;

{/* <Col xs={10}>
<Input type="text" placeholder="" id="branchName" />
</Col>
<Col xs={"auto"} className="ms-auto">
{(index !== 0) &&
    <Button data-id={item.id} data-index={index} onClick={removeTermHndlr} color="white" className="btn-sm btn-icon btn-rounded btn-hover-danger"><i className="ri-delete-bin-2-fill" />
    </Button>}
</Col> */}