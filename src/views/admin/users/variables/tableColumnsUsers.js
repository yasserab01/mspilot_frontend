export const tableColumnsUsers = [
  {
    Header: "Profile Image",
    accessor: data => data.profile ? data.profile.image : null,
    id: "profileImage", // Adding an ID for columns that use accessor functions is a good practice
  },
  {
    Header: "Username",
    accessor: "username",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Actions",
    accessor: "actions", // this should align with how you manage actions, ensure it is correctly implemented
  },
];
