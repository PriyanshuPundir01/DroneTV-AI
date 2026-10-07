export interface BotAction {
  label: string;
  actionType: 'navigate' | 'ask_question' | 'open_enquiry' | 'contact_direct';
  payload?: string;
}

export interface BotResponse {
  answer: string;
  matchedRule: string;
  suggestions?: string[];
  actions?: BotAction[];
}

export interface RuleDefinition {
  id: string;
  patterns: RegExp[];
  canonicalQuestion: string;
  answer: string;
  suggestions: string[];
  actions?: BotAction[];
}

export const PREDEFINED_RULES: RuleDefinition[] = [
  {
    id: 'services',
    patterns: [
      /what services does dronetv provide/i,
      /what services/i,
      /drone services/i,
      /what do you offer/i,
      /offerings/i
    ],
    canonicalQuestion: 'What services does DroneTV provide?',
    answer:
      `🛸 **DroneTV provides enterprise-grade aerial solutions across India:**\n\n` +
      `1. **Aerial Cinematography & Live Broadcast:** 4K/8K aerial filming, live sports streaming, and dual-operator cinema rigs.\n` +
      `2. **LiDAR & Topographical Surveying:** High-accuracy photogrammetry, GIS mapping, volumetric analysis, and digital elevation models.\n` +
      `3. **Precision Agriculture:** Multispectral crop health monitoring (NDVI), automated pesticide & fertilizer spraying.\n` +
      `4. **Industrial Infrastructure Inspection:** Thermal & ultrasonic inspection of solar farms, wind turbines, power grids, and cell towers.\n` +
      `5. **Surveillance & Emergency Operations:** Perimeter security, disaster surveillance, and search-and-rescue assistance.`,
    suggestions: [
      'I am interested in a service.',
      'How can I contact DroneTV?',
      'What courses / training are available?'
    ],
    actions: [
      { label: 'Explore Services', actionType: 'navigate', payload: '#services' },
      { label: 'Request Service Quote', actionType: 'open_enquiry', payload: 'service' }
    ]
  },
  {
    id: 'courses',
    patterns: [
      /what courses \/ training are available/i,
      /what courses/i,
      /what training/i,
      /available courses/i,
      /training programs/i,
      /pilot training/i
    ],
    canonicalQuestion: 'What courses / training are available?',
    answer:
      `🎓 **DroneTV Flight Academy offers certified drone education programs:**\n\n` +
      `• **DGCA Remote Pilot Certification (RPC):** Official Govt-recognized Remote Pilot License for Small & Medium category drones.\n` +
      `• **FPV Freestyle & Racing Drone Masterclass:** Acro flight dynamics, customized solder assembly, and low-latency digital video setups.\n` +
      `• **Aerial Cinematography Flight School:** Commercial gimbal movements, storyboarding, and director-operator coordination.\n` +
      `• **Drone Assembly, Maintenance & Avionics:** Complete hardware troubleshooting, ESC/motor calibration, and flight controller tuning.\n` +
      `• **GIS & Aerial Data Analytics:** Pix4D, DroneDeploy, and LiDAR point-cloud processing.`,
    suggestions: [
      'How can I register?',
      'I am a student.',
      'What services does DroneTV provide?'
    ],
    actions: [
      { label: 'View Course Catalog', actionType: 'navigate', payload: '#courses' },
      { label: 'Enrol in Academy', actionType: 'open_enquiry', payload: 'training' }
    ]
  },
  {
    id: 'contact',
    patterns: [
      /how can i contact dronetv/i,
      /how to contact/i,
      /contact dronetv/i,
      /phone number/i,
      /email address/i,
      /office location/i
    ],
    canonicalQuestion: 'How can I contact DroneTV?',
    answer:
      `📞 **You can connect with the DroneTV team through multiple channels:**\n\n` +
      `• **Headquarters:** DroneTV Innovation Hub, Aero Tech Park, Hyderabad / Bangalore, India\n` +
      `• **WhatsApp / Direct Call:** +91 88043 49999 | +91 63032 30227\n` +
      `• **Email Support:** support@dronetv.in | contact@ipageums.com\n` +
      `• **Operational Hours:** Monday – Saturday: 9:00 AM – 7:00 PM IST\n` +
      `• You can also submit an enquiry directly through this portal and our drone consultants will reach out within 2 business hours!`,
    suggestions: [
      'I want to speak with someone.',
      'How can I register?',
      'What services does DroneTV provide?'
    ],
    actions: [
      { label: 'Open Contact Form', actionType: 'navigate', payload: '#contact' },
      { label: 'Send Direct Enquiry', actionType: 'open_enquiry', payload: 'general' }
    ]
  },
  {
    id: 'register',
    patterns: [
      /how can i register/i,
      /how do i register/i,
      /registration process/i,
      /sign up/i,
      /enroll now/i
    ],
    canonicalQuestion: 'How can I register?',
    answer:
      `📝 **Registering for DroneTV courses or commercial onboarding is simple:**\n\n` +
      `1. **Choose your Track:** Select either a Training Course (DGCA/FPV/Cinematography) or an Enterprise Service.\n` +
      `2. **Submit Your Details:** Fill in your Name, Email, Contact Number, and interest on our Enquiry Form or directly here.\n` +
      `3. **Counselor Verification:** A DroneTV flight advisor will review your eligibility and share batch schedules / commercial rate cards.\n` +
      `4. **Seat Confirmation:** Complete verification and secure your flight slot with digital onboarding.`,
    suggestions: [
      'I am a student.',
      'What courses / training are available?',
      'How can I contact DroneTV?'
    ],
    actions: [
      { label: 'Fill Registration Form', actionType: 'open_enquiry', payload: 'student_registration' }
    ]
  },
  {
    id: 'interested_service',
    patterns: [
      /i am interested in a service/i,
      /interested in a service/i,
      /hire a drone/i,
      /book a drone/i,
      /commercial enquiry/i
    ],
    canonicalQuestion: 'I am interested in a service.',
    answer:
      `🎯 **Fantastic! We would love to assist with your aerial project.**\n\n` +
      `To tailor the ideal package for you:\n` +
      `• Tell us what domain you require: **Aerial Cinematography**, **Survey/Mapping**, **Agriculture**, or **Inspection**.\n` +
      `• Provide project location and timeline.\n\n` +
      `Would you like to fill out our quick Service Booking form right now? Our commercial operations team responds within 2-4 hours.`,
    suggestions: [
      'What services does DroneTV provide?',
      'I want to speak with someone.',
      'How can I contact DroneTV?'
    ],
    actions: [
      { label: 'Fill Service Request', actionType: 'open_enquiry', payload: 'commercial_service' }
    ]
  },
  {
    id: 'student',
    patterns: [
      /i am a student/i,
      /student discount/i,
      /student training/i,
      /college student/i,
      /for students/i
    ],
    canonicalQuestion: 'I am a student.',
    answer:
      `👨‍🎓 **Welcome future Drone Pilot! We offer dedicated benefits for students:**\n\n` +
      `• **Student Scholarships & Discounts:** Up to 20% tuition concession on DGCA RPC batches with valid college ID.\n` +
      `• **Hands-on Flight Simulator Access:** Free simulator hours before outdoor flight training.\n` +
      `• **Campus Ambassador & Internship Programs:** Opportunities to assist in live industrial field operations.\n` +
      `• **Placement Assistance:** Direct linkages with drone survey companies, film crews, and UAV startups.`,
    suggestions: [
      'What courses / training are available?',
      'How can I register?',
      'I want to speak with someone.'
    ],
    actions: [
      { label: 'Apply as Student', actionType: 'open_enquiry', payload: 'student_enquiry' }
    ]
  },
  {
    id: 'speak_someone',
    patterns: [
      /i want to speak with someone/i,
      /speak with someone/i,
      /talk to human/i,
      /speak to an agent/i,
      /representative/i,
      /call me/i
    ],
    canonicalQuestion: 'I want to speak with someone.',
    answer:
      `🤝 **Our DroneTV flight consultants are standing by to speak with you!**\n\n` +
      `• **Instant Call:** +91 88043 49999 / +91 63032 30227\n` +
      `• **Request Callback:** Drop your name and contact number below, and our lead operations engineer will ring you back promptly.\n` +
      `• **Live Email:** pindipolu@ipageums.com`,
    suggestions: [
      'How can I contact DroneTV?',
      'I am interested in a service.',
      'I am a student.'
    ],
    actions: [
      { label: 'Request Immediate Callback', actionType: 'open_enquiry', payload: 'callback_request' }
    ]
  }
];

