import React from 'react';
import { ContactSection } from './ContactSection';
import './career-explore.css';
const examples = [
 ['Improve everyday operations', 'Review referral or onboarding processes, simplify handovers, clarify responsibilities and introduce action tracking.'],
 ['Introduce digital systems', 'Plan and coordinate electronic care records, eMAR, incident reporting or rostering implementation, including readiness, training coordination and adoption.'],
 ['Strengthen governance and reporting', 'Establish a proportionate PMO, introduce project dashboards, organise risk and issue management, and create clearer reporting for leaders.'],
 ['Launch or change a service', 'Coordinate mobilisation, develop delivery plans, manage dependencies and prepare teams for new ways of working.'],
 ['Deliver change across multiple sites', 'Structure pilots and phased rollouts, coordinate local leads, track readiness and support consistent implementation.'],
 ['Manage a complex transformation programme', 'Bring connected projects into an integrated plan, establish governance, coordinate suppliers and stakeholders, and track delivery and benefits.'],
];
export function HealthSocialCare() {
 return <div className="career-explore"><div className="ce-wrap">
  <a href="?page=services">All services</a>
  <p className="ce-eyebrow">Health and social care</p>
  <h1>Practical project delivery for health and social care</h1>
  <p className="ce-lead">From improving an everyday process to implementing a complex programme of change, WOW Business and Digital helps turn your organisation’s priorities into practical results.</p>
  <p>We support care providers, healthcare businesses, charities and NHS organisations with projects of different sizes—bringing structure, coordination and the capacity to move work forward.</p>
  <p>Our approach draws on founder Rennie Mudzi’s extensive experience delivering transformation across NHS and independent health and care settings.</p>
  <a className="ce-button" href="#health-enquiry">Discuss your health and social care project</a>
  <h2>What could we help you implement?</h2>
  <div className="ce-cards">{examples.map(([title, detail]) => <section key={title}><h2>{title}</h2><p>{detail}</p></section>)}</div>
  <section><h2>Support that fits the work</h2>
   <p>You may need help getting one project organised, additional delivery capacity for a few days each month, or leadership for a programme involving several services and partners.</p>
   <p>We begin by understanding your priorities, current workflows and available capacity. Together, we agree the scope, deliverables, responsibilities and level of support.</p>
   <p><strong>Clear methods, reusable tools and proportionate governance keep the focus on delivery.</strong> We simplify where possible and introduce the controls needed for more complex work, helping you make effective use of your budget and your team’s time.</p>
   <p>Where staff development is also a priority, an <a href="?page=corporate-career">employer-sponsored Career Accelerator place</a> can help an employee build capability while working towards agreed organisational deliverables.</p>
  </section>
  <div id="health-enquiry"><ContactSection initialCategory="health-social-care" /></div>
 </div></div>;
}
