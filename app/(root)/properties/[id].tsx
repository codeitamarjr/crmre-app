import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  ActivityIndicator,
  Linking,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import MapView, { Marker } from "react-native-maps";

import icons from "@/constants/icons";
import images from "@/constants/images";
import Comment from "@/components/Comment";
import { facilities } from "@/constants/data";

import { useMemo } from "react";
import { getProperties, useCRMRE, Property } from "@/lib/crmre";

const PropertyDetails = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const windowHeight = Dimensions.get("window").height;

  // Memoize params to avoid re-rendering issues
  const params = useMemo(() => ({ endpoint: `units/${id}` as `units/${number}` }), [id]);

  const { data, loading, error } = useCRMRE<Property, typeof params>({
    fn: getProperties,
    params,
  });

  const property = data || null;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !property) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Failed to load property details.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-500 mt-5">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const agent = Array.isArray(property.agent) ? property.agent[0] : {};
  const gallery = property.gallery ? [property.gallery] : [];

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={{ uri: property.gallery?.cover }}
            className="size-full"
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />

          <View
            className="z-50 absolute inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            <View className="flex flex-row items-center w-full justify-between">

              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row items-center justify-center"
              >
                <View className="size-11 justify-center items-center bg-primary-300/70 rounded-full">

                  <Image source={icons.backArrow} className="size-5" style={{ tintColor: "white" }} />
                </View>
              </TouchableOpacity>

              <View className="flex flex-row items-center gap-3">
                <Image
                  source={icons.heart}
                  className="size-7"
                  tintColor={"#191D31"}
                />
                <Image source={icons.send} className="size-7" />
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 mt-7 flex gap-2">
          <Text className="text-2xl font-rubik-extrabold">
            {property?.type} {property?.number} - {property?.address}
          </Text>

          <View className="flex flex-row items-center gap-3">
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-primary-300">
                {property?.type}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2">
              <Image source={icons.star} className="size-5" />
              <Text className="text-black-200 text-sm mt-1 font-rubik-medium">
                5 (9 reviews)
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center mt-5">
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10">
              <Image source={icons.bed} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.bedrooms} Beds
            </Text>
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7">
              <Image source={icons.bath} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.bathrooms} Baths
            </Text>
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7">
              <Image source={icons.area} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.area} Sqm
            </Text>
          </View>

          <View className="w-full border-t border-primary-200 pt-7 mt-5">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Agent
            </Text>

            <View className="flex flex-row items-center justify-between mt-4">
              <View className="flex flex-row items-center">
                <Image
                  source={{ uri: agent.avatar }}
                  className="size-14 rounded-full"
                />

                <View className="flex flex-col items-start justify-center ml-3">
                  <Text className="text-lg text-black-300 text-start font-rubik-bold">
                    {agent.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(`mailto:${agent.email}?subject=Enquiry from Real Enquiries App - ${property.type} ${property.number} - ${property.address}`)
                    }
                  >
                    <Text className="text-sm text-black-200 text-start font-rubik-medium">
                      {agent.email}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={() => Linking.openURL(`mailto:${agent.email}?subject=Enquiry from Real Enquiries App - ${property.type} ${property.number} - ${property.address}`)}
                >
                  <Image source={icons.chat} className="size-7" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${agent.phone}`)}
                >
                  <Image source={icons.phone} className="size-7" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Overview
            </Text>
            <Text className="text-black-200 text-base font-rubik mt-2">
              {property?.description}
            </Text>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Facilities
            </Text>

            {/* Render facilities */}
            {Array.isArray(property?.facilities) && property.facilities.length > 0 && (
              <View className="flex flex-row flex-wrap items-start justify-start mt-2 gap-5">
                {property.facilities.map((item: { identifier: keyof typeof icons, facility: string }, index) => (
                  <View
                    key={item.identifier || index}
                    className="flex flex-1 flex-col items-center min-w-16 max-w-20"
                  >
                    {/* Map facility identifier to an icon */}
                    <View className="size-14 bg-primary-100 rounded-full flex items-center justify-center">
                      <Image
                        source={icons[item.identifier] || icons.info}
                        className="size-6"
                      />
                    </View>

                    {/* Facility name */}
                    <Text
                      className="text-black-300 text-sm text-center font-rubik mt-1.5"
                    >
                      {item.facility}
                    </Text>
                  </View>
                ))}
              </View>
            )}

          </View>

          {false && property?.gallery.length > 0 && (
            <View className="mt-7">
              <Text className="text-black-300 text-xl font-rubik-bold">
                Gallery
              </Text>
              <FlatList
                contentContainerStyle={{ paddingRight: 20 }}
                data={property?.gallery}
                keyExtractor={(item) => item.$id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.image }}
                    className="size-40 rounded-xl"
                  />
                )}
                contentContainerClassName="flex gap-4 mt-3"
              />
            </View>
          )}

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Location
            </Text>
            <View className="flex flex-row items-center justify-start mt-4 gap-2">
              <Image source={icons.location} className="w-7 h-7" />
              <Text className="text-black-200 text-sm font-rubik-medium">
                {property?.address}
              </Text>
            </View>

            {property?.coordinates?.latitude && property?.coordinates?.longitude && (
              <MapView
                style={{ height: 200, width: '100%', marginTop: 20, borderRadius: 15 }}
                initialRegion={{
                  latitude: property?.coordinates?.latitude,
                  longitude: property?.coordinates?.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: property?.coordinates?.latitude,
                    longitude: property?.coordinates?.longitude,
                  }}
                  title={property?.type}
                  description={property?.address}
                />
              </MapView>
            )}


          </View>

          {false && property?.reviews.length > 0 && (
            <View className="mt-7">
              <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center">
                  <Image source={icons.star} className="size-6" />
                  <Text className="text-black-300 text-xl font-rubik-bold ml-2">
                    {property?.rating} ({property?.reviews.length} reviews)
                  </Text>
                </View>

                <TouchableOpacity>
                  <Text className="text-primary-300 text-base font-rubik-bold">
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mt-5">
                <Comment item={property?.reviews[0]} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
        <View className="flex flex-row items-center justify-between gap-10">
          <View className="flex flex-col items-start">
            <Text className="text-black-200 text-xs font-rubik-medium">
              Price
            </Text>
            <Text
              numberOfLines={1}
              className="text-primary-300 text-start text-2xl font-rubik-bold"
            >
              {property?.rate}
            </Text>
          </View>

          <TouchableOpacity
            className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400"
            onPress={() => {
              Linking.openURL(property.application_url);
            }}
          >
            <Text className="text-white text-lg text-center font-rubik-bold">
              Apply Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PropertyDetails;