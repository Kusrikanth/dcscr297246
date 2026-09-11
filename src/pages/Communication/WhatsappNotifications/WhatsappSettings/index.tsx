import { shallowEqual } from "react-redux";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useModal } from "../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useEffect, useMemo, useRef } from "react";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getWhatsappSettingsTemplatesAct } from "../../../../store/communication/communicationactions";
import generateColumns from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { ModalContainerUpdated } from "../../../../Components/Common";
import EditWhatsappSettingsTemplateModal from "./EditWhatsappSettingsModal";
import { toast } from "react-toastify";

export default function WhatsappSettings() {
  const {
    openModal: editWhatsappSettingsTemplateOpenModal,
    closeModal: editWhatsappSettingsTemplateCloseModal,
    modalState: editWhatsappSettingsTemplateModalState,
  } = useModal();

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const dispatch = useAppDispatch();

  const {
    showApiLoader,
    getWhatsappSettingsTemplatesResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    communicationErrorResp,
    updateWhatsappSettingsTemplateResp,
  } = useAppSelector(
    ({ globalData, instAcademics, communication, appData }) => ({
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getWhatsappSettingsTemplatesResp:
        communication.getWhatsappSettingsTemplatesResp,
      updateWhatsappSettingsTemplateResp:
        communication.updateWhatsappSettingsTemplateResp,
      communicationErrorResp: communication.communicationErrorResp,
    }),
    shallowEqual
  );

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionName: "Edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          editWhatsappSettingsTemplateOpenModal(id);
        },
      },
    ],
    []
  );

  function fetchWhatsappSettingsTemplates(otherProps?: any) {
    dispatch(
      getWhatsappSettingsTemplatesAct(
        generateActionPayload(
          "get_whatsapp_settings_templates",
          undefined,
          {
            ...paginationRef.current,
            ...otherProps,
          },
          {
            headers: {
              "X-Branch-ID": branchId,
            },
          }
        )
      )
    );
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    whatsappSettingsTemplatesList(paginationInfo);
  }

  const whatsappSettingsTemplateRef = useRef({
    prevUpdateWhatsappSettingsTemplateResp: updateWhatsappSettingsTemplateResp,
    prevCommunicationErrorResp: communicationErrorResp,
  });

  useEffect(() => {
    const {
      prevUpdateWhatsappSettingsTemplateResp,
      prevCommunicationErrorResp,
    } = whatsappSettingsTemplateRef.current;
    if (
      updateWhatsappSettingsTemplateResp &&
      updateWhatsappSettingsTemplateResp !==
        prevUpdateWhatsappSettingsTemplateResp
    ) {
      toast.success("Whatsapp Settings Template updated successfully");
      fetchWhatsappSettingsTemplates();
      editWhatsappSettingsTemplateCloseModal();
    } else if (
      communicationErrorResp &&
      communicationErrorResp !== prevCommunicationErrorResp
    ) {
      const { details } = communicationErrorResp;
      toast.error(details || "Something went wrong");
    }
    whatsappSettingsTemplateRef.current.prevUpdateWhatsappSettingsTemplateResp =
      updateWhatsappSettingsTemplateResp;
    whatsappSettingsTemplateRef.current.prevCommunicationErrorResp =
      communicationErrorResp;
  }, [updateWhatsappSettingsTemplateResp, communicationErrorResp]);

  useEffect(() => {
    fetchWhatsappSettingsTemplates();
  }, []);

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions]
  );

  const {
    content: whatsappSettingsTemplatesList,
    totalElements,
    totalPages,
    pageable,
  } = getWhatsappSettingsTemplatesResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb
            title="Whatsapp Settings"
            pageTitle="Whatsapp Settings"
          ></BreadCrumb>

          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Whatsapp Settings</h4>
            </div>
            <div className="card-body p-0">
              <TableContainer
                columns={tableColumns || []}
                data={
                  Array.isArray(whatsappSettingsTemplatesList)
                    ? whatsappSettingsTemplatesList
                    : []
                }
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showPagination={true}
                totalRecords={totalElements || 0}
                totalPages={totalPages || 0}
                currentPageNumber={pageable?.pageNumber || 0}
                callbackPaginationHndlr={paginationHndlr}
              ></TableContainer>
            </div>
          </div>
        </div>
      </div>

      <ModalContainerUpdated
        id="editWhatsappSettingsModal"
        isOpen={editWhatsappSettingsTemplateModalState.showModal}
        toggle={editWhatsappSettingsTemplateCloseModal}
        modalTitle="Edit Whatsapp Settings"
        modalSize="md"
      >
        <EditWhatsappSettingsTemplateModal
          editItemId={editWhatsappSettingsTemplateModalState.modalData}
        ></EditWhatsappSettingsTemplateModal>
      </ModalContainerUpdated>
    </>
  );
}
