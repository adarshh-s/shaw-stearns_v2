// All site copy lives here so it can be edited without touching layout code.

export const CONTACT = {
  email: 'enquiries@shawstearns.com',
  office: ['Office S05-104, Trade Centre First', 'Dubai, United Arab Emirates'],
  region: 'Dubai · UAE · GCC Region',
  hours: 'Sun – Thu / 08:30 – 18:00 GST',
}

export const PILLARS = [
  { k: 'Independent', v: 'No competing interests' },
  { k: 'Client-Side', v: 'Owners and developers only' },
  { k: 'Uncompromising', v: 'Institutional standards' },
]

export const DISCIPLINES = [
  {
    id: 'pm',
    code: 'PM',
    num: '01',
    title: 'Project Management',
    short: 'End-to-end owner representation, from strategy through to handover.',
    lead: 'We act as the owner’s single point of control — setting the brief, assembling the team and holding every party to programme, budget and quality.',
    tags: ['Owner’s Representation', 'Master Programme', 'Tender Strategy', 'Handover Certainty'],
    scope: [
      'Client brief & feasibility',
      'Budget & risk definition',
      'Regulatory coordination',
      'Team selection',
      'Design integration',
      'Procurement & tender evaluation',
      'Contract administration',
      'Monitoring through handover',
    ],
  },
  {
    id: 'cm',
    code: 'CM',
    num: '02',
    title: 'Cost Management & Quantity Surveying',
    short: 'Independent commercial control and final account certainty.',
    lead: 'Commercial management and cost control — so every dirham is planned, tested and accounted for.',
    tags: ['Commercial Control', 'Cost Plans 1–3', 'Value Engineering', 'Final Account'],
    scope: [
      'Cost planning & design economics',
      'Quantification & pricing documents',
      'Value engineering',
      'Lifecycle costing',
      'Cash flow forecasting',
      'Valuations & cost reporting',
      'Change reconciliation',
      'Final account settlement',
    ],
  },
  {
    id: 'da',
    code: 'DA',
    num: '03',
    title: 'Development Advisory',
    short: 'Feasibility, financial modelling and strategy from day one.',
    lead: 'Clear, commercially robust advice at the earliest stage — where decisions cost least and protect the most capital.',
    tags: ['Feasibility Modeling', 'Development Appraisals', 'Risk Mitigation', 'Capital Strategy'],
    scope: [
      'Feasibility studies',
      'Development appraisals',
      'Financial modelling',
      'Option analysis',
      'Strategic guidance',
      'Capital protection',
    ],
  },
]

export const LIFECYCLE = [
  { t: 'Initiation', d: 'Define the brief, objectives and success criteria with the owner.' },
  { t: 'Communication', d: 'Set governance, reporting lines and decision rights for every party.' },
  { t: 'Programme', d: 'Build a realistic master programme and track it relentlessly.' },
  { t: 'Cost', d: 'Establish the budget, cost plan and commercial controls.' },
  { t: 'Design', d: 'Integrate and challenge design for value, buildability and compliance.' },
  { t: 'Procurement', d: 'Shape strategy, run tenders and evaluate bids on merit alone.' },
  { t: 'Construction', d: 'Administer contracts, monitor progress and control change.' },
  { t: 'Handover', d: 'Close out, settle the final account and hand over with certainty.' },
]

export const REASONS = [
  { t: 'Certainty', d: 'Disciplined governance from brief to final account.' },
  { t: 'Independence', d: 'No contractor, designer or supplier on our side of the table.' },
  { t: 'Regulatory clarity', d: 'Approvals and authority requirements managed early.' },
  { t: 'Senior leadership', d: 'Hands-on executive direction and senior oversight on every project.' },
]

export const SECTORS = ['Corporate Real Estate', 'Retail', 'Hospitality', 'Mixed-Use', 'Healthcare', 'Defence']

export const VALUES = [
  { t: 'Independence', d: 'Exclusive loyalty to our clients — never to the supply chain.' },
  { t: 'Rigour', d: 'Disciplined commercial control with senior oversight on every project.' },
  { t: 'Integrity', d: 'Honest, transparent advice, especially when it is unwelcome.' },
  { t: 'Excellence', d: 'The highest professional standards, raised continuously.' },
  { t: 'Progress', d: 'Building our people and practice to international standing.' },
]

export const CAREER_OFFER = [
  'Direct exposure to high-value projects',
  'Mentorship from seasoned project directors',
  'Continuous professional development',
  'International exchange as we grow',
]

// "What we protect" — the exploded slab story on the home page.
export const PROTECT = {
  label: 'What we protect',
  items: [
    {
      name: 'Capital',
      body: 'Budgets locked with precision. Cost certainty achieved at every critical stage.',
      points: [
        'Formal Cost Plans 1, 2 and 3 at Concept, Developed and Technical Design',
        'Live cost monitoring, risk allowance management and gateway reporting',
        'Final Account prepared, negotiated and certified',
      ],
      link: { label: 'Cost Management & Quantity Surveying', to: '/services?d=cm#disciplines' },
    },
    {
      name: 'Programme',
      body: 'Realistic timelines. Optimised value. Full commercial visibility for informed and confident decisions.',
      points: [
        'Master programme with key milestones agreed up front',
        'Programmes and Critical Path networks maintained throughout',
        'Proactive value engineering embedded at every gateway',
      ],
      link: { label: 'Project Management', to: '/services?d=pm#disciplines' },
    },
    {
      name: 'Reputation',
      body: 'Disciplined governance and senior oversight that eliminate overruns and disputes.',
      points: [
        'Governance structure, approval gateways and communication protocols agreed',
        'Regulatory consents and stakeholder requirements coordinated',
        'Stringent change control from tender award onwards',
      ],
      link: { label: 'Why clients choose us', to: '/about' },
    },
  ],
}

// Short tags shown on each discipline card.
export const DISCIPLINE_TAGS = {
  pm: ['Owner’s representation', 'Programme', 'Procurement', 'Handover'],
  cm: ['Commercial control', 'Cost plans', 'Valuations', 'Final account'],
  da: ['Feasibility', 'Appraisals', 'Financial modelling', 'Strategy'],
}
