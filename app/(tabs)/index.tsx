import { deleteNotes, getNotes, putNotes } from "@/services/noteService";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedNote, setEditedNote] = useState<string>("");
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleEditNote = (note: Note) => {
    setIsEditing(true);
    setNoteToEdit(note);
    setEditedNote(note.content);
  };

  const handleSaveEdit = async () => {
    if (!noteToEdit) return;

    try {
      const titleNote = editedNote.split(" ").slice(0, 3).join(" ");

      const updatedNote = {
        title: titleNote,
        content: editedNote,
      };

      await putNotes(noteToEdit.id, updatedNote);

      setNotes((prev) => prev.map((note) => (note.id === noteToEdit.id ? { ...note, ...updatedNote } : note)));
      setIsEditing(false);
      setNoteToEdit(null);
      setEditedNote("");
    } catch (error) {
      console.error("Erro ao salvar a edição:", error);
    }
  };

  const handleDeleteNote = (id: string) => {
    if (Platform.OS === "web") {
      const confirmDelete = window.confirm("Você tem certeza que deseja excluir esta nota?");

      if (confirmDelete) {
        deleteNoteFromAPI(id);
      }
    } else {
      Alert.alert("Excluir Nota", "Você tem certeza que deseja excluir esta nota?", [
        { text: "Cancelar" },
        { text: "Excluir", onPress: () => deleteNoteFromAPI(id) },
      ]);
    }
  };

  const deleteNoteFromAPI = async (id: string) => {
    try {
      await deleteNotes(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Erro ao excluir a nota:", error);
    }
  };

  const getFirstWords = (text: string) => {
    const words = text.split(" ");
    return words.slice(0, 3).join(" ") + (words.length > 3 ? " ..." : "");
  };

  const handleAddNote = () => {
    router.push("/create");
  };

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const response = await getNotes();
      if ("data" in response) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar as notas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notas</Text>

      {isLoading ? (
        <View style={styles.noNotesContainer}>
          <ActivityIndicator size={30} color="#26a93f" />
        </View>
      ) : notes.length === 0 ? (
        <View style={styles.noNotesContainer}>
          <TouchableOpacity style={styles.buttonAddNote} onPress={handleAddNote}>
            <Text style={styles.buttonText}>Adicione sua primeira nota</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {isEditing && noteToEdit ? (
            <View style={styles.editContainer}>
              <View style={styles.containerButton}>
                <TouchableOpacity onPress={() => setIsEditing(false)}>
                  <Ionicons name="arrow-back-circle" size={35} color="#26a93f" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveEdit}>
                  <Ionicons name="checkmark-circle" size={35} color="#26a93f" />
                </TouchableOpacity>
              </View>

              <View style={styles.divisor} />

              <ScrollView style={styles.scrollContainer}>
                <TextInput
                  style={[styles.textInput, { height: 500 }]}
                  value={editedNote}
                  onChangeText={setEditedNote}
                  multiline
                  placeholder="Edite sua nota..."
                  placeholderTextColor="#888"
                />
              </ScrollView>
            </View>
          ) : (
            <FlatList
              data={notes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.noteContainer, { backgroundColor: "#fff" }]}>
                  <TouchableOpacity onPress={() => handleEditNote(item)}>
                    <Text style={styles.noteText}>{getFirstWords(item.content)}</Text>
                  </TouchableOpacity>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => handleDeleteNote(item.id)}>
                      <FontAwesome name="trash" size={17} color="#000" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              contentContainerStyle={styles.listContainer}
              style={{ flex: 1 }}
            />
          )}
        </>
      )}
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
    marginBottom: 30,
    marginTop: 35,
    height: 1,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#ddd",
    position: "relative",
  },
  noNotesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    marginBottom: 150,
  },
  buttonAddNote: {
    backgroundColor: "#26a93f",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  containerButton: {
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "#f0f4f8",
    right: "12%",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  buttonTextBack: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  buttonTransparent: {
    borderRadius: 20,
    backgroundColor: "#000",
  },
  editContainer: {
    padding: 10,
    backgroundColor: "#f0f4f8",
  },
  scrollContainer: {
    width: "100%",
    minHeight: "80%",
    maxHeight: "90%",
    borderRadius: 30,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noteContainer: {
    padding: 18,
    marginVertical: 10,
    marginHorizontal: 2,
    backgroundColor: "#f0f4f8",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noteText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E57373",
    borderRadius: 10,
  },
  buttonSave: {
    backgroundColor: "#26a93f",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 5,
  },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#f0f4f8",
  },
  iconButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonBack: {
    backgroundColor: "#f0f4f8",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 5,
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
  dragIconContainer: {
    padding: 10,
    marginHorizontal: 4,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#e0e4e8",
    justifyContent: "center",
  },
});
