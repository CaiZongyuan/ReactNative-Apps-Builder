import EvalComp from '@/components/EvalComp';
import { Colors } from '@/constants/Colors';
import { db } from '@/lib/db';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedView, setSelectedView] = useState<'code' | 'preview'>('code');

  const { isLoading, error, data } = db.useQuery({
    builds: {
      $: { where: { id } },
    },
  });
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!data || !data.builds[0]) {
    return <Text>Build not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: data?.builds[0].title || 'Build' }} />
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tab} onPress={() => setSelectedView('code')}>
          <Text
            style={[
              styles.tabText,
              { color: selectedView === 'code' ? Colors.primary : Colors.gray },
            ]}>
            Code
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setSelectedView('preview')}>
          <Text
            style={[
              styles.tabText,
              { color: selectedView === 'preview' ? Colors.primary : Colors.gray },
            ]}>
            Preview
          </Text>
        </TouchableOpacity>
      </View>
      {selectedView === 'code' && (
        <ScrollView style={styles.code}>
          <Text style={styles.code}>{data?.builds[0].code}</Text>
        </ScrollView>
      )}
      {selectedView === 'preview' && <EvalComp id={id} />}
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    gap: 10,
    margin: 10,
  },
  tab: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.gray,
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  code: {
    fontSize: 14,
    fontFamily: 'monospace',
    padding: 10,
  },
});
