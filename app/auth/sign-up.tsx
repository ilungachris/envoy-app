import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import { signUp, getMyProfile } from '../lib/db';
import Brand from '../components/Brand';
import { theme } from '../theme';

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState(''); const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    if (!firstName || !lastName || !email || !password) { Alert.alert('Missing info', 'All fields are required.'); return; }
    try {
      setLoading(true);
      await signUp(email.trim(), password, firstName.trim(), lastName.trim());
      const p = await getMyProfile().catch(() => null);
      if (!p?.first_name || !p?.last_name) router.replace('/profile'); else router.replace('/');
    } catch (e: any) { Alert.alert('Sign up failed', e?.message ?? 'Unknown error'); } finally { setLoading(false); }
  };
  return (
    <View style={{ flex:1, padding:16, justifyContent:'center', gap:10 }}>
      <Brand subtitle="Create account" />
      <TextInput placeholder="First name" value={firstName} onChangeText={setFirstName}
        style={{ borderWidth:1, borderColor: theme.colors.primary, padding:10, borderRadius: theme.radius }} />
      <TextInput placeholder="Last name" value={lastName} onChangeText={setLastName}
        style={{ borderWidth:1, borderColor: theme.colors.primary, padding:10, borderRadius: theme.radius }} />
      <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail}
        style={{ borderWidth:1, borderColor: theme.colors.primary, padding:10, borderRadius: theme.radius }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword}
        style={{ borderWidth:1, borderColor: theme.colors.primary, padding:10, borderRadius: theme.radius }} />
      {loading ? <ActivityIndicator/> : <Button title="Create account" onPress={onSubmit} />}
      <Pressable onPress={() => router.replace('/auth/sign-in')} style={{ marginTop:12 }}>
        <Text style={{ color: theme.colors.primary, textAlign:'center' }}>Back to Sign in</Text>
      </Pressable>
    </View>
  );
}

