'use client';

import { useState } from 'react';

interface FavoriteControlsProps {
  productId: number;
  initialIsFavorite: boolean;
}

export default function FavoriteControls({
  productId,
  initialIsFavorite
}: FavoriteControlsProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteToggle = async () => {
    setIsLoading(true);

    try {
      if (isFavorite) {
        // お気に入り解除
        const response = await fetch(`/api/favorites/${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setIsFavorite(false);
        } else {
          console.error('お気に入り解除に失敗しました');
        }
      } else {
        // お気に入り追加
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product_id: productId }),
        });

        if (response.ok) {
          setIsFavorite(true);
        } else {
          console.error('お気に入り追加に失敗しました');
        }
      }
    } catch (error) {
      console.error('お気に入り操作でエラーが発生しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavoriteToggle}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md border transition-colors ${isLoading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-white text-green-800 border-gray-300 hover:bg-gray-50'
        }`}
      style={{ fontFamily: 'sans-serif' }}
    >
      {isLoading ? (
        '処理中...'
      ) : isFavorite ? (
        <>♥ お気に入り解除</>
      ) : (
        <>♡ お気に入り追加</>
      )}
    </button>
  );
}