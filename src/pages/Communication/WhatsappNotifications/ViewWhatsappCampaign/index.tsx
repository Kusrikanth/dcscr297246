import { useEffect, useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import {
  Download01Icon,
  ReloadIcon,
  SentIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getWhatsappTemplatesAct } from "../../../../store/communication/communicationactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getDateWithTimeFormat } from "../../../../utility/dateutility";


const ViewWhatsappCampaign = ({ campaignId }) => {
  const dispatch = useAppDispatch();
  const {
    manageNotificationResp,
    currentBranchIdResp: branchId,
    whatsappTemplatesResp,
    branchListResp,
  } = useAppSelector(
    ({ communication, appData, branch }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      manageNotificationResp: communication.manageNotificationResp,
      whatsappTemplatesResp: communication.whatsappTemplatesResp,
      branchListResp: branch.branchListResp,
    }),
    shallowEqual
  );

  const { branchName, instituteName } = useMemo<any>(() => {
    if (!Array.isArray(branchListResp?.data)) return {};

    return (
      branchListResp.data.find(
        (item: any) => Number(item.branchId) === Number(branchId)
      ) || {}
    );
  }, [branchId, branchListResp]);

  const selectedCampaignDetails = useMemo(() => {
    if (!manageNotificationResp?.data?.length || !campaignId) return null;

    return manageNotificationResp.data.find(
      (campaign: any) => Number(campaign.id) === Number(campaignId)
    );
  }, [manageNotificationResp, campaignId]);

  const selectedTemplate = useMemo(() => {
    if (!whatsappTemplatesResp || !selectedCampaignDetails?.templateName) {
      return null;
    }

    return whatsappTemplatesResp.find(
      (template: any) =>
        template.templateName === selectedCampaignDetails.templateName
    );
  }, [whatsappTemplatesResp, selectedCampaignDetails]);

  const toPascalCase = (value?: string) => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  const previewMessage = useMemo(() => {
    let message = selectedTemplate?.templateMsg || "";

    message = message.replace(
      /{{\s*1\s*}}/g,
      toPascalCase(selectedCampaignDetails?.recipientType)
    );

    message = message.replace(/{{\s*2\s*}}/g, branchName || "");

    message = message.replace(
      /{{\s*3\s*}}/g,
      selectedCampaignDetails?.msgBody || ""
    );

    return message;
  }, [selectedTemplate?.templateMsg, selectedCampaignDetails?.recipientType, selectedCampaignDetails?.msgBody, branchName,]);

  useEffect(() => {
    if (branchId) {
      dispatch(
        getWhatsappTemplatesAct(
          generateActionPayload(
            "whatsapp_templates_v1",
            { branchId },
            {
              moduleName: "POST_ADMISSION",
            }
          )
        )
      );
    }
  }, [branchId, dispatch]);

  const { mediaType, media } = selectedCampaignDetails || {};
  const hasMedia = Boolean(media?.s3Url);
  const getInitial = (value?: string) => {
    return value?.trim()?.charAt(0)?.toUpperCase() || "W";
  };

  return (
    <div className="tw-w-full">
      <div className="tw-rounded-xl tw-border tw-border-slate-200 tw-bg-white tw-shadow-sm">
        <div className="tw-border-b tw-border-slate-100 tw-px-5 tw-py-4">
          <div className="tw-flex tw-items-start tw-justify-between tw-gap-4">
            <div>
              <h3 className="tw-mb-1 tw-text-base tw-font-semibold tw-text-slate-900">
                Message Preview
              </h3>

              <p className="tw-mb-0 tw-text-sm tw-text-slate-500">
                {selectedCampaignDetails?.title || "Untitled Campaign"}
              </p>
            </div>
            <span className="tw-rounded-full tw-bg-emerald-50 tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-text-emerald-700">
              WhatsApp
            </span>
          </div>
          <div className="tw-mt-4 tw-flex tw-flex-wrap tw-gap-2">
            <span className="tw-rounded-full tw-bg-slate-100 tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-text-slate-600">
              Template: {selectedTemplate?.templateName || "-"}
            </span>

            <span className="tw-rounded-full tw-bg-slate-100 tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-text-slate-600">
              Media: {mediaType ? toPascalCase(mediaType) : "None"}
            </span>
          </div>
        </div>
        <div className="tw-bg-slate-50 tw-p-4 sm:tw-p-6">
          <div className="tw-mx-auto tw-w-full tw-max-w-[430px] tw-overflow-hidden tw-rounded-[28px] tw-border tw-border-slate-200 tw-bg-white tw-shadow-lg">
            <div className="tw-flex tw-items-center tw-gap-3 tw-bg-[#075E54] tw-px-4 tw-py-3">
              <div className="tw-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-rounded-full tw-bg-white/20 tw-text-sm tw-font-semibold tw-text-white">
                {getInitial(instituteName)}
              </div>
              <div className="tw-min-w-0">
                <p className="tw-mb-0 tw-truncate tw-text-sm tw-font-semibold tw-text-white">
                  {instituteName && branchName
                    ? `${instituteName} - ${branchName}`
                    : "WhatsApp Business"}
                </p>
                <p className="tw-mb-0 tw-text-xs tw-text-white/75">
                  WhatsApp Business
                </p>
              </div>
            </div>
            <div className="tw-min-h-[420px] tw-bg-[#efe7dd] tw-p-4">
              <div className="tw-flex tw-justify-start">
                <div className="tw-max-w-[92%] tw-rounded-2xl tw-rounded-tl-sm tw-bg-white tw-p-2 tw-shadow-sm">
                  {hasMedia && (
                    <div className="tw-mb-3">
                      {mediaType === "IMAGE" && (
                        <a
                          href={media.s3Url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open image in new tab"
                          className="tw-block"
                        >
                          <div className="tw-overflow-hidden tw-rounded-xl tw-border tw-border-slate-100 tw-bg-slate-50">
                            <img
                              src={media.s3Url}
                              alt={media.originalFileName || "Campaign media"}
                              className="tw-h-auto tw-max-h-[260px] tw-w-full tw-object-contain tw-cursor-pointer hover:tw-opacity-90"
                            />
                          </div>
                        </a>
                      )}
                      {mediaType === "VIDEO" && (
                        <video
                          controls
                          className="tw-w-full tw-rounded-xl tw-border tw-border-slate-100"
                        >
                          <source src={media.s3Url} />
                        </video>
                      )}
                      {mediaType === "DOCUMENT" && (
                        <a
                          href={media.s3Url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tw-flex tw-items-center tw-gap-3 tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-p-3 tw-text-sm tw-font-medium tw-text-slate-700 hover:tw-bg-slate-100"
                        >
                          <span className="tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-lg tw-bg-white tw-text-lg">
                            📄
                          </span>
                          <span className="tw-min-w-0 tw-flex-1 tw-truncate">
                            {media.originalFileName || "View document"}
                          </span>
                        </a>
                      )}
                    </div>
                  )}
                  <p className="tw-mb-0 tw-whitespace-pre-line tw-text-[14px] tw-leading-6 tw-text-slate-900">
                    {previewMessage || "No message preview available."}
                  </p>
                  <div className="tw-mt-2 tw-flex tw-justify-end">
                    <span className="tw-text-[10px] tw-text-slate-400">
                      {getDateWithTimeFormat(
                        selectedCampaignDetails?.triggerDate
                          ? `${selectedCampaignDetails.triggerDate}Z`
                          : ""
                      )?.split(", ")[1] || ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!selectedCampaignDetails && (
            <p className="tw-mt-4 tw-text-center tw-text-sm tw-text-slate-500">
              Campaign details not found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewWhatsappCampaign;
