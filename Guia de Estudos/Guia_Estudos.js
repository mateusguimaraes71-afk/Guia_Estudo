import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

export const areasDoConhecimento = [
  {
    id: "matematica",
    nome: "Matematica",
    guia:
      "Matematica a seguir:\n1. razao e proporcao\n2. funcao do primeiro grau\n3. geometria plana\n4. progressao aritmetica",
  },
  {
    id: "fisica",
    nome: "Fisica",
    guia:
      "Fisica a seguir:\n1. cinemica e leis de Newton\n2. trabalho, energia e potencia\n3. eletrostatica e corrente continua\n4. ondas e optica",
  },
  {
    id: "quimica",
    nome: "Quimica",
    guia:
      "Quimica a seguir:\n1. ligacoes quimicas e tabela periodica\n2. estequiometria e reacoes\n3. atomos e moleculas\n4. solubilidade e equilibrio",
  },
  {
    id: "historia",
    nome: "Historia",
    guia:
      "Historia a seguir:\n1. historia do Brasil e republica\n2. idade media e moderna\n3. guerras mundiais\n4. brasil contemporaneo",
  },
  {
    id: "filosofia",
    nome: "Filosofia",
    guia:
      "Filosofia a seguir:\n1. etica e politica\n2. pensamento filosofico e correntes\n3. filosofia da ciencia\n4. filosofia social e moral",
  },
  {
    id: "biologia",
    nome: "Biologia",
    guia:
      "Biologia a seguir:\n1. citologia e histologia\n2. genetica basica\n3. ecologia e meio ambiente\n4. evolucao e biodiversidade",
  },
];

export default function ListaScreen({ navigation }) {
  const [areasAbertas, setAreasAbertas] = useState({});
  const [completedTopics, setCompletedTopics] = useState({});

  const toggleGuia = (id) => {
    setAreasAbertas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const parseAreaSubjects = (area) => {
    if (!area?.guia) return [];
    return area.guia
      .split("\n")
      .slice(1)
      .map((line) => line.replace(/^\s*\d+\.\s*/, "").trim())
      .filter(Boolean);
  };

  const toggleTopicComplete = (areaId, topic) => {
    setCompletedTopics((prev) => {
      const currentCompleted = prev[areaId] || {};
      const alreadyCompleted = !!currentCompleted[topic];
      const nextCompleted = { ...currentCompleted };

      if (alreadyCompleted) {
        delete nextCompleted[topic];
      } else {
        nextCompleted[topic] = true;
      }

      return { ...prev, [areaId]: nextCompleted };
    });
  };

  const resetProgress = (areaId) => {
    setCompletedTopics((prev) => ({ ...prev, [areaId]: {} }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Guia de Estudos</Text>
      <Text style={styles.subtitulo}>
        Use o botão abaixo para abrir a agenda.
      </Text>

      <View style={styles.agendaButtonContainer}>
        <Button title="Agenda" onPress={() => navigation.navigate("Detalhes")} />
      </View>

      {areasDoConhecimento.map((area) => {
        const topics = parseAreaSubjects(area);
        const completedForArea = completedTopics[area.id] || {};
        const completedCount = Object.keys(completedForArea).length;
        const totalCount = topics.length;
        const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
        return (
          <View key={area.id} style={styles.card}>
            <Text style={styles.itemTitulo}>{area.nome}</Text>
            <View style={styles.progressWrapper}>
              <View style={styles.progressLine}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
                <Text style={styles.progressLabel}>{progress}%</Text>
              </View>
              <Text style={styles.progressText}>
                {completedCount} de {totalCount} tópicos concluídos
              </Text>
            </View>

            {areasAbertas[area.id] && (
              <>
                {topics.map((topic) => (
                  <TouchableOpacity key={topic} onPress={() => toggleTopicComplete(area.id, topic)} style={styles.topicRow}>
                    <View style={styles.checkbox}>
                      <Text>{completedForArea[topic] ? '✅' : '⬜'}</Text>
                    </View>
                    <Text style={completedForArea[topic] ? styles.topicDoneText : styles.guia}>{topic}</Text>
                  </TouchableOpacity>
                ))}

                <View style={styles.cardButtons}>
                  <Button title="Resetar" onPress={() => resetProgress(area.id)} />
                </View>
              </>
            )}

            <Button
              title={areasAbertas[area.id] ? "Esconder" : "Mostrar"}
              onPress={() => toggleGuia(area.id)}
            />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  agendaButtonContainer: {
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  itemTitulo: {
    fontSize: 18,
    marginBottom: 10,
  },
  guia: {
    marginBottom: 12,
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  progressWrapper: {
    marginBottom: 12,
  },
  progressLine: {
    height: 24,
    backgroundColor: "#e5e5e5",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
    justifyContent: "center",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2c9f34",
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "700",
    alignSelf: "center",
    zIndex: 1,
  },
  progressText: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  checkbox: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  topicDoneText: {
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 24,
    color: "#999",
    textDecorationLine: "line-through",
  },
  progressText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 8,
  },
});
