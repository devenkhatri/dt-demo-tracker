// NocoDB server-side fetch client
// All credentials are kept server-side; browser never sees them

const BASE_URL = process.env.NOCODB_BASE_URL;
const PROJECT_ID = process.env.NOCODB_PROJECT_ID;
const API_TOKEN = process.env.NOCODB_API_TOKEN;
const TABLE_USE_CASES = process.env.NOCODB_TABLE_USE_CASES || 'UseCases';
const TABLE_COST_COMPONENTS = process.env.NOCODB_TABLE_COST_COMPONENTS || 'CostComponents';

if (!BASE_URL || !PROJECT_ID || !API_TOKEN) {
  throw new Error('Missing required NocoDB environment variables');
}

const HEADERS = {
  'Content-Type': 'application/json',
  'xc-auth': API_TOKEN,
};

async function nocofetch(
  endpoint: string,
  options: RequestInit = {},
  revalidate = 0
) {
  const url = `${BASE_URL}/api/v1/db/data/noco/${PROJECT_ID}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...HEADERS,
      ...options.headers,
    },
    next: { revalidate },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`NocoDB API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data;
}

// Use Cases endpoints
export async function getUseCases(limit = 100, offset = 0) {
  return nocofetch(
    `/${TABLE_USE_CASES}?limit=${limit}&offset=${offset}&sort=-CreatedAt`,
    {},
    0
  );
}

export async function getUseCase(id: string | number) {
  return nocofetch(`/${TABLE_USE_CASES}/${id}`, {}, 0);
}

export async function createUseCase(data: any) {
  return nocofetch(`/${TABLE_USE_CASES}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUseCase(id: string | number, data: any) {
  return nocofetch(`/${TABLE_USE_CASES}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteUseCase(id: string | number) {
  return nocofetch(`/${TABLE_USE_CASES}/${id}`, {
    method: 'DELETE',
  });
}

// Cost Components endpoints
export async function getCostComponents(useCaseId: string | number) {
  return nocofetch(
    `/${TABLE_COST_COMPONENTS}?where=(UseCaseId,eq,${useCaseId})&sort=-CreatedAt`,
    {},
    0
  );
}

export async function createCostComponent(data: any) {
  return nocofetch(`/${TABLE_COST_COMPONENTS}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCostComponent(id: string | number, data: any) {
  return nocofetch(`/${TABLE_COST_COMPONENTS}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteCostComponent(id: string | number) {
  return nocofetch(`/${TABLE_COST_COMPONENTS}/${id}`, {
    method: 'DELETE',
  });
}

// Export table names for reference
export { TABLE_USE_CASES, TABLE_COST_COMPONENTS };
