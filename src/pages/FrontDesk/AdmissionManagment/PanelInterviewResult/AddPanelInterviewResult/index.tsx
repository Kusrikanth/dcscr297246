import React, { useEffect, useMemo, useRef, useState } from 'react'
import BreadCrumb from '../../../../../Components/Common/BreadCrumb'
import BackButtonText from '../../../../../Components/Common/BackButtonText'
import { DateInput, ModalContainerUpdated, SelectInput, TextInput } from '../../../../../Components/Common'
import { useFormik } from 'formik'

import { default as EditSvg } from "../../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as EyeSvg } from "../../../../../assets/imagesdps/academics/EyeSvg.svg?react";
import TableContainer from '../../../../../Components/Common/TableContainer'
import { FormGroup, Input, Label } from 'reactstrap'

import { useAppSelector } from '../../../../../hooks/storehook'
import { shallowEqual, useDispatch } from 'react-redux'
import { getInstAcademicYearAct } from '../../../../../store/mastersettings/instacademics/instacademicactions'
import { generateActionPayload } from '../../../../../utility/reduxutility'
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from '../../../../../store/branchsettings/branchacademics/branchacademicsactions'
import * as Yup from "yup";
import { id } from 'date-fns/locale'
import { useHistory, useLocation } from 'react-router-dom'
import { editPanIntResListAct, getObservationAndInterviewerReportByIdAct, getPanIntResByIdAct, getPanIntResListWhiSaveAct, resetEditPanIntResAct, resetPanelInterviewResultListWhileSavingAct, savePanelIntResult } from '../../../../../store/FrontDesk/Interview/interviewactions'
import AddPanelInterViewModal from './AddPanelInterviewModal'
import { getPanelEmployeesListAct, resetPanelEmployeesListAct } from '../../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction'
import { computeSubmitButtonError, generateColumns } from './helper'
import { toast } from 'react-toastify'
import { getYyyyMmDdFormat } from '../../../../../utility/dateutility'
import Button from '../../../../../Components/Common/Button'

const initialSMSandEmail = {
    sms: true,
    email: true,
}

