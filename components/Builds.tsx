import { Colors } from '@/constants/Colors';
import { AppSchema } from '@/instant.schema';
import { db } from '@/lib/db';
import { Ionicons } from '@expo/vector-icons';
import { InstaQLEntity } from '@instantdb/react-native';
import { Link } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Build = Pick<InstaQLEntity<AppSchema, 'builds', {}>, 'id' | 'title' | 'isPreviewable'>;

const Builds = () => {
  const user = db.useUser();
  const { isLoading, error, data } = db.useQuery({
    builds: {
      $: {
        fields: ['id', 'title', 'isPreviewable'],
        where: {
          owner: user.id,
        },
      },
    },
  });

  console.log('🚀 ~ Builds ~ data:', data);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  const builds = data.builds;

  const renderListItem = ({ item }: { item: Build }) => {
    return (
      <Link href={`/build/${item.id}`} asChild>
        <TouchableOpacity style={styles.buildItem}>
          <View>
            <Text style={styles.buildItemTitle}>{item.title}</Text>
            <Text style={styles.buildItemStatus}>
              {item.isPreviewable ? 'Previewable' : 'Not Previewable'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Previous Builds</Text>
      <FlatList
        data={builds}
        renderItem={renderListItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No builds found</Text>}
        contentContainerStyle={{ gap: 10, flex: 1 }}
      />
    </View>
  );
};
export default Builds;
const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.gray,
  },
  buildItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.gray,
    backgroundColor: '#fff',
    gap: 10,
  },
  buildItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  buildItemStatus: {
    fontSize: 12,
    color: Colors.gray,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
  },
});
