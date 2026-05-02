import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeam: builder.query({
      query: () => "/user/get-team",
      providesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/user/update-role/${id}`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getNotifications: builder.query({
      query: () => "/user/notifications",
      providesTags: ["Notification"],
    }),
    markNotificationRead: builder.mutation({
      query: ({ id, isReadType }) => ({
        url: "/user/read-notification",
        method: "PUT",
        params: { id, isReadType },
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetTeamQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} = userApiSlice;
