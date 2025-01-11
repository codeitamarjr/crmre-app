import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import { FeaturedCard, RegularCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import { useGlobalContext } from "@/lib/global-provide";
import { useCRMRE, getProperties } from "@/lib/crmre";
import NoResults from "@/components/NoResults";
import { useMemo, useState } from "react";

export default function Index() {
  const { user } = useGlobalContext();
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const [page, setPage] = useState(1);

  const allUnitsParams = useMemo(() => ({ endpoint: 'units', page: 1, query: params.query || '' }), [page, params.query]);
  const featuredUnitsParams = useMemo(() => ({ endpoint: 'units', featured: 1, page: 1 }), []);

  // Fetch featured properties
  const { data: featuredProperties, loading: featuredLoading, error: featuredError } = useCRMRE({
    fn: getProperties,
    params: featuredUnitsParams,
  });

  // Fetch regular properties
  const { data: properties, loading: allProperties, refetch: refetchAll, error: cardsError } = useCRMRE({
    fn: getProperties,
    params: allUnitsParams,
  });

  const handleCardPress = (id?: number) => {
    if (id) {
      router.push(`/properties/${id}`);
    } else {
      console.error("Property ID is undefined");
    }
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
    refetchAll({ endpoint: 'units', page: page + 1, query: params.query || '' });
  };

  const greeting = (() => {
    const hours = new Date().getHours();
    if (hours < 12 && hours >= 6) return "Good morning";
    if (hours < 18 && hours >= 12) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={Array.isArray(properties) ? properties : []}
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
              <View className="flex flex-row items-center">
                <Image source={{ uri: user?.avatar }} className="size-12 rounded-full" />
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">{greeting},</Text>
                  <Text className="text-base font-rubik-medium text-black-300">{user?.name}</Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>

            <Search />

            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Featured
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See all
                  </Text>
                </TouchableOpacity>
              </View>

              {featuredLoading ?
                <ActivityIndicator size="large" className="text-primary-300" /> :
                !Array.isArray(featuredProperties) || featuredProperties.length === 0 ? <NoResults /> : (

                  <FlatList
                    data={featuredProperties}
                    renderItem={({ item }) => (
                      <FeaturedCard
                        item={item}
                        onPress={() => handleCardPress(item.id)}
                      />
                    )}
                    keyExtractor={(item, index) =>
                      `featured-${item.id.toString()}` || `featured-${index.toString()}`
                    }
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    contentContainerClassName="flex gap-5 mt-5"
                  />

                )}
            </View>

            <View className="flex flex-row items-center justify-between">
              <Text className="text-xl font-rubik-bold text-black-300">
                Our Recommendation
              </Text>
              <TouchableOpacity>
                <Text className="text-base font-rubik-bold text-primary-300">
                  See all
                </Text>
              </TouchableOpacity>
            </View>

            <Filters />

          </View>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={allProperties ? <ActivityIndicator size="large" /> : null}
      />

    </SafeAreaView>
  );
}
