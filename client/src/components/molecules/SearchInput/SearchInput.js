import { ListFilter, X } from 'lucide-react-native';
import React, { memo, useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SearchBar } from 'react-native-elements';

export default memo(function SearchInput({
  searchStr,
  handleSearch,
  handleFilter,
}) {
  const handleClear = useCallback(() => {
    handleSearch('');
  }, [handleSearch]);

  const handleFilterPress = useCallback(() => {
    handleFilter();
  }, [handleFilter]);

  return (
    <View style={{ backgroundColor: 'white' }}>
      <SearchBar
        placeholder="Search Clients"
        lightTheme
        round
        value={searchStr}
        onChangeText={handleSearch}
        containerStyle={{
          backgroundColor: 'white',
          borderTopWidth: 0,
          borderBottomWidth: 0,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
        inputContainerStyle={{
          backgroundColor: '#f0f0f0',
          height: 35,
        }}
        inputStyle={{
          color: '#333',
        }}
        searchIcon={() => (
          <TouchableOpacity
            onPress={handleFilterPress}
            style={{ padding: 4 }}
            activeOpacity={0.7}
          >
            <ListFilter size={24} color="#888" />
          </TouchableOpacity>
        )}
        clearIcon={() =>
          searchStr.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              style={{ padding: 4 }}
              activeOpacity={0.7}
            >
              <X size={18} color="#888" />
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
});
