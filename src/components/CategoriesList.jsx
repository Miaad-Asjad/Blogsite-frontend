import { Link } from "react-router-dom";

const CategoriesList = ({ categories, onClickCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start my-4">
      {categories.map((category) => (
        <Link
          key={category._id}
          to={`/category/${encodeURIComponent(category.slug)}`}
          onClick={() => onClickCategory?.(category.slug)} 
          className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition text-sm font-medium"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};

export default CategoriesList;


