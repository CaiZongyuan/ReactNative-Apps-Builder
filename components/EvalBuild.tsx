import codeStrToReactElement from "@/utils/codeStrToReactElement";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ParseResult = { element: React.ReactElement } | { error: string };

function parseResult(instantAppId: string, code: string): ParseResult { 
  try { 
     const element = codeStrToReactElement(instantAppId, code);
     return { element: element }
  } catch (e: any) { 
    console.error('Uh oh', e);
    return { error: e.message || "Oi, sorry about that, we couldn't parse this code." }
  }
}

export default function EvalBuild({ code, instantAppId }: { instantAppId: string; code: string, }) {  
  const parsed = useMemo(() => parseResult(instantAppId, code), [instantAppId, code]);
  if ('error' in parsed) { 
    return (
      <View>
        <Text>{parsed.error}</Text>
      </View>
    )
  }
  const { element } = parsed;
  return (
    <SafeAreaView style={{ flex: 1 }}>{ element }</SafeAreaView>
  )
}
