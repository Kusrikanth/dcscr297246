export function convertedData(resp: any = {}) {
    return {
        totalAmt: resp?.totalFeeReceivable || resp?.feeReceivable || 0,
        collectedAmt: resp?.amountCollected || 0,
        dueAmt: resp?.dueAmount || 0,
        collectedPerc: Number(resp?.percentageOfCollected || 0).toFixed(2),
        duePrec: Number(resp?.percentageOfDue || 0).toFixed(2),
    };
}