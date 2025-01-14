import { ActivityIndicator, Button, FlatList, Image, Text, Touchable, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import { RegularCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import { useCRMRE, getProperties } from "@/lib/crmre";
import { useMemo, useState } from "react";
import NoResults from "@/components/NoResults";

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [page, setPage] = useState(1);

  const params = useLocalSearchParams<{ query?: string }>();

  const allUnitsParams = useMemo(() => ({ endpoint: 'units', page, query: params.query || '' }), [page, params.query]);

  // Fetch regular properties
  const { data: properties, loading: allProperties, refetch: refetchAll, error: cardsError } = useCRMRE({
    fn: getProperties,
    params: allUnitsParams,
  });

  // Filter locally
  const filteredProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];
    const searchLower = searchTerm.toLowerCase();

    return properties.filter((property) =>
      [
        property.address,
        property.property_name,
        property.city,
        property.country,
      ]
        .filter((field) => field !== null && field !== undefined)
        .some((field) => field.toLowerCase().includes(searchLower))
    ).filter((property) =>
      selectedFilter !== 'All' ? property.type === selectedFilter : true
    );
  }, [properties, searchTerm, selectedFilter]);

  const handleCardPress = (id?: number) => {
    if (id) {
      router.push(`/properties/${id}`);
    } else {
      console.error("Property ID is undefined");
    }
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  // Callback function to update the selected filter
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
    refetchAll({ endpoint: 'units', page: page + 1, query: params.query || '' });
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={Array.isArray(properties) ? filteredProperties : []}
        renderItem={({ item }) => (
          <RegularCard item={item} onPress={() => handleCardPress(item.id)} />
        )}
        keyExtractor={(item, index) => `property-${item.id.toString()}` || `property-${index.toString()}`}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          allProperties ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : <NoResults />
        }
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">

              <TouchableOpacity onPress={() => router.back()} className="flex flex-row size-12">
                <View className="size-11 justify-center items-center bg-primary-200 rounded-full">
                  <Image source={icons.backArrow} className="size-5" />
                </View>
              </TouchableOpacity>

              <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                Search for Your Ideal Home
              </Text>

              <Image source={icons.bell} className="size-6" />

            </View>

            <Search onSearch={handleSearch} />

            <View className="mt-5">

              <Filters onFilterChange={handleFilterChange} />

              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                Found {Array.isArray(properties) ? properties.length : 0} properties
              </Text>
            </View>
          </View>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={allProperties ? <ActivityIndicator size="large" /> : null}
      />

    </SafeAreaView>
  );
}
