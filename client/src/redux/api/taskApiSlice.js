import { apiSlice } from "./apiSlice";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (params) => ({
        url: "/task",
        params,
      }),
      providesTags: ["Task"],
    }),
    getTaskDetails: builder.query({
      query: (id) => `/task/${id}`,
      providesTags: (result, error, id) => [{ type: "Task", id }],
    }),
    createTask: builder.mutation({
      query: (data) => ({
        url: "/task/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation({
      query: ({ id, data }) => ({
        url: `/task/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Task", { type: "Task", id }],
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getTasks", { stage: "", isTrashed: false }, (draft) => {
            const task = draft?.tasks?.find((t) => t._id === id);
            if (task) {
              if (data.stage) task.stage = data.stage;
              if (data.title) task.title = data.title;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    trashTask: builder.mutation({
      query: (id) => ({
        url: `/task/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Task"],
    }),
    deleteRestoreTask: builder.mutation({
      query: ({ id, actionType }) => ({
        url: `/task/delete-restore/${id || ""}`,
        method: "DELETE",
        params: { actionType },
      }),
      invalidatesTags: ["Task"],
    }),
    createSubTask: builder.mutation({
      query: ({ id, data }) => ({
        url: `/task/create-subtask/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }],
    }),
    updateSubTaskStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/task/update-subtask-status/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }],
    }),
    postActivity: builder.mutation({
      query: ({ id, data }) => ({
        url: `/task/activity/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }],
    }),
    getDashboardStats: builder.query({
      query: () => "/task/dashboard",
      providesTags: ["Task"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskDetailsQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useTrashTaskMutation,
  useDeleteRestoreTaskMutation,
  useCreateSubTaskMutation,
  useUpdateSubTaskStatusMutation,
  usePostActivityMutation,
  useGetDashboardStatsQuery,
} = taskApiSlice;
