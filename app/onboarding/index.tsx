// /app/onboarding/index.tsx — public hub: Visitor / Member
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Brand from '../components/Brand';
import { theme } from '../theme';

export default function OnboardingHub() {
  return (
    <View style={S.page}>
      <Brand subtitle="Welcome! Choose how to start" />
      <Pressable style={[S.btn, S.primary]} onPress={() => router.push('/onboarding/visitor')}>
        <Text style={S.primaryText}>I am a Visitor</Text>
      </Pressable>
      <Pressable style={[S.btn, S.outline]} onPress={() => router.push('/auth/sign-up')}>
        <Text style={S.outlineText}>I am a Member</Text>
      </Pressable>
      <Text style={S.tip}>Already have an account? <Text style={{color: theme.colors.primary}}>Sign in</Text> from the menu.</Text>
    </View>
  );
}
const S = StyleSheet.create({
  page: { flex:1, backgroundColor: theme.colors.bg, padding: 16, justifyContent:'center', gap: 12 },
  btn: { paddingVertical: 14, borderRadius: theme.radius, alignItems:'center', borderWidth:1 },
  primary: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  primaryText: { color: theme.colors.white, fontWeight:'700' },
  outline: { backgroundColor: theme.colors.subtle, borderColor: theme.colors.primary },
  outlineText: { color: theme.colors.primary, fontWeight:'700' },
  tip: { textAlign:'center', color: theme.colors.primary, marginTop: 6 },
});

