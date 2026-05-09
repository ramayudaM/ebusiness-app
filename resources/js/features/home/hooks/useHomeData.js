import { useQuery } from '@tanstack/react-query';
import { getHomeData } from '../api/getHomeData';

export const useHomeData = () => {
    return useQuery({
        queryKey: ['home'],
        queryFn: getHomeData,
    });
};
