import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Appbar, ActivityIndicator, Chip, Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NewsCard from './components/NewsCard';

const API_KEY = ".....";
const BASE_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en`;
const CATEGORIES = ["Technology", "Sports", "Politics", "Health", "Business"];

const Main = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [bookmarkedNews, setBookmarkedNews] = useState([]);
  const [viewBookmarked, setViewBookmarked] = useState(false); // New state to manage bookmarked news view

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const categoryQuery = selectedCategories.length > 0 ? `&category=${selectedCategories.map(cat => cat.toLowerCase()).join(',')}` : '';
        const response = await axios.get(`${BASE_URL}${categoryQuery}`);
        setNews(response.data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategories]);

  useEffect(() => {
    loadBookmarkedNews();
  }, []);

  const loadBookmarkedNews = async () => {
    try {
      const storedBookmarkedNews = await AsyncStorage.getItem('bookmarkedNews');
      if (storedBookmarkedNews !== null) {
        setBookmarkedNews(JSON.parse(storedBookmarkedNews));
      }
    } catch (error) {
      console.error('Error loading bookmarked news:', error);
    }
  };

  const saveBookmarkedNews = async (newBookmarkedNews) => {
    try {
      await AsyncStorage.setItem('bookmarkedNews', JSON.stringify(newBookmarkedNews));
    } catch (error) {
      console.error('Error saving bookmarked news:', error);
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };

  const toggleBookmark = (item) => {
    const index = bookmarkedNews.findIndex((newsItem) => newsItem.title === item.title);
    if (index !== -1) {
      const updatedBookmarkedNews = [...bookmarkedNews];
      updatedBookmarkedNews.splice(index, 1);
      setBookmarkedNews(updatedBookmarkedNews);
      saveBookmarkedNews(updatedBookmarkedNews);
    } else {
      const updatedBookmarkedNews = [...bookmarkedNews, item];
      setBookmarkedNews(updatedBookmarkedNews);
      saveBookmarkedNews(updatedBookmarkedNews);
    }
  };

  const renderItem = ({ item, index }) => (
    <NewsCard
      key={item.title + index} // Use a combination of title and index as the key
      title={item.title}
      description={item.description}
      imageUrl={item.image_url}
      isBookmarked={bookmarkedNews.some((newsItem) => newsItem.title === item.title)}
      onToggleBookmark={() => toggleBookmark(item)}
    />
  );
  
  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="News App" />
        <Appbar.Action icon={viewBookmarked ? 'newspaper' : 'bookmark'} onPress={() => setViewBookmarked(!viewBookmarked)} />
      </Appbar.Header>
      {!viewBookmarked ? ( // Render normal view if not viewing bookmarked news
        <>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                selected={selectedCategories.includes(cat)}
                onPress={() => toggleCategory(cat)}
                style={[styles.chip, selectedCategories.includes(cat) && styles.selectedChip]}
              >
                {cat}
              </Chip>
            ))}
            <View style={{ width: 10 }} />
          </View>
          <Text style={styles.selectedCategoriesText}>
            Selected Categories: {selectedCategories.join(', ') || 'None'}
          </Text>
          <FlatList
            data={news}
            renderItem={renderItem}
            keyExtractor={(item) => item.title}
            contentContainerStyle={styles.list}
          />
        </>
      ) : ( // Render bookmarked news if viewing bookmarked
        <>
          <Text style={styles.bookmarkedTitle}>Bookmarked News</Text>
          <FlatList
            data={bookmarkedNews}
            renderItem={renderItem}
            keyExtractor={(item) => item.title}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  chip: {
    marginHorizontal: 5,
    marginBottom: 5,
  },
  selectedChip: {
    backgroundColor: '#6200ea',
    color: 'grey',
  },
  selectedCategoriesText: {
    marginHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookmarkedTitle: {
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ea',
  },
  list: {
    paddingHorizontal: 10,
  },
});

export default Main;
