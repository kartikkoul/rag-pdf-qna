import { FastApiUploadResponse } from "@/src/types/backendResponseTypes";
import { toTitleCase } from "@/src/utils/misc";
import React, { Dispatch, SetStateAction, useState } from "react";
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

  return createPortal((
    <div className="fileDialogOuter absolute w-screen h-screen max-h-screen bg-[#00000094] flex items-center justify-center top-0 scrollbar-custom" onClick={() => setFilesUploadResponse(null)}>
        <div className="failedFilesDialog text-center w-[90%] border border-white/30 relative bg-[#000000] rounded-md px-6 py-16 md:px-24 md:py-16 z-999" onClick={(e) => e.stopPropagation()}>
        <p className="text-red-400 mb-4">Some files failed to upload.</p>
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
            <div className="w-full max-w-md mx-auto my-15 rounded-md border border-white/10 bg-white/[0.03]">
            {/* header */}
            <div className="px-4 py-2 text-left text-xs text-white/50 border-b border-white/10">
                Failed Files
            </div>

            {/* list */}
            <div className="max-h-48 overflow-y-auto">
                {failedFiles.map((file, index) => (
                <div
                    key={index}
                    className="flex items-end justify-between gap-4 px-4 py-3 text-sm border-b border-white/5 last:border-none"
                >
                    <span className="text-white/80 truncate max-w-[60%]">
                    {file.filename}
                    </span>

                    <span className="text-red-400 text-xs">
                    {file.error}
                    </span>
                </div>
                ))}
            </div>
            </div>
        )}
        <div className="actions flex gap-4 justify-center items-center text-sm">
            <button
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
