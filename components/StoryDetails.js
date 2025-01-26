import React, { useContext } from 'react';
import { ScrollView, Text, Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from './ThemeContext';

const StoryDetails = ({ route, navigation }) => {
  const { story } = route.params;
  const { colors } = useContext(ThemeContext);
  const imageUrl = story._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.chatButton, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('Chat', { story })}
        >
          <MaterialIcons name="chat" size={20} color={colors.text} />
          <Text style={[styles.chatButtonText, { color: colors.text }]}> صحبت با داستان</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{story.title.rendered}</Text>
        <Text style={[styles.contentText, { color: colors.text }]}>
          {story.content.rendered.replace(/<[^>]+>/g, '').replace(/&#\d+;/g, '')}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 25,
  },
  content: {
    padding: 16,
  },
  title: {
    fontFamily: 'Vazirmatn',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 32,
    textAlign: 'right',
  },
  contentText: {
    fontFamily: 'Vazirmatn',
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'right',
    marginTop: 16,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    justifyContent: 'center',
  },
  chatButtonText: {
    fontFamily: 'Vazirmatn',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default StoryDetails;