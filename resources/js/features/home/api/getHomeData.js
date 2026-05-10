import api from '../../../lib/api';

export const getHomeData = async () => {
    const { data } = await api.get('/home');
    return data.data; // Since response is { success: true, data: { ... } }
};
