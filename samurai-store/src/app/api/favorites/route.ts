import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getAuthUser, type AuthUser } from '@/lib/auth';

// お気に入りデータの型定義
export interface FavoriteData {
  id: number;
  product_id: number;
  user_id: number;
  created_at: string;
}

// ログインユーザーのお気に入り一覧を取得
export async function GET() {
  try {
    const user: AuthUser | null = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: 'ログインしてください。' }, { status: 401 });
    }

    // ユーザーIDに紐づくお気に入りデータを取得
    const favorites = await executeQuery<FavoriteData>(
      'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
      [user.userId]
    );

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('お気に入り一覧の取得に失敗しました:', error);
    return NextResponse.json(
      { message: 'お気に入り一覧の取得に失敗しました。' },
      { status: 500 }
    );
  }
}

// お気に入りを登録
export async function POST(request: NextRequest) {
  try {
    const user: AuthUser | null = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: 'ログインしてください。' }, { status: 401 });
    }

    const { product_id } = await request.json();

    // 商品IDのバリデーション
    if (!product_id || typeof product_id !== 'number') {
      return NextResponse.json(
        { message: '商品IDが正しくありません。' },
        { status: 400 }
      );
    }

    // 重複登録をスキップ
    await executeQuery(
      'INSERT IGNORE INTO favorites (product_id, user_id) VALUES (?, ?)',
      [product_id, user.userId]
    );

    return NextResponse.json(
      { message: 'お気に入りに追加しました。' },
      { status: 201 }
    );
  } catch (error) {
    console.error('お気に入りの登録に失敗しました:', error);
    return NextResponse.json(
      { message: 'お気に入りの登録に失敗しました。' },
      { status: 500 }
    );
  }
}