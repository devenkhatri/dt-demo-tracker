import { NextRequest, NextResponse } from 'next/server';
import * as noco from '@/lib/nocodb';
import { DashboardStats, UseCase } from '@/lib/types';

export async function GET(_request: NextRequest) {
  try {
    // Fetch all use cases (no pagination for stats)
    const response = await noco.getUseCases(1000, 0);
    const useCases: UseCase[] = response.list || response;

    const stats: DashboardStats = {
      totalUseCases: useCases.length,
      byStatus: {
        Ready: 0,
        'In Progress': 0,
        'Not Started': 0,
      },
      byIndustry: {},
    };

    // Aggregate by status and industry
    useCases.forEach((useCase) => {
      // Count by status
      const status = useCase.DemoStatus;
      stats.byStatus[status]++;

      // Count by industry
      if (Array.isArray(useCase.Industry)) {
        useCase.Industry.forEach((industry) => {
          stats.byIndustry[industry] = (stats.byIndustry[industry] || 0) + 1;
        });
      }
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
