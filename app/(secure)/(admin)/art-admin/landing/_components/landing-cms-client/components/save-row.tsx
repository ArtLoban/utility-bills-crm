import { SaveButton } from "./save-button";

type TProps = {
  isDirty: boolean;
  onSave: () => void;
  isSaving?: boolean;
};

export const SaveRow = ({ isDirty, onSave, isSaving }: TProps) => (
  <>
    {/* Desktop */}
    <div className="border-border mt-2 hidden items-center justify-between rounded-lg border bg-zinc-50 p-4 md:flex dark:bg-zinc-900">
      <div className="text-muted-foreground flex items-center gap-2.5 text-xs">
        <span className="bg-muted-foreground inline-block h-1.5 w-1.5 rounded-full" aria-hidden />
        {isDirty ? "Pending changes on this tab." : "No pending changes on this tab."}
      </div>
      <SaveButton isDirty={isDirty} onSave={onSave} isSaving={isSaving} />
    </div>

    {/* Mobile sticky */}
    <div className="border-border sticky bottom-0 z-10 border-t bg-white/95 px-4 pt-3 pb-4 backdrop-blur-sm md:hidden dark:bg-zinc-950/95">
      <SaveButton isDirty={isDirty} onSave={onSave} isSaving={isSaving} fullWidth />
      <p className="text-muted-foreground mt-1.5 text-center text-xs">
        {isDirty ? "Pending changes — save before leaving." : "No pending changes on this tab."}
      </p>
    </div>
  </>
);
