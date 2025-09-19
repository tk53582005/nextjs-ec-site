'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

// お気に入り商品データの型定義
interface FavoriteProduct {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image_url: string | null;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set());
  const { addItem } = useCart();

  // お気に入り一覧を取得
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
          throw new Error('お気に入り一覧の取得に失敗しました');
        }
        const data = await response.json();

        // 商品詳細を取得
        const favoritesWithProducts = await Promise.all(
          data.favorites.map(async (fav: any) => {
            const productResponse = await fetch(`/api/products/${fav.product_id}`);
            if (productResponse.ok) {
              const product = await productResponse.json();
              return {
                id: fav.id,
                product_id: fav.product_id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
              };
            }
            return null;
          })
        );

        setFavorites(favoritesWithProducts.filter(Boolean));
      } catch (err) {
        setError('お気に入り一覧の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // カートに追加
  const handleAddToCart = async (product: FavoriteProduct) => {
    try {
      addItem({
        id: product.product_id.toString(),
        title: product.name,
        price: product.price,
        imageUrl: product.image_url || '',
      });

      setAddedToCart(prev => new Set(prev).add(product.product_id));
    } catch (err) {
      console.error('カートへの追加に失敗しました:', err);
    }
  };

  // お気に入り解除
  const handleRemoveFromFavorites = async (productId: number) => {
    const confirmed = window.confirm('本当にお気に入りから削除しますか？');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/favorites/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.product_id !== productId));
      } else {
        console.error('お気に入り解除に失敗しました');
      }
    } catch (err) {
      console.error('お気に入り解除でエラーが発生しました:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/account" className="text-blue-600 hover:text-blue-800 underline">
          ← マイページに戻る
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">お気に入り一覧</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-600 text-center">お気に入りに登録された商品はありません。</p>
      ) : (
        <div className="space-y-4">
          {favorites.map((favorite) => {
            const isAddedToCart = addedToCart.has(favorite.product_id);
            const imageUrl = favorite.image_url
              ? `/uploads/${favorite.image_url}`
              : '/images/no-image.jpg';

            return (
              <div key={favorite.id} className="flex items-center bg-white border border-gray-200 rounded-lg shadow-md p-4">
                <Link href={`/products/${favorite.product_id}`} className="flex-shrink-0">
                  <Image
                    src={imageUrl}
                    alt={favorite.name}
                    width={120}
                    height={120}
                    className="w-32 h-32 object-contain cursor-pointer hover:opacity-80"
                  />
                </Link>

                <div className="flex-grow ml-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {favorite.name}
                  </h3>
                  <p className="text-xl font-bold text-indigo-600 mb-4">
                    ¥{favorite.price.toLocaleString()}
                    <span className="text-gray-400">（税込）</span>
                  </p>
                </div>

                <div className="flex flex-col gap-8">
                  <button
                    onClick={() => handleAddToCart(favorite)}
                    disabled={isAddedToCart}
                    className={`py-2 px-4 rounded text-sm font-medium transition-colors ${isAddedToCart
                      ? 'bg-gray-500 text-white cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                  >
                    {isAddedToCart ? '追加済み' : 'カートに追加'}
                  </button>

                  <button
                    onClick={() => handleRemoveFromFavorites(favorite.product_id)}
                    className="py-2 px-4 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    お気に入り解除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}