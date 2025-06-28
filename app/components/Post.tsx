import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CommentsModal from "./CommentsModal";


type PostProps = {
  post: {
    _id: Id<"posts">;
    imageUrl: string;
    caption?: string;
    likes: number;
    comments: number;
    _creationTime: number;
    author: {
      _id: Id<"users">;
      username: string;
      _image: string;
      // And put them here if they describe the author
      isLiked: boolean;
      isBookmarked: boolean;
    };
  };
};

export default function Post({ post }: PostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [showComments, setShowComments] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleLike = useMutation(api.post.toggleLike);

  const handleLike = async () => {
    try {
const newIsLiked = await toggleLike({ postId: post ._id }) ;
setIsLiked(newIsLiked);
setLikesCount ( (prev) => (newIsLiked ? prev + 1 : prev - 1));
} catch (error){
console.error("Error toggling like:", error) ;
};
  };

  return (
    <View style={styles.post}>
      {/* POST HEADER */}
      <View style={styles.postHeader}>
        <Link href={"/(tabs)/notifications"}>
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image
              source={post.author._image}
              style={styles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
            <Text style={styles.postUsername}>{post.author.username}</Text>
          </TouchableOpacity>
        </Link>

        {/* todo: fix it later */}
        {/* < TouchableOpacity>
<Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} />
</TouchableOpacity> */}
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      {/* IMAGE */}
      <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* POST ACTIONS */}
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? COLORS.primary : COLORS.white}
              onPress={handleLike}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name={"bookmark-outline"} size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* POST INFO */}
      <View style={styles.postInfo}>
       <Text>
          {likesCount > 0
            ? `${likesCount.toLocaleString()} likes`
            : "Be the first to like"}
        </Text>    
            {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{post.author.username}</Text>
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>
        )}
        <TouchableOpacity onPress={() => setShowComments(true)}>
          <Text style={styles.commentsText}>View all {commentsCount} comments</Text>
        </TouchableOpacity>
        <Text style={styles.timeAgo}>2 hours ago</Text>
      </View>
      <CommentsModal
      postId={post._id}
        visible={showComments}
        onClose={() => setShowComments(false)}
        onCommentAdded={() => {
          setCommentsCount((prev) => prev + 1);
          setShowComments(false);
        }}
      
      />
    </View>
  );
}
