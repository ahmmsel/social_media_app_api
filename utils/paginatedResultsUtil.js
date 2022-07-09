async function paginatedResultsUtil({ model, where, limit, page }) {
  let next = {};
  let previous = {};

  let hasNextPage = false;
  let hasPreviousPage = false;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const modelLength = await model.count({where});

  const totalPages = Math.ceil(modelLength / limit);

  if (modelLength > endIndex) {
    next = { page: page + 1, limit };
    hasNextPage = true;
  }
  if (startIndex > 0) {
    previous = { page: page - 1, limit };
    hasPreviousPage = true;
  }

  return {
    results: (data = []) => ({
      pageInformation: {
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        previous,
        next,
      },
      data,
    }),
    startIndex,
  };
}

module.exports = paginatedResultsUtil;
