import { NextRequest, NextResponse } from 'next/server';
import * as noco from '@/lib/nocodb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = await noco.updateCostComponent(id, body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating cost component:', error);
    return NextResponse.json(
      { error: 'Failed to update cost component' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await noco.deleteCostComponent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cost component:', error);
    return NextResponse.json(
      { error: 'Failed to delete cost component' },
      { status: 500 }
    );
  }
}
