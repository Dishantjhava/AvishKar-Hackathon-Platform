const CriteriaInput = ({ criterion, value, onChange }) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
      <div className="flex justify-between items-center text-xs font-bold text-slate-800">
        <span>{criterion.name}</span>
        <span className="text-[#E02567]">Max: {criterion.maxScore} pts</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={criterion.maxScore}
          value={value?.score || 0}
          onChange={(e) => onChange("score", Number(e.target.value))}
          className="flex-1 accent-[#E02567]"
        />
        <span className="w-10 text-right font-black text-slate-900 text-base">
          {value?.score || 0}
        </span>
      </div>
      <textarea
        rows={1}
        value={value?.feedback || ""}
        onChange={(e) => onChange("feedback", e.target.value)}
        placeholder={`Comments for ${criterion.name}...`}
        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#E02567] resize-none"
      />
    </div>
  );
};

export default CriteriaInput;
