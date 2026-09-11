import { useHistory, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, EyeIcon, FileImportIcon, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { useMemo, useRef, useState } from "react";
import { SearchInput, TableExpandable } from "../../../../../Components/Common";
import { generateColumns, questionTableData, searchInputOptions } from "./helper";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import TableContainer from "../../../../../Components/Common/TableContainer";

const initialValues = {
    academicYearId: "",
    searchString: "",
    classId: "",
    curriculumId: "",
};

const RoleManagement = () => {

    const [applicationSaleFilter, setApplicationSaleFilter] = useState(initialValues);
    const [searchStudentState, setSearchStudentState] = useState("global");

    const paginationDetailRef = useRef({
        pageNo: 0,
        pageSize: 10,
    })

    const menuOptions = useMemo(
        () => [
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                },
            },
        ],
        []
    );

    function onSearchHandler(name: string, value: any) {
        paginationDetailRef.current.pageNo = 0;
        setSearchStudentState((prev) => {
            const updatedFilterType = prev;
            setApplicationSaleFilter((prevState) => {
                const updatedState = {
                    ...prevState,
                    search: value,
                    filterTypeName: updatedFilterType
                };
                return updatedState;
            });
            return updatedFilterType;
        });
    }

    function onChangeHandler(name: string, id: any, item: any) {
        setSearchStudentState(id);
        paginationDetailRef.current.pageNo = 0;
        setApplicationSaleFilter((prevState) => {
            const updatedState = {
                ...prevState,
                filterTypeName: id,
                searchString: ""
            };
            return updatedState;
        });
    }

    const columns = useMemo(() => generateColumns(menuOptions), []);

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
    }
    return (
        <>
            <div className="card d-inline-block w-100">
                <div className="row px-3 g-3 py-4">
                    <div className="col-xs-12 col-md-12 col-lg-6 col-xl-6">
                        <SearchInput
                            hideDefaultSelect
                            name="searchString"
                            value={searchStudentState}
                            menuItems={searchInputOptions}
                            idKey="id"
                            labelName="Search With"
                            searchHandler={onSearchHandler}
                            onChange={onChangeHandler}
                            renderSelectedValue={(item: any) => item?.name}
                            renderOptions={(item: any) => item?.name}
                        />
                    </div>
                    {/* <div className="col-auto ms-auto">
                        <button
                            className="btn btn-outline-primary float-end d-flex align-items-center"
                        >
                            <HugeiconsIcon icon={FileImportIcon} className="me-2" size={18} />
                            Import
                        </button>
                    </div> */}
                </div>
                <TableExpandable
                    columns={columns || []}
                    data={questionTableData()}
                    divClass="table-responsive mb-3"
                    theadClass="table-light text-muted align-middle"
                    tableClass="table-bordered table-nowrap mb-0"
                    showPagination={true}
                    totalPages={10}
                    totalRecords={10}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={1}
                    showCheckbox={false}
                />
            </div>
        </>
    );
};

export default RoleManagement;
