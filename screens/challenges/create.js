import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Alert, Image } from 'react-native';
import { Provider as PaperProvider, Card, Title, Avatar, TextInput, Button, IconButton, Menu } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');

const challengeTypes = [
  { label: 'Workouts', value: 'workouts', icon: 'dumbbell' },
  { label: 'Walking', value: 'walking', icon: 'walk' },
  { label: 'Weight', value: 'weight', icon: 'scale-bathroom' },
  { label: 'Goals', value: 'goals', icon: 'flag-checkered' },
  { label: 'Steps', value: 'steps', icon: 'shoe-print' },
  { label: 'Sleep', value: 'sleep', icon: 'sleep' }
];

export default function CreateChallenge() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
  });

  const [challengeName, setChallengeName] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState('strength');
  const [prizeMoney, setPrizeMoney] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [image, setImage] = useState(null);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  if (!fontsLoaded) {
    return null;
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreateChallenge = async () => {
    if (!challengeName || !deadline || !category || !prizeMoney) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const db = getFirestore();
      const auth = getAuth();
      const storage = getStorage();

      let imageUrl = null;
      if (image) {
        const imageRef = ref(storage, `challenges/${Date.now()}`);
        const response = await fetch(image);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      const challengeData = {
        title: challengeName,
        deadline: deadline,
        category: category,
        prizeMoney: parseFloat(prizeMoney),
        difficulty: selectedType || 'Beginner',
        participants: 0,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        image: imageUrl,
        status: 'active',
        progress: 0,
      };

      await addDoc(collection(db, 'challenges'), challengeData);
      Alert.alert('Success', 'Challenge created successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating challenge:', error);
      Alert.alert('Error', 'Failed to create challenge');
    }
  };

  return (
    <PaperProvider>
      <LinearGradient
        colors={['#13141C', '#1A1B25', '#2D2E3D']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <ScrollView>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerText}>Create Challenge</Text>
              <IconButton
                icon="account-circle"
                color="#9397FF"
                size={28}
                onPress={() => console.log('Profile pressed')}
              />
            </View>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Challenge Name"
              value={challengeName}
              onChangeText={setChallengeName}
              style={styles.input}
              theme={{ colors: { primary: '#9397FF', text: '#FFFFFF', placeholder: '#FFFFFF' }}}
              textColor="#FFFFFF"
            />

            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialCommunityIcons name="calendar" size={24} color="#9397FF" />
              <Text style={styles.dateText}>{deadline.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={deadline}
                mode="date"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDeadline(selectedDate);
                }}
              />
            )}

            <View style={styles.categoryContainer}>
              <TouchableOpacity 
                style={[styles.categoryButton, category === 'Workout' && styles.selectedCategory]}
                onPress={() => setCategory('workout')}
              >
                <Text style={styles.categoryText}>Workout</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.categoryButton, category === 'Walking' && styles.selectedCategory]}
                onPress={() => setCategory('walking')}
              >
                <Text style={styles.categoryText}>Walking</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.categoryButton, category === 'Diet' && styles.selectedCategory]}
                onPress={() => setCategory('Diet')}
              >
                <Text style={styles.categoryText}>Diet</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              label="Prize Pool (APT)"
              value={prizeMoney}
              onChangeText={setPrizeMoney}
              style={styles.input}
              keyboardType="decimal-pad"
              theme={{ colors: { primary: '#9397FF', text: '#FFFFFF', placeholder: '#FFFFFF' }}}
              textColor="#FFFFFF"
            />

            <Text style={styles.sectionTitle}>Type</Text>
            <View style={styles.dropdownContainer}>
              <Menu
                visible={showTypeMenu}
                onDismiss={() => setShowTypeMenu(false)}
                anchor={
                  <TouchableOpacity 
                    style={styles.dropdownButton}
                    onPress={() => setShowTypeMenu(true)}
                  >
                    <Text style={styles.dropdownButtonText}>
                      {selectedType ? challengeTypes.find(t => t.value === selectedType)?.label : 'Select Challenge Type'}
                    </Text>
                    <MaterialCommunityIcons name="menu-down" size={24} color="#9397FF" />
                  </TouchableOpacity>
                }
              >
                {challengeTypes.map((type) => (
                  <Menu.Item
                    key={type.value}
                    onPress={() => {
                      setSelectedType(type.value);
                      setShowTypeMenu(false);
                    }}
                    title={type.label}
                    leadingIcon={type.icon}
                  />
                ))}
              </Menu>
            </View>

            <Text style={styles.sectionTitle}>Challenge Image</Text>
            <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.uploadedImage} />
              ) : (
                <>
                  <MaterialCommunityIcons name="upload" size={24} color="#9397FF" />
                  <Text style={styles.uploadText}>Upload Image</Text>
                </>
              )}
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleCreateChallenge}
              style={styles.createButton}
              labelStyle={styles.buttonLabel}
            >
              Create Challenge
            </Button>
          </View>
        </ScrollView>
      </LinearGradient>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  formContainer: {
    margin: 15,
    padding: 15,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(147, 151, 255, 0.3)',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(147, 151, 255, 0.3)',
    marginBottom: 15,
  },
  dateText: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  categoryButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(147, 151, 255, 0.3)',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#9397FF',
  },
  categoryText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 15,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(147, 151, 255, 0.3)',
    borderRadius: 8,
  },
  dropdownButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  imageUpload: {
    height: 120,
    borderWidth: 1,
    borderColor: 'rgba(147, 151, 255, 0.3)',
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  uploadText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
  },
  createButton: {
    marginTop: 10,
    borderRadius: 8,
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});