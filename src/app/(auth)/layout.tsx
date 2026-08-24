export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <h1 className="mb-8 text-center text-2xl font-semibold text-slate-900">
          simplecycle
        </h1>
        {children}
      </div>
    </div>
  );
}
