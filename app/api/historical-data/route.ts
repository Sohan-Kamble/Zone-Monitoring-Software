import { NextResponse } from 'next/server';
import { getHistoricalData } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const station = searchParams.get('station');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (!station || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    const historicalData = await getHistoricalData(station, startDate, endDate);
    return NextResponse.json(historicalData);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical data' },
      { status: 500 }
    );
  }
}