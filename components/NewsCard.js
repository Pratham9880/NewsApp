import React from 'react';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

const NewsCard = ({ title, description, imageUrl, isBookmarked, onToggleBookmark }) => {
  return (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: imageUrl }} />
      <Card.Content>
        <Title>{title}</Title>
        <Paragraph>{description}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <View style={styles.actions}>
          <IconButton
            icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            onPress={onToggleBookmark}
          />
        </View>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default NewsCard;
