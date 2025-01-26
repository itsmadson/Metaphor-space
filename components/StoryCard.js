import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from './ThemeContext';

const StoryCard = ({ story, isLiked, onLikePress, onPress }) => {
  const { colors } = useContext(ThemeContext);
  const imageUrl = story._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{story.title.rendered}</Text>
        <Text style={[styles.excerpt, { color: colors.text }]}>
          {story.excerpt.rendered.replace(/<[^>]+>/g, '')}
        </Text>
        <TouchableOpacity onPress={onLikePress} style={styles.likeButton}>
          <MaterialIcons name={isLiked ? 'favorite' : 'favorite-border'} size={24} color={isLiked ? 'red' : colors.text} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    margin: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  image: {
    height: 270,
    width: '100%',
  },
  content: {
    padding: 16,
  },
  title: {
    fontFamily: 'Vazirmatn',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
    textAlign: 'right',
  },
  excerpt: {
    fontFamily: 'Vazirmatn',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'right',
    marginTop: 8,
  },
  likeButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
});

export default StoryCard;