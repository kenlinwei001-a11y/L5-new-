import React from 'react';
import { Layers } from 'lucide-react';

export default function PlaceholderView({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500 p-8 h-full">
      <Layers className="w-16 h-16 mb-4 text-gray-300" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-center max-w-md">{description}</p>
    </div>
  );
}
