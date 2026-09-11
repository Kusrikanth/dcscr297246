import React, { useEffect, useState } from "react";
import { Row, Col, } from "reactstrap";
import ReactPaginate from "react-paginate";
import classnames from "classnames";

export interface IPaginationState {
    pageSize: number,
    pageNo: number
}

interface IPaginationProps {
    forcePage?: number | undefined,
    callbackPaginationHndlr: any,
    paginationContainerClass?: string,
    totalPages?: number,
    totalRecords: number,
    currentPageNumber?: number,
    pageSize?: number
}


const Pagination: React.FC<IPaginationProps> = ({ callbackPaginationHndlr,
    paginationContainerClass = "tw-px-3 tw-pt-0 tw-pb-3", totalPages = 0, totalRecords,
    currentPageNumber, pageSize }) => {
    const [paginationState, setPaginationState] = useState<IPaginationState>({
        pageNo: 0,
        pageSize: (pageSize !== undefined && !isNaN(pageSize) && pageSize > 0) ? Number(pageSize) : 10,
    });
    useEffect(() => {
        if (currentPageNumber !== undefined && !isNaN(currentPageNumber) && currentPageNumber <= 0) {
            setPaginationState(prevState => ({ ...prevState, pageNo: Number(0) }));
        }
    }, [currentPageNumber]);
    function pageChangeHndlr(selectedPage: any) {
        const { selected } = selectedPage,
            updatedState = { ...paginationState, "pageNo": selected };
        setPaginationState(updatedState);
        callbackPaginationHndlr(updatedState);
    }
    function onChangeSizeHndlr(event: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = event.target,
            updatedState = { ...paginationState, [name]: Number(value), "pageNo": 0 };
        setPaginationState(updatedState);
        callbackPaginationHndlr(updatedState)
    }
    const totalPagesCount = (totalPages < 0) ? 0 : totalPages,
        totalRecordsCount = (totalRecords < 0) ? 0 : totalRecords,
        initialItemCount = (totalPages > 0) ? ((paginationState.pageSize * paginationState.pageNo) + 1) : 0,
        lastItemCount: number = (paginationState.pageSize * (paginationState.pageNo + 1));

    return (
        <div className={classnames("tw-grid tw-grid-cols-12 tw-gap-2 !tw-overflow-auto", paginationContainerClass)}>
            <div className="tw-col-span-12 tw-flex tw-items-center tw-justify-between">
                <p className="tw-text-gray-500 tw-me-2 tw-mb-0 tw-flex-shrink-0">Showing <span className="tw-font-semibold">{initialItemCount}</span> to
                    <span className="tw-font-semibold"> {(lastItemCount > totalRecordsCount) ? totalRecordsCount : lastItemCount}</span> of <span className="tw-font-semibold tw-underline">{totalRecordsCount}</span> records
                </p>

                <div className=" tw-flex tw-justify-end tw-items-center tw-flex-grow">
                    <div className="tw-me-2 tw-flex tw-items-center">
                        <span className="tw-text-gray-500 tw-me-1 tw-text-nowrap">Row per page:</span>
                        <select name="pageSize" value={paginationState.pageSize} onChange={onChangeSizeHndlr} style={{ paddingBottom: "0.35rem", paddingTop: "0.35rem" }}
                            className="form-select form-select-sm tw-flex-grow-0">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                    </div>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="Next"
                        onPageChange={pageChangeHndlr}
                        pageRangeDisplayed={1}
                        marginPagesDisplayed={2}
                        pageCount={totalPagesCount}
                        forcePage={paginationState.pageNo}
                        previousLabel="Previous"
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination pagination-separated tw-mb-0"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                    />
                </div>
            </div>
        </div >
    )
};

export default React.memo(Pagination);