// All site copy lives here so it can be edited without touching layout code.

export const CONTACT = {
  email: 'contact@albemarlegrey.com',
  office: ['Office S05-104, Trade Centre First', 'Dubai, United Arab Emirates'],
}

// Footer company details. Placeholders stay hidden or inactive until confirmed.
export const COMPANY = {
  name: 'Albemarle Grey',
  tagline: 'Project & Cost Management · Development Advisory',
  // TODO: replace with the registered legal entity name and licence / registration number.
  legal: 'Albemarle Grey — legal entity and registration details to be confirmed.',
  // TODO: add the LinkedIn company page URL; the link stays inactive while empty.
  linkedin: '',
  // Reserved for the RICS regulatory statement. Set active once registration is confirmed.
  rics: { active: false, text: 'Regulated by RICS' },
}

// Login placeholders. Each link goes live once its url is set.
export const PORTALS = [
  { label: 'Client portal', url: '' },
  { label: 'Staff portal', url: '' },
  { label: 'Alumni network', url: '' },
]

// Home page service summaries, in the order DA → PM → CM/QS.
export const DISCIPLINES = [
  {
    id: 'da',
    title: 'Development Advisory',
    tab: 'Development Advisory',
    tags: ['Feasibility', 'Appraisals', 'Financial modelling', 'Strategy'],
    short: 'Assessing development viability through appraisals, cash-flow modelling and analysis of funding, risk and returns to inform your investment decisions.',
    to: '/services#advisory',
  },
  {
    id: 'pm',
    title: 'Project Management',
    tab: 'Project Management',
    tags: ['Client representation', 'Programme', 'Procurement', 'Delivery'],
    short: 'Representing your interests from brief to handover, coordinating design, procurement and delivery, with oversight of programme, cost, quality and risk.',
    to: '/services?d=pm#delivery',
  },
  {
    id: 'cm',
    title: 'Cost Management & Quantity Surveying',
    tab: 'Cost Management & QS',
    tags: ['Cost planning', 'Procurement', 'Financial control', 'Final account'],
    short: 'Independent cost advice from initial estimates to final account, covering cost planning, measurement, tender evaluation and financial control.',
    to: '/services?d=cm#delivery',
  },
]

// Services — Development Advisory framework.
export const ADVISORY = {
  considerations: [
    { t: 'Viability', s: 'Development potential' },
    { t: 'Financial Returns', s: 'Cash flow · Investment value' },
    { t: 'Risk & Strategy', s: 'Funding · Exposure · Options' },
  ],
  stages: [
    {
      t: 'Feasibility',
      s: 'Development potential',
      title: 'Feasibility & Options',
      d: 'Assess development potential and compare alternative uses, development scenarios and strategic options.',
      activities: [
        'Review development objectives and opportunities',
        'Compare potential uses and development options',
        'Identify key viability assumptions and constraints',
      ],
      outcome: 'Initial assessment of development options and viability.',
    },
    {
      t: 'Appraisals',
      s: 'Costs · Cash flow · Returns',
      title: 'Appraisals & Financial Modelling',
      d: 'Evaluate development costs, cash flow and projected investment returns using financial appraisals and scenario analysis.',
      activities: [
        'Prepare development appraisals and cash-flow models',
        'Assess projected costs, revenues and investment returns',
        'Test financial assumptions and alternative scenarios',
      ],
      outcome: 'Financial appraisal to inform investment decisions.',
    },
    {
      t: 'Funding & Risk',
      s: 'Capital · Finance · Exposure',
      title: 'Funding & Risk Analysis',
      d: 'Assess funding requirements, potential financing structures and the sensitivity of investment outcomes to key risks.',
      activities: [
        'Assess funding requirements and sources of finance',
        'Evaluate debt and equity assumptions',
        'Test sensitivities and financial risks',
      ],
      outcome: 'Understanding of funding requirements and investment risk.',
    },
    {
      t: 'Strategy',
      s: 'Acquisition · Hold · Exit',
      title: 'Development & Exit Strategy',
      d: 'Evaluate acquisition, phasing, repositioning, holding and disposal options against development and investment objectives.',
      activities: [
        'Review development and investment strategies',
        'Compare hold, sale and repositioning scenarios',
        'Consider phasing and exit options',
      ],
      outcome: 'Recommended strategic options for the client’s consideration.',
    },
  ],
}

