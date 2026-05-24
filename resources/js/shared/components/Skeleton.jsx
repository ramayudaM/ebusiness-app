import React from 'react';

export const Skeleton = ({ className, ...props }) => {
    return (
        <div 
            className={`animate-pulse bg-[var(--surface-secondary)] rounded ${className}`} 
            {...props} 
        />
    );
};

export const ProductCardSkeleton = () => (
    <div className="bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-[1.5rem] overflow-hidden flex flex-col h-full shadow-[var(--shadow-subtle)]">
        <Skeleton className="aspect-[4/3] w-full rounded-none" />
        <div className="p-5 flex flex-col flex-1 gap-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="mt-auto pt-5 flex flex-col gap-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-10 w-full rounded-xl" />
            </div>
        </div>
    </div>
);
