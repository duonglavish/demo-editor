import * as React from 'react';

export function NotFoundPage() {
  return (
    <>
      <div className="h-screen min-h-min flex flex-col items-center justify-center">
        <div className="-mt-24 font-bold text-black text-6xl">
          4
          <span className="text-6xl" role="img" aria-label="Crying Face">
            🤔
          </span>
          4
        </div>
        <p className="text-gray-500 text-3xl">Page not found.</p>
      </div>
    </>
  );
}
