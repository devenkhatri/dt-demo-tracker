import { NextRequest, NextResponse } from 'next/server';
import * as noco from '@/lib/nocodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.UseCaseId || !body.Label) {
      return NextResponse.json(
        { error: 'UseCaseId and Label are required' },
        { status: 400 }
      );
    }

    const result = await noco.createCostComponent(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating cost component:', error);
    return NextResponse.json(
      { error: 'Failed to create cost component' },
      { status: 500 }
    );
  }
}
