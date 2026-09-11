import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  TextInput,
} from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
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

const initialValues = {
  searchString: "",
};

const Sports = () => {
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
    saveSportsNameItemResp,
    editSportsNameItemResp,
    delSportsNameItemResp,
    getExaminationSportsErrResp,
  } = useAppSelector(
    ({ appData, examinationSports }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      getSportsNamesResp: examinationSports.getSportsNamesResp,
      saveSportsNameItemResp: examinationSports.saveSportsNameItemResp,
      editSportsNameItemResp: examinationSports.editSportsNameItemResp,
      delSportsNameItemResp: examinationSports.delSportsNameItemResp,
      getExaminationSportsErrResp:
        examinationSports.getExaminationSportsErrResp,
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
          dispatch(
            getSportsNameItemByIdAct(
              generateActionPayload("get_sports_name_by_id", { id: id })
            )
          );
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

  function fetchExaminationSportsNames(otherProps?: any) {
    const payload = {
      branchId,
      ...paginationRef.current,
      ...otherProps,
    };

    dispatch(
      getSportsNamesAct(
        generateActionPayload("get_sports_names", undefined, payload)
      )
    );
  }

  function delSportNameItemHndlr() {
    dispatch(
      delSportsNameItemAct(
        generateActionPayload("del_sports_name_item", {
          id: delSportsNameModalState.modalData,
        })
      )
    );
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    fetchExaminationSportsNames(paginationInfo);
  }

  function search(value: string) {
    fetchExaminationSportsNames({
      ...sportsNameFormik.values,
      searchString: value,
    });
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
    prevSaveSportsNameItemResp: saveSportsNameItemResp,
    prevEditSportsNameItemResp: editSportsNameItemResp,
    prevDelSportsNameItemResp: delSportsNameItemResp,
    prevGetExaminationSportsErrResp: getExaminationSportsErrResp,
  });

  useEffect(() => {
    const {
      prevSaveSportsNameItemResp,
      prevEditSportsNameItemResp,
      prevDelSportsNameItemResp,
      prevGetExaminationSportsErrResp,
    } = sportsNamesRef.current;

    if (
      saveSportsNameItemResp &&
      saveSportsNameItemResp !== prevSaveSportsNameItemResp
    ) {
      toast.success("Sport Name added successfully");
      fetchExaminationSportsNames();
      addEditSportNameCloseModal();
    } else if (
      editSportsNameItemResp &&
      editSportsNameItemResp !== prevEditSportsNameItemResp
    ) {
      toast.success("Sport Name updated successfully");
      fetchExaminationSportsNames();
      addEditSportNameCloseModal();
    } else if (
      delSportsNameItemResp &&
      delSportsNameItemResp !== prevDelSportsNameItemResp
    ) {
      toast.success("Sport Name deleted successfully");
      fetchExaminationSportsNames();
      delSportsNameCloseModal();
    } else if (
      getExaminationSportsErrResp &&
      getExaminationSportsErrResp !== prevGetExaminationSportsErrResp
    ) {
      const { details } = getExaminationSportsErrResp;
      toast.error(details || "Something went wrong");
    }

    sportsNamesRef.current.prevSaveSportsNameItemResp = saveSportsNameItemResp;
    sportsNamesRef.current.prevEditSportsNameItemResp = editSportsNameItemResp;
    sportsNamesRef.current.prevDelSportsNameItemResp = delSportsNameItemResp;
    sportsNamesRef.current.prevGetExaminationSportsErrResp =
      getExaminationSportsErrResp;
  }, [
    saveSportsNameItemResp,
    editSportsNameItemResp,
    delSportsNameItemResp,
    getExaminationSportsErrResp,
  ]);

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions]
  );

  useEffect(() => {
    fetchExaminationSportsNames();
  }, []);

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
                  <h4 className="card-title mb-0 flex-grow-1">Sports</h4>
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
                      value={sportsNameFormik.values.searchString}
                      onChange={filterHandler}
                      floatingLabel
                      labelText="Search"
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
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

              <TableContainer
                columns={tableColumns || []}
                data={Array.isArray(sportsGradesList) ? sportsGradesList : []}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber || 0}
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
            ? "Edit Sports Name"
            : "Add Sports Name"
        }
        modalSize="md"
      >
        <AddEditNewSportsModal
          toggle={addEditSportNameCloseModal}
          sportsId={addEditSportNameModalState.modalData}
        ></AddEditNewSportsModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-sports-name-modal"
        isOpen={delSportsNameModalState.showModal}
        confirmMessage="Are you sure you want to delete this Sports?"
        cancelHndlr={delSportsNameCloseModal}
        confirmHndlr={delSportNameItemHndlr}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default Sports;
