import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BlogCard = ({ blog }) => {
  const { _id, title, description, image, category, author, createdAt } = blog;

  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const imageURL = image?.startsWith("http") ? image : `${baseURL}/uploads/${image}`;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
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

        
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div className="flex flex-col gap-2 mb-4">
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
              {category?.name || "Uncategorized"}
            </p>

            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-[1.4] min-h-[2.8rem]">
              {title}
            </h3>

            <p
              className="text-sm text-gray-700 line-clamp-3 leading-[1.5] min-h-[4rem] overflow-hidden"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-gray-400 mt-auto">
            <span>{author?.name || "Unknown author"}</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
