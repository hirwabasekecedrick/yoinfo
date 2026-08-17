import Link from 'next/link';

export default function AboutPage() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="mbreadcrumb"><Link href="/">yoInfo</Link> / About Fliiper</div>
        <h1 className="mpage-title">About yoInfo <i>Fliiper</i></h1>
        <p className="mpage-sub" style={{ fontSize: 16, fontWeight: 800, color: 'var(--green-700)', marginTop: 2 }}>
          Stay in the Loop. Instantly.
        </p>

        <div className="about-copy">
          <p>You&apos;re busy. Between meetings, deadlines, and back-to-back calls, finding time to keep up with what matters can feel impossible. Scrolling through countless news sites, job boards, tender portals, and social feeds takes time you simply don&apos;t have.</p>

          <p>What if staying informed was as effortless as flipping through your favourite short videos—but packed with information that creates real value? Quick, intuitive, and designed for people who can&apos;t afford to miss an opportunity.</p>

          <p>yoInfo <i>Fliiper</i> keeps busy professionals and corporate decision-makers informed with curated summaries on:</p>

          <ul className="about-list">
            <li>News that affects your business</li>
            <li>Deals and offers around town</li>
            <li>New tenders you can bid on</li>
            <li>Jobs worth your attention</li>
          </ul>

          <p>Available in five major languages—English, Kinyarwanda, Chinese, Arabic, and French—yoInfo <i>Fliiper</i> brings opportunities together in one seamless experience.</p>

          <p>Whether it&apos;s a tender you can win, a position you need to fill, a deal you don&apos;t want to miss, or news that shapes your next move, yoInfo <i>Fliiper</i> delivers what matters, when it matters.</p>

          <p>Simply flip through personalized updates in an easy-to-browse format inspired by the simplicity of modern social media—without the noise and distractions.</p>

          <p>yoInfo <i>Fliiper</i> isn&apos;t just another app—it&apos;s your daily briefing, designed for the pace of modern business. No noise. No fluff. Just the insights and opportunities you need to stay ahead, delivered right to your phone.</p>
        </div>

        <div className="final-cta" style={{ marginTop: 36 }}>
          <h2>Ready to flip through what matters?</h2>
          <p>Download yoInfo Fliiper and never miss an opportunity again.</p>
          <div className="final-actions">
            <Link href="/auth" className="btn-on-dark">Create Free Account</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
