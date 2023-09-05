import React, { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/20/solid';
import ProgressBar from './ProgressBar';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ImageUploaderProps {
  signedURLEndpoint?: string;
  onUploadSuccess?: (imageName: string, fileName: string) => void;
  cancelButtonVisible: boolean;
  onCancel?: () => void;
  namespace: string; //the s3 subfolder in web-assets
  className?: string;
  cancelButtonCss?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadSuccess,
  cancelButtonVisible = true,
  signedURLEndpoint = '/api/signed-url',
  onCancel,
  cancelButtonCss = "secondary-btn",
  namespace,
  className = ""
}) => {

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected")
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Get a signed URL from the backend
      const { data: response } = await axios.get(signedURLEndpoint, {
        params: { fileName: file.name, fileType: file.type, namespace: namespace },
      });

      // Step 2: Upload the file using the temporary signed URL
      const response2 = await axios.put(response.signedUrl, file, {
        headers: {
          'Content-Type': file.type,
          'Access-Control-Allow-Origin': '*',
        },
        onUploadProgress: progressEvent => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      });

      if (onUploadSuccess) {
        onUploadSuccess(response.key, file.name);
        setFile(null)
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred while uploading the image.');
    }
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const primaryBtnWidthCss = (cancelButtonVisible) ? "w-3/4" : "w-full";

  return (
    <div className={`${className}`} >
      <label
        className="block border-4 rounded-2xl border-dashed 
                opacity-60  p-4 w-full cursor-pointer mt-4 
                focus-within:ring-0 h-[14rem]
                focus-within:outline-none 
                relative bg-center">

        <div className="absolute inset-0 flex items-center justify-center">
          <PhotoIcon className="h-24 z-5 mt-20 w-24 text-gray-500" aria-hidden="true" />
        </div>

        <p className="h-full text-center items-center justify-center x-40">
          drag and drop file here or
          <span className="font-bold text-blue-400"> click to select a file </span>
          from your computer</p>

        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={handleFileChange}
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
        />
      </label>

      <span className="w-fill opacity-60">
        {file ? file.name : 'No file chosen'}
      </span>

      <div className="flex mt-4 gap-1 w-fill ">
        <PrimaryButton className={primaryBtnWidthCss} onClick={handleUpload} disabled={isUploading}>Upload</PrimaryButton>
        {cancelButtonVisible &&
          <SecondaryButton className={`w-1/4 ml-4 ${cancelButtonCss}`} onClick={onCancel ? onCancel : () => { }}>Cancel</SecondaryButton>
        }
      </div>

      {isUploading && (
        <ProgressBar progressPercent={uploadProgress} />
      )}
    </div>
  );
}

export default ImageUploader;