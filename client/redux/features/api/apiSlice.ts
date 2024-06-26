import { CreateApi, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";


export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    }),
    endpoints:(builder)=>({}),
});

export const {} = apiSlice;