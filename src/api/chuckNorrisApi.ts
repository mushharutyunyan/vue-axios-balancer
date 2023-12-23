import api from './api';

export default {
    async getRandomJoke() {
        return await api.getWithSync('randomJoke', {}, true);
    },
    async searchJoke(payload: {
        query: null
    }) {
        return await api.search('searchJoke', payload)
    },
}