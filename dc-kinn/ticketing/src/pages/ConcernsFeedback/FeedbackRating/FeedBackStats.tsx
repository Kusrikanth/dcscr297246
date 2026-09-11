import bgImg from "../../../assets/imagesdps/updatedDashboard/cardimg.svg";
import classNames from "classnames";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserMultiple03Icon } from "@hugeicons-pro/core-stroke-standard";

export default function StatusCard() {
  return (
    <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-3 fee-payment-reports stats-card-types-container">

      <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-3">
        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-0 type-one-card">
          <div className="bg-image">
            <img src={bgImg} alt="bg-image" />
          </div>

          <div className="tw-p-4 tw-relative tw-z-[1]">
            <div className="tw-flex">
              <div
                className={classNames(
                  "tw-flex tw-justify-center tw-items-center tw-me-3 tw-flex-shrink-0 payment-icon jodocred-icon"
                )}
              >
                <HugeiconsIcon
                  icon={UserMultiple03Icon}
                  size={18}
                  style={{ fill: "none" }}
                />
              </div>

              <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                <p
                  className="tw-mb-2 tw-leading-snug tw-font-medium tw-text-gray-500 tw-truncate"
                  title="Total Users"
                >
                  Total Users
                </p>
                <h5 className="tw-leading-none tw-mb-0 tw-text-gray-900">45</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-3">
        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-0 type-one-card">
          <div className="bg-image">
            <img src={bgImg} alt="bg-image" />
          </div>

          <div className="tw-p-4 tw-relative tw-z-[1]">
            <div className="tw-flex">
              <div
                className={classNames(
                  "tw-flex tw-justify-center tw-items-center tw-me-3 tw-flex-shrink-0 payment-icon cash-icon"
                )}
              >
                <HugeiconsIcon
                  icon={UserMultiple03Icon}
                  size={18}
                  style={{ fill: "none" }}
                />
              </div>

              <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                <span
                  className="tw-text-gray-500 tw-mb-2 tw-leading-snug"
                  title="Feedback Given"
                >
                  Feedback Given
                </span>
                <h5 className="tw-leading-none tw-mb-0 tw-text-gray-900">24</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-3">
        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-0 type-one-card">
          <div className="bg-image">
            <img src={bgImg} alt="bg-image" />
          </div>

          <div className="tw-p-4 tw-relative tw-z-[1]">
            <div className="tw-flex">
              <div
                className={classNames(
                  "tw-flex tw-justify-center tw-items-center tw-me-3 tw-flex-shrink-0 payment-icon online-icon"
                )}
              >
                <HugeiconsIcon
                  icon={UserMultiple03Icon}
                  size={18}
                  style={{ fill: "none" }}
                />
              </div>

              <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                <span
                  className="tw-text-gray-500 tw-mb-2 tw-leading-snug"
                  title="Not Given"
                >
                  Not Given
                </span>
                <h5 className="tw-leading-none tw-mb-0 tw-text-gray-900">10</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-3">
        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-0 type-one-card">
          <div className="bg-image">
            <img src={bgImg} alt="bg-image" />
          </div>

          <div className="tw-p-4 tw-relative tw-z-[1]">
            <div className="tw-flex">
              <div
                className={classNames(
                  "tw-flex tw-justify-center tw-items-center tw-me-3 tw-flex-shrink-0 payment-icon jodoflex-icon"
                )}
              >
                <i className="ri-star-line tw-text-[18px]" />
              </div>

              <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                <p
                  className="tw-mb-2 tw-leading-snug tw-font-medium tw-text-gray-500 tw-truncate"
                  title="Avg Rating"
                >
                  Avg Rating
                </p>
                <h5 className="tw-leading-none tw-mb-0 tw-text-gray-900">3.5</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
