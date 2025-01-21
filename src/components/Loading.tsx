"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <img
        src="/loader.gif"
        alt="Loading"
        className="w-40 h-40"
      />
    </div>
  );
};

export default Loading;