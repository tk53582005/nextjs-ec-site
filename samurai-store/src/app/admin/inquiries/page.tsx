'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// お問い合わせデータの型定義
type Inquiry = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // コンポーネント表示時にお問い合わせ一覧を取得
  useEffect(() => {
    fetch('/api/inquiries')
      .then(res => {
        if (!res.ok) {
          throw new Error('お問い合わせ一覧の取得に失敗しました');
        }
        return res.json();
      })
      .then(data => {
        setInquiries(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

// 日時変換
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">エラー: {error}</p>
        <Link href="/admin/products" className="text-blue-600 hover:text-blue-800 underline">
          ← 商品一覧ページに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/products" className="text-blue-600 hover:text-blue-800 underline">
          ← 商品一覧ページに戻る
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">お問い合わせ一覧</h1>

      {inquiries.length === 0 ? (
        <p className="text-gray-600">お問い合わせはありません。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">氏名</th>
                <th className="border border-gray-300 px-4 py-2 text-left">メールアドレス</th>
                <th className="border border-gray-300 px-4 py-2 text-left">お問い合わせ内容</th>
                <th className="border border-gray-300 px-4 py-2 text-left">送信日時</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inquiry => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{inquiry.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{inquiry.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{inquiry.email}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="max-w-xs truncate" title={inquiry.message}>
                      {inquiry.message}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatDate(inquiry.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}