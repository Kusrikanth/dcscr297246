export default {};

export interface IAddBranchAreaState {
    uniqueId: string,
    id: string,
    branchId: string,
    areaName: string,
    pinCode: string
}
export interface IBranchAreaState {
    areas: Array<IAddBranchAreaState>
}