export const FALLBACK_RESPONSE: BotResponse = {
  answer:
    `🤖 I'm not completely certain about that specific query, but as the DroneTV AI Assistant, I can help you with all aspects of our **drone services, DGCA flight courses, registration, and technical support**.\n\n` +
    `Please select one of the suggested topics below or submit an enquiry for personalized human assistance:`,
  matchedRule: 'fallback',
  suggestions: [
    'What services does DroneTV provide?',
    'What courses / training are available?',
    'How can I register?',
    'I want to speak with someone.'
  ],
  actions: [
    { label: 'Submit Direct Enquiry', actionType: 'open_enquiry', payload: 'fallback_lead' },
    { label: 'View Contact Information', actionType: 'navigate', payload: '#contact' }
  ]
};

export function processChatQuery(userQuery: string): BotResponse {
  const query = (userQuery || '').trim();

  if (!query) {
    return {
      answer: 'Hello! I am your DroneTV AI Support & Lead Assistant. How can I assist you with drone services or pilot training today?',
      matchedRule: 'greeting',
      suggestions: [
        'What services does DroneTV provide?',
        'What courses / training are available?',
        'How can I register?'
      ]
    };
  }

  // Check matching rules
  for (const rule of PREDEFINED_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(query)) {
        return {
          answer: rule.answer,
          matchedRule: rule.id,
          suggestions: rule.suggestions,
          actions: rule.actions
        };
      }
    }
  }

  // Additional fuzzy keyword checks
  const lower = query.toLowerCase();
  if (lower.includes('service') || lower.includes('shoot') || lower.includes('survey') || lower.includes('spray')) {
    const sRule = PREDEFINED_RULES.find((r) => r.id === 'services')!;
    return {
      answer: sRule.answer,
      matchedRule: sRule.id,
      suggestions: sRule.suggestions,
      actions: sRule.actions
    };
  }

  if (lower.includes('course') || lower.includes('learn') || lower.includes('dgca') || lower.includes('pilot') || lower.includes('syllabus')) {
    const cRule = PREDEFINED_RULES.find((r) => r.id === 'courses')!;
    return {
      answer: cRule.answer,
      matchedRule: cRule.id,
      suggestions: cRule.suggestions,
      actions: cRule.actions
    };
  }

  if (lower.includes('price') || lower.includes('fee') || lower.includes('cost')) {
    return {
      answer:
        `💰 **DroneTV Pricing & Fees Overview:**\n\n` +
        `• **DGCA Pilot Certification:** Starting from ₹35,000 (includes simulator + field training + DGCA exam fee).\n` +
        `• **FPV Masterclass:** ₹24,999 (includes DIY build guidance + 20 hours sim flight).\n` +
        `• **Commercial Services:** Quotations are customized based on acreage, flight hours, sensor payloads, and deliverables.\n\n` +
        `Would you like to request an official quote?`,
      matchedRule: 'pricing',
      suggestions: ['I am interested in a service.', 'I am a student.', 'How can I register?'],
      actions: [{ label: 'Get Custom Quote', actionType: 'open_enquiry', payload: 'pricing_quote' }]
    };
  }

  return FALLBACK_RESPONSE;
}
