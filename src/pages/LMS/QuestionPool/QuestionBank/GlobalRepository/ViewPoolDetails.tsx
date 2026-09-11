import React, { useEffect, useMemo, useRef } from 'react';
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from 'formik';
import { AutoSearchInputUpdated, SelectInput, TableExpandable, TextInput } from '../../../../../Components/Common';
import { generateViewColumns, groupType, questionTableData, RoleOptions, SubjectsOptions, teacherListResp } from './helper';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { getBranchClassAct, getBranchCurriculumAct } from '../../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard, PencilEdit02Icon, PlusSignIcon } from '@hugeicons-pro/core-stroke-standard';
import { generateUniqueNumber } from '../../../../../utility/commonutility';
import { IPaginationState } from '../../../../../Components/Common/Pagination';
const initialValues = {
    searchString: "",
}
interface FetchQuestionsModelProps {
    id: any;
    isOpen: boolean;
    toggle: () => void;
    modalTitle: string;
}

const ViewPoolModel: React.FC<FetchQuestionsModelProps> = () => {
    const paginationDetailRef = useRef({
        pageNo: 0,
        pageSize: 10,
    })
    const createEmployeeForm = useFormik({
        enableReinitialize: true,
        initialValues,
        onSubmit: () => { },
    });
    const menuOptions = useMemo(
        () => [
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
    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
    }
    const columns = useMemo(() => generateViewColumns(menuOptions), []);

    return (
        <div>
            <div className='row' style={{padding: "1rem"}}>
                <div className="col-xs-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="search-box">
                        <TextInput
                            name="searchString"
                            formgroupClassName="mb-0"
                            labelText="Search"
                            placeHolder="Search"
                            value={createEmployeeForm.values.searchString}
                            onChange={createEmployeeForm.handleChange}
                            floatingLabel
                        />
                        <i className="ri-search-line search-icon"></i>
                    </div>
                </div>
               <div className="col-auto ms-auto">
                        <button
                            className="btn btn-success float-end d-flex align-items-center"
                        >
                          
                           Approve
                        </button>
                    </div>
                    <div className="col-auto">
                        <button type="button" className="btn btn btn-outline-danger float-end d-flex align-items-center">
                             Reject
                        </button>
                    </div>
            </div>
            <TableExpandable
                columns={columns || []}
                data={questionTableData()}
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle theadPrimary"
                tableClass="table-bordered mb-0"
                showPagination={true}
                totalPages={10}
                totalRecords={10}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={1}
                showCheckbox={true}
            />
        </div>
    );
};

export default ViewPoolModel;
