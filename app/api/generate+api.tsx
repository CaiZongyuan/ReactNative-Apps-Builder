import adminDB from '@/lib/adminDB';
import { id, User } from '@instantdb/react-native';

export async function POST(req: Request) {
  const token = req.headers.get('refreshtoken');
  if (!token) {
    return Response.json({ message: 'You must be authenticated' }, { status: 400 });
  }
  const user = await adminDB.auth.verifyToken(token);

  if (!user) {
    return Response.json({ message: 'You are not authenticated' }, { status: 401 });
  }

  try {
    const { prompt } = await req.json();
    const buildId = id();
    const friendlyTitle = prompt.initialPrompt.slice(0, 100);
    await createBuild(user, { buildId, friendlyTitle });
    return Response.json({ buildId });
  } catch (error: any) {
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

async function createBuild(
  user: User,
  {
    buildId,
    friendlyTitle,
  }: {
    buildId: string;
    friendlyTitle: string;
  }
) {}
