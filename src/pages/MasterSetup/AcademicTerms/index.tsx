import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import {
  ConfirmationModal,
  TextIconInput,
  SelectInput,
  ModalContainerUpdated,
} from "../../../Components/Common";
//Helper
import { generateColumns } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Modal Component
import AddEditAcademicTerms from "./AddEditAcademicTerms";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  getInstAcademicTermAct,
  getInstAcademicYearAct,
  deleteInstAcademicTermAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";

//Interface & Types
import {
  IAcademicTermsProps,
  IAcademicTermsModalState,
  IDelAcademicTermsModalState,
  IAcademicTermsRespRef,
} from "./academictermstypes";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { getMasterTermTypesAct } from "../../../store/masterdata/masterdataactions";
import { sortRef } from "../Terms/academictermstypes";
import Button from "../../../Components/Common/Button";

const AcademicTerms: React.FC<IAcademicTermsProps> = ({
  instituteId,
  instituteName,
}) => {
  const [academicTermsModalState, setAcademicTermsModalState] =
    useState<IAcademicTermsModalState>({
      showModal: false,
      academicTermId: undefined,
      modalData: undefined,
    });
  const [delAcademicTermsModalState, setDelAcademicTermsModalState] =
    useState<IDelAcademicTermsModalState>({
      showModal: false,
      academicTermId: "",
    });
  const [filterState, setFilterState] = useState<any>({
    academicTermName: undefined,
    academicYearId: undefined,
    masterTermTypeId: undefined,
    pageNo: 0,
    pageSize: 10,
    orderBy: "asc",
    sortBy: "termName"
  });

  const dispatch = useAppDispatch();
  const {
    academicYearListResp,
    masterTermTypesResp,
    academicTermListResp,
    addAcademicTermResp,
    deleteAcademicTermResp,
    instAcademicErrorResp,
  }: any = useAppSelector(
    ({ instAcademics, masterData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      masterTermTypesResp: masterData.masterTermTypesResp,
      academicTermListResp: instAcademics.academicTermListResp,
      addAcademicTermResp: instAcademics.addAcademicTermResp,
      deleteAcademicTermResp: instAcademics.deleteAcademicTermResp,
      instAcademicErrorResp: instAcademics.instAcademicErrorResp,
    }),
    shallowEqual
  );


  const academicYearRespRef = useRef<IAcademicTermsRespRef>({
    prevAcademicTermListResp: academicTermListResp,
    prevAddAcademicTermResp: addAcademicTermResp,
    prevDeleteAcademicTermResp: deleteAcademicTermResp,
    prevInstAcademicErrorResp: instAcademicErrorResp,
  });

  useEffect(() => {
    if (instituteId) {
      dispatch(
        getInstAcademicYearAct(
          generateActionPayload("get_inst_academic_year", undefined, {
            instituteId,
            sortBy: "academicYearName",
            orderBy: "desc",
            pageNo: 0,
            pageSize: 100,
          })
        )
      );
    }
  }, [instituteId]);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current").academicYearId;
    setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    getAcademicTermApicall({ academicYearId: yearId });
  }, [academicYearListResp])

  useEffect(() => {
    const {
      prevDeleteAcademicTermResp,
      prevInstAcademicErrorResp,
      prevAddAcademicTermResp,
    } = academicYearRespRef.current;
    if (
      deleteAcademicTermResp &&
      deleteAcademicTermResp !== prevDeleteAcademicTermResp
    ) {
      setDelAcademicTermsModalState((prevState) => ({
        ...prevState,
        showModal: false,
        academicTermId: "",
      }));
      getAcademicTermApicall();
      toast.success("Academic term deleted successfully.");
    } else if (
      instAcademicErrorResp &&
      instAcademicErrorResp !== prevInstAcademicErrorResp
    ) {
      const { details }: any = instAcademicErrorResp;
      toast.error(details);
    }
    academicYearRespRef.current.prevDeleteAcademicTermResp =
      deleteAcademicTermResp;
    academicYearRespRef.current.prevInstAcademicErrorResp =
      instAcademicErrorResp;
  }, [deleteAcademicTermResp, instAcademicErrorResp]);

  function addAcademicTermHndlr() {
    setAcademicTermsModalState((prevState) => ({
      ...prevState,
      showModal: true,
      academicTermId: undefined,
      modalData: undefined,
    }));
  }
  const toggleTermModalHndlr = useCallback(
    (otherProps?: any, apiCall?: boolean) => {
      setAcademicTermsModalState((prevState) => ({
        ...prevState,
        showModal: !prevState.showModal,
      }));
      if (typeof apiCall === "boolean" && apiCall) {
        getAcademicTermApicall(otherProps || {});
      }
    },
    [academicTermListResp]
  );

  function editAcademicTermHndlr(event: any) {
    const academicTermId = event.currentTarget.getAttribute("data-id");

    let modalData: any = academicTermListResp?.data?.find(
      (item: any) => item?.instituteAcademicTermId === +academicTermId
    );
    // modalData = { ...filterState,...modalData, };

    if (modalData) {
      setAcademicTermsModalState((prevState) => ({
        ...prevState,
        showModal: true,
        academicTermId,
        modalData,
      }));
    }
  }

  function deleteAcademicTermHndlr(event: any) {
    const academicTermId: string = event.currentTarget.getAttribute("data-id");
    if (academicTermId)
      setDelAcademicTermsModalState((prevState) => ({
        ...prevState,
        showModal: true,
        academicTermId,
      }));
  }

  const menuOptions = useMemo(
    (): IOptionsHrtl[] => [
      {
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: editAcademicTermHndlr,
      },
      {
        id: "delete",
        actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
        actionName: "Delete",
        onClickHndlr: deleteAcademicTermHndlr,
      },
    ],
    [academicTermListResp]
  );

  function getAcademicTermApicall(otherProps?: any) {
    const payload = { instituteId, ...filterState, ...otherProps };
    payload.sortBy === "" && delete payload.orderBy
    payload.sortBy === "" && delete payload.sortBy
    dispatch(
      getInstAcademicTermAct(
        generateActionPayload("get_inst_academic_term", undefined, payload)
      )
    );
  }

  function delModalCancelHndlr() {
    setDelAcademicTermsModalState((prevState) => ({
      ...prevState,
      showModal: false,
      academicYearId: "",
    }));
  }

  function delModalSubmitHndlr() {
    const { academicTermId } = delAcademicTermsModalState;

    const apiParams = {
      academicTermId: academicTermId,
    };

    dispatch(
      deleteInstAcademicTermAct(
        generateActionPayload("del_inst_academic_term", apiParams)
      )
    );
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    setFilterState((prev: any) => ({ ...prev, ...paginationInfo }))
    getAcademicTermApicall(paginationInfo);
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    getAcademicTermApicall({ ...filterState, [name]: value });
  }

  const academicTermsColumns = useMemo(
    () => generateColumns(menuOptions),
    [academicTermListResp]
  ),
    { data: academicTermList, pageNumber, totalPages, totalElements } = academicTermListResp || {};

  const { data: academicYearList } = academicYearListResp || {};

  useEffect(() => {
    if (!masterTermTypesResp) {
      dispatch(
        getMasterTermTypesAct(generateActionPayload("get_master_term_types"))
      );
    }
  }, [masterTermTypesResp]);

  useEffect(() => {
    !academicTermsModalState.showModal && dispatch(getMasterTermTypesAct(generateActionPayload("get_master_term_types")));
  }, [academicTermsModalState.showModal])

  const sortByPrevRef = useRef<Array<sortRef>>([{
    id: "termName",
    desc: false
  }])

  const sortingHandler = useCallback((sortBy: any) => {
    const sortByPrev = sortByPrevRef.current;
    setFilterState((prev: any) => ({ ...prev, sortBy: sortBy[0].id, orderBy: sortBy[0].desc ? "desc" : "asc" }))
    if (sortBy && sortByPrev !== sortBy) {
      getAcademicTermApicall({ sortBy: sortBy[0].id, orderBy: sortBy[0].desc ? "desc" : "asc" })
    }
    sortByPrevRef.current = sortBy;
  }, [filterState])

  return (
    <React.Fragment>
      <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">

        <div className="tw-border-b tw-px-4 tw-py-3">
          <div className="tw-flex tw-items-center">

            <div className="tw-flex-1">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Academic Terms
              </h4>
            </div>

            <div className="tw-flex tw-justify-end">
              <Button
              variant="primary"
                onClick={addAcademicTermHndlr}
              >
                Add Term
              </Button>
            </div>

          </div>
        </div>

        <div className="tw-p-0">

          <div className="tw-py-3 tw-px-3">
            <form onClick={(e) => e.preventDefault()}>
              <div className="tw-grid tw-grid-cols-12 tw-gap-x-3 tw-gap-y-2">

                <div className="tw-col-span-12 lg:tw-col-span-4">
                  <TextIconInput
                    formgroupClassName="tw-relative"
                    name="academicTermName"
                    value={filterState.academicTermName}
                    placeHolder="Search"
                    onChange={onChangeFilterHndlr}
                    labelText="Search"
                    floatingLabel
                  >
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/5 tw-text-gray-400"></i>
                  </TextIconInput>
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-3">
                  <SelectInput
                    formgroupClassName="tw-mb-0"
                    name="academicYearId"
                    value={filterState.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-3">
                  <SelectInput
                    formgroupClassName="tw-mb-0"
                    name="masterTermTypeId"
                    value={filterState.masterTermTypeId}
                    onChange={onChangeFilterHndlr}
                    menuItems={masterTermTypesResp || []}
                    valueKey="masterTermTypeId"
                    textKey="masterTermTypeName"
                    labelText="Term Type"
                    floatingLabel
                  />
                </div>

              </div>
            </form>
          </div>

          <TableContainer
            columns={academicTermsColumns || []}
            data={academicTermList || []}
            divClass="tw-overflow-x-auto tw-mb-1"
            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
            tableClass="tw-min-w-full tw-whitespace-nowrap"
            showPagination={true}
            totalPages={totalPages}
            totalRecords={totalElements}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageNumber}
            sortingHandler={sortingHandler}
          />

        </div>
      </div>
      <ModalContainerUpdated
          id="add-edit-academic-terms"
          isOpen={academicTermsModalState.showModal}
          toggle={toggleTermModalHndlr}
          modalTitle={
            academicTermsModalState.academicTermId
              ? "Edit Academic Term"
              : "Add Academic Term"
          }
          modalSize="md"
            > 
      <AddEditAcademicTerms
        isOpen={academicTermsModalState.showModal}
        toggle={toggleTermModalHndlr}
        modalTitle={
          academicTermsModalState.academicTermId
            ? "Edit Academic Term"
            : "Add Academic Term"
        }
        academicTermId={academicTermsModalState.academicTermId}
        instituteId={instituteId}
        editModalData={academicTermsModalState.modalData}
        />
        </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-inst-academic-terms"
        isOpen={delAcademicTermsModalState.showModal}
        confirmMessage="Are you sure you want to delete this academic term ?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
      />
      {/* <ToastContainer /> */}
    </React.Fragment>
  );
};

export default AcademicTerms;
