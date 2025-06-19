import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../utils";
import moment from "moment";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const CommentSection = ({ blogId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const { user, accessToken: token } = useSelector((state) => state.auth);


  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/api/blogs/${blogId}/comments`);
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!user || !token) return alert("Login required to comment");

    setPosting(true);
    try {
      await axiosInstance.post(
        `/api/blogs/${blogId}/comments`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setPosting(false);
    }
  };

  const startEdit = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditedText(currentText);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditedText("");
  };

  const saveEdit = async (commentId) => {
    if (!editedText.trim()) return;

    try {
      await axiosInstance.put(
        `/api/blogs/${blogId}/comments/${commentId}`,
        { comment: editedText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingCommentId(null);
      setEditedText("");
      fetchComments();
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };


const getProfilePicture = (profilePicture) => {
  if (!profilePicture) return "/default-profile.png";
  return profilePicture.startsWith("http")
    ? profilePicture
    : `${baseURL}/uploads/${profilePicture}`;
};


  useEffect(() => {
    fetchComments();
  }, [blogId]);

  return (
    <div className="mt-10">
      <h4 className="text-xl font-semibold mb-4 text-gray-800">Comments</h4>

      <form onSubmit={postComment} className="flex gap-3 mb-6">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-400"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          disabled={posting}
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 italic">No comments yet. Be the first!</p>
      ) : (
        <ul className="space-y-5">
          {comments.map((cmt) => {
            const isOwner = user?._id === cmt.user?._id;
            const isEditing = editingCommentId === cmt._id;

            return (
              <li
                key={cmt._id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={getProfilePicture(cmt.user?.profilePicture)}
                    alt={cmt.user?.username || "User"}
                    className="w-10 h-10 rounded-full object-cover border shadow-sm"
                  />
                  <div>
                    <p className="font-medium text-gray-700">
                      {cmt.user?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {moment(cmt.createdAt).fromNow()}
                    </p>
                  </div>
                </div>

                {isEditing ? (
                  <div>
                    <textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="w-full border p-2 rounded text-sm"
                      rows={3}
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => saveEdit(cmt._id)}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-sm bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <p className="text-gray-800">{cmt.comment}</p>
                    {cmt.user && isOwner && (
                      <button
                        onClick={() => startEdit(cmt._id, cmt.comment)}
                        className="text-blue-600 text-sm hover:underline ml-4"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CommentSection;
