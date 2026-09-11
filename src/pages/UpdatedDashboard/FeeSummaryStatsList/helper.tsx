import coins from "../../../assets/imagesdps/updatedDashboard/due.svg";
import money from "../../../assets/imagesdps/updatedDashboard/fee.svg";
import teaching from "../../../assets/imagesdps/updatedDashboard/teaching.svg";
import BrchTransportationSvg from "../../../assets/imagesdps/updatedDashboard/bus.png";

export const cardStatData = [
    {
        cardName : "Total Fee Receivable",
        keyName:"totalFeeReceivable",
        collctedIcon : coins,
        dueIcon : money,
    },
    {
        cardName : "Tuition Fee",
        keyName:"tuitionFee",
        collctedIcon : teaching,
        dueIcon : money,
    },
    {
        cardName : "Transport Fee",
        keyName:"transportFee",
        collctedIcon : BrchTransportationSvg,
        dueIcon : money,
    },
    {
        cardName : "Term Fee",
        keyName:"termFee",
        collctedIcon : coins,
        dueIcon : money,
    },
]

export function convertedData(resp:any){
    return {
        totalAmt : resp?.totalFeeReceivable || resp?.feeReceivable,
        collectedAmt : resp?.amountCollected,
        dueAmt : resp?.dueAmount,
        collectedPerc : parseFloat((resp.percentageOfCollected)).toFixed(2),
        duePrec : parseFloat((resp.percentageOfDue)).toFixed(2),
    }
}