import { NextResponse } from 'next/server';
import { getLiveData } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const station = searchParams.get('station');
    
    const liveData = await getLiveData(station || undefined);
    return NextResponse.json(liveData);
  } catch (error) {
    console.error('Error fetching live data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live data' },
      { status: 500 }
    );
  }
}