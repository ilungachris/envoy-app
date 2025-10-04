// /app/onboarding/visitor.tsx — public Connect Card
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import Brand from '../components/Brand';
import { theme } from '../theme';
import { submitConnectCard } from '../lib/db';

export default function VisitorCard() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [how, setHow]           = useState('');
  const [notes, setNotes]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  const onSubmit = async () => {
    if (!fullName.trim()) { Alert.alert('Missing name', 'Please enter your full name.'); return; }
    try {
      setLoading(true);
      await submitConnectCard({
        full_name: fullName.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        how_hear: how.trim() || null,
        notes: notes.trim() || null,
      });
      setDone(true);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Could not submit.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <View style={S.page}>
        <Brand subtitle="Thank you!" />
        <Text style={S.msg}>We’ve received your details. Someone will contact you soon.</Text>
      </View>
    );
  }

  return (
    <View style={S.page}>
      <Brand subtitle="Visitor Connect Card" />
      <TextInput placeholder="Full name *" value={fullName} onChangeText={setFullName} style={S.input} />
      <TextInput placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} style={S.input} />
      <TextInput placeholder="Phone" keyboardType="phone-pad" value={phone} onChangeText={setPhone} style={S.input} />
      <TextInput placeholder="How did you hear about us?" value={how} onChangeText={setHow} style={S.input} />
      <TextInput placeholder="Notes (optional)" value={notes} onChangeText={setNotes} style={[S.input, { height: 90 }]} multiline />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Pressable style={[S.btn, S.primary]} onPress={onSubmit}>
          <Text style={S.primaryText}>Submit</Text>
        </Pressable>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  page: { flex:1, backgroundColor: theme.colors.bg, padding: 16, gap: 10, justifyContent:'center' },
  input: { borderWidth:1, borderColor: theme.colors.primary, borderRadius: theme.radius, padding: 12, backgroundColor: theme.colors.white },
  btn: { paddingVertical: 14, borderRadius: theme.radius, alignItems:'center', borderWidth:1 },
  primary: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
  primaryText: { color: theme.colors.white, fontWeight:'700' },
  msg: { color: theme.colors.primaryDark, textAlign:'center', fontSize: 16 },
});
