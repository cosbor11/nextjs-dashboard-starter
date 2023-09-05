import React from 'react';

export const SkeletonHeader: React.FC = () => {
    return (
        <div id="skeleton-header" className="bg-gray-400 animate-pulse h-32 w-full rounded-lg"></div>
    );
};

export const SkeletonField: React.FC<{ className?: string; children?: any }> = ({ className = "w-full", children }) => {
    return (
        <div>
          <label className='text-gray-400 animate-pulse'>Loading...</label>
          <div className={`bg-gray-400 animate-pulse h-10 rounded-lg ${className}`}>{children}</div>
        </div>
    );
};

type SkeletonColumnProps = {
    fields: number;
    image?: "top" | "bottom" | "none";
    children?: any;
    className?: string;
};

export const SkeletonColumn: React.FC<SkeletonColumnProps> = ({ fields, image = "none", children, className = "w-full" }) => {
    return (
        <div className={`space-y-2 my-3 ${className}`}>
            {children}
            <div className="w-full space-y-2 my-3">
                {image == 'top' &&
                    <div id={`skeleton-image`} className="bg-gray-400 animate-pulse h-32 w-full rounded-lg"></div>
                }
                {Array.from({ length: fields }).map((_, index) => (
                    <SkeletonField key={index} />
                ))}
                {image == 'bottom' &&
                    <div id={`skeleton-image`} className="bg-gray-400 animate-pulse h-36 w-full rounded-lg"></div>
                }
            </div>

        </div>
    );
};

type SkeletonProps = {
    header?: boolean;
};

const DefaultSkeleton: React.FC<SkeletonProps> = ({ header = true }) => {
    return (
        <div className='p-6'>
            {header && <SkeletonHeader />}
            <div className="flex gap-4">
                <SkeletonColumn fields={3} />
                <SkeletonColumn fields={1} image="top" />
            </div>
        </div>
    );
};

export default DefaultSkeleton;
