import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import { TextInput, Text } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

export default function DetalhesScreen({ navigation }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [dataFormatada, setDataFormatada] = useState("");

  const onDismiss = () => {
    setOpen(false);
  };

  const onConfirm = ({ date }) => {
    setOpen(false);

    if (date) {
      setData(date);
      setDataFormatada(date.toLocaleDateString("pt-BR"));
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.titulo}>
        Detalhes
      </Text>

      <Text variant="bodyLarge" style={styles.texto}>
        Aqui aparecem mais informações sobre o item escolhido.
      </Text>

      <TextInput
        label="Data"
        mode="outlined"
        textColor='black'
        value={dataFormatada}
        editable={false}
        style={styles.input}
        onPressIn={() => setOpen(true)}
        right={
          <TextInput.Icon
            icon="calendar"
            onPress={() => setOpen(true)}
          />
        }
      />

      <DatePickerModal
        locale="pt-BR"
        mode="single"
        visible={open}
        onDismiss={onDismiss}
        date={data}
        onConfirm={onConfirm}
      />

      <Button
        title="Voltar para Home"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  titulo: {
    textAlign: "center",
    marginBottom: 20,
    color: "black",
  },
  texto: {
    textAlign: "center",
    marginBottom: 20,
    color: "black",
  },
  input: {
    width: 320,
    height: 55,
    backgroundColor: 'white',
    marginBottom: 20,
  },
});
