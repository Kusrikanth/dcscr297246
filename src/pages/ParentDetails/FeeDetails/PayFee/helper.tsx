import { InputCheckbox, StatusLabel } from "../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { getAmountValueWithDecimal, getDisplayAmountValue } from "../../../../utility/commonutility";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";
import { StatusLabelWithStepper } from "../../../NewAcademics/TransferCertificate/StatusLabelWithStepper";



export const requestType = [
  {
    reqType: "Offline",
  },
  {
    reqType: "Online",
  }
]

// generate roll number table select filter
export const statusTypes = [
  {
    statusType: "Yet_to_prepare",
  },
  {
    statusType: "Prepared",
  },
  {
    statusType: "Issued",
  },
];

export const menuItems = [{ id: "true", name: "Yes" }, { id: "false", name: "No" }]

export function generateColumns(singleAcademicLedgerCheckHndlr: any, allAcademicLedgerSelectHndlr: any, allStudentSelected: any, jodoOptedState: boolean) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            isDisabled={jodoOptedState}
            // labelName={shortName}
            value={allStudentSelected}
            onChange={allAcademicLedgerSelectHndlr}
            formgroupClassName="tw-tw-mb-0"
          />
        )
      },
      accessor: "isStudentChecked",
      columnClassName: "tw-w-[5%]",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { id, isEnabled, isChecked } = original;
        return (
          <>
            <InputCheckbox
              name={`fee-${id}`}
              // labelName={shortName}
              value={isChecked}
              isDisabled={!isEnabled}
              onChange={singleAcademicLedgerCheckHndlr}
              dataId={id}
              formgroupClassName="tw-tw-mb-0"
            />
          </>
        )
      }
    },
    {
      Header: "Academic Year",
      accessor: "academicYear",
      disableSortBy: true,
    },
    {
      Header: "Fee Details",
      accessor: "feeDetails",
      columnClassName: "tw-text-nowrap",
      disableSortBy: true,
    },
    {
      Header: "Last Date",
      accessor: "lastDate",
      disableSortBy: true,
      columnClassName: "tw-text-nowrap",
      Cell: ({ row: { original } }: any) => {
        return original?.lastDate && getDdMmYyyyWithMonthNameFormat(original?.lastDate);
      }
    },
    {
      Header: "Fee Amount (₹)",
      accessor: "amountToPay",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amountToPay)}</span>
        );
      },
    },
    {
      Header: "Concession (₹)",
      accessor: "totalConcession",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.totalConcession)}</span>
        );
      },
    },
    {
      Header: "Amount To Pay (₹)",
      accessor: "netAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.netAmount)}</span>;
      },
    },
    {
      Header: "Amount Paid (₹)",
      accessor: "amountPaid",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amountPaid)}</span>
        );
      },
    },
    {
      Header: "Balance (₹)",
      accessor: "balance",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amountToBePaid)}</span>
        );
      },
    },
    {
      Header: "Fine (₹)",
      accessor: "fineAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.fineAmount)}</span>
        );
      },
    },
    {
      Header: "Status",
      accessor: "paymentStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <StatusLabel type={original.paymentStatus} labelName={original.paymentStatus} />
      },
    },

  ];
}


export function generateTransportationColumns(singleTransportLedgerCheckHndlr: any, allTransportLedgerSelectHndlr: any, allStudentSelected: any, jodoOptedState: boolean) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            isDisabled={jodoOptedState}
            // labelName={shortName}
            value={allStudentSelected}
            onChange={allTransportLedgerSelectHndlr}
            formgroupClassName="tw-mb-0"
          />
        )
      },
      accessor: "isStudentChecked",
      columnClassName: "tw-w-[5%]",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { id, isEnabled, isChecked } = original;
        return (
          <>
            <InputCheckbox
              name={`fee-${id}`}
              // labelName={shortName}
              value={isChecked}
              isDisabled={!isEnabled}
              onChange={singleTransportLedgerCheckHndlr}
              dataId={id}
              formgroupClassName="tw-mb-0"
            />
          </>
        )
      }
    },
    {
      Header: "Academic Year",
      accessor: "academicYear",
      disableSortBy: true,
    },
    {
      Header: "Fee Details",
      accessor: "feeDetails",
      columnClassName: "tw-text-nowrap",
      disableSortBy: true,
    },
    {
      Header: "Last Date",
      accessor: "lastDate",
      disableSortBy: true,
      columnClassName: "tw-text-nowrap",
      Cell: ({ row: { original } }: any) => {
        return original?.lastDate && getDdMmYyyyWithMonthNameFormat(original?.lastDate);
      }
    },
    {
      Header: "Fee Amount (₹)",
      accessor: "feeAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amountToPay)}</span>
        );
      },
    },
    {
      Header: "Concession (₹)",
      accessor: "concession",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.totalConcession)}</span>
        );
      },
    },
    {
      Header: "Amount To Pay (₹)",
      accessor: "netAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.netAmount)}</span>;
      },
    },
    {
      Header: "Amount Paid (₹)",
      accessor: "amountPaid",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amountPaid)}</span>
        );
      },
    },
    {
      Header: "Balance (₹)",
      accessor: "balance",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amountToBePaid)}</span>
        );
      },
    },
    {
      Header: "Fine (₹)",
      accessor: "fineAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.fineAmount)}</span>
        );
      },
    },
    {
      Header: "Status",
      accessor: "paymentStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <StatusLabel type={original.paymentStatus} labelName={original.paymentStatus} />
      },
    },

  ];
}

