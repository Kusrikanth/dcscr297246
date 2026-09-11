import { useEffect, useMemo, useRef } from "react";
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
import AddEditNewGradeModal from "./AddEditNewGradeModal";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import {
  delSportsGradeItemAct,
  getSportsGradeItemByIdAct,
  getSportsGradeListAct,
} from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const initialValues = {
  academicYearId: "",
};

const GradeSettings = () => {
  const {
    openModal: addEditGradeOpenModal,
    closeModal: addEditGradeCloseModal,
    modalState: addEditGradeModalState,
  } = useModal();
  const {
    openModal: delGradeOpenModal,
    closeModal: delGradeCloseModal,
    modalState: delGradeModalState,
  } = useModal();

  const dispatch = useAppDispatch();
  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    currentBranchIdResp: branchId,
    academicYearListResp,
    getSportsGradesListResp,
    saveSportsGradeItemResp,
    editSportsGradeItemResp,
    delSportsGradeItemResp,
    getExaminationSportsErrResp,
  } = useAppSelector(
    ({ appData, instAcademics, examinationSports }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,

      getSportsGradesListResp: examinationSports.getSportsGradesListResp,
      saveSportsGradeItemResp: examinationSports.saveSportsGradeItemResp,
      editSportsGradeItemResp: examinationSports.editSportsGradeItemResp,
      delSportsGradeItemResp: examinationSports.delSportsGradeItemResp,
      getExaminationSportsErrResp:
        examinationSports.getExaminationSportsErrResp,
    }),
    shallowEqual
  );

  const sportsGradeFormik = useFormik({
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
          addEditGradeOpenModal(id);
          dispatch(
            getSportsGradeItemByIdAct(
              generateActionPayload("get_sports_grade_by_id", { id: id })
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
          delGradeOpenModal(id);
        },
      },
    ],
    [dispatch, addEditGradeOpenModal, delGradeOpenModal]
  );

  function fetchExaminationSportsGrades(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId: sportsGradeFormik.values.academicYearId,
      ...paginationRef.current,
      ...otherProps,
    };

    dispatch(
      getSportsGradeListAct(
        generateActionPayload("get_sports_grades_list", undefined, payload)
      )
    );
  }

  const delSportsGradeItemHndlr = () => {
    dispatch(
      delSportsGradeItemAct(
        generateActionPayload("del_sports_grade_item", {
          id: delGradeModalState.modalData,
        })
      )
    );
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    fetchExaminationSportsGrades(paginationInfo);
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;

    if (name === "academicYearId") {
      sportsGradeFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchExaminationSportsGrades({ [name]: value });
    }
  };

  const sportsGradeRef = useRef({
    prevSaveSportsGradeItemResp: saveSportsGradeItemResp,
    prevEditSportsGradeItemResp: editSportsGradeItemResp,
    prevDelSportsGradeItemResp: delSportsGradeItemResp,
    prevGetExaminationSportsErrResp: getExaminationSportsErrResp,
  });

  useEffect(() => {
    const {
      prevSaveSportsGradeItemResp,
      prevEditSportsGradeItemResp,
      prevDelSportsGradeItemResp,
      prevGetExaminationSportsErrResp,
    } = sportsGradeRef.current;

    if (
      saveSportsGradeItemResp &&
      saveSportsGradeItemResp !== prevSaveSportsGradeItemResp
    ) {
      toast.success("Sports Grade added successfully");
      fetchExaminationSportsGrades();
      addEditGradeCloseModal();
    } else if (
      editSportsGradeItemResp &&
      editSportsGradeItemResp !== prevEditSportsGradeItemResp
    ) {
      toast.success("Sports Grade updated successfully");
      fetchExaminationSportsGrades();
      addEditGradeCloseModal();
    } else if (
      delSportsGradeItemResp &&
      delSportsGradeItemResp !== prevDelSportsGradeItemResp
    ) {
      toast.success("Sports Grade deleted successfully");
      fetchExaminationSportsGrades();
      delGradeCloseModal();
    } else if (
      getExaminationSportsErrResp &&
      getExaminationSportsErrResp !== prevGetExaminationSportsErrResp
    ) {
      const { details } = getExaminationSportsErrResp;
      toast.error(details || "Something went wrong");
    }

    sportsGradeRef.current.prevSaveSportsGradeItemResp =
      saveSportsGradeItemResp;
    sportsGradeRef.current.prevEditSportsGradeItemResp =
      editSportsGradeItemResp;
    sportsGradeRef.current.prevDelSportsGradeItemResp = delSportsGradeItemResp;
    sportsGradeRef.current.prevGetExaminationSportsErrResp =
      getExaminationSportsErrResp;
  }, [
    saveSportsGradeItemResp,
    editSportsGradeItemResp,
    delSportsGradeItemResp,
    getExaminationSportsErrResp,
  ]);

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    sportsGradeFormik.setFieldValue("academicYearId", yearId);
    fetchExaminationSportsGrades({ academicYearId: yearId });
  }, [academicYearListResp]);

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions]
  );

  const { data: academicYearList } = academicYearListResp || {};

  const {
    data: sportsGradesList,
    totalElements,
    totalPages,
    pageNumber,
  } = getSportsGradesListResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Grade Settings
                  </h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row px-3 g-3 pt-3">
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="academicYearId"
                    value={sportsGradeFormik.values.academicYearId}
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
                    onClick={() => addEditGradeOpenModal()}
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
        id="add-edit-grade-modal"
        isOpen={addEditGradeModalState.showModal}
        toggle={addEditGradeCloseModal}
        modalTitle={
          addEditGradeModalState.modalData ? "Edit Grade" : "Add Grade"
        }
        modalSize="md"
      >
        <AddEditNewGradeModal
          toggle={addEditGradeCloseModal}
          gradeId={addEditGradeModalState.modalData}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-grade-modal"
        isOpen={delGradeModalState.showModal}
        confirmMessage="Are you sure you want to delete this grade?"
        cancelHndlr={delGradeCloseModal}
        confirmHndlr={delSportsGradeItemHndlr}
        iconType="reject"
      />
    </>
  );
};

export default GradeSettings;
