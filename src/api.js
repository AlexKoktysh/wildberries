import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTAyOTIxMjEsIkFwcGxpY2F0aW9uIjoiUnVrb3ZvZGl0ZWwifQ.tdUIEg-hrhP2dRQHL1r6x3raC2GZ8qu0utwrTC8zUBk";

const instance = axios.create({
    baseURL: `https://portal.liloo.by/api/integrations/services/market_place/wildberries`,
    headers: {
        Authorization : `Bearer ${token}`,
    },
});

instance.interceptors.response.use(
    (response) => response.data,
    (error) => ({ error: error.response.data }),
);

export const getDate = async (params) => {
    const response = await instance.post("/product_cards_list", { ...params });
    return response;
};
export const editFieldsServer = async (params) => {
    const response = await instance.post("/edit_product_card", { ...params });
    return response;
};