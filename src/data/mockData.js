// Mock data simulating an API response for the Lead Management module.
// In production this would come from GET /api/leads and GET /api/leads/:id/activities

export const SALES_OWNERS = [
  'Aarav Mehta',
  'Priya Nair',
  'Rohan Kapoor',
  'Sneha Iyer',
  'Vikram Shah',
]

export const STATUSES = ['New', 'Contacted', 'Qualified', 'Lost']

const firstNames = [
  'Rahul', 'Ananya', 'Karan', 'Divya', 'Sameer', 'Pooja', 'Arjun', 'Neha',
  'Vivek', 'Ritika', 'Aditya', 'Tanya', 'Manish', 'Shreya', 'Nikhil', 'Isha',
  'Gaurav', 'Meera', 'Siddharth', 'Kavya', 'Rajesh', 'Anjali', 'Harsh', 'Pallavi',
  'Suresh', 'Nidhi', 'Akash', 'Swati', 'Deepak', 'Riya', 'Mohit', 'Tanvi',
  'Yash', 'Komal', 'Varun', 'Sonal', 'Abhinav', 'Preeti', 'Naveen', 'Juhi',
]

const lastNames = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Joshi', 'Gupta', 'Malhotra', 'Singh',
  'Desai', 'Kulkarni', 'Bhatt', 'Chawla', 'Pillai', 'Rao', 'Mehra', 'Bose',
  'Agarwal', 'Saxena', 'Nair', 'Kapoor',
]

const companies = [
  'Northwind Traders', 'Bluepeak Logistics', 'Orbitrix Software', 'Crestline Retail',
  'Vantage Pharma', 'Solaris Energy', 'Meridian Apparel', 'Foxglove Media',
  'Granite Build Co.', 'Aurora Finserv', 'Cobalt Robotics', 'Zenith Realty',
  'Tidewater Foods', 'Pinecrest Education', 'Harbor Freight Solutions',
  'Lumen Health', 'Sterling Auto Parts', 'Quartz Analytics', 'Maple & Co.',
  'Ridgeview Hospitality', 'Cascade Insurance', 'Ember Digital', 'Falcon Steelworks',
  'Brightside Travel', 'Verdant Agro', 'Anchor Telecom', 'Skyline Interiors',
  'Nimbus Cloud Services', 'Pioneer Textiles', 'Vortex Gaming Studios', 'Clearwater Labs',
  'Redwood Consulting', 'Apex Manufacturing', 'Horizon Media Group', 'Tundra Outdoor Gear',
  'Saffron Hospitality', 'Ironclad Security', 'Velocity Motors', 'Goldleaf Jewellers',
  'Wavelength Studios',
]

const remarksPool = [
  'Interested in enterprise plan, needs demo for team.',
  'Requested pricing breakdown for 50+ seats.',
  'Currently using a competitor, exploring migration.',
  'Budget approval pending from finance team.',
  'Asked for case studies from similar industry.',
  'Follow up after their internal review meeting.',
  '',
  '',
  'Cold lead from website form, low engagement so far.',
  'Referred by existing customer — high priority.',
  'Wants integration with their existing ERP.',
  'Decision maker is travelling, reschedule next week.',
  'Trial expired, evaluating renewal.',
  'Not a fit — too small for enterprise tier.',
  'Lost to competitor on pricing.',
]

function pick(arr, seed) {
  return arr[seed % arr.length]
}

function pad(n) {
  return n.toString().padStart(2, '0')
}

function dateOffset(daysFromToday) {
  const d = new Date()
  d.setDate(d.getDate() + daysFromToday)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function generateLeads(count = 48) {
  const leads = []
  for (let i = 0; i < count; i++) {
    const first = pick(firstNames, i * 7 + 3)
    const last = pick(lastNames, i * 13 + 5)
    const name = `${first} ${last}`
    const company = pick(companies, i * 11 + 2)
    const status = pick(STATUSES, i)
    const owner = pick(SALES_OWNERS, i * 3 + 1)
    const remarks = pick(remarksPool, i * 5 + 2)

    // Spread last activity across the past 30 days
    const lastActivityOffset = -((i * 7) % 30)
    // Spread next follow-up: some overdue (negative), some upcoming
    const followUpOffset = ((i * 5) % 21) - 6

    leads.push({
      id: `LEAD-${1000 + i}`,
      name,
      company,
      phone: `+91 ${70000 + i * 137}${(10000 + i * 91) % 90000}`.slice(0, 14),
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${company
        .toLowerCase()
        .replace(/[^a-z]/g, '')
        .slice(0, 10)}.com`,
      status,
      owner,
      lastActivityDate: dateOffset(lastActivityOffset),
      // All "Lost" leads have no follow-up; ~1 in 4 "Qualified" leads are also
      // follow-up-free (already scheduled/handed off). Everything else gets a date.
      nextFollowUpDate:
        status === 'Lost' || (status === 'Qualified' && i % 4 === 0)
          ? null
          : dateOffset(followUpOffset),
      remarks,
    })
  }
  return leads
}

export const LEADS = generateLeads(48)

// Activity timeline mock data, keyed by lead id pattern (cycled for all leads)
const activityTemplates = [
  { type: 'note', icon: 'note', title: 'Note added', body: 'Discussed requirements over call, sending proposal by EOD.' },
  { type: 'call', icon: 'call', title: 'Outbound call', body: 'Spoke for 12 minutes. Client asked about implementation timeline.' },
  { type: 'email', icon: 'email', title: 'Email sent', body: 'Sent product brochure and pricing sheet.' },
  { type: 'meeting', icon: 'meeting', title: 'Demo meeting', body: 'Walkthrough of dashboard module with 3 stakeholders on their side.' },
  { type: 'whatsapp', icon: 'whatsapp', title: 'WhatsApp message', body: 'Shared quick comparison sheet and follow-up reminder.' },
  { type: 'visit', icon: 'visit', title: 'Site visit', body: 'Visited office for in-person requirements gathering.' },
  { type: 'attachment', icon: 'attachment', title: 'Attachment uploaded', body: 'quotation_v2.pdf' },
  { type: 'status', icon: 'status', title: 'Status changed', body: 'Status updated from New to Contacted.' },
]

export function generateActivities(leadId) {
  const seed = parseInt(leadId.replace(/\D/g, ''), 10) || 0
  const count = 3 + (seed % 4)
  const activities = []
  for (let i = 0; i < count; i++) {
    const template = activityTemplates[(seed + i) % activityTemplates.length]
    activities.push({
      id: `${leadId}-act-${i}`,
      ...template,
      author: pick(SALES_OWNERS, seed + i),
      timestamp: dateOffset(-(i * 3 + (seed % 5))),
    })
  }
  return activities
}