const AddPanelInterviewResult = () => {

    const dispatch = useDispatch()
    const history = useHistory()
    const location: any = useLocation()

    const initialFilterState = {
        academicYearId: "",
        curriculumId: "",
        classId: "",
        interviewDate: "",
    }

    const [intResFilterState, setIntResFilterState] = useState(initialFilterState);

    const [panIntResList, setPanIntResList] = useState<any>([])
    const [searchString, setSearchString] = useState("");

    const [addIntResModal, setAddIntResModal] =
        useState({
            showModal: false,
            branchId: "",
            observationId: "",
        });

    const [smsAndEmail, setSmsAndEmail] = useState(initialSMSandEmail)

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, panelInterviewResultListWhileSavingResp, panelEmployeesListResp, savePanelIntResultResp, interviewErrorResp, editPanIntResResp, getPanIntResByIdResp, showApiLoader } =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, admissionAvailabilityRequest, globalData, interview }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                showApiLoader: globalData.showApiLoader,
                panelEmployeesListResp: admissionAvailabilityRequest.panelEmployeesListResp,
                panelInterviewResultListWhileSavingResp: interview.panelInterviewResultListWhileSavingResp,
                savePanelIntResultResp: interview.savePanelIntResultResp,
                interviewErrorResp: interview.interviewErrorResp,
                editPanIntResResp: interview.editPanIntResResp,

                getPanIntResByIdResp: interview.getPanIntResByIdResp,
            }),
            shallowEqual
        );

    const PanIntResultRef = useRef({
        prevSavePanelIntResultResp: savePanelIntResultResp,
        prevInterviewErrorResp: interviewErrorResp,
        prevEditPanIntResResp: editPanIntResResp,
    })
    useEffect(() => {
        const { prevSavePanelIntResultResp, prevInterviewErrorResp, prevEditPanIntResResp } = PanIntResultRef.current;
        if (savePanelIntResultResp && prevSavePanelIntResultResp !== savePanelIntResultResp) {
            toast.success('Panel Interview Result Added Successfully')
            history.push('/admission-management')
        }
        if (editPanIntResResp && prevEditPanIntResResp !== editPanIntResResp) {
            toast.success('Panel Interview Result Edited Successfully')
            history.push('/admission-management')
        }
        if (interviewErrorResp && prevInterviewErrorResp !== interviewErrorResp) {
            const { details } = interviewErrorResp;
            toast.error(details)
        }
        PanIntResultRef.current.prevSavePanelIntResultResp = savePanelIntResultResp;
        PanIntResultRef.current.prevEditPanIntResResp = editPanIntResResp;
        PanIntResultRef.current.prevInterviewErrorResp = interviewErrorResp;

    }, [savePanelIntResultResp, interviewErrorResp, editPanIntResResp])

    function searchByRegNumberOrName(searchTerm: any) {
        const searchTermLowerCase = searchTerm.toLowerCase();

        const filteredData = panelInterviewResultListWhileSavingResp?.filter((item: any) => {
            const regNo = item.studentRegNo.toLowerCase();
            const studentName = item.studentName.toLowerCase();

            return regNo.includes(searchTermLowerCase) || studentName.includes(searchTermLowerCase);
        });
        setPanIntResList(filteredData)
    }

    const toggleIntResModal = (id?: any) => {
        setAddIntResModal((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            observationId: id || '',
        }));
    };

    useEffect(() => {

        if (location?.state?.pirId) {
            dispatch(getPanIntResByIdAct(generateActionPayload("get_pan_int_res_by_id", { id: location?.state?.pirId })));
        }

    }, [location])

    useEffect(() => {
        if (panelInterviewResultListWhileSavingResp) {
            const newList = panelInterviewResultListWhileSavingResp?.map((item: any) => {
                return { ...item, recommendedBy: "", status: "", referenceBy: "" }
            })
            setPanIntResList(newList)

        }
    }, [panelInterviewResultListWhileSavingResp])

    useEffect(() => {
        if (getPanIntResByIdResp && location?.state?.pirId && panelEmployeesListResp) {
            let newObj: any;
            if (panIntResList?.length) {
                newObj = {
                    ...panIntResList[0], employeeDetailsDTO: {
                        employeeCode: panIntResList[0]?.employeeDetailsDTO?.employeeCode,
                        employeeName: panIntResList[0]?.employeeDetailsDTO?.recommendedBy,
                        employeeId: panIntResList[0]?.employeeDetailsDTO?.recommendedEmpId,
                    }
                }
            } else {
                newObj = {
                    ...getPanIntResByIdResp, employeeDetailsDTO: {
                        employeeCode: getPanIntResByIdResp?.employeeDetailsDTO?.employeeCode,
                        employeeName: getPanIntResByIdResp?.employeeDetailsDTO?.recommendedBy,
                        employeeId: getPanIntResByIdResp?.employeeDetailsDTO?.recommendedEmpId,
                    }
                }
            }
            setPanIntResList([newObj])
            // setFirstTimeAPICall(false)
        } else if (getPanIntResByIdResp && location?.state?.pirId) {
            setPanIntResList([getPanIntResByIdResp])
        }
    }, [getPanIntResByIdResp, panelEmployeesListResp])



    const selectedEmployeeCallback = (employee: any, id?: any) => {

        const newList: any = panIntResList?.map((item: any) => {
            if (+id === +item?.id) {
                return {
                    ...item, recommendedEmpId: employee?.employeeId, employeeDetailsDTO: {
                        employeeCode: employee?.employeeCode,
                        employeeName: employee?.employeeName,
                        employeeId: employee?.employeeId,
                    }
                }
            } else {
                return item;
            }
        })
        setPanIntResList(newList)
        // setEmployeeState(employee);
    }

    const validationSchema = Yup.object().shape({
        academicYearId: Yup.string().required("Academic Year is required."),
        curriculumId: Yup.string().required("Curriculum is required."),
        classId: Yup.string().required("Class is required."),
        interviewDate: Yup.string().required("Interview Date is required."),
    });


    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const payload = { instituteId, branchId, searchString: inputString }
            dispatch(getPanelEmployeesListAct(generateActionPayload("panel_employees_list", undefined, payload)));
        }
    }

    const filterForm = useFormik({
        initialValues: intResFilterState,
        enableReinitialize: true,
        validationSchema,
        onSubmit: (value) => {
            dispatch(getPanIntResListWhiSaveAct(generateActionPayload("get_panel_interview_result_list_while_saving", undefined, { ...value, branchId })));

        }
    })
    const AddObservationAndInterviewForm = useFormik({
        initialValues: panIntResList,
        enableReinitialize: true,
        onSubmit: (value: any) => {

            if (!location?.state?.pirId) {
                const payload = {
                    academicYearId: filterForm?.values?.academicYearId,
                    curriculumId: filterForm?.values?.curriculumId,
                    classId: filterForm?.values?.classId,
                    branchId, instituteId,
                    isSMS: smsAndEmail?.sms,
                    isEmail: smsAndEmail?.email,
                    // panelInterviewScheduleDetailsId: panIntResList?.length ? panIntResList[0]?.panelInterviewScheduleDetailsId : "",
                    studentDTOS: panIntResList?.filter((item: any) => {
                        if ((item?.status) || (item?.recommendedBy) || (item?.referenceBy)) { return true }
                        else { return false }
                    })?.map((i: any) => {
                        return { ...i?.values, studentRegId: i?.studentRegId, remark: i?.remarks, recommendedBy: i?.recommendedBy, admissionStatus: i?.status, referenceBy: i?.referenceBy, recommendedEmpId: i?.recommendedEmpId,panelInterviewScheduleDetailsId:i?.panelInterviewScheduleDetailsId }
                        // return {...i?.values,studentRegId : i?.studentRegId  ,status : i?.status,remark : "",recommendedEmpId:i?.recommendedEmpId,admissionType:i?.status}
                    })
                }
                dispatch(savePanelIntResult(generateActionPayload("save_panel_interview_result", undefined, payload)));
            } else {
                const payload = {
                    studentRegId: panIntResList[0]?.studentRegId, admissionStatus: panIntResList[0]?.status, recommendedBy: panIntResList[0]?.recommendedBy, recommendedEmpId: panIntResList[0]?.recommendedEmpId,
                    referenceBy: panIntResList[0]?.referenceBy, remark: panIntResList[0]?.remarks,
                    isSMS: smsAndEmail?.sms,
                    isEmail: smsAndEmail?.email,
                }
                dispatch(editPanIntResListAct(generateActionPayload("edit_pan_int_res", { id: panIntResList[0]?.id }, payload)));
            }


        }
    })
    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <EditSvg className="d-inline-block me-2" fill='#878A99' />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {

                },
            },
        ],
        []
    );


    const changeStatusHandler = (id: any, event: any) => {
        const updatedData = panIntResList?.map((item: any) => {
            if (+item?.id === +id && !(event?.target?.value === "Recommended")) {
                return { ...item, status: event.target.value, recommendedBy: "", referenceBy: "" }
            } else if (+item?.id === +id) {
                return { ...item, status: event.target.value }
            }
            else {
                return item;
            }
        }
        );
        setPanIntResList(updatedData);
    }

    const changeRecommendHandler = (id: any, event: any) => {

        const updatedData: any = panIntResList?.map((item: any) =>
            item.id === id ? { ...item, recommendedBy: event.target.value } : item
        );
        setPanIntResList(updatedData);
    }

    const changeReferenceHandler = (id: any, event: any, name: any) => {
        if (name === "recommendedEmpId") {
            // For autosearch input we directly get value .
            const payload = { instituteId, branchId, searchString: event }
            dispatch(getPanelEmployeesListAct(generateActionPayload("panel_employees_list", undefined, payload)));
        } else {
            const updatedData: any = panIntResList?.map((item: any) =>
                item.id === id ? { ...item, [name]: event.target.value } : item
            );
            setPanIntResList(updatedData);
        }
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
      }

      const getClassApiCall = (otherProps: any) => {
        const payload = { branchId: branchId, academicYearId: filterForm.values.academicYearId,curriculumId: filterForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));   
      }

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        if (name === 'curriculumId') {
            if (!value) {
                dispatch(resetBrchClassAct(undefined));
            }
            else {
                getClassApiCall({ curriculumId: value , academicYearId : filterForm.values.academicYearId });
            }
            setIntResFilterState((prev: any) => ({ ...prev, [name]: value , classId :"" }));
        }
        else if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetBrchClassAct(undefined));
            setIntResFilterState((prev: any) => ({ ...prev, [name]: value , curriculumId : "" , classId : "" }));
        }else {
            setIntResFilterState((prev: any) => ({ ...prev, [name]: value }));
        }
    }


    useEffect(() => {

        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
            dispatch(resetPanelInterviewResultListWhileSavingAct(undefined));
            dispatch(resetEditPanIntResAct(undefined));
            dispatch(resetPanelEmployeesListAct(undefined));
        }
    }, []);
    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
            // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
            setIntResFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
            if(!location?.state?.pirId){
                getCurriculumApiCall({ academicYearId: yearId });
            }
        }
    }, [academicYearListResp]);

    useEffect(() => {
        const { content } = branchClassResp || {};
        if (location?.state?.pirId && getPanIntResByIdResp) {

            const { academicYearId, curriculumId, classId, interviewResultResponseDTO }: any = getPanIntResByIdResp || {}
            const { interviewDate } = interviewResultResponseDTO || {};
            setIntResFilterState((prev: any) => ({
                ...prev,
                academicYearId, curriculumId, classId, interviewDate: interviewDate ? getYyyyMmDdFormat(interviewDate) : null
            }))
        }
    }, [branchClassResp]);

    useEffect(() => {
        if (getPanIntResByIdResp && academicYearListResp && location?.state?.pirId) {

            const { academicYearId, curriculumId: newCurriculamId, classId }: any = getPanIntResByIdResp || {}
            getCurriculumApiCall({academicYearId: academicYearId});
            getClassApiCall({curriculumId: newCurriculamId, academicYearId: academicYearId,});

            if (getPanIntResByIdResp?.employeeDetailsDTO?.recommendedBy) {
                const payload = { instituteId, branchId, searchString: getPanIntResByIdResp?.employeeDetailsDTO?.recommendedBy }
                dispatch(getPanelEmployeesListAct(generateActionPayload("panel_employees_list", undefined, payload)));
            }
        }
    }, [getPanIntResByIdResp, academicYearListResp])


    const roleColumns = useMemo(() => generateColumns(menuOptions, toggleIntResModal, changeStatusHandler, changeRecommendHandler), [panIntResList]);


    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};


    const submitButtonError = useMemo(() => computeSubmitButtonError(panIntResList), [panIntResList]);


    return (
        <>
            <div className="page-content new_fee_receipt_page_warp">
                <div className="container-fluid">
                    <BreadCrumb pageTitle="Admissions" />

                    <div className="tw-bg-white tw-rounded tw-shadow">
                        <form onSubmit={filterForm.handleSubmit}>
                            <div className="tw-p-4 tw-pt-4 tw-pb-0">
                                <div className="tw-font-bold tw-mb-3 tw-text-base">
                                    Panel Interview Result
                                </div>

                                <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                    <div className="tw-col-span-12 lg:tw-col-span-2">
                                        <SelectInput
                                            name="academicYearId"
                                            labelText="Academic Year"
                                            value={intResFilterState.academicYearId}
                                            onChange={handleChange}
                                            onBlur={filterForm.handleBlur}
                                            menuItems={academicYearList || []}
                                            valueKey="academicYearId"
                                            textKey="academicYearName"
                                            labelClass="required"
                                            invalid={
                                                filterForm.touched.academicYearId &&
                                                    filterForm.errors.academicYearId
                                                    ? true
                                                    : false
                                            }
                                            error={
                                                filterForm.touched.academicYearId &&
                                                    filterForm.errors.academicYearId
                                                    ? filterForm.errors.academicYearId
                                                    : ""
                                            }
                                            isDisabled={location?.state?.pirId && true}
                                        />
                                    </div>

                                    <div className="tw-col-span-12 lg:tw-col-span-2">
                                        <SelectInput
                                            name="curriculumId"
                                            labelText="Curriculum"
                                            value={intResFilterState.curriculumId}
                                            onChange={handleChange}
                                            onBlur={filterForm.handleBlur}
                                            menuItems={curriculumTypes || []}
                                            valueKey="branchCurriculumId"
                                            textKey="curriculumName"
                                            labelClass="required"
                                            invalid={(filterForm.touched.curriculumId && filterForm.errors.curriculumId) ? true : false}
                                            error={(filterForm.touched.curriculumId && filterForm.errors.curriculumId) ? filterForm.errors.curriculumId : ""}
                                            isDisabled={location?.state?.pirId && true}
                                        />
                                    </div>

                                    <div className="tw-col-span-12 lg:tw-col-span-2">
                                        <SelectInput
                                            name="classId"
                                            labelText="Class"
                                            value={intResFilterState.classId}
                                            onChange={handleChange}
                                            onBlur={filterForm.handleBlur}
                                            menuItems={classTypes || []}
                                            valueKey="id"
                                            textKey="shortName"
                                            labelClass="required"
                                            invalid={(filterForm.touched.classId && filterForm.errors.classId) ? true : false}
                                            error={(filterForm.touched.classId && filterForm.errors.classId) ? filterForm.errors.classId : ""}
                                            isDisabled={location?.state?.pirId && true}
                                        />
                                    </div>

                                    <div className="tw-col-span-12 lg:tw-col-span-2">
                                        <DateInput
                                            name="interviewDate"
                                            value={intResFilterState.interviewDate}
                                            onChange={handleChange}
                                            onBlur={filterForm.handleBlur}
                                            labelText="Interview Date"
                                            labelClass="required"
                                            isDisabled={location?.state?.pirId && true}
                                            invalid={filterForm.touched.interviewDate &&
                                                filterForm.errors.interviewDate
                                                ? true
                                                : false}
                                            error={filterForm.touched.interviewDate &&
                                                filterForm.errors.interviewDate
                                                ? filterForm.errors.interviewDate
                                                : ""}
                                        />
                                    </div>

                                    <div className="tw-col-span-12 lg:tw-col-span-3 tw-flex tw-justify-center tw-items-end tw-mb-3">
                                        <Button
                                            type="submit"
                                            disabled={location?.state?.pirId && true}
                                            onClick={() => {
                                                filterForm.handleSubmit();
                                                setSearchString("");
                                            }}
                                            variant='soft'
                                        >
                                            Show Details
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="tw-p-4">
                                <div className="tw-grid tw-grid-cols-12">
                                    <div className="tw-col-span-12 lg:tw-col-span-4">
                                        <div className="tw-relative">
                                            <TextInput
                                                name="searchString"
                                                value={searchString}
                                                onChange={(event: any) => {
                                                    searchByRegNumberOrName(event.target.value);
                                                    setSearchString(event.target.value);
                                                }}
                                                formgroupClassName="tw-mb-0"
                                                isDisabled={location?.state?.pirId && true}
                                                placeHolder="Search Student by registration no or name ..."
                                            />
                                            <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 -tw-translate-y-1/2"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <TableContainer
                            columns={roleColumns || []}
                            data={panIntResList || []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            rowDataInfo={panelEmployeesListResp || []}
                            selectedMembersCallback={selectedEmployeeCallback}
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            onChangeInputHndlr={changeReferenceHandler}
                        />

                        <div className="tw-flex tw-justify-center tw-items-center tw-gap-6 tw-my-4">
                            <label className="tw-flex tw-items-center tw-gap-2">
                                <input
                                    type="checkbox"
                                    checked={smsAndEmail?.sms}
                                    onClick={() => {
                                        setSmsAndEmail((prev: any) => ({
                                            ...prev,
                                            sms: !prev.sms,
                                        }));
                                    }}
                                />
                                SMS
                            </label>

                            <label className="tw-flex tw-items-center tw-gap-2">
                                <input
                                    type="checkbox"
                                    checked={smsAndEmail?.email}
                                    onClick={() => {
                                        setSmsAndEmail((prev: any) => ({
                                            ...prev,
                                            email: !prev.email,
                                        }));
                                    }}
                                />
                                Email
                            </label>
                        </div>

                        <div className="tw-pr-10">
                            <div className="tw-mb-3 tw-flex tw-justify-end tw-items-end">
                                <Button
                                    type="submit"
                                    onClick={() => AddObservationAndInterviewForm.handleSubmit()}
                                    disabled={
                                        (submitButtonError === undefined ||
                                            submitButtonError ||
                                            showApiLoader) &&
                                        true
                                    }
                                    variant='primary'
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
            id="add-panel-interview-result"
            isOpen={addIntResModal.showModal}
            toggle={toggleIntResModal}
            modalTitle="Observation and Interviewer Report"
            modalSize="md"
        >

            <AddPanelInterViewModal
                isOpen={addIntResModal.showModal}
                observationId={addIntResModal.observationId}
                // reportChangeHandler={reportChangeHandler}
                toggle={toggleIntResModal}
                modalTitle="Observation and Interviewer Report"
                instituteId={instituteId}
                panIntResList={panIntResList}
                instituteName={"Observation and Interviewer Report"}
                branchId={addIntResModal.branchId}
                editBranchDetails={""}
            />
            </ModalContainerUpdated>
        </>
    )
}

export default AddPanelInterviewResult
