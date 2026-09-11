import React, { useEffect, useRef, useState } from "react";
import { BrowseFile,  MultiSelectCheckbox, SelectInput } from "../../../Components/Common";
import { shallowEqual, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useAppSelector } from "../../../hooks/storehook";
import { getBranchClassAct, getBranchCurriculumAct, setBrchClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { toast } from "react-toastify";
import { addAlamanacAct } from "../../../store/academic/academicRequest/academicrequestactions";
import Button from "../../../Components/Common/Button";

function getAlamanacInfo() {
  return {
    academicYearId: "",
    curriculumId: "",
    classId: [],


    fileName: "",
    file: null,
    previewUrl: ""
  }
}

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic year is required."),
  curriculumId: Yup.string().required("Curriculum is required."),
  classId: Yup.array().min(1, "Class is required.").required("Class is required."),
  file: Yup.string().required("File is required.").nullable(),
});

const initialValues = getAlamanacInfo();
const AlmanacUploadedModel: React.FC<any> = (props) => {
  const alamanacForm = useFormik({
    validationSchema,
    initialValues,
    onSubmit: (values) => {
      const classIds = values.classId?.map((item: any) => item?.id),
        payload = {
          instituteId: props.instituteId,
          academicYearId: values.academicYearId,
          branchId: props.branchId,
          curriculumId: values.curriculumId,
          classId: classIds
        };
      const formData = new FormData();
      formData.append("request", JSON.stringify(payload));
      if (values.file) {
        formData.append("file", values.file);
      }
      dispatch(addAlamanacAct(generateActionPayload("save_alamanac", undefined, formData)));
    },
  });
  const dispatch = useDispatch();
  const { showApiLoader, academicYearListResp, brchCurriculumResp, branchClassResp, addAlamanacResp } =
    useAppSelector(({ branchAcademics, globalData, instAcademics, academicRequest }) => ({
      showApiLoader: globalData.showApiLoader,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      academicYearListResp: instAcademics.academicYearListResp,
      addAlamanacResp: academicRequest.addAlamanacResp,
    }), shallowEqual);

  const uploadModalRef = useRef({
    prevAddAlamanacResp: addAlamanacResp
  })

  useEffect(() => {
    const { prevAddAlamanacResp } = uploadModalRef.current;
    if (addAlamanacResp && prevAddAlamanacResp !== addAlamanacResp) {
      toast.success("Almanac added successfully.");
      props.toggle(true);
    }
    uploadModalRef.current.prevAddAlamanacResp = addAlamanacResp;
  }, [addAlamanacResp]);

  useEffect(() => {
    if (!props.isOpen) {
      alamanacForm.resetForm();
    }
  }, [props.isOpen]);

  function renderOptionsTerms(item: any) {
    return item?.shortName;
  }
  function renderValueTerms(selectedItems: any) {
    if (Array.isArray(selectedItems)) {
      return (<div className="text-truncate">
        {
          selectedItems.map((item, index) => {
            return item?.shortName + (index !== (selectedItems.length - 1) ? ', ' : '')
          })
        }
      </div>)
    }
  }
  function onSelectOptionHandler(selectedOptions: any, config?: any) {
    const { name } = config;
    if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
      alamanacForm.setFieldValue(name, selectedOptions);
    } else {
      alamanacForm.setFieldValue(name, []);
    }
  }

  function onChangeCurriculumHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      alamanacForm.setValues((prevState: any) => ({ ...prevState, curriculumId: "", classId: "", [name]: value, }));
      if (value) {
        const brchCurriculumParams = { academicYearId: value, branchId: props.branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc",};
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumParams)));
      } else {
        dispatch(setBrchClassAct(undefined));
      }
    } else if (name === "curriculumId") {
      if (value) {
        alamanacForm.setValues((prevState: any) => ({ ...prevState, classId: "", [name]: value, }));
        getClassApiCall(value);
      } else {
        alamanacForm.setValues((prevState: any) => ({ ...prevState, classId: "", [name]: "", }));
      }
    }
  }

  function getClassApiCall(curriculumId: string) {
    // sortBy: "className", orderBy: "asc"
    const payload = {
      curriculumId, branchId: props.branchId,
      pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function onChangeFileInputHndlr(event: any) {
    const { name } = event.target;
    const file = event.target.files[0];
    alamanacForm.setValues((prevState) => ({
      ...prevState, fileName: file.name,
      file
    }))
  }

  return (
    <form onSubmit={alamanacForm.handleSubmit}>
      <div className="tw-p-4 tw-pb-0">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-px-1 tw-pb-3">
          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="academicYearId"
              labelText="Academic Year"
              value={alamanacForm.values.academicYearId}
              onChange={onChangeCurriculumHndlr}
              menuItems={academicYearListResp?.data}
              valueKey="academicYearId"
              textKey="academicYearName"
              labelClass="required"
              formgroupClassName="tw-mb-0"
              invalid={(alamanacForm.touched.academicYearId && alamanacForm.errors.academicYearId) ? true : false}
              error={(alamanacForm.touched.academicYearId && alamanacForm.errors.academicYearId) ? alamanacForm.errors.academicYearId : ""}
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="curriculumId"
              labelText="Curriculum"
              value={alamanacForm.values.curriculumId}
              onChange={onChangeCurriculumHndlr}
              menuItems={brchCurriculumResp?.data}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              labelClass="required"
              formgroupClassName="tw-mb-0"
              invalid={(alamanacForm.touched.curriculumId && alamanacForm.errors.curriculumId) ? true : false}
              error={(alamanacForm.touched.curriculumId && alamanacForm.errors.curriculumId) ? alamanacForm.errors.curriculumId : ""}

            />
          </div>
          <div className="tw-col-span-12">
            <MultiSelectCheckbox
              name="classId"
              idKey="id"
              labelText="Classes"
              value={alamanacForm.values.classId}
              onChange={onSelectOptionHandler}
              options={branchClassResp?.content}
              searchKey="id"
              labelClass="required"
              renderValue={renderValueTerms}
              renderOptions={renderOptionsTerms}
              invalid={(alamanacForm.touched.classId && alamanacForm.errors.classId) ? true : false}
              error={(alamanacForm.touched.classId && alamanacForm.errors.classId) ? alamanacForm.errors.classId : ""}
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-7">
            <BrowseFile
              containerClassName="tw-mb-0"
              labelText="Upload File"
              labelClass="required"
              name="file"
              fileName={alamanacForm.values.fileName}
              onChangeFileHndlr={onChangeFileInputHndlr}
              invalid={(alamanacForm.touched.file && alamanacForm.errors.file) ? true : false}
              error={(alamanacForm.touched.file && alamanacForm.errors.file) ? alamanacForm.errors.file : ""}
            />
          </div>
        </div>
      </div>
      <div className="tw-px-4 tw-pt-3 tw-pb-5">
        <div className="tw-flex tw-justify-end tw-gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={props.toggle}
            disabled={showApiLoader || false}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={showApiLoader || false}
          >
            Save
          </Button>
        </div>
      </div>
    </form >
  );
};

export default AlmanacUploadedModel;
