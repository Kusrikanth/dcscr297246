import React, { useMemo, useRef, useState } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumnsFeeReceived } from "./helper";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { TextInput } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";


const initialValues = {
    searchString: "",
};

const FeeReceived = () => {

    const [filterState, setFilterState] = useState(initialValues);

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const roleColumns = useMemo(() => generateColumnsFeeReceived(), []);

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
    }
    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setFilterState((prev: any) => ({ ...prev, [name]: value }))
        pagination.current.pageNo = 0;
    }

    return (
        <>
            <div className="tw-bg-white tw-shadow-sm tw-rounded-lg">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-w-1/2">
                                    <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-m-0 tw-grow">
                                        Fee Received Details
                                    </h4>
                                </div>
                                <div className="tw-ml-auto">
                 
                                    <Button
                                        id="export-btn"
                                        variant='exportBtn'
                                        onClick={() => { }}
                                    >
                                        <img src={ExportIcon} className="img-fluid tw-h-full" />
                                        <UncontrolledTooltip placement="bottom" target="export-btn">
                                        Export
                                        </UncontrolledTooltip>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="tw-p-4">
                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 xl:tw-grid-cols-6 tw-gap-4">
                                <div className="tw-col-span-1 xl:tw-col-span-1">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={filterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="bg-soft-light"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search..."
                                        />

                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <TableContainer
                            columns={roleColumns}
                            data={[]}
                            divClass="table-responsive tw-mb-3"
                            theadClass="table-light tw-text-gray-500 tw-align-middle"
                            showPagination={true}
                            totalPages={0}
                            totalRecords={0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={ 0}
                        />
                    </div>
        </>
    )
}

export default FeeReceived