const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex h-full w-full items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        </div>
        <p className="text-sm font-medium text-white/80">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
