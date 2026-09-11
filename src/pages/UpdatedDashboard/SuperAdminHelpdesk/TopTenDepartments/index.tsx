import React, { useEffect, useMemo, useState } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer'
import { generateColumns } from './helper';
import { useModal } from '../../../../hooks/modalhook';
import { ModalContainerUpdated, SelectInput } from '../../../../Components/Common';
import TopTenDepartmentsModel from './TopTenDepartmentsModel';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getTopTenDepartmentsAct } from '../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction';
import { generateActionPayload } from '../../../../utility/reduxutility';

const inititalValues = {
  branchId: "",
  academicYearId: "",
}

const TopTenDepartments = (props: any) => {
  const [filterState, setFilterState] = useState(inititalValues);
  const { closeModal, modalState, openModal } = useModal()

  const dispatch = useAppDispatch();

  const getTopTenDepartments = ({ branchId, academicYearId }: { branchId?: string, academicYearId?: string }) => {
      let payload = {
        instituteId,
        branchId,
        academicYearId,
      };
      dispatch(getTopTenDepartmentsAct(generateActionPayload("get_top_ten_tickets", undefined, payload)));
    };

    const {
      currentInstIdResp: instituteId, currentBranchIdResp, academicYearListResp, brchCurriculumResp,
      branchListResp, getClassWiseStrengthListResp, exportClassWiseStrengthResp, getTopTenDepartmentsResp } =
      useAppSelector(({ appData, branch, instAcademics, branchAcademics, reports, concernsFeedback }) => ({
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        branchListResp: branch.branchListResp,
        academicYearListResp: instAcademics.academicYearListResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        getClassWiseStrengthListResp: reports.getClassWiseStrengthListResp,
        exportClassWiseStrengthResp: reports.exportClassWiseStrengthResp,
        getTopTenDepartmentsResp: concernsFeedback.getTopTenDepartmentsResp,

      }), shallowEqual)
  

      const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if(name === "branchId") {
      if (value) {
        const newState = { ...filterState, [name]: value };
        setFilterState(newState);
        getTopTenDepartments(newState);
      }
      else {
        const newState = { ...filterState, [name]: "" };
        setFilterState(newState);
        getTopTenDepartments(newState);
      }
    }
    else {
      if (value) {
        const newState = { ...filterState, [name]: value };
        setFilterState(newState);
        getTopTenDepartments(newState);
      }
    }
  }

  useEffect(() => {
    if (academicYearListResp) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId || "";
      getTopTenDepartments({ academicYearId: yearId });
      setFilterState((prevState) => ({ ...prevState, academicYearId: yearId }));
    }
  }, [academicYearListResp]);

  const tableColumns = useMemo(() => generateColumns(openModal), [getTopTenDepartmentsResp]);

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <div className="card !tw-rounded-2xl !tw-shadow-sm">
      <div className="card-header !tw-rounded-t-2xl !tw-p-3">
        <div className="tw-flex tw-flex-wrap tw-items-center">
          <div className="tw-w-10/12 lg:tw-w-6/12 tw-mt-0">
            <h4 className="card-title !tw-mb-0">
              Top 10 Departments
            </h4>
          </div>
          <div className="tw-w-full lg:tw-w-auto lg:tw-ml-auto">
            <div className="tw-flex tw-justify-end tw-flex-wrap tw-gap-2">
              <SelectInput
                name="branchId"
                valueKey="branchId"
                textKey="branchName"
                value={filterState.branchId}
                menuItems={branchListResp?.data}
                onChange={onChangeFilterHndlr}
                labelText="Branch Name"
                floatingLabel
                formgroupClassName="tw-mb-0 tw-mt-1"
              />

              <SelectInput
                name="academicYearId"
                value={filterState.academicYearId}
                onChange={onChangeFilterHndlr}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="tw-mb-0 tw-mt-1"
                labelText="Academic Year"
                floatingLabel
                labelClass='required'
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card-body !tw-pb-2 !tw-px-0 !tw-pt-0">
        <TableContainer
          columns={tableColumns || []}
          data={getTopTenDepartmentsResp || []}
          tableClass="tw-mb-0"
          divClass="table-responsive !tw-overflow-x-auto tw-max-h-[400px]"
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle tw-sticky tw-top-0 tw-z-[1]"
          showPagination={false}
          showFooter={false}
        ></TableContainer>
      </div>
      <ModalContainerUpdated
        id="curriculum-wise-strength-modal"
        isOpen={modalState.showModal}
        toggle={() => closeModal()}
        modalTitle="Top 10 Departments"
        modalSize="lg"
      >
        <TopTenDepartmentsModel
          modalData={modalState.modalData}
          toggle={() => closeModal()}
          filterValues={{ ...modalState.modalData }}
          filterState={filterState}
        ></TopTenDepartmentsModel>
      </ModalContainerUpdated>
    </div>
  )
}

export default TopTenDepartments