// Services — Project Delivery (PM and CM/QS) framework.
export const DELIVERY = {
  services: [
    {
      id: 'pm',
      label: 'Project Management',
      kicker: 'Project Management',
      title: 'Project Management',
      d: 'We represent the client from brief to handover, coordinating project planning, design and procurement, and overseeing delivery. Programmes, risk registers and progress reports provide a clear basis for informed decisions.',
    },
    {
      id: 'cm',
      label: 'Cost Management & QS',
      kicker: 'Cost Management',
      title: 'Cost Management & Quantity Surveying',
      d: 'We provide independent cost advice and commercial management, from initial estimates and cost planning through to tender evaluation, payment and variation assessments, and final accounts.',
    },
  ],
  pillars: [
    { t: 'Governance', s: 'Roles · Decisions · Reporting' },
    { t: 'Risk & Control', s: 'Identification · Mitigation · Change' },
    { t: 'Performance', s: 'Programme · Cost · Quality' },
  ],
  phases: ['Initiation', 'Pre-construction', 'Procurement', 'Construction', 'Close-out'],
  stages: [
    {
      t: 'Brief',
      tag: 'Initiation',
      phase: 0,
      pm: 'Define the client’s brief, project objectives, governance arrangements and initial delivery strategy.',
      cm: 'Prepare preliminary cost estimates, establish budget allowances and identify principal cost risks.',
    },
    {
      t: 'Cost & Programme',
      tag: 'Planning',
      phase: 1,
      pm: 'Develop the master programme, coordinate key milestones and establish risk management and reporting arrangements.',
      cm: 'Prepare elemental cost plans, benchmark construction costs and forecast expenditure against the programme.',
    },
    {
      t: 'Design',
      tag: 'Coordination',
      phase: 1,
      pm: 'Coordinate design information, consultant responsibilities, stakeholder decisions and required approvals.',
      cm: 'Evaluate design options, update cost plans and advise on value engineering and lifecycle costs.',
    },
    {
      t: 'Tender',
      tag: 'Procurement',
      phase: 2,
      pm: 'Advise on procurement strategies, coordinate tendering and support contractor evaluation and appointment.',
      cm: 'Prepare pricing documents, analyse commercial tenders and advise on contractual recommendations.',
    },
    {
      t: 'Site',
      tag: 'Construction',
      phase: 3,
      pm: 'Monitor construction progress, coordinate project decisions and administer contractual procedures where appointed.',
      cm: 'Assess interim payments and variations, monitor expenditure and report forecast final costs and cash flow.',
    },
    {
      t: 'Handover',
      tag: 'Close-out',
      phase: 4,
      pm: 'Coordinate practical completion, handover documentation, outstanding works and agreed close-out activities.',
      cm: 'Reconcile project costs, assess outstanding commercial matters and support final account agreement.',
    },
  ],
}

// Careers page.
export const CAREERS = {
  intro:
    'Albemarle Grey is an independent consultancy providing project management, cost management and development advisory for owners and developers. We combine professional expertise with commercial judgement to support informed decisions from initial feasibility through to completion.',
  mission: 'To advance our clients’ development ambitions through independent advice, commercial insight and disciplined project delivery.',
  vision: 'To build a globally respected practice, recognised for the quality of our advice, the capability of our people and the standards of our delivery.',
  defines: [
    {
      t: 'Professional Standards',
      d: 'We uphold professional integrity, independence and accountability in our advice, relationships and delivery.',
    },
    {
      t: 'People & Development',
      d: 'We are building a practice where professional development, responsibility and opportunities for career progression are central to our culture.',
    },
    {
      t: 'Responsible Business',
      d: 'We are committed to ethical business practices, environmental responsibility and making a positive contribution to the communities in which we operate.',
    },
  ],
  values: [
    { t: 'Independence', d: 'We exercise objective judgement and manage conflicts of interest transparently.' },
    { t: 'Integrity', d: 'We give honest advice, honour our commitments and take responsibility for our work.' },
    { t: 'Excellence', d: 'We apply professional expertise, careful analysis and attention to detail.' },
    { t: 'Progress', d: 'We develop our people and adopt technology that improves how we analyse, collaborate and deliver.' },
  ],
  join: 'We welcome enquiries from experienced professionals and graduates seeking to develop their careers in project management, quantity surveying and development advisory.',
  grow: [
    'Our ambition is global, and we want our people to grow with us. We are building a practice where professional development, responsibility and exposure to different markets form part of a rewarding career.',
    'We welcome people with curiosity, sound judgement and the ambition to help shape the practice.',
  ],
  alumni:
    'People who build their careers with us remain part of the practice. Our alumni network will keep former colleagues connected to one another, to our people and to the opportunities ahead.',
}
