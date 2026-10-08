import { NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory store for tracking failed attempts
// Key: IP address, Value: { attempts: number, lockUntil: number | null }
const failedAttemptsStore = new Map<string, { attempts: number; lockUntil: number | null }>();

const MAX_ATTEMPTS = 5;

// Block durations in milliseconds
const BLOCK_DURATIONS = [
  15 * 60 * 1000, // 15 mins
  30 * 60 * 1000, // 30 mins
  120 * 60 * 1000, // 120 mins
];

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Check if IP is blocked
    const record = failedAttemptsStore.get(ip);
    if (record && record.lockUntil) {
      if (Date.now() < record.lockUntil) {
        const remainingMinutes = Math.ceil((record.lockUntil - Date.now()) / (60 * 1000));
        return NextResponse.json(
          { error: `Слишком много попыток. Пожалуйста, подождите ${remainingMinutes} мин.` },
          { status: 429 }
        );
      } else {
        // Lock expired, reset attempts? Actually we should keep the tier if we want escalating blocks,
        // but for simplicity let's just reset attempts or decrement.
        // The requirement says: 15-30-120 mins.
        // If lock is expired, we allow try again.
        // We can just keep the attempts count to know which tier to use next time it fails.
        record.lockUntil = null;
      }
    }

    const body = await request.json();
    const { password } = body;

    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json({ error: 'Админский пароль не настроен на сервере' }, { status: 500 });
    }

    if (password === correctPassword) {
      // Success: Reset attempts for this IP
      failedAttemptsStore.delete(ip);

      const response = NextResponse.json({ success: true });

      // Hash the password for the cookie to avoid storing plaintext
      const hashedCookieValue = crypto.createHash('sha256').update(correctPassword).digest('hex');

      // Set cookie
      response.cookies.set({
        name: 'admin_session',
        value: hashedCookieValue,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return response;
    } else {
      // Failed attempt
      let currentRecord = failedAttemptsStore.get(ip) || { attempts: 0, lockUntil: null };
      currentRecord.attempts += 1;

      if (currentRecord.attempts >= MAX_ATTEMPTS) {
        // Calculate which tier of block
        // First block: attempts == MAX_ATTEMPTS -> index 0 (15m)
        // Second block: attempts == MAX_ATTEMPTS + 1 -> index 1 (30m)
        // Third+ block: attempts >= MAX_ATTEMPTS + 2 -> index 2 (120m)
        const blockTier = Math.min(currentRecord.attempts - MAX_ATTEMPTS, BLOCK_DURATIONS.length - 1);
        const duration = BLOCK_DURATIONS[blockTier];
        currentRecord.lockUntil = Date.now() + duration;

        failedAttemptsStore.set(ip, currentRecord);

        const remainingMinutes = Math.ceil(duration / (60 * 1000));
        return NextResponse.json(
          { error: `Слишком много попыток. Пожалуйста, подождите ${remainingMinutes} мин.` },
          { status: 429 }
        );
      } else {
        failedAttemptsStore.set(ip, currentRecord);
        const remaining = MAX_ATTEMPTS - currentRecord.attempts;
        return NextResponse.json(
          { error: `Неверный пароль. Осталось попыток: ${remaining}` },
          { status: 401 }
        );
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
