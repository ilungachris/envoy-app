import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import { signIn, getMyProfile } from '../lib/db';
import Brand from '../components/Brand';
import { theme } from '../theme';

export default function SignInScreen() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    if (!email || !password) { Alert.alert('Missing info', 'Email and password required.'); return; }
    try {
      setLoading(true);
      const { error } = await signIn(email.trim(), password);
      if (error) throw error;
      const p = await getMyProfile().catch(() => null);
      if (!p?.first_name || !p?.last_name) router.replace('/profile'); else router.replace('/');
    } catch (e: any) { Alert.alert('Sign in failed', e?.message ?? 'Unknown error'); } finally { setLoading(false); }
  };
  return (
    <View style={{ flex:1, padding:16, justifyContent:'center', gap:10 }}>
      <Brand subtitle="Sign in" />
      <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail}
        style={{ borderWidth:1, borderColor: theme.colors.primary, padding:10, borderRadius: theme.radius }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword}
        style={{ borderWidth:1, borderColor: theme.colors.primary, padding:10, borderRadius: theme.radius }} />
      {loading ? <ActivityIndicator/> : <Button title="Sign in" onPress={onSubmit} />}
      <Pressable onPress={() => router.push('/auth/sign-up')} style={{ marginTop:12 }}>
        <Text style={{ color: theme.colors.primary, textAlign:'center' }}>Create an account</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/auth/forgot')} style={{ marginTop:8 }}>
        <Text style={{ color: theme.colors.accent, textAlign:'center' }}>Forgot password?</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/onboarding')} style={{ marginTop:16 }}>
        <Text style={{ color: theme.colors.gold, textAlign:'center', fontWeight:'700' }}>I am a Visitor</Text>
      </Pressable>
    </View>
  );
}

