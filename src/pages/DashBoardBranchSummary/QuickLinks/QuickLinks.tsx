import React, { useEffect, useMemo } from 'react';
import { useModal } from '../../../hooks/modalhook';
import { ModalContainerUpdated } from '../../../Components/Common';
import QuickLinkModel from './QuickLinkModel';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getQuickLinkAct } from '../../../store/academic/academicRequest/academicrequestactions';
import { transformResponseToQuickLinks } from './helper';
import { toast } from 'react-toastify';
import Button from '../../../Components/Common/Button';

const QuickLinks = () => {

  const { modalState: quickLinkModalState, closeModal: closeQuickLinkDetailsModalHdnlr, openModal: openQuickLinkModalHdnlr, } = useModal();
  const dispatch = useAppDispatch();
  const quickLinksListApi = (otherProps?: any) => {
    dispatch(getQuickLinkAct(generateActionPayload("get_quick_link", undefined, undefined)));
  }

  const {
    currentBranchIdResp: branchId,
    getQuickLinkResp,
    saveQuickLinkResp,
    currentInstIdResp: instituteId,
  } = useAppSelector(({ appData, academicRequest }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getQuickLinkResp: academicRequest.getQuickLinkResp,
      saveQuickLinkResp: academicRequest.saveQuickLinkResp
  }), shallowEqual);

  const branchDashboardRef = React.useRef({
    prevSaveQuickLinkResp: saveQuickLinkResp,
  });

  useEffect(() => {
    const { prevSaveQuickLinkResp } = branchDashboardRef.current;

    if (saveQuickLinkResp && prevSaveQuickLinkResp !== saveQuickLinkResp) {
      toast.success("Quick Links Added Successfully");
      closeQuickLinkDetailsModalHdnlr();
      quickLinksListApi()
    }

    branchDashboardRef.current.prevSaveQuickLinkResp = saveQuickLinkResp;
  }, [saveQuickLinkResp])

  useEffect(() => {
    if (branchId) {
      quickLinksListApi();
    }
  }, [branchId,instituteId]);

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };

  const quickLinks = useMemo(() => transformResponseToQuickLinks(getQuickLinkResp), [getQuickLinkResp]);

  return (
    <>
      <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-overflow-hidden">

        <div className="tw-p-2 tw-border-b">
          <div className="tw-flex tw-items-center tw-justify-between">

            <h4 className="tw-font-semibold">
              Quick Links
            </h4>

            <Button
              type="button"
              onClick={() => openQuickLinkModalHdnlr()}
              variant='primary'
            >
              <i className="ri-add-line"></i>
              Add Link
            </Button>

          </div>
        </div>

        {getQuickLinkResp?.length > 0 ? (

          <div
            className="tw-py-3 tw-px-3 quick-link-container
                 tw-overflow-y-auto tw-overflow-x-hidden"
            
          >
            <div className="tw-flex tw-flex-wrap tw-gap-3 tw-pb-2">

              {quickLinks?.map((link: any) => (
                <div
                  key={link.quickLinkId}
                  className="tw-w-full md:tw-w-[48%]"
                >
                  <div
                    className="tw-rounded-md tw-flex tw-flex-col tw-items-center
                         tw-px-3 tw-py-2 quick-link-element"
                    style={{
                      backgroundColor: `${link.quickLinkCardColor}`,
                    }}
                  >

                    <div
                      className="tw-p-1 tw-rounded-full tw-mb-2"
                      style={{
                        border: `1px solid ${link.quickLinkBgColor}`,
                      }}
                    >
                      <div
                        className="tw-rounded-full tw-flex tw-items-center
                             tw-justify-center tw-cursor-pointer"
                        style={{
                          backgroundColor: `${link.quickLinkBgColor}`,
                          height: "2.6rem",
                          width: "2.6rem",
                        }}
                        onClick={() => openInNewTab(link.quickLinkUrl)}
                      >
                        <i
                          className={`${link.quickLinkIcon} tw-text-white tw-text-[16px]`}
                        ></i>
                      </div>
                    </div>

                    <p
                      className="tw-text-inherit tw-text-[14px] tw-mb-0 tw-cursor-pointer"
                      onClick={() => openInNewTab(link.quickLinkUrl)}
                    >
                      {link.quickLinkTitle}
                    </p>

                  </div>
                </div>
              ))}

            </div>
          </div>

        ) : (

          <div className="tw-flex tw-items-center tw-justify-center tw-text-center tw-p-6">
            <p>No Quick Links Found</p>
          </div>

        )}
      </div>
      <ModalContainerUpdated
        id="company-details-modal"
        isOpen={quickLinkModalState.showModal}
        toggle={() => closeQuickLinkDetailsModalHdnlr()}
        modalTitle={
          quickLinkModalState.modalData
            ? "Edit Company Details"
            : "Create Details"
        }
        modalSize="md"
      >
        <QuickLinkModel
          id={quickLinkModalState.modalData}
          toggle={() => closeQuickLinkDetailsModalHdnlr()}
          modalTitle="Create Company Details"
          isOpen={false}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default QuickLinks;