import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { FaEdit, FaTrash } from "react-icons/fa";

const BlogCard = ({ blog, showActions = false }) => {
  const { _id, title, description, image, category, author, createdAt } = blog;
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const imageURL = image?.startsWith("http") ? image : `${baseURL}/uploads/${image}`;

  const isAuthor = user?._id === author?._id;

  const handleDelete = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/api/blogs/${_id}`);
      window.location.reload();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete blog.");
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full min-h-[460px] max-h-[500px]"
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative w-full h-52 md:h-60 xl:h-64 overflow-hidden rounded-t-2xl">
        <img
          src={imageURL}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-blog-image.jpg";
          }}
        />
      </div>

    
      <div className="p-4 flex flex-col justify-between flex-grow">
        <Link to={`/blogs/${_id}`} className="flex flex-col gap-2 mb-4 flex-grow overflow-hidden">
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
            {category?.name || "Uncategorized"}
          </p>

          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-[1.4] min-h-[2.8rem]">
            {title}
          </h3>

          
          <div className="text-sm text-gray-700 line-clamp-3 leading-[1.5] max-h-[4.5rem] overflow-hidden">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </Link>

      
       <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
          <span>{author?.name || "Unknown author"}</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>

    
        {showActions && isAuthor && (
          <div className="mt-4 flex gap-4 text-sm">
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate(`/blogs/${_id}/edit`);
              }}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:underline flex items-center gap-1"
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BlogCard;
