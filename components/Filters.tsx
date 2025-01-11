import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { categories } from '@/constants/data';

const Filters = ({ onFilterChange }: { onFilterChange: (filter: string) => void }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const handleCategoryPress = (category: string) => {
        const newFilter = selectedCategory === category ? 'All' : category;
        setSelectedCategory(newFilter);
        onFilterChange(newFilter);
    };

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mt-3 mb-2'>
            {categories.map((item, index) => (
                <TouchableOpacity onPress={() => handleCategoryPress(item.category)}
                    key={index}
                    className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full ${selectedCategory === item.category ?
                        "bg-primary-300" :
                        "bg-primary-100 border border-primary-200"
                        }`}>
                    <Text className={`text-sm ${selectedCategory === item.category ?
                        "text-white font-rubik-bold mt-0.5" :
                        "text-primary-300 font-rubik"
                        }
                    `}>{item.title}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

export default Filters