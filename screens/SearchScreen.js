import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import StoryCard from '../components/StoryCard';

const SearchScreen = ({ route }) => {
  const { stories } = route.params;
  const [query, setQuery] = useState('');

  const filteredStories = stories.filter(story =>
    story.title.rendered.toLowerCase().includes(query.toLowerCase()) ||
    story.excerpt.rendered.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search stories..."
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filteredStories}
        renderItem={({ item }) => <StoryCard story={item} />}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f1de',
  },
  searchInput: {
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
});

export default SearchScreen;