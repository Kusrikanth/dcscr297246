interface IStatusLabel {
  type: string,
  labelName: string,
}

export const StatusLabel = ({ type, labelName }: IStatusLabel) => {
  if (!type || typeof (type) !== "string") {
    return null;
  }
  switch (type.toLowerCase()) {
    case "waring":
    case "pending":
    case "unpaid":
    case "incomplete":
    case "medium":
    case "no":
      return <span className="badge text-uppercase badge-soft-warning tw-p-2"> {labelName} </span>;
    case "cancelled":
    case "rejected":
    case "delete":
    case "absent":
    case "failed":
    case "fail":
    case "reversed":
    case "inactive":
    case "closed":
    case "high":
    case "critical":
    case "not-loggedin":
    case "i":
    case "discarded":
    case "deallocated":
    case "not_allocated":
    case "resigned":
    case "not eligible":
    case "hard":
    case "expired":
      return <span className="badge text-uppercase badge-soft-danger tw-p-2"> {labelName} </span>;
    case "inprogress":
    case "cred":
    case "sub-pool":
      return <span className="badge text-uppercase badge-soft-secondary tw-p-2"> {labelName} </span>;
    case "pickups":
    case "conditional_admission":
    case "new":
    case "available":
    case "holiday":
    case "relocated":
      return <span className="badge text-uppercase badge-soft-info tw-p-2"> {labelName} </span>;
    case "active":
    case "approved":
    case "default":
    case "current":
    case "paid":
    case "pay":
    case "pass":
    case "issued":
    case "accepted":
    case "recommended":
    case "present":
    case "low":
    case "complete":
    case "fee cleared":
    case "prepared":
    case "good":
    case "a":
    case "y":
    case "assigned":
    case "promoted":
    case "true":
    case "allocated":
    case "verified":
    case "yes":
    case "renewal":
    case "completed":
    case "sent":
    case "passed":
    case "admitted":
    case "scheduled":
    case "live":
    case "payment_successful":
    case "published":
    case "success":
    case "eligible":
    case "easy":
    case "generated":
    case "pool":
    case "ok":
      return <span className="badge tw-uppercase badge-soft-success tw-p-2"> {labelName} </span>;
    case "disabled":
    case "flex":
      return <span className="badge tw-uppercase bg-light text-muted tw-p-2"> {labelName} </span>;
    default:
      return <span className="badge tw-uppercase badge-soft-warning tw-p-2"> {labelName} </span>;
  }
}