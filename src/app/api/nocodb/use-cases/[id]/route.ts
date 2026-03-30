import { NextRequest, NextResponse } from 'next/server';
import * as noco from '@/lib/nocodb';
import { getCostComponents } from '@/lib/nocodb';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const useCase = await noco.getUseCase(id);

    // Parse KeyBenefits if it's a JSON string
    if (typeof useCase.KeyBenefits === 'string') {
      try {
        useCase.KeyBenefits = JSON.parse(useCase.KeyBenefits);
      } catch {
        // Keep as string if not valid JSON
        useCase.KeyBenefits = [];
      }
    }

    // Fetch related cost components
    const costComponentsResponse = await getCostComponents(id);
    const costComponents = costComponentsResponse.list || costComponentsResponse;

    return NextResponse.json({
      ...useCase,
      costComponents,
    });
  } catch (error) {
    console.error('Error fetching use case:', error);
    return NextResponse.json(
      { error: 'Failed to fetch use case' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Parse KeyBenefits if it's an array
    const data = {
      ...body,
      KeyBenefits: Array.isArray(body.KeyBenefits)
        ? JSON.stringify(body.KeyBenefits)
        : body.KeyBenefits,
    };

    const result = await noco.updateUseCase(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating use case:', error);
    return NextResponse.json(
      { error: 'Failed to update use case' },
      { status: 500 }
    );
  }
}

// DELETE is intentionally not implemented - records are permanent
