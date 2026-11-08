import {
  forwardRef,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type KeyboardEvent
} from 'react';
import { Button } from '../button';
import { cn } from '../../lib/cn/cn';
import styles from './file-uploader.module.scss';

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
};

export interface FileUploaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  files?: File[];
  defaultFiles?: File[];
  onFilesChange?: (files: File[]) => void;
  onFileReject?: (file: File, reason: 'max-size' | 'max-files') => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  emptyHint?: string;
}

export const FileUploader = forwardRef<HTMLDivElement, FileUploaderProps>((rawProps, ref) => {
  const {
    className,
    files,
    defaultFiles = [],
    onFilesChange,
    onFileReject,
    accept,
    multiple = false,
    maxFiles,
    maxFileSize,
    disabled = false,
    required = false,
    name,
    emptyHint = 'Drop files here or click to upload.',
    ...props
  } = rawProps;
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = Object.prototype.hasOwnProperty.call(rawProps, 'files');
  const [isDragActive, setIsDragActive] = useState(false);
  const [internalFiles, setInternalFiles] = useState<File[]>(defaultFiles);
  const activeFiles = isControlled ? files ?? [] : internalFiles;

  const commitFiles = (nextFiles: File[]) => {
    if (!isControlled) {
      setInternalFiles(nextFiles);
    }
    onFilesChange?.(nextFiles);
  };

  const validateFiles = (incomingFiles: File[]) => {
    const acceptedFiles: File[] = [];
    for (const file of incomingFiles) {
      if (maxFileSize && file.size > maxFileSize) {
        onFileReject?.(file, 'max-size');
        continue;
      }

      acceptedFiles.push(file);
    }

    if (maxFiles && acceptedFiles.length > maxFiles) {
      acceptedFiles.slice(maxFiles).forEach((file) => onFileReject?.(file, 'max-files'));
      return acceptedFiles.slice(0, maxFiles);
    }

    return acceptedFiles;
  };

  const handleIncomingFiles = (incomingFiles: File[]) => {
    if (disabled || incomingFiles.length === 0) {
      return;
    }

    const validatedFiles = validateFiles(incomingFiles);
    const mergedFiles = multiple ? [...activeFiles, ...validatedFiles] : validatedFiles.slice(0, 1);

    const deduplicatedFiles = Array.from(
      new Map(mergedFiles.map((file) => [`${file.name}-${file.size}-${file.lastModified}`, file])).values()
    );

    const limitedFiles = maxFiles ? deduplicatedFiles.slice(0, maxFiles) : deduplicatedFiles;
    commitFiles(limitedFiles);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
    handleIncomingFiles(selectedFiles);
    event.target.value = '';
  };

  const removeFile = (fileToRemove: File) => {
    const nextFiles = activeFiles.filter(
      (file) =>
        file.name !== fileToRemove.name ||
        file.lastModified !== fileToRemove.lastModified ||
        file.size !== fileToRemove.size
    );
    commitFiles(nextFiles);
  };

  const openPicker = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const onDropKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPicker();
    }
  };

  const hintText = useMemo(() => {
    const maxFilesText = maxFiles ? `Max ${maxFiles} file${maxFiles > 1 ? 's' : ''}.` : null;
    const maxSizeText = maxFileSize ? `Up to ${formatFileSize(maxFileSize)} per file.` : null;
    return [maxFilesText, maxSizeText].filter(Boolean).join(' ');
  }, [maxFileSize, maxFiles]);

  return (
    <div ref={ref} className={cn(styles.root, className)} {...props}>
      <div
        role='button'
        tabIndex={disabled ? -1 : 0}
        className={styles.dropzone}
        data-active={isDragActive ? 'true' : 'false'}
        data-disabled={disabled ? 'true' : 'false'}
        aria-disabled={disabled}
        onClick={openPicker}
        onKeyDown={onDropKeyDown}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) {
            setIsDragActive(true);
          }
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragActive(false);
          handleIncomingFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <div>
          <p className={styles.meta}>{emptyHint}</p>
          {hintText ? <p className={styles.meta}>{hintText}</p> : null}
        </div>
      </div>

      <input
        ref={inputRef}
        className={styles.input}
        type='file'
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        required={required && activeFiles.length === 0}
        onChange={handleInputChange}
      />

      {activeFiles.length > 0 ? (
        <ul className={styles.list}>
          {activeFiles.map((file) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`} className={styles.fileItem}>
              <span className={styles.fileName}>
                {file.name} ({formatFileSize(file.size)})
              </span>
              <Button
                type='button'
                size='sm'
                variant='ghost'
                onClick={() => removeFile(file)}
                disabled={disabled}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});

FileUploader.displayName = 'FileUploader';
