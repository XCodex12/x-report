// Change this to a real email address that you check regularly.
const CONTACT_EMAIL = 'justinmabaso8@gmail.com';
const UPDATED = '6 October 2026';

export default function Privacy() {
  return (
    <>
      <section className="container page-head">
        <h1>Privacy policy</h1>
        <p className="lead">
          What X - Report collects, why we collect it, and what you can ask us to do. Last updated {UPDATED}.
        </p>
      </section>

      <section className="container">
        <div className="prose">
          <h2>Who we are</h2>
          <p>
            X - Report is an early-stage, open-source project that lets people report and track community problems
            such as potholes, water leaks and power outages. Questions about your personal information can be sent
            to <a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a>.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li><strong>Your account:</strong> your email address and a password. Passwords are handled by our login provider and stored in scrambled (hashed) form, so we cannot read them.</li>
            <li><strong>Your reports:</strong> the title, description, type, severity, the map pin you place, any area or landmark you type, and the date and time.</li>
            <li><strong>Your confirmations:</strong> which reports you have confirmed.</li>
            <li><strong>Your location, only if you choose:</strong> if you press "Use my location", your browser asks for permission first. We use the position to place your pin and keep it only if you submit the report.</li>
          </ul>

          <h2>Why we use it</h2>
          <p>
            To let you log in, to show reported problems on a map and in lists, to stop the same problem being
            reported many times, and to show how problems are progressing and being fixed. We do not sell your
            information and we do not use it for advertising.
          </p>

          <h2>What is public</h2>
          <p>
            Reports are public. Anyone can see the title, description, type, severity, pin location, area text,
            status history and confirmation counts. Please do not put names, phone numbers or other personal
            details in a report. Your email address is never shown publicly. Each report is linked to a random
            account ID rather than your email, and that ID is part of the public data but does not reveal who
            you are.
          </p>

          <h2>Who else handles your information</h2>
          <ul>
            <li><strong>Supabase</strong> runs our database and login system.</li>
            <li><strong>Netlify</strong> hosts the website.</li>
            <li><strong>OpenStreetMap</strong> supplies the map images. Your browser requests them directly, so they can see your IP address and the area of the map you are viewing.</li>
            <li><strong>Google Fonts</strong> supplies the website fonts, so Google can see your IP address when the page loads.</li>
          </ul>

          <h2>How long we keep it</h2>
          <p>We keep your account and reports until you ask us to delete them.</p>

          <h2>Your rights</h2>
          <p>
            You can ask us to show you the information we hold about you, correct it, or delete it, and you can
            object to how we use it. Email us at <a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a>. If you
            ask us to delete your account, your login details are removed and your reports stay on the map but
            are no longer linked to you. You can also ask us to remove a specific report. If you are unhappy with
            how we handle your information, you can complain to South Africa's Information Regulator.
          </p>

          <h2>Security</h2>
          <p>
            Access to the database is controlled by security rules: the public can only read reports, and only
            signed-in people can add reports or confirmations. No system is perfectly secure, so please use a
            password you do not use anywhere else.
          </p>

          <h2>Children</h2>
          <p>X - Report is not intended for people under 18.</p>

          <h2>Changes</h2>
          <p>If we change this policy we will update the date at the top of this page.</p>
        </div>
      </section>
    </>
  );
}