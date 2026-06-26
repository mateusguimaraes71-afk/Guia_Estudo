import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { areasDoConhecimento } from "./Guia_Estudos";

const hoje = () => new Date().toISOString().slice(0, 10);

const agendaStorage = {};

function getAgendaEntriesByDate(date = hoje()) {
  return agendaStorage[date] || {};
}

function saveAgendaEntriesForDate(date, entries) {
  agendaStorage[date] = entries;
}

function formatDateLabel(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getMonthLabel(date) {
  return date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

function getMonthCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const weekDayOfFirst = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const weeks = [];
  let currentWeek = Array.from({ length: 7 }).fill(null);
  let day = 1;

  for (let i = weekDayOfFirst; i < 7; i += 1) {
    currentWeek[i] = day;
    day += 1;
  }
  weeks.push(currentWeek);

  while (day <= daysInMonth) {
    const week = Array.from({ length: 7 }).fill(null);
    for (let i = 0; i < 7 && day <= daysInMonth; i += 1) {
      week[i] = day;
      day += 1;
    }
    weeks.push(week);
  }

  return weeks;
}

function parseAreaSubjects(area) {
  if (!area?.guia) return [];
  return area.guia
    .split("\n")
    .slice(1)
    .map((line) => line.replace(/^\s*\d+\.\s*/, "").trim())
    .filter(Boolean);
}

export default function DetalhesScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(hoje());
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const [year, month] = hoje().split("-");
    return { year: Number(year), month: Number(month) - 1 };
  });
  const [subjectByArea, setSubjectByArea] = useState({});
  const [showDateOptions, setShowDateOptions] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState(null);

  useEffect(() => {
    const saved = getAgendaEntriesByDate(selectedDate);
    setSubjectByArea(saved);
    setSelectedAreaId(null);
    setShowDateOptions(false);
    const date = new Date(selectedDate);
    setVisibleMonth({ year: date.getFullYear(), month: date.getMonth() });
  }, [selectedDate]);

  const selectedArea = areasDoConhecimento.find((area) => area.id === selectedAreaId);

  const calendarWeeks = getMonthCalendar(visibleMonth.year, visibleMonth.month);

  const toggleTopicSelection = (areaId, topic) => {
    setSubjectByArea((prev) => {
      const currentTopics = prev[areaId] || [];
      const nextTopics = currentTopics.includes(topic)
        ? currentTopics.filter((item) => item !== topic)
        : [...currentTopics, topic];

      const next = {
        ...prev,
        [areaId]: nextTopics,
      };
      saveAgendaEntriesForDate(selectedDate, next);
      return next;
    });
  };

  const selectedCount = (areaId) => (subjectByArea[areaId] || []).length;

  const moveMonth = (direction) => {
    setVisibleMonth((prev) => {
      const nextDate = new Date(prev.year, prev.month + direction, 1);
      return { year: nextDate.getFullYear(), month: nextDate.getMonth() };
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Agenda de Estudos</Text>

      <Text style={styles.label}>Pesquisar data</Text>
      <TouchableOpacity onPress={() => setShowDateOptions((prev) => !prev)}>
        <TextInput
          style={styles.searchInput}
          value={formatDateLabel(selectedDate)}
          placeholder="Clique para ver o calendário"
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      {showDateOptions && (
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <Button title="◀" onPress={() => moveMonth(-1)} />
            <Text style={styles.calendarTitle}>{getMonthLabel(new Date(visibleMonth.year, visibleMonth.month, 1))}</Text>
            <Button title="▶" onPress={() => moveMonth(1)} />
          </View>

          <View style={styles.weekDaysRow}>
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day) => (
              <Text key={day} style={styles.weekDayLabel}>{day}</Text>
            ))}
          </View>

          {calendarWeeks.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} style={styles.weekRow}>
              {week.map((day, dayIndex) => {
                const dateString = day
                  ? new Date(visibleMonth.year, visibleMonth.month, day).toISOString().slice(0, 10)
                  : null;
                const isSelected = dateString === selectedDate;
                return (
                  <View key={`day-${weekIndex}-${dayIndex}`} style={styles.dayCell}>
                    {day ? (
                      <TouchableOpacity
                        style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
                        onPress={() => {
                          setSelectedDate(dateString);
                          setShowDateOptions(false);
                        }}
                      >
                        <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{day}</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.dayEmpty} />
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      )}

      <View style={styles.areaList}>
        <Text style={styles.sectionTitle}>Áreas de conhecimento</Text>
        {areasDoConhecimento.map((area) => (
          <TouchableOpacity
            key={area.id}
            style={[
              styles.areaButton,
              selectedAreaId === area.id && styles.areaButtonSelected,
            ]}
            onPress={() => setSelectedAreaId(area.id)}
          >
            <Text style={styles.areaButtonText}>{area.nome}</Text>
            <Text style={styles.areaButtonCount}>{selectedCount(area.id)} selecionada(s)</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedArea && (
        <View style={styles.subjectsContainer}>
          <Text style={styles.sectionTitle}>Matérias de {selectedArea.nome}</Text>
          {parseAreaSubjects(selectedArea).map((topic) => {
            const selectedTopics = subjectByArea[selectedAreaId] || [];
            const isSelected = selectedTopics.includes(topic);
            return (
              <TouchableOpacity
                key={topic}
                style={[styles.topicButton, isSelected && styles.topicButtonSelected]}
                onPress={() => toggleTopicSelection(selectedAreaId, topic)}
              >
                <Text style={[styles.topicText, isSelected && styles.topicTextSelected]}>{topic}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.summaryBox}>
        <Text style={styles.sectionTitle}>Agenda para {formatDateLabel(selectedDate)}</Text>
        {areasDoConhecimento.map((area) => {
          const topics = subjectByArea[area.id] || [];
          if (topics.length === 0) return null;
          return (
            <View key={area.id} style={styles.summaryArea}>
              <Text style={styles.summaryAreaTitle}>{area.nome}</Text>
              {topics.map((topic) => (
                <Text key={topic} style={styles.summaryTopic}>• {topic}</Text>
              ))}
            </View>
          );
        })}
        {areasDoConhecimento.every((area) => (subjectByArea[area.id] || []).length === 0) && (
          <Text style={styles.noSelectionText}>Nenhuma matéria selecionada para essa data.</Text>
        )}
      </View>

      <View style={styles.botaoVoltar}>
        <Button title="Voltar para a lista" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  calendarContainer: {
    marginVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  weekDayLabel: {
    width: 30,
    textAlign: "center",
    fontWeight: "700",
    color: "#555",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dayCell: {
    width: 30,
    alignItems: "center",
  },
  dayButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef6ff",
  },
  dayButtonSelected: {
    backgroundColor: "#1a73e8",
  },
  dayText: {
    color: "#333",
  },
  dayTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  dayEmpty: {
    width: 30,
    height: 30,
  },
  areaList: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  areaButton: {
    backgroundColor: "#eef6ff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  areaButtonSelected: {
    backgroundColor: "#d0e3ff",
    borderWidth: 1,
    borderColor: "#1a73e8",
  },
  areaButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  areaButtonCount: {
    marginTop: 4,
    color: "#555",
  },
  subjectsContainer: {
    marginBottom: 20,
  },
  topicButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  topicButtonSelected: {
    backgroundColor: "#1a73e8",
    borderColor: "#174ea6",
  },
  topicText: {
    fontSize: 15,
  },
  topicTextSelected: {
    color: "#fff",
  },
  summaryBox: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#eef6ff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#b8d7ff",
  },
  summaryArea: {
    marginBottom: 12,
  },
  summaryAreaTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  summaryTopic: {
    marginLeft: 10,
    fontSize: 14,
    marginTop: 4,
    color: "#333",
  },
  noSelectionText: {
    color: "#666",
    fontSize: 15,
  },
  botaoVoltar: {
    marginTop: 10,
  },
});
