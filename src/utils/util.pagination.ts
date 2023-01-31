interface IPagination {
  page: number;
  limit: number;
  total: number;
}

export const handelPagination = ({ page, limit, total }: IPagination) => {
  return {
    page,
    total_count: total,
    total_page: Math.ceil(total / limit),
    per_page: total <= limit ? 1 : limit,
  };
};
