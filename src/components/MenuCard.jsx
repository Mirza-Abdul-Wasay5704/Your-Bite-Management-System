import React from 'react';

const MenuCard = ({ dish, onAddToOrder, onEdit, onDelete, isMenuPage = false }) => {
  const defaultImage = 'https://via.placeholder.com/300x200/FFD54F/5D4037?text=Your+Bite';

  return (
    <div className="card overflow-hidden fade-in hover:scale-[1.02] transition-transform">
      <div className="relative">
        <img
          src={dish.imageUrl || defaultImage}
          alt={dish.name}
          className="w-full h-40 sm:h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        {!dish.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white text-base sm:text-lg font-bold">Unavailable</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-primary text-secondary px-2 sm:px-3 py-1 rounded-full font-bold shadow-lg text-sm sm:text-base">
          Rs. {dish.price}
        </div>
      </div>
      
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base sm:text-lg text-secondary truncate">{dish.name}</h3>
            <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block mt-1">
              {dish.category}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-3 sm:mt-4">
          {isMenuPage ? (
            <>
              <button
                onClick={() => onEdit(dish)}
                className="flex-1 bg-blue-500 text-white font-semibold py-2 sm:py-2.5 rounded-lg hover:bg-blue-600 transition-all text-sm sm:text-base active:scale-95"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(dish.id)}
                className="flex-1 bg-red-500 text-white font-semibold py-2 sm:py-2.5 rounded-lg hover:bg-red-600 transition-all text-sm sm:text-base active:scale-95"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={() => onAddToOrder(dish)}
              disabled={!dish.isAvailable}
              className={`w-full font-semibold py-2 sm:py-2.5 rounded-lg transition-all text-sm sm:text-base active:scale-95 ${
                dish.isAvailable
                  ? 'bg-primary text-secondary hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {dish.isAvailable ? 'Add to Order' : 'Unavailable'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
