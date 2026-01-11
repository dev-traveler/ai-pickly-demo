"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">문제가 발생했습니다</h2>
      <p className="mb-4 text-gray-600">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        다시 시도
      </button>
    </div>
  );
}
