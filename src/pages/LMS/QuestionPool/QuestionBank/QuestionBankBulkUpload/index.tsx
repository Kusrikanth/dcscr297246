import { useHistory, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, EyeIcon, FileImportIcon, PencilEdit02Icon, PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { useEffect, useMemo, useRef, useState } from "react";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SearchInput, SelectInput, TableExpandable, TextInput } from "../../../../../Components/Common";
import { generateColumns, questionTableData, searchInputOptions, ignoredKeys } from "./helper";
import { default as FilterSvg } from "../../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useFilterState } from "../../../../../hooks/filterhook";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import TableContainer from "../../../../../Components/Common/TableContainer";

const initialValues = {
    academicYearId: "",
    searchString: "",
    classId: "",
    curriculumId: "",
};

const QuestionBankBulkUpload = () => {

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
    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
    } = useAppSelector(
        ({ instAcademics, globalData, branchAcademics, appData }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,

        }),
        shallowEqual
    );

    const signatureForm = useFormik({
        enableReinitialize: true,
        initialValues,
        onSubmit: (values) => { },
    });


    const menuOptions = useMemo(
        () => [
            {
                id: "viewDetails",
                actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
                actionName: "View",

                onClickHndlr: {},
            },
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={20} />,
                actionName: "Edit",
                onClickHndlr: {},
            },
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

    const moveToAddConcern = (event: any) => {
        event.preventDefault()
        history.push(`${location.pathname}/add-question`, {
            pathName: location.pathname,
        })
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { instituteId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    function getClassApiCall(curriculumId: string, academicYearId?: string) {
        // sortBy: "className", orderBy: "asc"
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId, academicYearId: academicYearId || applicationSaleFilter.academicYearId };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            const academicYearId = data.find((year: any) => year.yearStatus?.toUpperCase() === "CURRENT")?.academicYearId;
            if (academicYearId) {
                setApplicationSaleFilter((prev: any) => ({ ...prev, academicYearId }));
                getCurriculumApiCall({ academicYearId });
            }
        }
    }, [academicYearListResp]);
    useEffect(() => {
        const { academicYearId } = signatureForm.values;
        if (academicYearId) {
            getCurriculumApiCall({ academicYearId });
            setApplicationSaleFilter((prev: any) => ({ ...prev, academicYearId }));
        }
    }, [signatureForm.values.academicYearId]);

    useEffect(() => {
        const { curriculumId, academicYearId } = signatureForm.values;
        if (curriculumId) {
            getClassApiCall(curriculumId, academicYearId);
        }
    }, [signatureForm.values.curriculumId]);


    useEffect(() => {
        const { data } = brchCurriculumResp || {};

        if (Array.isArray(data) && data.length > 0) {
            let shortNameToMatch = "";

            const selectedCurriculum = data.find(
                (item) => item.shortName === shortNameToMatch
            );

            if (selectedCurriculum) {
                signatureForm.setValues((prev: any) => ({
                    ...prev,
                    curriculumId: selectedCurriculum.branchCurriculumId,
                }));
            }
        }
    }, [brchCurriculumResp, location.pathname]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        signatureForm.setValues((prev: any) => ({ ...prev, [name]: value }))
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
                        <div className="search-box">
                            <TextInput
                                name="searchString"
                                formgroupClassName="mb-0"
                                labelText="Search"
                                placeHolder="Search"
                                value={signatureForm.values.searchString}
                                onChange={filterHandler}
                                floatingLabel
                            />
                            <i className="ri-search-line search-icon"></i>
                        </div>
                    </div>
                    <div className="col-auto ms-auto">
                        <button
                            className="btn btn-outline-primary float-end d-flex align-items-center"

                        >
                            <HugeiconsIcon icon={FileImportIcon} className="me-2" size={18} />
                            Import
                        </button>
                    </div>
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

export default QuestionBankBulkUpload;
