import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'

function Home() {
    const [posts, setPosts] = useState([])

    const user = useSelector((state) => state.user?.userData || state.auth?.userData || null);

    useEffect(() => {
        const publicOnly = !user;
        appwriteService.getPosts({ publicOnly }).then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [user])
  
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.length === 0 ? (
                        <div className="p-2 w-full text-center">
                            <h1 className="text-2xl font-bold">No posts yet</h1>
                            <p className="text-sm text-gray-600">{user ? "Create your first post!" : "Sign in to create the first post."}</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.$id} className='p-2 w-1/4'>
                                <PostCard {...post} />
                            </div>
                        ))
                    )}
                </div>
            </Container>
        </div>
    )
}

export default Home