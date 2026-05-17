import React from 'react';

export const Skeleton = ({ className, ...props }) => {
    return (
        <div 
            className={`animate-pulse bg-zinc-800/80 rounded ${className}`} 
            {...props} 
        />
    );
};

export const ProductCardSkeleton = () => (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden flex flex-col h-full shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-sm">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="p-4 flex flex-col flex-1 gap-2.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="mt-auto pt-4 flex justify-between items-center">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-8 w-10 rounded-xl" />
            </div>
        </div>
    </div>
);
