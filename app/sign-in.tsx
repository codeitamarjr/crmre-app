import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import images from '../constants/images'
import icons from '../constants/icons'
import { login } from '@/lib/appwrite'
import { useGlobalContext } from '@/lib/global-provide'
import { Redirect } from 'expo-router'

const SignIn = () => {
  const { refetch, loading, isLoggedIn } = useGlobalContext();

  if (!loading && isLoggedIn) return <Redirect href="/" />

  const handleLogin = async () => {
    const result = await login();

    if (result) {
      refetch();
    } else {
      Alert.alert('Error', 'Failed to login');
    }
  };

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView>
        <Image source={require('../assets/images/icon.png')} className='size-40 my-40 mx-auto' resizeMode='contain' />
        <View className='px-10'>
          <Text className='text-base text-center uppercase text-black-200 font-rubik my-5'>Real Enquiries Marketplace</Text>
          <Text className='text-3xl font-rubik-bold text-black-300 text-center mt-2'>
            Let's get you close to {"\n"}
            <Text className='text-primary-300'>
              Your Dream Property
            </Text>
          </Text>

          <TouchableOpacity onPress={handleLogin} className='bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5'>
            <View className='flex flex-row items-center justify-center'>
              <Image source={icons.google} className='size-5' resizeMode='contain' />
              <Text className='text-lg font-rubik-medium text-black-300 ml-2'>Continue with Google</Text>
            </View>
          </TouchableOpacity>

          <View className='flex flex-row items-center justify-center mt-5'>
            <View className='w-1/2 h-1 bg-black-100' />
            <Text className='text-lg font-rubik text-black-200 mx-2'>or</Text>
            <View className='w-1/2 h-1 bg-black-100' />
          </View>

          <TouchableOpacity className='bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5 mb-5'>
            <View className='flex flex-row items-center justify-center'>
              <Text className='text-2xl font-rubik-medium text-black-300'>@</Text>
              <Text className='text-lg font-rubik-medium text-black-300 ml-2'>Continue with Email</Text>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn