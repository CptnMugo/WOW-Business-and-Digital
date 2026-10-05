import React from 'react';
import { ContactSection } from './ContactSection';
import './career-explore.css';

const benefits = [
  ['More time to care', 'Reduce repeated admin, chasing and avoidable workarounds so staff can spend more time on care and service delivery.'],
  ['Better staff experience', 'Clearer processes, better handovers and systems that staff understand and can use confidently.'],
  ['Stronger CQC readiness', 'Improve consistency, evidence, governance and control in ways that can support stronger regulatory outcomes.'],
  ['Improved productivity', 'Make better use of staff time, remove duplication and give managers clearer visibility of what is happening.'],
  ['Healthier margins and more profit', 'Reduce waste, improve use of resources and create more capacity for sustainable income and growth.'],
  ['More resource to care for more people', 'Free up management time and operational capacity so the organisation can serve more people without losing control.'],
];

const helpAreas = [
  ['1', 'Make the day-to-day easier', 'Cut duplication, repeated admin and chasing. Clarify roles, actions, handovers and where information lives.', 'Less admin • fewer handover gaps • more time to care'],
  ['2', 'Get systems and staff working better', 'Improve or introduce care, workforce, Microsoft 365 or reporting systems with staff adoption built in from the start.', 'Better adoption • more staff confidence • fewer workarounds'],
  ['3', 'Deliver more with a small team', 'Put in a simple PMO or delivery structure so priorities, workstreams, risks, decisions and actions are clear and managed properly.', 'Clearer priorities • less firefighting • smarter use of resource'],
  ['4', 'Grow without losing control', 'Create clearer reporting, repeatable processes and better use of staff time so leaders can focus on clients, contracts, expansion and income.', 'Healthier margins • more profit • more resource to care for more people'],
  ['5', 'Tell us the problem — we build the solution', 'We can design a bespoke workflow, dashboard, process, system or AI-enabled tool around the problem you actually have — and help identify problems you may not yet be able to see.', 'Better fit • less waste • faster improvement • solutions built around you'],
];

const solutionExamples = [
  {
    title: 'AI-enabled tender and opportunity pipeline',
    problem: 'Opportunities are easy to miss. Tender portals, emails, deadlines and previous answers sit in different places. Bid preparation takes time and important documents or clarification questions can be forgotten.',
    solution: 'We can build a pipeline that checks agreed sources each morning, brings relevant opportunities into one place, scores them against your criteria, stores tender documents and key dates, and starts a structured response pack from your approved knowledge. It can flag gaps, suggest clarification questions and prepare drafts for human review.',
    benefits: 'Fewer missed opportunities • faster tender preparation • reusable knowledge • clearer priorities and reminders',
  },
  {
    title: 'Smart workforce and rostering support',
    problem: 'Rotas, leave, availability, agency cover, sickness, training and payroll inputs can become a daily juggling exercise. Managers spend hours filling gaps and staff receive late or inconsistent information.',
    solution: 'We can create or improve a workforce-management approach, drawing on experience of systems such as Sona, so availability, shifts, leave and staffing rules are easier to manage. AI can help surface gaps, flag overtime or capacity pressures and improve visibility before a rota is published.',
    benefits: 'Less manual rota work • earlier warning of staffing gaps • better use of available staff • better control of overtime and cost',
  },
  {
    title: 'Care system built around how your team works',
    problem: 'Off-the-shelf systems can force staff into workflows that do not match real care delivery. That creates duplicate entry, workarounds, missed information and frustration.',
    solution: 'We start with the real workflow, then configure, enhance or design the solution around it. Care records, prompts, handovers, tasks, alerts and management information can be brought together in a more intuitive way, with appropriate access, governance and safety controls.',
    benefits: 'More intuitive for staff • less duplicate entry • clearer handovers and prompts • more time available for care',
  },
  {
    title: 'AI knowledge assistant and adoption support',
    problem: 'Staff keep asking the same questions, struggle to find the right policy or process, or work around systems that were never properly embedded. Technical support becomes the default answer.',
    solution: 'We can tidy up the workflow and knowledge first, then build a simple AI assistant that draws on your approved knowledge repository and guides staff to the right existing system, process or information. We pair this with hands-on adoption support so staff know what to use, when and why.',
    benefits: 'Fewer repeated support queries • less reliance on workarounds • faster access to trusted guidance • better return on system investment',
  },
];

const experience = [
  ['Barchester Healthcare', 'Nourish eCare and eMAR — implementation, rollout, frontline adoption and change support.'],
  ['M&D Care', 'Sona Workforce Management — workforce setup, migration, reporting, training and adoption.'],
  ['South London & Maudsley NHS Foundation Trust', 'EPR / RiO — adoption and readiness methodology, change networks, digital literacy and implementation artefacts.'],
  ['Hertfordshire Community NHS Trust', 'SystmOne EPR — workflow redesign, governance and rationalising more than 100 forms to around 20.'],
  ['Barnet, Enfield & Haringey', 'CAMHS improvement and Power BI — clearer performance visibility, governance and delivery control.'],
  ['Transform Your Training', 'PMO setup — proportionate governance, integrated planning, Teams/SharePoint and reporting.'],
];

