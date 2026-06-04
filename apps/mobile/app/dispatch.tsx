import { Text, View } from "react-native";
import { MobileCard, MobileShell, styles } from "../components/MobileShell";

export default function DispatchMobile() {
  return (
    <MobileShell title="Hartă & dispatch" subtitle="Intervenții, ETA și SLA">
      <MobileCard><View style={{height: 320, borderRadius: 22, backgroundColor: "#E8F8EF", alignItems: "center", justifyContent: "center"}}><Text style={styles.textStrong}>Hartă mock intervenții</Text><Text style={styles.textMuted}>P-2024-0187 · ETA 18 min</Text></View></MobileCard>
      <MobileCard><Text style={styles.textStrong}>Alertă risc SLA</Text><Text style={{color: "#EF4444", fontWeight: "800"}}>SLA depășire în 18 min</Text><View style={styles.button}><Text style={styles.buttonText}>ASIGNEAZĂ INTERVENȚIA</Text></View></MobileCard>
    </MobileShell>
  );
}
