import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useGetProductsQuery } from "../../features/products/productApi";

const HomeScreen = () => {
  const { data, isLoading, error } = useGetProductsQuery({
    limit: 10,
    skip: 0,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Something went wrong.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data?.products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                -{Math.round(item.discountPercentage)}%
              </Text>
            </View>

            <Image
              source={{ uri: item.thumbnail }}
              style={styles.image}
              resizeMode="contain"
            />

            <Text numberOfLines={2} style={styles.title}>
              {item.title}
            </Text>

            <Text style={styles.category}>
              {item.brand} • {item.category}
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>${item.price}</Text>

              <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
            </View>

            <Text
              style={[
                styles.stock,
                {
                  color: item.stock > 0 ? "#16A34A" : "#DC2626",
                },
              ]}
            >
              {item.stock > 0 ? `${item.stock} in stock` : "Out of Stock"}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  list: {
    padding: 12,
  },

  row: {
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 140,
    marginBottom: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    minHeight: 42,
  },

  category: {
    color: "#6B7280",
    marginTop: 4,
    fontSize: 12,
  },

  priceRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },

  rating: {
    fontSize: 13,
    color: "#F59E0B",
    fontWeight: "600",
  },

  stock: {
    marginTop: 8,
    fontWeight: "600",
    fontSize: 12,
  },

  discountBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 10,
  },

  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