export function HealthSocialCare() {
  return (
    <div className="career-explore health-care-page">
      <div className="ce-wrap">
        <a href="?page=services">All services</a>

        <p className="ce-eyebrow">Health &amp; social care change, transformation &amp; improvement</p>
        <h1>Helping care businesses work better</h1>
        <p className="ce-lead"><strong>Better systems. Simpler ways of working. Less admin. More time to care. More room to grow.</strong></p>
        <p>
          We help health and social care organisations improve how the business works while protecting what matters most:
          safe, responsive care, confident staff and a sustainable bottom line.
        </p>

        <div className="health-focus">
          <div>
            <strong>Our current focus: growing health and social care businesses</strong>
            <span>Typically 20–100 staff</span>
          </div>
          <p>We also support new providers that want the right foundations in place from the start, and larger organisations where the need is a good fit.</p>
        </div>

        <div className="health-scale" aria-label="Experience across organisations of different sizes">
          <div><strong>5</strong><span>staff</span></div>
          <div><strong>20</strong><span>staff</span></div>
          <div><strong>100</strong><span>staff</span></div>
          <div><strong>8,000</strong><span>staff</span></div>
          <div><strong>Almost 20,000</strong><span>staff</span></div>
        </div>
        <p className="health-scale-caption">Experience from hands-on small teams to large, complex organisations — bringing strong delivery discipline without unnecessary bureaucracy.</p>

        <a className="ce-button" href="#health-enquiry">Talk to us about what is getting in the way</a>

        <section className="health-problem">
          <h2>The problem is often not the care — it is everything around it</h2>
          <p>
            As a care business grows, the owner can end up holding too much in their head. Staff work different shifts and contracts.
            Information sits in too many places. Admin is repeated. Systems do not always work together. New ideas stall because nobody has time to organise them.
          </p>
          <div className="health-three">
            <div>
              <h3>What this causes</h3>
              <p>More chasing and duplicated work, inconsistent ways of working, poor visibility, staff frustration and owners firefighting instead of leading.</p>
            </div>
            <div>
              <h3>What we change</h3>
              <p>We simplify how work moves through the business, join up systems and responsibilities, and put proportionate structure around delivery and reporting.</p>
            </div>
            <div>
              <h3>What you gain</h3>
              <p>More time to care, less admin, better staff experience, stronger control, healthier margins and more headspace to grow.</p>
            </div>
          </div>
        </section>

        <section>
          <h2>What we can help you do</h2>
          <div className="health-help-list">
            {helpAreas.map(([number, title, detail, result]) => (
              <article key={number}>
                <div className="health-number">{number}</div>
                <div>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                  <p className="health-result">{result}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="health-start">
          <h2>Starting a care business — or ready to grow?</h2>
          <p>
            Put the right foundations in early: clear roles, simple reporting, joined-up processes, workforce and digital systems,
            and a practical way to manage improvements. That gives you more control now and a stronger platform to win clients,
            add services, expand and improve profitability.
          </p>
        </section>

        <section className="ce-notice">
          <h2>Technology should fit your people — not the other way round</h2>
          <p>
            We do not start with the system. We start with your people and how the work actually happens. We look at shifts, handovers,
            workflows, workarounds and digital confidence first, then shape the technology around the real work.
          </p>
          <p><strong>This makes adoption smoother, reduces resistance and helps new ways of working stick.</strong></p>
        </section>

        <section className="health-adoption">
          <h2>Get the full benefit from new or existing systems</h2>
          <p>
            If a system has been poorly adopted, staff are relying on workarounds or technical support is taking up too much time,
            we can come in, understand what is not working and tidy it up. We simplify the workflow around it, support staff to use it confidently
            and help you realise the value of what you have already paid for.
          </p>
          <p>
            We can also build a simple AI assistant that draws on your approved knowledge repository and existing systems to help with day-to-day tasks,
            answer common questions and guide staff to the right process or information.
          </p>
          <p><strong>Safe digital use is built in:</strong> our work is informed by expert knowledge of GDPR, data protection, cybersecurity and safe use of digital systems and AI.</p>
        </section>

        <section>
          <h2>Benefits we work towards</h2>
          <div className="health-benefits">
            {benefits.map(([title, detail]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="health-capability">
          <h2>We build capability while we deliver</h2>
          <p>
            From day one, we work with your staff — not around them. Through WOW Academy, staff can learn practical project management,
            implementation and digital skills while working on real improvements, using simulated environments and hands-on learning backed by experienced support.
          </p>
          <p><strong>Your organisation owns the change. Your staff build the capability. The improvement continues after we leave.</strong></p>
        </section>

        <section>
          <h2>Examples of what we can build with you</h2>
          <p>
            These examples show how we can turn a real business challenge into a practical result. The principle is the same:
            understand how your people work, simplify the process, use technology well and leave the knowledge and ownership with your team.
          </p>
          <div className="health-solutions">
            {solutionExamples.map((example) => (
              <article key={example.title}>
                <h3>{example.title}</h3>
                <h4>The problem</h4>
                <p>{example.problem}</p>
                <h4>What we can build or improve</h4>
                <p>{example.solution}</p>
                <p className="health-result"><strong>Benefits:</strong> {example.benefits}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2>Relevant health and social care experience behind the offer</h2>
          <div className="ce-cards health-experience">
            {experience.map(([title, detail]) => (
              <section key={title}>
                <h3>{title}</h3>
                <p>{detail}</p>
              </section>
            ))}
          </div>
        </section>

        <section className="health-recognise">
          <h2>You may recognise this</h2>
          <p>
            Too much admin. The owner holding everything. Systems not being used well. Staff relying on workarounds.
            Growth creating inconsistency. Mixed staffing arrangements. A new service or contract that needs structure.
          </p>
          <p><strong>If that sounds familiar, we can start with the problem — you do not need to know the solution yet.</strong></p>
        </section>

        <div id="health-enquiry"><ContactSection initialCategory="health-social-care" /></div>
      </div>
    </div>
  );
}
