import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../utility/reduxutility';
import { default as StudentsSvg } from "../../../assets/imagesdps/mastersetup/studentsSvg.svg?react";
import { getLibraryCollectionStatsCountListAct } from '../../../store/library/bookcollection/bookcollectionaction';
import { default as LibrarySvg } from "../../../assets/imagesdps/updatedDashboard/library.svg?react";


const LibraryCarousel: React.FC = (props: any) => {
  const dispatch = useAppDispatch();
  const {
    currentBranchIdResp: branchId,
    libraryCollectionStatsRequestListResp,
    currentInstIdResp : instituteId,
  } = useAppSelector(
    ({ libraryBookCollection, appData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      libraryCollectionStatsRequestListResp: libraryBookCollection.libraryCollectionStatsRequestListResp,
    }),
    shallowEqual
  );

  const libraryRecordList = () => {
    let payload = {
      branchId,
      sortBy: "createdAt",
      orderBy: "asc",
      pageNo: 0,
      pageSize: 20,
    };
    if (branchId) {
      dispatch(getLibraryCollectionStatsCountListAct(generateActionPayload("get_library_book_collection_stats_count", undefined, payload)));
    }

  };

  useEffect(() => {
    libraryRecordList();
  }, [branchId,instituteId,]);

  return (
    <>
      <div className='library-stats-count'>
        <div className="library-stats row stats mb-1">
          {libraryCollectionStatsRequestListResp && libraryCollectionStatsRequestListResp.length > 0 ? (
            libraryCollectionStatsRequestListResp.map((library: any, index: any) => (
              <div key={`${library.libraryId}-${index}`} className="col-12 col-md-6 col-xl-3">
                <div className='card inline-block w-100 top_card mb-2'>
                  <div className="card-body p-3">
                    <div className='d-flex flex-column'>
                      <div className='row d-flex justify-content-between'>
                        <div className='col-9 d-flex flex-column'>
                          <h4 className="card-title fs-15 flex-grow-1 text-nowrap mb-3 text-muted fw-normal">
                            {library.libraryName}
                          </h4>
                          <h4 className="fw-bold fs-26 d-flex align-items-center mb-3">{library.count}</h4>
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
