import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            Content: post?.Content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        console.log("Submit function called with data:", data);
        console.log("User data:", userData);
        
        try {
            if (post) {
                // Update existing post
                const file = data.image && data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file && post?.featuredImage) {
                    // remove old image file
                    appwriteService.deleteFile(post.featuredImage);
                }

                // Build a sanitized payload for update; do not include file input objects or slug.
                const updatePayload = {
                    title: data.title,
                    Content: data.Content,
                    featuredImage: file ? file.$id : post?.featuredImage,
                    status: data.status,
                };

                const dbPost = await appwriteService.updatePost(post.$id, updatePayload);

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                // Create new post
                console.log("Creating new post...");
                
                if (!userData || !userData.$id) {
                    alert("You must be logged in to create a post");
                    return;
                }

                if (!data.image || !data.image[0]) {
                    alert("Please select a featured image");
                    return;
                }

                console.log("Uploading file...");
                const file = await appwriteService.uploadFile(data.image[0]);
                console.log("File uploaded:", file);

                if (file) {
                    const fileId = file.$id;
const postData = {
    title: data.title,
    slug: data.slug,
    Content: data.Content,
    featuredImage: fileId,
    status: data.status,
    userId: userData.$id 
};
                    
                    console.log("Creating post with data:", postData);
                    const dbPost = await appwriteService.createPost(postData);
                    console.log("Post created:", dbPost);

                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    }
                } else {
                    alert("Failed to upload image");
                }
            }
        } catch (error) {
            console.error("Detailed error submitting post:", error);
            alert(`Error submitting post: ${error.message || error}`);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="Content" control={control} defaultValue={getValues("Content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}