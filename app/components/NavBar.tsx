// /app/components/NavBar.tsx — hamburger menu + logo
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import { signOut } from '../lib/db';
import { LOGO_URL } from '../assets/logo';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const go = (path: string, replace = false) => { setOpen(false); replace ? router.replace(path) : router.push(path); };

  return (
    <View style={S.wrapper}>
      <View style={S.bar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Image source={{ uri: LOGO_URL }} style={S.logo} resizeMode="contain" />
          <Text style={S.brand}>Envoy</Text>
        </View>

        <View style={S.links}>
          <Pressable onPress={() => go('/', true)} style={S.link}><Text style={S.linkText}>Home</Text></Pressable>
          <Pressable onPress={() => go('/profile')} style={S.link}><Text style={S.linkText}>Profile</Text></Pressable>
          <Pressable onPress={() => go('/admin')} style={S.link}><Text style={S.linkText}>Admin</Text></Pressable>
          <Pressable onPress={() => go('/onboarding')} style={S.link}><Text style={S.linkText}>Onboarding</Text></Pressable>
        </View>

        <Pressable onPress={() => setOpen(v => !v)} style={S.burger}>
          <Text style={S.burgerText}>☰</Text>
        </Pressable>
      </View>

      {open && (
        <View style={S.menu}>
          <Pressable onPress={() => go('/', true)} style={S.menuItem}><Text style={S.menuText}>Home</Text></Pressable>
          <Pressable onPress={() => go('/profile')} style={S.menuItem}><Text style={S.menuText}>Profile</Text></Pressable>
          <Pressable onPress={() => go('/admin')} style={S.menuItem}><Text style={S.menuText}>Admin</Text></Pressable>
          <Pressable onPress={() => go('/onboarding')} style={S.menuItem}><Text style={S.menuText}>Onboarding</Text></Pressable>
          <Pressable
            onPress={async () => { setOpen(false); await signOut(); router.replace('/auth/sign-in'); }}
            style={[S.menuItem, S.signout]}
          >
            <Text style={[S.menuText, S.signoutText]}>Sign out</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const SAFE_TOP = Platform.select({ ios: 44, android: 32, default: 24 });

const S = StyleSheet.create({
  wrapper: {
    paddingTop: SAFE_TOP, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB', zIndex: 10,
  },
  bar: {
    paddingHorizontal: 12, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#F8FAFC' },
  brand: { color: '#174D7D', fontWeight: '800', fontSize: 18 },
  links: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  link: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, backgroundColor: '#E0F2FE' },
  linkText: { color: '#2161AD', fontWeight: '600' },
  burger: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, backgroundColor: '#EDE9FE' },
  burgerText: { color: '#174D7D', fontWeight: '800', fontSize: 16 },
  menu: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingHorizontal: 12, paddingBottom: 10, gap: 8 },
  menuItem: { paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8, backgroundColor: '#F8FAFC' },
  menuText: { color: '#174D7D', fontWeight: '600' },
  signout: { backgroundColor: '#FFF7ED' },
  signoutText: { color: '#E0A33D', fontWeight: '800' },
});

