import { apiSlice } from "../../api/apiSlice";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  thumbnail: string;
  images: string[];
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface ProductResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  thumbnail: string;
  images: string[];
}

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      ProductsResponse,
      {
        limit?: number;
        skip?: number;
      } | void
    >({
      query: (params) => ({
        url: "/products",
        params: {
          limit: params?.limit ?? 20,
          skip: params?.skip ?? 0,
        },
      }),
      providesTags: ["Products"],
    }),

    getProductById: builder.query<ProductResponse, number>({
      query: (id) => ({
        url: `/products/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;
