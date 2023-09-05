import { SkeletonColumn, SkeletonHeader } from "@/components/Skeleton";

const Skeleton: React.FC = () => {
    return (
        <div>
            <div className="flex flex-col md:flex-row w-full p-8 space-y-6 md:space-y-0 md:space-x-6 items-center">
                <SkeletonColumn className="w-full" fields={3}>
                </SkeletonColumn>
                <SkeletonColumn className="w-full sm:w-1/3 " fields={2} image="top" />
            </div>
        </div>
    );
};

export default Skeleton