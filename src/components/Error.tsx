import React from 'react';

const Error: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-100">
      <div className="p-4 text-red-700">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Error;