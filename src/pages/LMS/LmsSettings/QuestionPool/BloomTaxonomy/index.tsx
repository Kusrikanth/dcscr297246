import { useCallback, useEffect, useMemo, useRef } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  TextInput,
} from "../../../../../Components/Common";
import { useModal } from "../../../../../hooks/modalhook";
import AddEditBloomModal from "./AddEditBloomModal";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { deleteBloomTaxonomyAct, getBloomTaxonomyAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { useFormik } from "formik";
import { debounce } from "../../../../../utility/commonutility";
import { toast } from "react-toastify";


const initialValues = {
  searchString: "",
}
const BloomTaxonomy = () => {
  const dispatch = useAppDispatch();
  const {
    openModal: addEditOpenBloomModal,
    closeModal: addEditCloseBloomModal,
    modalState: addEditBloomModalState,
  } = useModal();

  const {
    openModal: delOpenBloomTaxoModal,
    closeModal: delCloseBloomTaxoModal,
    modalState: delBloomTaxoModalState,
  } = useModal();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const getQuestionsNoFormatApiCall = (otherProps?: any) => {
    let payload = {
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getBloomTaxonomyAct(generateActionPayload("get_bloom_taxonomy", undefined, payload)));
  };
  const {
    getBloomTaxonomyResp,
    saveBloomTaxonomyResp,
    lmsSettingsErrorAct,
    updateBloomTaxonomyResp,
    deleteBloomTaxonomyResp
  } = useAppSelector(
    ({ lmsSettings }) => ({
      getBloomTaxonomyResp: lmsSettings.getBloomTaxonomyResp,
      saveBloomTaxonomyResp: lmsSettings.saveBloomTaxonomyResp,
      lmsSettingsErrorAct: lmsSettings.lmsSettingsErrorAct,
      updateBloomTaxonomyResp: lmsSettings.updateBloomTaxonomyResp,
      deleteBloomTaxonomyResp: lmsSettings.deleteBloomTaxonomyResp
    }),
    shallowEqual
  );


  const instituteRespRef = useRef<any>({
    prevSaveBloomTaxonomyResp: saveBloomTaxonomyResp,
    prevLmsSettingsErrorAct: lmsSettingsErrorAct,
    prevUpdateBloomTaxonomyResp: updateBloomTaxonomyResp,
    prevDeleteBloomTaxonomyResp: deleteBloomTaxonomyResp
  });

  useEffect(() => {
    const { prevSaveBloomTaxonomyResp, prevLmsSettingsErrorAct, prevUpdateBloomTaxonomyResp, prevDeleteBloomTaxonomyResp } = instituteRespRef.current;
    if (saveBloomTaxonomyResp && prevSaveBloomTaxonomyResp !== saveBloomTaxonomyResp) {
      toast.success("Bloom Taxonomy saved successfully.");
      getQuestionsNoFormatApiCall();
      addEditCloseBloomModal();
    }
    else if (lmsSettingsErrorAct && prevLmsSettingsErrorAct !== lmsSettingsErrorAct) {
      toast.error(lmsSettingsErrorAct.details || "Something went wrong.");
    }
    else if (updateBloomTaxonomyResp && prevUpdateBloomTaxonomyResp !== updateBloomTaxonomyResp) {
      toast.success("Bloom Taxonomy updated successfully.");
      getQuestionsNoFormatApiCall();
      addEditCloseBloomModal();
    }
    else if (deleteBloomTaxonomyResp && prevDeleteBloomTaxonomyResp !== deleteBloomTaxonomyResp) {
      toast.success("Bloom Taxonomy deleted successfully.");
      getQuestionsNoFormatApiCall();
      delCloseBloomTaxoModal();
    }
    instituteRespRef.current.prevSaveBloomTaxonomyResp = saveBloomTaxonomyResp;
    instituteRespRef.current.prevLmsSettingsErrorAct = lmsSettingsErrorAct;
    instituteRespRef.current.prevUpdateBloomTaxonomyResp = updateBloomTaxonomyResp;
    instituteRespRef.current.prevDeleteBloomTaxonomyResp = deleteBloomTaxonomyResp;
  }, [saveBloomTaxonomyResp, lmsSettingsErrorAct, updateBloomTaxonomyResp,deleteBloomTaxonomyResp]);

   const bloomTaxonomyForm = useFormik({
      initialValues,
      // validationSchema,
      onSubmit: (values) => {
       },
    });
  
  useEffect(() => {
    getQuestionsNoFormatApiCall();
  }, [])

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
          addEditOpenBloomModal(id);
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
          delOpenBloomTaxoModal(id);
        },
      },
    ],
    []
  );

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    getQuestionsNoFormatApiCall(paginationInfo);
  }

  function search(value: string) {
    getQuestionsNoFormatApiCall({ ...bloomTaxonomyForm.values, searchString: value });
  }

  const debounceFun = useCallback(debounce(search, 200), [getBloomTaxonomyResp]);
  
  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;

    if (name === "searchString") {
      bloomTaxonomyForm.setValues((prev: any) => ({ ...prev, [name]: value }))
      debounceFun(value);
    }
  }

   const delLibraryDetailsConfirmHndler = () => {
        dispatch(deleteBloomTaxonomyAct(generateActionPayload("delete_bloom_taxonomy", { id: delBloomTaxoModalState.modalData },)));
      }
  const tableColumns = useMemo(() => generateColumns(menuOptions), []);
  const {
    content: libraryCategoryResp,
    totalElements,
    totalPages,
    pageNumber,
  } = getBloomTaxonomyResp || {};


  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="card-title mb-0 flex-grow-1">Bloom Taxonomy</h4>
            </div>
            <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  className="btn btn-success float-end d-flex align-items-center"
                  onClick={() => addEditOpenBloomModal()}
                >
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    className="me-2"
                    size={18}
                  />
                  Add New
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="py-3 px-3">
            <div className="row g-3">
              <div className="col-12">
                <div className="row g-3">
                  <div className="col-xs-12 col-md-12 col-lg-4 ">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="mb-0"
                        placeHolder="Search..."
                        value={bloomTaxonomyForm.values.searchString}
                        onChange={onChangeFilterHndlr}
                        labelText="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TableContainer
            columns={tableColumns || []}
            data={getBloomTaxonomyResp?.data || []}
            tableClass="mb-0"
            divClass="table-responsive mb-3"
            theadClass="table-light text-muted align-middle"
            showPagination={true}
            totalPages={totalPages || 0}
            totalRecords={totalElements || 0}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageNumber || 0}
          ></TableContainer>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-edit-difficulty-levels-modal"
        isOpen={addEditBloomModalState.showModal}
        toggle={addEditCloseBloomModal}
        modalTitle={
          addEditBloomModalState.modalData
            ? "Edit Bloom Taxonomy"
            : "Add Bloom Taxonomy"
        }
        modalSize="md"
      >
        <AddEditBloomModal
          toggle={addEditCloseBloomModal}
          id={addEditBloomModalState.modalData}
        ></AddEditBloomModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-difficulty-levels-modal"
        isOpen={delBloomTaxoModalState.showModal}
        confirmMessage="Are you sure you want to Delete the Bloom Taxonomy Item"
        cancelHndlr={delCloseBloomTaxoModal}
        confirmHndlr={delLibraryDetailsConfirmHndler}
        showImgIcon={true}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default BloomTaxonomy;
