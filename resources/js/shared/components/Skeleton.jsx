import React from 'react';

export const Skeleton = ({ className, ...props }) => {
    return (
        <div 
            className={`animate-pulse bg-gray-200 rounded ${className}`} 
            {...props} 
        />
    );
};

export const ProductCardSkeleton = () => (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="p-4 flex flex-col flex-1 gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="mt-auto pt-4 flex justify-between items-center">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-8 w-10 rounded-lg" />
            </div>
        </div>
    </div>
);
