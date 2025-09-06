const conf = {
    // Do NOT coerce to String() here; if an env var is missing it will be undefined instead of the string 'undefined'.
    appwriteURL: import.meta.env.VITE_APPWRITE_URL ?? null,
    appwriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID ?? null,
    appwriteDatabaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID ?? null,
    appwriteCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID ?? null,
    appwriteBucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID ?? null,
    tinymceApiKey: import.meta.env.VITE_TINYMCE_API_KEY ?? null,
};

// Helpful debug output (do not log secrets in production). Show whether values are present.
console.log("Appwrite Config:", {
    URL: conf.appwriteURL ? '[SET]' : '[MISSING]',
    ProjectID: conf.appwriteProjectId ? '[SET]' : '[MISSING]',
    DatabaseID: conf.appwriteDatabaseId ? '[SET]' : '[MISSING]',
});

export default conf;