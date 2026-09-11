import { useEffect, useMemo, useState } from "react";
import TableContainer from "../../../Components/Common/TableContainer";
import { generateFeeDetailsModalColumns } from "./helper";

const ViewDetailsModal = (props: any) => {

    const [termsList, setTermsList] = useState<Array<any>>([])

    useEffect(() => {
        if(props?.modalData){
            if(props?.modalData?.feeType === "MONTH"){
                const { feeStructureMonthsDTOS } = props?.modalData || {}
                setTermsList(Array.isArray(feeStructureMonthsDTOS) ? feeStructureMonthsDTOS : [])
            }
            else if(props?.modalData?.feeType === "TERM"){
                const { feeStructureTermDTOS } = props?.modalData || {}
                setTermsList(Array.isArray(feeStructureTermDTOS) ? feeStructureTermDTOS : [])
            }
            else{
                setTermsList([])
            }
        }else{
            setTermsList([])
        }
    }, [])
    
    const feeDetailsColumns = useMemo(() => generateFeeDetailsModalColumns(), []);

  return (
    <>
      
        <TableContainer
          columns={feeDetailsColumns || []}
          data={Array.isArray(termsList) ? termsList : []}
          divClass="tw-overflow-x-auto tw-mb-3"
            theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
          tableClass="tw-mb-0"
        />
      
    </>
  );
};

export default ViewDetailsModal;
