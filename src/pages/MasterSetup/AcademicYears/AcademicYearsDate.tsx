import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { shallowEqual } from "react-redux";
import { ConfirmationModal, ModalContainerUpdated, TextIconInput } from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import TableContainer from "../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import {
  deleteInstAcademicYearAct,
  getInstAcademicYearsDateAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import { IAcademicYearInfo } from "../../../store/mastersettings/instacademics/instacademictypes";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  IAcademicYearModalState,
  IAcademicYearsDateRespRef,
  IAcademicYearsProps,
  IDelAcademicYearModalState,
} from "./academicyearstypes";
import { generateAcademicYearsDateColumns } from "./helper";
import AddAcademicYearModal from "./AddAcademicYearModal";
import "react-toastify/dist/ReactToastify.css";
import { sortRef } from "../Terms/academictermstypes";
import Button from "../../../Components/Common/Button";

const AcademicYearsDateTab: React.FC<IAcademicYearsProps> = () => {
  const [academicModalState, setAddAcademicModalState] =
    useState<IAcademicYearModalState>({
      showModal: false,
      academicYearId: undefined,
      modalData: undefined,
    });
  const [filterState, setFilterState] = useState<any>({
    searchString: undefined,
    pageNo: 0,
    pageSize: 10,
    sortBy: "academicYearName",
    orderBy: "desc"
  });
  const [delAcademicYearModalState, setDelAcademicYearModalState] =
    useState<IDelAcademicYearModalState>({
      showModal: false,
      academicYearId: "",
    });

  const dispatch = useAppDispatch();
  const {
    academicYearsDateListResp,
    deleteAcademicYearResp,
    instAcademicErrorResp,
    currentInstIdResp: instituteId, 
    currentBranchIdResp: branchId,
  } = useAppSelector(
    ({ instAcademics,appData }) => ({
      academicYearsDateListResp: instAcademics.academicYearsDateListResp,
      deleteAcademicYearResp: instAcademics.deleteAcademicYearResp,
      instAcademicErrorResp: instAcademics.instAcademicErrorResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
    }),
    shallowEqual
  );

  const academicYearRespRef = useRef<IAcademicYearsDateRespRef>({
    prevAcademicYearListResp: academicYearsDateListResp,
    prevDeleteAcademicYearResp: deleteAcademicYearResp,
    prevInstAcademicErrorResp: instAcademicErrorResp,
  });

  useEffect(() => {
    if (instituteId) {
      getAcademicYearDatesApicall();
    }
  }, [instituteId]);

  useEffect(() => {
    const { prevDeleteAcademicYearResp, prevInstAcademicErrorResp } =
      academicYearRespRef.current;


    if (
      deleteAcademicYearResp &&
      deleteAcademicYearResp !== prevDeleteAcademicYearResp
    ) {
      setDelAcademicYearModalState((prevState) => ({
        ...prevState,
        showModal: false,
        academicYearId: "",
      }));
      getAcademicYearDatesApicall();
      toast.success("Academic year deleted successfully.");
    } else if (
      instAcademicErrorResp &&
      instAcademicErrorResp !== prevInstAcademicErrorResp
    ) {
      const { details }: any = instAcademicErrorResp;
      toast.error(details);
    }
    academicYearRespRef.current.prevDeleteAcademicYearResp =
      deleteAcademicYearResp;
    academicYearRespRef.current.prevInstAcademicErrorResp =
      instAcademicErrorResp;
  }, [deleteAcademicYearResp, instAcademicErrorResp]);

  function addAcademicYearHndlr() {
    setAddAcademicModalState((prevState) => ({
      ...prevState,
      showModal: true,
      academicYearId: undefined,
      modalData: undefined,
    }));
  }
  const toggleAcademicModalHndlr = useCallback(
    (otherProps?:any,apiCall?: boolean) => {
      setAddAcademicModalState((prevState) => ({
        ...prevState,
        showModal: !prevState.showModal,
      }));
      if (typeof apiCall === "boolean" && apiCall) {
        getAcademicYearDatesApicall(otherProps||{});
      }
    },
    [academicYearsDateListResp]
  );

  function editAcademicYearHndlr(event: any) {
    const instituteAcademicYearId = event.currentTarget.getAttribute("data-id"),
      modalData: IAcademicYearInfo | undefined =
        academicYearsDateListResp?.data?.find(
          (item: any) => +item.instituteAcademicYearId === +instituteAcademicYearId
        );

    if (modalData)
      setAddAcademicModalState((prevState) => ({
        ...prevState,
        showModal: true,
        academicYearId: instituteAcademicYearId,
        modalData,
      }));
  }

  function deleteAcademicYearHndlr(event: any) {
    const academicYearId: string = event.currentTarget.getAttribute("data-id");
    if (academicYearId)
      setDelAcademicYearModalState((prevState) => ({
        ...prevState,
        showModal: true,
        academicYearId,
      }));
  }

  const menuOptions = useMemo(
    (): IOptionsHrtl[] => [
      {
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: editAcademicYearHndlr,
      },
    ],
    [academicYearsDateListResp]
  );

  function getAcademicYearDatesApicall(otherProps?: any) {
    const payload = { instituteId, ...filterState, ...otherProps };
    payload.sortBy===""&&delete payload.orderBy
    payload.sortBy===""&&delete payload.sortBy
    dispatch(
      getInstAcademicYearsDateAct(
        generateActionPayload(
          "get_inst_academic_years_date",
          undefined,
          payload
        )
      )
    );
  }

  function delModalCancelHndlr() {
    setDelAcademicYearModalState((prevState) => ({
      ...prevState,
      showModal: false,
      academicYearId: "",
    }));
  }

  function delModalSubmitHndlr() {
    const { academicYearId } = delAcademicYearModalState;
    dispatch(
      deleteInstAcademicYearAct(
        generateActionPayload("del_inst_academic_year", { academicYearId })
      )
    );
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    setFilterState((prev: any) => ({ ...prev, ...paginationInfo }))
    getAcademicYearDatesApicall(paginationInfo);
  }
  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    getAcademicYearDatesApicall({ ...filterState, [name]: value });
  }

  const sortByPrevRef = useRef<Array<sortRef>>([{
    id: "academicYearName",
    desc: false
  }])

  const sortingHandler = useCallback((sortBy: any) => {
    const sortByPrev = sortByPrevRef.current;
    setFilterState((prev: any) => ({ ...prev, sortBy: sortBy[0].id, orderBy: sortBy[0].desc ? "desc" : "asc" }))
    if (sortBy && sortByPrev !== sortBy) {
      getAcademicYearDatesApicall({ sortBy: sortBy[0].id, orderBy: sortBy[0].desc ? "desc" : "asc" })
    }
    sortByPrevRef.current = sortBy;
  }, [filterState])

  const academicYearsDateTabColumns = useMemo(
    () => generateAcademicYearsDateColumns(menuOptions),
    [academicYearsDateListResp]
  ),
    {
      data: academicYearsDateList,
      pageNumber,
      totalPages,
      totalElements,
    } = academicYearsDateListResp || {};

  return (
    <>
      <div>
        <div className="tw-py-3 tw-px-3">
          <form onClick={(e) => e.preventDefault()}>
            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-end">

              <div className="tw-col-span-12 md:tw-col-span-4">
                <TextIconInput
                  formgroupClassName="tw-relative"
                  name="searchString"
                  value={filterState.searchString}
                  placeHolder="Search"
                  onChange={onChangeFilterHndlr}
                  labelText="Search"
                  floatingLabel
                >
                  <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/5 tw-text-gray-400"></i>
                </TextIconInput>
              </div>

              <div className="tw-col-span-12 md:tw-col-span-8 tw-flex tw-justify-end">
                <Button
                  variant="primary"
                  onClick={addAcademicYearHndlr}
                >
                  Add Academic Year
                </Button>
              </div>
            </div>
          </form>
        </div>
        <TableContainer
          columns={academicYearsDateTabColumns || []}
          data={Array.isArray(academicYearsDateList) ? academicYearsDateList : []}
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
      <ModalContainerUpdated
          id="add-academic-year-admin"
          isOpen={academicModalState.showModal}
          toggle={toggleAcademicModalHndlr}
          modalTitle={
            academicModalState.academicYearId
              ? "Edit Academic Year Dates"
              : "Add Academic Year Dates"
          }
          modalSize="md"
            > 
      <AddAcademicYearModal
        isOpen={academicModalState.showModal}
        toggle={toggleAcademicModalHndlr}
        academicYearId={academicModalState.academicYearId}
        instituteId={instituteId}
        editModalData={academicModalState.modalData}
      />
            </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-branch-modal"
        isOpen={delAcademicYearModalState.showModal}
        confirmMessage="Are you sure you want to delete this academic year ?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
      />
      {/* <ToastContainer /> */}
    </>
  );
};

export default AcademicYearsDateTab;
