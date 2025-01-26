import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, createUserWithEmailAndPassword } from '../../firebase';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const handleSignup = async () => {
        if (!username || !email || !password) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'User registered successfully!');
            navigation.navigate('HomeScreen');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/images/auth_wallpaper.jpg')}
            style={styles.background}
        >
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Sign Up</Text>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your username"
                            placeholderTextColor="#999"
                            value={username}
                            onChangeText={setUsername}
                            accessibilityLabel="Username"
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            accessibilityLabel="Email"
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            accessibilityLabel="Password"
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
                    </TouchableOpacity>
                    <View style={styles.actionLinksDiv}>
                        <Text onPress={() => { navigation.navigate('SignInScreen') }} style={styles.actionLinks}>Already have an account? Sign in</Text>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#13141C',
    },
    actionLinks: {
        marginVertical: 3,
        color: 'darkblue',
        textAlign: 'center',
    },
    actionLinksDiv: {
        marginVertical: 5,
    },
    formContainer: {
        backgroundColor: '#1A1B25',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        width: '90%',
        maxWidth: 400,
        borderColor: '#2D3250',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        color: '#9397FF',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#363B64',
        borderRadius: 5,
        fontSize: 16,
        color: '#FFFFFF',
        backgroundColor: '#2C2F48',
    },
    button: {
        backgroundColor: '#2f3438',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});