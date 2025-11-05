const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex h-full w-full items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="cyber-loader" />
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-neutral-300/70">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Loader;
