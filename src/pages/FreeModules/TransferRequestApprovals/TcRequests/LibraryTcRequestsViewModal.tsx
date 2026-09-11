import React, { useEffect, useMemo, useRef } from "react";
import {
  UserDetails,
} from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateLibraryTcColumns } from "./helper";
import { getLibraryTcDetailsListAct } from "../../../../store/library/bookreturn/bookreturnaction";
import { toast } from "react-toastify";
import Button from "../../../../Components/Common/Button";


const LibraryTcRequestsViewModal = (props: any) => {
  const { filterRef, studentCode, studentName, className, sectionName, isOpen, branchId } = props;
  const dispatch = useAppDispatch();

  const libraryDetailsList = () => {
    if (isOpen && studentCode && filterRef?.current) {
      const { academicYearId } = filterRef.current;

      const payload = {
        branchId,
        academicYearId,
        searchString: studentCode,
      };

      dispatch(getLibraryTcDetailsListAct(generateActionPayload('get_book_list_stu_returns', undefined, payload)));
    }
  };

  const { libraryTcDetailsRequestListResp, bookReturnErrorResp } = useAppSelector(
    ({ libraryBookReturn }) => ({
      libraryTcDetailsRequestListResp: libraryBookReturn.libraryTcDetailsRequestListResp,
      bookReturnErrorResp: libraryBookReturn.bookReturnErrorResp,
    }), shallowEqual);

    const tcRequestRespRef = useRef({
      prevBookReturnErrorResp: bookReturnErrorResp
    })

    useEffect(() => {
      const { prevBookReturnErrorResp } = tcRequestRespRef.current;
      if (bookReturnErrorResp && prevBookReturnErrorResp !== bookReturnErrorResp) {
        const { message, details }: any = bookReturnErrorResp;
        toast.error(message || details || "Something went wrong.");
      }
      tcRequestRespRef.current.prevBookReturnErrorResp = bookReturnErrorResp;
  
    }, [bookReturnErrorResp]);

  useEffect(() => {
    libraryDetailsList();
  }, [isOpen, studentCode, filterRef,branchId]);


  const libraryTcColumns = useMemo(() => generateLibraryTcColumns(), []);
  
  return (
    <>
      <div className="tw-modal-body tw-p-0">
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-w-full tw-px-4 tw-py-2">
            <div className="tw-flex tw-flex-wrap tw-mb-3">
              {/* Student Details */}
              <div className="tw-w-3/12">
                <div className="tw-inline-block">
                  <UserDetails
                    displayName={studentName}
                    displayId={studentCode}
                    imageUrl={props?.studentImageUrl || ""}
                    size={"md"}
                    contentNotCenter={true}
                    paddingTop={"p-2"}
                    displayNameClass="fw-bold"
                    defaultImgType="student"
                  />
                </div>
              </div>

              <div className="tw-w-2/12 tw-p-2">
                <div className="tw-flex tw-mb-1">
                  <div className="tw-flex-1">
                    <h6>
                      <span className="tw-font-bold">Class:</span>
                    </h6>
                  </div>
                  <div className="tw-flex-1">
                    <h6>
                      <span className="tw-font-bold tw-text-gray-500">
                        {className || "-"}
                      </span>
                    </h6>
                  </div>
                </div>

                <div className="tw-flex">
                  <div className="tw-flex-1">
                    <h6>
                      <span className="tw-font-bold">Section:</span>
                    </h6>
                  </div>
                  <div className="tw-flex-1">
                    <h6>
                      <span className="tw-font-bold tw-text-gray-500">
                        {sectionName || "-"}
                      </span>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-flex">
          <div className="tw-w-full">
            <TableContainer
              columns={libraryTcColumns}
              data={
                Array.isArray(libraryTcDetailsRequestListResp?.books) &&
                  libraryTcDetailsRequestListResp.books.length > 0
                  ? libraryTcDetailsRequestListResp.books
                  : []
              }
              tableClass="tw-mb-0"
               divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
              showCheckbox={false}
            />
          </div>
        </div>
      </div>

      <div className="tw-modal-footer tw-p-2">
        <div className="tw-flex tw-gap-2 tw-justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={props.toggle}
          >
            Close
          </Button>
        </div>
      </div>
    </>
  );
};

export default LibraryTcRequestsViewModal;
