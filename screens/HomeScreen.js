import React, { useState, useEffect, useContext } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, View, Text, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '../components/ThemeContext';
import StoryCard from '../components/StoryCard';
import { fetchStories } from '../services/api';
import { getLikedStories, saveLikedStories } from '../utils/storage';

const HomeScreen = ({ navigation }) => {
  const { colors, toggleTheme } = useContext(ThemeContext);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedStories, setLikedStories] = useState([]);

  // Load liked stories from storage
  useEffect(() => {
    const loadLikedStories = async () => {
      const liked = await getLikedStories();
      setLikedStories(liked);
    };
    loadLikedStories();
  }, []);

  // Fetch stories from API
  const loadStories = async () => {
    if (loading) return;
    setLoading(true);
    const data = await fetchStories(page);
    setStories(prev => [...prev, ...data]);
    setPage(prev => prev + 1);
    setLoading(false);
  };

  // Toggle like for a story
  const toggleLike = async (id) => {
    const newLikedStories = likedStories.includes(id)
      ? likedStories.filter(storyId => storyId !== id)
      : [...likedStories, id];
    setLikedStories(newLikedStories);
    await saveLikedStories(newLikedStories); // Save to AsyncStorage
  };

  // Filter stories based on search query
  const filteredStories = stories.filter(story =>
    story.title.rendered.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    loadStories();
  }, []);

  // Render the header (including the search bar) for the FlatList
  const renderHeader = () => (
    <View>
      {/* Combined Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={toggleTheme}>
          <MaterialIcons name={colors.isDarkMode ? 'wb-sunny' : 'nights-stay'} size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.appName, { color: colors.text }]}>فضای استعاره</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LikedStories', { likedStories, stories })}>
          <MaterialIcons name="favorite" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TextInput
        style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="جستجو..."
        placeholderTextColor={colors.text + '80'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredStories}
        renderItem={({ item }) => (
          <StoryCard
            story={item}
            isLiked={likedStories.includes(item.id)}
            onLikePress={() => toggleLike(item.id)}
            onPress={() => navigation.navigate('StoryDetails', { story: item })}
          />
        )}
        keyExtractor={item => item.id.toString()}
        onEndReached={loadStories}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={renderHeader} // Add the header (including search bar) here
        ListFooterComponent={loading ? <ActivityIndicator size="large" color={colors.text} /> : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 35, // Add more space at the top
    elevation: 4,
    borderRadius: 25,
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Vazirmatn',
    fontWeight: 'bold',
  },
  searchInput: {
    margin: 15,
    padding: 10,
    borderRadius: 25,
    fontFamily: 'Vazirmatn',
    textAlign: 'right',
  },
});

export default HomeScreen;