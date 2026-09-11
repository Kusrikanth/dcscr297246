import { useHistory, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, EyeIcon, PencilEdit02Icon, UserGroup02Icon, } from "@hugeicons-pro/core-stroke-standard";
import { useEffect, useMemo, useRef, useState } from "react";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { OffCanvasContainer, SearchInput, SelectInput, TableExpandable, TextInput } from "../../../../../Components/Common";
import { generateColumns, searchInputOptions, ignoredKeys, questionTableData, usedInTableData, generateUsedInColumns } from "./helper";
import { default as FilterSvg } from "../../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useFilterState } from "../../../../../hooks/filterhook";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import ExportIcon from "../../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { useModal } from "../../../../../hooks/modalhook";

const initialValues = {
    searchString: "",
};
interface FetchQuestionsModelProps {
    id: any;
    isOpen: boolean;
    toggle: () => void;
    modalTitle: string;
}

const UsedInModel: React.FC<FetchQuestionsModelProps> = () => {
   const location = useLocation();
    const dispatch = useAppDispatch();
    const history = useHistory();
    const [applicationSaleFilter, setApplicationSaleFilter] = useState(initialValues);
    const [searchStudentState, setSearchStudentState] = useState("global");
    const { showClearFilterState, count, advanceFilterChange } = useFilterState()
    const [open, setOpen] = useState<boolean>(false);

    const paginationDetailRef = useRef({
        pageNo: 0,
        pageSize: 10,
    })

    const signatureForm = useFormik({
        enableReinitialize: true,
        initialValues,
        onSubmit: (values) => { },
    });


    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        signatureForm.setValues((prev: any) => ({ ...prev, [name]: value }))
    }

    const tableColumns = useMemo(() => generateUsedInColumns(), []);

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

    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
        advanceFilterChange({ keys: { ...initialValues, ...appliedFilters, academicYearId: "" }, ignoredKeys })
        signatureForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
    }
    
    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }
    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
    }

    return (
        <>
            <div className="card d-inline-block w-100">
                <div className="row px-3 g-3 pt-4 py-2">
                    <div className="col-xs-12 col-md-12 col-lg-4 col-xl-4">
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
                    <div className="col-auto ms-auto ">
                        <div className="d-flex">
                            <button
                                id="export-btn"
                                className="btn btn-icon btn-rounded btn-soft-info p-2"

                            >
                                <img src={ExportIcon} className="img-fluid h-100"></img>
                                <UncontrolledTooltip placement="bottom" target="export-btn">
                                    Export
                                </UncontrolledTooltip>
                            </button>
                        </div>
                    </div>
                </div>

                <TableExpandable
                    columns={tableColumns}
                    data={usedInTableData()}
                    divClass="table-responsive table-expandable table-sticky"
                    theadClass="text-muted align-middle theadPrimary"
                    tableClass="table-bordered table-nowrap"
                    showFooter={false}
                />

            </div>
            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="advance-filter-book-issuance"
            >
                <AdvanceFilterModal
                    appliedFilter={signatureForm.values}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                />
            </OffCanvasContainer>
        </>
    );
};

export default UsedInModel;
