import React from 'react'

const GradesDistribution = ({ data}) => {
  return (
    <div>
      <div className="tw-p-5">
                <div className="tw-flex tw-flex-wrap tw-gap-2">
                  {data?.gradesSettingDTOs?.map((band) => (
                    <span key={band.grade} className="tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded-md">
                      {band?.grade}: {band?.fromMarks} - {band?.toMarks}
                    </span>
                  ))}
                </div>
              </div>
    </div>
  )
}

export default GradesDistribution
