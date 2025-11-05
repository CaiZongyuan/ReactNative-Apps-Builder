import { Colors } from '@/constants/Colors';
import { db } from '@/lib/db';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const Page = () => {
  const [sentEmail, setSentEmail] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    db.auth
      .sendMagicCode({ email })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to send verification email. Please try again.');
      })
      .then(() => {
        setSentEmail(`Email sent to ${email} - Check your inbox`);
      });
  };

  const handleVerifyCode = () => {
    db.auth.signInWithMagicCode({ email, code }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <View style={styles.container}>
      {sentEmail ? (
        <>
          <Text style={styles.sentEmailText}>A verification code has been sent to your email.</Text>
          <TextInput style={styles.input} value={code} onChangeText={setCode} placeholder="Code" />
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>Verify Code</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.text}>
            Enter your email, and we'll send you a verification code.
            {'\n'}
            We'll create an account for you too if you don't already have one.
          </Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            keyboardType="email-address"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Send Verification Email</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  input: {
    width: '60%',
    height: 44,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 8,
    marginVertical: 16,
    backgroundColor: '#fff',
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
  sentEmailContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sentEmailText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
