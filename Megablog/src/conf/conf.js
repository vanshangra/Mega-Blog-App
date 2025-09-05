const conf ={
    appwriteURL: String(import.meta.env.VITE_APPWRITE_URL) ,
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID) ,
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID) ,
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID) ,
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    tinymceApiKey: String(import.meta.env.VITE_TINYMCE_API_KEY)
}

// Debug: Check if environment variables are loaded
console.log("Appwrite Config:", {
    URL: conf.appwriteURL,
    ProjectID: conf.appwriteProjectId,
    DatabaseID: conf.appwriteDatabaseId
});

export default conf;