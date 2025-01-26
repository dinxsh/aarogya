import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Avatar, Title, Chip, Button, TextInput, Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

export default function FriendsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('online');
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState('');

  const [friends] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      username: '@sarahj',
      status: 'Online',
      avatar: null,
      currentChallenge: '30 Days Core Challenge',
      streak: 12
    },
    {
      id: 2, 
      name: 'Mike Peters',
      username: '@mikefit',
      status: 'In Challenge',
      avatar: null,
      currentChallenge: '10K Steps Daily',
      streak: 28
    }
  ]);

  const [requests] = useState([
    {
      id: 3,
      name: 'Emma Wilson',
      username: '@emmaw',
      avatar: null,
      mutualFriends: 4
    }
  ]);

  const [blocked] = useState([
    {
      id: 4,
      name: 'James Smith',
      username: '@jsmith',
      avatar: null
    }
  ]);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Online':
        return '#4CAF50';
      case 'In Challenge':
        return '#9397FF';
      default:
        return '#757575';
    }
  };

  const handleAddFriend = () => {
    setUsername('');
    setModalVisible(false);
  };

  const renderFriendItem = (friend) => (
    <TouchableOpacity key={friend.id}>
      <LinearGradient
        colors={['rgba(44, 47, 72, 0.5)', 'rgba(54, 59, 100, 0.5)']}
        style={styles.friendCard}
      >
        <View style={styles.friendInfo}>
          <Avatar.Icon 
            size={50} 
            icon="account"
            style={styles.avatar}
            color="#9397FF"
          />
          <View style={styles.nameContainer}>
            <Title style={styles.name}>{friend.name}</Title>
            <Text style={styles.username}>{friend.username}</Text>
          </View>
          <View style={styles.streakContainer}>
            <MaterialCommunityIcons name="fire" size={16} color="#FF9800" />
            <Text style={styles.streakText}>{friend.streak}</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Chip 
            style={[styles.statusChip, { backgroundColor: `${getStatusColor(friend.status)}20` }]}
          >
            <Text style={[styles.statusText, { color: getStatusColor(friend.status) }]}>
              {friend.status}
            </Text>
          </Chip>
          <Text style={styles.challengeText}>
            <MaterialCommunityIcons name="trophy-outline" size={14} color="#9397FF" />
            {' '}{friend.currentChallenge}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderRequestItem = (request) => (
    <TouchableOpacity key={request.id}>
      <LinearGradient
        colors={['rgba(44, 47, 72, 0.5)', 'rgba(54, 59, 100, 0.5)']}
        style={styles.friendCard}
      >
        <View style={styles.friendInfo}>
          <Avatar.Icon 
            size={50} 
            icon="account"
            style={styles.avatar}
            color="#9397FF"
          />
          <View style={styles.nameContainer}>
            <Title style={styles.name}>{request.name}</Title>
            <Text style={styles.username}>{request.username}</Text>
            <Text style={styles.mutualText}>{request.mutualFriends} mutual friends</Text>
          </View>
        </View>
        <View style={styles.requestButtons}>
          <Button 
            mode="contained" 
            style={styles.acceptButton}
            labelStyle={styles.buttonLabel}
          >
            Accept
          </Button>
          <Button 
            mode="outlined" 
            style={styles.ignoreButton}
            labelStyle={[styles.buttonLabel, {color: '#9397FF'}]}
          >
            Ignore
          </Button>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderBlockedItem = (blocked) => (
    <TouchableOpacity key={blocked.id}>
      <LinearGradient
        colors={['rgba(44, 47, 72, 0.5)', 'rgba(54, 59, 100, 0.5)']}
        style={styles.friendCard}
      >
        <View style={styles.friendInfo}>
          <Avatar.Icon 
            size={50} 
            icon="account"
            style={styles.avatar}
            color="#9397FF"
          />
          <View style={styles.nameContainer}>
            <Title style={styles.name}>{blocked.name}</Title>
            <Text style={styles.username}>{blocked.username}</Text>
          </View>
          <Button 
            mode="outlined"
            style={styles.unblockButton}
            labelStyle={[styles.buttonLabel, {color: '#9397FF'}]}
          >
            Unblock
          </Button>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#13141C', '#1A1B25', '#2D2E3D']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Title style={styles.headerTitle}>Friends</Title>
          <Button 
            icon="account-plus"
            mode="contained"
            onPress={() => setModalVisible(true)}
            style={styles.addButton}
            labelStyle={styles.addButtonLabel}
          >
            Add Friend
          </Button>
        </View>

        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#9397FF"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
        />

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
        >
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'online' && styles.selectedTab]}
            onPress={() => setSelectedTab('online')}
          >
            <Text style={[styles.tabText, selectedTab === 'online' && styles.selectedTabText]}>
              Online
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'all' && styles.selectedTab]}
            onPress={() => setSelectedTab('all')}
          >
            <Text style={[styles.tabText, selectedTab === 'all' && styles.selectedTabText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'requests' && styles.selectedTab]}
            onPress={() => setSelectedTab('requests')}
          >
            <Text style={[styles.tabText, selectedTab === 'requests' && styles.selectedTabText]}>
              Requests
            </Text>
            {requests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{requests.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'blocked' && styles.selectedTab]}
            onPress={() => setSelectedTab('blocked')}
          >
            <Text style={[styles.tabText, selectedTab === 'blocked' && styles.selectedTabText]}>
              Blocked
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView}>
        {selectedTab === 'requests' ? (
          requests.map(request => renderRequestItem(request))
        ) : selectedTab === 'blocked' ? (
          blocked.map(blocked => renderBlockedItem(blocked))
        ) : (
          friends.map(friend => renderFriendItem(friend))
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Title style={styles.modalTitle}>Add Friend</Title>
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: '#9397FF' } }}
            />
            <View style={styles.modalButtons}>
              <Button 
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button 
                mode="contained"
                onPress={handleAddFriend}
                style={[styles.modalButton, styles.addModalButton]}
              >
                Add
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  searchBar: {
    backgroundColor: 'rgba(44, 47, 72, 0.5)',
    marginBottom: 16,
    elevation: 0,
    borderRadius: 12,
  },
  searchInput: {
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: 'rgba(147, 151, 255, 0.1)',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  selectedTabText: {
    color: '#9397FF',
  },
  badge: {
    backgroundColor: '#9397FF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    paddingHorizontal: 6,
  },
  addButton: {
    backgroundColor: '#9397FF',
  },
  addButtonLabel: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  friendCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: 'rgba(147, 151, 255, 0.1)',
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  username: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  mutualText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#FF9800',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusChip: {
    borderRadius: 16,
  },
  statusText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  challengeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  requestButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#9397FF',
  },
  ignoreButton: {
    borderColor: '#9397FF',
  },
  unblockButton: {
    borderColor: '#9397FF',
  },
  buttonLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#2C2F48',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    marginLeft: 10,
  },
  addModalButton: {
    backgroundColor: '#9397FF',
  },
});
