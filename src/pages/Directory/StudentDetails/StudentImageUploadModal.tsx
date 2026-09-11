import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Button from "../../../Components/Common/Button";
import { CropModal, InputCheckbox, ModalContainerUpdated, UploadFileInput, UploadImage } from "../../../Components/Common";
import { details } from "./StudentInfo/helper";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { updateStudentAct } from "../../../store/directory/studentmanagement/studentmanagementactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import classNames from "classnames";
import ImgPreview from "../../../assets/imagesdps/directory/image_preview.png";
import { useModal } from "../../../hooks/modalhook";

const validationSchema = Yup.object().shape({
  studentPhoto: Yup.string().required("Student photo is required"),
});

const initialValues = {
  studentPhoto: "",
  studentPhotoPreviewUrl: "",
  isIdCardRequest: false,
};

const StudentImageUploadModal: React.FC<any> = (props) => {

  const { closeModal: closeCropModalState, modalState: cropModalState, openModal: openCropModalState } = useModal();
  const [userImageErrorState, setUserImageErrorState] = useState<any>("");
  const dispatch = useAppDispatch();

  const { getStudentByIdResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId } = useAppSelector(
      ({ directoryStudent, appData }) => ({
        getStudentByIdResp: directoryStudent.getStudentByIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
      }),
      shallowEqual
    );

  const singleBookUploadForm = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (!StudentImage.current.file) {
        setUserImageErrorState("Please upload image");
        return;
      }
      const formData = new FormData();

      const data: any = details(
        getStudentByIdResp,
        {
          ...values,
          isIdCardRequest: values.isIdCardRequest
        },
        { branchId, instituteId }
      );
      formData.append("studentRequest", JSON.stringify(data));
      formData.append("studentImage", StudentImage.current.file);

      dispatch(
        updateStudentAct(
          generateActionPayload(
            'update_students_by_id',
            undefined,
            formData,
            {
              affectedSection: "Profile Picture"
            }
          )
        )
      );
    },
  });

  const StudentImage = useRef<any>({
    file: null
  });

  function fileUploadHandler(event: any) {
    const { name } = event.target;
    const file = event.target.files[0];

    if (!file) return;

    setUserImageErrorState("");

    const previewUrl = URL.createObjectURL(file);

    const image = new Image();
    image.src = previewUrl;

    image.onload = () => {
      openCropModalState({
        imageName: file?.name,
        imageType: file.type,
        imageSrc: previewUrl,
        cropWidth: 208,
        cropHeight: 264,
        rotate: 0,
      });
    };

    event.target.value = '';
  }

  function uploadCroppedImgHndlr(blobFile: any) {
    const { imageName } = cropModalState.modalData;

    const imgUrl = URL.createObjectURL(blobFile);
    const newImage = new File([blobFile], blobFile.name, {
      type: blobFile.type
    });

    singleBookUploadForm.setValues((prevValues: any) => ({
      ...prevValues,
      studentPhoto: imageName,
      studentPhotoFile: newImage,
      studentPhotoPreviewUrl: imgUrl
    }));

    StudentImage.current.file = newImage;

    closeCropModalState();
  }

  return (
    <>
      <div className="tw-p-4">
        <form onSubmit={singleBookUploadForm.handleSubmit}>
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12">
              <div className="tw-flex tw-gap-4 tw-items-center">
                <div className="tw-flex-1">
                  <UploadFileInput
                    name="studentPhoto"
                    labelText="Student Photo"
                    formgroupClassName="tw-mb-0"
                    labelClass="required"
                    value={singleBookUploadForm.values.studentPhoto || ""}
                    onChange={fileUploadHandler}
                    hideUploadBtn={true}
                    canRemove={false}
                    invalid={
                      singleBookUploadForm.touched.studentPhoto &&
                        singleBookUploadForm.errors.studentPhoto
                        ? true
                        : false
                    }
                    error={
                      singleBookUploadForm.touched.studentPhoto &&
                        singleBookUploadForm.errors.studentPhoto
                        ? singleBookUploadForm.errors.studentPhoto
                        : ""
                    }
                  />
                </div>
                <div className="tw-flex-shrink-0 tw-mt-1">
                  <div
                    className={classNames(
                      "tw-flex-shrink-0 tw-ml-2 tw-p-[2px] preview-img tw-bg-white",
                      {
                        "tw-border tw-border-2 tw-rounded-lg":
                          !!singleBookUploadForm.values.studentPhotoPreviewUrl
                      }
                    )}
                  >
                    <img
                      src={
                        singleBookUploadForm.values.studentPhotoPreviewUrl || ImgPreview
                      }
                      className="img-fluid tw-h-[100px] tw-w-[100px] tw-object-cover tw-rounded"
                    />
                  </div>
                </div>
              </div>
              <span className="tw-text-red-500 tw-font-bold tw-text-sm">
                *Preferably Digital Photograph of 1 MB Size
              </span>
              {userImageErrorState && (
                <span className="tw-text-red-500 tw-text-sm tw-block tw-mt-1">
                  {userImageErrorState}
                </span>
              )}
            </div>
            <div className="tw-col-span-12">
              <InputCheckbox
                name="isIdCardRequest"
                labelName="ID Card Request"
                value={singleBookUploadForm.values.isIdCardRequest}
                onChange={singleBookUploadForm.handleChange}
                formgroupClassName="tw-mb-0"
              />
            </div>
          </div>
          <div className="tw-flex tw-justify-end tw-gap-3">
            <Button type="button" variant="secondary" onClick={props.toggle}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="tw-px-2 tw-py-1"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
      <ModalContainerUpdated
        id="upload-student-image-modal"
        isOpen={cropModalState.showModal}
        toggle={closeCropModalState}
        modalTitle={"Upload Image"}
        modalSize="md"
      >
        <CropModal
          closeModalHndler={closeCropModalState}
          modalData={cropModalState.modalData}
          uploadCroppedImgHndlr={uploadCroppedImgHndlr}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default StudentImageUploadModal;
