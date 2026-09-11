import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import classnames from "classnames";
import { resetHodFeedbackHistoryDetailsByIdAct } from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumslice";
import { useEffect } from "react";
import { getDateWithTimeFormat } from "../../../../utility/dateutility";

const FeedBackHistoryModal = (props: any) => {
  const {
    getHodFeedbackHistoryDetailsByIdResp,
    lmsdigitalcurriculumErrorAct,
  } = useAppSelector(
    ({ lmsdigitalcurriculum }) => ({
      getHodFeedbackHistoryDetailsByIdResp: lmsdigitalcurriculum.getHodFeedbackHistoryDetailsByIdResp,
      lmsdigitalcurriculumErrorAct: lmsdigitalcurriculum.lmsdigitalcurriculumErrorAct,

    }),
    shallowEqual
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetHodFeedbackHistoryDetailsByIdAct(undefined));
    };
  }, []);
  const STATUS_MAP: any = {
    APPROVED: {
      label: "Approved",
      pill: "tw-bg-green-50 tw-text-green-700 tw-border-green-200",
      dot: "tw-bg-green-600",
    },
    REQUEST_CHANGE: {
      label: "Changes Requested",
      pill: "tw-bg-amber-50 tw-text-amber-700 tw-border-amber-200",
      dot: "tw-bg-amber-500",
    },
    REJECTED: {
      label: "Rejected",
      pill: "tw-bg-red-50 tw-text-red-700 tw-border-red-200",
      dot: "tw-bg-red-500",
    },
    PENDING: {
      label: "Pending",
      pill: "tw-bg-gray-50 tw-text-gray-600 tw-border-gray-200",
      dot: "tw-bg-gray-300",
    },
  };
  const historyList = getHodFeedbackHistoryDetailsByIdResp?.content ?? [];

  return (
    <div className="modal-body p-3">
      <div className="tw-bg-white tw-rounded-2xl tw-border tw-border-gray-100 tw-shadow-sm tw-p-5">
        <div className="tw-flex tw-items-start tw-justify-between tw-mb-4">
          <div>
            <h4 className="tw-text-[16px] tw-font-semibold tw-text-gray-900">
              Decision Timeline
            </h4>
            <p className="tw-text-sm tw-text-gray-500">
              All decisions taken for this curriculum, ordered from latest to oldest.
            </p>
          </div>
        </div>
        <div className="tw-relative tw-pl-6">
          <div className="tw-absolute tw-left-[11px] tw-top-0 tw-bottom-0 tw-w-px tw-bg-gray-200" />

          {historyList.map((item: any, index: number) => {
            const statusCfg = STATUS_MAP[item.reviewStatus] || STATUS_MAP.PENDING;

            return (
              <div key={item.id} className="tw-relative tw-mb-6">
                <span
                  className={classnames(
                    "tw-absolute tw-left-0 tw-top-4 tw-w-3 tw-h-3 tw-rounded-full tw-border-2 tw-border-white",
                    statusCfg.dot
                  )}
                />
                <div className="tw-ml-6 tw-bg-gray-50 tw-rounded-xl tw-border tw-border-gray-100 tw-p-4">
                  <div className="tw-flex tw-items-start tw-justify-between">
                    <div>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <h5 className="tw-text-sm tw-font-semibold tw-text-gray-900">
                          {statusCfg.label} – v{item.version}
                        </h5>
                        <span
                          className={classnames(
                            "tw-text-xs tw-font-medium tw-px-2 tw-py-0.5 tw-rounded-full tw-border",
                            statusCfg.pill
                          )}
                        >
                          {statusCfg.label}
                        </span>
                      </div>
                      {item.remarks && (
                        <p className="tw-text-sm tw-text-gray-600 tw-mt-1">
                          {item.remarks}
                        </p>
                      )}
                    </div>
                    <div className="tw-text-right tw-text-xs tw-text-gray-500">
                      <div>
                        {item.createdAt
                          ? `${getDateWithTimeFormat(item.createdAt)}`
                          : "-"}
                      </div>
                      <div className="tw-mt-1">
                        {item.reviewedBy || "HOD"}
                      </div>
                    </div>
                  </div>
                  {item.reviewComments && (
                    <div className="tw-mt-3 tw-bg-white tw-rounded-lg tw-border tw-border-gray-100 tw-p-3 tw-text-sm tw-text-gray-700">
                      {item.reviewComments}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeedBackHistoryModal;
