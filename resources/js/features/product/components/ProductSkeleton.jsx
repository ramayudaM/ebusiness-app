import React from 'react';

export const ProductSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse text-white">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left Col: Gallery Skeleton */}
                <div className="w-full lg:w-1/2">
                    <div className="aspect-square bg-zinc-900/80 border border-zinc-800/80 rounded-2xl w-full mb-4"></div>
                    <div className="flex gap-4 overflow-x-auto">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-20 h-20 bg-zinc-900/80 border border-zinc-850 rounded-lg shrink-0"></div>
                        ))}
                    </div>
                </div>

                {/* Right Col: Info Skeleton */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    <div>
                        <div className="w-24 h-6 bg-zinc-900/80 border border-zinc-850 rounded-full mb-4"></div>
                        <div className="w-3/4 h-10 bg-zinc-900/80 border border-zinc-850 rounded-lg mb-3"></div>
                        <div className="w-1/2 h-8 bg-zinc-900/80 border border-zinc-850 rounded-lg"></div>
                    </div>
                    
                    {/* Variasi */}
                    <div>
                        <div className="w-32 h-6 bg-zinc-900/80 border border-zinc-850 rounded mb-3"></div>
                        <div className="flex gap-3">
                            <div className="w-16 h-10 bg-zinc-900/80 border border-zinc-850 rounded-lg"></div>
                            <div className="w-16 h-10 bg-zinc-900/80 border border-zinc-850 rounded-lg"></div>
                            <div className="w-16 h-10 bg-zinc-900/80 border border-zinc-850 rounded-lg"></div>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="flex gap-4 mt-4">
                        <div className="w-full h-14 bg-zinc-900/80 border border-zinc-850 rounded-xl"></div>
                        <div className="w-full h-14 bg-zinc-900/80 border border-zinc-850 rounded-xl"></div>
                    </div>

                    {/* Tabs / Accordeon Skeleton */}
                    <div className="mt-8 space-y-4">
                        <div className="w-full h-12 bg-zinc-900/80 border border-zinc-850 rounded-lg"></div>
                        <div className="w-full h-32 bg-zinc-900/80 border border-zinc-850 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
