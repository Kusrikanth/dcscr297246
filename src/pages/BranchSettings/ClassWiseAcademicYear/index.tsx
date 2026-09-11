import { useFormik } from 'formik';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from '../../../Components/Common'
import TableContainer from '../../../Components/Common/TableContainer';
import { useAppSelector } from '../../../hooks/storehook';
import { resetBrchClassAct, deleteAcademicDatesAct, getBranchClassWiseTermIdAct, getBranchCurriculumAct, resetBrchCurriculumAct } from '../../../store/branchsettings/branchacademics/branchacademicsactions';
import { getInstAcademicYearAct } from '../../../store/mastersettings/instacademics/instacademicactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import AddAcademicYearDateModal from './AddAcademicYearDateModal';
import { AcademicDatesFilterhProps, IAcademicResp, IDelAcademicDateModalState, ModalType } from './ClassWiseAcademicYearTypes';
import {  generateColumns, } from './helper';

import { toast } from "react-toastify";
import { IPaginationState } from '../../../Components/Common/Pagination';
import { sortRef } from '../../MasterSetup/Terms/academictermstypes';
import Button from '../../../Components/Common/Button';


interface IClassTermProps {
  instituteId: string,
  branchId: string,
  instituteName: string
}

const initialValues: AcademicDatesFilterhProps = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
};

