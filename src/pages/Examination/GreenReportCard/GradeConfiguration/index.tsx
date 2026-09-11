import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { useFormik } from 'formik';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard } from '@hugeicons-pro/core-stroke-standard';
import { getBranchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import { useModal } from '../../../../hooks/modalhook';

import {
  deleteGreenReportCardGradeConfigAct,
  getGreenReportCardGradeConfigAct,
  saveGreenReportCardGradeConfigAct,
} from '../../../../store/examination/pvaReports/pvaReportsActions';
import { toast } from 'react-toastify';
import TableContainer from '../../../../Components/Common/TableContainer';
import { ConfirmationModal, SelectInput } from '../../../../Components/Common';
import * as Yup from 'yup';
import { generateColumns } from './helper';

const initialValues = {
  searchString: '',
  academicYearId: '',
  curriculumId: '',
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required('Academic Year is required'),
  curriculumId: Yup.string().required('Curriculum is required'),
});

const GradeConfiguration = () => {
  const {
    closeModal: closeDelPvaGradeModal,
    modalState: delPvaGradeModalState,
    openModal: openDelPvaGradeModal,
  } = useModal();

  const [userDataList, setUserDataList] = useState<any>([]);
  const [selectedAboveRowId, setSelectedAboveRowId] = useState<number | null>(
    null,
  );
  const [selectedBelowRowId, setSelectedBelowRowId] = useState<number | null>(
    null,
  );

  const dispatch = useAppDispatch();

  const {
    academicYearListResp,
    brchCurriculumResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getGreenReportCardGradeConfigResp,
    saveGreenReportCardGradeConfigResp,
    deleteGreenReportCardGradeConfigResp,
    pvaReportsErrorAct,
  } = useAppSelector(
    ({ instAcademics, globalData, branchAcademics, appData, pvaReports }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getGreenReportCardGradeConfigResp:
        pvaReports.getGreenReportCardGradeConfigResp,
      saveGreenReportCardGradeConfigResp:
        pvaReports.saveGreenReportCardGradeConfigResp,
      deleteGreenReportCardGradeConfigResp:
        pvaReports.deleteGreenReportCardGradeConfigResp,
      pvaReportsErrorAct: pvaReports.pvaReportsErrorAct,
    }),
    shallowEqual,
  );

  const pvaGradeRef = useRef({
    prevPvaReportsErrorAct: pvaReportsErrorAct,
    prevSaveGreenReportCardGradeConfigResp: saveGreenReportCardGradeConfigResp,
    prevDeleteGreenReportCardGradeConfigResp:
      deleteGreenReportCardGradeConfigResp,
    prevGetGreenReportCardGradeConfigResp: getGreenReportCardGradeConfigResp,
  });

  const gradeConfigurationForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {},
  });

  const getGreenGradeListApiCall = useCallback(
    (otherProps?: any) => {
      const academicYearId = gradeConfigurationForm.values.academicYearId;
      const curriculumId = gradeConfigurationForm.values.curriculumId;

      if (!branchId || !academicYearId || !curriculumId) return;

      const payload = {
        branchId,
        academicYearId,
        curriculumId,
        ...otherProps,
      };

      dispatch(
        getGreenReportCardGradeConfigAct(
          generateActionPayload(
            'get_green_report_card_grade_config_list',
            undefined,
            payload,
          ),
        ),
      );
    },
    [
      branchId,
      dispatch,
      gradeConfigurationForm.values.academicYearId,
      gradeConfigurationForm.values.curriculumId,
    ],
  );

  function delModalSubmitHndlr() {
    dispatch(
      deleteGreenReportCardGradeConfigAct(
        generateActionPayload('delete_green_report_card_grade_config', {
          id: delPvaGradeModalState.modalData,
        }),
      ),
    );
  }

  useEffect(() => {
    const {
      prevPvaReportsErrorAct,
      prevSaveGreenReportCardGradeConfigResp,
      prevGetGreenReportCardGradeConfigResp,
      prevDeleteGreenReportCardGradeConfigResp,
    } = pvaGradeRef.current || {};

    if (pvaReportsErrorAct && prevPvaReportsErrorAct !== pvaReportsErrorAct) {
      const { details } = pvaReportsErrorAct || {};
      toast.error(details || 'Something went wrong');
    } else if (
      saveGreenReportCardGradeConfigResp &&
      prevSaveGreenReportCardGradeConfigResp !==
        saveGreenReportCardGradeConfigResp
    ) {
      toast.success('Grade Added successfully');
      getGreenGradeListApiCall();
    } else if (
      deleteGreenReportCardGradeConfigResp &&
      prevDeleteGreenReportCardGradeConfigResp !==
        deleteGreenReportCardGradeConfigResp
    ) {
      toast.success('Grade Deleted successfully');
      closeDelPvaGradeModal();
      getGreenGradeListApiCall();
    } else if (
      getGreenReportCardGradeConfigResp &&
      getGreenReportCardGradeConfigResp !==
        prevGetGreenReportCardGradeConfigResp
    ) {
      const mappedData =
        getGreenReportCardGradeConfigResp.map((i: any) => ({ ...i })) || [];

      const belowRow = mappedData.find(
        (item: any) => item.fromRating === 'Below',
      );
      const aboveRow = mappedData.find(
        (item: any) => item.toRating === 'Above',
      );

      setSelectedBelowRowId(belowRow ? belowRow.id : null);
      setSelectedAboveRowId(aboveRow ? aboveRow.id : null);
      setUserDataList(mappedData);
    }

    pvaGradeRef.current.prevPvaReportsErrorAct = pvaReportsErrorAct;
    pvaGradeRef.current.prevSaveGreenReportCardGradeConfigResp =
      saveGreenReportCardGradeConfigResp;
    pvaGradeRef.current.prevGetGreenReportCardGradeConfigResp =
      getGreenReportCardGradeConfigResp;
    pvaGradeRef.current.prevDeleteGreenReportCardGradeConfigResp =
      deleteGreenReportCardGradeConfigResp;
  }, [
    pvaReportsErrorAct,
    saveGreenReportCardGradeConfigResp,
    getGreenReportCardGradeConfigResp,
    deleteGreenReportCardGradeConfigResp,
    getGreenGradeListApiCall,
    closeDelPvaGradeModal,
  ]);

  useEffect(() => {
    if (academicYearListResp?.data?.length) {
      const currentAcademicYear = academicYearListResp.data.find(
        (year: any) => year.yearStatus === 'CURRENT',
      );

      if (currentAcademicYear) {
        gradeConfigurationForm.setFieldValue(
          'academicYearId',
          currentAcademicYear.academicYearId,
        );
      }
    }
  }, [academicYearListResp]);

  useEffect(() => {
    if (branchId && gradeConfigurationForm.values.academicYearId) {
      const payload = {
        academicYearId: gradeConfigurationForm.values.academicYearId,
        branchId,
        pageNo: 0,
        pageSize: 100,
        sortBy: 'curriculumName',
        orderBy: 'asc',
      };

      dispatch(
        getBranchCurriculumAct(
          generateActionPayload('get_brch_curriculum', undefined, payload),
        ),
      );

      gradeConfigurationForm.setFieldValue('curriculumId', '');
      setUserDataList([]);
    }
  }, [branchId, dispatch, gradeConfigurationForm.values.academicYearId]);

  useEffect(() => {
    if (gradeConfigurationForm.values.curriculumId) {
      getGreenGradeListApiCall();
    }
  }, [gradeConfigurationForm.values.curriculumId, getGreenGradeListApiCall]);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    gradeConfigurationForm.setValues((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'academicYearId' ? { curriculumId: '' } : {}),
    }));
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    const idStr = event.currentTarget.getAttribute('data-id');
    if (!idStr) return;

    const id = Number(idStr);
    const row = userDataList.find((item: any) => item.id === id);

    if (!row) return;

    if (row.isNew) {
      setUserDataList((prevList: any[]) =>
        prevList.filter((item: any) => item.id !== id),
      );
    } else {
      openDelPvaGradeModal(id);
    }
  };

  const menuOptions = useMemo(
    () => [
      {
        id: 'delete',
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="text-danger"
            size={18}
          />
        ),
        actionName: 'Delete',
        onClickHndlr: handleDeleteClick,
      },
    ],
    [userDataList],
  );

  const singleUserDataCheckHndlr = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      const usedDetailsData = event.currentTarget.getAttribute('data-id');
      const userRowIndex = userDataList.findIndex(
        (item: any) => +item.id === Number(usedDetailsData),
      );

      if (userRowIndex > -1) {
        setUserDataList((prevList: any) => {
          const updatedList = [...prevList];
          updatedList[userRowIndex] = {
            ...updatedList[userRowIndex],
            isSelected: checked,
          };
          return updatedList;
        });
      }
    },
    [userDataList],
  );

  const onChangeInputHndlr = (id: number, value: any, name: string) => {
    setUserDataList((prevList: any[]) =>
      prevList.map((item) => {
        if (item.id === id) {
          if (
            name === 'fromRating' ||
            name === 'toRating' ||
            name === 'label' ||
            name === 'grade'
          ) {
            return { ...item, [name]: value };
          }
        }
        return item;
      }),
    );
  };

  const submitHandler = async () => {
    if (!userDataList || userDataList.length === 0) return;

    const errors = await gradeConfigurationForm.validateForm();

    if (Object.keys(errors).length === 0) {
      const payload = {
        instituteId,
        branchId,
        academicYearId: gradeConfigurationForm.values.academicYearId,
        curriculumId: gradeConfigurationForm.values.curriculumId,
        grades: userDataList.map((item: any) => ({
          id: item.isNew ? '' : item.id,
          grade: item.grade,
          label: item.label,
          fromRating: item.fromRating === 'Below' ? 'Below' : item.fromRating,
          fromRatingValue: item.fromRating === 'Below' ? '' : item.fromRating,
          toRating: item.toRating === 'Above' ? 'Above' : item.toRating,
          toRatingValue: item.toRating === 'Above' ? '' : item.toRating,
        })),
      };

      dispatch(
        saveGreenReportCardGradeConfigAct(
          generateActionPayload(
            'save_green_report_card_grade_config',
            undefined,
            payload,
          ),
        ),
      );
    }
  };

  const addNewRowHandler = async () => {
    const errors = await gradeConfigurationForm.validateForm();

    if (Object.keys(errors).length > 0) {
      gradeConfigurationForm.setTouched({
        academicYearId: true,
        curriculumId: true,
      });
      return;
    }

    setUserDataList((prevList: any[]) => [
      ...prevList,
      {
        id: Date.now(),
        academicYearId: gradeConfigurationForm.values.academicYearId,
        curriculumId: gradeConfigurationForm.values.curriculumId,
        instituteId,
        branchId,
        grade: '',
        label: '',
        fromRating: '',
        toRating: '',
        isSelected: true,
        isNew: true,
      },
    ]);
  };

  const isAnySelected = useMemo(
    () => userDataList.some((item: any) => item.isSelected),
    [userDataList],
  );

  const columns = useMemo(
    () =>
      generateColumns(singleUserDataCheckHndlr, menuOptions, {
        setSelectedBelowRowId,
        setSelectedAboveRowId,
        selectedBelowRowId,
        selectedAboveRowId,
      }),
    [
      singleUserDataCheckHndlr,
      menuOptions,
      selectedAboveRowId,
      selectedBelowRowId,
    ],
  );

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />
          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Grade Configuration
                  </h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row mx-3 pt-3 tw-mb-6 gy-3">
                <div className="col-xs-12 col-md-12 col-lg-3">
                  <SelectInput
                    name="academicYearId"
                    value={gradeConfigurationForm.values.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="mb-0"
                    labelText="Academic Year"
                    labelClass="required"
                    floatingLabel
                    invalid={
                      gradeConfigurationForm.touched.academicYearId &&
                      gradeConfigurationForm.errors.academicYearId
                        ? true
                        : false
                    }
                    error={
                      gradeConfigurationForm.touched.academicYearId &&
                      gradeConfigurationForm.errors.academicYearId
                        ? gradeConfigurationForm.errors.academicYearId
                        : ''
                    }
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3">
                  <SelectInput
                    name="curriculumId"
                    value={gradeConfigurationForm.values.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="mb-0"
                    labelText="Curriculum"
                    labelClass="required"
                    floatingLabel
                    invalid={
                      gradeConfigurationForm.touched.curriculumId &&
                      gradeConfigurationForm.errors.curriculumId
                        ? true
                        : false
                    }
                    error={
                      gradeConfigurationForm.touched.curriculumId &&
                      gradeConfigurationForm.errors.curriculumId
                        ? gradeConfigurationForm.errors.curriculumId
                        : ''
                    }
                  />
                </div>
                <div className="col-auto ms-auto">
                  <button
                    className="btn btn-primary ms-2 float-end d-flex align-items-center"
                    onClick={addNewRowHandler}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>
              <TableContainer
                columns={columns || []}
                data={userDataList}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showPagination={false}
                onChangeInputHndlr={onChangeInputHndlr}
                rowDataInfo={{
                  setSelectedBelowRowId,
                  setSelectedAboveRowId,
                  selectedBelowRowId,
                  selectedAboveRowId,
                }}
              />
            </div>
            <div className="col-auto ms-auto me-2 mb-2">
              <button
                className="btn btn-success d-flex align-items-center"
                onClick={submitHandler}
                disabled={!isAnySelected}
              >
                <i className="ri-check-line me-2" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        id="delete-green-grade"
        isOpen={delPvaGradeModalState.showModal}
        confirmMessage="Are you sure you want to delete this record ?"
        cancelHndlr={closeDelPvaGradeModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default GradeConfiguration;
