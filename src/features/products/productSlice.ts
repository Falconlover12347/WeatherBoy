import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  selectedProductId: number | null;
  search: string;
}

const initialState: ProductState = {
  selectedProductId: null,
  search: "",
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<number | null>) => {
      state.selectedProductId = action.payload;
    },

    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    clearFilters: (state) => {
      state.search = "";
    },
  },
});

export const { setSelectedProduct, setSearch, clearFilters } =
  productSlice.actions;

export default productSlice.reducer;
