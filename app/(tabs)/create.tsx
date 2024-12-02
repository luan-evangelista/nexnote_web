import { postNotes } from "@/services/noteService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreateNoteScreen() {
  const [note, setNote] = useState("");

  const handleSaveNote = async () => {
    try {
      const titleNote = note.split(" ").slice(0, 3).join(" ");

      const data: CreateNotes = {
        title: titleNote,
        content: note,
      };

      await postNotes(data);

      router.push("/(tabs)");
      setNote("");
    } catch (error) {
      console.error("Erro ao salvar a nota:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie uma nova nota!</Text>

      <View style={styles.topActionContainer}>
        <TouchableOpacity
          onPress={handleSaveNote}
          disabled={note.trim() === ""}
          style={{ opacity: note.trim() === "" ? 0.5 : 1 }}
        >
          <Ionicons name="checkmark-circle" size={35} color="#26a93f" />
        </TouchableOpacity>
      </View>

      <View style={styles.divisor} />

      <View style={styles.editContainer}>
        <ScrollView style={styles.scrollContainer}>
          <TextInput
            style={[styles.textInput, { height: 500 }]}
            placeholder="Escreva sua nota aqui..."
            placeholderTextColor="#777"
            multiline
            value={note}
            onChangeText={setNote}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#2d3748",
    textAlign: "center",
  },
  divisor: {
    marginBottom: 20,
    marginTop: 45,
    height: 1,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#ddd",
    position: "relative",
  },
  topActionContainer: {
    position: "absolute",
    right: "12%",
    marginTop: 43,
  },
  scrollContainer: {
    width: "100%",
    minHeight: "80%",
    maxHeight: "90%",
    borderRadius: 30,
  },
  textInput: {
    width: "100%",
    padding: 20,
    borderColor: "#e0e0e0",
    borderRadius: 30,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  editContainer: {
    padding: 10,
    backgroundColor: "#f0f4f8",
  },
});
