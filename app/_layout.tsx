// /app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { getSupabase } from './lib/supabaseClient';
import NavBar from './components/NavBar';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const isAuthRoute = pathname?.startsWith('/auth') ?? false;
  const isResetRoute = pathname === '/auth/reset';
  const isForgotRoute = pathname === '/auth/forgot';
  const isOnboardingRoute = pathname?.startsWith('/onboarding') ?? false;
  const isProfileRoute = pathname === '/profile';

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) { setReady(true); return; }
    let cancelled = false;

    const handleRoute = async () => {
      try {
        const { data: { session } } = await sb.auth.getSession();
        if (cancelled) return;
        setHasSession(!!session);

        // Signed OUT → allow auth and onboarding routes; block others
        if (!session) {
          if (!(isAuthRoute || isOnboardingRoute)) router.replace('/auth/sign-in');
          return;
        }

        // Signed IN but on /auth/reset → stay
        if (isResetRoute) return;

        // Profile completion gate (skip on auth/onboarding)
        if (!(isAuthRoute || isOnboardingRoute)) {
          const { data, error } = await sb
            .from('profiles')
            .select('first_name,last_name')
            .eq('id', session.user.id)
            .single();

          if (!error && (!data?.first_name || !data?.last_name)) {
            if (!isProfileRoute) router.replace('/profile');
            return;
          }
        }

        // Signed-in users on /auth (except forgot/reset) → Home
        if (isAuthRoute && !isResetRoute && !isForgotRoute) {
          router.replace('/');
          return;
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    handleRoute();
    const { data: sub } = sb.auth.onAuthStateChange((_e) => handleRoute());
    return () => { cancelled = true; sub?.subscription?.unsubscribe?.(); };
  }, [pathname]);

  if (!ready) return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <ActivityIndicator />
    </View>
  );

  const hideNav = isAuthRoute || isOnboardingRoute;
  return (
    <View style={{ flex: 1 }}>
      {hasSession && !hideNav ? <NavBar /> : null}
      <Slot />
    </View>
  );
}

