import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local (Next.js convention — not auto-loaded by Node.js)
try {
  const envPath = resolve(process.cwd(), '.env.local');
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length) {
      process.env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
} catch {
  // .env.local not found — fall through to process.env
}

const BASE_URL = process.env.NOCODB_BASE_URL;
const PROJECT_ID = process.env.NOCODB_PROJECT_ID;
const API_TOKEN = process.env.NOCODB_API_TOKEN;

if (!BASE_URL || !PROJECT_ID || !API_TOKEN) {
  console.error('Missing required NocoDB environment variables');
  process.exit(1);
}

const HEADERS = {
  'Content-Type': 'application/json',
  'xc-token': API_TOKEN,
};

const SAMPLE_USE_CASES = [
  {
    Title: 'Customer Support Chatbot',
    Industry: ['Retail', 'Healthcare'],
    ProblemStatement: 'Manual customer support is costly and slow, with customers waiting hours for responses.',
    SolutionDescription: 'AI-powered chatbot that handles 80% of common inquiries automatically, escalating complex issues to human agents.',
    KeyBenefits: JSON.stringify(['Reduces support costs by 60%', 'Improves response time to <1 minute', 'Increases customer satisfaction']),
    DemoStatus: 'Ready',
    DemoUrl: 'https://support-bot-demo.example.com',
    DemoAccessInstructions: 'No login required. Click on the chat icon in the bottom right to start a conversation.',
    CostingNotes: 'Cost includes API calls and infrastructure. Estimated $5,000/month for 10,000 conversations/month.',
  },
  {
    Title: 'Document Processing Automation',
    Industry: ['Finance', 'Legal'],
    ProblemStatement: 'Processing contracts and legal documents takes weeks and requires expensive manual review.',
    SolutionDescription: 'ML model that automatically extracts key terms, identifies risks, and summarizes documents.',
    KeyBenefits: JSON.stringify(['Processes documents 10x faster', 'Reduces errors by 95%', 'Saves legal team 40 hours/week']),
    DemoStatus: 'In Progress',
    DemoUrl: '',
    DemoAccessInstructions: '',
    CostingNotes: 'Still calculating infrastructure costs. Estimated $2,000-$3,000/month.',
  },
  {
    Title: 'Predictive Maintenance',
    Industry: ['Manufacturing'],
    ProblemStatement: 'Equipment downtime costs $50K per hour and is difficult to predict.',
    SolutionDescription: 'AI analyzes sensor data to predict equipment failures before they occur.',
    KeyBenefits: JSON.stringify(['Prevents costly downtime', 'Extends equipment lifespan by 30%', 'Improves safety']),
    DemoStatus: 'Not Started',
    DemoUrl: '',
    DemoAccessInstructions: '',
    CostingNotes: 'Requires IoT infrastructure and data pipeline setup.',
  },
  {
    Title: 'Personalized Product Recommendations',
    Industry: ['Retail', 'Education'],
    ProblemStatement: 'Generic product recommendations result in low conversion rates and missed upsell opportunities.',
    SolutionDescription: 'Neural collaborative filtering model that recommends products based on user behavior and preferences.',
    KeyBenefits: JSON.stringify(['Increases average order value by 25%', 'Improves user engagement', 'Real-time personalization']),
    DemoStatus: 'Ready',
    DemoUrl: 'https://recommendations-demo.example.com',
    DemoAccessInstructions: 'Browse the product catalog. Recommendations appear based on your viewing history.',
    CostingNotes: 'Model inference and data storage. Approximately $3,000/month at scale.',
  },
  {
    Title: 'Resume Screening for HR',
    Industry: ['HR'],
    ProblemStatement: 'Recruiting teams spend 100+ hours per role reviewing unsuitable applications.',
    SolutionDescription: 'NLP model that automatically screens resumes against job requirements and ranks candidates.',
    KeyBenefits: JSON.stringify(['Reduces screening time by 80%', 'Improves candidate quality', 'Reduces hiring bias']),
    DemoStatus: 'In Progress',
    DemoUrl: '',
    DemoAccessInstructions: '',
    CostingNotes: 'Pricing TBD. Considering subscription model.',
  },
];

async function seedData() {
  console.log('Starting NocoDB data seed...\n');

  try {
    for (const useCase of SAMPLE_USE_CASES) {
      const url = `${BASE_URL}/api/v1/db/data/noco/${PROJECT_ID}/UseCases`;

      const response = await fetch(url, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(useCase),
      });

      if (response.ok) {
        console.log(`✓ Created: ${useCase.Title}`);
      } else {
        const error = await response.text();
        console.error(`✗ Failed to create "${useCase.Title}": ${error}`);
      }
    }

    console.log('\n✓ Seed data loaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
