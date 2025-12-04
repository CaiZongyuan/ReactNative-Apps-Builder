import Builds from '@/components/Builds';
import { Colors } from '@/constants/Colors';
import { db } from '@/lib/db';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Index() {
  const [prompt, setPrompt] = useState('Build a Tic Tac Toe game');
  const user = db.useUser();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    const appPrompt = prompt;
    setPrompt('');

    setIsGenerating(true);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        RefreshToken: `${user.refresh_token}`,
      },
      body: JSON.stringify({ prompt: appPrompt }),
    });
    setIsGenerating(false);
    if (!response.ok) {
      console.error('Failed to get response from LLM');
    }

    const data = await response.json();
    console.log('Data ->', data);
    router.push(`/build/${data.buildId}`);
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      {isGenerating && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 10,
            },
          ]}>
          <ActivityIndicator size="large" color={'#fff'} />
        </View>
      )}
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          multiline={true}
          numberOfLines={5}
          textAlignVertical="top"
          placeholder="Build a workout tracker..."
          value={prompt}
          onChangeText={setPrompt}
        />
        <TouchableOpacity style={styles.button} onPress={handleGenerate}>
          <Text style={styles.buttonText}>Generate Mini App</Text>
        </TouchableOpacity>
      </View>
      <Builds />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 8,
    marginVertical: 16,
    backgroundColor: '#fff',
    minHeight: 120,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
