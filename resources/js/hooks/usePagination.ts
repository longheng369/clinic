import { useCallback } from 'react';
import { router } from '@inertiajs/react';
import type { GridPaginationModel } from '@mui/x-data-grid';

type Options = {
  route: string;
  search?: string | null;
  extraParams?:
    | Record<string, string | number>
    | ((model: GridPaginationModel) => Record<string, string | number>);
  only?: string[];
};

export function usePagination({
  route,
  search,
  extraParams,
  only,
}: Options) {
  return useCallback(
    (model: GridPaginationModel) => {
      const params: Record<string, string | number> = {
        page: model.page + 1,
      };
      if (search) params.search = search;
      if (extraParams) {
        const extra =
          typeof extraParams === 'function'
            ? extraParams(model)
            : extraParams;
        Object.assign(params, extra);
      }
      router.get(route, params, {
        preserveState: true,
        replace: true,
        ...(only ? { only } : {}),
      });
    },
    [route, search, extraParams, only],
  );
}
