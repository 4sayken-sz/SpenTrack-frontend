import httpDomain from "./httpDomain.util.js";

const fetcher = async (url) => {
    try {
        const { data } = await httpDomain.get(url);
        return data;
    } catch (err) {
        throw new Error(err.response?.data?.message || "An error occurred while fetching data.");
    }
}

export default fetcher;