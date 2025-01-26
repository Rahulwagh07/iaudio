import { RiProgress8Line } from "react-icons/ri";

export default function Progress({
  exportProgress,
}: {
  exportProgress: { status: string; progress: number };
}) {
  return (
    <div className="fixed bottom-4 right-4 bg-purple-900 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-center gap-3">
        <RiProgress8Line className="animate-pulse w-6 h-6 text-green-600" />
        <div>
          <div className="text-sm font-medium text-white capitalize">
            {exportProgress.status}...
          </div>
          <div className="w-48 h-1.5 bg-purple-800 rounded-full mt-2">
            <div
              className="h-full bg-purple-400 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
