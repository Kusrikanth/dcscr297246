import React, { useMemo } from "react";
import { ModalContainer } from "../../../Components/Common";
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumns, LiveTrackingModalTableData } from "./helper";
import { LiveTrackingTypeModalProps } from "./LiveTrackingTypes";

const LiveTrackingModal = (props: LiveTrackingTypeModalProps) => {
  const roleColumns = useMemo(() => generateColumns(), []);

  return (
    <>
      <ModalContainer
        id="live-tracking"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={props.toggle}
        submitHndlr={() => {}}
        cancelHndlr={props.toggle}
        cancelTitle={"Cancel"}
        submitTitle={"Submit"}
        hideFooter={true}
        modalSize={"xl"}
        modalBodyClass="tw-p-0"
      >
        <div className="tw-inline-block tw-w-full" style={{ height: "500px" }}>
          <div className="card tw-h-full" />

          <TableContainer
            columns={roleColumns || []}
            data={LiveTrackingModalTableData}
            divClass="table-responsive tw-mb-1"
            theadClass="table-light text-muted align-middle"
          />
        </div>
      </ModalContainer>
    </>
  );
};

export default LiveTrackingModal;
