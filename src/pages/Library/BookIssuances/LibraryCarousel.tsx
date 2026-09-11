import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getLibraryIssuanceStatsCountListAct } from '../../../store/library/bookissuance/bookissuanceaction';
import { generateActionPayload } from '../../../utility/reduxutility';
import { default as LibrarySvg } from "../../../assets/imagesdps/updatedDashboard/library.svg?react";
interface LibraryCarouselProps {
  academicYearId: string;
}

const LibraryCarousel: React.FC<LibraryCarouselProps> = (props: any) => {
  const { academicYearId } = props;
  const dispatch = useAppDispatch();
  const {
    currentBranchIdResp: branchId,
    libraryIssuanceStatsRequestListResp,
  } = useAppSelector(
    ({ libraryBookIssuance, appData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      libraryIssuanceStatsRequestListResp: libraryBookIssuance.libraryIssuanceStatsRequestListResp,
    }),
    shallowEqual
  );
  const libraryRecordList = () => {
    const academicYearId = props.academicYearId
    let payload = {

      branchId,
      academicYearId,
      sortBy: "createdAt",
      orderBy: "asc",
      pageNo: 0,
      pageSize: 20,
    };
    if (props.academicYearId) {
      dispatch(getLibraryIssuanceStatsCountListAct(generateActionPayload("get_library_book_issuance_stats_count", undefined, payload)));
    }

  };


  useEffect(() => {
    libraryRecordList();
  }, [academicYearId]);

  return (
    <>
      <div className='library-stats-count'>
        <div className="library-stats row stats mb-1">
          {libraryIssuanceStatsRequestListResp && libraryIssuanceStatsRequestListResp.length > 0 ? (
            libraryIssuanceStatsRequestListResp.map((library: any, index: any) => (
              <div key={`${library.libraryId}-${index}`} className="col-12 col-md-6 col-xl-3">
                <div className='card inline-block w-100 top_card mb-2'>
                  <div className="card-body p-3">
                    <div className='d-flex flex-column'>
                      <div className='row d-flex justify-content-between'>
                        <div className='col-9 d-flex flex-column'>
                        <div className='d-flex flex-column'>
                          <h4 className="card-title fs-15 flex-grow-1 text-nowrap mb-3 text-muted fw-normal">
                            {library.libraryName}
                          </h4>
                          <h4 className="fw-bold fs-26 d-flex align-items-center mb-3"><span className='text-muted fs-19'>{library.issuedBooks}</span>/{library.total}</h4>
                        </div>
                        </div>
                        <div className='col-3 inline-block pe-2'>
                          <div className='d-flex'>
                            <div className="circle_bus d-flex justify-content-center p-2 rounded" style={{ backgroundColor: "#d9eef9" }}>
                            <LibrarySvg className='w-75'/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default LibraryCarousel;
