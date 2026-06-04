import { Text, View } from "react-native";
import { MobileCard, MobileShell, styles } from "../components/MobileShell";
import { tasks, projects } from "@servelect/shared";

export default function HomeMobile() {
  return (
    <MobileShell title="Acasă" subtitle="SERVELECT EMP mobile">
      <MobileCard><Text style={styles.textStrong}>Taskuri azi</Text>{tasks.slice(0, 4).map((task) => <View key={task.id} style={styles.row}><Text>{task.title}</Text><Text style={styles.pillGreen}>{task.priority}</Text></View>)}</MobileCard>
      <MobileCard><Text style={styles.textStrong}>Proiecte active</Text>{projects.slice(0, 3).map((p) => <View key={p.id} style={styles.row}><Text>{p.code}</Text><Text>{p.progress}%</Text></View>)}</MobileCard>
      <MobileCard><Text style={styles.textStrong}>Producție live</Text><Text style={{fontSize: 34, fontWeight: "900", color: "#0B8F43"}}>8.42 MW</Text><Text style={styles.textMuted}>42.85 MWh produse azi</Text></MobileCard>
    </MobileShell>
  );
}
