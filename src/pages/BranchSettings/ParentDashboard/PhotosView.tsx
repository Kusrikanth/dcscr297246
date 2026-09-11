import React from 'react'
interface PhotosViewProps {
    photos: any;
}
const PhotosView = (props: PhotosViewProps) => {
    return (
        <div className='tw-flex photo_view'>
            {props.photos.map((photo: any,index:number) => {
                return <div className={'tw-me-1'} key={index}>
                    <img
                        src={photo}
                        className='view_photo'
                        // style={{width:"74px",height:'74px'}}
                    />
                </div>
            })}
        </div>
    )
}

export default PhotosView
