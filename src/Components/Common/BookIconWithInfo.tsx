import React from "react";

interface Props {
  cardName: string;
  subName: string;
  image: any;
  color: string;
}

const BookIconWithInfo = ({ cardName, subName, image, color }: Props) => {
  return (
    <>
      <div className="book_icon_info_wrapper">
        <div
          className="bookmark_book_icon_wrap"
          style={{ backgroundColor: `${color}` }}
        >
          {image}
        </div>

        <div className="tw-flex tw-flex-col">
          <span className="tw-block user-name-text">{cardName}</span>

          <span className="tw-block tw-text-xs tw-text-gray-500 user-name-sub-text">
            {subName}
          </span>
        </div>
      </div>
    </>
  );
};

export default BookIconWithInfo;
