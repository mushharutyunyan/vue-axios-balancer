import axios from 'axios';
import {reactive} from 'vue';
const HTTP = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
})
export let searched = reactive({
    searchJoke: {
        uri: '/jokes/search',
        inProgress: false,
        timeoutObj: null,
        payload: {},
        data: {
            result: [],
            total: null
        }
    }
})

export let synced = reactive({
    randomJoke: {
        uri: '/jokes/random',
        inProgress: false,
        timeoutObj: null,
        payloads: [],
        data: []
    }
})

export default {
    searchChecker(key: string) {
        let queue = searched[key];
        if (!Object.keys(queue.payload).length) {
            return;
        }
        if (queue.inProgress) {
            return;
        }
        this.search(key, queue.payload).then(function () {
            clearInterval(queue.timeoutObj);
            queue.timeoutObj = null;
        });
    },
    syncedChecker(key: string) {
        if (!synced[key].payloads.length) {
            return;
        }
        if (synced[key].inProgress) {
            return;
        }
        this.getWithSync(key, synced[key].payloads[0]).then(function () {
            if (synced[key].payloads.length <= 1) {
                clearInterval(synced[key].timeoutObj);
                synced[key].timeoutObj = null;
                synced[key].payloads = [];
            } else {
                synced[key].payloads.splice(0, 1);
            }
        });
    },


    async search(key: string, payload: {}) {
        let self = this;
        if (!searched[key].inProgress) {
            searched[key].inProgress = true;
            return await HTTP.get(searched[key].uri, {
                params: payload
            }).then(function (response) {
                clearInterval(searched[key].timeoutObj);
                searched[key].inProgress = false;
                // TODO: make data.result & data.total dynamic
                searched[key].data.result = response.data.result;
                searched[key].data.total = response.data.total;
                return response;
            }).catch(function (error) {
                searched[key].inProgress = false;
                searched[key].payload = {}
                clearInterval(searched[key].timeoutObj);
                return error;
            });
        } else {
            searched[key].payload = payload
            if (!searched[key].timeoutObj) {
                searched[key].timeoutObj = setInterval(function() {
                    self.searchChecker(key)
                }, 100)
            }
        }
        return null
    },
    async getWithSync(key: string, payload: {}, clearData: boolean = false) {
        let self = this;
        if (!synced[key].inProgress) {
            if(clearData) {
                synced[key].data.splice(0)
            }
            synced[key].inProgress = true;
            return await HTTP.get(synced[key].uri, {
                params: payload
            }).then(function (response) {
                synced[key].inProgress = false;
                synced[key].data.push(response.data);
                return response;
            }).catch(function (error) {
                synced[key].inProgress = false;
                synced[key].payload = []
                clearInterval(synced[key].timeoutObj);
                synced[key].timeoutObj = null
                return error;
            });
        } else {
            synced[key].payloads.push(payload)
            if (!synced[key].timeoutObj) {
                synced[key].timeoutObj = setInterval(function () {
                    self.syncedChecker(key)
                }, 100)
            }
        }
        return null
    },

    async get(url: string, payload: {}) {
        return await HTTP.get(url, {
            params: payload
        });
    }

    // ... other methods
}