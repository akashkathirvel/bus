import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { selected } = await params;
    
    // Construct the path to the JSON file
    const jsonPath = path.join(process.cwd(), 'src', 'app', 'data', `${selected}.json`);
    
    // Check if the file exists
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json(
        { error: 'Bus schedule data not found' },
        { status: 404 }
      );
    }
    
    // Read and parse the JSON file
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const schedules = JSON.parse(jsonData);
    
    // Return the bus schedules
    return NextResponse.json(schedules);
    
  } catch (error) {
    console.error('Error reading bus schedule data:', error);
    return NextResponse.json(
      { error: 'Failed to load bus schedule data' },
      { status: 500 }
    );
  }
}
