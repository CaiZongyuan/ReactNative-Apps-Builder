import { db } from '@/lib/db';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface EvalCompProps {
  id: string; // Can be build ID or slug
}

const EvalComp = ({ id }: EvalCompProps) => {
  // Fetch the build from InstantDB
  const { data, isLoading, error } = db.useQuery({
    builds: {
      $: { where: { id } },
    },
  });

  const build = data?.builds?.[0];
  // console.log('🚀 ~ EvalComp ~ build:', build);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Error loading build</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
        </View>
      </View>
    );
  }

  if (!build) {
    return (
      <View style={styles.centered}>
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Build not found</Text>
          <Text style={styles.errorMessage}>
            We couldn't find this build. Please check the ID or slug.
          </Text>
        </View>
      </View>
    );
  }

  if (!build.code) {
    return (
      <View style={styles.centered}>
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>No code available</Text>
          <Text style={styles.errorMessage}>This build doesn't have any code to display.</Text>
        </View>
      </View>
    );
  }

  // Create HTML document with the React code
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #root { width: 100%; height: 100%; overflow: auto; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        // Error handler
        window.onerror = function(msg, url, lineNo, columnNo, error) {
          const rootEl = document.getElementById('root');
          if (rootEl) {
            rootEl.innerHTML =
              '<div style="padding: 20px; color: #ef4444; font-family: monospace;">' +
              '<h3 style="margin-bottom: 10px;">Runtime Error:</h3>' +
              '<pre style="white-space: pre-wrap; overflow-x: auto;">' + msg + '<br/><br/>' + (error?.stack || '') + '</pre>' +
              '</div>';
          }
          return false;
        };

        // Load all required libraries
        let scriptsLoaded = {
          react: false,
          reactDom: false,
          babel: false,
          instant: false,
          tailwind: false
        };

        function checkAllLoaded() {
          return Object.values(scriptsLoaded).every(v => v);
        }

        function evaluateCode() {
          if (!checkAllLoaded()) return;

          try {
            // The code from the database
            const code = ${JSON.stringify(build.code)};

            // Clean the code: find the first import statement
            let cleanCode = code;
            const importIndex = cleanCode.indexOf('import ');
            if (importIndex > 0) {
              cleanCode = cleanCode.substring(importIndex);
            }

            // Trim any text after "export default App;"
            const exportText = 'export default App;';
            const exportIndex = cleanCode.indexOf(exportText);
            if (exportIndex > -1) {
              cleanCode = cleanCode.substring(0, exportIndex + exportText.length);
            }

            // Transform the TypeScript code to JavaScript with proper module transformation
            const transformedCode = Babel.transform(cleanCode, {
              presets: ['react', 'typescript'],
              plugins: [['transform-modules-commonjs', { strict: false }]],
              filename: 'app.tsx',
              sourceType: 'module'
            }).code;

            if (!transformedCode) {
              throw new Error('Failed to transform code');
            }

            // Create a function that will evaluate the code with the required context
            const evalCode = \`
              (function() {
                const exports = {};
                const module = { exports };

                // Capture arguments in variables first
                const React = arguments[0];
                const instantAppId = arguments[1];
                const instantId = arguments[2];
                const instantI = arguments[3];
                const instantInit = arguments[4];
                const InstantQLEntity = arguments[5];

                // Create a require function that provides the dependencies
                const require = function(name) {
                  if (name === 'react') {
                    return React;
                  }
                  if (name === '@instantdb/react') {
                    return {
                      id: instantId,
                      i: instantI,
                      init: instantInit,
                      InstaQLEntity: InstantQLEntity
                    };
                  }
                  throw new Error('Module not found: ' + name);
                };

                // Make these available as globals too
                const id = instantId;
                const i = instantI;
                const init = instantInit;

                \${transformedCode}

                return module.exports.default || module.exports || exports.default || exports.App || App;
              })
            \`;

            // Evaluate the code and get the component
            const evalFunc = eval(evalCode);
            const AppComponent = evalFunc(
              React,
              ${JSON.stringify(build.instantAppId)},
              window.InstantReact.id,
              window.InstantReact.i,
              window.InstantReact.init,
              window.InstantReact.InstaQLEntity || {}
            );

            if (typeof AppComponent !== 'function') {
              throw new Error('Code did not export a valid React component');
            }

            // Render the app
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(React.createElement(AppComponent));
          } catch (err) {
            console.error('Error evaluating code:', err);
            const rootEl = document.getElementById('root');
            if (rootEl) {
              rootEl.innerHTML =
                '<div style="padding: 20px; color: #ef4444; font-family: monospace;">' +
                '<h3 style="margin-bottom: 10px;">Error:</h3>' +
                '<pre style="white-space: pre-wrap; overflow-x: auto;">' + err.message + '<br/><br/>' + (err.stack || '') + '</pre>' +
                '</div>';
            }
          }
        }

        // Load React
        const reactScript = document.createElement('script');
        reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
        reactScript.crossOrigin = 'anonymous';
        reactScript.onload = () => {
          scriptsLoaded.react = true;
          evaluateCode();
        };
        document.head.appendChild(reactScript);

        // Load ReactDOM
        const reactDomScript = document.createElement('script');
        reactDomScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
        reactDomScript.crossOrigin = 'anonymous';
        reactDomScript.onload = () => {
          scriptsLoaded.reactDom = true;
          evaluateCode();
        };
        document.head.appendChild(reactDomScript);

        // Load Babel
        const babelScript = document.createElement('script');
        babelScript.src = 'https://unpkg.com/@babel/standalone/babel.min.js';
        babelScript.onload = () => {
          scriptsLoaded.babel = true;
          evaluateCode();
        };
        document.head.appendChild(babelScript);

        // Load InstantDB
        const instantScript = document.createElement('script');
        instantScript.src = 'https://unpkg.com/@instantdb/react@0.22.45/dist/index.umd.js';
        instantScript.onload = () => {
          scriptsLoaded.instant = true;
          evaluateCode();
        };
        document.head.appendChild(instantScript);

        // Load Tailwind
        const tailwindScript = document.createElement('script');
        tailwindScript.src = 'https://cdn.tailwindcss.com';
        tailwindScript.onload = () => {
          scriptsLoaded.tailwind = true;
          evaluateCode();
        };
        document.head.appendChild(tailwindScript);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
        }}
      />
    </View>
  );
};

export default EvalComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 20,
  },
  errorBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
    padding: 20,
    maxWidth: 400,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
