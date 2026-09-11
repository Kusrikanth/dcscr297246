import React, { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  File01Icon,
  Tick02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { SelectInput, TextInput } from "../../Components/Common";
import NoDataComp from "../../Components/Common/NoDataComp";
import ApprovalDecisionModal, { IApprovalAction } from "./ApprovalDecisionModal";
import { approvalTypeOptions, IApprovalRequest } from "./helper";

interface IApprovalsPanelProps {
  approvals: Array<IApprovalRequest>;
  onDecision: (
    request: IApprovalRequest,
    action: IApprovalAction,
    reason: string
  ) => void;
}

const ApprovalsPanel: React.FC<IApprovalsPanelProps> = ({
  approvals,
  onDecision,
}) => {
  const [typeFilter, setTypeFilter] = useState("All requests");
  const [searchString, setSearchString] = useState("");
  const [decisionState, setDecisionState] = useState<{
    request?: IApprovalRequest;
    action?: IApprovalAction;
  }>({});

  const visibleApprovals = useMemo(() => {
    return approvals.filter((item) => {
      const searchable =
        `${item.type} ${item.person} ${item.detail} ${item.range} ${item.submitted} ${item.priority} ${item.requirement}`.toLowerCase();
      return (
        (typeFilter === "All requests" || item.type === typeFilter) &&
        (!searchString.trim() ||
          searchable.includes(searchString.trim().toLowerCase()))
      );
    });
  }, [approvals, typeFilter, searchString]);

  function closeDecisionModal() {
    setDecisionState({});
  }

  return (
    <div className="tw-card tw-mb-0 tw-h-full">
      <div className="tw-card-header tw-flex tw-items-start tw-gap-3">
        <div className="tw-flex-grow tw-min-w-0">
          <h4 className="tw-card-title">Approvals &amp; acknowledgements</h4>
          <p className="tw-card-subTitle">
            Mandatory decisions and non-blocking notifications
          </p>
        </div>
        <div className="tw-flex-shrink-0" style={{ minWidth: "11rem" }}>
          <SelectInput
            name="approvalType"
            value={typeFilter}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setTypeFilter(event.target.value)
            }
            menuItems={approvalTypeOptions}
            valueKey="key"
            textKey="name"
            hideSelectOption
            formgroupClassName="tw-mb-0"
          />
        </div>
      </div>

      <div className="tw-card-body">
        <div className="search-box tw-mb-3">
          <TextInput
            name="approvalSearch"
            value={searchString}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearchString(event.target.value)
            }
            inputClassName="tw-bg-gray-100"
            formgroupClassName="tw-mb-0"
            placeHolder="Search requests by person, type, class or reference"
            maxLength={80}
          />
          <i className="ri-search-line search-icon" />
        </div>

        <div className="tw-flex tw-flex-col tw-gap-2">
          {visibleApprovals.length ? (
            visibleApprovals.map((item) => (
              <div
                key={item.id}
                className="tw-border tw-rounded-md tw-p-3 tw-flex tw-items-start tw-gap-3"
              >
                <span className="tw-flex tw-items-center tw-justify-center tw-rounded-md tw-w-9 tw-h-9 tw-flex-shrink-0 tw-bg-gray-100 tw-text-gray-600">
                  <HugeiconsIcon icon={File01Icon} size={18} />
                </span>

                <div className="tw-flex-grow tw-min-w-0">
                  <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                    <strong className="tw-text-sm">{item.type}</strong>
                    {item.priority === "Urgent" && (
                      <span className="badge badge-soft-danger text-uppercase">
                        Urgent
                      </span>
                    )}
                    <span
                      className={`badge text-uppercase ${item.requirement === "mandatory"
                          ? "badge-soft-warning"
                          : "badge-soft-info"
                        }`}
                    >
                      {item.requirement === "mandatory"
                        ? "Mandatory"
                        : "Acknowledgement"}
                    </span>
                  </div>
                  <p className="tw-text-sm tw-mb-0">{item.person}</p>
                  <small className="tw-text-gray-500">
                    {item.detail} · {item.range} · {item.submitted}
                    {item.requirement === "acknowledgement"
                      ? " · Does not block completion"
                      : ""}
                  </small>
                </div>

                <div className="tw-flex tw-items-center tw-gap-2 tw-flex-shrink-0">
                  {item.requirement === "mandatory" ? (
                    <>
                      <button
                        type="button"
                        title="Reject"
                        aria-label={`Reject ${item.type}`}
                        onClick={() =>
                          setDecisionState({ request: item, action: "reject" })
                        }
                        className="btn btn-sm btn-soft-danger tw-flex tw-items-center tw-justify-center"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={16} />
                      </button>
                      <button
                        type="button"
                        title="Approve"
                        aria-label={`Approve ${item.type}`}
                        onClick={() =>
                          setDecisionState({ request: item, action: "approve" })
                        }
                        className="btn btn-sm btn-soft-success tw-flex tw-items-center tw-justify-center"
                      >
                        <HugeiconsIcon icon={Tick02Icon} size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setDecisionState({ request: item, action: "acknowledge" })
                      }
                      className="btn btn-sm btn-soft-info tw-flex tw-items-center tw-gap-1"
                    >
                      <HugeiconsIcon icon={Tick02Icon} size={15} />
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <NoDataComp
              title="No matching requests"
              helperText="Change or clear the keyword and request filters."
            />
          )}
        </div>

        {decisionState.request && decisionState.action && (
          <ApprovalDecisionModal
            isOpen
            request={decisionState.request}
            action={decisionState.action}
            toggle={closeDecisionModal}
            onConfirm={(reason: string) => {
              onDecision(
                decisionState.request as IApprovalRequest,
                decisionState.action as IApprovalAction,
                reason
              );
              closeDecisionModal();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ApprovalsPanel;
