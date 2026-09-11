import { original } from '@reduxjs/toolkit';
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from '../../../../../Components/Common/MenuOptions';
import { getDdMmYyyyWithMonthNameFormat } from '../../../../../utility/dateutility';
import { UserDetails } from '../../../../../Components/Common';

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: 'S.No',
      accessor: 'sno',
      disableSortBy: true,
      Cell: ({ row: { index } }: any) => {
        return <span>{index < 9 ? `0${index + 1}` : index + 1}</span>;
      },
      columnClassName: 'w-100px min-w-100px max-w-100px',
    },
    {
      Header: 'Category Name',
      accessor: 'categoryName',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-gap-2 tw-items-center">
            <div className="tw-w-10 tw-h-10 tw-overflow-hidden tw-flex tw-items-center tw-justify-center tw-border tw-border-1 tw-rounded-full">
              <img
                src={original.categoryIcon?.s3Url}
                alt=""
                className="tw-rounded-full tw-object-cover"
              ></img>
            </div>
            <p className="tw-mb-0 tw-text-[#212529] tw-text-base">
              {original.categoryName || '-'}
            </p>
          </div>
        );
      },
    },
    {
      Header: 'Sub Categories',
      accessor: 'subCategories',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-items-center tw-gap-3">
            {original?.subCategories.length > 0 ? (
              original?.subCategories?.map((item: any) => (
                <span
                  key={item.id}
                  className="badge text-uppercase bg-light text-muted"
                >
                  {item.subCategoryName}
                </span>
              ))
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    },
    {
      Header: 'Actions',
      thClass: 'w-5',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionList}
            rowId={original.categoryId}
          />
        );
      },
    },
  ];
}
