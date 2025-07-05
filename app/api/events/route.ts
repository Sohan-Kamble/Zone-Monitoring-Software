import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const station = searchParams.get('station');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const events = await getEvents(station || undefined, limit);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}