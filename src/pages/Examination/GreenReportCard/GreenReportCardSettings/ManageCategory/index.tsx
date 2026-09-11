import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useEffect, useMemo, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
} from '@hugeicons-pro/core-stroke-standard';
import { useModal } from '../../../../../hooks/modalhook';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import BreadCrumb from '../../../../../Components/Common/BreadCrumb';
import {
  ConfirmationModal,
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from '../../../../../Components/Common';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { generateColumns } from './helper';
import AddEditNewCategory from './AddEditNewCategory';
import { IPaginationState } from '../../../../../Components/Common/Pagination';
import {
  deleteGreenReportCardCategoryItemAct,
  getGreenReportCardCategoryByIdAct,
  getGreenReportCardCategoryListAct,
} from '../../../../../store/examination/pvaReports/pvaReportsActions';
import { getAssignCurriculumListAct } from '../../../../../store/assignlanguages/assignlanguagesaction';

const initialValues = {
  searchString: '',
  academicYearId: '',
  curriculumId: '',
};

const ManageCategory = () => {
  const {
    closeModal: categoryCloseModal,
    modalState: categoryAddEditModalState,
    openModal: categoryOpenModal,
  } = useModal();
  const {
    closeModal: delCategoryCloseModal,
    modalState: delCategoryModalState,
    openModal: delCategoryOpenModal,
  } = useModal();

  const dispatch = useAppDispatch();
  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    academicYearListResp,
    getAssignListCurriculumResp,
    showApiLoader,
    getGreenReportCardCategoryListResp,
    saveGreenReportCardCategoryItemResp,
    updateGreenReportCardCategoryItemResp,
    deleteGreenReportCardCategoryItemResp,
    pvaReportsErrorAct,
  } = useAppSelector(
    ({
      globalData,
      branchAcademics,
      appData,
      instAcademics,
      pvaReports,
      assignLanguages,
    }) => ({
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      academicYearListResp: instAcademics.academicYearListResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      getGreenReportCardCategoryListResp:
        pvaReports.getGreenReportCardCategoryListResp,
      saveGreenReportCardCategoryItemResp:
        pvaReports.saveGreenReportCardCategoryItemResp,
      updateGreenReportCardCategoryItemResp:
        pvaReports.updateGreenReportCardCategoryItemResp,
      deleteGreenReportCardCategoryItemResp:
        pvaReports.deleteGreenReportCardCategoryItemResp,
      pvaReportsErrorAct: pvaReports.pvaReportsErrorAct,
    }),
    shallowEqual,
  );

  const manageCategoryFormik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => {},
  });

  const menuOptions = useMemo(
    () => [
      {
        id: 'edit',
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={20}
          />
        ),
        actionName: 'Edit',
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          categoryOpenModal(id);
          dispatch(
            getGreenReportCardCategoryByIdAct(
              generateActionPayload(
                'get_green_report_card_category_by_id',
                { id: id },
                undefined,
              ),
            ),
          );
        },
      },
      {
        id: 'delete',
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="text-danger"
            size={18}
          />
        ),
        actionName: 'Delete',
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          delCategoryOpenModal(id);
        },
      },
    ],
    [],
  );

  function delModalSubmitHndlr() {
    dispatch(
      deleteGreenReportCardCategoryItemAct(
        generateActionPayload('delete_green_report_card_category_item', {
          id: delCategoryModalState.modalData,
        }),
      ),
    );
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = {
      academicYearId: manageCategoryFormik.values?.academicYearId,
      branchId: branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: 'curriculumName',
      orderBy: 'asc',
      ...otherProps,
    };
    dispatch(
      getAssignCurriculumListAct(
        generateActionPayload('get_brch_curriculum', undefined, payload1),
      ),
    );
  };

  function fetchGreenReportCardCategoryList(otherProps?: any) {
    const { academicYearId, searchString,curriculumId } = manageCategoryFormik.values;
    const payload = {
      branchId,
      academicYearId,
      curriculumId,
      searchString,
      orderBy: 'desc',
      ...otherProps,
      ...paginationRef.current,
    };
    dispatch(
      getGreenReportCardCategoryListAct(
        generateActionPayload(
          'get_green_report_card_category_list',
          undefined,
          payload,
        ),
      ),
    );
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    fetchGreenReportCardCategoryList(paginationInfo);
  }

  useEffect(() => {
    const yearId = academicYearListResp?.data.find(
      (year: any) => year.yearStatus.toLowerCase() === 'current',
    )?.academicYearId;
    if (yearId) {
      manageCategoryFormik.setFieldValue('academicYearId', yearId);
      fetchGreenReportCardCategoryList({ academicYearId: yearId });
      getCurriculumApiCall({ academicYearId: yearId });
    }
  }, [academicYearListResp]);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;

    if (name === 'academicYearId') {
      manageCategoryFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: '',
      }));
      fetchGreenReportCardCategoryList({ [name]: value });
    }
    if (name === 'curriculumId') {
      manageCategoryFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchGreenReportCardCategoryList({ [name]: value });
    } else if (name === 'searchString') {
      manageCategoryFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchGreenReportCardCategoryList({ searchString: value });
    }
  };

  const manageCategoryRef = useRef({
    prevSaveGreenReportCardCategoryItemResp:
      saveGreenReportCardCategoryItemResp,
    prevUpdateGreenReportCardCategoryItemResp:
      updateGreenReportCardCategoryItemResp,
    prevDeleteGreenReportCardCategoryItemResp:
      deleteGreenReportCardCategoryItemResp,
    prevPvaReportsErrorAct: pvaReportsErrorAct,
  });

  useEffect(() => {
    const {
      prevSaveGreenReportCardCategoryItemResp,
      prevUpdateGreenReportCardCategoryItemResp,
      prevDeleteGreenReportCardCategoryItemResp,
      prevPvaReportsErrorAct,
    } = manageCategoryRef.current;
    if (
      saveGreenReportCardCategoryItemResp &&
      saveGreenReportCardCategoryItemResp !==
        prevSaveGreenReportCardCategoryItemResp
    ) {
      toast.success('Categories added successfully');
      categoryCloseModal();
      fetchGreenReportCardCategoryList();
    } else if (
      updateGreenReportCardCategoryItemResp &&
      updateGreenReportCardCategoryItemResp !==
        prevUpdateGreenReportCardCategoryItemResp
    ) {
      toast.success('Category updated successfully');
      categoryCloseModal();
      fetchGreenReportCardCategoryList();
    } else if (
      deleteGreenReportCardCategoryItemResp &&
      deleteGreenReportCardCategoryItemResp !==
        prevDeleteGreenReportCardCategoryItemResp
    ) {
      toast.success('Category deleted successfully');
      delCategoryCloseModal();
      fetchGreenReportCardCategoryList();
    } else if (
      pvaReportsErrorAct &&
      pvaReportsErrorAct !== prevPvaReportsErrorAct
    ) {
      const { details } = pvaReportsErrorAct;
      toast.error(details || 'Something went wrong');
    }

    manageCategoryRef.current.prevSaveGreenReportCardCategoryItemResp =
      saveGreenReportCardCategoryItemResp;
    manageCategoryRef.current.prevUpdateGreenReportCardCategoryItemResp =
      updateGreenReportCardCategoryItemResp;
    manageCategoryRef.current.prevDeleteGreenReportCardCategoryItemResp =
      deleteGreenReportCardCategoryItemResp;
    manageCategoryRef.current.prevPvaReportsErrorAct = pvaReportsErrorAct;
  }, [
    saveGreenReportCardCategoryItemResp,
    updateGreenReportCardCategoryItemResp,
    deleteGreenReportCardCategoryItemResp,
    pvaReportsErrorAct,
  ]);

  const columns = useMemo(() => generateColumns(menuOptions), []);
  const { data: curriculumTypes } = getAssignListCurriculumResp || {} || {};
  const {
    content: greenReportCardCategoriesList,
    totalPages,
    totalElements,
    pageable,
  } = getGreenReportCardCategoryListResp || {};

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />
          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Manage Categories
                  </h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row w-100 px-3 g-3 py-3 mx-auto">
                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-0"
                      placeHolder="Search"
                      labelText="Search"
                      floatingLabel
                      inputClassName=""
                      value={manageCategoryFormik.values.searchString}
                      onChange={filterHandler}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="academicYearId"
                    value={manageCategoryFormik.values.academicYearId}
                    onChange={filterHandler}
                    menuItems={
                      Array.isArray(academicYearList) ? academicYearList : []
                    }
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText="Academic Year"
                    floatingLabel
                    inputClassName=""
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={manageCategoryFormik.values.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="shortName"
                    labelText="Curriculum"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>
                <div className="col-auto ms-auto">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => categoryOpenModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>
              <TableContainer
                columns={columns || []}
                data={
                  Array.isArray(greenReportCardCategoriesList)
                    ? greenReportCardCategoriesList
                    : []
                }
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber || 0}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-edit-new-category-modal"
        isOpen={categoryAddEditModalState.showModal}
        toggle={() => categoryCloseModal()}
        modalTitle={
          categoryAddEditModalState.modalData ? 'Edit Category' : 'Add Category'
        }
        modalSize="lg"
      >
        <AddEditNewCategory
          editId={categoryAddEditModalState.modalData}
          isOpen={categoryAddEditModalState.showModal}
          toggle={() => categoryCloseModal()}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-examination-category-modal"
        isOpen={delCategoryModalState.showModal}
        confirmMessage="Are you sure you want to delete this record ?"
        cancelHndlr={delCategoryCloseModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default ManageCategory;
