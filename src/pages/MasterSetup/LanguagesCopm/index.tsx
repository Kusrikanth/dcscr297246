import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  TextInput,
} from "../../../Components/Common";
import { useFormik } from "formik";
import {
  IAddLanguageModal,
  IDelLanguageModalState,
  ILanguageResp,
  languageFilterhProps,
} from "./languageTypes";
import {  generateColumns } from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import AddLanguageModal from "./AddLanguageModal";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import {
  getAcademicLanguagesDataAct,
  removeAcademicLanguageAct,
} from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../../Components/Common/Button";
const initialValues: languageFilterhProps = {
  searchString: "",
};

const LanguagesCopm: React.FC<any> = ({ instituteId }) => {

  const [languagesFilterState, setLanguagesFilterState] =
    useState<languageFilterhProps>(initialValues);
  const [languagesData, setLanguagesData] = useState([]);
  const [curriculumDropDown, setCurriculumDropDown] = useState([]);
  const [selectedDropDown, setSelectedDropDown] = useState({
    curriculumId: "",
  });

  const [delLanguageModalState, setDelLanguageModalState] =
    useState<IDelLanguageModalState>({
      showModal: false,
      languageId: "",
    });
  function deleteLanguageHndlr(event: any) {
    const languageId = event.currentTarget.getAttribute("data-id");
    if (languageId)
      setDelLanguageModalState((prevState) => ({
        ...prevState,
        showModal: true,
        languageId,
      }));
  }
  function delModalCancelHndlr() {
    setDelLanguageModalState((prevState) => ({
      ...prevState,
      showModal: false,
      languageId: "",
    }));
  }
  function delModalSubmitHndlr() {
    const { languageId } = delLanguageModalState;
    const apiParams = {
      languageId: languageId,
      instituteId: instituteId
    }
    dispatch(
      removeAcademicLanguageAct(
        generateActionPayload("remove_academic_language", apiParams)
      )
    );
  }
  const {
    academicLanguages,
    deleteAcademicLanguagesRep,
    instInfoError,
  } = useAppSelector(
    ({ instituteInfo }: any) => ({
      academicLanguages: instituteInfo.academicLanguages,
      deleteAcademicLanguagesRep: instituteInfo.deleteAcademicLanguagesRep,
      instInfoError: instituteInfo.instInfoError,
    }),
    shallowEqual
  );
  useEffect(() => {
    const { prevDeleteLanguageResp, prevLanguageErrorResp } =
      languageRespRef.current;

    if (
      deleteAcademicLanguagesRep &&
      prevDeleteLanguageResp !== deleteAcademicLanguagesRep
    ) {
      setDelLanguageModalState((prevState) => ({
        ...prevState,
        showModal: false,
        branchId: "",
      }));
      toast.success("Language deleted successfully.");
      getLanguagesApiCall();
    } else if (instInfoError && instInfoError !== prevLanguageErrorResp) {
      const { details }: any = instInfoError;
      toast.error(details);
    }
    languageRespRef.current.prevDeleteLanguageResp = deleteAcademicLanguagesRep;
    languageRespRef.current.prevLanguageErrorResp = instInfoError;
  }, [deleteAcademicLanguagesRep, instInfoError]);
  const [addLanguageModalState, setAddLanguageModalState] =
    useState<IAddLanguageModal>({
      showModal: false,
      branchId: "",
      modalData: undefined,
    });

  const toggleAddLanguageModal = (apiCall?: any) => {
    setAddLanguageModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
      modalData: undefined
    }));
    if (typeof (apiCall) === "boolean" && apiCall) {
      getLanguagesApiCall();
    }
  };

  const languageFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: languagesFilterState,
    onSubmit: (values) => { },
  });

  const languageRespRef = useRef<ILanguageResp>({
    prevDeleteLanguageResp: deleteAcademicLanguagesRep,
    prevLanguageErrorResp: instInfoError,
  });
  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16 cursor-pointer"></i>,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          let id = event.currentTarget.getAttribute("data-id");
          let data =
            languagesData &&
            languagesData.filter((d: any) => d.id === +id && d);

          setAddLanguageModalState((prevState) => ({
            ...prevState,
            showModal: !prevState.showModal,
            modalData: { data: data, id: id },
          }));
        },
      },
      {
        id: "delete",
        actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16 cursor-pointer"></i>,
        actionName: "Delete",
        onClickHndlr: deleteLanguageHndlr,
      },
    ],
    [languagesData, academicLanguages]
  );

  const curriculumColumns = useMemo(
    () => generateColumns(menuOptions),
    [languagesData, academicLanguages]
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    getLanguagesApiCall();
  }, []);
  useEffect(() => {
    let data =
      academicLanguages &&
      academicLanguages.data.map((language: any) => {
        return {
          id: language.languageId,
          languageName: language.languageName,
          shortName: "",
        };
      });
    setLanguagesData(data);
  }, [academicLanguages]);
  const { pageNumber, totalPages, totalElements } = academicLanguages || {};
  const paginationDetailRef = useRef<IPaginationState>({
    pageNo: 0,
    pageSize: 10,
  });
  function getLanguagesApiCall(
    otherProps?: IPaginationState | languageFilterhProps
  ) {
    const payload = { instituteId, ...languagesFilterState, ...paginationDetailRef.current, ...otherProps, sortBy: "languageName", orderBy: "asc" };
    dispatch(
      getAcademicLanguagesDataAct(
        generateActionPayload("get_academic_language_data", undefined, payload)
      )
    );
  }
  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationDetailRef.current = paginationInfo;
    getLanguagesApiCall(paginationInfo);
  }
  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationDetailRef.current.pageNo = 0;
    setLanguagesFilterState((prevState) => ({ ...prevState, [name]: value }));
    getLanguagesApiCall({ searchString: value });
  }
  return (
    <>
      <div className="tw-bg-white tw-rounded-lg tw-shadow">

        <div className="tw-border-b tw-px-4 tw-py-3">
          <div className="tw-flex tw-items-center">

            <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-1">
              Languages
            </h4>

            <Button
            variant="primary"
              onClick={toggleAddLanguageModal}
            >
              <i className="ri-add-line" />
              Add Language
            </Button>

          </div>
        </div>

        <div className="tw-p-4">
          <form onSubmit={languageFilterForm.handleSubmit}>
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

              <div className="tw-col-span-12 sm:tw-col-span-4">
                <div className="search-box">
                  <TextInput
                    name="searchString"
                    value={languageFilterForm.values.searchString}
                    onChange={onChangeFilterHndlr}
                    formgroupClassName="tw-mb-0"
                    placeHolder="Search"
                    labelText="Search"
                    floatingLabel
                  />
                  <i className="ri-search-line search-icon" />
                </div>
              </div>

            </div>
          </form>
        </div>

        <TableContainer
          columns={curriculumColumns || []}
          data={languagesData ? languagesData : []}
          divClass="tw-overflow-x-auto tw-mb-1"
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
          showPagination={true}
          totalPages={totalPages}
          totalRecords={totalElements}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageNumber}
        />

      </div>
      <ModalContainerUpdated
                id="add-language-modal"
                isOpen={addLanguageModalState.showModal}
                toggle={toggleAddLanguageModal}
                modalTitle={addLanguageModalState.modalData ? "Edit Language" : "Add Languages"}
                modalSize="md"
            >
              
      <AddLanguageModal
        isOpen={addLanguageModalState.showModal}
        toggle={toggleAddLanguageModal}
        instituteId={instituteId}
        instituteName={"Add Languages"}
        branchId={addLanguageModalState.branchId}
        modalData={addLanguageModalState.modalData}
        editBranchDetails={""}
      />
              </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-branch-modal"
        isOpen={delLanguageModalState.showModal}
        confirmMessage="Are you sure you want to delete this language ?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
      />
      {/* <ToastContainer/> */}
    </>
  );
};

export default LanguagesCopm;