export function validateLedgersForPayment(ledgers: Array<any>, academicLedgers: Array<number>, transportLedgers: Array<number>) {
  const academicLedgerStore = ledgers?.filter((i: any) => (
    !i?.feeDetails.includes("TRANSPORT") &&
    (i?.paymentStatus === "Unpaid" || i?.paymentStatus === "Partially paid"))).reduce((obj, item) => {
      const { id, academicYearId, termId, feeDetails, academicYear } = item,
        keyName = `${academicYearId}-${termId || 0}`;
      obj[keyName] = { id, feeDetails, academicYear };
      return obj;
    }, {});
  const transportLedgerStore = ledgers?.filter((i: any) => (
    i?.feeDetails.includes("TRANSPORT") &&
    (i?.paymentStatus === "Unpaid" || i?.paymentStatus === "Partially paid"))).reduce((obj, item) => {
      const { id, academicYearId, termId, feeDetails, academicYear } = item,
        keyName = `${academicYearId}-${termId || 0}`;
      obj[keyName] = { id, feeDetails, academicYear };
      return obj;
    }, {});
  if (academicLedgers.length > 0 && Object.keys(transportLedgerStore).length === 0) {
    return { isValid: true, message: "" };
  }
  if (transportLedgers.length > 0 && Object.keys(academicLedgerStore).length === 0) {
    return { isValid: true, message: "" };
  }
  const pendingFeeName: any = [];
  if (academicLedgers.length > 0) {
    const sortAcademicLedgers = academicLedgers.sort(),
      endLedgerId = sortAcademicLedgers[sortAcademicLedgers.length - 1],
      { academicYearId: lastLedgerAcademicYearId,
        termId: lastTermId = 0
      }: any = ledgers.find((item: any) => item.id === endLedgerId) || {};

    const transportLedgerKeys = Object.keys(transportLedgerStore),
      lastKeyName = `${lastLedgerAcademicYearId}-${lastTermId || 0}`;
    for (let i = 0; i < transportLedgerKeys.length; i++) {
      const [transportAcademicYearId, transportTermId] = transportLedgerKeys[i]?.split('-') || [],
        { id, academicYear, feeDetails } = transportLedgerStore[transportLedgerKeys[i]];
      if ((Number(transportAcademicYearId) < lastLedgerAcademicYearId) && !transportLedgers.includes(id)) {
        pendingFeeName.push(`${feeDetails}(${academicYear})`);
      }
      if ((Number(transportAcademicYearId) === lastLedgerAcademicYearId) &&
        (Number(transportTermId) < lastTermId) &&
        !transportLedgers.includes(id)) {
        pendingFeeName.push(`${feeDetails}(${academicYear})`);
      }
      if (lastKeyName === transportLedgerKeys[i] && !transportLedgers.includes(id)) {
        pendingFeeName.push(`${feeDetails}(${academicYear})`);
      }
    }
    // return { isValid: !pendingFeeName.length, message: pendingFeeName.join(', ') };
  }
  if (transportLedgers.length > 0) {
    const sortTransportLedgers = transportLedgers.sort(),
      endLedgerId = sortTransportLedgers[sortTransportLedgers.length - 1],
      { academicYearId: lastLedgerTransportYearId,
        termId: lastTermId = 0
      }: any = ledgers.find((item: any) => item.id === endLedgerId) || {};

    const academicLedgerKeys = Object.keys(academicLedgerStore),
      lastKeyName = `${lastLedgerTransportYearId}-${lastTermId || 0}`;
    for (let i = 0; i < academicLedgerKeys.length; i++) {
      const [transportAcademicYearId, transportTermId] = academicLedgerKeys[i]?.split('-') || [],
        { id, academicYear, feeDetails } = academicLedgerStore[academicLedgerKeys[i]];
      if ((Number(transportAcademicYearId) < lastLedgerTransportYearId) && !academicLedgers.includes(id)) {
        pendingFeeName.push(`${feeDetails}(${academicYear})`);
      }
      if ((Number(transportAcademicYearId) === lastLedgerTransportYearId) &&
        (Number(transportTermId) < lastTermId) &&
        !academicLedgers.includes(id)) {
        pendingFeeName.push(`${feeDetails}(${academicYear})`);
      }
      if (lastKeyName === academicLedgerKeys[i] && !academicLedgers.includes(id)) {
        pendingFeeName.push(`${feeDetails}(${academicYear})`);
      }
    }
    // return { isValid: !pendingFeeName.length, message: pendingFeeName.join(', ') };
  }
  return { isValid: !pendingFeeName.length, message: pendingFeeName.join(', ') };



}
