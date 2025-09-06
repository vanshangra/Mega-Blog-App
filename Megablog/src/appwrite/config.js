import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from 'appwrite';

export class Service{
    client = new Client();
    databases;
    bucket;

    constructor() {
        // Fail fast with a readable error when required environment config is missing.
        if (!conf.appwriteURL || !conf.appwriteProjectId) {
            console.error('Missing Appwrite configuration. Ensure VITE_APPWRITE_URL and VITE_APPWRITE_PROJECT_ID are set.');
            throw new Error('Appwrite configuration missing: VITE_APPWRITE_URL and/or VITE_APPWRITE_PROJECT_ID.');
        }

        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, Content, featuredImage, status, userId}) {
        console.log("createPost called with:", {title, slug, Content, featuredImage, status, userId});
        console.log("Config values:", {
            databaseId: conf.appwriteDatabaseId,
            collectionId: conf.appwriteCollectionId,
        });
        
        try {
            // Use slug as document ID when provided so routes (/post/:slug) can fetch by ID.
            // Fall back to a unique ID when slug is not provided.
            const documentId = slug || ID.unique();

            const result = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId,
                {
                    title,
                    // Do NOT include 'slug' attribute in the document body unless your collection schema defines it.
                    // The collection requires a "Content" attribute (capitalized). Send it as-is.
                    Content,
                    featuredImage,
                    status,
                    userId,
                }
            );

            console.log("createPost result:", result);
            return result;
        } catch (error) {
            console.log("Appwrite Service :: createPost :: error: ", error);
            throw error;
        }
    }

    async updatePost(slug, {title, Content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    // Keep the attribute name consistent with the collection schema
                    Content,
                    featuredImage,
                    status,

                }
            )
        } catch (error) {
            console.log("Appwrite Service :: updatePost :: error: ", error);
            throw error;
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true;

        } catch (error) {
            console.log("Appwrite Service :: deletePost :: error: ", error);
            return false;
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug

            )
        } catch (error) {
            console.log("Appwrite Service :: getPost :: error: ", error);
            
        }
    }

    async getPosts({ publicOnly = false } = {}){
        try {
            // Choose query based on whether we want public-only posts or active posts
            const queries = [
                Query.equal("status", publicOnly ? "public" : "active")
            ];

            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
                100,
                0,
            )
            
        } catch (error) {
            console.log("Appwrite Service :: getPosts :: error: ", error);
            return false;
        }
    }

    //file upload services

    async uploadFile(file){
        console.log("uploadFile called with:", file);
        console.log("Bucket ID:", conf.appwriteBucketId);
        
        try {
            const result = await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
            );
            console.log("uploadFile result:", result);
            return result;
        } catch (error) {
            console.log("Appwrite Service :: uploadFile :: error: ", error);
            throw error;
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId,
            )
            return true;
        } catch (error) {
            console.log("Appwrite Service :: deleteFile :: error: ", error);
            return false;
            
        }
    }

    getFilePreview(fileId){
        // Return a direct file view URL that can be used in <img src="..." /> to render the uploaded file.
        // Use the 'view' endpoint which returns the file content. Include project query param if required by your Appwrite instance.
        const base = conf.appwriteURL.replace(/\/$/, '');
        return `${base}/storage/buckets/${encodeURIComponent(conf.appwriteBucketId)}/files/${encodeURIComponent(fileId)}/view?project=${encodeURIComponent(conf.appwriteProjectId)}`;
    }

    
}

const service =  new Service()
export default service;