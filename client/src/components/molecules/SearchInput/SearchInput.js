import { Search, X } from 'lucide-react-native';
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { SearchBar } from 'react-native-elements';

export default function SearchInput(props) {
  const { searchStr, handleSearch, onSearchModeChange } = props;
  const [searchMode, setSearchMode] = useState(false);

  const animatedWidth = useRef(new Animated.Value(searchMode ? 1 : 0)).current;
  const searchBarRef = useRef(null);

  useEffect(() => {
    if (onSearchModeChange) {
      onSearchModeChange(searchMode);
    }
  }, [searchMode, onSearchModeChange]);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: searchMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (searchMode && searchBarRef.current) {
        searchBarRef.current.focus();
      }
    });
  }, [searchMode]);

  const handleSearchIconPress = () => {
    setSearchMode(true);
  };

  const handleFocus = () => {
    if (!searchMode) {
      setSearchMode(true);
    }
  };

  const handleCancel = () => {
    handleSearch('');
    setSearchMode(false);
  };

  const handleClear = () => {
    handleSearch('');
  };

  const { width: screenWidth } = Dimensions.get('window');

  const interpolatedWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [28, screenWidth - 80],
  });

  const searchIconOpacity = animatedWidth.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [1, 0, 0],
  });

  const searchBarOpacity = animatedWidth.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View className="justify-center h-10 mr-2">
      <Animated.View
        style={{
          position: 'absolute',
          opacity: searchIconOpacity,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        pointerEvents={searchMode ? 'none' : 'auto'}
      >
        <TouchableOpacity
          className="justify-center items-center"
          onPress={handleSearchIconPress}
        >
          <Search size={32} color="#888" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={{
          padding: 0,
          width: interpolatedWidth,
          opacity: searchBarOpacity,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        pointerEvents={searchMode ? 'auto' : 'none'}
      >
        <View className="flex-1">
          <SearchBar
            ref={searchBarRef}
            placeholder="Search..."
            onChangeText={handleSearch}
            value={searchStr}
            onFocus={handleFocus}
            showCancel={false}
            clearIcon={() =>
              searchStr.length > 0 && (
                <TouchableOpacity onPress={handleClear}>
                  <X size={18} color="#888" />
                </TouchableOpacity>
              )
            }
            containerStyle={{
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              borderBottomWidth: 0,
              paddingHorizontal: 0,
            }}
            inputContainerStyle={{
              backgroundColor: '#f0f0f0',
              borderRadius: 20,
              height: 36,
            }}
            inputStyle={{
              fontSize: 16,
              color: '#000',
            }}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity className="pl-3" onPress={handleCancel}>
          <Text className="text-blue-500 font-normal text-xl">Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
