const SkeletonCard = () => (
  <div className="bg-white rounded-lg p-3 shadow-sm animate-pulse">
    <div className="w-full h-32 bg-gray-200 rounded-md mb-2" />
    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
    <div className="h-3 bg-gray-200 rounded mb-1 w-2/3" />
    <div className="flex justify-between items-center mt-2">
      <div className="h-4 bg-gray-200 rounded w-16" />
      <div className="h-3 bg-gray-200 rounded w-10" />
    </div>
  </div>
);

export default SkeletonCard;