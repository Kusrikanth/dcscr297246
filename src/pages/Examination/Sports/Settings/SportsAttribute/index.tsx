import React, { useEffect, useMemo, useRef } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../../../hooks/modalhook";
import AddEditNewAttributeModal from "./AddEditNewAttributeModal";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import {
  delSportsAttributeItemAct,
  getSportsAttributeItemByIdAct,
  getSportsAttributeListAct,
} from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../../../Components/Common/Pagination";

const initialValues = {
  searchString: "",
  academicYearId: "",
};

const SportsAttribute = () => {
  const dispatch = useAppDispatch();
  const {
    openModal: addEditSportAttributeOpenModal,
    closeModal: addEditSportAttributeCloseModal,
    modalState: addEditSportAttributeModalState,
  } = useModal();
  const {
    openModal: delSportsAttributeOpenModal,
    closeModal: delSportsAttributeCloseModal,
    modalState: delSportsAttributeModalState,
  } = useModal();

  const {
    currentBranchIdResp: branchId,
    academicYearListResp,
    getSportsAttributesListResp,
    saveSportsAttributeItemResp,
    editSportsAttributeItemResp,
    delSportsAttributeItemResp,
    getExaminationSportsErrResp,
  } = useAppSelector(
    ({ appData, instAcademics, examinationSports }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,

      getSportsAttributesListResp:
        examinationSports.getSportsAttributesListResp,
      getSportsAttributeByIdResp: examinationSports.getSportsAttributeByIdResp,
      saveSportsAttributeItemResp:
        examinationSports.saveSportsAttributeItemResp,
      editSportsAttributeItemResp:
        examinationSports.editSportsAttributeItemResp,
      delSportsAttributeItemResp: examinationSports.delSportsAttributeItemResp,

      getExaminationSportsErrResp:
        examinationSports.getExaminationSportsErrResp,
    }),
    shallowEqual
  );

  const sportsAttributesFormik = useFormik({
    initialValues,
    onSubmit: (values) => {},
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
          addEditSportAttributeOpenModal(id);
          dispatch(
            getSportsAttributeItemByIdAct(
              generateActionPayload("get_sports_attribute_by_id", { id: id })
            )
          );
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
          delSportsAttributeOpenModal(id);
        },
      },
    ],
    [dispatch, addEditSportAttributeOpenModal, delSportsAttributeOpenModal]
  );

  function fetchSportsAttributesNames(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId: sportsAttributesFormik.values.academicYearId,
      ...paginationRef.current,
      ...otherProps,
    };

    dispatch(
      getSportsAttributeListAct(
        generateActionPayload("get_sports_attributes_list", undefined, payload)
      )
    );
  }

  function delSportNameItemHndlr() {
    dispatch(
      delSportsAttributeItemAct(
        generateActionPayload("del_sports_attribute_item", {
          id: delSportsAttributeModalState.modalData,
        })
      )
    );
  }

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    fetchSportsAttributesNames(paginationInfo);
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;

    if (name === "academicYearId") {
      sportsAttributesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchSportsAttributesNames({ [name]: value });
    } else if (name === "searchString") {
      sportsAttributesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchSportsAttributesNames({ [name]: value });
    }
  };

  const attributeSportsRef = useRef({
    prevSaveSportsAttributeItemResp: saveSportsAttributeItemResp,
    prevEditSportsAttributeItemResp: editSportsAttributeItemResp,
    prevDelSportsAttributeItemResp: delSportsAttributeItemResp,
    prevGetExaminationSportsErrResp: getExaminationSportsErrResp,
  });

  useEffect(() => {
    const {
      prevSaveSportsAttributeItemResp,
      prevEditSportsAttributeItemResp,
      prevDelSportsAttributeItemResp,
      prevGetExaminationSportsErrResp,
    } = attributeSportsRef.current;

    if (
      saveSportsAttributeItemResp &&
      saveSportsAttributeItemResp !== prevSaveSportsAttributeItemResp
    ) {
      toast.success("Sport Attribute added successfully");
      fetchSportsAttributesNames();
      addEditSportAttributeCloseModal();
    } else if (
      editSportsAttributeItemResp &&
      editSportsAttributeItemResp !== prevEditSportsAttributeItemResp
    ) {
      toast.success("Sport Attribute updated successfully");
      fetchSportsAttributesNames();
      addEditSportAttributeCloseModal();
    } else if (
      delSportsAttributeItemResp &&
      delSportsAttributeItemResp !== prevDelSportsAttributeItemResp
    ) {
      toast.success("Sport Attribute deleted successfully");
      fetchSportsAttributesNames();
      delSportsAttributeCloseModal();
    } else if (
      getExaminationSportsErrResp &&
      getExaminationSportsErrResp !== prevGetExaminationSportsErrResp
    ) {
      const { details } = getExaminationSportsErrResp;
      toast.error(details || "Something went wrong");
    }

    attributeSportsRef.current.prevSaveSportsAttributeItemResp =
      saveSportsAttributeItemResp;
    attributeSportsRef.current.prevEditSportsAttributeItemResp =
      editSportsAttributeItemResp;
    attributeSportsRef.current.prevDelSportsAttributeItemResp =
      delSportsAttributeItemResp;
    attributeSportsRef.current.prevGetExaminationSportsErrResp =
      getExaminationSportsErrResp;
  }, [
    saveSportsAttributeItemResp,
    editSportsAttributeItemResp,
    delSportsAttributeItemResp,
    getExaminationSportsErrResp,
  ]);

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    sportsAttributesFormik.setFieldValue("academicYearId", yearId);
    fetchSportsAttributesNames({ academicYearId: yearId });
  }, [academicYearListResp]);

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions]
  );

  const { data: academicYearList } = academicYearListResp || {};
  const {
    data: sportsAttributesList,
    totalElements,
    totalPages,
    pageNumber,
  } = getSportsAttributesListResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Examination" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Sports Attribute
                  </h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row px-3 g-3 pt-3">
                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-3"
                      placeHolder="Search..."
                      value={sportsAttributesFormik.values.searchString}
                      onChange={filterHandler}
                      floatingLabel
                      labelText="Search"
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="academicYearId"
                    value={sportsAttributesFormik.values.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>
                <div className="col-auto ms-auto">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => addEditSportAttributeOpenModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={tableColumns || []}
                data={
                  Array.isArray(sportsAttributesList)
                    ? sportsAttributesList
                    : []
                }
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
              />
            </div>
          </div>
        </div>
      </div>

      <ModalContainerUpdated
        id="add-edit-sports-attribute-modal"
        isOpen={addEditSportAttributeModalState.showModal}
        toggle={addEditSportAttributeCloseModal}
        modalTitle={
          addEditSportAttributeModalState.modalData
            ? "Edit Sports Attribute"
            : "Add Sports Attribute"
        }
        modalSize="md"
      >
        <AddEditNewAttributeModal
          isOpen={addEditSportAttributeModalState.showModal}
          toggle={addEditSportAttributeCloseModal}
          attributeId={addEditSportAttributeModalState.modalData}
        ></AddEditNewAttributeModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-sports-name-modal"
        isOpen={delSportsAttributeModalState.showModal}
        confirmMessage="Are you sure you want to delete this Sports Attribute?"
        cancelHndlr={delSportsAttributeCloseModal}
        confirmHndlr={delSportNameItemHndlr}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default SportsAttribute;
