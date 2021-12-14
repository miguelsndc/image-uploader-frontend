import { useDropzone } from 'react-dropzone';
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineFile,
  AiOutlineCheck,
} from 'react-icons/ai';
import { SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { Box } from '../box';
import RoadImage from '../../assets/image.svg';
import styles from './styles.module.css';

const allowedTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg',
];

type UploadResponseData = {
  url: string;
};

export const Uploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [uploadCompleted, setUploadCompleted] = useState(false);

  const onDrop = (files: File[]) => setFile(files[0]);

  const { getRootProps, getInputProps, open, isDragActive, fileRejections } =
    useDropzone({
      accept: allowedTypes.join(', '),
      maxSize: 1024 * 1024 * 2,
      multiple: false,
      onDropAccepted: onDrop,
    });

  const clear = (e: SyntheticEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  useEffect(() => {
    fileRejections.length > 0 &&
      fileRejections[0].errors[0].code === 'file-too-large' &&
      alert("File larger than 2MB, i'm using a free tier here, come on...");
  }, [fileRejections]);

  const onUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsLoading(true);

    try {
      const response = await axios.post<UploadResponseData>(
        'http://localhost:3333/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUrl(response.data.url);
      setUploadCompleted(true);
    } catch {
      alert('A Error happened while uploading your file, try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const onCopyUrl = () => {
    navigator.clipboard.writeText(url);
    alert('Copied successfully');
  };

  const UploadLoader = () => {
    return (
      <div className={styles.loaderContainer}>
        <h1>Uploading...</h1>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}></div>
        </div>
      </div>
    );
  };

  const UploadSuccessful = () => {
    return (
      <div>
        <div className={styles.successfulIcon}>
          <AiOutlineCheck size={'100%'} />
        </div>
        <h1>Uploaded Successfully!</h1>
        <img src={url} className={styles.imageContainer} />
        <div className={styles.copyContainer}>
          <p>{url}</p>
          <button className={styles.defaultButton} onClick={onCopyUrl}>
            Copy Link
          </button>
        </div>
      </div>
    );
  };

  return (
    <Box appendClassnames={styles.box}>
      {isLoading ? (
        <UploadLoader />
      ) : uploadCompleted ? (
        <UploadSuccessful />
      ) : (
        <>
          <h1>Upload your image</h1>
          <h3>
            {file ? (
              <>
                Preview your image before uploading:
                <span>{file.name}</span>
              </>
            ) : (
              <>
                File should be{' '}
                {allowedTypes.map(type => type.replace('image/', ' - '))}
              </>
            )}
          </h3>
          <div
            {...getRootProps({
              className: `${styles.dropzone} ${file && styles.fix}`,
            })}
          >
            <input {...getInputProps()} />
            {isDragActive && (
              <div className={styles.draggingOverlay}>
                <AiOutlinePlus size={96} />
              </div>
            )}
            {file ? (
              <>
                <div className={styles.controls}>
                  <button
                    aria-label='Remove file'
                    className={styles.removeButton}
                    onClick={clear}
                  >
                    <AiOutlineClose />
                  </button>
                  <button
                    aria-label='Open file dialog'
                    className={styles.openDialogButton}
                  >
                    <AiOutlineFile />
                  </button>
                </div>
                <img
                  className={styles.previewImage}
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                />
              </>
            ) : (
              <>
                <img
                  className={styles.vector}
                  src={RoadImage}
                  alt='Road with mountains on the back'
                />
                <p>Drag & Drop your image here</p>
              </>
            )}
          </div>
          {file ? (
            <button
              className={`${styles.uploadButton} ${styles.defaultButton}`}
              onClick={onUpload}
            >
              Upload
            </button>
          ) : (
            <>
              <span>Or</span>
              <button className={styles.defaultButton} onClick={open}>
                Choose a file
              </button>
            </>
          )}
        </>
      )}
    </Box>
  );
};
