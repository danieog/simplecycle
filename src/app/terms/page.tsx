import Link from "next/link";

export const metadata = {
  title: "Terms of Use — simplecycle",
};

const LAST_UPDATED = "August 19, 2026";

export default function TermsOfUsePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
        ← Back to simplecycle
      </Link>

      <h1 className="mt-6 text-3xl font-semibold text-slate-900">Terms of Use</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-slate mt-8 max-w-none space-y-6 text-slate-700">
        <p>
          These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of simplecycle
          (the &ldquo;Service&rdquo;). By creating an account or using the Service, you agree to
          these Terms. If you do not agree, do not use the Service.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">1. Using the Service</h2>
          <p>
            You must be at least 13 years old to use simplecycle. You are responsible for the
            accuracy of the information you provide and for maintaining the confidentiality of
            your account credentials. You are responsible for all activity that occurs under your
            account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">2. Your content</h2>
          <p>
            You retain ownership of the information you submit to simplecycle, including school
            lists, scores, essays, and notes (&ldquo;Your Content&rdquo;). You grant us a limited
            license to store, process, and display Your Content solely for the purpose of
            operating and improving the Service for you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">3. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Use the Service for any unlawful purpose or in violation of these Terms.</li>
            <li>Attempt to gain unauthorized access to the Service or other users&apos; data.</li>
            <li>Interfere with or disrupt the integrity or performance of the Service.</li>
            <li>Reverse engineer, scrape, or resell the Service without our permission.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">4. No admissions guarantee</h2>
          <p>
            simplecycle is an organizational tool. We do not guarantee admission to any school or
            program, and we are not responsible for the accuracy of dates, requirements, or
            information about third-party schools that may be displayed in the Service. Always
            verify deadlines and requirements directly with each school.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">5. Service availability</h2>
          <p>
            We aim to keep simplecycle available and reliable, but the Service is provided on an
            &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any
            kind. We may modify, suspend, or discontinue the Service, in whole or in part, at any
            time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">6. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, simplecycle and its team will not be liable
            for any indirect, incidental, special, consequential, or punitive damages, or any
            loss of data, arising from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">7. Termination</h2>
          <p>
            You may stop using the Service and delete your account at any time. We may suspend or
            terminate your access if you violate these Terms or misuse the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">8. Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. If we make material changes, we will
            notify you by updating the &ldquo;Last updated&rdquo; date above or through other
            reasonable means. Continued use of the Service after changes take effect constitutes
            acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">9. Contact us</h2>
          <p>
            If you have questions about these Terms, contact us at{" "}
            <a href="mailto:support@simplecycle.app" className="font-medium text-slate-900 underline">
              support@simplecycle.app
            </a>
            . See also our{" "}
            <Link href="/privacy" className="font-medium text-slate-900 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
