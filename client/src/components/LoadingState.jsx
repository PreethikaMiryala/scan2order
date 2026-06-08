function LoadingState({ label = "Preparing the service" }) {
  return (
    <div className="grid min-h-[180px] place-items-center">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 text-[#1F1A17]">
        <div className="shimmer h-1.5 w-40 rounded-full bg-[#1F1A17]/10" />
        <p className="text-sm uppercase tracking-[0.24em] text-[#1F1A17]/55">{label}</p>
      </div>
    </div>
  );
}

export default LoadingState;
