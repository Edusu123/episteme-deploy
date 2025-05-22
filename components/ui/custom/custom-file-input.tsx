import {
  ChangeEvent,
  DragEventHandler,
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useState
} from 'react';

interface UploadFileProps extends InputHTMLAttributes<HTMLInputElement> {
  fileName?: string;
  handleChange: (file: File) => void;
}

const CustomFileInput = forwardRef<HTMLInputElement, UploadFileProps>(
  ({ fileName, handleChange, ...props }, ref) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e: any) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: any) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDragOver = (e: any) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDrop = (e: any) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      handleChange(file);
    };

    return (
      <div
        className="flex items-center justify-center w-full"
        onClick={() => {
          document.getElementById('fileInput')?.click();
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className={`w-8 h-8 mb-4 text-gray-500 dark:text-gray-400 ${isDragging && 'animate-ping'}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            {fileName ? (
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">{fileName}</span>
              </p>
            ) : (
              <div className="flex flex-col items-center">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Clique para selecionar</span>{' '}
                  ou arraste e solte
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">XML</p>
              </div>
            )}
          </div>
          <input
            accept="image/*"
            className="hidden"
            id="fileInput"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) handleChange(e.target.files[0]);
            }}
            ref={ref}
            type="file"
          />
        </label>
      </div>
    );
  }
);

export { CustomFileInput };
