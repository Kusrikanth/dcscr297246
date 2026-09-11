export interface IBranchState {
    isListMode: boolean,
}

export interface IOptionsHrtl {
    id?: string;
    actionIcon?: React.ReactNode;
    actionName?: string;
    onClickHndlr?: any;
  }

export interface IBranchesCardContainer {
    branchesList?: any,
    updateMainBranchHndlr?: any,
    menuOptions?: IOptionsHrtl[],
    callbackPaginationHndlr?: any,
    totalPages?: number,
    totalRecords?: number,
    currentPageNumber?: number,
    assignAdminHndlr?: any;
}