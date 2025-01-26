import AsyncStorage from '@react-native-async-storage/async-storage';

export const getLikedStories = async () => {
  const likedStories = await AsyncStorage.getItem('likedStories');
  return likedStories ? JSON.parse(likedStories) : [];
};

export const saveLikedStories = async (likedStories) => {
  await AsyncStorage.setItem('likedStories', JSON.stringify(likedStories));
};