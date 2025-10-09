export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!credentials.username || !credentials.password) {
      throw new Error("Fill in all the fields");
    }

    if (
      credentials.username === "admin" &&
      credentials.password === "admin"
    ) {
      return {
        success: true,
        requires2FA: true,
        tempToken: "temp_123",
        message: "Requires 2FA",
      };
    }

    throw new Error("Invalid credentials");
  },
};
