import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getAuthUser, type AuthUser } from '@/lib/auth';

// 特定商品のお気に入り状態をチェック
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user: AuthUser | null = await getAuthUser();
    if (!user) {
      return NextResponse.json({ isFavorite: false });
    }

    const { id } = await params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json(
        { message: '商品IDが正しくありません。' },
        { status: 400 }
      );
    }

    // 商品IDとユーザーIDに紐づくお気に入りがあるかチェック
    const result = await executeQuery<{ count: number }>(
      'SELECT COUNT(*) as count FROM favorites WHERE product_id = ? AND user_id = ?',
      [productId, user.userId]
    );

    const isFavorite = result[0]?.count > 0;

    return NextResponse.json({ isFavorite });
  } catch (error) {
    console.error('お気に入り状態の取得に失敗しました:', error);
    return NextResponse.json(
      { message: 'お気に入り状態の取得に失敗しました。' },
      { status: 500 }
    );
  }
}

// お気に入りを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user: AuthUser | null = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: 'ログインしてください。' }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json(
        { message: '商品IDが正しくありません。' },
        { status: 400 }
      );
    }

    // 商品IDとユーザーIDに紐づくお気に入りを削除
    const result = await executeQuery(
      'DELETE FROM favorites WHERE product_id = ? AND user_id = ?',
      [productId, user.userId]
    );

    return NextResponse.json(
      { message: 'お気に入りから削除しました。' },
      { status: 200 }
    );
  } catch (error) {
    console.error('お気に入りの削除に失敗しました:', error);
    return NextResponse.json(
      { message: 'お気に入りの削除に失敗しました。' },
      { status: 500 }
    );
  }
}