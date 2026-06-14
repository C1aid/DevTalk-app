import Link from "next/link";
import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = {
  title: "Terms of Service – NoteFlow",
  description: "Terms of Service for NoteFlow collaborative note-taking platform.",
};

export default function TermsOfServicePage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="June 12, 2026">
      <p>
        <strong>AGREEMENT TO OUR LEGAL TERMS</strong>
      </p>
      <p>
        We operate the website and application known as NoteFlow (the
        &quot;Site&quot;), a collaborative note-taking platform, as well as any
        related products and services that refer or link to these legal terms
        (collectively, the &quot;Services&quot;).
      </p>
      <p>
        These Legal Terms constitute a legally binding agreement between you,
        whether personally or on behalf of an entity (&quot;you&quot;), and
        NoteFlow, concerning your access to and use of the Services. By accessing
        the Services, you agree that you have read, understood, and agreed to be
        bound by all of these Legal Terms. If you do not agree with all of these
        Legal Terms, you are prohibited from using the Services and must
        discontinue use immediately.
      </p>
      <p>
        The Services are intended for users who are at least 18 years old.
        Persons under the age of 18 are not permitted to use or register for the
        Services.
      </p>

      <h2>Table of contents</h2>
      <ol>
        <li>
          <a href="#services">Our services</a>
        </li>
        <li>
          <a href="#ip">Intellectual property rights</a>
        </li>
        <li>
          <a href="#representations">User representations</a>
        </li>
        <li>
          <a href="#registration">User registration</a>
        </li>
        <li>
          <a href="#payments">Subscriptions and payment</a>
        </li>
        <li>
          <a href="#content">Your notes and content</a>
        </li>
        <li>
          <a href="#prohibited">Prohibited activities</a>
        </li>
        <li>
          <a href="#privacy">Privacy policy</a>
        </li>
        <li>
          <a href="#termination">Term and termination</a>
        </li>
        <li>
          <a href="#disclaimer">Disclaimer</a>
        </li>
        <li>
          <a href="#liability">Limitations of liability</a>
        </li>
        <li>
          <a href="#contact">Contact us</a>
        </li>
      </ol>

      <h2 id="services">1. Our services</h2>
      <p>
        NoteFlow provides collaborative note-taking with rich text editing,
        auto-save, real-time collaboration on Premium plans, and subscription
        billing. The information provided when using the Services is not
        intended for distribution to or use by any person or entity in any
        jurisdiction where such distribution or use would be contrary to law or
        regulation.
      </p>

      <h2 id="ip">2. Intellectual property rights</h2>
      <h3>Our intellectual property</h3>
      <p>
        We are the owner or licensee of all intellectual property rights in our
        Services, including all source code, databases, functionality, software,
        website designs, text, and graphics (collectively, the
        &quot;Content&quot;), as well as the trademarks and logos contained
        therein (the &quot;Marks&quot;).
      </p>
      <p>
        Subject to your compliance with these Legal Terms, we grant you a
        non-exclusive, non-transferable, revocable license to access the Services
        for your personal or internal business use.
      </p>

      <h2 id="representations">3. User representations</h2>
      <p>By using the Services, you represent and warrant that:</p>
      <ul>
        <li>All registration information you submit is true, accurate, and complete.</li>
        <li>You will maintain the accuracy of such information.</li>
        <li>You have the legal capacity to comply with these Legal Terms.</li>
        <li>You are not a minor in the jurisdiction in which you reside.</li>
        <li>
          You will not use the Services for any illegal or unauthorized purpose.
        </li>
        <li>Your use of the Services will not violate any applicable law.</li>
      </ul>

      <h2 id="registration">4. User registration</h2>
      <p>
        You may be required to register to use the Services. You agree to keep
        your password confidential and are responsible for all use of your
        account and password. We reserve the right to remove, reclaim, or change
        a username if we determine it is inappropriate or objectionable.
      </p>

      <h2 id="payments">5. Subscriptions and payment</h2>
      <p>
        NoteFlow offers free and Premium subscription plans. Premium features
        include unlimited notes and real-time collaboration. Payments are
        processed by Stripe. By subscribing, you agree to Stripe&apos;s terms
        and authorize recurring charges according to your selected plan.
      </p>
      <p>
        You agree to provide current, complete, and accurate purchase and
        account information. We may change prices at any time with reasonable
        notice. Refunds are handled according to applicable law and our refund
        policy at the time of purchase.
      </p>

      <h2 id="content">6. Your notes and content</h2>
      <p>
        You retain ownership of the notes and content you create in NoteFlow. By
        using the Services, you grant us a limited license to host, store,
        display, and process your content solely to provide the Services,
        including real-time sync and collaboration features.
      </p>
      <p>
        You are solely responsible for your content. You represent that you have
        all necessary rights to the content you upload or create, and that your
        content does not violate any third-party rights or applicable laws.
      </p>
      <p>
        We may remove content or suspend accounts that violate these Legal Terms
        or that we reasonably believe are harmful to the Services or other users.
      </p>

      <h2 id="prohibited">7. Prohibited activities</h2>
      <p>You may not access or use the Services to:</p>
      <ul>
        <li>Upload malware, spam, or malicious code.</li>
        <li>Harass, abuse, or harm other users.</li>
        <li>Attempt unauthorized access to accounts, systems, or data.</li>
        <li>Scrape or systematically extract data without permission.</li>
        <li>Use the Services to compete with NoteFlow or for unauthorized commercial resale.</li>
        <li>Share content that is illegal, infringing, or violates others&apos; privacy.</li>
        <li>Circumvent subscription limits or security features.</li>
      </ul>

      <h2 id="privacy">8. Privacy policy</h2>
      <p>
        We care about data privacy and security. Please review our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>. By using the
        Services, you agree to be bound by our Privacy Policy, which is
        incorporated into these Legal Terms.
      </p>

      <h2 id="termination">9. Term and termination</h2>
      <p>
        These Legal Terms remain in effect while you use the Services. We may
        suspend or terminate your account at any time, with or without notice,
        for conduct that we believe violates these Legal Terms or is harmful to
        other users, us, or third parties.
      </p>
      <p>
        You may delete your account at any time by contacting us. Upon
        termination, your right to use the Services ceases immediately.
      </p>

      <h2 id="disclaimer">10. Disclaimer</h2>
      <p>
        THE SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
        AVAILABLE&quot; BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, WE
        DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT
        WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
      </p>

      <h2 id="liability">11. Limitations of liability</h2>
      <p>
        IN NO EVENT WILL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
        CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST DATA,
        OR BUSINESS INTERRUPTION, ARISING FROM YOUR USE OF THE SERVICES. OUR
        TOTAL LIABILITY FOR ANY CLAIM SHALL NOT EXCEED THE AMOUNT YOU PAID US
        IN THE SIX (6) MONTHS BEFORE THE CLAIM AROSE, OR ONE HUNDRED US DOLLARS
        ($100), WHICHEVER IS GREATER.
      </p>

      <h2 id="contact">12. Contact us</h2>
      <p>
        In order to resolve a complaint regarding the Services or to receive
        further information regarding use of the Services, please contact us at:
      </p>
      <blockquote>
        <p>
          NoteFlow
          <br />
          Email: support@noteflow.app
        </p>
      </blockquote>
    </LegalLayout>
  );
}
