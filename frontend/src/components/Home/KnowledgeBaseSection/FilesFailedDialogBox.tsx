import { FastApiUploadResponse } from "@/src/types/backendResponseTypes";
import { toTitleCase } from "@/src/utils/misc";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const FilesFailedDialogBox = ({
  filesUploadResponse,
  setFilesUploadResponse,
}: {
  filesUploadResponse: FastApiUploadResponse;
  setFilesUploadResponse: Dispatch<
    SetStateAction<FastApiUploadResponse | null>
  >;
}) => {
  const { summary, results } = filesUploadResponse.data;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const failedFiles = results
    .filter((r) => r.error)
    .map((r) => ({
      filename: r.filename,
      error: r.error,
    }));

  const summaryStyles = {
    total: "text-white",
    success: "text-green-400",
    failed: "text-red-400",
  };

  useEffect(() => {
    closeButtonRef.current?.focus();
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFilesUploadResponse(null);
      }
    };
    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [setFilesUploadResponse]);

  return createPortal((
    <div
      className="fileDialogOuter fixed inset-0 z-1000 bg-[#00000094] flex items-center justify-center scrollbar-custom"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setFilesUploadResponse(null);
        }
      }}
    >
        <div
          className="failedFilesDialog text-center w-[90%] md:w-[50%] border border-white/30 relative bg-[#000000] rounded-md px-6 py-16 md:px-24 md:py-16"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-failed-title"
        >
        <p id="upload-failed-title" className="text-red-400 mb-4">Some files failed to upload.</p>
        Summary of the files:
        <div className="flex gap-6 mt-2 mb-4 text-sm justify-center">
            {Object.keys(summary).map((key, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
                <span className="text-white/50">{toTitleCase(key)}</span>
                <span className={`${summaryStyles[key as "total"|"success"|"failed"]} font-medium`}>
                {summary[key as "total"|"success"|"failed"]}
                </span>
            </div>
            ))}
        </div>
        {failedFiles.length > 0 && (
            <div className="w-full max-w-md mx-auto my-15 rounded-md border border-white/10 bg-white/3">
            {/* header */}
            <div className="px-4 py-2 text-left text-xs text-white/50 border-b border-white/10">
                Failed Files
            </div>

            {/* list */}
            <div className="max-h-48 overflow-y-auto">
                {failedFiles.map((file) => (
                <div
                    key={`${file.filename}-${file.error}`}
                    className="flex items-start justify-between gap-4 px-4 py-3 text-sm border-b border-white/5 last:border-none"
                >
                    <span className="text-white/80 truncate max-w-[60%]">
                    {file.filename}
                    </span>

                    <span className="text-red-400 text-xs text-left">
                    {file.error}
                    </span>
                </div>
                ))}
            </div>
            </div>
        )}
        <div className="actions flex gap-4 justify-center items-center text-sm">
            <button
            ref={closeButtonRef}
            onClick={() => setFilesUploadResponse(null)}
            className="cursor-pointer border border-red-500/30 bg-red-500/10 text-red-300 h-10 w-24
                hover:bg-red-500/20 focus:bg-red-500/20 transition-colors
            "
            >
            Close
            </button>
        </div>
        </div>
    </div>
  ), document.body);
};

export default FilesFailedDialogBox;
