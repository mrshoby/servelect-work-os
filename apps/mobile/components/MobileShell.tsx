import { ReactNode } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export function MobileShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}><Text style={styles.title}>{title}</Text><Text style={styles.subtitle}>{subtitle}</Text></View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function MobileCard({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 18, gap: 14 },
  header: { marginBottom: 4 },
  title: { fontSize: 28, fontWeight: "800", color: "#0F172A" },
  subtitle: { color: "#64748B", marginTop: 4 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", gap: 10 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  textStrong: { fontWeight: "800", color: "#0F172A" },
  textMuted: { color: "#64748B" },
  pillGreen: { backgroundColor: "#E8F8EF", color: "#0B8F43", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: "hidden", fontWeight: "700" },
  button: { backgroundColor: "#0B8F43", borderRadius: 16, padding: 14, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontWeight: "800" }
});
