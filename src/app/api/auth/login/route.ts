import {prisma} from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { NextResponse } from 'next/server';

// Define the schema for input validation using Zod
const loginSchema = z.object({
  identifier: z.string().min(1, { message: 'Email or Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validate request body against the schema
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { identifier, password } = validation.data;

    // 2. Find the user in the database
    const user = await prisma.user.findFirst({
      where: { 
        OR: [
            { email: identifier },
            { username: identifier }
        ] },
    });

    if (!user) {
      // Use a generic error message for security
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 3. Compare the provided password with the stored hash
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

  // (Temporary) avoid logging sensitive info in production
    // 4. Create a JWT if credentials are valid
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );
    
    // 5. Create a success response and set the cookie on it
    const response = NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    );

    // Set the JWT token in a cookie
    // Ensure the cookie is HTTP-only, secure, and has a reasonable expiration time
    // Cookie to remember user login for 7 days
    const forceInsecure = process.env.FORCE_INSECURE_COOKIE === 'true';
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: !forceInsecure && process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax', // lax better for normal navigation flows
    });

    return response;

  } catch (error) {
    console.error('LOGIN_API_ERROR', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}