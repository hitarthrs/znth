// src/app/api/goals/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import our shared Prisma client

// This function handles GET requests to /api/goals
export async function GET() {
    try {
        // Use Prisma to find all goals that don't have a parent (i.e., top-level Life Goals)
        // and sort them by when they were created.
        const goals = await prisma.goal.findMany({
            where: {
                parentId: null, // This finds the top-level goals
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        return NextResponse.json(goals);
    } catch (error) {
        console.error("Failed to fetch goals:", error);
        // Return a 500 Internal Server Error response if something goes wrong
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// src/app/api/goals/route.ts

// ... (keep the import statements and the GET function from above) ...

// This function handles POST requests to /api/goals
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // We use Zod for validation later, but for now, we'll trust the input
        const { title, level, parentId } = body;

        if (!title || !level) {
            return new NextResponse('Title and level are required', { status: 400 });
        }

        const newGoal = await prisma.goal.create({
            data: {
                title,
                level,
                parentId, // This can be null for top-level goals
            },
        });

        // Return the newly created goal with a 201 Created status
        return NextResponse.json(newGoal, { status: 201 });

    } catch (error) {
        console.error("Failed to create goal:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}