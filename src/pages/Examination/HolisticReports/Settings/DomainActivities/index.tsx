import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ConfirmationModal,
  CustomSelect,
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, renderOptionsEmployee, renderValueSection, tableData } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../../../hooks/modalhook";
import AddEditNewSportsModal from "./AddEditNewSportsModal";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import {
  delSportsNameItemAct,
  getSportsNameItemByIdAct,
  getSportsNamesAct,
} from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { useFormik } from "formik";
import { debounce } from "../../../../../utility/commonutility";
import { deleteHolisticDomainActivityAct, getHolisticDomainAct, getHolisticDomainActivityAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";

const initialValues = {
  domain: "",
};

const CurriculumGoals = () => {
  const {
    openModal: addEditSportNameOpenModal,
    closeModal: addEditSportNameCloseModal,
    modalState: addEditSportNameModalState,
  } = useModal();
  const {
    openModal: delSportsNameOpenModal,
    closeModal: delSportsNameCloseModal,
    modalState: delSportsNameModalState,
  } = useModal();

  const dispatch = useAppDispatch();
  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    currentBranchIdResp: branchId,
    getSportsNamesResp,
    saveHolisticDomainActivityResp,
    getHolisticDomainActivityResp,
    editSportsNameItemResp,
    deleteHolisticDomainActivityResp,
    getExaminationSportsErrResp,
    getHolisticDomainResp,
    cbseExaminationErrorAct
  } = useAppSelector(
    ({ appData, examinationSports, examinationSettings }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      getSportsNamesResp: examinationSports.getSportsNamesResp,
      saveHolisticDomainActivityResp: examinationSettings.saveHolisticDomainActivityResp,
      editSportsNameItemResp: examinationSports.editSportsNameItemResp,
      deleteHolisticDomainActivityResp: examinationSettings.deleteHolisticDomainActivityResp,
      getExaminationSportsErrResp:
      examinationSports.getExaminationSportsErrResp,
      getHolisticDomainResp: examinationSettings.getHolisticDomainResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
      getHolisticDomainActivityResp: examinationSettings.getHolisticDomainActivityResp
    }),
    shallowEqual
  );

  const sportsNameFormik = useFormik({
    initialValues,
    onSubmit: (value) => {},
  });

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          addEditSportNameOpenModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="text-danger"
            size={18}
          />
        ),
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          delSportsNameOpenModal(id);
        },
      },
    ],
    []
  );

   const getHolisticDomainApiCall = (otherProps?: any) => {
        dispatch(getHolisticDomainAct(generateActionPayload("get_holistic_domain", undefined, {})));
      };
   const getDomainActivityApiCall = (otherProps?: any) => {
    const payload = {
      domainId: sportsNameFormik.values.domain,
      ...otherProps,
    }
        dispatch(getHolisticDomainActivityAct(generateActionPayload("get_holistic_domain_activity", undefined, payload)));
      };

  useEffect(() => {
    getHolisticDomainApiCall();
    getDomainActivityApiCall();
  }, []);
  function delSportNameItemHndlr() {
    dispatch(
      deleteHolisticDomainActivityAct(
        generateActionPayload("delete_holistic_domain_activity", {
          id: delSportsNameModalState.modalData,
        })
      )
    );
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
  }

  function search(value: string) {
   
  }

  const debounceFun = useCallback(debounce(search, 200), [getSportsNamesResp]);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;

    if (name === "searchString") {
      sportsNameFormik.setValues((prev: any) => ({ ...prev, [name]: value }));
      debounceFun(value);
    }
  };

  const sportsNamesRef = useRef({
    prevSaveHolisticDomainActivityResp: saveHolisticDomainActivityResp,
    prevDeleteHolisticDomainActivityResp: deleteHolisticDomainActivityResp,
    // prevSaveDomainOrderResp: saveDomainOrderResp,
    prevCbseExaminationErrorAct: cbseExaminationErrorAct,
  });

  useEffect(() => {
    const {
      prevSaveHolisticDomainActivityResp,
      prevDeleteHolisticDomainActivityResp,
      // prevSaveDomainOrderResp,
      prevCbseExaminationErrorAct,
    } = sportsNamesRef.current;

    if (
      saveHolisticDomainActivityResp &&
      saveHolisticDomainActivityResp !== prevSaveHolisticDomainActivityResp
    ) {
      getDomainActivityApiCall();
      addEditSportNameCloseModal();
      if(addEditSportNameModalState.modalData){
        toast.success("Domain Activity updated successfully");
      }
      else{
        toast.success("Domain Activity added successfully");
      }
    } 
    else if (
      deleteHolisticDomainActivityResp &&
      deleteHolisticDomainActivityResp !== prevDeleteHolisticDomainActivityResp
    ) {
      toast.success("Domain Activity deleted successfully");
      getDomainActivityApiCall();
      delSportsNameCloseModal();
    } 
    // else if (
    //   saveDomainOrderResp &&
    //   saveDomainOrderResp !== prevSaveDomainOrderResp
    // ) {
    //   toast.success("Domain Order updated successfully");
    //   delSportsNameCloseModal();
    //   getHolisticDomainApiCall();
    // } 
    else if (
      cbseExaminationErrorAct &&
      cbseExaminationErrorAct !== prevCbseExaminationErrorAct
    ) {
      const { details } = cbseExaminationErrorAct;
      toast.error(details || "Something went wrong");
    }

    sportsNamesRef.current.prevSaveHolisticDomainActivityResp = saveHolisticDomainActivityResp;
    sportsNamesRef.current.prevDeleteHolisticDomainActivityResp = deleteHolisticDomainActivityResp;
    // sportsNamesRef.current.prevSaveDomainOrderResp = saveDomainOrderResp;
    sportsNamesRef.current.prevCbseExaminationErrorAct = cbseExaminationErrorAct;
  }, [
    saveHolisticDomainActivityResp,
    deleteHolisticDomainActivityResp,
    // saveDomainOrderResp,
    cbseExaminationErrorAct,
  ]);

  function selectSectionHndlr(selectedOptions: number | number[], config?: any) {
        const { name } = config;
        const selectedContactPerson = getHolisticDomainResp.find((item: { id: number }) => +item.id === +selectedOptions);
        if (selectedContactPerson) {          
            sportsNameFormik.setValues((prevState) => ({
                ...prevState, [name]: selectedOptions
            }))
            getDomainActivityApiCall({ domainId: selectedContactPerson.id });
        }
        else {
            sportsNameFormik.setValues((prevState) => ({ ...prevState, [name]: selectedOptions }))
        }
    }

  function onSearchMultiSelectHandleremployee(name:any , value: string) {
    
          if (value) {
              // const params = { searchString: value };
              // dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { instituteGroupId: 1 })));
          }
      }

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions]
  );

  const {
    data: sportsGradesList,
    totalElements,
    totalPages,
    pageNumber,
  } = getSportsNamesResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">Domain Activities</h4>
                </div>
                <div className="col-auto ms-auto">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => addEditSportNameOpenModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row px-3 pt-2">
                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                  {/* <SelectInput
                    name="domain"
                    value={sportsNameFormik.values.domain}
                    onChange={filterHandler}
                    menuItems={getHolisticDomainResp || []}
                    valueKey="id"
                    textKey={"domainIndex" + "name"}
                    labelText="Domain"
                    floatingLabel
                  /> */}
                  <CustomSelect
                    name="domain"
                    idKey="id"
                    defaultSelect="Select"
                    value={sportsNameFormik.values.domain}
                    renderValue={renderValueSection}
                    renderOptions={renderOptionsEmployee}
                    onChange={selectSectionHndlr}
                    onSearchHandler={onSearchMultiSelectHandleremployee}
                    labelText='Domain'
                    containerClassName="mb-3"
                    options={getHolisticDomainResp || []}

                  />
                </div>
                
              </div>

              <TableContainer
                columns={tableColumns || []}
                data={ getHolisticDomainActivityResp || []}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showPagination={false}
                totalPages={ 0}
                totalRecords={ 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={ 0}
              />
            </div>
          </div>
        </div>
      </div>

      <ModalContainerUpdated
        id="add-edit-sports-names-modal"
        isOpen={addEditSportNameModalState.showModal}
        toggle={addEditSportNameCloseModal}
        modalTitle={
          addEditSportNameModalState.modalData
            ? "Edit Curricular Goal"
            : "Add Curricular Goal"
        }
        modalSize="md"
      >
        <AddEditNewSportsModal
          toggle={addEditSportNameCloseModal}
          id={addEditSportNameModalState.modalData}
        ></AddEditNewSportsModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-sports-name-modal"
        isOpen={delSportsNameModalState.showModal}
        confirmMessage="Are you sure you want to delete this record?"
        cancelHndlr={delSportsNameCloseModal}
        confirmHndlr={delSportNameItemHndlr}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default CurriculumGoals;
