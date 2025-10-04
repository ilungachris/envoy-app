// /app/components/Brand.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LOGO_URL } from '../assets/logo';

const colors = {
  primaryDark: '#174D7D',
  primary: '#2161AD',
  subtle: '#F8FAFC',
  white: '#FFFFFF',
};

export default function Brand({ subtitle }: { subtitle?: string }) {
  return (
    <View style={S.wrap}>
      <Image source={{ uri: LOGO_URL }} style={S.logo} resizeMode="contain" />
      <View style={{ alignItems: 'center' }}>
        <Text style={S.title}>Envoy</Text>
        {subtitle ? <Text style={S.sub}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8, marginBottom: 12 },
  logo: { width: 72, height: 72, borderRadius: 8, backgroundColor: colors.subtle },
  title: { fontSize: 24, fontWeight: '800', color: colors.primaryDark },
  sub: { color: colors.primary, marginTop: 2 },
});
