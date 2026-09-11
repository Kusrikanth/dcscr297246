import { useRef, useState } from 'react';
import ReactCrop, {
    Crop,
    PixelCrop,
} from 'react-image-crop';
import Button from '../../../../../../Components/Common/Button';

const TO_RADIANS = Math.PI / 180

export async function canvasToBlob(
    fileName: string,
    image: HTMLImageElement,
    crop: Crop,
    scale = 1,
    rotate = 0,
    fileType: string,
) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('No 2d context')
    }
    const scaleX = image.naturalWidth / image.width; // Scaling factor for width
    const scaleY = image.naturalHeight / image.height; // Scaling factor for height
    canvas.width = Math.floor(crop.width * scaleX);
    canvas.height = Math.floor(crop.height * scaleY);

    // const scaleX = (image.naturalWidth / (image.width * 2))
    // const scaleY = (image.naturalHeight / (image.height * 2))
    // const pixelRatio = window.devicePixelRatio
    // console.log({ pixelRatio, scaleX, scaleY, crop, fileType });
    // canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    // canvas.height = Math.floor(crop.height * scaleY * pixelRatio)
    // ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'
    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY
    const rotateRads = rotate * TO_RADIANS
    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2
    ctx.save()
    ctx.translate(-cropX, -cropY)
    ctx.translate(centerX, centerY)
    ctx.rotate(rotateRads)
    ctx.scale(scale, scale)
    ctx.translate(-centerX, -centerY)

    // ctx.drawImage(
    //     image,
    //     0,
    //     0,
    //     image.naturalWidth,
    //     image.naturalHeight,
    //     0,
    //     0,
    //     image.naturalWidth,
    //     image.naturalHeight,
    // )
    ctx.fillStyle = 'white'; // Set the background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        image,
        crop.x * scaleX, // Adjust crop.x based on scale
        crop.y * scaleY, // Adjust crop.y based on scale
        crop.width * scaleX, // Adjust crop width based on scale
        crop.height * scaleY, // Adjust crop height based on scale
        0,
        0,
        canvas.width,
        canvas.height
    );
    // ctx.restore();
    return new Promise((resolve, reject) => {
        const isPng = fileType === 'image/png';
        canvas.toBlob(async (blob: any) => {
            if (!blob) {
                console.error('Canvas is empty');
                return;
            }
            blob.name = fileName;
            resolve(blob);
        }, 'image/jpeg', isPng ? 0.5 : 0.75);
    });
}

export default function CropModal({ modalData, closeModalHndler, uploadCroppedImgHndlr }: any) {
    const { imageName, imageType, imageSrc } = modalData || {};
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [crop, setCrop] = useState<Crop>()
    const imgRef = useRef<HTMLImageElement>(imageSrc)

    const [scale, setScale] = useState(1);

    async function onDownloadCropClick() {
        const image = imgRef.current
        if (!image || !completedCrop) {
            throw new Error('Crop canvas does not exist')
        }
        const blobFile: any = await canvasToBlob(imageName, imgRef.current, completedCrop, scale, 0, imageType);
        uploadCroppedImgHndlr(blobFile);
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;

        // Calculate the default crop size
        const maxCropWidth = 200; // Fixed maximum width
        const maxCropHeight = 230; // Fixed maximum height

        // Ensure crop doesn't exceed image dimensions
        const cropWidth = Math.min(width, maxCropWidth);
        const cropHeight = Math.min(height, maxCropHeight);

        // Center the crop
        const x = (width - cropWidth) / 2;
        const y = (height - cropHeight) / 2;

        setCrop({
            unit: 'px', // Use pixel units
            width: cropWidth,
            height: cropHeight,
            x,
            y,
        });
    }



    return (
        <div className="tw-p-3">
            <div
                style={{ height: "350px" }}
                className="tw-w-full tw-flex tw-justify-center tw-items-center"
            >
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    minHeight={200}
                    minWidth={230}
                    style={{ maxHeight: 230, maxWidth: 200 }}
                >
                    <img
                        ref={imgRef}
                        alt="Crop Image"
                        src={imageSrc}
                        style={{
                            transform: `scale(${scale})`,
                        }}
                        onLoad={onImageLoad}
                    />
                </ReactCrop>
            </div>

            <div className="tw-mt-2 tw-flex tw-items-center">
                <label htmlFor="scale-input tw-mt-1">Scale: </label>
                <input
                    id="scale-input"
                    type="range"
                    step="0.1"
                    className="tw-ml-2 tw-mb-1"
                    min={1}
                    max={5}
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                />
            </div>

            <div className="tw-text-sm tw-text-gray-500">
                Note : Please drag the image to crop it.
            </div>

            <div className="tw-flex tw-flex-wrap">
                <div className="tw-flex tw-w-auto tw-ml-auto">
                    <Button
                        type="button"
                        variant='secondary'
                        onClick={closeModalHndler}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant='primary'
                        onClick={onDownloadCropClick}
                    >
                        Upload
                    </Button>
                </div>
            </div>
        </div>
    )
}