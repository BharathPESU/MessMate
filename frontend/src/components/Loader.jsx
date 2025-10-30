const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex h-full w-full items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3 text-messmate-primary">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-messmate-secondary" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
