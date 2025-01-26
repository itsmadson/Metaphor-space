import React, { useContext } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { ThemeContext } from './ThemeContext';
import StoryCard from './StoryCard';

const LikedStories = ({ route, navigation }) => {
  const { likedStories, stories } = route.params;
  const { colors } = useContext(ThemeContext);

  const likedStoryCards = likedStories.map(storyId => {
    const likedStory = stories.find(story => story.id === storyId);
    return likedStory ? (
      <StoryCard
        key={storyId}
        story={likedStory}
        isLiked={true}
        onPress={() => navigation.navigate('StoryDetails', { story: likedStory })}
      />
    ) : null;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {likedStoryCards.length > 0 ? (
        <FlatList
          data={likedStoryCards}
          renderItem={({ item }) => item}
          keyExtractor={item => item.key}
        />
      ) : (
        <Text style={[styles.emptyText, { color: colors.text }]}>هنوز داستانی رو دوست نداشتی</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    fontFamily: 'Vazirmatn',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LikedStories;