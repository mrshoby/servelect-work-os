import { Text, View } from "react-native";
import { MobileCard, MobileShell, styles } from "../components/MobileShell";

export default function FieldTechnician() {
  const steps = ["Check-in GPS", "Checklist instalare", "Scanare QR panou", "Foto obligatorii", "Semnătură client", "PV recepție"];
  return (
    <MobileShell title="Instalare sistem FV" subtitle="Check-in, checklist, QR, foto și PV recepție">
      <MobileCard><View style={styles.row}><Text style={styles.textStrong}>Check-in & locație</Text><Text style={styles.pillGreen}>În perimetru</Text></View><Text style={styles.textMuted}>Acuratețe GPS: 3.8 m · Cluj-Napoca</Text></MobileCard>
      <MobileCard>{steps.map((step, index) => <View key={step} style={styles.row}><Text>{index + 1}. {step}</Text><Text>{index < 3 ? "✓" : "○"}</Text></View>)}<View style={styles.button}><Text style={styles.buttonText}>PAS URMĂTOR</Text></View></MobileCard>
    </MobileShell>
  );
}
