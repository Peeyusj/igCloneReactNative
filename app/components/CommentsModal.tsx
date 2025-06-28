import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles"; // Assuming styles are defined here
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react"; // Import React and useState
import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  TextInput, // TextInput was used but not imported
} from "react-native";

// Assuming these components exist in the same directory or are correctly path-aliased
import { Loader } from "./Loader";
import Comment from "./Comment";

type CommentsModalProps = { // Renamed type for clarity (avoiding same name as component)
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
  onCommentAdded: () => void;
};

export default function CommentsModal({
  onClose,
  onCommentAdded,
  postId,
  visible,
}: CommentsModalProps) { // Use the renamed type here
  const [newComment, setNewComment] = useState("");
  const comments = useQuery(api.comments.getComments, { postId }); // Corrected 'api. comments.addComment' to 'api.comments.addComment'
  const addComment = useMutation(api.comments.addComment);

  // This function was empty; kept it as a placeholder for functionality
  const handleAddComment = async () => {
    // Add logic here to actually add the comment
    if (newComment.trim()) {
      try {
        await addComment({
          content: newComment.trim(),
          postId,
        });
        setNewComment(""); // Clear the input
        onCommentAdded(); // Notify parent that a comment was added
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
        // IMPORTANT: KeyboardAvoidingView needs to wrap its children in a <View> or similar
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <View style={{ width: 24 }} />
        </View>

        {comments === undefined ? (
          <Loader />
        ) : (
          <> {/* Use a React Fragment to group siblings */}
            <FlatList
              data={comments}
              keyExtractor={(item) => item._id}
              // Corrected renderItem syntax: from `{ { item } ) =>` to `({ item }) =>`
              renderItem={({ item }) => <Comment comment={item} />}
              contentContainerStyle={styles.commentsList}
            />
            <View style={styles.commentInput}>
              <TextInput
                style={styles.input}
                placeholder="Add a comment..."
                placeholderTextColor={COLORS.grey}
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity onPress={handleAddComment} disabled={!newComment.trim()}>
                <Text
                  style={[styles.postButton, !newComment.trim() && styles.postButtonDisabled]}
                >
                  Post
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}