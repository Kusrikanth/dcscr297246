import { useEffect, useMemo, useRef, useState } from "react";
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import {
  getPaymentGatewaysBranchListAct,
  getPaymentGatewaysListAct,
  savePaymentGatewaysBranchAct,
} from "../../../store/mastersettings/feesettings/feesettingsactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { toast } from "react-toastify";

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

const PaymentGateways = () => {
  const [tableData, setTableData] = useState<any>([]);
  const dispatch = useDispatch();

  const {
    currentInstIdResp: instituteId,
    getPaymentGatewaysListResp,
    getPaymentGatewaysBranchListResp,
    savePaymentGatewaysBranchResp,
    instFeeSettingError,
  } = useAppSelector(
    ({ instFeeSettings, appData }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      getPaymentGatewaysListResp: instFeeSettings.getPaymentGatewaysListResp,
      getPaymentGatewaysBranchListResp:
        instFeeSettings.getPaymentGatewaysBranchListResp,
      savePaymentGatewaysBranchResp:
        instFeeSettings.savePaymentGatewaysBranchResp,
      instFeeSettingError: instFeeSettings.instFeeSettingError,
    }),
    shallowEqual
  );

  function fetchPaymentGatewaysList(otherProps?: any) {
    const payload = {
      instituteId,
    };

    dispatch(
      getPaymentGatewaysListAct(
        generateActionPayload("get_payment_gateways_list", undefined, payload)
      )
    );
  }
  function fetchPaymentGatewaysBranchsList(otherProps?: any) {
    const payload = {
      instituteId,
    };

    dispatch(
      getPaymentGatewaysBranchListAct(
        generateActionPayload(
          "get_payment_gateways_branches_list",
          undefined,
          payload
        )
      )
    );
  }

  useEffect(() => {
    fetchPaymentGatewaysList(), fetchPaymentGatewaysBranchsList();
  }, []);

  const paymentGatewaysRef = useRef({
    prevSavePaymentGatewaysBranchResp: savePaymentGatewaysBranchResp,
    prevInstFeeSettingError: instFeeSettingError,
  });

  useEffect(() => {
    const { prevSavePaymentGatewaysBranchResp, prevInstFeeSettingError } =
      paymentGatewaysRef.current;

    if (
      savePaymentGatewaysBranchResp &&
      savePaymentGatewaysBranchResp !== prevSavePaymentGatewaysBranchResp
    ) {
      toast.success("Payment Gateway updated successfully");
      fetchPaymentGatewaysBranchsList();
      // fetchPaymentGatewaysList();
    } else if (
      instFeeSettingError &&
      instFeeSettingError !== prevInstFeeSettingError
    ) {
      const { details } = instFeeSettingError;
      toast.error(details);
    }

    paymentGatewaysRef.current.prevSavePaymentGatewaysBranchResp =
      savePaymentGatewaysBranchResp;
    paymentGatewaysRef.current.prevInstFeeSettingError = instFeeSettingError;
  }, [savePaymentGatewaysBranchResp, instFeeSettingError]);

  const handleCheckboxChange = (branchId, pgName, pgId, checked) => {
    setTableData((prev) =>
      prev.map((row) => {
        if (row.branchId === branchId) {
          return {
            ...row,
            [pgName]: {
              id: pgId,
              checked: checked,
            },
          };
        }
        return row;
      })
    );
  };

  function saveHandlerApi(saveData) {
    dispatch(
      savePaymentGatewaysBranchAct(
        generateActionPayload("save_payment_gateways", undefined, saveData)
      )
    );
  }

  const tableColumns = useMemo(
    () =>
      generateColumns(
        getPaymentGatewaysListResp,
        handleCheckboxChange,
        saveHandlerApi
      ),
    [getPaymentGatewaysListResp, handleCheckboxChange]
  );

  useEffect(() => {
    if (getPaymentGatewaysBranchListResp && getPaymentGatewaysListResp) {
      setTableData(
        getPaymentGatewaysBranchListResp.map((branchItem: any) => {
          const row: any = {
            branchName: branchItem.branchName,
            branchId: branchItem.branchId,
          };

          getPaymentGatewaysListResp.forEach((gateWay: any) => {
            row[gateWay.pgName] = { id: gateWay.id, checked: false };
          });

          branchItem.pgs.forEach((pg: any) => {
            row[pg.pgName] = { id: pg?.id, checked: !!pg?.id };
          });

          return row;
        })
      );
    }
  }, [getPaymentGatewaysBranchListResp, getPaymentGatewaysListResp]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h4 className="card-title mb-0">Payment Gateways</h4>
        </div>
        <div className="card-body p-0">
          <TableContainer
            columns={tableColumns || []}
            data={tableData || []}
            divClass="table-responsive mb-1"
            theadClass="table-light text-muted align-middle"
            showPagination={false}
          ></TableContainer>
        </div>
      </div>
    </>
  );
};

export default PaymentGateways;
