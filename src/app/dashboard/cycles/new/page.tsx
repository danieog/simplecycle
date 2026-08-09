import AddCycleForm from "@/components/add-cycle-form";

export default function NewCyclePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Add a cycle</h1>
        <p className="mt-1 text-sm text-slate-600">
          Track a new application attempt separately from your existing cycles.
        </p>
      </div>

      <AddCycleForm />
    </div>
  );
}
