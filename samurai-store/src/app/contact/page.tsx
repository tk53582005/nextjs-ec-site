'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  // フォームデータの状態管理
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // エラーメッセージの状態管理
  const [errorMessage, setErrorMessage] = useState('');

  // ページ遷移用
  const router = useRouter();

  // 入力値が変更されたときの処理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // フォーム送信処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // 必須項目チェック
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('すべての項目を入力してください。');
      return;
    }

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 送信成功時にトップページへ遷移
        router.push('/?submitted=1');
      } else {
        setErrorMessage('お問い合わせの送信に失敗しました。');
      }
    } catch (error) {
      setErrorMessage('エラーが発生しました。再度お試しください。');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
          ← トップページへ戻る
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">お問い合わせ</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
            氏名 <span className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">必須</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
            メールアドレス <span className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">必須</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
            お問い合わせ内容 <span className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">必須</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
}