import { transformedFeeds } from "./helper";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useMemo } from "react";

const NoticeBoard = () => {

  const {
    getFeedsListResp,
  } = useAppSelector(({ academicRequest }) => ({
    getFeedsListResp: academicRequest.getFeedsListResp
  }), shallowEqual);

  const noticeBoardEvents = useMemo(() => transformedFeeds(getFeedsListResp?.data), [getFeedsListResp]);

  return (
    <>
      <div className="custom_card_wrap upcoming-activities-container">

        <div className="tw-py-0">

          <div className="tw-mt-4">

            <ul className="tw-flex-1 tw-flex-col tw-gap-2 tw-px-2">

              {(noticeBoardEvents || []).map((item: any, key: any) => (
                <li
                  key={key}
                  className="tw-shadow tw-rounded-md tw-my-2 tw-p-2 tw-flex tw-flex-col tw-transition tw-duration-200 hover:tw-shadow-lg upcoming-activities-item"
                  style={{ borderLeft: `4px solid ${item.blColour}` }}
                >
                  <div className="tw-flex tw-flex-col tw-gap-1">

                    <h6 className="tw-mb-1 tw-font-bold">
                      {item.eventTitle}
                    </h6>

                    <div className="tw-text-gray-500 tw-flex tw-items-center tw-gap-1">
                      <span className="tw-flex tw-items-center">
                        <i className="ri-calendar-check-line tw-text-gray-400"></i>
                      </span>
                      <span className="tw-text-sm">Added on : {item.addedOn}</span>
                    </div>

                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticeBoard;