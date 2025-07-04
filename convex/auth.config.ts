if(!process.env.CLERK_ISSUE_URL){
    throw new Error("The Clerk Issue URL is not set in the environment variables.")
}

const authConfig = {
    providers: [
      {
        domain: process.env.CLERK_ISSUE_URL,
        // domain: "https://closing-meerkat-54.clerk.accounts.dev",
        applicationID: "convex",
      },
    ]
  };

  export default authConfig