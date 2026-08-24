import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — simplecycle",
};

const LAST_UPDATED = "August 19, 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
        ← Back to simplecycle
      </Link>

      <h1 className="mt-6 text-3xl font-semibold text-slate-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-slate mt-8 max-w-none space-y-6 text-slate-700">
        <p>
          simplecycle (&ldquo;simplecycle,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) provides tools to help applicants track school application cycles,
          including secondaries, scores, interviews, and essays. This Privacy Policy explains
          what information we collect, how we use it, and the choices you have.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Information we collect</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Account information:</strong> your name, email address, and password
              (stored in hashed form) when you create an account.
            </li>
            <li>
              <strong>Application data:</strong> information you enter about your application
              cycle, such as schools, application statuses, exam scores, GPA, interview dates,
              essays, and notes.
            </li>
            <li>
              <strong>Usage data:</strong> basic technical information such as browser type,
              device information, and how you interact with the site, used to keep the service
              secure and reliable.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">How we use your information</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>To provide, maintain, and improve the simplecycle service.</li>
            <li>To authenticate your account and keep your data secure.</li>
            <li>To communicate with you about your account or changes to our service.</li>
            <li>To troubleshoot issues and understand how the product is used.</li>
          </ul>
          <p className="mt-2">
            We do not sell your personal information, and we do not use your application data
            (such as essays, scores, or school lists) for advertising purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">How we store and share data</h2>
          <p>
            Your data is stored using Supabase, our database and authentication provider. We may
            also use service providers (such as Resend, for transactional email) to operate the
            service. These providers only receive the information necessary to perform their
            function and are not permitted to use your data for any other purpose.
          </p>
          <p className="mt-2">
            We may disclose information if required by law, to protect the rights and safety of
            simplecycle or our users, or in connection with a merger, acquisition, or sale of
            assets, in which case we will notify you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Your choices</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>You can access and update most of your information from your dashboard.</li>
            <li>
              You can request deletion of your account and associated data by contacting us at
              the email below.
            </li>
            <li>You can opt out of non-essential emails at any time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Data retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed to
            provide the service. If you delete your account, we will delete or anonymize your
            personal information within a reasonable period, except where we are required to
            retain it for legal or security purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Children&apos;s privacy</h2>
          <p>
            simplecycle is not directed to children under 13, and we do not knowingly collect
            personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make material changes, we
            will notify you by updating the &ldquo;Last updated&rdquo; date above or through
            other reasonable means.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Contact us</h2>
          <p>
            If you have questions about this Privacy Policy or your data, contact us at{" "}
            <a href="mailto:support@simplecycle.app" className="font-medium text-slate-900 underline">
              support@simplecycle.app
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
