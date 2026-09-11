import { InputCheckbox } from "../../../Components/Common";

interface PaymentGatewayValue {
  id: string | number;
  checked: boolean;
}

interface RowData {
  branchName: string;
  branchId: string | number;
  actions?: any;
  [key: string]: PaymentGatewayValue | any;
}

const generateDynamicColumns = (
  getPaymentGatewaysListResp: any,
  handleCheckboxChange
) => {
  return Array.isArray(getPaymentGatewaysListResp)
    ? getPaymentGatewaysListResp.map((item) => ({
        Header: item.pgName,
        accessor: `${item.pgName}`,
        disableSortBy: true,
        Cell: ({ row, value }: any) => {
          const branchId = row.original.branchId;
          const name = `${branchId}_${item.pgName}`;

          return (
            <InputCheckbox
              name={name}
              value={value?.checked}
              onChange={(e: any) =>
                handleCheckboxChange(
                  branchId,
                  item.pgName,
                  item.id,
                  e.target.checked
                )
              }
            ></InputCheckbox>
          );
        },
      }))
    : [];
};

export function generateColumns(
  getPaymentGatewaysListResp: any,
  handleCheckboxChange,
  saveHandlerApi
) {
  return [
    {
      Header: "Branch",
      accessor: "branchName",
      disableSortBy: true,
    },
    ...generateDynamicColumns(getPaymentGatewaysListResp, handleCheckboxChange),
    {
      Header: "Actions",
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        const branchId = row.original.branchId;
        const rowData = row.original as RowData;

        const handleButtonClick = () => {
          const checkedPgIds = Object.entries(rowData)
            .filter(([key, value]) => {
              if (
                key === "branchName" ||
                key === "branchId" ||
                key === "actions"
              ) {
                return false;
              }

              const pgValue = value as PaymentGatewayValue;
              return pgValue?.checked === true;
            })
            .map(([key, value]) => {
              const pgValue = value as PaymentGatewayValue;
              return pgValue.id;
            });

          saveHandlerApi({ branchId, feePgIds: checkedPgIds });
        };

        return (
          <button
            className="btn btn-sm btn-success"
            onClick={handleButtonClick}
          >
            Update
          </button>
        );
      },
    },
  ];
}
