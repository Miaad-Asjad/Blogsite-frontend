import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BlogCard = ({ blog }) => {
  const { _id, title, description, image, category, author, createdAt } = blog;

  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const imageURL = image?.startsWith("http") ? image : `${baseURL}/uploads/${image}`;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
      whileHover={{ scale: 1.02 }}
    >
      <Link to={`/blogs/${_id}`} className="flex flex-col h-full">
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-48 xl:h-56 overflow-hidden rounded-t-2xl">
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

        <div className="p-4 flex flex-col flex-grow">
          <p className="text-xs text-blue-600 font-semibold mb-2 uppercase tracking-wide">
            {category?.name || "Uncategorized"}
          </p>

          <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-900">
            {title}
          </h3>

          <p
            className="text-sm text-gray-700 mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <div className="mt-auto flex justify-between items-center text-xs text-gray-400">
            <span>{author?.name || "Unknown author"}</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
