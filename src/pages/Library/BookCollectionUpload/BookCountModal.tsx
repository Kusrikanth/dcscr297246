import React, { useMemo } from "react";
import { Popover, PopoverBody } from "reactstrap";

export default function BookCountPopover(props: any) {
  const { data, popOver, id, toggle } = props;

  const rows = useMemo(
    () => [
      {label: "Total Quantity", value: data?.quantity ?? 0 },
      { label: "Not Issued", value: data?.notIssuedCount ?? 0 },
      { label: "Issued", value: data?.issuedCount ?? 0 },
      { label: "Damaged", value: data?.damagedCount ?? 0 },
    ],
    [data]
  );

  return (
    <Popover
      flip
      target={`testing-${id}`}
      isOpen={popOver}
      toggle={toggle}
      placement="right"
    >
      <PopoverBody className="tw-p-0">
        <table className="tw-w-full tw-border-collapse">
          <thead>
            <tr className="tw-bg-gray-100">
              <th className="tw-px-3 tw-py-2 tw-text-left tw-text-sm tw-font-semibold tw-text-gray-700">
                Book Types
              </th>
              <th className="tw-px-3 tw-py-2 tw-text-left tw-text-sm tw-font-semibold tw-text-gray-700">
                Book Counts
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.label}
                className="tw-border-b last:tw-border-b-0"
              >
                <td className="tw-px-3 tw-py-2 tw-text-sm tw-text-gray-700">
                  {r.label}
                </td>
                <td className="tw-px-3 tw-py-2 tw-text-sm tw-text-gray-700">
                  {r.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PopoverBody>
    </Popover>
  );
}
