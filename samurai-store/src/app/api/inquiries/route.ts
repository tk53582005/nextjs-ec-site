import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// データベース接続設定
const dbConfig = {
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'nextjs_samuraistore'
};

// お問い合わせ一覧を取得
export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM inquiries ORDER BY created_at DESC'
    );
    await connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('お問い合わせ一覧の取得に失敗しました:', error);
    return NextResponse.json(
      { message: 'お問い合わせ一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// お問い合わせを登録
export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'すべての項目を入力してください' },
        { status: 400 }
      );
    }
    
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO inquiries (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    await connection.end();
    
    return NextResponse.json(
      { message: 'お問い合わせを受け付けました' },
      { status: 201 }
    );
  } catch (error) {
    console.error('お問い合わせの登録に失敗しました:', error);
    return NextResponse.json(
      { message: 'お問い合わせの送信に失敗しました' },
      { status: 500 }
    );
  }
}