async function cursorPaginatedUtil({ model, where, limit, cursor }) {
  let hasMore = false;

  const endIndex = cursor * limit;
  const modelLength = await model.count({ where });

  if (modelLength > endIndex) hasMore = true;

  return (data = []) => ({
    hasMore,
    data,
  });
}

module.exports = cursorPaginatedUtil;
