import { useFormik } from 'formik';
import React, { useMemo, useState } from 'react'
import { SelectInput } from '../../../Components/Common'
import TableContainer from '../../../Components/Common/TableContainer';
import { ClassWiseTopPerformersFilterhProps } from './ClassWiseTopPerformersTypes';
import { generateColumns, selectData1, selectData2, TableData } from './helper';

const initialValues: ClassWiseTopPerformersFilterhProps = {
  board: "CBSE",
  class: "VI",
};

const ClassWiseTopPerformers = () => {

    const [classWiseTopPerformersFilterState, setClassWiseTopPerformersFilterState] =
    useState<ClassWiseTopPerformersFilterhProps>(initialValues);

    const ClassWiseTopPerformersFilterForm = useFormik({
      enableReinitialize: true,
      initialValues: classWiseTopPerformersFilterState,
      onSubmit: (values) => {},
    });

    const curriculumColumns = useMemo(() => generateColumns(), []);

  return (
    <>
        <div className="card">
             <div className="card-header">
                <form onSubmit={ClassWiseTopPerformersFilterForm.handleSubmit}>
                    <div className="tw-flex tw-items-center">
                        <div className="tw-w-1/2">
                            <h4 className="tw-card-title tw-flex-grow">
                                Class Wise Top Performers
                            </h4>
                        </div>

                        <div className="tw-w-auto tw-ml-auto">
                            <div className='tw-flex tw-gap-3'>
                            <SelectInput
                                name="board"
                                value={ClassWiseTopPerformersFilterForm.values.board}
                                onChange={ClassWiseTopPerformersFilterForm.handleChange}
                                menuItems={selectData1}
                                valueKey="boardType"
                                textKey="boardType" 
                                inputClassName="tw-bg-gray-100 tw-border-0"
                                formgroupClassName="tw-mb-0"
                            />
                            <SelectInput
                                name="class"
                                value={ClassWiseTopPerformersFilterForm.values.class}
                                onChange={ClassWiseTopPerformersFilterForm.handleChange}
                                menuItems={selectData2}
                                valueKey="classType"
                                textKey="classType"
                                inputClassName="tw-bg-gray-100 tw-border-0"
                                formgroupClassName="tw-mb-0"
                            />
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="card-body tw-p-0">
                <TableContainer
                    columns={curriculumColumns || []}
                    data={TableData ? TableData : []}
                    divClass="table-responsive  tw-mb-1"
                    theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                    showPagination={true}
                    totalPages={10}
                    totalRecords={10}
                    callbackPaginationHndlr={() => {}}
                    currentPageNumber={0}
                />
            </div>
        </div>
    </>
  )
}

export default ClassWiseTopPerformers