const ClassWiseAcademicYear: React.FC<IClassTermProps> = ({ instituteId, branchId }) => {

  const dispatch = useDispatch();

  const [academicDatesFilterState, setAcademicDatesFilterState] =
    useState<AcademicDatesFilterhProps>(initialValues);


  const [languagesFilterState, setLanguagesFilterState] =
    useState<any>({
      search: "",
      academicYearId: "",
      curriculumId: "",
      pageNo: 0,
      pageSize: 10,
      sortBy: "className",
      orderBy: "asc"
    });

  const [addAcademicYearDateModalState, setAddAcademicYearDateModalState] = useState<ModalType>({
    showModal: false,
    branchId: branchId,
    modalData: undefined
  });

  const [delAcademicDateModalState, setDelAcademicDateModalState] =
    useState<IDelAcademicDateModalState>({
      showModal: false,
      classId: "",
    });

  const AcademicDatesFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: academicDatesFilterState,
    onSubmit: (values) => { },
  });

  function delModalSubmitHndlr() {
    const { classId } = delAcademicDateModalState;

    const apiParams = {
      classId: classId,
    }

    dispatch(
      deleteAcademicDatesAct(
        generateActionPayload("del_branch_academic_class_date", apiParams)
      )
    );
  }

  function deleteLanguageHndlr(event: any) {
    const classId = event.currentTarget.getAttribute("data-id");

    if (classId)
      setDelAcademicDateModalState((prevState) => ({
        ...prevState,
        showModal: true,
        classId,
      }));
  }

  function delModalCancelHndlr() {
    setDelAcademicDateModalState((prevState) => ({
      ...prevState,
      showModal: false,
      classId: "",
    }));
  }



  const toggleAddAcademicYearDateModal = () => {
    setAddAcademicYearDateModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
      modalData: undefined
    }));
  };

  const { academicYearListResp, brchCurriculumResp, classBranchWiseTermsIdResp, deleteAcademicDateRep, addAcademicDateRep, updateAcademicDateRep, instInfoError } = useAppSelector(
    ({ instAcademics, branchAcademics }: any) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      classBranchWiseTermsIdResp: branchAcademics.classBranchWiseTermsIdResp,
      deleteAcademicDateRep: branchAcademics.deleteAcademicDateRep,
      addAcademicDateRep: branchAcademics.addAcademicDateRep,
      updateAcademicDateRep: branchAcademics.updateAcademicDateRep,
      instInfoError: branchAcademics.instInfoError,
    }),
    shallowEqual
  );


  const menuOptions = useMemo(() => ([{
    id: "edit",
    actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
    actionName: "Edit",
    onClickHndlr: (event: any) => {
      let id = event.currentTarget.getAttribute("data-id");
      let data =
        classBranchWiseTermsIdResp &&
        classBranchWiseTermsIdResp.content.find((d: any) => +d.id === +id);
      setAddAcademicYearDateModalState((prevState) => ({
        ...prevState,
        showModal: !prevState.showModal,
        modalData: data,
      }));
    },
  }, {
    id: "delete",
    actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
    actionName: "Delete",
    onClickHndlr: deleteLanguageHndlr,
  }]), [classBranchWiseTermsIdResp]);

  const academicTermsColumns = useMemo(() => generateColumns(menuOptions), [classBranchWiseTermsIdResp]);


  const getClassWiseTermsDateApiCall = (otherProps?: any) => {

    //   const payload = {instituteId, ...languagesFilterState, ...paginationDetailRef.current, ...otherProps };
    //   dispatch(
    //     getAcademicLanguagesDataAct(
    //       generateActionPayload("get_academic_language_data", undefined, payload)
    //     )
    //   );
    // if(payload.academicYearId){
    let payload = { branchId, ...languagesFilterState, ...otherProps }
    dispatch(
      getBranchClassWiseTermIdAct(
        generateActionPayload("get_branch_academic_class_date", undefined, { ...payload, branchId: branchId })
      )
    );
    // }
  }

  useEffect(() => {
    if (instituteId && !classBranchWiseTermsIdResp) {
      getClassWiseTermsDateApiCall();
    }
  }, [languagesFilterState]);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: AcademicDatesFilterForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
}

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === 'current').academicYearId;
    setLanguagesFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    AcademicDatesFilterForm.setValues(prev => ({ ...prev, academicYearId: yearId }))
    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp])

  useEffect(() => {
    if (instituteId && !academicYearListResp) {
      const payload = { instituteId, pageNo: 0, pageSize: 100, orderBy: "desc", sortBy: "academicYearName" };
      dispatch(
        getInstAcademicYearAct(
          generateActionPayload("get_inst_academic_year", undefined, payload)
        )
      );
    }
  }, [instituteId, academicYearListResp]);


  useEffect(() => {
    return () => {
      dispatch(resetBrchClassAct(undefined))
      dispatch(resetBrchCurriculumAct(undefined))
    }
  }, [])

  const languageRespRef = useRef<IAcademicResp>({
    prevDeleteAcademicDateRep: deleteAcademicDateRep,
    prevAddAcademicDateRep: addAcademicDateRep,
    prevUpdateAcademicDateRep: updateAcademicDateRep,
    prevAcademicErrorRep: instInfoError,
  });

  const sortByPrevRef = useRef<Array<sortRef>>([{
    id: "className",
    desc: false
  }])

  const sortingHandler = useCallback((sortBy: any) => {
    const sortByPrev = sortByPrevRef.current;
    setLanguagesFilterState((prev: any) => ({ ...prev, sortBy: sortBy[0].id, orderBy: sortBy[0].desc ? "desc" : "asc" }))
    if (sortBy && sortByPrev !== sortBy) {
      getClassWiseTermsDateApiCall({ sortBy: sortBy[0].id, orderBy: sortBy[0].desc ? "desc" : "asc" })
    }
    sortByPrevRef.current = sortBy;
  }, [languagesFilterState])

  useEffect(() => {
    const { prevDeleteAcademicDateRep, prevAddAcademicDateRep, prevUpdateAcademicDateRep, prevAcademicErrorRep } =
      languageRespRef.current;

    if (
      deleteAcademicDateRep &&
      prevDeleteAcademicDateRep !== deleteAcademicDateRep
    ) {
      setDelAcademicDateModalState((prevState) => ({
        ...prevState,
        showModal: false,
        classId: "",
      }));

      toast.success("Academic Date deleted successfully.");

      getClassWiseTermsDateApiCall();
    }
    else if (addAcademicDateRep && addAcademicDateRep !== prevAddAcademicDateRep) {
      setAddAcademicYearDateModalState((prevState) => ({
        ...prevState,
        showModal: false,
        classId: "",
      }));

      toast.success("Academic Date Added successfully.");

      getClassWiseTermsDateApiCall({ sortBy: "", pageNo: 0 });
    }
    else if (updateAcademicDateRep && updateAcademicDateRep !== prevUpdateAcademicDateRep) {
      setAddAcademicYearDateModalState((prevState) => ({
        ...prevState,
        showModal: false,
        classId: "",
      }));

      toast.success("Academic Date Updated successfully.");

      getClassWiseTermsDateApiCall({ sortBy: "", pageNo: 0 });
    }
    else if (instInfoError && instInfoError !== prevAcademicErrorRep) {
      const { message }: any = instInfoError;
      toast.error(message);
    }

    languageRespRef.current.prevDeleteAcademicDateRep = deleteAcademicDateRep;
    languageRespRef.current.prevAcademicErrorRep = instInfoError;

  }, [deleteAcademicDateRep, addAcademicDateRep, updateAcademicDateRep, instInfoError,]);

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    AcademicDatesFilterForm.handleChange(event);
    const { name, value } = event.target;
    // paginationDetailRef.current.pageNo = 0;
    if(name === "academicYearId"){
      getCurriculumApiCall({ academicYearId: value });
      setLanguagesFilterState((prevState: any) => ({ ...prevState, [name]: value,curriculumId: "" }));
      getClassWiseTermsDateApiCall({ [name]: value,curriculumId: "" });
    }
    else{
      setLanguagesFilterState((prevState: any) => ({ ...prevState, [name]: value }));
      getClassWiseTermsDateApiCall({ [name]: value });
    }
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    setLanguagesFilterState((pre: any) => ({ ...pre, ...paginationInfo }))
    getClassWiseTermsDateApiCall(paginationInfo);
  }

  const { data: academiYear } = academicYearListResp || {}
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classBranchWiseTermsId, totalPages, totalElements, pageable } = classBranchWiseTermsIdResp || {}

  return (
    <>
      <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200">

        <div className="tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
          <div className="tw-flex tw-items-center tw-justify-between">

            <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
              Academic Dates
            </h4>

            <Button
              type="button"
              variant='primary'
              onClick={toggleAddAcademicYearDateModal}
            >
              <i className="ri-add-line tw-mr-2" />
              Add Dates
            </Button>

          </div>
        </div>

        <div className="tw-px-5 tw-py-4">
          <form onSubmit={AcademicDatesFilterForm.handleSubmit}>

            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

              <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-3">
                <div className="tw-relative">
                  <TextInput
                    name="searchString"
                    value={AcademicDatesFilterForm.values.searchString}
                    onChange={onChangeFilterHndlr}
                    inputClassName="tw-bg-gray-100"
                    formgroupClassName="tw-mb-0"
                    placeHolder="Search"
                    labelText="Search"
                    floatingLabel
                  />
                  <i className="ri-search-line tw-absolute tw-right-3 tw-top-3 tw-text-gray-400" />
                </div>
              </div>

              <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                <SelectInput
                  name="academicYearId"
                  value={AcademicDatesFilterForm.values.academicYearId}
                  onChange={onChangeFilterHndlr}
                  menuItems={academiYear}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  formgroupClassName="tw-mb-0"
                  labelText="Academic Year"
                  floatingLabel
                />
              </div>

              <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                <SelectInput
                  name="curriculumId"
                  value={AcademicDatesFilterForm.values.curriculumId}
                  onChange={onChangeFilterHndlr}
                  menuItems={curriculumTypes}
                  valueKey="branchCurriculumId"
                  textKey="curriculumName"
                  formgroupClassName="tw-mb-0"
                  labelText="Curriculum"
                  floatingLabel
                />
              </div>

            </div>

          </form>
        </div>

        <div className="tw-px-5 tw-pb-4">
          <TableContainer
            columns={academicTermsColumns || []}
            data={classBranchWiseTermsId ? classBranchWiseTermsId : []}
            divClass="tw-overflow-x-auto tw-mb-1"
            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-text-sm tw-align-middle"
            showPagination={true}
            totalPages={totalPages}
            totalRecords={totalElements}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageable && pageable.pageNumber}
            sortingHandler={sortingHandler}
          />
        </div>

      </div>
      <ModalContainerUpdated
          id="add-academic-year-date-modal"
          isOpen={addAcademicYearDateModalState.showModal}
          toggle={toggleAddAcademicYearDateModal}
          modalTitle={"Add Academic Year Date"}
          modalSize="lg"
            >
      <AddAcademicYearDateModal
        isOpen={addAcademicYearDateModalState.showModal}
        toggle={toggleAddAcademicYearDateModal}
        instituteId={instituteId}
        instituteName={"Add Academic Year Date"}
        branchId={branchId}
        editBranchDetails={""}
        modalData={addAcademicYearDateModalState.modalData}
      />
            </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-academic-date-modal"
        isOpen={delAcademicDateModalState.showModal}
        confirmMessage="Are you sure you want to delete this language ?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
      />

    </>
  )
}

export default ClassWiseAcademicYear