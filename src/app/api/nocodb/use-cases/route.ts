import { NextRequest, NextResponse } from 'next/server';
import * as noco from '@/lib/nocodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const response = await noco.getUseCases(limit, offset);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching use cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch use cases' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.Title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Parse KeyBenefits if it's an array
    const data = {
      ...body,
      KeyBenefits: Array.isArray(body.KeyBenefits)
        ? JSON.stringify(body.KeyBenefits)
        : body.KeyBenefits,
    };

    const result = await noco.createUseCase(data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating use case:', error);
    return NextResponse.json(
      { error: 'Failed to create use case' },
      { status: 500 }
    );
  }
}
