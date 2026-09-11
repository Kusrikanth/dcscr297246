import { useRef, useState } from 'react';
import ReactCrop, {
    Crop,
    PixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'
import Button from './Button';

const TO_RADIANS = Math.PI / 180

export async function canvasToBlob(
    fileName: string,
    image: HTMLImageElement,
    crop: Crop,
    scale = 1,
    rotate = 0,
    fileType: string,
    outputWidth: number,
    outputHeight: number
) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("No 2d context");
    }
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // const scaleX = (image.naturalWidth / (image.width * 2))
    // const scaleY = (image.naturalHeight / (image.height * 2))
    // const pixelRatio = window.devicePixelRatio
    // console.log({ pixelRatio, scaleX, scaleY, crop, fileType });
    // canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    // canvas.height = Math.floor(crop.height * scaleY * pixelRatio)
    // ctx.scale(pixelRatio, pixelRatio)
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, outputWidth, outputHeight);
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;
    const sourceWidth = crop.width * scaleX;
    const sourceHeight = crop.height * scaleY;
    ctx.save();
    ctx.translate(outputWidth / 2, outputHeight / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        -outputWidth / 2,
        -outputHeight / 2,
        outputWidth,
        outputHeight
    );
    ctx.restore();
    return new Promise((resolve) => {
        canvas.toBlob((blob: any) => {
            blob.name = fileName;
            resolve(blob);
        }, "image/jpeg", 0.9);
    });
}

export function CropModal({ modalData, closeModalHndler, uploadCroppedImgHndlr }: any) {
    const { imageName, imageType, imageSrc, cropWidth = 200, cropHeight = 230, rotate: initialRotate, } = modalData || {};
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [crop, setCrop] = useState<Crop>()
    const [cropError, setCropError] = useState('');
    const imgRef = useRef<HTMLImageElement>(imageSrc)

    const [scale, setScale] = useState(1);
    const showRotateControls = initialRotate !== undefined;
    const [rotate, setRotate] = useState(normalizeRotate(initialRotate ?? 0));

    async function onDownloadCropClick() {
        const image = imgRef.current;
        if (!image || !completedCrop) {
            setCropError('Please select crop area before upload.');
            return;
        }
        setCropError('');
        const blobFile: any = await canvasToBlob(
            imageName,
            imgRef.current,
            completedCrop,
            scale,
            rotate,
            imageType,
            cropWidth,
            cropHeight
        );
        uploadCroppedImgHndlr(blobFile);
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const aspect = cropWidth / cropHeight;
        let newWidth = cropWidth;
        let newHeight = cropHeight;
        if (newWidth > width) {
            newWidth = width;
            newHeight = newWidth / aspect;
        }
        if (newHeight > height) {
            newHeight = height;
            newWidth = newHeight * aspect;
        }
        const x = (width - newWidth) / 2;
        const y = (height - newHeight) / 2;

        const initialCrop = {
            unit: "px" as const,
            x,
            y,
            width: newWidth,
            height: newHeight,
        };
        setCrop(initialCrop);
        setCompletedCrop(initialCrop);
        setCropError('');
    }

    function normalizeRotate(value: number) {
        let angle = value % 360;
        if (angle > 180) angle -= 360;
        if (angle < -180) angle += 360;
        return angle;
    }

    return (
        <div className='tw-p-5'>
            <div style={{ height: '350px', overflow: 'hidden' }} className='tw-w-full tw-flex tw-justify-center tw-items-center'>
                <ReactCrop
                    crop={crop}
                    onChange={(pixelCrop) => {
                        setCrop(pixelCrop);
                        setCropError('');
                    }}
                    onComplete={(c) => setCompletedCrop(c)}
                    // maxWidth={200}
                    // maxHeight={230}
                    aspect={cropWidth / cropHeight}
                    minWidth={cropWidth}
                    minHeight={cropHeight}
                    maxWidth={cropWidth}
                    maxHeight={cropHeight}
                    keepSelection
                >
                    <img
                        ref={imgRef}
                        alt="Crop Image"
                        src={imageSrc}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '350px',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                            transform: showRotateControls
                                ? `rotate(${rotate}deg) scale(${scale})`
                                : `scale(${scale})`,
                            transformOrigin: 'center',
                            display: 'block',
                            // maxHeight: "230px",
                            // maxWidth: "100%"
                        }}
                        onLoad={onImageLoad}
                    />
                </ReactCrop>
            </div>

            <div className="Crop-Controls tw-mt-2 tw-flex tw-items-center">
                <label htmlFor="scale-input tw-mt-1">Scale: </label>
                <input
                    id="scale-input"
                    type="range"
                    step="0.1"
                    className='tw-ms-2 tw-mb-1'
                    min={1}
                    max={5}
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                />
            </div>
            <div className="form-text tw-text-gray-500">
                Note : Please drag the image to crop it.
            </div>

            {cropError && (
                <div className="tw-text-red-500 tw-text-sm tw-mt-2">
                    {cropError}
                </div>
            )}

            {showRotateControls && (
                <>
                    <div className="Crop-Controls tw-mt-2 tw-flex tw-items-center">
                        <label htmlFor="rotate-input">Rotate: </label>
                        <input
                            id="rotate-input"
                            type="range"
                            step="1"
                            className="tw-ms-2 tw-mb-1"
                            min={-180}
                            max={180}
                            value={rotate}
                            onChange={(e) => setRotate(normalizeRotate(Number(e.target.value)))}
                        />
                        <span className="tw-ms-2">{normalizeRotate(rotate)}°</span>
                    </div>

                    <div className="tw-mt-3 tw-flex tw-gap-2">
                        <Button
                            type="button"
                            onClick={() => setRotate((prev: number) => normalizeRotate(prev - 90))}
                            variant="secondary"
                        >
                            Rotate Left
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setRotate((prev: number) => normalizeRotate(prev + 90))}
                            variant="secondary"
                        >
                            Rotate Right
                        </Button>
                    </div>
                </>
            )}

            <div className='tw-grid tw-grid-cols-12'>
                <div className='tw-col-span-12 tw-flex tw-w-auto tw-ml-auto tw-gap-2 '>
                    <Button
                        type="button"
                        onClick={closeModalHndler}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={onDownloadCropClick}
                        variant="primary"
                    >
                        Upload
                    </Button>
                </div>
            </div>
        </div>
    )
}