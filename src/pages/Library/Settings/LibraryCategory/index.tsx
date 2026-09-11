import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  TextInput,
} from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { generateColumns } from "./helper";
import { toast } from "react-toastify";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import {
  delLibraryCategoryItemAct,
  getLibraryCategoryItemByIdAct,
  getLibraryCategoryListAct,
} from "../../../../store/library/settings/librarysettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useModal } from "../../../../hooks/modalhook";
import AddEditNewCategoryModal from "./AddEditNewCategoryModal";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
};

const LibraryCategory = () => {
  const {
    openModal: addEditNewCategoryOpenModal,
    closeModal: addEditNewCategoryCloseModal,
    modalState: addEditNewCategoryModalState,
  } = useModal();
  const {
    openModal: delCategoryOpenModal,
    closeModal: delCategoryCloseModal,
    modalState: delCategoryModalState,
  } = useModal();

  const history = useHistory();
  const dispatch = useDispatch();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const [LibraryCategory, setLibraryCategory] = useState(initialValues);
  const LibraryCategoryForm = useFormik({
    enableReinitialize: true,
    initialValues: LibraryCategory,
    onSubmit: (values) => {},
  });

  const libraryCategoryList = (otherProps?: any) => {
    const { searchString } = LibraryCategory;
    let payload = {
      branchId,
      searchString,
      sortBy: "createdAt",
      orderBy: "asc",
      ...pagination.current,
      ...otherProps,
    };
    dispatch(
      getLibraryCategoryListAct(
        generateActionPayload("get_library_category", undefined, payload)
      )
    );
  };
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    libraryCategoryRequestListResp,
    saveLibraryCategoriesListResp,
    editLibraryCategoryItemResp,
    delLibraryCategoryItemResp,
    libraryDetailsErrorAct,
  } = useAppSelector(
    ({ librarysettings, appData, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      libraryCategoryRequestListResp:
        librarysettings.libraryCategoryRequestListResp,

      saveLibraryCategoriesListResp:
        librarysettings.saveLibraryCategoriesListResp,
      editLibraryCategoryItemResp: librarysettings.editLibraryCategoryItemResp,
      delLibraryCategoryItemResp: librarysettings.delLibraryCategoryItemResp,

      libraryDetailsErrorAct: librarysettings.libraryDetailsErrorAct,
    }),
    shallowEqual
  );
  const libraryCategoryRef = useRef({
    prevSaveLibraryCategoriesListResp: saveLibraryCategoriesListResp,
    prevEditLibraryCategoryItemResp: editLibraryCategoryItemResp,
    prevLibraryDetailsErrorResp: libraryDetailsErrorAct,
    prevDelLibraryCategoryItemResp: delLibraryCategoryItemResp,
  });

  useEffect(() => {
    const {
      prevLibraryDetailsErrorResp,
      prevSaveLibraryCategoriesListResp,
      prevEditLibraryCategoryItemResp,
      prevDelLibraryCategoryItemResp,
    } = libraryCategoryRef.current;
    if (
      saveLibraryCategoriesListResp &&
      prevSaveLibraryCategoriesListResp !== saveLibraryCategoriesListResp
    ) {
      toast.success("Categories added successfully");
      addEditNewCategoryCloseModal();
      libraryCategoryList();
    } else if (
      editLibraryCategoryItemResp &&
      prevEditLibraryCategoryItemResp !== editLibraryCategoryItemResp
    ) {
      toast.success("Category updated successfully");
      addEditNewCategoryCloseModal();
      libraryCategoryList();
    } else if (
      delLibraryCategoryItemResp &&
      prevDelLibraryCategoryItemResp !== delLibraryCategoryItemResp
    ) {
      toast.success("Category deleted successfully");
      delCategoryCloseModal();
      libraryCategoryList();
    } else if (
      libraryDetailsErrorAct &&
      prevLibraryDetailsErrorResp !== libraryDetailsErrorAct
    ) {
      const { details } = libraryDetailsErrorAct;
      toast.error(details);
    }

    libraryCategoryRef.current.prevEditLibraryCategoryItemResp =
      editLibraryCategoryItemResp;
    libraryCategoryRef.current.prevSaveLibraryCategoriesListResp =
      saveLibraryCategoriesListResp;
    libraryCategoryRef.current.prevDelLibraryCategoryItemResp =
      delLibraryCategoryItemResp;
    libraryCategoryRef.current.prevLibraryDetailsErrorResp =
      libraryDetailsErrorAct;
  }, [
    saveLibraryCategoriesListResp,
    editLibraryCategoryItemResp,
    delLibraryCategoryItemResp,
    libraryDetailsErrorAct,
  ]);

  const delCategoryItemConfirmHandlr = () => {
    dispatch(
      delLibraryCategoryItemAct(
        generateActionPayload("del_library_category_item", {
          categoryId: delCategoryModalState.modalData,
        })
      )
    );
  };

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="tw-text-gray-400"
            size={18}
          />
        ),
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(
            getLibraryCategoryItemByIdAct(
              generateActionPayload("get_library_category_by_id", {
                categoryId: id,
              })
            )
          );
          addEditNewCategoryOpenModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="tw-text-red-600"
            size={18}
          />
        ),
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          delCategoryOpenModal(id);
        },
      },
    ],
    []
  );

  useEffect(() => {
    libraryCategoryList();
    return () => {};
  }, [branchId, instituteId]);
  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    libraryCategoryList(paginationInfo);
  }
  const filterHandler = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setLibraryCategory((prev) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    libraryCategoryList({ [name]: value });
  };
  const columns = useMemo(() => generateColumns(menuOptions), [menuOptions]);
  const {
    content: libraryCategoryResp,
    totalElements,
    totalPages,
    pageable,
  } = libraryCategoryRequestListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />
          <div className="tw-bg-white tw-rounded-md tw-shadow">
            <div className="tw-border-b tw-border-slate-200 tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Category List
                </h4>
              </div>
            </div>
            <div className="tw-p-0">
              <form onSubmit={LibraryCategoryForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-4 tw-items-end">
                  <div className="tw-col-span-12 lg:tw-col-span-4">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                        value={LibraryCategoryForm.values.searchString}
                        onChange={filterHandler}
                        floatingLabel
                        labelText="Search"
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-8 tw-flex tw-justify-end">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => addEditNewCategoryOpenModal()}
                    >
                      <i className="ri-add-line tw-mr-2" />
                      Add New
                    </Button>
                  </div>
                </div>
              </form>
              <TableContainer
                columns={columns || []}
                data={libraryCategoryResp || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-slate-100 tw-text-slate-500 tw-align-middle"
                showCheckbox={false}
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
        id="add-edit-modal-container"
        isOpen={addEditNewCategoryModalState.showModal}
        toggle={addEditNewCategoryCloseModal}
        modalTitle={
          addEditNewCategoryModalState.modalData
            ? "Edit Category"
            : "Add Category"
        }
        modalSize="md"
      >
        <AddEditNewCategoryModal
          isOpen={addEditNewCategoryModalState.showModal}
          toggle={addEditNewCategoryCloseModal}
          categoryId={addEditNewCategoryModalState.modalData}
        ></AddEditNewCategoryModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-category-modal"
        isOpen={delCategoryModalState.showModal}
        confirmMessage="Are you sure you want to delete this Category?"
        cancelHndlr={delCategoryCloseModal}
        confirmHndlr={delCategoryItemConfirmHandlr}
        isDisble={showApiLoader}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default LibraryCategory;
