import Link from "next/link";
import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = {
  title: "Privacy Policy – DevTalk",
  description: "Privacy Policy for DevTalk collaborative team chat platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="June 12, 2026">
      <p>
        This Privacy Notice for DevTalk (&quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;) describes how and why we might access, collect, store,
        use, and/or share (&quot;process&quot;) your personal information when
        you use our services (&quot;Services&quot;), including when you:
      </p>
      <ul>
        <li>Visit our website or use the DevTalk application</li>
        <li>
          Create an account, join channels, send messages, or subscribe to Pro
        </li>
        <li>Contact us for support or marketing communications</li>
      </ul>
      <p>
        <strong>Questions or concerns?</strong> Reading this Privacy Notice will
        help you understand your privacy rights and choices. If you do not agree
        with our policies and practices, please do not use our Services.
      </p>

      <h2>Summary of key points</h2>
      <ul>
        <li>
          <strong>What personal information do we process?</strong> Account
          details, messages and channel content you create, usage data, and payment information
          processed by Stripe.
        </li>
        <li>
          <strong>Do we process sensitive personal information?</strong> We do
          not intentionally process sensitive personal information.
        </li>
        <li>
          <strong>How do we process your information?</strong> To provide,
          improve, and administer our Services, communicate with you, and comply
          with law.
        </li>
        <li>
          <strong>How do we keep your information safe?</strong> We use
          technical and organizational safeguards, but no system is 100% secure.
        </li>
        <li>
          <strong>What are your rights?</strong> Depending on your location, you
          may have rights to access, correct, or delete your personal
          information.
        </li>
      </ul>

      <h2>Table of contents</h2>
      <ol>
        <li>
          <a href="#collect">What information do we collect?</a>
        </li>
        <li>
          <a href="#process">How do we process your information?</a>
        </li>
        <li>
          <a href="#share">When and with whom do we share personal information?</a>
        </li>
        <li>
          <a href="#social">How do we handle social logins?</a>
        </li>
        <li>
          <a href="#retention">How long do we keep your information?</a>
        </li>
        <li>
          <a href="#security">How do we keep your information safe?</a>
        </li>
        <li>
          <a href="#minors">Do we collect information from minors?</a>
        </li>
        <li>
          <a href="#rights">What are your privacy rights?</a>
        </li>
        <li>
          <a href="#updates">Do we make updates to this notice?</a>
        </li>
        <li>
          <a href="#contact">How can you contact us?</a>
        </li>
      </ol>

      <h2 id="collect">1. What information do we collect?</h2>
      <h3>Personal information you provide</h3>
      <p>
        We collect personal information that you voluntarily provide when you
        register, use the Services, or contact us. This may include:
      </p>
      <ul>
        <li>Name and email address</li>
        <li>Account credentials</li>
        <li>Messages and channel content you create</li>
        <li>Channel membership and visibility preferences</li>
        <li>Support messages and feedback</li>
      </ul>
      <p>
        <strong>Payment data.</strong> If you purchase Pro, payment
        information is collected and processed by Stripe. We do not store full
        payment card details on our servers. See{" "}
        <a
          href="https://stripe.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Stripe&apos;s Privacy Policy
        </a>
        .
      </p>
      <p>
        <strong>Social login data.</strong> If you register using Google or
        GitHub, we receive profile information such as your name and email
        address from the provider, as described in the social logins section
        below.
      </p>

      <h3>Information automatically collected</h3>
      <p>
        We automatically collect certain technical information when you visit or
        use the Services, such as IP address, browser type, device information,
        pages viewed, and usage patterns. This helps us maintain security and
        improve the Services.
      </p>

      <h2 id="process">2. How do we process your information?</h2>
      <p>We process your information to:</p>
      <ul>
        <li>Create and manage your account</li>
        <li>Store, sync, and display your messages and channels</li>
        <li>Enable real-time messaging on Pro plans</li>
        <li>Process subscriptions and payments via Stripe</li>
        <li>Send service-related communications</li>
        <li>Respond to support requests</li>
        <li>Monitor and prevent fraud or abuse</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2 id="share">3. When and with whom do we share personal information?</h2>
      <p>We may share your information with service providers who help us operate the Services, including:</p>
      <ul>
        <li>
          <strong>Supabase</strong> — authentication, database, and real-time
          sync
        </li>
        <li>
          <strong>Stripe</strong> — payment processing
        </li>
        <li>
          <strong>Vercel</strong> — application hosting
        </li>
      </ul>
      <p>
        These providers process data on our behalf under contractual obligations
        to protect your information. We may also share information if required by
        law, to protect rights and safety, or in connection with a business
        transfer such as a merger or acquisition.
      </p>
      <p>
        When you join channels or send messages, the content you post is visible
        to other members of those channels according to channel visibility settings.
      </p>

      <h2 id="social">4. How do we handle social logins?</h2>
      <p>
        Our Services offer the ability to register and log in using third-party
        accounts such as Google or GitHub. If you choose to do this, we receive
        certain profile information from your social media provider, typically
        including your name and email address.
      </p>
      <p>
        We use this information only for the purposes described in this Privacy
        Notice. We recommend reviewing the privacy policy of your social login
        provider to understand how they handle your data.
      </p>

      <h2 id="retention">5. How long do we keep your information?</h2>
      <p>
        We keep your personal information for as long as necessary to provide the
        Services or as required by law.
      </p>
      <ul>
        <li>
          <strong>Account data:</strong> retained while your account is active
        </li>
        <li>
          <strong>Messages and content:</strong> retained until you delete them or
          close your account
        </li>
        <li>
          <strong>Payment records:</strong> retained as required for accounting
          and tax purposes
        </li>
      </ul>
      <p>
        When we no longer need your information, we will delete or anonymize it.
        If immediate deletion is not possible (for example, in backup archives),
        we will securely store it and isolate it from further processing.
      </p>

      <h2 id="security">6. How do we keep your information safe?</h2>
      <p>
        We implement appropriate technical and organizational security measures,
        including:
      </p>
      <ul>
        <li>Encryption in transit (HTTPS/TLS)</li>
        <li>Row-level security on user data in our database</li>
        <li>Access controls and authentication via Supabase Auth</li>
        <li>Secure payment handling through Stripe</li>
      </ul>
      <p>
        However, no method of transmission over the Internet or electronic
        storage is 100% secure. You use the Services at your own risk and should
        access them in a secure environment.
      </p>

      <h2 id="minors">7. Do we collect information from minors?</h2>
      <p>
        We do not knowingly collect data from or market to children under 18
        years of age. By using the Services, you confirm that you are at least 18
        years old. If we learn that we have collected personal data from someone
        under 18, we will deactivate the account and delete the data as soon as
        reasonably possible.
      </p>

      <h2 id="rights">8. What are your privacy rights?</h2>
      <p>
        Depending on your location, you may have the right to request access to,
        correction of, or deletion of your personal information. You may also
        have the right to withdraw consent, object to certain processing, or
        request data portability.
      </p>
      <p>
        To exercise your rights, contact us at support@devtalk.app. We will
        respond in accordance with applicable data protection laws.
      </p>
      <p>
        You can update account information from your settings page. To delete
        your account and associated data, contact us at support@devtalk.app.
      </p>

      <h2 id="updates">9. Do we make updates to this notice?</h2>
      <p>
        We may update this Privacy Notice from time to time. The updated version
        will be indicated by an updated &quot;Last updated&quot; date. If we make
        material changes, we may notify you by posting a notice on the Services
        or sending you an email. We encourage you to review this notice
        frequently.
      </p>

      <h2 id="contact">10. How can you contact us?</h2>
      <p>
        If you have questions about this Privacy Notice, please contact us at:
      </p>
      <blockquote>
        <p>
          DevTalk
          <br />
          Email: support@devtalk.app
        </p>
      </blockquote>
      <p>
        This privacy policy is incorporated into our{" "}
        <Link href="/terms-of-service">Terms of Service</Link>. By using our
        Services, you acknowledge that you have read and understood this Privacy
        Policy.
      </p>
    </LegalLayout>
  );
}
