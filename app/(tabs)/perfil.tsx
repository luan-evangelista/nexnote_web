import logo from "@/assets/images/logo.png";
import { deleteAllNotes } from "@/services/noteService";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Perfil() {
  const router = useRouter();

  const handleDelete = async () => {
    if (Platform.OS === "web") {
      const confirmDelete = window.confirm("Você tem certeza que deseja excluir todas as notas?");

      if (confirmDelete) {
        console.log("Limpando notas.");

        await deleteAllNotes();
        router.replace("/(tabs)");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />

      <View style={styles.divider} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <Text style={styles.buttonText}>Limpar notas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  logo: {
    width: 150,
    height: 150,
  },
  versionText: {
    marginTop: 10,
    color: "#A0A0A0",
  },
  divider: {
    marginVertical: 10,
    height: 1,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#ddd",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#26a93f",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
