const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center my-8">
      <nav className="inline-flex -space-x-px">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 border ${currentPage === page ? 'bg-valorant text-valorant-dark' : 'bg-valorant-dark text-valorant'}`}
          >
            {page}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Pagination;
