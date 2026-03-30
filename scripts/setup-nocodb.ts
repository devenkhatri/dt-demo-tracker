import fetch from 'node-fetch';

const BASE_URL = process.env.NOCODB_BASE_URL;
const PROJECT_ID = process.env.NOCODB_PROJECT_ID;
const API_TOKEN = process.env.NOCODB_API_TOKEN;

if (!BASE_URL || !PROJECT_ID || !API_TOKEN) {
  console.error('Missing required NocoDB environment variables');
  process.exit(1);
}

const HEADERS = {
  'Content-Type': 'application/json',
  'xc-auth': API_TOKEN,
};

interface FieldDefinition {
  title: string;
  column_name?: string;
  uidt: string;
  colOptions?: any;
  [key: string]: any;
}

interface TableDefinition {
  title: string;
  table_name: string;
  columns: FieldDefinition[];
}

const TABLE_USE_CASES: TableDefinition = {
  title: 'UseCases',
  table_name: 'UseCases',
  columns: [
    { title: 'Id', column_name: 'id', uidt: 'AutoNumber', pk: true },
    { title: 'Title', uidt: 'SingleLineText', ct: 'varchar', nn: true },
    {
      title: 'Industry',
      uidt: 'MultiSelect',
      colOptions: {
        options: [
          { title: 'Finance', color: 'blue' },
          { title: 'HR', color: 'cyan' },
          { title: 'Retail', color: 'green' },
          { title: 'Healthcare', color: 'red' },
          { title: 'Legal', color: 'purple' },
          { title: 'Manufacturing', color: 'orange' },
          { title: 'Education', color: 'yellow' },
          { title: 'Real Estate', color: 'pink' },
          { title: 'Insurance', color: 'brown' },
          { title: 'Other', color: 'gray' },
        ],
      },
    },
    { title: 'ProblemStatement', uidt: 'LongText', ct: 'text' },
    { title: 'SolutionDescription', uidt: 'LongText', ct: 'text' },
    { title: 'KeyBenefits', uidt: 'LongText', ct: 'text' },
    {
      title: 'DemoStatus',
      uidt: 'SingleSelect',
      colOptions: {
        options: [
          { title: 'Ready', color: 'green' },
          { title: 'In Progress', color: 'blue' },
          { title: 'Not Started', color: 'gray' },
        ],
      },
    },
    { title: 'DemoUrl', uidt: 'Url' },
    { title: 'DemoAccessInstructions', uidt: 'LongText', ct: 'text' },
    { title: 'CostingNotes', uidt: 'LongText', ct: 'text' },
    { title: 'CreatedAt', uidt: 'DateTime', dt: 'datetime', cdf: 'now' },
    { title: 'UpdatedAt', uidt: 'DateTime', dt: 'datetime', cdf: 'now' },
  ],
};

const TABLE_COST_COMPONENTS: TableDefinition = {
  title: 'CostComponents',
  table_name: 'CostComponents',
  columns: [
    { title: 'Id', column_name: 'id', uidt: 'AutoNumber', pk: true },
    { title: 'UseCaseId', uidt: 'Number' },
    { title: 'Label', uidt: 'SingleLineText', ct: 'varchar', nn: true },
    { title: 'UnitCost', uidt: 'Decimal', ct: 'decimal' },
    { title: 'Quantity', uidt: 'Decimal', ct: 'decimal' },
    { title: 'Unit', uidt: 'SingleLineText', ct: 'varchar' },
    {
      title: 'Frequency',
      uidt: 'SingleSelect',
      colOptions: {
        options: [
          { title: 'One-time', color: 'green' },
          { title: 'Monthly', color: 'blue' },
          { title: 'Annual', color: 'orange' },
          { title: 'Per Run', color: 'purple' },
        ],
      },
    },
    { title: 'Notes', uidt: 'LongText', ct: 'text' },
    { title: 'CreatedAt', uidt: 'DateTime', dt: 'datetime', cdf: 'now' },
    { title: 'UpdatedAt', uidt: 'DateTime', dt: 'datetime', cdf: 'now' },
  ],
};

async function createTable(tableDef: TableDefinition) {
  const url = `${BASE_URL}/api/v1/db/meta/projects/${PROJECT_ID}/tables`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        title: tableDef.title,
        table_name: tableDef.table_name,
        columns: tableDef.columns,
      }),
    });

    if (response.status === 200 || response.status === 201) {
      console.log(`✓ Table "${tableDef.title}" created successfully`);
      return true;
    } else if (response.status === 400) {
      const error = await response.text();
      if (error.includes('already exists')) {
        console.log(`✓ Table "${tableDef.title}" already exists (skipped)`);
        return true;
      }
      throw new Error(`Failed to create table: ${error}`);
    } else {
      const error = await response.text();
      throw new Error(`Failed to create table: ${response.status} - ${error}`);
    }
  } catch (error) {
    console.error(`✗ Error creating table "${tableDef.title}":`, error);
    return false;
  }
}

async function setupNocoDB() {
  console.log('Starting NocoDB table setup...\n');

  const useCasesSuccess = await createTable(TABLE_USE_CASES);
  const costComponentsSuccess = await createTable(TABLE_COST_COMPONENTS);

  if (useCasesSuccess && costComponentsSuccess) {
    console.log('\n✓ NocoDB setup completed successfully!');
    process.exit(0);
  } else {
    console.log('\n✗ NocoDB setup encountered errors');
    process.exit(1);
  }
}

setupNocoDB();
